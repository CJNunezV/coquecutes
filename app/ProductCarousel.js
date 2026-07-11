"use client";
import { useRef } from "react";
import Link from "next/link";

const accents = ["#f3e8ff", "#e0e7ff", "#ffe4e6", "#fef3c7"];

export default function ProductCarousel({ products }) {
  const trackRef = useRef(null);

  const scrollByCards = (direction) => {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.firstChild ? track.firstChild.offsetWidth : 260;
    const gap = 20;
    // Se mueve de a 2 tarjetas por click
    track.scrollBy({ left: direction * (cardWidth + gap) * 2, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Flecha izquierda */}
      <button
        onClick={() => scrollByCards(-1)}
        aria-label="Ver anteriores"
        style={{
          position: "absolute",
          left: "-18px",
          top: "40%",
          transform: "translateY(-50%)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          color: "#7c3aed",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ←
      </button>

      {/* Flecha derecha */}
      <button
        onClick={() => scrollByCards(1)}
        aria-label="Ver siguientes"
        style={{
          position: "absolute",
          right: "-18px",
          top: "40%",
          transform: "translateY(-50%)",
          width: "36px",
          height: "36px",
          borderRadius: "50%",
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
          color: "#7c3aed",
          fontSize: "16px",
          fontWeight: "700",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
          zIndex: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        →
      </button>

      {/* Track scrollable con 4 tarjetas visibles */}
      <div
        ref={trackRef}
        style={{
          display: "flex",
          gap: "20px",
          overflowX: "auto",
          scrollSnapType: "x mandatory",
          paddingBottom: "8px",
          scrollBehavior: "smooth",
        }}
      >
        {products.map((product, index) => (
          <Link
            href={`/producto/${product.slug}`}
            key={product.id}
            passHref
            style={{
              textDecoration: "none",
              color: "inherit",
              flex: "0 0 calc(25% - 15px)",
              minWidth: "220px",
              scrollSnapAlign: "start",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                cursor: "pointer",
                backgroundColor: "#ffffff",
                borderRadius: "24px",
                border: "1px solid #f1f5f9",
                overflow: "hidden",
              }}
            >
              {/* Contenedor de la imagen */}
              <div
                style={{
                  background: accents[index % accents.length],
                  height: "180px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                }}
              >
                <img
                  src={(product.images && product.images[0]) || "/placeholder.svg"}
                  alt={product.name}
                  style={{ width: "60%", height: "60%", objectFit: "contain" }}
                />
              </div>

              {/* Info: título, precio y CTA */}
              <div
                style={{
                  padding: "16px",
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  background: "#ffffff",
                }}
              >
                <h3
                  style={{
                    fontSize: "14px",
                    fontWeight: "750",
                    color: "#1f2937",
                    margin: "0 0 12px 0",
                    minHeight: "38px",
                    lineHeight: "1.4",
                  }}
                >
                  {product.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "auto",
                    paddingTop: "10px",
                    borderTop: "1px solid #f3f4f6",
                  }}
                >
                  <span style={{ fontSize: "15px", fontWeight: "800", color: "#7c3aed" }}>
                    PEN {product.price.toFixed(2)}
                  </span>
                  <span
                    style={{
                      backgroundColor: "#f5f3ff",
                      color: "#7c3aed",
                      padding: "6px 12px",
                      borderRadius: "10px",
                      fontWeight: "700",
                      fontSize: "12px",
                    }}
                  >
                    Ver detalles
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
