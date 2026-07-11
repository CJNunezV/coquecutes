"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { products } from "../../../data/products"; // Ajusta la ruta si es necesario según tu carpeta
import Link from "next/link";

export default function ProductDetailPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");

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
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1
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
        
        {/* COLUMNA IZQUIERDA: GALERÍA DE IMÁGENES */}
        <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Foto Principal */}
          <div style={{ width: "100%", height: "450px", backgroundColor: "#fcfbfe", borderRadius: "24px", border: "1px solid #f3e8ff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
            <img 
              src={activeImage} 
              alt={product.name} 
              style={{ width: "100%", height: "100%", objectFit: "contain", padding: "20px" }} 
            />
          </div>
          
          {/* Carrusel de Miniaturas */}
          <div style={{ display: "flex", gap: "12px", overflowX: "auto", paddingBottom: "8px" }}>
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(img)}
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "12px",
                  border: activeImage === img ? "2px solid #7c3aed" : "1px solid #e5e7eb",
                  backgroundColor: "#ffffff",
                  overflow: "hidden",
                  cursor: "pointer",
                  padding: "4px",
                  flexShrink: 0,
                  transition: "border 0.2s"
                }}
              >
                <img src={img} alt={`Vista ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </button>
            ))}
          </div>
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
            <button
              onClick={handleAddToCart}
              style={{
                backgroundColor: "#ffffff",
                color: "#7c3aed",
                border: "2px solid #7c3aed",
                padding: "16px",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "16px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "background 0.2s"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              Agregar
            </button>

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
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                transition: "background 0.2s"
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
              </svg>
              Agregar y pagar
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}