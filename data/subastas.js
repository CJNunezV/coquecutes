// ───────────────────────── SUBASTAS COQUECUTES ─────────────────────────
// Todo lo de la sección /subastas se maneja desde este archivo.
//
// 1) CALENDARIO: 3 subastas por semana (lunes, miércoles y viernes).
//    El número de subasta se calcula solo a partir de `referencia`:
//    hoy lunes 26/10/2026 = Subasta #91, el miércoles 28/10 = #92, el viernes 30/10 = #93, etc.
//    Si algún día se cuenta mal, solo corrige `referencia`.
// 2) QUÉ SE SUBASTA cada día: cambia `tipo` en `calendario` ("figuras" | "cartas" | "proxys").
//    (Supuesto inicial: lunes = cartas, miércoles = figuras, viernes = proxys — ajústalo.)
// 3) LOTES: agrega objetos a `lotes` con el número de subasta (`subasta`).
//    Para actualizar una puja, edita `ofertaActual` (déjalo en null si aún no hay ofertas).
//    Fotos: súbelas a /public/subastas/ y pon image: "/subastas/mi-foto.webp".
// 4) RESULTADOS: cuando cierre una subasta, agrega una fila en `resultados`.

export const subastaConfig = {
  referencia: { numero: 91, fecha: "2026-10-26" }, // fecha en que cierra la subasta #91 (lunes)
  horaCierre: "21:00",                             // hora de Perú (UTC-5)
  incremento: 1,                                   // puja mínima sobre la oferta actual (S/)
  extension: "Si entra una oferta en los últimos 5 minutos, el cierre se extiende 5 minutos más.", // pon "" para quitarlo
};

export const calendario = [
  // dia: 0=Domingo ... 1=Lunes ... 3=Miércoles ... 5=Viernes
  { dia: 1, tipo: "cartas" },
  { dia: 3, tipo: "figuras" },
  { dia: 5, tipo: "proxys" },
];

export const tiposSubasta = {
  cartas:  { label: "Cartas",  emoji: "🃏", grad: ["#7c3aed", "#c026d3"] },
  figuras: { label: "Figuras", emoji: "🗿", grad: ["#0ea5e9", "#6366f1"] },
  proxys:  { label: "Proxys",  emoji: "✨", grad: ["#f59e0b", "#ef4444"] },
};

// precioBase y ofertaActual en soles. demo:true = lote de ejemplo (bórralos al cargar los reales).
export const lotes = [
  { id: "l91-1", subasta: 91, nombre: "Charizard ex (Obsidian Flames)", detalle: "Inglés · Holo · Near Mint", precioBase: 15, ofertaActual: 22, image: "", demo: true },
  { id: "l91-2", subasta: 91, nombre: "Lote 10 cartas Holo variadas", detalle: "Español/Inglés · Mix de expansiones", precioBase: 8, ofertaActual: null, image: "", demo: true },
  { id: "l91-3", subasta: 91, nombre: "Pikachu Illustration (promo)", detalle: "Inglés · Near Mint", precioBase: 12, ofertaActual: 14, image: "", demo: true },
  { id: "l92-1", subasta: 92, nombre: "Figura Gengar 15 cm", detalle: "Nueva en caja", precioBase: 25, ofertaActual: null, image: "", demo: true },
  { id: "l92-2", subasta: 92, nombre: "Figura Eevee articulada", detalle: "Sin caja · Excelente estado", precioBase: 18, ofertaActual: null, image: "", demo: true },
  { id: "l93-1", subasta: 93, nombre: "Proxy Umbreon VMAX Alt Art", detalle: "Acabado con crema", precioBase: 6, ofertaActual: null, image: "", demo: true },
];

// { subasta: 90, tipo: "cartas", lote: "Mewtwo ex", precio: 18, ganador: "J. P." }
export const resultados = [];
