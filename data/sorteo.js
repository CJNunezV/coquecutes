// ───────────────────────── SORTEO DEL MES ─────────────────────────
// Cada mes: cambia `mes`, `flyer` y los `premios`. Para el carrusel de ganadores,
// sube la foto a /public/ganadores/ y agrégala a `ganadores` (nombre y premio son opcionales).

export const sorteo = {
  mes: "Octubre 2026",
  flyer: "/sorteo/octubre-2026.webp",
  fechaSorteo: "", // ej: "2026-10-31T21:00:00-05:00" → muestra cuenta regresiva. Vacío = "Fin de mes".
  transmision: "Se realiza en vivo por Facebook", // pon "" para quitarlo
};

export const premios = [
  { puesto: 1, titulo: "First Partner", detalle: "Edición en chino · Una pieza de colección que puede ser tuya.", emoji: "🏆", grad: ["#f59e0b", "#ec4899"] },
  { puesto: 2, titulo: "Poké Ball", detalle: "Edición en inglés", emoji: "🔴", grad: ["#ef4444", "#be185d"] },
  { puesto: 3, titulo: "Deck TCG", detalle: "Producto ideal para jugadores de Pokémon TCG", emoji: "🎁", grad: ["#8b5cf6", "#6366f1"] },
];

export const tickets = [
  { emoji: "🔨", titulo: "Gana una subasta", texto: "Cada subasta ganada (son interdiarias) = 1 ticket." },
  { emoji: "2️⃣✖️", titulo: "Los domingos x2", texto: "Cada subasta ganada en domingo = 2 tickets." },
  { emoji: "🎟️", titulo: "Ejemplo", texto: "5 subastas ganadas un domingo = 10 tickets." },
];

export const ganadores = [
  { img: "/ganadores/ganador-1.webp", nombre: "", premio: "" },
  { img: "/ganadores/ganador-2.webp", nombre: "", premio: "" },
  { img: "/ganadores/ganador-3.webp", nombre: "", premio: "" },
  { img: "/ganadores/ganador-4.webp", nombre: "", premio: "" },
  { img: "/ganadores/ganador-5.webp", nombre: "", premio: "" },
];
