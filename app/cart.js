// Carrito compartido (localStorage). Todas las páginas usan estas funciones para
// que el carrito, el panel lateral y el checkout siempre estén sincronizados.
export const CART_KEY = "coquecutes_cart";

// Precio al por mayor: un ítem puede traer bulk = { group, price, min }.
// Si la suma de unidades del mismo grupo llega a `min`, todas pagan `bulk.price`.
function applyBulk(cart) {
  const qty = {};
  cart.forEach((i) => { if (i.bulk) qty[i.bulk.group] = (qty[i.bulk.group] || 0) + i.quantity; });
  return cart.map((i) => {
    if (!i.bulk) return i;
    const base = i.basePrice ?? i.price;
    const on = qty[i.bulk.group] >= i.bulk.min;
    return { ...i, basePrice: base, price: on ? i.bulk.price : base, bulkOn: on };
  });
}

// Avisos para el carrito: cuántas faltan para el precio al por mayor de cada grupo.
export function bulkStatus(cart) {
  const g = {};
  cart.forEach((i) => {
    if (!i.bulk) return;
    const x = (g[i.bulk.group] = g[i.bulk.group] || { group: i.bulk.group, label: i.bulk.label || "", qty: 0, min: i.bulk.min, price: i.bulk.price, base: i.basePrice ?? i.price });
    x.qty += i.quantity;
    x.price = Math.min(x.price, i.bulk.price);
    x.base = Math.min(x.base, i.basePrice ?? i.price);
  });
  return Object.values(g).map((x) => ({ ...x, on: x.qty >= x.min, missing: Math.max(0, x.min - x.qty) }));
}

export function getCart() {
  try {
    const c = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(c) ? applyBulk(c) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
  window.dispatchEvent(new Event("cartUpdate"));
}

// Añade un producto. item = { id, name, price, image? }. Abre el panel del carrito.
export function addToCart(item, qty = 1, { open = true } = {}) {
  const cart = getCart();
  const ex = cart.find((i) => i.id === item.id);
  if (ex) {
    ex.quantity += qty;
    if (item.image && !ex.image) ex.image = item.image;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, basePrice: item.price, bulk: item.bulk || null, quantity: qty, image: item.image || null });
  }
  saveCart(cart);
  if (open) window.dispatchEvent(new CustomEvent("cartAdded", { detail: { name: item.name } }));
}

export function setQuantity(id, quantity) {
  const cart = getCart()
    .map((i) => (i.id === id ? { ...i, quantity } : i))
    .filter((i) => i.quantity > 0);
  saveCart(cart);
}

export function removeItem(id) {
  saveCart(getCart().filter((i) => i.id !== id));
}

export function clearCart() {
  saveCart([]);
}

export const openCart = () => window.dispatchEvent(new Event("cartOpen"));
export const cartCount = (cart) => cart.reduce((a, i) => a + i.quantity, 0);
export const cartTotal = (cart) => cart.reduce((a, i) => a + i.price * i.quantity, 0);
export const money = (n) => `S/${Number(n).toFixed(2)}`;
