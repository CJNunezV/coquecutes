"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
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

    <div ref={carouselRef} style={{ display: "flex", gap: "24px", overflowX: "auto", scrollBehavior: "smooth", padding: "10px 5px 20px 5px", scrollbarWidth: "none" }}>
    {products.map((product) => (
      
      /* 2. Envolvemos TODA la tarjeta con el Link dinámico */
      <Link 
        href={`/producto/${product.slug}`} 
        key={product.id} 
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <div style={cardStyle}>
          
          {/* Contenedor de la Foto */}
          <div style={{ background: product.bgGradient, height: "280px", display: "flex", alignItems: "center", position: "relative", justifyContent: "center" }}>
            <span style={tagStyle}>{product.tag}</span>
            {/* Cuando tengas tus fotos en la carpeta public, aquí usarás product.images[0] */}
            <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "600" }}>[ Foto del producto ]</span>
          </div>
          
          {/* Detalles del Producto */}
          <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
            <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1f2937", margin: "0 0 12px 0", minHeight: "44px" }}>
              {product.name}
            </h3>
            
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto", paddingTop: "12px", borderTop: "1px solid #f3f4f6" }}>
              <span style={{ fontSize: "18px", fontWeight: "800", color: "#7c3aed" }}>
                PEN {product.price.toFixed(2)}
              </span>
              
              {/* Botón Ver Más */}
              <span style={{ 
                backgroundColor: "#f5f3ff", 
                color: "#7c3aed", 
                padding: "8px 16px", 
                borderRadius: "12px", 
                fontWeight: "700", 
                fontSize: "13px" 
              }}>
                Ver detalles
              </span>
            </div>

          </div>
        </div>
      </Link>

    ))}
  </div>
  
);
}

const cardStyle = { backgroundColor: "#ffffff", borderRadius: "24px", overflow: "hidden", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.04)", border: "1px solid #f3f4f6", display: "flex", flexDirection: "column", minWidth: "300px", width: "300px" };
const tagStyle = { position: "absolute", top: "16px", right: "16px", backgroundColor: "#ffffff", color: "#1e1b4b", padding: "6px 14px", borderRadius: "12px", fontSize: "11px", fontWeight: "700", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" };
const addButtonStyle = { backgroundColor: "#f5f3ff", color: "#7c3aed", border: "none", padding: "8px 16px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer" };
const arrowButtonStyle = { position: "absolute", left: "-15px", top: "50%", transform: "translateY(-50%)", zIndex: 10, backgroundColor: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "50%", width: "40px", height: "40px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.05)", color: "#7c3aed" };