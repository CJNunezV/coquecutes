import { put } from "@vercel/blob";
import { Resend } from "resend";
import { sql } from "@vercel/postgres";

// Este endpoint recibe el formulario de checkout:
// 1. Sube la captura de pantalla a Vercel Blob (almacenamiento de archivos).
// 2. Guarda el pedido en la base de datos Postgres (tabla "orders").
// 3. Te envía un email con los datos del pedido y el link a la imagen.
//
// Variables de entorno necesarias en Vercel (Project Settings > Environment Variables):
// - BLOB_READ_WRITE_TOKEN   (Vercel te la da al crear un Blob Store, es automático)
// - POSTGRES_URL y relacionadas (Vercel te las da al crear una base de datos Postgres, es automático)
// - RESEND_API_KEY          (creas una cuenta gratis en resend.com)
// - NOTIFY_EMAIL_TO         (tu correo, donde quieres recibir los pedidos)
// - NOTIFY_EMAIL_FROM       (remitente verificado en Resend, ej: pedidos@tudominio.com)

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

    if (!screenshot || typeof screenshot === "string") {
      return Response.json({ error: "Falta la captura de pago" }, { status: 400 });
    }

    // 1. Subir la imagen a Vercel Blob
    const blob = await put(
      `orders/${Date.now()}-${screenshot.name}`,
      screenshot,
      { access: "public" }
    );

    // 2. Guardar el pedido en la base de datos
    let orderId = null;
    try {
      await ensureTable();
      const items = itemsRaw ? JSON.parse(itemsRaw) : [];
      const result = await sql`
        INSERT INTO orders (customer_name, customer_phone, items, total, screenshot_url)
        VALUES (${name}, ${phone}, ${JSON.stringify(items)}, ${total || 0}, ${blob.url})
        RETURNING id;
      `;
      orderId = result.rows[0]?.id ?? null;
    } catch (dbErr) {
      // Si la base de datos no está configurada todavía, no bloqueamos el pedido:
      // el email y la captura ya quedaron guardados igual.
      console.error("Error guardando el pedido en la base de datos:", dbErr);
    }

    // 3. Enviar email de notificación (si configuraste Resend)
    if (process.env.RESEND_API_KEY) {
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
          <p><strong>Captura de pago:</strong> <a href="${blob.url}">${blob.url}</a></p>
        `,
      });
    }

    return Response.json({ ok: true, orderId, screenshotUrl: blob.url });
  } catch (err) {
    console.error("Error procesando pedido:", err);
    return Response.json({ error: "Error interno" }, { status: 500 });
  }
}