import Link from "next/link";
import { getProductBySlug, products } from "@/data/products";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default function ProductPage({ params }) {
  const product = getProductBySlug(params.slug);
  if (!product) return notFound();

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
      <img
        src={product.image}
        alt={product.name}
        style={{ width: "100%", borderRadius: 16, objectFit: "cover" }}
      />
      <div>
        <h1 style={{ fontSize: 28, marginBottom: 8 }}>{product.name}</h1>
        <div style={{ fontSize: 22, color: "#7c3aed", marginBottom: 16 }}>
          {product.currency} {product.price.toFixed(2)}
        </div>
        <p style={{ color: "#555", lineHeight: 1.6 }}>{product.description}</p>

        {product.sizes?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>Tallas disponibles</div>
            <div style={{ display: "flex", gap: 8 }}>
              {product.sizes.map((size) => (
                <span
                  key={size}
                  style={{
                    padding: "6px 12px",
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    fontSize: 14,
                  }}
                >
                  {size}
                </span>
              ))}
            </div>
          </div>
        )}

        <Link
          href={`/checkout?producto=${product.slug}`}
          style={{
            display: "inline-block",
            marginTop: 28,
            background: "#7c3aed",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: 10,
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Comprar este producto
        </Link>
      </div>
    </div>
  );
}
