"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState([]);

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
      <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b", marginBottom: "24px" }}>Finalizar compra</h2>
      
      {/* SECCIÓN SUPERIOR: DATOS DE PAGO + QR */}
      <div style={{ 
        backgroundColor: "#f5f3ff", 
        padding: "24px", 
        borderRadius: "24px", 
        marginBottom: "32px", 
        border: "1px dashed #c084fc",
        display: "flex",
        flexWrap: "wrap",
        gap: "24px",
        alignItems: "center",
        justifyContent: "space-between"
      }}>
        <div style={{ flex: "1 1 300px" }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#6b21a8", fontSize: "16px", fontWeight: "700" }}>Datos para el pago</h4>
          <p style={{ margin: "6px 0", color: "#4c1d95", fontSize: "14px" }}><strong>Yape / Plin:</strong> 999 999 999 (Coquecutes Store)</p>
          <p style={{ margin: "6px 0", color: "#4c1d95", fontSize: "14px" }}><strong>Transferencia BCP:</strong> 191-XXXXXXXX-X-XX</p>
          <p style={{ margin: "12px 0 0 0", color: "#7c3aed", fontSize: "13px", fontStyle: "italic" }}>💡 Escanea el QR de la derecha para pagar directamente desde tu app bancaria.</p>
        </div>
        
        {/* CONTENEDOR PARA TU IMAGEN DE QR */}
        <div style={{ 
          width: "120px", 
          height: "120px", 
          backgroundColor: "#ffffff", 
          borderRadius: "16px", 
          border: "1px solid #e9d5ff",
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          overflow: "hidden",
          boxShadow: "0 4px 10px rgba(0,0,0,0.05)"
        }}>
          <img 
            src="/placeholder.svg" 
            alt="Código QR de Pago Yape/Plin" 
            style={{ width: "100%", height: "100%", objectFit: "cover", padding: "8px" }} 
          />
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL: DOS COLUMNAS */}
      <div style={{ 
        display: "flex", 
        flexDirection: "row", 
        flexWrap: "wrap", 
        gap: "40px", 
        alignItems: "flex-start" 
      }}>
        
        {/* COLUMNA IZQUIERDA: "TUS PRODUCTOS" (ESTÁTICA/STICKY) */}
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
              <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", backgroundColor: "#ffffff", borderRadius: "16px", border: "1px solid #e5e7eb" }}>
                <div>
                  <p style={{ margin: "0", fontWeight: "700", color: "#374151", fontSize: "14px" }}>{item.name}</p>
                  <p style={{ margin: "4px 0 0 0", color: "#7c3aed", fontSize: "13px", fontWeight: "600" }}>PEN {item.price.toFixed(2)} x {item.quantity}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => changeQuantity(item.id, -1)} style={qtyBtnStyle}>-</button>
                  <span style={{ fontWeight: "700", fontSize: "14px" }}>{item.quantity}</span>
                  <button onClick={() => changeQuantity(item.id, 1)} style={qtyBtnStyle}>+</button>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "2px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "18px", fontWeight: "700", color: "#4b5563" }}>Total a pagar:</span>
            <span style={{ fontSize: "24px", fontWeight: "900", color: "#7c3aed" }}>PEN {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO (SCROLLEABLE) */}
        <div style={{ flex: "1.2 1 400px", display: "flex", flexDirection: "column", gap: "20px" }}>
          <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "4px" }}>Datos de Envío</h3>
          
          <div>
            <label style={lblStyle}>Nombre completo</label>
            <input type="text" placeholder="Ej. Juan Pérez" style={inStyle} />
          </div>
          
          <div>
            <label style={lblStyle}>WhatsApp</label>
            <input type="tel" placeholder="Ej. 987654321" style={inStyle} />
          </div>
          
          <div>
            <label style={lblStyle}>Subir comprobante de pago (Captura de Yape/Plin/Voucher)</label>
            <input type="file" style={{ ...inStyle, padding: "10px" }} />
          </div>
          
          <button style={{ 
            backgroundColor: "#7c3aed", 
            color: "#fff", 
            border: "none", 
            padding: "16px", 
            borderRadius: "16px", 
            fontWeight: "700", 
            fontSize: "16px", 
            cursor: "pointer", 
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)",
            marginTop: "12px"
          }}>
            Confirmar mi pedido por WhatsApp
          </button>
        </div>

      </div>
    </div>
  );
}

const qtyBtnStyle = { backgroundColor: "#e9d5ff", color: "#6b21a8", border: "none", width: "28px", height: "28px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const lblStyle = { display: "block", fontSize: "14px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" };
const inStyle = { width: "100%", padding: "14px 16px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", background: "#fff", outline: "none" };