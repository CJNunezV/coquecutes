// ───────────────────────── SUBASTAS COQUECUTES ─────────────────────────
// Las subastas se hacen en Facebook (Coquecutes TCG Store). La web solo muestra
// el calendario, la cuenta regresiva, las reglas y manda a Facebook.
//
// 1) CALENDARIO: 3 subastas por semana (lunes, miércoles y viernes).
//    El número se calcula solo desde `referencia` (lunes 26/10/2026 = Subasta #91).
//    Si algún día se descuadra, corrige `referencia`.
// 2) QUÉ SE SUBASTA cada día: cambia `tipo` en `calendario` ("figuras" | "cartas" | "proxys").
// 3) LINKS: pega en `facebook.pagina` el link de tu página y, por cada subasta, el link
//    del álbum en `albumes` (ej: 91: "https://www.facebook.com/media/set/?set=a.123...").
//    Si una subasta no tiene álbum, el botón manda a la página.

export const subastaConfig = {
  referencia: { numero: 91, fecha: "2026-10-26" }, // fecha de cierre de la subasta #91
  horaCierre: "22:00",                             // 10 PM, hora de Perú (UTC-5)
  pujaInicial: 1,                                  // las ofertas empiezan desde S/1.00
  seguidores: "600+",                              // seguidores en Facebook
};

export const facebook = {
  nombre: "Coquecutes TCG Store",
  pagina: "", // ← pega aquí el link de tu página de Facebook
};

export const albumes = {
  // 91: "https://www.facebook.com/...",
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

// Reglas (tomadas del flyer de la Subasta #91)
export const reglas = [
  { n: 1, titulo: "Productos", texto: "Cada publicación indica el producto y la hora exacta de cierre." },
  { n: 2, titulo: "Pujas", texto: "Las ofertas empiezan desde S/1.00. No se aceptan céntimos." },
  { n: 3, titulo: "Ganador", texto: "Al finalizar el tiempo de cierre, la oferta más alta será la ganadora. No está permitido editar ni eliminar las pujas." },
  { n: 4, titulo: "Entregas", texto: "Puntos de entrega: Arenales, Full Market o Expocentro. En otro caso, los envíos se hacen por Shalom/Olva." },
];

export const sorteo = "Los domingos cada subasta ganada vale 2 tickets.";
