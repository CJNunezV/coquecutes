// Fotos originales (sin editar) en /public/Cases: <NOMBRE>-F (frente), -L, -R, -B (atrás)
const casePhotos = (name) => ["F", "L", "R", "B"].map((v) => `/Cases/${name}-${v}.JPEG`);

export const products = [
  {
    id: 1,
    slug: "case-team-rocket",
    name: "Case Premium - Edición Team Rocket",
    price: 30.00,
    images: casePhotos("ROCKET"),
    thumbnail: "/Cases/ROCKET-F.JPEG",
    thumbnailZoom: 90,
    description: "Protector premium diseñado especialmente para cartas coleccionables de formato estándar. Acabado negro y rojo con el icónico logo \"R\" del Team Rocket, para tus cartas con más actitud.",
    specs: {
      medidas: "Exteriores: 10.5 cm x 8.2 cm | Interiores (para la carta): 9.2 cm x 6.8 cm",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Cartas Pokémon TCG, Magic: The Gathering y similares (Standard Size)",
      peso: "45 gramos"
    }
  },
  {
    id: 2,
    slug: "case-ultra-ball",
    name: "Case Premium - Edición Ultra Ball",
    price: 30.00,
    images: casePhotos("Ultraball"),
    thumbnail: "/Cases/Ultraball-F.JPEG",
    thumbnailZoom: 90,
    description: "Inspirado en la Ultra Ball: acabado negro con banda amarilla y botón central blanco. Misma resistencia y precisión de encastre que el resto de la línea premium.",
    specs: {
      medidas: "Exteriores: 10.5 cm x 8.2 cm | Interiores (para la carta): 9.2 cm x 6.8 cm",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Cartas Pokémon TCG, Magic: The Gathering y similares (Standard Size)",
      peso: "45 gramos"
    }
  },
  {
    id: 3,
    slug: "case-premier-ball",
    name: "Case Premium - Edición Premier Ball",
    price: 30.00,
    images: casePhotos("WHITE"),
    thumbnail: "/Cases/WHITE-F.JPEG",
    thumbnailZoom: 90,
    description: "Inspirado en la Premier Ball: acabado blanco con franja roja central y botón blanco. Elegante y minimalista para tus cartas más valiosas.",
    specs: {
      medidas: "Exteriores: 10.5 cm x 8.2 cm | Interiores (para la carta): 9.2 cm x 6.8 cm",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Cartas Pokémon TCG, Magic: The Gathering y similares (Standard Size)",
      peso: "45 gramos"
    }
  },
  {
    id: 4,
    slug: "case-pokebola-clasica",
    name: "Case Premium - Edición Poké Ball Clásica",
    price: 30.00,
    images: casePhotos("POKEBALL"),
    thumbnail: "/Cases/POKEBALL-F.JPEG",
    thumbnailZoom: 90,
    description: "Inspirado en el diseño icónico de la Poké Ball original: rojo arriba, blanco abajo, con línea negra divisoria. El clásico que nunca falla.",
    specs: {
      medidas: "Exteriores: 10.5 cm x 8.2 cm | Interiores (para la carta): 9.2 cm x 6.8 cm",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Cartas Pokémon TCG, Magic: The Gathering y similares (Standard Size)",
      peso: "45 gramos"
    }
  },
  {
    id: 6,
    slug: "case-master-ball",
    name: "Case Premium - Edición Master Ball",
    price: 30.00, // TODO: confirmar precio
    images: casePhotos("MASTERBALL"),
    thumbnail: "/Cases/MASTERBALL-F.JPEG",
    thumbnailZoom: 90,
    description: "Inspirado en la Master Ball: acabado morado con la inicial \"M\" y detalles rosados. La más codiciada de la línea, para tus cartas más especiales.",
    specs: {
      medidas: "Exteriores: 10.5 cm x 8.2 cm | Interiores (para la carta): 9.2 cm x 6.8 cm",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Cartas Pokémon TCG, Magic: The Gathering y similares (Standard Size)",
      peso: "45 gramos"
    }
  },
  {
    id: 7,
    slug: "case-great-ball",
    name: "Case Premium - Edición Great Ball",
    price: 30.00, // TODO: confirmar precio
    images: casePhotos("SUPERBALL"),
    thumbnail: "/Cases/SUPERBALL-F.JPEG",
    thumbnailZoom: 90,
    description: "Inspirado en la Great Ball: acabado azul con detalles rojos y botón central blanco. Misma resistencia y precisión de encastre que el resto de la línea premium.",
    specs: {
      medidas: "Exteriores: 10.5 cm x 8.2 cm | Interiores (para la carta): 9.2 cm x 6.8 cm",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Cartas Pokémon TCG, Magic: The Gathering y similares (Standard Size)",
      peso: "45 gramos"
    }
  },
  {
    id: 5,
    slug: "dispensador-toploaders",
    name: "Dispensador de Toploaders",
    price: 30.00, // TODO: Christopher va a actualizar este precio
    images: ["/dispensador-1.jpg", "/dispensador-2.jpg", "/dispensador-3.jpg"],
    thumbnail: "/dispensador-png.png",
    thumbnailZoom: 90,
    description: "Organiza y protege tu stock de toploaders. Diseñado para guardar varias unidades apiladas, fácil de recargar y con acabado resistente a golpes.",
    specs: {
      medidas: "Consulta medidas exactas según capacidad",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Toploaders estándar",
      peso: "Variable según capacidad"
    }
  }
];