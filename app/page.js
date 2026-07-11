import Link from "next/link";
import { products } from "../data/products";

// Acentos de color rotativos para las tarjetas de producto (fondo del contenedor de imagen)
const accents = ["#f3e8ff", "#e0e7ff", "#ffe4e6", "#fef3c7"];

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <section
        style={{
          textAlign: "center",
          padding: "56px 24px",
          background: "#ffffff",
          borderRadius: "32px",
          border: "1px solid #f1f5f9",
          marginBottom: "48px",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            backgroundColor: "#f5f3ff",
            color: "#7c3aed",
            fontSize: "13px",
            fontWeight: "700",
            padding: "6px 14px",
            borderRadius: "20px",
            marginBottom: "20px",
          }}
        >
          Impresión 3D premium
        </span>
        <h1
          style={{
            fontSize: "34px",
            fontWeight: "800",
            color: "#1e1b4b",
            margin: "0 0 14px 0",
            lineHeight: "1.2",
          }}
        >
          Protegé tus cartas más valiosas
        </h1>
        <p
          style={{
            fontSize: "16px",
            color: "#6b7280",
            maxWidth: "480px",
            margin: "0 auto 28px auto",
            lineHeight: "1.6",
          }}
        >
          Cases 3D a medida para toploaders, resistentes, transparentes y con
          encastre perfecto para tu colección.
        </p>
        <a
          href="#catalogo"
          style={{
            display: "inline-block",
            backgroundColor: "#7c3aed",
            color: "#ffffff",
            padding: "14px 28px",
            borderRadius: "16px",
            fontWeight: "700",
            fontSize: "15px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
          }}
        >
          Ver catálogo
        </a>
      </section>

      {/* BENEFICIOS */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "20px",
          marginBottom: "48px",
        }}
      >
        {[
          {
            title: "Protección real",
            desc: "Resiste caídas y golpes gracias al material técnico de alta densidad.",
          },
          {
            title: "Vista transparente",
            desc: "Se ve la carta completa sin sacarla del case.",
          },
          {
            title: "Encastre perfecto",
            desc: "Medidas exactas por diseño, sin holgura ni movimiento.",
          },
        ].map((item) => (
          <div
            key={item.title}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #f1f5f9",
              borderRadius: "20px",
              padding: "22px",
            }}
          >
            <h3
              style={{
                fontSize: "16px",
                fontWeight: "700",
                color: "#1f2937",
                margin: "0 0 8px 0",
              }}
            >
              {item.title}
            </h3>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0, lineHeight: "1.5" }}>
              {item.desc}
            </p>
          </div>
        ))}
      </section>

      {/* CATÁLOGO */}
      <section id="catalogo" style={{ marginBottom: "48px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#1e1b4b",
            margin: "0 0 20px 0",
          }}
        >
          Catálogo
        </h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "24px",
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
                display: "block",
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
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Contenedor de la imagen */}
                <div
                  style={{
                    background: accents[index % accents.length],
                    height: "220px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={(product.images && product.images[0]) || "/placeholder.svg"}
                    alt={product.name}
                    style={{ width: "70%", height: "70%", objectFit: "contain" }}
                  />
                </div>

                {/* Info: título, precio y CTA */}
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    background: "#ffffff",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: "750",
                      color: "#1f2937",
                      margin: "0 0 12px 0",
                      minHeight: "44px",
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
                      paddingTop: "12px",
                      borderTop: "1px solid #f3f4f6",
                    }}
                  >
                    <span style={{ fontSize: "18px", fontWeight: "800", color: "#7c3aed" }}>
                      PEN {product.price.toFixed(2)}
                    </span>
                    <span
                      style={{
                        backgroundColor: "#f5f3ff",
                        color: "#7c3aed",
                        padding: "8px 16px",
                        borderRadius: "12px",
                        fontWeight: "700",
                        fontSize: "13px",
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
      </section>

      {/* PRUEBA SOCIAL */}
      <section
        style={{
          backgroundColor: "#f5f3ff",
          border: "1px dashed #c084fc",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "48px",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            fontStyle: "italic",
            color: "#4c1d95",
            margin: "0 0 8px 0",
            lineHeight: "1.6",
          }}
        >
          "El acabado es impecable y la carta queda perfecta adentro, ni un
          milímetro de juego."
        </p>
        <p style={{ fontSize: "13px", color: "#7c3aed", margin: 0, fontWeight: "600" }}>
          — Cliente verificado
        </p>
      </section>

      {/* CTA FINAL */}
      <section style={{ textAlign: "center", padding: "12px 0 24px 0" }}>
        <p
          style={{
            fontSize: "16px",
            fontWeight: "700",
            color: "#1f2937",
            margin: "0 0 16px 0",
          }}
        >
          Envío a todo el país
        </p>
        <a
          href="#catalogo"
          style={{
            display: "inline-block",
            backgroundColor: "#7c3aed",
            color: "#ffffff",
            padding: "14px 28px",
            borderRadius: "16px",
            fontWeight: "700",
            fontSize: "15px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(124, 58, 237, 0.25)",
          }}
        >
          Elegí tu case
        </a>
      </section>
    </div>
  );
}