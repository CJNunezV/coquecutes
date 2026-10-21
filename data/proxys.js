// ⚠️ DATOS DE EJEMPLO: reemplaza nombres, precios e imágenes por los reales.
// Para usar fotos: agrega  image: "/proxys/nombre.jpg"  a cualquier item.

// Tipos de proxy que el cliente puede elegir al comprar (para cartas, extended art y decks).
// `extra` = soles que se SUMAN al precio base de ese producto (0 = mismo precio).
// ⚠️ Ajusta nombres, descripciones y extras a los reales.
export const proxyTypes = [
  { id: "frio", label: "En frío", extra: 0, desc: "" },
  { id: "crema", label: "Con crema", extra: 0, desc: "" },
  { id: "calor", label: "Al calor", extra: 0, desc: "" },
];

// Cartas sueltas (1 proxy por ítem)
export const singles = [
  { id: "px-s1", name: "Poncho Pikachu Charizard X", set: "Obsidian Flames", price: 15, grad: ["#fb923c", "#ef4444"], image: "/proxys/Singles/poncho-charizard-x.avif" },
  { id: "px-s2", name: "Poncho Pikachu Charizard Y", set: "Surging Sparks", price: 15, grad: ["#fde047", "#f59e0b"], image: "/proxys/Singles/poncho-charizard-y.avif" },
  { id: "px-s3", name: "Poncho Pikachu Rayquaza", set: "151", price: 15, grad: ["#c4b5fd", "#ec4899"], image: "/proxys/Singles/poncho-rayquaza.avif" },
  { id: "px-s4", name: "Poncho Pikachu Rayquaza Shiny", set: "Evolving Skies", price: 16, grad: ["#1e1b4b", "#6366f1"], image: "/proxys/Singles/poncho-rayquaza-shiny.avif" },
  { id: "px-s5", name: "Poncho Pikachu Magikarp", set: "Fusion Strike", price: 15, grad: ["#7c3aed", "#312e81"], image: "/proxys/Singles/poncho-magikarp.avif" },
  { id: "px-s6", name: "Poncho Pikachu Gyarados", set: "Silver Tempest", price: 15, grad: ["#bae6fd", "#6366f1"], image: "/proxys/Singles/poncho-gyarados.avif" },
  { id: "px-s7", name: "Totoro Poncho Pikachu", set: "Fan Art · Promo", price: 15, grad: ["#86efac", "#166534"], image: "/proxys/Singles/0ae16301-89cf-4a50-a111-edd2766caad7.jpg" },
  { id: "px-s8", name: "Dear Santa Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#ef4444", "#7f1d1d"], image: "/proxys/Singles/671a8399-83b8-4dd4-b9fe-e4ecfa0589f0.jpg" },
  { id: "px-s9", name: "Ugly Sweater Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#22c55e", "#b91c1c"], image: "/proxys/Singles/a8356bc4-2897-4b66-95be-3308a86f831c.jpg" },
  { id: "px-s10", name: "Playful Mew ex", set: "Fan Art · Navidad", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/ecac42ad-ea1e-41b7-9d6c-090b3c34ecc0.jpg" },
];

// Extended Art: cada item = el arte completo de 3x3. Se venden las 8 cartas que rodean al centro;
// la carta CENTRAL no está incluida (en la foto aparece solo de referencia).
// Para agregar otro: sube la imagen a /public/proxys/ y copia un bloque.
export const extendedPacks = [
  { id: "px-e1", name: "Eevee · Bosque", price: 40, image: "/proxys/ExtendedArt/EA-GemPack-Eevee.png", grad: ["#4ade80", "#166534"] },
];

// Personalizados: tipos de pedido
export const customTypes = [
  { id: "carta", emoji: "🃏", label: "Carta con tu diseño" },
  { id: "arte", emoji: "🎨", label: "Arte alternativo" },
  { id: "foto", emoji: "📸", label: "Con tu foto" },
  { id: "otro", emoji: "✨", label: "Otra idea" },
];

// Decks (lista completa de proxys de un mazo)
export const decks = [
  { id: "px-d1", name: "Charizard ex", style: "Meta · Fuego", cards: 60, price: 180, grad: ["#fb923c", "#ef4444"] },
  { id: "px-d2", name: "Gardevoir ex", style: "Meta · Psíquico", cards: 60, price: 180, grad: ["#f9a8d4", "#8b5cf6"] },
  { id: "px-d3", name: "Lugia VSTAR", style: "Meta · Incoloro", cards: 60, price: 170, grad: ["#bae6fd", "#6366f1"] },
];