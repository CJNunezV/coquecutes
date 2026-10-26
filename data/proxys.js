// ⚠️ DATOS DE EJEMPLO: reemplaza nombres, precios e imágenes por los reales.
// Para usar fotos: agrega  image: "/proxys/nombre.jpg"  a cualquier item.

// ─────────────────────────────────────────────────────────────
// TIPOS DE PROXY (acabados) que el cliente puede elegir.
// Cada uno puede tener un video que explica de qué trata y cómo queda el acabado final.
//
//  extra   → soles que se SUMAN al precio base (0 = mismo precio)
//  video   → "/proxys/videos/frio.mp4"  (archivo en /public/proxys/videos/)
//            o un link de YouTube / Vimeo: "https://youtu.be/XXXX"
//  poster  → imagen de portada del video (opcional): "/proxys/videos/frio.jpg"
//  summary → 1 línea que se ve en las tarjetas
//  desc    → explicación: de qué trata este tipo
//  finish  → cómo queda el acabado final (lo que verá el cliente)
//  bestFor → para qué conviene (opcional)
// Si dejas un campo vacío ("") simplemente no se muestra.
// ⚠️ Completa con la información real de cada tipo.
// ─────────────────────────────────────────────────────────────
export const proxyTypes = [
  { id: "frio", singlePrice: 12, label: "En frío", extra: 0, emoji: "❄️", summary: "", desc: "", finish: "", bestFor: "", video: "", poster: "" },
  { id: "crema", singlePrice: 14, label: "Con crema", extra: 0, emoji: "🍦", summary: "", desc: "", finish: "", bestFor: "", video: "", poster: "" },
  { id: "calor", singlePrice: 16, label: "Al calor", extra: 0, emoji: "🔥", summary: "", desc: "", finish: "", bestFor: "", video: "", poster: "" },
];

// Información general que se muestra en "Lo que recibes" (editable)
export const proxyInfo = {
  size: "Tamaño carta estándar (63 × 88 mm)",
  shipping: "Envío a todo el país",
  disclaimer: "Los proxys son reproducciones para coleccionismo y juego casual. No son cartas oficiales ni se venden como originales.",
};

// Cartas sueltas (1 proxy por ítem). El precio depende del acabado: ver `singlePrice` en proxyTypes (12 / 14 / 16).
// El campo `price` de cada carta ya no se usa para las sueltas.
export const singles = [
  { id: "px-s7", name: "Totoro Poncho Pikachu", set: "Fan Art · Promo", price: 15, grad: ["#86efac", "#166534"], image: "/proxys/Singles/0ae16301-89cf-4a50-a111-edd2766caad7.jpg" },
  { id: "px-s8", name: "Dear Santa Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#ef4444", "#7f1d1d"], image: "/proxys/Singles/671a8399-83b8-4dd4-b9fe-e4ecfa0589f0.jpg" },
  { id: "px-s9", name: "Ugly Sweater Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#22c55e", "#b91c1c"], image: "/proxys/Singles/a8356bc4-2897-4b66-95be-3308a86f831c.jpg" },
  { id: "px-s10", name: "Playful Mew ex", set: "Fan Art · Navidad", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/ecac42ad-ea1e-41b7-9d6c-090b3c34ecc0.jpg" },
  { id: "px-s1", name: "Poncho Pikachu Charizard X", set: "Obsidian Flames", price: 15, grad: ["#fb923c", "#ef4444"], image: "/proxys/Singles/poncho-charizard-x.avif" },
  { id: "px-s2", name: "Poncho Pikachu Charizard Y", set: "Surging Sparks", price: 15, grad: ["#fde047", "#f59e0b"], image: "/proxys/Singles/poncho-charizard-y.avif" },
  { id: "px-s3", name: "Poncho Pikachu Rayquaza", set: "151", price: 15, grad: ["#c4b5fd", "#ec4899"], image: "/proxys/Singles/poncho-rayquaza.avif" },
  { id: "px-s4", name: "Poncho Pikachu Rayquaza Shiny", set: "Evolving Skies", price: 16, grad: ["#1e1b4b", "#6366f1"], image: "/proxys/Singles/poncho-rayquaza-shiny.avif" },
  { id: "px-s5", name: "Poncho Pikachu Magikarp", set: "Fusion Strike", price: 15, grad: ["#7c3aed", "#312e81"], image: "/proxys/Singles/poncho-magikarp.avif" },
  { id: "px-s6", name: "Poncho Pikachu Gyarados", set: "Silver Tempest", price: 15, grad: ["#bae6fd", "#6366f1"], image: "/proxys/Singles/poncho-gyarados.avif" },
];

// Extended Art: cada item = el arte completo de 3x3. Se venden las 8 cartas que rodean al centro;
// la carta CENTRAL no está incluida (en la foto aparece solo de referencia).
// Para agregar otro: sube la imagen a /public/proxys/ExtendedArt/ y copia un bloque.
// "center" (opcional) = posición de la carta central en la imagen, en % (left, top, w, h).
export const extendedPacks = [
  { id: "px-e1", name: "Eevee · Bosque", price: 40, image: "/proxys/ExtendedArt/EA-GemPack-Eevee.png", grad: ["#4ade80", "#166534"] },
  { id: "px-e2", name: "Ampharos · Colinas", price: 40, image: "/proxys/ExtendedArt/Ampharos.png", grad: ["#fbbf24", "#6366f1"], center: { left: 33.6, top: 33.8, w: 33, h: 32.6 } },
  { id: "px-e3", name: "Lapras · Atardecer", price: 40, image: "/proxys/ExtendedArt/lapras.png", grad: ["#fb923c", "#0ea5e9"], center: { left: 34, top: 33.8, w: 33, h: 32.6 } },
  { id: "px-e4", name: "Riolu · Ciudad", price: 40, image: "/proxys/ExtendedArt/riolu.png", grad: ["#38bdf8", "#ef4444"], center: { left: 34, top: 33.6, w: 33, h: 32.8 } },
];

