// ⚠️ DATOS DE EJEMPLO: reemplaza nombres, precios e imágenes por los reales.
// Para usar fotos: agrega  image: "/proxys/nombre.jpg"  a cualquier item.

// Cartas sueltas (1 proxy por ítem)
export const singles = [
  { id: "px-s1", name: "Charizard ex", set: "Obsidian Flames", price: 5, grad: ["#fb923c", "#ef4444"] },
  { id: "px-s2", name: "Pikachu ex", set: "Surging Sparks", price: 5, grad: ["#fde047", "#f59e0b"] },
  { id: "px-s3", name: "Mewtwo ex", set: "151", price: 5, grad: ["#c4b5fd", "#ec4899"] },
  { id: "px-s4", name: "Umbreon VMAX", set: "Evolving Skies", price: 6, grad: ["#1e1b4b", "#6366f1"] },
  { id: "px-s5", name: "Gengar", set: "Fusion Strike", price: 5, grad: ["#7c3aed", "#312e81"] },
  { id: "px-s6", name: "Lugia V", set: "Silver Tempest", price: 5, grad: ["#bae6fd", "#6366f1"] },
  { id: "px-s7", name: "Gardevoir ex", set: "Paldea Evolved", price: 5, grad: ["#f9a8d4", "#a78bfa"] },
  { id: "px-s8", name: "Rayquaza VMAX", set: "Evolving Skies", price: 6, grad: ["#34d399", "#065f46"] },
];

// Extended Art: pack de 8 cartas para una hoja de binder 3x3
export const extendedPacks = [
  { id: "px-e1", name: "Pack Extended Art · Fuego", price: 40, cards: ["Charizard", "Arcanine", "Ninetales", "Flareon", "Typhlosion", "Blaziken", "Infernape", "Incineroar"], grad: ["#fb923c", "#dc2626"] },
  { id: "px-e2", name: "Pack Extended Art · Eeveelutions", price: 40, cards: ["Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon", "Sylveon"], grad: ["#f9a8d4", "#6366f1"] },
  { id: "px-e3", name: "Pack Extended Art · Legendarios", price: 45, cards: ["Mewtwo", "Lugia", "Ho-Oh", "Rayquaza", "Dialga", "Palkia", "Zacian", "Koraidon"], grad: ["#38bdf8", "#4c1d95"] },
];

// Personalizados: tipos de pedido
export const customTypes = [
  { id: "carta", emoji: "🃏", label: "Carta con tu diseño" },
  { id: "arte", emoji: "🎨", label: "Arte alternativo" },
  { id: "foto", emoji: "📸", label: "Con tu foto" },
  { id: "otro", emoji: "✨", label: "Otra idea" },
];

// Decks (lista completa de proxys de un mazo)
export const decks = [
  { id: "px-d1", name: "Charizard ex", style: "Meta · Fuego", cards: 60, price: 180, grad: ["#fb923c", "#ef4444"] },
  { id: "px-d2", name: "Gardevoir ex", style: "Meta · Psíquico", cards: 60, price: 180, grad: ["#f9a8d4", "#8b5cf6"] },
  { id: "px-d3", name: "Lugia VSTAR", style: "Meta · Incoloro", cards: 60, price: 170, grad: ["#bae6fd", "#6366f1"] },
];