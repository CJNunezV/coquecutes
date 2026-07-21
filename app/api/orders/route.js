import { put } from "@vercel/blob";
import { Resend } from "resend";
import { sql } from "@vercel/postgres";

// Este endpoint recibe el formulario de checkout:
// 1. Sube la captura de pantalla a Vercel Blob (almacenamiento de archivos).
// 2. Guarda el pedido en la base de datos Postgres (tabla "orders").
// 3. Crea un registro del pedido en tu base de datos "Pedidos" de Notion.
// 4. Te envía un email con los datos del pedido y el link a la imagen.
//
// Variables de entorno necesarias en Vercel (Project Settings > Environment Variables):
// - BLOB_READ_WRITE_TOKEN         (Vercel te la da al crear un Blob Store, es automático)
// - POSTGRES_URL y relacionadas   (Vercel te las da al crear una base de datos Postgres, es automático)
// - RESEND_API_KEY                (creas una cuenta gratis en resend.com)
// - NOTIFY_EMAIL_TO               (tu correo, donde quieres recibir los pedidos)
// - NOTIFY_EMAIL_FROM             (remitente verificado en Resend, ej: pedidos@tudominio.com)
// - NOTION_API_KEY                (secret de tu integración interna de Notion, ver README paso 8)
// - NOTION_PEDIDOS_DATA_SOURCE_ID (ID de la base "Pedidos" en Notion, ver README paso 8)

// Crea un registro del pedido en la base "Pedidos" de Notion (si está configurado).
// Si falla o no está configurado, no interrumpe el resto del flujo.
async function createNotionOrder({ name, phone, itemsText, quantity, total, screenshotUrl, address }) {
  if (!process.env.NOTION_API_KEY || !process.env.NOTION_PEDIDOS_DATA_SOURCE_ID) {
    console.log("Notion no configurado (falta NOTION_API_KEY o NOTION_PEDIDOS_DATA_SOURCE_ID), se omite.");
    return null;
  }

  try {
    const properties = {
      "Pedido": {
        title: [{ text: { content: `Pedido de ${name}` } }],
      },
      "Cliente": {
        rich_text: [{ text: { content: name } }],
      },
      "Contacto": {
        rich_text: [{ text: { content: phone } }],
      },
      "Detalle del pedido": {
        rich_text: [{ text: { content: itemsText } }],
      },
      "Dirección / Entrega": {
        rich_text: [{ text: { content: address || "-" } }],
      },
      "Cantidad": {
        number: quantity,
      },
      "Precio total": {
        number: Number(total) || 0,
      },
      "Estado del pago": {
        select: { name: "Pendiente" },
      },
      "Estado de envío": {
        select: { name: "Preparando" },
      },
      "Fecha de pedido": {
        date: { start: new Date().toISOString().slice(0, 10) },
      },
    };

    if (screenshotUrl) {
      properties["Captura de pago"] = {
        files: [
          {
            type: "external",
            name: "comprobante.jpg",
            external: { url: screenshotUrl },
          },
        ],
      };
    }

    const res = await fetch("https://api.notion.com/v1/pages", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.NOTION_API_KEY}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        parent: { data_source_id: process.env.NOTION_PEDIDOS_DATA_SOURCE_ID },
        properties,
      }),
    });

    const data = await res.json();
    if (!res.ok) {
      console.error("Error creando el pedido en Notion:", data);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Error conectando con Notion:", err);
    return null;
  }
}

// Crea la tabla la primera vez que se use el endpoint (no hace nada si ya existe).
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS orders (
      id SERIAL PRIMARY KEY,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      items JSONB NOT NULL,
      total NUMERIC NOT NULL,
      screenshot_url TEXT,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `;
}

export async function POST(req) {
  try {
    const formData = await req.formData();

    const producto = formData.get("producto");
    const name = formData.get("name");
    const phone = formData.get("phone");
    const address = formData.get("address");
    const itemsRaw = formData.get("items"); // JSON string con el carrito completo
    const total = formData.get("total");
    const screenshot = formData.get("screenshot");

    if (!name || !phone) {
      return Response.json({ error: "Falta el nombre o el WhatsApp" }, { status: 400 });
    }

    // 1. Subir la imagen a Vercel Blob (si falla, seguimos igual sin foto)
    let screenshotUrl = null;
    if (screenshot && typeof screenshot !== "string") {
      try {
        const blob = await put(
          `orders/${Date.now()}-${screenshot.name}`,
          screenshot,
          { access: "public" }
        );
        screenshotUrl = blob.url;
      } catch (blobErr) {
        console.error("Error subiendo la captura a Blob:", blobErr);
      }
    }

    // 2. Guardar el pedido en la base de datos
    let orderId = null;
    let dbError = null;
    try {
      await ensureTable();
      const items = itemsRaw ? JSON.parse(itemsRaw) : [];
      const result = await sql`
        INSERT INTO orders (customer_name, customer_phone, items, total, screenshot_url)
        VALUES (${name}, ${phone}, ${JSON.stringify(items)}, ${total || 0}, ${screenshotUrl})
        RETURNING id;
      `;
      orderId = result.rows[0]?.id ?? null;
    } catch (err) {
      console.error("Error guardando el pedido en la base de datos:", err);
      dbError = err.message || "No se pudo guardar en la base de datos";
    }

    // 3. Crear el registro del pedido en Notion (base "Pedidos")
    const items = itemsRaw ? JSON.parse(itemsRaw) : [];
    const itemsText = items.map((i) => `${i.name} x${i.quantity}`).join(", ") || producto || "-";
    const quantity = items.reduce((acc, i) => acc + (i.quantity || 0), 0);
    await createNotionOrder({ name, phone, itemsText, quantity, total, screenshotUrl, address });

    // 4. Enviar email de notificación (si configuraste Resend)
    if (process.env.RESEND_API_KEY) {
      try {
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.NOTIFY_EMAIL_FROM || "pedidos@resend.dev",
          to: process.env.NOTIFY_EMAIL_TO,
          subject: `Nuevo pedido: ${producto}`,
          html: `
            <h2>Nuevo pedido en Coquecutes</h2>
            <p><strong>Producto:</strong> ${producto}</p>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>WhatsApp:</strong> ${phone}</p>
            <p><strong>Dirección:</strong> ${address || "-"}</p>
            <p><strong>Total:</strong> PEN ${total || "-"}</p>
            <p><strong>Captura de pago:</strong> ${screenshotUrl ? `<a href="${screenshotUrl}">${screenshotUrl}</a>` : "No adjuntada"}</p>
          `,
        });
      } catch (emailErr) {
        console.error("Error enviando email:", emailErr);
      }
    }

    return Response.json({ ok: true, orderId, screenshotUrl, dbError });
  } catch (err) {
    console.error("Error procesando pedido:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}