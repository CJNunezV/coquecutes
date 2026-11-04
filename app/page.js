import Link from "next/link";
import { products } from "../data/products";
import ProductCarousel from "./ProductCarousel";
import Reveal from "./Reveal";
import Hero from "./Hero";

export default function HomePage() {
  return (
    <div>
      {/* HERO */}
      <Hero />

      {/* BENEFICIOS */}
      <Reveal
        as="section"
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
            className="reveal-item benefit-card"
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #fdf0f5",
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
      </Reveal>

      {/* CATÁLOGO */}
      <Reveal as="section" id="catalogo" style={{ marginBottom: "48px" }}>
        <h2
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#5f2d52",
            margin: "0 0 20px 0",
          }}
        >
          Catálogo
        </h2>
        <ProductCarousel products={products} />
      </Reveal>

      {/* PRUEBA SOCIAL */}
      <Reveal
        as="section"
        className="testimonial-box"
        style={{
          backgroundColor: "#fff3f7",
          border: "1px dashed #f290b1",
          borderRadius: "24px",
          padding: "28px",
          marginBottom: "48px",
        }}
      >
        <p
          style={{
            fontSize: "15px",
            fontStyle: "italic",
            color: "#96507c",
            margin: "0 0 8px 0",
            lineHeight: "1.6",
          }}
        >
          "El acabado es impecable y la carta queda perfecta adentro, ni un
          milímetro de juego."
        </p>
        <p style={{ fontSize: "13px", color: "#e0698f", margin: 0, fontWeight: "600" }}>
          — Cliente verificado
        </p>
      </Reveal>

      {/* CTA FINAL */}
      <Reveal as="section" style={{ textAlign: "center", padding: "12px 0 24px 0" }}>
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
          className="btn-primary"
          style={{
            display: "inline-block",
            backgroundColor: "#e0698f",
            color: "#ffffff",
            padding: "14px 28px",
            borderRadius: "16px",
            fontWeight: "700",
            fontSize: "15px",
            textDecoration: "none",
            boxShadow: "0 4px 14px rgba(224,105,143, 0.25)",
          }}
        >
          Elige tu case
        </a>
      </Reveal>
    </div>
  );
}