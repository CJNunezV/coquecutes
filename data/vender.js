// ───────────── VENDER TUS PRODUCTOS (lo que Coquecutes te paga) ─────────────
// Edita aquí los precios. La página /vender los lee de este archivo.

// `ejemplos`: fotos de ejemplo (rutas dentro de /public) que se muestran bajo cada precio.
// Compra por lote: `por100` = soles que pagamos por cada 100 cartas (se calcula proporcional).
export const lotes = [
  { id: "basicas", ejemplos: ["/cartas/cs-pal-004-en-n.webp", "/cartas/cs-meg-006-en-n.webp", "/cartas/cs-obf-012-en-n.webp"], label: "Cartas básicas", detalle: "Comunes y poco comunes (acabado normal)", por100: 15, emoji: "🃏" },
  { id: "holoReverse", ejemplos: ["/proxys/Decks/slowking/567284_in_1000x1000.jpg", "/proxys/Decks/hydrapple/654349_in_1000x1000.jpg", "/proxys/Decks/slowking/693522_in_1000x1000.jpg"], label: "Holo / Reverse", detalle: "Holo y Reverse liso", por100: 20, emoji: "✨" },
  { id: "patron", ejemplos: ["/proxys/Decks/Dragapult ex/676059_in_1000x1000.jpg", "/proxys/Decks/Dragapult ex/676060_in_1000x1000.jpg", "/proxys/Decks/Festival/550214_in_1000x1000.jpg"], label: "Holo · Patrón", detalle: "Reverse Holo con patrón", por100: 30, emoji: "🌟" },
];

// Cartas de valor: pagamos S/ por cada US$ de valor de mercado de la carta (rango según estado y cantidad).
export const valor = [
  { id: "ex", ejemplos: ["/proxys/Decks/Dragapult ex/610520_in_1000x1000.jpg", "/proxys/Decks/Ogerpon/589985_in_1000x1000.jpg", "/proxys/Decks/Ogerpon/676092_in_1000x1000.jpg"], label: "Cartas ex", min: 3.0, max: 3.1, emoji: "💎" },
  { id: "fa", ejemplos: ["/proxys/Decks/hydrapple/567472_in_1000x1000.jpg", "/proxys/Decks/ns zoroark/623612_in_1000x1000.jpg", "/proxys/Decks/ns zoroark/610518_in_1000x1000.jpg"], label: "Full Art (FA)", min: 2.8, max: 3.0, emoji: "🎨" },
  { id: "irsir", ejemplos: ["/CartasSueltas/par.253.altaria_ex.png", "/proxys/ExtendedArt/cartas/pre-glaceon-ex-150-131.jpg", "/proxys/ExtendedArt/cartas/dre-groudon-84.jpg"], label: "IR · SIR (Illustration Rare / Special)", min: 2.7, max: 2.85, emoji: "🌈" },
];

export const pasos = [
  { n: 1, titulo: "Escríbenos", texto: "Cuéntanos qué quieres vender: cantidad de cartas o la lista de cartas de valor." },
  { n: 2, titulo: "Envíanos fotos", texto: "Fotos claras de tus cartas (o del lote) para confirmar estado y cantidad." },
  { n: 3, titulo: "Te cotizamos", texto: "Revisamos y te damos el monto final según estas tarifas." },
  { n: 4, titulo: "Entrega y pago", texto: "Nos vemos en un punto de entrega o lo envías, y te pagamos por Yape / Plin o transferencia." },
];

export const notas = [
  "Los precios son referenciales y pueden variar según el estado de las cartas y la cantidad.",
  "Pagamos por cartas en buen estado (sin dobleces fuertes, manchas ni humedad).",
  "Las cartas de valor se cotizan con el precio de mercado del día en dólares.",
  "Para lotes grandes, escríbenos y coordinamos la revisión.",
];
