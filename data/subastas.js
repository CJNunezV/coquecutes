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

// CALENDARIO DEL MES (el que publicas en el flyer). Una entrada por mes.
//   t: "subasta" (n = número de subasta) | "envio" (Shalom/Olva) | "entrega" (FM/Arenales) | "sorteo" (gran sorteo mensual)
//   tipo (opcional, solo subastas): "cartas" | "figuras" | "proxys". Si lo dejas vacío se muestra solo "Subasta".
// Para el mes siguiente: copia un bloque, cambia year/month y los días. La subasta "actual" y la cuenta regresiva
// salen solas de aquí (hora de cierre = subastaConfig.horaCierre).
export const calendarioMeses = [
  { year: 2026, month: 11, eventos: [
    { d: 2, t: "subasta", n: 94 }, { d: 4, t: "subasta", n: 95 }, { d: 6, t: "subasta", n: 96 },
    { d: 7, t: "entrega" }, { d: 8, t: "subasta", n: 97 },
    { d: 10, t: "envio" }, { d: 11, t: "subasta", n: 98 }, { d: 13, t: "subasta", n: 99 },
    { d: 14, t: "entrega" }, { d: 15, t: "subasta", n: 100 },
    { d: 18, t: "subasta", n: 101 }, { d: 20, t: "subasta", n: 102 },
    { d: 21, t: "entrega" }, { d: 22, t: "subasta", n: 103 },
    { d: 24, t: "envio" }, { d: 25, t: "subasta", n: 104 }, { d: 27, t: "subasta", n: 105 },
    { d: 28, t: "entrega" }, { d: 29, t: "subasta", n: 106 },
    { d: 30, t: "sorteo" },
  ] },
];

// (Antiguo) patrón semanal: solo se usa si `calendarioMeses` está vacío.
export const calendario = [
  // dia: 0=Domingo ... 1=Lunes ... 3=Miércoles ... 5=Viernes
  { dia: 1, tipo: "cartas" },
  { dia: 3, tipo: "figuras" },
  { dia: 5, tipo: "proxys" },
];

export const tiposSubasta = {
  subasta: { label: "Subasta", emoji: "🔨", grad: ["#8f2858", "#d2406f"] },
  cartas:  { label: "Cartas",  emoji: "🃏", grad: ["#d2406f", "#f0789a"] },
  figuras: { label: "Figuras", emoji: "🗿", grad: ["#1f9e8e", "#4fbfae"] },
  proxys:  { label: "Proxys",  emoji: "✨", grad: ["#e0a02e", "#ea6f98"] },
};

// Reglas (tomadas del flyer de la Subasta #91)
export const reglas = [
  { n: 1, titulo: "Productos", texto: "Cada publicación indica el producto y la hora exacta de cierre." },
  { n: 2, titulo: "Pujas", texto: "Las ofertas empiezan desde S/1.00. No se aceptan céntimos." },
  { n: 3, titulo: "Ganador", texto: "Al finalizar el tiempo de cierre, la oferta más alta será la ganadora. No está permitido editar ni eliminar las pujas." },
  { n: 4, titulo: "Entregas", texto: "Puntos de entrega: Arenales, Full Market o Expocentro. En otro caso, los envíos se hacen por Shalom/Olva." },
];

export const sorteo = "Los domingos cada subasta ganada vale 2 tickets. El gran sorteo es el último día del mes.";
