// Fotos optimizadas en /public/cases-web  ->  cases([7853, 7856]) = ["/cases-web/IMG_7853.webp", ...]
const cases = (nums) => nums.map((n) => `/cases-web/IMG_${n}.webp`);

export const products = [
  {
    id: 1,
    slug: "case-team-rocket",
    name: "Case Premium - Edición Team Rocket",
    price: 30.00,
    images: cases([7868,7869,7871]),
    thumbnail: "/cases-web/IMG_7868.webp",
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
    images: cases([7853,7858,7862]),
    thumbnail: "/cases-web/IMG_7853.webp",
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
    images: cases([7884,7888,7889]),
    thumbnail: "/cases-web/IMG_7884.webp",
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
    images: cases([7872,7873,7877]),
    thumbnail: "/cases-web/IMG_7872.webp",
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
    images: cases([7864,7865,7867]),
    thumbnail: "/cases-web/IMG_7864.webp",
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
    images: cases([7881,7880,7883]),
    thumbnail: "/cases-web/IMG_7881.webp",
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