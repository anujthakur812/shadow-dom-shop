const CART_KEY = "shadow-shop-cart";
const ACCOUNT_KEY = "shadow-shop-account";

export function getCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new CustomEvent("shadow-shop-cart"));
}

export function addToCart(product, qty = 1) {
  const cart = getCart();
  const i = cart.findIndex((l) => l.id === product.id);
  if (i >= 0) cart[i].qty += qty;
  else cart.push({ ...product, qty });
  saveCart(cart);
}

export function updateCartQty(id, qty) {
  let cart = getCart();
  if (qty <= 0) cart = cart.filter((l) => l.id !== id);
  else {
    const line = cart.find((l) => l.id === id);
    if (line) line.qty = qty;
  }
  saveCart(cart);
}

export function removeFromCart(id) {
  saveCart(getCart().filter((l) => l.id !== id));
}

export function cartTotal(cart = getCart()) {
  return cart.reduce((s, l) => s + l.price * l.qty, 0);
}

export function getAccount() {
  try {
    const raw = localStorage.getItem(ACCOUNT_KEY);
    return raw
      ? JSON.parse(raw)
      : {
          firstName: "",
          lastName: "",
          email: "",
          password: "",
        };
  } catch {
    return { firstName: "", lastName: "", email: "", password: "" };
  }
}

export function saveAccount(data) {
  localStorage.setItem(ACCOUNT_KEY, JSON.stringify(data));
  window.dispatchEvent(new CustomEvent("shadow-shop-account"));
}
