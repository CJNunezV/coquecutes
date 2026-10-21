"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { products } from "../../../data/products"; // Ajusta la ruta si es necesario según tu carpeta
import Link from "next/link";

const ACCENTS = {
  "case-team-rocket": ["#e5e7eb", "#f5f5f7"],
  "case-ultra-ball": ["#fde68a", "#fffbeb"],
  "case-premier-ball": ["#e0e7ff", "#f8f9ff"],
  "case-pokebola-clasica": ["#fecaca", "#fff5f5"],
  "case-master-ball": ["#ddd6fe", "#f5f3ff"],
  "case-great-ball": ["#bfdbfe", "#eff6ff"],
};

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const foundProduct = products.find((p) => p.slug === slug);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.images[0] || "/placeholder.svg");
    }
  }, [slug]);

  const addToCart = () => {
    if (!product) return;

    const savedCart = localStorage.getItem("coquecutes_cart");
    let cart = savedCart ? JSON.parse(savedCart) : [];

    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity
      });
    }

    localStorage.setItem("coquecutes_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdate")); // Notifica al Header dinámico
  };

  const handleAddToCart = () => {
    addToCart();
  };

  const handleAddToCartAndPay = () => {
    addToCart();
    router.push("/checkout"); // Redirecciona directo al checkout de dos columnas
  };

  if (!product) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <p style={{ color: "#6b7280" }}>Cargando detalles del protector...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", background: "#ffffff", borderRadius: "32px", padding: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.01)", border: "1px solid #f1f5f9" }}>
      
      {/* Botón Volver */}
      <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "#6b7280", textDecoration: "none", fontSize: "14px", fontWeight: "600", marginBottom: "24px" }}>
        ← Volver al catálogo
      </Link>

      <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", gap: "48px", alignItems: "flex-start" }}>
        
        {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES (fija al hacer scroll) */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "16px", position: "sticky", top: "24px", alignSelf: "flex-start" }}>
          {/* Foto Principal */}
          {(() => {
            const isCut = (activeImage || "").includes("/cut/");
            const acc = ACCENTS[product.slug] || ["#ede9fe", "#faf5ff"];
            return (
              <div
                className="pg-stage"
                style={{
                  width: "100%", height: "460px", borderRadius: "28px", position: "relative",
                  display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden",
                  background: isCut
                    ? `radial-gradient(circle at 50% 38%, #ffffff 0%, ${acc[1]} 38%, ${acc[0]} 100%)`
                    : "#fcfbfe",
                  border: "1px solid #f3e8ff",
                }}
              >
                {isCut && <div className="pg-shadow" />}
                <img
                  key={activeImage}
                  className={isCut ? "pg-img pg-cut" : "pg-img"}
                  src={activeImage}
                  alt={product.name}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: isCut ? "28px 28px 44px" : "20px", position: "relative", zIndex: 1 }}
                />
              </div>
            );
          })()}

          {/* Miniaturas */}
          {product.images.length > 1 && (
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              {product.images.map((img, index) => {
                const acc = ACCENTS[product.slug] || ["#ede9fe", "#faf5ff"];
                const active = activeImage === img;
                return (
                  <button
                    key={index}
                    onClick={() => setActiveImage(img)}
                    aria-label={`Ver foto ${index + 1}`}
                    style={{
                      width: "78px", height: "78px", borderRadius: "16px", padding: "4px", flexShrink: 0, cursor: "pointer", overflow: "hidden",
                      background: img.includes("/cut/") ? `linear-gradient(160deg, #fff, ${acc[0]})` : "#fff",
                      border: active ? "2px solid #7c3aed" : "2px solid transparent",
                      boxShadow: active ? "0 6px 16px rgba(124,58,237,0.25)" : "0 2px 8px rgba(0,0,0,0.08)",
                      transform: active ? "translateY(-2px)" : "none",
                      transition: "all .2s",
                    }}
                  >
                    <img src={img} alt={`Vista ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
                  </button>
                );
              })}
            </div>
          )}
          <style>{`
            .pg-shadow{position:absolute;bottom:34px;left:50%;width:46%;height:22px;transform:translateX(-50%);background:radial-gradient(ellipse at center,rgba(30,27,75,.28),transparent 70%);filter:blur(4px);z-index:0}
            .pg-cut{filter:drop-shadow(0 18px 22px rgba(30,27,75,.22));animation:pgIn .45s ease both, pgFloat 5s ease-in-out .45s infinite}
            .pg-img{animation:pgIn .45s ease both}
            @keyframes pgIn{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:none}}
            @keyframes pgFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
            @media (prefers-reduced-motion:reduce){.pg-cut,.pg-img{animation:none}}
          `}</style>
        </div>

        {/* COLUMNA DERECHA: INFORMACIÓN, MEDIDAS Y COMPRA */}
        <div style={{ flex: "1.2 1 450px", display: "flex", flexDirection: "column" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#1e1b4b", margin: "0 0 12px 0", lineHeight: "1.2" }}>{product.name}</h1>
          <p style={{ fontSize: "26px", fontWeight: "900", color: "#7c3aed", margin: "0 0 24px 0" }}>PEN {product.price.toFixed(2)}</p>
          
          <div style={{ height: "1px", backgroundColor: "#f1f5f9", marginBottom: "24px" }} />
          
          <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#374151", margin: "0 0 8px 0" }}>Descripción</h3>
          <p style={{ fontSize: "15px", color: "#6b7280", margin: "0 0 28px 0", lineHeight: "1.6" }}>{product.description}</p>
          
          {/* FICHA TÉCNICA (Medidas y Materiales) */}
          <div style={{ backgroundColor: "#fafafa", borderRadius: "20px", padding: "20px", border: "1px solid #f3f4f6", marginBottom: "32px" }}>
            <h4 style={{ margin: "0 0 14px 0", color: "#1f2937", fontSize: "14px", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Especificaciones Técnicas</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span style={{ color: "#9ca3af", fontWeight: "500" }}>Dimensiones:</span>
                <span style={{ color: "#374151", fontWeight: "650", textAlign: "right" }}>{product.specs.medidas}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span style={{ color: "#9ca3af", fontWeight: "500" }}>Material:</span>
                <span style={{ color: "#374151", fontWeight: "650", textAlign: "right" }}>{product.specs.material}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span style={{ color: "#9ca3af", fontWeight: "500" }}>Compatibilidad:</span>
                <span style={{ color: "#374151", fontWeight: "650", textAlign: "right" }}>{product.specs.compatibilidad}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13.5px" }}>
                <span style={{ color: "#9ca3af", fontWeight: "500" }}>Peso aprox:</span>
                <span style={{ color: "#374151", fontWeight: "650" }}>{product.specs.peso}</span>
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Fila: selector de cantidad + Añadir al carrito */}
            <div style={{ display: "flex", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "0 6px",
                  minWidth: "110px",
                }}
              >
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#374151",
                    cursor: "pointer",
                    width: "32px",
                    height: "48px",
                  }}
                  aria-label="Restar cantidad"
                >
                  −
                </button>
                <span style={{ fontWeight: "700", fontSize: "16px", color: "#1f2937" }}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  style={{
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    fontWeight: "700",
                    color: "#374151",
                    cursor: "pointer",
                    width: "32px",
                    height: "48px",
                  }}
                  aria-label="Sumar cantidad"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                style={{
                  flex: 1,
                  backgroundColor: "#111111",
                  color: "#ffffff",
                  border: "none",
                  padding: "0 16px",
                  borderRadius: "16px",
                  fontWeight: "700",
                  fontSize: "15px",
                  letterSpacing: "0.3px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                </svg>
                AÑADIR AL CARRITO
              </button>
            </div>

            {/* Botón ancho: Ir a pagar */}
            <button
              onClick={handleAddToCartAndPay}
              style={{
                backgroundColor: "#7c3aed",
                color: "#ffffff",
                border: "none",
                padding: "18px",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
              }}
            >
              Ir a pagar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}