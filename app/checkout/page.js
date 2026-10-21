"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { getCart, setQuantity, removeItem, clearCart, cartTotal, money } from "../cart";

// WhatsApp de la tienda (código de país + número, sin signos)
const STORE_WHATSAPP_NUMBER = "51962167068";
const PAY = {
  yape: "962167068",
  yapeName: "Christopher Nuñez",
  account: "0823271515816",
  cci: "00308201327151581659",
};

// Reduce la captura antes de subirla (los celulares suben fotos de varios MB y el servidor
// rechaza cuerpos grandes). Si no se puede procesar, se envía el archivo original.
async function shrinkImage(file) {
  try {
    if (!file || !file.type.startsWith("image/")) return file;
    const bmp = await createImageBitmap(file);
    const max = 1600;
    const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const c = document.createElement("canvas");
    c.width = Math.round(bmp.width * scale);
    c.height = Math.round(bmp.height * scale);
    c.getContext("2d").drawImage(bmp, 0, 0, c.width, c.height);
    const blob = await new Promise((r) => c.toBlob(r, "image/jpeg", 0.82));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], (file.name || "comprobante").replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("");
  const [storeName, setStoreName] = useState("");
  const [dni, setDni] = useState("");
  const [shalomLocation, setShalomLocation] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [preview, setPreview] = useState(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending
  const [showErrors, setShowErrors] = useState(false);
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const load = () => setCart(getCart());
    load();
    setReady(true);
    window.addEventListener("cartUpdate", load);
    // Recordar datos del cliente para próximas compras
    try {
      const s = JSON.parse(localStorage.getItem("coquecutes_customer") || "{}");
      if (s.name) setName(s.name);
      if (s.phone) setPhone(s.phone);
    } catch {}
    return () => window.removeEventListener("cartUpdate", load);
  }, []);

  useEffect(() => {
    if (!screenshot) return setPreview(null);
    const url = URL.createObjectURL(screenshot);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [screenshot]);

  const total = cartTotal(cart);
  const phoneDigits = phone.replace(/\D/g, "");

  // Errores por campo (clave = id del campo en pantalla)
  const errors = {};
  if (!name.trim()) errors.name = "Escribe tu nombre completo";
  if (phoneDigits.length < 9) errors.phone = "Escribe un WhatsApp válido de 9 dígitos";
  if (!deliveryMethod) errors.delivery = "Elige cómo quieres recibir tu pedido";
  else if (deliveryMethod === "fullmarket" && !storeName.trim()) errors.store = "Indica en qué tienda dejamos tu pedido";
  else if (deliveryMethod === "shalom" && !/^\d{8}$/.test(dni.trim())) errors.dni = "El DNI tiene 8 números";
  else if (deliveryMethod === "shalom" && !shalomLocation.trim()) errors.agency = "Indica la agencia donde recogerás";
  if (!screenshot) errors.proof = "Sube la captura de tu pago";
  if (!acceptedTerms) errors.terms = "Debes aceptar los Términos y Condiciones";
  const errorKeys = Object.keys(errors);
  const err = (k) => (showErrors && errors[k] ? errors[k] : null);

  const deliveryText = () => {
    if (deliveryMethod === "fullmarket") return `Recojo en FullMarket / Arenales — Tienda: ${storeName}`;
    if (deliveryMethod === "shalom") return `Envío por agencia Shalom/Olva (fuera de Lima) — DNI: ${dni} — Agencia: ${shalomLocation}`;
    if (deliveryMethod === "motorizado") return "Envío con motorizado — Punto de entrega a coordinar por WhatsApp";
    return "";
  };

  const copy = async (key, text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = document.createElement("textarea");
      t.value = text;
      document.body.appendChild(t);
      t.select();
      try { document.execCommand("copy"); } catch {}
      t.remove();
    }
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? "" : c)), 1500);
  };

  const onFile = async (file) => {
    if (!file) return;
    setScreenshot(await shrinkImage(file));
  };

  const submit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (errorKeys.length) {
      setShowErrors(true);
      const first = document.getElementById(`ck-${errorKeys[0]}`);
      if (first) {
        first.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = first.querySelector("input,textarea");
        if (input && input.type !== "file") setTimeout(() => input.focus({ preventScroll: true }), 350);
      }
      return;
    }

    setStatus("sending");
    const snapshot = { items: cart.map((i) => ({ ...i })), total, name, delivery: deliveryText() };
    try {
      const fd = new FormData();
      fd.append("producto", cart.map((i) => `${i.name} x${i.quantity}`).join(", "));
      fd.append("name", name.trim());
      fd.append("phone", phoneDigits);
      fd.append("items", JSON.stringify(cart.map(({ id, name, price, quantity }) => ({ id, name, price, quantity }))));
      fd.append("total", total.toFixed(2));
      fd.append("screenshot", screenshot);
      fd.append("deliveryMethod", deliveryMethod);
      fd.append("address", deliveryText());

      const res = await fetch("/api/orders", { method: "POST", body: fd });
      let data = {};
      try { data = await res.json(); } catch {}
      if (!res.ok) throw new Error(data.error || "No se pudo guardar el pedido");

      try { localStorage.setItem("coquecutes_customer", JSON.stringify({ name: name.trim(), phone: phoneDigits })); } catch {}
      clearCart();
      setConfirmedOrder({ ...snapshot, id: data.orderId || null });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (ex) {
      console.error(ex);
      setServerError(
        "No pudimos guardar tu pedido (puede ser tu conexión o el tamaño de la captura). Tus datos siguen aquí: inténtalo otra vez o escríbenos por WhatsApp."
      );
    } finally {
      setStatus("idle");
    }
  };

  const waMessage = (o) =>
    `Hola! Acabo de hacer mi pedido${o.id ? ` N.º ${o.id}` : ""} en Coquecutes 🙌\n\n` +
    o.items.map((i) => `• ${i.name} x${i.quantity} — ${money(i.price * i.quantity)}`).join("\n") +
    `\n\nTotal pagado: ${money(o.total)}\nNombre: ${o.name}\nEntrega: ${o.delivery}\n\nYa subí mi comprobante de pago en la web. ¿Me confirman por favor?`;

  /* ---------------- Pedido confirmado ---------------- */
  if (confirmedOrder) {
    const o = confirmedOrder;
    return (
      <div style={{ maxWidth: 560, margin: "0 auto", background: "#fff", border: "1px solid #f1f5f9", borderRadius: 28, padding: "36px 22px", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#ecfdf5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
          <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 800, color: "#1e1b4b", margin: "0 0 8px" }}>¡Pedido recibido! 🎉</h2>
        <p style={{ color: "#6b7280", margin: "0 0 6px", lineHeight: 1.6 }}>Gracias{o.name ? `, ${o.name.split(" ")[0]}` : ""}. Guardamos tu pedido y tu comprobante.</p>
        {o.id && <p style={{ display: "inline-block", fontWeight: 700, fontSize: 13, color: "#7c3aed", background: "#f5f3ff", padding: "6px 14px", borderRadius: 20, margin: "8px 0" }}>Pedido N.º {o.id}</p>}

        <div style={{ textAlign: "left", background: "#fafafa", border: "1px solid #f3f4f6", borderRadius: 18, padding: 16, margin: "18px 0" }}>
          {o.items.map((i) => (
            <div key={i.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", fontSize: 14, color: "#374151" }}>
              <span>{i.name} <b>×{i.quantity}</b></span>
              <span style={{ fontWeight: 700 }}>{money(i.price * i.quantity)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #e5e7eb", marginTop: 8, paddingTop: 10, fontWeight: 800, color: "#1e1b4b" }}>
            <span>Total pagado</span><span style={{ color: "#7c3aed" }}>{money(o.total)}</span>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 13, color: "#6b7280" }}>📦 {o.delivery}</p>
        </div>

        <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 18, padding: 16, marginBottom: 18 }}>
          <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#14532d" }}>Último paso: avísanos por WhatsApp</p>
          <p style={{ margin: "0 0 12px", fontSize: 13, color: "#166534" }}>Así confirmamos tu pago más rápido y coordinamos la entrega.</p>
          <a
            href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(waMessage(o))}`}
            target="_blank" rel="noopener noreferrer"
            style={{ display: "block", background: "#25D366", color: "#fff", padding: 15, borderRadius: 14, fontWeight: 800, textDecoration: "none", fontSize: 16 }}
          >
            Enviar mensaje por WhatsApp
          </a>
        </div>
        <Link href="/catalogo" style={{ color: "#7c3aed", fontWeight: 700, textDecoration: "none" }}>← Seguir viendo la tienda</Link>
      </div>
    );
  }

  if (!ready) return null;

  /* ---------------- Carrito vacío ---------------- */
  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 48 }}>🛒</div>
        <h2 style={{ fontSize: 24, color: "#1e1b4b", margin: "8px 0 8px" }}>Tu carrito está vacío</h2>
        <p style={{ color: "#6b7280", marginBottom: 24 }}>Agrega algún producto para continuar con tu compra.</p>
        <Link href="/catalogo" style={{ background: "#7c3aed", color: "#fff", padding: "13px 26px", borderRadius: 16, textDecoration: "none", fontWeight: 700 }}>Ver catálogo</Link>
      </div>
    );
  }

  /* ---------------- Formulario ---------------- */
  return (
    <div style={{ maxWidth: 1080, margin: "0 auto" }}>
      <style>{`
        .ck-grid{display:grid;grid-template-columns:minmax(0,370px) minmax(0,1fr);gap:28px;align-items:start}
        .ck-sum{position:sticky;top:96px}
        .ck-card{background:#fff;border:1px solid #f1f5f9;border-radius:24px;padding:22px;box-shadow:0 6px 24px rgba(76,29,149,.04)}
        .ck-h{display:flex;align-items:center;gap:10px;margin:0 0 16px;font-size:18px;font-weight:800;color:#1e1b4b}
        .ck-n{width:28px;height:28px;border-radius:50%;background:#7c3aed;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0}
        .ck-in{width:100%;padding:14px 16px;border-radius:12px;border:1.5px solid #d1d5db;font-size:16px;background:#fff;outline:none;font-family:inherit;transition:border-color .15s,box-shadow .15s}
        .ck-in:focus{border-color:#7c3aed;box-shadow:0 0 0 3px rgba(124,58,237,.15)}
        .ck-in.bad{border-color:#ef4444}
        .ck-lbl{display:block;font-size:14px;font-weight:700;color:#4b5563;margin-bottom:6px}
        .ck-err{color:#dc2626;font-size:13px;font-weight:600;margin:6px 0 0}
        .ck-opt{display:flex;align-items:flex-start;gap:10px;padding:13px 14px;border-radius:12px;border:1.5px solid #d1d5db;cursor:pointer;background:#fff}
        .ck-opt.on{border-color:#7c3aed;background:#f5f3ff}
        .ck-copy{border:1px solid #ddd6fe;background:#fff;color:#6d28d9;border-radius:10px;padding:7px 12px;font-weight:700;font-size:12px;cursor:pointer;white-space:nowrap;font-family:inherit}
        .ck-copy.ok{background:#16a34a;color:#fff;border-color:#16a34a}
        .ck-q{width:30px;height:30px;border-radius:8px;border:none;background:#ede9fe;color:#5b21b6;font-weight:800;cursor:pointer;font-size:16px}
        @media (max-width:860px){.ck-grid{grid-template-columns:1fr}.ck-sum{position:static}.ck-card{padding:18px}}
      `}</style>

      <h1 style={{ fontSize: 28, fontWeight: 800, color: "#1e1b4b", margin: "0 0 6px" }}>Finalizar compra</h1>
      <p style={{ margin: "0 0 22px", color: "#6b7280", fontSize: 14 }}>Son 3 pasos: revisa tu pedido, completa tus datos y paga con Yape, Plin o transferencia.</p>

      <form onSubmit={submit} noValidate className="ck-grid">
        {/* 1. PEDIDO */}
        <div className="ck-sum ck-card">
          <h2 className="ck-h"><span className="ck-n">1</span> Tu pedido</h2>
          <div>
            {cart.map((it) => (
              <div key={it.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6" }}>
                <div style={{ width: 64, height: 64, borderRadius: 12, background: "#f5f3ff", overflow: "hidden", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
                  {it.image ? <img src={it.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "🃏"}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1f2937", lineHeight: 1.3 }}>{it.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, gap: 8 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <button type="button" className="ck-q" aria-label={`Quitar una unidad de ${it.name}`} onClick={() => setQuantity(it.id, it.quantity - 1)}>−</button>
                      <b style={{ minWidth: 16, textAlign: "center" }}>{it.quantity}</b>
                      <button type="button" className="ck-q" aria-label={`Añadir una unidad de ${it.name}`} onClick={() => setQuantity(it.id, it.quantity + 1)}>+</button>
                    </div>
                    <b style={{ color: "#7c3aed" }}>{money(it.price * it.quantity)}</b>
                  </div>
                </div>
                <button type="button" onClick={() => removeItem(it.id)} aria-label={`Quitar ${it.name}`} title="Quitar" style={{ alignSelf: "flex-start", border: "none", background: "none", cursor: "pointer", color: "#9ca3af", fontSize: 16 }}>🗑</button>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 16 }}>
            <span style={{ fontWeight: 700, color: "#4b5563" }}>Total a pagar</span>
            <span style={{ fontSize: 26, fontWeight: 900, color: "#7c3aed" }}>{money(total)}</span>
          </div>
          <Link href="/catalogo" style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 700, color: "#7c3aed", textDecoration: "none" }}>+ Agregar más productos</Link>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 22, minWidth: 0 }}>
          {/* 2. DATOS Y ENTREGA */}
          <div className="ck-card">
            <h2 className="ck-h"><span className="ck-n">2</span> Tus datos y entrega</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div id="ck-name">
                <label className="ck-lbl" htmlFor="f-name">Nombre completo</label>
                <input id="f-name" className={`ck-in ${err("name") ? "bad" : ""}`} autoComplete="name" placeholder="Ej. Juan Pérez" value={name} onChange={(e) => setName(e.target.value)} />
                {err("name") && <p className="ck-err">{err("name")}</p>}
              </div>
              <div id="ck-phone">
                <label className="ck-lbl" htmlFor="f-phone">WhatsApp</label>
                <input id="f-phone" className={`ck-in ${err("phone") ? "bad" : ""}`} type="tel" inputMode="numeric" autoComplete="tel" placeholder="Ej. 987654321" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {err("phone") ? <p className="ck-err">{err("phone")}</p> : <p style={{ margin: "6px 0 0", fontSize: 12, color: "#9ca3af" }}>Te escribiremos a este número para confirmar tu pedido.</p>}
              </div>

              <div id="ck-delivery">
                <span className="ck-lbl">¿Cómo quieres recibirlo?</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <label className={`ck-opt ${deliveryMethod === "fullmarket" ? "on" : ""}`}>
                    <input type="radio" name="dm" checked={deliveryMethod === "fullmarket"} onChange={() => setDeliveryMethod("fullmarket")} style={{ marginTop: 3, accentColor: "#7c3aed" }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>Recojo en FullMarket / Arenales</span>
                  </label>
                  {deliveryMethod === "fullmarket" && (
                    <div id="ck-store" style={{ marginLeft: 6 }}>
                      <input className={`ck-in ${err("store") ? "bad" : ""}`} placeholder="¿En qué tienda dejamos tu pedido?" value={storeName} onChange={(e) => setStoreName(e.target.value)} aria-label="Tienda" />
                      {err("store") && <p className="ck-err">{err("store")}</p>}
                    </div>
                  )}

                  <label className={`ck-opt ${deliveryMethod === "shalom" ? "on" : ""}`}>
                    <input type="radio" name="dm" checked={deliveryMethod === "shalom"} onChange={() => setDeliveryMethod("shalom")} style={{ marginTop: 3, accentColor: "#7c3aed" }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>Envío por agencia Shalom/Olva <span style={{ color: "#9ca3af", fontWeight: 500 }}>— solo pedidos fuera de Lima</span></span>
                  </label>
                  {deliveryMethod === "shalom" && (
                    <div style={{ marginLeft: 6, display: "flex", flexDirection: "column", gap: 10 }}>
                      <div id="ck-dni">
                        <input className={`ck-in ${err("dni") ? "bad" : ""}`} inputMode="numeric" maxLength={8} placeholder="Número de DNI" value={dni} onChange={(e) => setDni(e.target.value.replace(/\D/g, ""))} aria-label="DNI" />
                        {err("dni") && <p className="ck-err">{err("dni")}</p>}
                      </div>
                      <div id="ck-agency">
                        <input className={`ck-in ${err("agency") ? "bad" : ""}`} placeholder="Agencia donde recogerás (ciudad y sede)" value={shalomLocation} onChange={(e) => setShalomLocation(e.target.value)} aria-label="Agencia" />
                        {err("agency") && <p className="ck-err">{err("agency")}</p>}
                      </div>
                    </div>
                  )}

                  <label className={`ck-opt ${deliveryMethod === "motorizado" ? "on" : ""}`}>
                    <input type="radio" name="dm" checked={deliveryMethod === "motorizado"} onChange={() => setDeliveryMethod("motorizado")} style={{ marginTop: 3, accentColor: "#7c3aed" }} />
                    <span style={{ fontWeight: 700, fontSize: 14, color: "#374151" }}>Envío con motorizado <span style={{ color: "#9ca3af", fontWeight: 500 }}>— coordinamos el punto de entrega por WhatsApp</span></span>
                  </label>
                </div>
                {err("delivery") && <p className="ck-err">{err("delivery")}</p>}
              </div>
            </div>
          </div>

          {/* 3. PAGO */}
          <div className="ck-card">
            <h2 className="ck-h"><span className="ck-n">3</span> Paga y sube tu comprobante</h2>
            <div style={{ background: "#f5f3ff", border: "1px dashed #c084fc", borderRadius: 18, padding: 16 }}>
              <p style={{ margin: "0 0 12px", color: "#4c1d95", fontSize: 15 }}>Monto a pagar: <b style={{ fontSize: 22, color: "#7c3aed" }}>{money(total)}</b></p>
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start", flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 240px", minWidth: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                  {[
                    { k: "yape", label: `Yape / Plin — ${PAY.yapeName}`, v: PAY.yape },
                    { k: "acc", label: "Cuenta Simple Soles Interbank", v: PAY.account },
                    { k: "cci", label: "CCI Interbank", v: PAY.cci },
                  ].map((r) => (
                    <div key={r.k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 12, color: "#6d28d9", fontWeight: 600 }}>{r.label}</div>
                        <div style={{ fontWeight: 800, color: "#1e1b4b", letterSpacing: 0.3, wordBreak: "break-all" }}>{r.v}</div>
                      </div>
                      <button type="button" className={`ck-copy ${copied === r.k ? "ok" : ""}`} onClick={() => copy(r.k, r.v)}>{copied === r.k ? "¡Copiado!" : "Copiar"}</button>
                    </div>
                  ))}
                </div>
                <a href="/qr.jpg" target="_blank" rel="noopener noreferrer" title="Toca para ampliar el QR" style={{ width: 120, height: 120, borderRadius: 14, background: "#fff", border: "1px solid #e9d5ff", overflow: "hidden", flexShrink: 0, margin: "0 auto" }}>
                  <img src="/qr.jpg" alt="QR para pagar con Yape" style={{ width: "100%", height: "100%", objectFit: "cover", padding: 5 }} />
                </a>
              </div>
              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#7c3aed" }}>💡 Paga desde tu app, toma captura del comprobante y súbela aquí abajo.</p>
            </div>

            <div id="ck-proof" style={{ marginTop: 18 }}>
              <span className="ck-lbl">Captura de tu pago (Yape / Plin / voucher)</span>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => onFile(e.target.files && e.target.files[0])} />
              <button type="button" onClick={() => fileRef.current && fileRef.current.click()}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 14, padding: 14, borderRadius: 14, cursor: "pointer", fontFamily: "inherit", textAlign: "left", background: screenshot ? "#f0fdf4" : "#fff", border: `2px dashed ${err("proof") ? "#ef4444" : screenshot ? "#86efac" : "#c4b5fd"}` }}>
                {preview ? <img src={preview} alt="Vista previa del comprobante" style={{ width: 56, height: 56, objectFit: "cover", borderRadius: 10 }} /> : <span style={{ fontSize: 30 }}>📎</span>}
                <span>
                  <b style={{ display: "block", color: "#374151", fontSize: 15 }}>{screenshot ? "Comprobante listo ✓" : "Toca para subir la captura"}</b>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{screenshot ? "Toca para cambiarla" : "Desde tu galería o tomando una foto"}</span>
                </span>
              </button>
              {err("proof") && <p className="ck-err">{err("proof")}</p>}
            </div>

            <div id="ck-terms" style={{ marginTop: 18 }}>
              <label style={{ display: "flex", gap: 10, alignItems: "flex-start", background: "#faf5ff", border: `1px solid ${err("terms") ? "#ef4444" : "#e9d5ff"}`, borderRadius: 12, padding: "12px 14px", cursor: "pointer" }}>
                <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} style={{ marginTop: 3, width: 18, height: 18, accentColor: "#7c3aed", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#4b5563", lineHeight: 1.5 }}>
                  He leído y acepto los <Link href="/terminos" target="_blank" style={{ color: "#7c3aed", fontWeight: 700 }}>Términos y Condiciones</Link> de compra.
                </span>
              </label>
              {err("terms") && <p className="ck-err">{err("terms")}</p>}
            </div>

            {serverError && (
              <div role="alert" style={{ marginTop: 16, background: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", borderRadius: 12, padding: "12px 14px", fontSize: 13, lineHeight: 1.5 }}>
                {serverError}{" "}
                <a href={`https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola! Tuve un problema al enviar mi pedido en la web. ¿Me ayudan?")}`} target="_blank" rel="noopener noreferrer" style={{ color: "#991b1b", fontWeight: 700 }}>Escribir por WhatsApp</a>
              </div>
            )}

            {showErrors && errorKeys.length > 0 && (
              <p className="ck-err" style={{ marginTop: 14, textAlign: "center" }}>Faltan {errorKeys.length} dato{errorKeys.length > 1 ? "s" : ""} por completar (están marcados arriba).</p>
            )}

            <button type="submit" disabled={status === "sending"}
              style={{ width: "100%", marginTop: 16, background: "#7c3aed", color: "#fff", border: "none", borderRadius: 16, padding: 17, fontSize: 17, fontWeight: 800, cursor: status === "sending" ? "wait" : "pointer", opacity: status === "sending" ? 0.7 : 1, boxShadow: "0 8px 20px rgba(124,58,237,.3)", fontFamily: "inherit" }}>
              {status === "sending" ? "Enviando tu pedido…" : `Confirmar pedido · ${money(total)}`}
            </button>
            <p style={{ margin: "10px 0 0", textAlign: "center", fontSize: 12, color: "#9ca3af" }}>Al confirmar guardamos tu pedido y te pediremos avisarnos por WhatsApp.</p>
          </div>
        </div>
      </form>
    </div>
  );
}
