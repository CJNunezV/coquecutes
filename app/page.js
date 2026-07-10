"use client";
import React, { useState, useRef } from "react";

export default function CoquecutesShop() {
  // 1. Estado del carrito: guarda los objetos añadidos con su cantidad
  const [cart, setCart] = useState([]);
  
  // Referencia para controlar el scroll horizontal del carrusel
  const carouselRef = useRef(null);

  // Catálogo completo de tus 5 espectaculares modelos
  const products = [
    { id: 1, name: "Case Premium - Edición Pokébola Clásica", price: 49.90, tag: "Popular", bgGradient: "linear-gradient(135deg, #fee2e2 0%, #fff1f2 100%)" },
    { id: 2, name: "Case Premium - Edición Especial 30 Aniversario Oro", price: 59.90, tag: "Nuevo", bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)" },
    { id: 3, name: "Case Premium - Edición Team Rocket / Premier Ball", price: 39.90, tag: "Exclusivo", bgGradient: "linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%)" },
    { id: 4, name: "Case Premium - Edición Ultra Ball (Negro/Amarillo)", price: 49.90, tag: "Top Ventas", bgGradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)" },
    { id: 5, name: "Case Premium - Edición Master Ball Pro", price: 54.90, tag: "Limitado", bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)" }
  ];

  // Agregar producto al carrito o incrementar si ya existe
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Quitar o reducir cantidad
  const removeFromCart = (id) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === id);
      if (existing.quantity === 1) {
        return prevCart.filter(item => item.id !== id);
      }
      return prevCart.map(item => item.id === id ? { ...item, quantity: item.quantity - 1 } : item);
    });
  };

  // Calcular totales
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 340 : scrollLeft + 340;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  // Función para mover la pantalla suavemente hacia el formulario de pago
  const scrollToCheckout = () => {
    document.getElementById("checkout-section")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ width: "100%", background: "#fafafa", minHeight: "100vh" }}>
      
      {/* HEADER INTEGRADO (Reemplaza visualmente el layout estático para que funcione el estado) */}
      <header style={{
        padding: "20px 24px",
        borderBottom: "1px solid #eee",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#ffffff",
        position: "sticky",
        top: 0,
        zIndex: 100
      }}>
        <span style={{ fontSize: "22px", fontWeight: "bold", color: "#1a1a1a" }}>Coquecutes</span>
        
        {/* Botón dinámico "Ir a pagar" con el Carrito a la izquierda */}
        <button 
          onClick={scrollToCheckout}
          disabled={totalItems === 0}
          style={{
            backgroundColor: totalItems > 0 ? "#7c3aed" : "#a78bfa",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: "600",
            border: "none",
            fontSize: "14px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            cursor: totalItems > 0 ? "pointer" : "not-allowed",
            boxShadow: "0 4px 12px rgba(124, 58, 237, 0.15)",
            transition: "background 0.2s"
          }}
        >
          {/* Icono de Carrito Blanco */}
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <span>Ir a pagar ({totalItems})</span>
        </button>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 24px" }}>
        
        {/* HERO */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "40px 20px",
          background: "linear-gradient(180deg, #f5f3ff 0%, #ffffff 100%)",
          borderRadius: "32px",
          boxShadow: "0 4px 20px rgba(124, 58, 237, 0.02)"
        }}>
          <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#1e1b4b", margin: "0 0 12px 0" }}>Nuestros productos</h1>
          <p style={{ fontSize: "16px", color: "#6b7280", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" }}>
            Elige el protector perfecto para tus cartas más valiosas. El pago se realiza vía <strong style={{ color: "#7c3aed" }}>Yape, Plin o Transferencia</strong>.
          </p>
        </div>

        {/* CARRUSEL DE PRODUCTOS */}
        <div style={{ position: "relative", marginBottom: "60px" }}>
          <button onClick={() => scroll("left")} style={arrowButtonStyle}>❮</button>
          
          <div ref={carouselRef} style={{ display: "flex", gap: "24px", overflowX: "auto", scrollBehavior: "smooth", padding: "10px 5px 20px 5px", scrollbarWidth: "none" }}>
            {products.map((product) => (
              <div key={product.id} style={cardStyle}>
                <div style={{ background: product.bgGradient, height: "280px", display: "flex", alignItems: "center", justifyBox: "center", position: "relative", justifyContent:"center" }}>
                  <span style={tagStyle}>{product.tag}</span>
                  <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "600" }}>[ Foto del producto ]</span>
                </div>
                <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 12px 0", minHeight: "44px" }}>{product.name}</h3>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#7c3aed" }}>PEN {product.price.toFixed(2)}</span>
                    <button onClick={() => addToCart(product)} style={addButtonStyle}>Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={() => scroll("right")} style={{ ...arrowButtonStyle, right: "-15px" }}>❯</button>
        </div>

        {/* SECCIÓN DETALLE DE COMPRA Y FORMULARIO (CHECKOUT MEJORADO) */}
        {cart.length > 0 && (
          <div id="checkout-section" style={{
            background: "#ffffff",
            borderRadius: "32px",
            padding: "32px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            border: "1px solid #f1f5f9",
            animation: "fadeIn 0.3s ease-in-out"
          }}>
            <h2 style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b", marginBottom: "24px" }}>Finalizar compra</h2>
            
            {/* INSTRUCCIONES DE PAGO CUTE */}
            <div style={{ backgroundColor: "#f5f3ff", padding: "20px", borderRadius: "20px", marginBottom: "32px", border: "1px dashed #c084fc" }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#6b21a8", fontWeight: "700" }}>Datos para el pago</h4>
              <p style={{ margin: "4px 0", color: "#4c1d95", fontSize: "14px" }}><strong>Yape / Plin:</strong> 999 999 999 (Nombre Apellido)</p>
              <p style={{ margin: "4px 0", color: "#4c1d95", fontSize: "14px" }}><strong>Transferencia BCP:</strong> 000-000000000-0-00</p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "40px" }}>
              
              {/* LISTA REAL DE OBJETOS SELECCIONADOS */}
              <div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "16px" }}>Tus Productos Seleccionados</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {cart.map((item) => (
                    <div key={item.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", backgroundColor: "#fafafa", borderRadius: "16px", border: "1px solid #f3f4f6" }}>
                      <div>
                        <p style={{ margin: "0", fontWeight: "700", color: "#374151", fontSize: "14px" }}>{item.name}</p>
                        <p style={{ margin: "4px 0 0 0", color: "#7c3aed", fontSize: "13px", fontWeight: "600" }}>PEN {item.price.toFixed(2)} x {item.quantity}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <button onClick={() => removeFromCart(item.id)} style={quantityButtonStyle}>-</button>
                        <span style={{ fontWeight: "700", fontSize: "14px" }}>{item.quantity}</span>
                        <button onClick={() => addToCart(item)} style={quantityButtonStyle}>+</button>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "2px solid #f3f4f6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "18px", fontWeight: "700", color: "#374151" }}>Total a pagar:</span>
                  <span style={{ fontSize: "24px", fontWeight: "900", color: "#7c3aed" }}>PEN {totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* FORMULARIO DE RECOLECCIÓN DE DATOS */}
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1f2937", marginBottom: "4px" }}>Datos de Envío</h3>
                
                <div>
                  <label style={labelStyle}>Nombre completo</label>
                  <input type="text" placeholder="Ej. Juan Pérez" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>WhatsApp</label>
                  <input type="tel" placeholder="Ej. 987654321" style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Subir comprobante de pago</label>
                  <input type="file" style={{ ...inputStyle, padding: "10px" }} />
                </div>

                <button style={{
                  backgroundColor: "#7c3aed",
                  color: "#fff",
                  border: "none",
                  padding: "14px",
                  borderRadius: "16px",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  marginTop: "10px",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.2)"
                }}>
                  Confirmar mi pedido por WhatsApp
                </button>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS EN OBJETOS (Para no depender de librerías extras)
const cardStyle = { backgroundColor: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", minWidth: "300px", width: "300px" };
const tagStyle = { position: "absolute", top: "16px", right: "16px", backgroundColor: "#ffffff", color: "#1e1b4b", padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const addButtonStyle = { backgroundColor: "#f5f3ff", color: "#7c3aed", border: "none", padding: "8px 16px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer" };
const quantityButtonStyle = { backgroundColor: "#e9d5ff", color: "#6b21a8", border: "none", width: "28px", height: "28px", borderRadius: "8px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" };
const arrowButtonStyle = { position: "absolute", left: "-15px", top: "50%", transform: "translateY(-50%)", zIndex: 10, backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", color: "#7c3aed" };
const labelStyle = { display: "block", fontSize: "14px", fontWeight: "600", color: "#4b5563", marginBottom: "6px" };
const inputStyle = { width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box", outline: "none", background: "#fff" };