"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

// Número de WhatsApp de la tienda (con código de país, sin espacios ni signos).
// Ejemplo Perú: "51987654321". Reemplázalo por el número real de tu negocio.
const STORE_WHATSAPP_NUMBER = "51999999999";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [screenshot, setScreenshot] = useState(null);
  const [status, setStatus] = useState("idle"); // idle | sending | error
  const [confirmedOrder, setConfirmedOrder] = useState(null); // { id, name } cuando el pedido se guardó

  // Datos de entrega
  const [deliveryMethod, setDeliveryMethod] = useState(""); // "fullmarket" | "shalom" | "motorizado"
  const [storeName, setStoreName] = useState(""); // Tienda de FullMarket/Arenales
  const [dni, setDni] = useState(""); // DNI para envíos por Shalom
  const [shalomLocation, setShalomLocation] = useState(""); // Agencia Shalom donde recoger

  useEffect(() => {
    const savedCart = localStorage.getItem("coquecutes_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem("coquecutes_cart", JSON.stringify(newCart));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const changeQuantity = (id, delta) => {
    const updated = cart.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + delta;
        return newQty > 0 ? { ...item, quantity: newQty } : null;
      }
      return item;
    }).filter(Boolean);
    updateCart(updated);
  };

  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const buildDeliveryText = () => {
    if (deliveryMethod === "fullmarket") {
      return `Recojo en FullMarket/Arenales - Tienda: ${storeName}`;
    }
    if (deliveryMethod === "shalom") {
      return `Envío por Shalom (fuera de Lima) - DNI: ${dni} - Agencia: ${shalomLocation}`;
    }
    if (deliveryMethod === "motorizado") {
      return `Envío por motorizado - A coordinar por WhatsApp`;
    }
    return "";
  };

  const buildWhatsAppMessage = () => {
    const lines = cart.map(
      (item) => `- ${item.name} x${item.quantity} (PEN ${(item.price * item.quantity).toFixed(2)})`
    );
    return (
      `Hola! Quiero confirmar mi pedido:\n\n` +
      lines.join("\n") +
      `\n\nTotal: PEN ${totalPrice.toFixed(2)}` +
      `\n\nNombre: ${name}` +
      `\nWhatsApp: ${phone}` +
      `\nEntrega: ${buildDeliveryText()}`
    );
  };

  const handleConfirmOrder = async (e) => {
    e.preventDefault();

    if (!name || !phone || !screenshot) {
      alert("Completa tu nombre, WhatsApp y sube el comprobante de pago.");
      return;
    }

    if (!deliveryMethod) {
      alert("Selecciona un lugar de entrega.");
      return;
    }

    if (deliveryMethod === "fullmarket" && !storeName) {
      alert("Indica la tienda de FullMarket/Arenales donde dejarías el pedido.");
      return;
    }

    if (deliveryMethod === "shalom" && (!dni || !shalomLocation)) {
      alert("Completa tu DNI y la agencia Shalom donde recogerías el pedido.");
      return;
    }

    setStatus("sending");

    try {
      const formData = new FormData();
      formData.append("producto", cart.map((i) => `${i.name} x${i.quantity}`).join(", "));
      formData.append("name", name);
      formData.append("phone", phone);
      formData.append("items", JSON.stringify(cart));
      formData.append("total", totalPrice.toFixed(2));
      formData.append("screenshot", screenshot);
      formData.append("deliveryMethod", deliveryMethod);
      formData.append("address", buildDeliveryText());

      const res = await fetch("/api/orders", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo guardar el pedido");
      }

      // Paso 1: por ahora solo confirmamos que se guardó. La apertura de
      // WhatsApp la agregamos en el siguiente paso.
      console.log("Pedido guardado:", data);

      // Vaciar el carrito
      localStorage.removeItem("coquecutes_cart");
      window.dispatchEvent(new Event("cartUpdate"));
      setCart([]);
      setStatus("idle");
      setConfirmedOrder({ id: data.orderId, name, delivery: buildDeliveryText() });
    } catch (err) {
      console.error(err);
      setStatus("error");
      alert("Hubo un problema al guardar tu pedido. Intenta de nuevo.");
    }
  };

  if (confirmedOrder) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "60px 24px",
          background: "#ffffff",
          borderRadius: "32px",
          border: "1px solid #f1f5f9",
          maxWidth: "480px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            width: "72px",
            height: "72px",
            borderRadius: "50%",
            backgroundColor: "#f5f3ff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px auto",
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#1e1b4b", margin: "0 0 8px 0" }}>
          ¡Pedido confirmado! 🎉
        </h2>
        <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 4px 0", lineHeight: "1.6" }}>
          Gracias{confirmedOrder.name ? `, ${confirmedOrder.name}` : ""}. Ya guardamos tu pedido y tu comprobante de pago.
        </p>
        {confirmedOrder.id && (
          <p
            style={{
              display: "inline-block",
              fontSize: "13px",
              fontWeight: "700",
              color: "#7c3aed",
              backgroundColor: "#f5f3ff",
              padding: "6px 14px",
              borderRadius: "20px",
              margin: "12px 0 12px 0",
            }}
          >
            Pedido N.º {confirmedOrder.id}
          </p>
        )}
        {confirmedOrder.delivery && (
          <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 24px 0" }}>
            📦 {confirmedOrder.delivery}
          </p>
        )}
        <p style={{ fontSize: "14px", color: "#9ca3af", margin: "0 0 28px 0", lineHeight: "1.6" }}>
          Te vamos a contactar por WhatsApp para confirmar el pago y coordinar el envío.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            backgroundColor: "#7c3aed",
            color: "#fff",
            padding: "14px 28px",
            borderRadius: "16px",
            textDecoration: "none",
            fontWeight: "700",
            fontSize: "15px",
            boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
          }}
        >
          Volver a la tienda
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h2 style={{ fontSize: "24px", color: "#1e1b4b", marginBottom: "12px" }}>Tu carrito está vacío 😢</h2>
        <p style={{ color: "#6b7280", marginBottom: "24px" }}>Agrega algunos marcos premium en el catálogo para continuar.</p>
        <Link href="/" style={{ backgroundColor: "#7c3aed", color: "#fff", padding: "12px 24px", borderRadius: "20px", textDecoration: "none", fontWeight: "700" }}>
          Volver a la tienda
        </Link>
      </div>
    );
  }

  return (
    <div style={{ background: "#ffffff", borderRadius: "32px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.02)", border: "1px solid #f1f5f9" }}>
      <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b", marginBottom: "32px" }}>Finalizar compra</h2>
      
      {/* CONTENIDO PRINCIPAL EN DOS COLUMNAS */}
      <form onSubmit={handleConfirmOrder} style={{ 
        display: "flex", 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: "40px", 
        alignItems: "flex-start" 
      }}>
        
        {/* COLUMNA IZQUIERDA: "TUS PRODUCTOS" (ESTÁTICA / STICKY) */}
        <div style={{ 
          flex: "1 1 350px", 
          position: "sticky", 
          top: "100px", 
          backgroundColor: "#fafafa",
          padding: "24px",
          borderRadius: "24px",
          border: "1px solid #f3f4f6"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px" }}>Tus Productos</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {cart.map((item) => (
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifycontent: "space-between", padding: "12px 14px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
                <div style={{ flex: 1, marginRight: "10px" }}>
                  <p style={{ margin: "0", fontWeight: "700", color: "#374151", fontSize: "14px" }}>{item.name}</p>
                  <p style={{ margin: "4px 0 0 0", color: "#7c3aed", fontSize: "13px", fontWeight: "600" }}>PEN {item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button type="button" onClick={() => changeQuantity(item.id, -1)} style={qtyBtnStyle}>-</button>
                  <span style={{ fontWeight: "700", fontSize: "14px" }}>{item.quantity}</span>
                  <button type="button" onClick={() => changeQuantity(item.id, 1)} style={qtyBtnStyle}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "2px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#4b5563" }}>Total a pagar:</span>
            <span style={{ fontSize: "24px", fontWeight: "900", color: "#7c3aed" }}>PEN {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* COLUMNA DERECHA: FINALIZAR COMPRA (PAGO + ENVÍO) */}
        <div style={{ flex: "1.2 1 400px", display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* BLOQUE DE PAGO REUBICADO AQUÍ (ORIENTADO A LA DERECHA) */}
          <div style={{ 
            backgroundColor: "#f5f3ff", 
            padding: "24px", 
            borderRadius: "24px", 
            border: "1px dashed #c084fc",
            display: "flex",
            gap: "20px",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 12px 0", color: "#6b21a8", fontSize: "16px", fontWeight: "700" }}>Datos para el pago</h4>
              <p style={{ margin: "6px 0", color: "#4c1d95", fontSize: "14px" }}><strong>Yape / Plin:</strong> 999 999 999 (Coquecutes Store)</p>
              <p style={{ margin: "6px 0", color: "#4c1d95", fontSize: "14px" }}><strong>Transferencia BCP:</strong> 191-XXXXXXXX-X-XX</p>
              <p style={{ margin: "12px 0 0 0", color: "#7c3aed", fontSize: "12px", fontStyle: "italic" }}>💡 Escanea para pagar directamente desde tu app bancaria.</p>
            </div>
            
            <div style={{ 
              width: "110px", 
              height: "110px", 
              backgroundColor: "#ffffff", 
              borderRadius: "16px", 
              border: "1px solid #e9d5ff",
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
              flexShrink: 0
            }}>
              <img 
                src="/qr.jpg" 
                alt="Código QR de Pago" 
                style={{ width: "100%", height: "100%", objectFit: "cover", padding: "6px" }} 
              />
            </div>
          </div>

          {/* FORMULARIO DE ENVÍO */}
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", margin: "0 0 4px 0" }}>Datos de Envío</h3>
            
            <div>
              <label style={lblStyle}>Nombre completo</label>
              <input
                type="text"
                placeholder="Ej. Juan Pérez"
                style={inStyle}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div>
              <label style={lblStyle}>WhatsApp</label>
              <input
                type="tel"
                placeholder="Ej. 987654321"
                style={inStyle}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>

            {/* LUGAR DE ENTREGA */}
            <div>
              <label style={lblStyle}>Lugar de entrega</label>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>

                {/* Opción 1: FullMarket / Arenales */}
                <label
                  style={{
                    ...deliveryOptionStyle,
                    borderColor: deliveryMethod === "fullmarket" ? "#7c3aed" : "#d1d5db",
                    backgroundColor: deliveryMethod === "fullmarket" ? "#f5f3ff" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="fullmarket"
                    checked={deliveryMethod === "fullmarket"}
                    onChange={() => setDeliveryMethod("fullmarket")}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>
                    FullMarket / Arenales
                  </span>
                </label>
                {deliveryMethod === "fullmarket" && (
                  <input
                    type="text"
                    placeholder="¿En qué tienda dejarías el pedido?"
                    style={{ ...inStyle, marginLeft: "8px" }}
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    required
                  />
                )}

                {/* Opción 2: Shalom (solo fuera de Lima) */}
                <label
                  style={{
                    ...deliveryOptionStyle,
                    borderColor: deliveryMethod === "shalom" ? "#7c3aed" : "#d1d5db",
                    backgroundColor: deliveryMethod === "shalom" ? "#f5f3ff" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="shalom"
                    checked={deliveryMethod === "shalom"}
                    onChange={() => setDeliveryMethod("shalom")}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>
                    Shalom <span style={{ color: "#9ca3af", fontWeight: "500" }}>(solo para fuera de Lima)</span>
                  </span>
                </label>
                {deliveryMethod === "shalom" && (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginLeft: "8px" }}>
                    <input
                      type="text"
                      placeholder="Tu DNI"
                      style={inStyle}
                      value={dni}
                      onChange={(e) => setDni(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="¿En qué agencia Shalom recogerías el pedido?"
                      style={inStyle}
                      value={shalomLocation}
                      onChange={(e) => setShalomLocation(e.target.value)}
                      required
                    />
                  </div>
                )}

                {/* Opción 3: Motorizado */}
                <label
                  style={{
                    ...deliveryOptionStyle,
                    borderColor: deliveryMethod === "motorizado" ? "#7c3aed" : "#d1d5db",
                    backgroundColor: deliveryMethod === "motorizado" ? "#f5f3ff" : "#fff",
                  }}
                >
                  <input
                    type="radio"
                    name="deliveryMethod"
                    value="motorizado"
                    checked={deliveryMethod === "motorizado"}
                    onChange={() => setDeliveryMethod("motorizado")}
                    style={{ marginRight: "10px" }}
                  />
                  <span style={{ fontWeight: "600", fontSize: "14px", color: "#374151" }}>
                    Motorizado <span style={{ color: "#9ca3af", fontWeight: "500" }}>(coordinamos por WhatsApp)</span>
                  </span>
                </label>
              </div>
            </div>

            <div>
              <label style={lblStyle}>Subir comprobante de pago (Captura de Yape/Plin/Voucher)</label>
              <input
                type="file"
                accept="image/*"
                style={{ ...inStyle, padding: "10px" }}
                onChange={(e) => setScreenshot(e.target.files[0])}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={status === "sending"}
              style={{ 
                backgroundColor: "#7c3aed", 
                color: "#fff", 
                border: "none", 
                padding: "16px", 
                borderRadius: "16px", 
                fontWeight: "700", 
                fontSize: "16px", 
                cursor: status === "sending" ? "not-allowed" : "pointer", 
                opacity: status === "sending" ? 0.7 : 1,
                boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
                marginTop: "12px"
              }}
            >
              {status === "sending" ? "Guardando pedido..." : "Confirmar mi pedido por WhatsApp"}
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}

const qtyBtnStyle = { backgroundColor: "#e9d5ff", color: "#6b21a8", border: "none", width: "28px", height: "28px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const lblStyle = { display: "block", fontSize: "14px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" };
const inStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", background: "#fff", outline: "none" };
const deliveryOptionStyle = { display: "flex", alignItems: "center", padding: "12px 14px", borderRadius: "12px", border: "1.5px solid #d1d5db", cursor: "pointer", transition: "border-color 0.15s, background-color 0.15s" };