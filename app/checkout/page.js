"use client";

import { useState } from "react";
import { products } from "@/data/products";

export default function CheckoutPage() {
  const [selectedSlug, setSelectedSlug] = useState(products[0]?.slug || "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setErrorMsg("Por favor adjunta la captura de tu pago.");
      return;
    }
    setErrorMsg("");
    setStatus("sending");

    try {
      const formData = new FormData();
      formData.append("producto", selectedSlug);
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("address", address);
      formData.append("screenshot", file);

      const res = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al enviar el pedido");

      setStatus("done");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setErrorMsg("Algo salió mal enviando tu pedido. Intenta de nuevo.");
    }
  }

  if (status === "done") {
    return (
      <div style={{ textAlign: "center", padding: "60px 0" }}>
        <h1>¡Gracias por tu compra! 🎉</h1>
        <p style={{ color: "#666" }}>
          Recibimos tu comprobante. Te confirmaremos por WhatsApp en cuanto revisemos el pago.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 24 }}>Finalizar compra</h1>

      <div
        style={{
          background: "#f3e8ff",
          borderRadius: 12,
          padding: 20,
          marginBottom: 28,
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: 8 }}>Datos para el pago</div>
        <div style={{ lineHeight: 1.8 }}>
          Yape / Plin: <strong>999 999 999</strong> (Nombre Apellido)
          <br />
          Transferencia BCP: <strong>000-000000000-0-00</strong>
          <br />
          <span style={{ color: "#555" }}>
            Edita estos datos en app/checkout/page.js con tu número y cuenta real.
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Producto</label>
        <select
          value={selectedSlug}
          onChange={(e) => setSelectedSlug(e.target.value)}
          style={inputStyle}
        >
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name} — {p.currency} {p.price.toFixed(2)}
            </option>
          ))}
        </select>

        <label style={labelStyle}>Nombre completo</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>WhatsApp</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          style={inputStyle}
        />

        <label style={labelStyle}>Dirección de entrega</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          required
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />

        <label style={labelStyle}>Captura de tu pago</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          style={{ marginBottom: 16 }}
        />

        {errorMsg && (
          <div style={{ color: "#c0392b", marginBottom: 16 }}>{errorMsg}</div>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          style={{
            width: "100%",
            background: "#7c3aed",
            color: "#fff",
            padding: "14px",
            borderRadius: 10,
            border: "none",
            fontWeight: 600,
            fontSize: 16,
            cursor: "pointer",
          }}
        >
          {status === "sending" ? "Enviando..." : "Enviar pedido"}
        </button>
      </form>
    </div>
  );
}

const labelStyle = {
  display: "block",
  fontWeight: 600,
  marginBottom: 6,
  marginTop: 16,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 15,
  boxSizing: "border-box",
};
