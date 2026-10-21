// Carrito compartido (localStorage). Todas las páginas usan estas funciones para
// que el carrito, el panel lateral y el checkout siempre estén sincronizados.
export const CART_KEY = "coquecutes_cart";

export function getCart() {
  try {
    const c = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(c) ? c : [];
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
    cart.push({ id: item.id, name: item.name, price: item.price, quantity: qty, image: item.image || null });
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
