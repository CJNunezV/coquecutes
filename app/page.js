"use client";
import React, { useState, useRef } from "react";

export default function ProductsPage() {
  // 1. Estado para contar los productos agregados al carrito
  const [cartCount, setCartCount] = useState(0);

  // Referencia para controlar el scroll del carrusel de forma nativa y fluida
  const carouselRef = useRef(null);

  // 5 Modelos de productos basados en tus diseños y Pokéballs
  const products = [
    {
      id: 1,
      name: "Case Premium - Edición Pokébola Clásica",
      price: "PEN 49.90",
      tag: "Popular",
      bgGradient: "linear-gradient(135deg, #fee2e2 0%, #fff1f2 100%)"
    },
    {
      id: 2,
      name: "Case Premium - Edición Especial 30 Aniversario Oro",
      price: "PEN 59.90",
      tag: "Nuevo",
      bgGradient: "linear-gradient(135deg, #fef3c7 0%, #fffbeb 100%)"
    },
    {
      id: 3,
      name: "Case Premium - Edición Team Rocket / Premier Ball",
      price: "PEN 39.90",
      tag: "Exclusivo",
      bgGradient: "linear-gradient(135deg, #f3e8ff 0%, #fae8ff 100%)"
    },
    {
      id: 4,
      name: "Case Premium - Edición Ultra Ball (Negro/Amarillo)",
      price: "PEN 49.90",
      tag: "Top Ventas",
      bgGradient: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)"
    },
    {
      id: 5,
      name: "Case Premium - Edición Master Ball Pro",
      price: "PEN 54.90",
      tag: "Limitado",
      bgGradient: "linear-gradient(135deg, #e0e7ff 0%, #e0f2fe 100%)"
    }
  ];

  // Función para simular agregar al carrito
  const handleAddToCart = () => {
    setCartCount(prev => prev + 1);
  };

  // Funciones para deslizar el carrusel a la izquierda o derecha
  const scroll = (direction) => {
    if (carouselRef.current) {
      const { scrollLeft, clientWidth } = carouselRef.current;
      // Desplaza aproximadamente el ancho de una tarjeta + el gap
      const scrollTo = direction === "left" ? scrollLeft - 360 : scrollLeft + 360;
      carouselRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div style={{ width: "100%", padding: "10px 0" }}>
      
      {/* 2. Sección del Header Flotante del Carrito (Simulado internamente para interactuar) */}
      <div style={{
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "20px",
        padding: "0 10px"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#ffffff",
          padding: "8px 16px",
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
          border: "1px solid #f3f4f6"
        }}>
          {/* Icono de Carrito SVG Minimalista */}
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <span style={{ fontWeight: "700", color: "#1e1b4b", fontSize: "14px" }}>
            Carrito: <span style={{ color: "#7c3aed", fontSize: "16px" }}>{cartCount}</span>
          </span>
        </div>
      </div>

      {/* Sección Hero / Presentación Corta */}
      <div style={{
        textAlign: "center",
        marginBottom: "40px",
        padding: "40px 20px",
        background: "linear-gradient(180deg, #f5f3ff 0%, #fafafa 100%)",
        borderRadius: "32px",
        boxShadow: "0 4px 20px rgba(124, 58, 237, 0.03)"
      }}>
        <h1 style={{
          fontSize: "42px",
          fontWeight: "800",
          letterSpacing: "-1px",
          color: "#1e1b4b",
          margin: "0 0 16px 0"
        }}>
          Nuestros productos
        </h1>
        <p style={{
          fontSize: "16px",
          color: "#6b7280",
          maxWidth: "600px",
          margin: "0 auto",
          lineHeight: "1.6"
        }}>
          Elige el protector perfecto para tus cartas más valiosas. El pago se realiza vía 
          <strong style={{ color: "#7c3aed" }}> Yape, Plin o Transferencia </strong> y luego subes tu comprobante.
        </p>
      </div>

      {/* 1. Contenedor del Carrusel con Controles de Flechas */}
      <div style={{ position: "relative", padding: "0 10px" }}>
        
        {/* Botón Izquierda */}
        <button 
          onClick={() => scroll("left")}
          style={{
            position: "absolute",
            left: "-15px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            color: "#7c3aed"
          }}
        >
          ❮
        </button>

        {/* Cuerpo del Carrusel Scrollable */}
        <div 
          ref={carouselRef}
          style={{
            display: "flex",
            gap: "24px",
            overflowX: "auto",
            scrollBehavior: "smooth",
            padding: "15px 5px 25px 5px",
            scrollbarWidth: "none", // Oculta barra en Firefox
            WebkitOverflowScrolling: "touch"
          }}
          className="no-scrollbar"
        >
          {products.map((product) => (
            <div key={product.id} style={{
              backgroundColor: "#ffffff",
              borderRadius: "24px",
              overflow: "hidden",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
              border: "1px solid #f3f4f6",
              display: "flex",
              flexDirection: "column",
              minWidth: "320px", // Mantiene el tamaño fijo de las tarjetas en el scroll horizontal
              width: "320px"
            }}>
              
              {/* Contenedor Foto */}
              <div style={{
                background: product.bgGradient,
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative"
              }}>
                <span style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  backgroundColor: "#ffffff",
                  color: "#1e1b4b",
                  padding: "6px 14px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: "700",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}>
                  {product.tag}
                </span>
                <span style={{ color: "#a78bfa", fontSize: "14px", fontWeight: "600" }}>
                  [ Foto del producto ]
                </span>
              </div>

              {/* Info y Botón */}
              <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <h3 style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "#1f2937",
                  margin: "0 0 12px 0",
                  minHeight: "44px"
                }}>
                  {product.name}
                </h3>
                
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "auto",
                  paddingTop: "12px",
                  borderTop: "1px solid #f3f4f6"
                }}>
                  <span style={{ fontSize: "18px", fontWeight: "800", color: "#7c3aed" }}>
                    {product.price}
                  </span>

                  <button 
                    onClick={handleAddToCart}
                    style={{
                      backgroundColor: "#f5f3ff",
                      color: "#7c3aed",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "12px",
                      fontWeight: "700",
                      fontSize: "13px",
                      cursor: "pointer"
                    }}
                  >
                    Agregar
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Botón Derecha */}
        <button 
          onClick={() => scroll("right")}
          style={{
            position: "absolute",
            right: "-15px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            backgroundColor: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: "50%",
            width: "44px",
            height: "44px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            color: "#7c3aed"
          }}
        >
          ❯
        </button>
      </div>

    </div>
  );
}