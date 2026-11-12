// ⚠️ DATOS DE EJEMPLO: reemplaza nombres, precios e imágenes por los reales.
// Para usar fotos: agrega  image: "/proxys/nombre.jpg"  a cualquier item.

// ─────────────────────────────────────────────────────────────
// TIPOS DE PROXY (acabados) que el cliente puede elegir.
// Cada uno puede tener un video que explica de qué trata y cómo queda el acabado final.
//
//  singlePrice → precio de 1 carta suelta (al detal)
//  bulkPrice   → precio por carta AL POR MAYOR (desde `proxyInfo.bulkMin` proxys sueltos en total, de cualquier diseño)
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
  { id: "holo", singlePrice: 13, bulkPrice: 10, label: "Papel holográfico", extra: 0, emoji: "🌈", summary: "Impreso en papel holográfico con brillo.", desc: "", finish: "", bestFor: "", video: "", poster: "" },
  { id: "relieve", singlePrice: 15, bulkPrice: 13, label: "Relieve manual", extra: 0, emoji: "🖌️", summary: "Detalles en relieve pintados a mano.", desc: "", finish: "", bestFor: "", video: "", poster: "" },
];

// Información general que se muestra en "Lo que recibes" (editable)
export const proxyInfo = {
  size: "Tamaño carta estándar (63 × 88 mm)",
  shipping: "Envío a todo el país",
  disclaimer: "Son PROXYS (fan made): reproducciones para coleccionar, jugar y disfrutar. No son cartas originales ni oficiales de Pokémon.",
  // A partir de cuántos proxys sueltos (de CUALQUIER diseño, sumados) se aplica el precio al por mayor.
  // Cada carta paga el precio mayorista de su acabado (holo / relieve).
  bulkMin: 5,
  // Mensaje bonito que se muestra arriba en la página de Proxys
  fanMadeTitle: "Son PROXYS, no cartas originales",
  fanMadeText: "Cada carta es una reproducción fan made, hecha con mucho cariño para que juegues, colecciones y disfrutes sin gastar de más. No son cartas oficiales de Pokémon ni se venden como originales: tus cartas originales merecen seguir cuidadas en su toploader. 💗",
};

// Cartas sueltas (1 proxy por ítem). El precio depende del acabado: ver `singlePrice` en proxyTypes (ver proxyTypes: 13 / 15 · al por mayor 10 / 13).
// El campo `price` de cada carta ya no se usa para las sueltas.
// Temas de las cartas sueltas (cada carta tiene `tema`). El orden de esta lista es el orden de las secciones en la página.
export const singleTemas = [
  { id: "Navidad", emoji: "🎄", desc: "Cartas navideñas para regalar y coleccionar" },
  { id: "Año Nuevo", emoji: "🎆", desc: "Para recibir el año con fuegos artificiales" },
  { id: "Perú", emoji: "🇵🇪", desc: "Hechas con sabor peruano: combi, pichanga, ceviche…" },
  { id: "Universidades", emoji: "🎓", desc: "UNI, PUCP, San Marcos, UPC y más" },
  { id: "Ponchos y Anime", emoji: "⚡", desc: "Pikachu con poncho y crossovers de anime" },
  { id: "Naturaleza", emoji: "🌙", desc: "Escenas tranquilas, de noche y de campo" },
];