// Personalizados: tipos de pedido
export const customTypes = [
  { id: "graduacion", emoji: "🎓", label: "Graduación" },
  { id: "cumple", emoji: "🎂", label: "Cumpleaños" },
  { id: "boda", emoji: "💍", label: "Boda / Pareja" },
  { id: "familia", emoji: "👨‍👩‍👧", label: "Familia o retrato" },
  { id: "otro", emoji: "✨", label: "Otra idea" },
];

// Ejemplos de personalizados (fotos en /public/proxys/Personalizados/). cat = id de customTypes.
// Para agregar otro: sube la imagen y copia un bloque.
export const customExamples = [
  { id: "ce1", cat: "graduacion", title: "Graduación junto a Lapras", image: "/proxys/Personalizados/graduacion-1.webp" },
  { id: "ce2", cat: "graduacion", title: "Graduación al atardecer", image: "/proxys/Personalizados/graduacion-2.webp" },
  { id: "ce3", cat: "cumple", title: "Cumpleaños con Pikachu y Eevee", image: "/proxys/Personalizados/cumple-1.webp" },
  { id: "ce4", cat: "cumple", title: "Cumpleaños con globos", image: "/proxys/Personalizados/cumple-2.webp" },
  { id: "ce5", cat: "boda", title: "Baile de bodas", image: "/proxys/Personalizados/boda-1.webp" },
  { id: "ce6", cat: "boda", title: "Boda en el jardín", image: "/proxys/Personalizados/boda-2.webp" },
  { id: "ce7", cat: "familia", title: "Picnic en familia", image: "/proxys/Personalizados/familia-1.webp" },
  { id: "ce8", cat: "familia", title: "Retrato entre flores", image: "/proxys/Personalizados/retrato-1.webp" },
];

// Decks (lista completa de proxys de un mazo). "images" = 3 fotos de cartas del mazo (public/proxys/Decks/<carpeta>/...). Ejemplos del meta: ajusta nombre, precio y "core" (cartas clave).
export const decks = [
  { id: "px-d1", name: "Dragapult ex", style: "Meta · Dragón / Fantasma", core: "Dragapult ex · Drakloak · Dreepy", cards: 60, price: 60, images: ["/proxys/Decks/Dragapult ex/610520_in_1000x1000.jpg", "/proxys/Decks/Dragapult ex/676060_in_1000x1000.jpg", "/proxys/Decks/Dragapult ex/676059_in_1000x1000.jpg"], grad: ["#a78bfa", "#4338ca"] },
  { id: "px-d2", name: "Festival Lead", style: "Meta · Planta", core: "Dipplin · Applin · Grookey", cards: 60, price: 60, images: ["/proxys/Decks/Festival/550214_in_1000x1000.jpg", "/proxys/Decks/Festival/550229_in_1000x1000.jpg", "/proxys/Decks/Festival/699876_in_1000x1000.jpg"], grad: ["#f9a8d4", "#16a34a"] },
  { id: "px-d3", name: "Ogerpon · Clefairy", style: "Meta · Planta / Hada", core: "Ogerpon ex · Clefairy · Latias ex", cards: 60, price: 60, images: ["/proxys/Decks/Ogerpon/610500_in_1000x1000.jpg", "/proxys/Decks/Ogerpon/676092_in_1000x1000.jpg", "/proxys/Decks/Ogerpon/589985_in_1000x1000.jpg"], grad: ["#6ee7b7", "#db2777"] },
  { id: "px-d4", name: "Hydrapple", style: "Meta · Planta", core: "Hydrapple · Ogerpon ex · Meganium", cards: 60, price: 60, images: ["/proxys/Decks/hydrapple/567472_in_1000x1000.jpg", "/proxys/Decks/hydrapple/610500_in_1000x1000.jpg", "/proxys/Decks/hydrapple/654349_in_1000x1000.jpg"], grad: ["#bef264", "#15803d"] },
  { id: "px-d5", name: "Slowking", style: "Meta · Psíquico", core: "Slowking · Mega Kangaskhan ex · Metagross", cards: 60, price: 60, images: ["/proxys/Decks/slowking/567284_in_1000x1000.jpg", "/proxys/Decks/slowking/654521_in_1000x1000.jpg", "/proxys/Decks/slowking/693522_in_1000x1000.jpg"], grad: ["#93c5fd", "#7c3aed"] },
  { id: "px-d6", name: "N's Zoroark", style: "Meta · Oscuridad", core: "N's Zoroark ex · N's Zorua · Pecharunt ex", cards: 60, price: 60, images: ["/proxys/Decks/ns zoroark/623612_in_1000x1000.jpg", "/proxys/Decks/ns zoroark/625182_in_1000x1000.jpg", "/proxys/Decks/ns zoroark/610518_in_1000x1000.jpg"], grad: ["#94a3b8", "#1e1b4b"] },
];
