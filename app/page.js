"use client";
import React, { useState, useRef, useEffect } from "react";
import { products } from "../data/products"; // Importación limpia desde tu árbol

export default function ProductsPage() {
  const [cart, setCart] = useState([]);
  const carouselRef = useRef(null);

  useEffect(() => {
    const savedCart = localStorage.getItem("coquecutes_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existing = updatedCart.find(item => item.id === product.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      updatedCart.push({ ...product, quantity: 1 });
    }
    
    setCart(updatedCart);
    localStorage.setItem("coquecutes_cart", JSON.stringify(updatedCart));
    window.dispatchEvent(new Event("cartUpdate"));
  };

  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft } = carouselRef.current;
      const scrollTo = direction === "left" ? scrollLeft - 340 : scrollLeft + 340;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div style={{ width: "100%" }}>
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

      <div style={{ position: "relative", marginBottom: "40px" }}>
        <button onClick={() => scroll("left")} style={arrowButtonStyle}>❮</button>
        
        <div ref={carouselRef} style={{ display: "flex", gap: "24px", overflowX: "auto", scrollBehavior: "smooth", padding: "10px 5px 20px 5px", scrollbarWidth: "none" }}>
          {products.map((product) => (
            <div key={product.id} style={cardStyle}>
              <div style={{ background: product.bgGradient, height: "280px", display: "flex", alignItems: "center", position: "relative", justifyContent: "center" }}>
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
    </div>
  );
}

const cardStyle = { backgroundColor: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", minWidth: "300px", width: "300px" };
const tagStyle = { position: "absolute", top: "16px", right: "16px", backgroundColor: "#ffffff", color: "#1e1b4b", padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const addButtonStyle = { backgroundColor: "#f5f3ff", color: "#7c3aed", border: "none", padding: "8px 16px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer" };
const arrowButtonStyle = { position: "absolute", left: "-15px", top: "50%", transform: "translateY(-50%)", zIndex: 10, backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", color: "#7c3aed" };