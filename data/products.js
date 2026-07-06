// Catálogo de productos de Coquecutes.
// Edita, agrega o quita productos aquí. Cada producto necesita un "slug" único
// (se usa en la URL, ej: /producto/polera-coque).

export const products = [
  {
    slug: "producto-1",
    name: "Nombre del producto 1",
    price: 49.9,
    currency: "PEN",
    description: "Descripción corta del producto. Edita este texto en data/products.js.",
    image: "/placeholder.svg",
    sizes: ["S", "M", "L"],
  },
  {
    slug: "producto-2",
    name: "Nombre del producto 2",
    price: 59.9,
    currency: "PEN",
    description: "Descripción corta del producto. Edita este texto en data/products.js.",
    image: "/placeholder.svg",
    sizes: ["Único"],
  },
  {
    slug: "producto-3",
    name: "Nombre del producto 3",
    price: 39.9,
    currency: "PEN",
    description: "Descripción corta del producto. Edita este texto en data/products.js.",
    image: "/placeholder.svg",
    sizes: ["S", "M", "L", "XL"],
  },
];

export function getProductBySlug(slug) {
  return products.find((p) => p.slug === slug);
}
