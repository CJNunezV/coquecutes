export const products = [
  {
    id: 1,
    slug: "case-team-rocket",
    name: "Case Premium - Edición Team Rocket",
    price: 30.00,
    images: ["/team-rocket-1.jpg", "/team-rocket-2.jpg", "/team-rocket-3.jpg"],
    thumbnail: "/team-rocket-png.png",
    thumbnailOffsetY: 40, // px: negativo sube la imagen, positivo la baja
    thumbnailScale: 1.2,
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
    images: ["/ultra-ball-1.jpg", "/ultra-ball-2.jpg", "/ultra-ball-3.jpg"],
    thumbnail: "/ultra-ball-png.png",
    thumbnailOffsetY: 45,
    thumbnailScale: 1.3,
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
    images: ["/premier-ball-1.jpg", "/premier-ball-2.jpg", "/premier-ball-3.jpg"],
    thumbnail: "/premier-ball-png.png",
    thumbnailOffsetY: 40,
    thumbnailScale: 1.5,
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
    images: ["/pokebola-1.jpg", "/pokebola-2.jpg", "/pokebola-3.jpg"],
    thumbnail: "/pokebola-png.png",
    thumbnailOffsetY: 60,
    thumbnailScale: 1.5,
    description: "Inspirado en el diseño icónico de la Poké Ball original: rojo arriba, blanco abajo, con línea negra divisoria. El clásico que nunca falla.",
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
    thumbnailOffsetY: 20,
    thumbnailScale: 1.0,
    description: "Organiza y protege tu stock de toploaders. Diseñado para guardar varias unidades apiladas, fácil de recargar y con acabado resistente a golpes.",
    specs: {
      medidas: "Consulta medidas exactas según capacidad",
      material: "Plástico técnico de alta densidad (impresión 3D de precisión con post-procesado liso)",
      compatibilidad: "Toploaders estándar",
      peso: "Variable según capacidad"
    }
  }
];