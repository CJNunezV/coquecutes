// ───────────── VENDER TUS PRODUCTOS (lo que Coquecutes te paga) ─────────────
// Edita aquí los precios. La página /vender los lee de este archivo.

// Compra por lote: `por100` = soles que pagamos por cada 100 cartas (se calcula proporcional).
export const lotes = [
  { id: "basicas", label: "Cartas básicas", detalle: "Comunes y poco comunes (acabado normal)", por100: 15, emoji: "🃏" },
  { id: "holoReverse", label: "Holo / Reverse", detalle: "Holo y Reverse liso", por100: 20, emoji: "✨" },
  { id: "patron", label: "Holo · Patrón", detalle: "Reverse Holo con patrón", por100: 30, emoji: "🌟" },
];

// Cartas de valor: pagamos S/ por cada US$ de valor de mercado de la carta (rango según estado y cantidad).
export const valor = [
  { id: "ex", label: "Cartas ex", min: 3.0, max: 3.1, emoji: "💎" },
  { id: "fa", label: "Full Art (FA)", min: 2.8, max: 3.0, emoji: "🎨" },
  { id: "irsir", label: "IR · SIR (Illustration Rare / Special)", min: 2.7, max: 2.85, emoji: "🌈" },
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
