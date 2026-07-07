import Link from "next/link";
import { products } from "@/data/products";

export default function HomePage() {
  return (
    <div>
      <h1 style={{ fontSize: 32, marginBottom: 8 }}>Nuestros productos</h1>
      <p style={{ color: "#666", marginBottom: 32 }}>
        Elige lo que te guste. El pago se hace por Yape/Plin/transferencia y luego subes tu comprobante.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 24,
        }}
      >
        {products.map((product) => (
          <Link
            key={product.slug}
            href={`/producto/${product.slug}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              border: "1px solid #eee",
              borderRadius: 12,
              overflow: "hidden",
              background: "#fff",
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: 220, objectFit: "cover" }}
            />
            <div style={{ padding: 14 }}>
              <div style={{ fontWeight: 600 }}>{product.name}</div>
              <div style={{ color: "#7c3aed", marginTop: 4 }}>
                {product.currency} {product.price.toFixed(2)}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