// Para agregar una carta: copia una línea, cambia name/image y elige su `tema` (de singleTemas).
// `thumb` (opcional) es una miniatura liviana para la lista; `nuevo: true` muestra la etiqueta NUEVO.
export const singles = [
  { id: "px-s16", name: "La Pichanga ex", set: "Fan Art · Perú", tema: "Perú", price: 15, grad: ["#ef4444", "#fde68a"], image: "/proxys/Singles/85151a0e-8d70-4a06-8cfb-bc3ef19995e2.jpg", thumb: "/proxys/Singles/t/85151a0e-8d70-4a06-8cfb-bc3ef19995e2.webp", nuevo: true },
  { id: "px-s17", name: "La Combi ex", set: "Fan Art · Perú", tema: "Perú", price: 15, grad: ["#ef4444", "#fde68a"], image: "/proxys/Singles/267c789a-dcd7-466a-89c4-634982b0d1e2.jpg", thumb: "/proxys/Singles/t/267c789a-dcd7-466a-89c4-634982b0d1e2.webp", nuevo: true },
  { id: "px-s18", name: "La Mancha ex", set: "Fan Art · Perú", tema: "Perú", price: 15, grad: ["#ef4444", "#fde68a"], image: "/proxys/Singles/1262d61f-b4ec-4729-ba81-33cc195fccca.jpg", thumb: "/proxys/Singles/t/1262d61f-b4ec-4729-ba81-33cc195fccca.webp", nuevo: true },
  { id: "px-s19", name: "New Year Pikachu ex", set: "Fan Art · Año Nuevo", tema: "Año Nuevo", price: 15, grad: ["#fbbf24", "#7c3aed"], image: "/proxys/Singles/f0472c19-583a-4a21-9a33-eb9eb388fedd.jpg", thumb: "/proxys/Singles/t/f0472c19-583a-4a21-9a33-eb9eb388fedd.webp", nuevo: true },
  { id: "px-s20", name: "San Marcos Pikachu ex", set: "Fan Art · Universidades", tema: "Universidades", price: 15, grad: ["#38bdf8", "#1d4ed8"], image: "/proxys/Singles/343dc68e-3a3d-4454-97e4-0cce11c9be5a.jpg", thumb: "/proxys/Singles/t/343dc68e-3a3d-4454-97e4-0cce11c9be5a.webp", nuevo: true },
  { id: "px-s21", name: "UPC Pikachu ex", set: "Fan Art · Universidades", tema: "Universidades", price: 15, grad: ["#38bdf8", "#1d4ed8"], image: "/proxys/Singles/13ad79fb-93bf-45c3-993d-f2e135066a79.jpg", thumb: "/proxys/Singles/t/13ad79fb-93bf-45c3-993d-f2e135066a79.webp", nuevo: true },
  { id: "px-s22", name: "PUCP Pikachu ex", set: "Fan Art · Universidades", tema: "Universidades", price: 15, grad: ["#38bdf8", "#1d4ed8"], image: "/proxys/Singles/2feb814a-daf0-4d15-88b5-f32a6e2416cc.jpg", thumb: "/proxys/Singles/t/2feb814a-daf0-4d15-88b5-f32a6e2416cc.webp", nuevo: true },
  { id: "px-s23", name: "UNI Pikachu ex", set: "Fan Art · Universidades", tema: "Universidades", price: 15, grad: ["#38bdf8", "#1d4ed8"], image: "/proxys/Singles/57e950ee-5718-4bfa-95ef-d342757ac0f8.jpg", thumb: "/proxys/Singles/t/57e950ee-5718-4bfa-95ef-d342757ac0f8.webp", nuevo: true },
  { id: "px-s24", name: "Foodie Snorlax ex", set: "Fan Art · Perú", tema: "Perú", price: 15, grad: ["#ef4444", "#fde68a"], image: "/proxys/Singles/efc702d2-5c1c-4799-87d8-65cbd418073e.jpg", thumb: "/proxys/Singles/t/efc702d2-5c1c-4799-87d8-65cbd418073e.webp", nuevo: true },
  { id: "px-s25", name: "Sailor Poncho Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/f23a7dd4-fa78-442c-9d11-23aee4de972a.jpg", thumb: "/proxys/Singles/t/f23a7dd4-fa78-442c-9d11-23aee4de972a.webp", nuevo: true },
  { id: "px-s26", name: "Luffy Poncho Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/6752ba58-428a-4dcd-9daf-746ee6205b4c.jpg", thumb: "/proxys/Singles/t/6752ba58-428a-4dcd-9daf-746ee6205b4c.webp", nuevo: true },
  { id: "px-s27", name: "Totoro Poncho Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/f0c529ec-863c-4d9c-b8c3-8174843665a4.jpg", thumb: "/proxys/Singles/t/f0c529ec-863c-4d9c-b8c3-8174843665a4.webp", nuevo: true },
  { id: "px-s28", name: "Naruto Poncho Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/4c75efb0-7fdf-4429-9ed7-dfd9cba75d16.jpg", thumb: "/proxys/Singles/t/4c75efb0-7fdf-4429-9ed7-dfd9cba75d16.webp", nuevo: true },
  { id: "px-s29", name: "Vegeta Poncho Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/6a73b668-2fdc-461a-a094-6177835d5d30.jpg", thumb: "/proxys/Singles/t/6a73b668-2fdc-461a-a094-6177835d5d30.webp", nuevo: true },
  { id: "px-s30", name: "Goku Poncho Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/1ef62d01-e0a2-4c6b-9131-1110328f670f.jpg", thumb: "/proxys/Singles/t/1ef62d01-e0a2-4c6b-9131-1110328f670f.webp", nuevo: true },
  { id: "px-s31", name: "Umbreon ex · Moonlit Night", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/c4759227-7346-459e-8cfb-8c66ecad9d31.jpg", thumb: "/proxys/Singles/t/c4759227-7346-459e-8cfb-8c66ecad9d31.webp", nuevo: true },
  { id: "px-s32", name: "Jirachi ex · Aurora Wish", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/700568f1-38b6-4bb4-af5f-d231af038bd1.jpg", thumb: "/proxys/Singles/t/700568f1-38b6-4bb4-af5f-d231af038bd1.webp", nuevo: true },
  { id: "px-s33", name: "Sylveon ex · Frost Ribbon", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/d1bf7186-1a5e-4d81-8b51-7b1c2f378491.jpg", thumb: "/proxys/Singles/t/d1bf7186-1a5e-4d81-8b51-7b1c2f378491.webp", nuevo: true },
  { id: "px-s34", name: "Pikachu ex · Winter Spark", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/8f27bd37-0511-44e5-a6b7-5377e896f57b.jpg", thumb: "/proxys/Singles/t/8f27bd37-0511-44e5-a6b7-5377e896f57b.webp", nuevo: true },
  { id: "px-s35", name: "Sylveon ex · Ribbon Party", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/3463d2d2-e9fe-4b40-88e1-8846391443f9.jpg", thumb: "/proxys/Singles/t/3463d2d2-e9fe-4b40-88e1-8846391443f9.webp", nuevo: true },
  { id: "px-s36", name: "Eevee ex · Gift Surprise", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/c247c989-fac2-4a3d-ac0d-2ce297885ecb.jpg", thumb: "/proxys/Singles/t/c247c989-fac2-4a3d-ac0d-2ce297885ecb.webp", nuevo: true },
  { id: "px-s37", name: "Pikachu ex · Christmas Parade", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/543001b8-0455-4c9d-8d3d-eb9d268f1398.jpg", thumb: "/proxys/Singles/t/543001b8-0455-4c9d-8d3d-eb9d268f1398.webp", nuevo: true },
  { id: "px-s38", name: "Jirachi ex · Advent Wish", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/21dfda5a-1753-4b31-899f-68d42393c07d.jpg", thumb: "/proxys/Singles/t/21dfda5a-1753-4b31-899f-68d42393c07d.webp" },
  { id: "px-s39", name: "Sylveon ex · Ribbon Dance", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/244ad7b8-1116-494f-8bd0-16acbc74f26f.jpg", thumb: "/proxys/Singles/t/244ad7b8-1116-494f-8bd0-16acbc74f26f.webp" },
  { id: "px-s40", name: "Ditto ex · Santa Copy", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/0919b1d7-1275-4662-928a-3bc23288e4d1.jpg", thumb: "/proxys/Singles/t/0919b1d7-1275-4662-928a-3bc23288e4d1.webp" },
  { id: "px-s41", name: "Mimikyu ex · Best Friend's Gift", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/5561dea2-97a1-4d64-8017-3715fd04575d.jpg", thumb: "/proxys/Singles/t/5561dea2-97a1-4d64-8017-3715fd04575d.webp" },
  { id: "px-s42", name: "Lucario ex · Aura of Light", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/1b8ad6a4-f95b-4a53-b943-caafc3748d38.jpg", thumb: "/proxys/Singles/t/1b8ad6a4-f95b-4a53-b943-caafc3748d38.webp" },
  { id: "px-s43", name: "Charizard ex · Warm Embrace", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/bb1709c8-ca4a-47ab-af93-c95cedba7f27.jpg", thumb: "/proxys/Singles/t/bb1709c8-ca4a-47ab-af93-c95cedba7f27.webp" },
  { id: "px-s44", name: "Mew ex · Snow Globe Dream", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/f82f6b53-1e5e-4b48-86e5-f9c68fa87d85.jpg", thumb: "/proxys/Singles/t/f82f6b53-1e5e-4b48-86e5-f9c68fa87d85.webp" },
  { id: "px-s45", name: "Eevee ex · Stocking Surprise", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/6406729c-7029-47eb-8e59-cee70acb827b.jpg", thumb: "/proxys/Singles/t/6406729c-7029-47eb-8e59-cee70acb827b.webp" },
  { id: "px-s46", name: "Snorlax ex · Feast Nap", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/c1036ef7-1c26-4ad2-9e9a-3d9fbbae7a28.jpg", thumb: "/proxys/Singles/t/c1036ef7-1c26-4ad2-9e9a-3d9fbbae7a28.webp" },
  { id: "px-s47", name: "Umbreon ex · Silent Night Glow", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/44890d2f-051b-4ae8-a61e-ff104d77e0c9.jpg", thumb: "/proxys/Singles/t/44890d2f-051b-4ae8-a61e-ff104d77e0c9.webp" },
  { id: "px-s48", name: "Jirachi ex · Starlight Wish", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/b2cb5e8d-7446-411d-8892-1d486735188d.jpg", thumb: "/proxys/Singles/t/b2cb5e8d-7446-411d-8892-1d486735188d.webp" },
  { id: "px-s49", name: "Sylveon ex · Mistletoe Charm", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/45fc0d2e-422b-43f2-8b3a-7a9f6585fec1.jpg", thumb: "/proxys/Singles/t/45fc0d2e-422b-43f2-8b3a-7a9f6585fec1.webp" },
  { id: "px-s50", name: "Ditto ex · Holiday Copy", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/25d79c11-9f64-4f78-93f7-6c4c3074cd96.jpg", thumb: "/proxys/Singles/t/25d79c11-9f64-4f78-93f7-6c4c3074cd96.webp" },
  { id: "px-s51", name: "Pikachu ex · Twinkle Spark", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/56aa96db-1e6c-44b4-a875-f734e1db1079.jpg", thumb: "/proxys/Singles/t/56aa96db-1e6c-44b4-a875-f734e1db1079.webp" },
  { id: "px-s52", name: "Snorlax ex · Big Belly Nap", set: "Fan Art · Naturaleza", tema: "Naturaleza", price: 15, grad: ["#86efac", "#0ea5e9"], image: "/proxys/Singles/1a39857f-4674-4a4c-b1cf-542d7777531e.jpg", thumb: "/proxys/Singles/t/1a39857f-4674-4a4c-b1cf-542d7777531e.webp" },
  { id: "px-s53", name: "Umbreon ex · Moonlit Shadow", set: "Fan Art · Naturaleza", tema: "Naturaleza", price: 15, grad: ["#86efac", "#0ea5e9"], image: "/proxys/Singles/9c3dab42-3157-488e-b9cf-fc614cf9c263.jpg", thumb: "/proxys/Singles/t/9c3dab42-3157-488e-b9cf-fc614cf9c263.webp" },
  { id: "px-s54", name: "Jirachi ex · Starfall Wish", set: "Fan Art · Naturaleza", tema: "Naturaleza", price: 15, grad: ["#86efac", "#0ea5e9"], image: "/proxys/Singles/71a8ebf1-d254-4014-a775-2af1800bb429.jpg", thumb: "/proxys/Singles/t/71a8ebf1-d254-4014-a775-2af1800bb429.webp" },
  { id: "px-s55", name: "Sylveon ex · Ribbon Charm", set: "Fan Art · Naturaleza", tema: "Naturaleza", price: 15, grad: ["#86efac", "#0ea5e9"], image: "/proxys/Singles/6c5039b3-f2f3-4cf8-ac4a-8246281d3838.jpg", thumb: "/proxys/Singles/t/6c5039b3-f2f3-4cf8-ac4a-8246281d3838.webp" },
  { id: "px-s56", name: "Ditto ex · Copycat", set: "Fan Art · Naturaleza", tema: "Naturaleza", price: 15, grad: ["#86efac", "#0ea5e9"], image: "/proxys/Singles/22917b2c-34c6-4f91-9e3b-e543446716bd.jpg", thumb: "/proxys/Singles/t/22917b2c-34c6-4f91-9e3b-e543446716bd.webp" },
  { id: "px-s57", name: "Sleigh Team Stantler ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/62f41cde-1d72-477b-90d2-4105d9232908.jpg", thumb: "/proxys/Singles/t/62f41cde-1d72-477b-90d2-4105d9232908.webp" },
  { id: "px-s58", name: "Surfing Santa Raichu ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/6aaa30ba-5a72-4a01-bbf4-3170b006ce3a.jpg", thumb: "/proxys/Singles/t/6aaa30ba-5a72-4a01-bbf4-3170b006ce3a.webp" },
  { id: "px-s59", name: "Evergreen Celebi ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/12d73649-a781-4ef6-af0c-a616507f93cc.jpg", thumb: "/proxys/Singles/t/12d73649-a781-4ef6-af0c-a616507f93cc.webp" },
  { id: "px-s60", name: "Festive Rayquaza ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/d5f2c926-1b89-4322-9b69-ad06a2c68778.jpg", thumb: "/proxys/Singles/t/d5f2c926-1b89-4322-9b69-ad06a2c68778.webp" },
  { id: "px-s61", name: "Winter Sea Lugia ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/7eecdd87-4c7c-49b5-a76c-8acd75a3c5ce.jpg", thumb: "/proxys/Singles/t/7eecdd87-4c7c-49b5-a76c-8acd75a3c5ce.webp" },
  { id: "px-s62", name: "Wishing Star Jirachi ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/eabe18a0-373a-429d-8f14-bc1eff941fc8.jpg", thumb: "/proxys/Singles/t/eabe18a0-373a-429d-8f14-bc1eff941fc8.webp" },
  { id: "px-s63", name: "Crystal Kyurem ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/6464ab74-b0f2-41a6-9c5e-c4d2d24843a5.jpg", thumb: "/proxys/Singles/t/6464ab74-b0f2-41a6-9c5e-c4d2d24843a5.webp" },
  { id: "px-s64", name: "First Snow Articuno ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/ebc9b54d-8375-451d-8d47-2112ff4b0f2d.jpg", thumb: "/proxys/Singles/t/ebc9b54d-8375-451d-8d47-2112ff4b0f2d.webp" },
  { id: "px-s65", name: "Christmas Movie Night", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/d6c2f8d8-263b-4bbc-b62b-be8871e393ac.jpg", thumb: "/proxys/Singles/t/d6c2f8d8-263b-4bbc-b62b-be8871e393ac.webp" },
  { id: "px-s66", name: "Teatime Polteageist ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/7404680a-a479-4a5f-a41d-db62cb672155.jpg", thumb: "/proxys/Singles/t/7404680a-a479-4a5f-a41d-db62cb672155.webp" },
  { id: "px-s67", name: "Christmas Eve Pikachu ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/1d8fec57-1805-4fc1-80b6-cd86b1745cf7.jpg", thumb: "/proxys/Singles/t/1d8fec57-1805-4fc1-80b6-cd86b1745cf7.webp" },
  { id: "px-s68", name: "Gift Wrap Sylveon ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/98db4e3a-aac2-4d3b-8040-0489a60ede08.jpg", thumb: "/proxys/Singles/t/98db4e3a-aac2-4d3b-8040-0489a60ede08.webp" },
  { id: "px-s69", name: "Delivery Dragonite ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/809709cb-701a-4ef6-a77c-e706772f3d41.jpg", thumb: "/proxys/Singles/t/809709cb-701a-4ef6-a77c-e706772f3d41.webp" },
  { id: "px-s70", name: "Gift Box Mimikyu ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/dfda994f-9722-4fee-91de-e6ba1f927412.jpg", thumb: "/proxys/Singles/t/dfda994f-9722-4fee-91de-e6ba1f927412.webp" },
  { id: "px-s71", name: "Holiday Lapras ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/8f7f2684-e28d-45b0-8d04-88563b8e2f3e.jpg", thumb: "/proxys/Singles/t/8f7f2684-e28d-45b0-8d04-88563b8e2f3e.webp" },
  { id: "px-s72", name: "Christmas Morning Eevee ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/15ec3780-7cce-439d-83fd-324c473f81d1.jpg", thumb: "/proxys/Singles/t/15ec3780-7cce-439d-83fd-324c473f81d1.webp" },
  { id: "px-s73", name: "Santa Pikachu ex", set: "Fan Art · Navidad", tema: "Navidad", price: 15, grad: ["#ef4444", "#166534"], image: "/proxys/Singles/74585696-e295-4088-ac3e-23be9b6f28c1.jpg", thumb: "/proxys/Singles/t/74585696-e295-4088-ac3e-23be9b6f28c1.webp" },
  { id: "px-s74", name: "Totoro Pikachu", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/8b290a46-7317-433d-bab5-8800a19e6e21.jpg", thumb: "/proxys/Singles/t/8b290a46-7317-433d-bab5-8800a19e6e21.webp" },
  { id: "px-s75", name: "No-Face Poncho Pikachu", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/553a15d7-e755-4b02-a88f-44704ab6dc89.jpg", thumb: "/proxys/Singles/t/553a15d7-e755-4b02-a88f-44704ab6dc89.webp" },
  { id: "px-s76", name: "Ponyo Poncho Pikachu", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/b237fe66-ad0a-4b47-aeb4-6722802ae304.jpg", thumb: "/proxys/Singles/t/b237fe66-ad0a-4b47-aeb4-6722802ae304.webp" },
  { id: "px-s77", name: "Haku & Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/58a269cf-ef74-48b3-9dc0-6e32318153e2.jpg", thumb: "/proxys/Singles/t/58a269cf-ef74-48b3-9dc0-6e32318153e2.webp" },
  { id: "px-s78", name: "Catbus & Pikachu ex", set: "Fan Art · Ponchos y Anime", tema: "Ponchos y Anime", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/b535332e-a552-46ba-b884-278d8bd5d774.jpg", thumb: "/proxys/Singles/t/b535332e-a552-46ba-b884-278d8bd5d774.webp" },
  { id: "px-s11", tema: "Perú", name: "Andean Pikachu ex", set: "Fan Art · Perú", price: 15, grad: ["#86efac", "#f59e0b"], image: "/proxys/Singles/079c62d7-10dc-454b-9fc3-12a7bf28f798.jpg" },
  { id: "px-s12", tema: "Ponchos y Anime", name: "Doraemon Poncho Pikachu ex", set: "Fan Art · Poncho", price: 15, grad: ["#38bdf8", "#1d4ed8"], image: "/proxys/Singles/286027a4-7567-4da8-a7cc-070256b0c3f2.jpg" },
  { id: "px-s13", tema: "Navidad", name: "Chef Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#fde68a", "#f59e0b"], image: "/proxys/Singles/688ccdc2-3d69-4214-9b16-12524f93037f.jpg" },
  { id: "px-s14", tema: "Navidad", name: "Gengar ex · Árbol de Navidad", set: "Fan Art · Navidad", price: 15, grad: ["#7c2d6b", "#1a0615"], image: "/proxys/Singles/61ea2df6-93da-419c-97d9-0016b4b2dacb.jpg" },
  { id: "px-s15", tema: "Naturaleza", name: "Pikachu ex · Girasoles", set: "Fan Art · Atardecer", price: 15, grad: ["#fbbf24", "#ea580c"], image: "/proxys/Singles/4756be79-1e26-4589-96c1-5af0df823aa3.jpg" },
  { id: "px-s7", tema: "Ponchos y Anime", name: "Totoro Poncho Pikachu", set: "Fan Art · Promo", price: 15, grad: ["#86efac", "#166534"], image: "/proxys/Singles/0ae16301-89cf-4a50-a111-edd2766caad7.jpg" },
  { id: "px-s8", tema: "Navidad", name: "Dear Santa Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#ef4444", "#7f1d1d"], image: "/proxys/Singles/671a8399-83b8-4dd4-b9fe-e4ecfa0589f0.jpg" },
  { id: "px-s9", tema: "Navidad", name: "Ugly Sweater Pikachu ex", set: "Fan Art · Navidad", price: 15, grad: ["#22c55e", "#b91c1c"], image: "/proxys/Singles/a8356bc4-2897-4b66-95be-3308a86f831c.jpg" },
  { id: "px-s10", tema: "Navidad", name: "Playful Mew ex", set: "Fan Art · Navidad", price: 15, grad: ["#f9a8d4", "#a78bfa"], image: "/proxys/Singles/ecac42ad-ea1e-41b7-9d6c-090b3c34ecc0.jpg" },
  { id: "px-s1", tema: "Ponchos y Anime", name: "Poncho Pikachu Charizard X", set: "Obsidian Flames", price: 15, grad: ["#fb923c", "#ef4444"], image: "/proxys/Singles/poncho-charizard-x.avif" },
  { id: "px-s2", tema: "Ponchos y Anime", name: "Poncho Pikachu Charizard Y", set: "Surging Sparks", price: 15, grad: ["#fde047", "#f59e0b"], image: "/proxys/Singles/poncho-charizard-y.avif" },
  { id: "px-s3", tema: "Ponchos y Anime", name: "Poncho Pikachu Rayquaza", set: "151", price: 15, grad: ["#c4b5fd", "#ec4899"], image: "/proxys/Singles/poncho-rayquaza.avif" },
  { id: "px-s4", tema: "Ponchos y Anime", name: "Poncho Pikachu Rayquaza Shiny", set: "Evolving Skies", price: 16, grad: ["#1e1b4b", "#6366f1"], image: "/proxys/Singles/poncho-rayquaza-shiny.avif" },
  { id: "px-s5", tema: "Ponchos y Anime", name: "Poncho Pikachu Magikarp", set: "Fusion Strike", price: 15, grad: ["#7c3aed", "#312e81"], image: "/proxys/Singles/poncho-magikarp.avif" },
  { id: "px-s6", tema: "Ponchos y Anime", name: "Poncho Pikachu Gyarados", set: "Silver Tempest", price: 15, grad: ["#bae6fd", "#6366f1"], image: "/proxys/Singles/poncho-gyarados.avif" },
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
