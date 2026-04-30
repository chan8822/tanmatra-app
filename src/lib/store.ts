export interface CartItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string;
  isVeg?: boolean;
}

export interface CartState {
  items: CartItem[];
  restaurantName: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  discount: number;
  coupon: string;
  savings: number;
}

function getCart(): CartState {
  try {
    const raw = localStorage.getItem("tanmatra_cart");
    if (!raw) return defaultCart();
    return { ...defaultCart(), ...JSON.parse(raw) };
  } catch {
    return defaultCart();
  }
}

function defaultCart(): CartState {
  return {
    items: [],
    restaurantName: "Tanmatra Kitchen",
    subtotal: 0,
    tax: 0,
    deliveryFee: 0,
    total: 0,
    discount: 0,
    coupon: "",
    savings: 0,
  };
}

function saveCart(cart: CartState) {
  localStorage.setItem("tanmatra_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cartUpdated"));
}

function recalc(cart: CartState): CartState {
  const subtotal = cart.items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const discount = cart.discount || 0;
  const total = Math.max(0, subtotal + tax + deliveryFee - discount);
  const aggregatorCost = Math.round(subtotal * 1.53);
  const savings = Math.max(0, aggregatorCost - subtotal);
  return { ...cart, subtotal, tax, deliveryFee, total, savings };
}

export const cartStore = {
  get(): CartState {
    return getCart();
  },

  addItem(item: Omit<CartItem, "qty">) {
    const cart = getCart();
    const existing = cart.items.find((i) => i.id === item.id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.items.push({ ...item, qty: 1 });
    }
    saveCart(recalc(cart));
  },

  updateQty(id: string, qty: number) {
    const cart = getCart();
    if (qty <= 0) {
      cart.items = cart.items.filter((i) => i.id !== id);
    } else {
      const item = cart.items.find((i) => i.id === id);
      if (item) item.qty = qty;
    }
    if (cart.items.length === 0) {
      cart.discount = 0;
      cart.coupon = "";
    }
    saveCart(recalc(cart));
  },

  setCoupon(code: string, discount: number) {
    const cart = getCart();
    cart.coupon = code;
    cart.discount = discount;
    saveCart(recalc(cart));
  },

  clear() {
    localStorage.removeItem("tanmatra_cart");
    window.dispatchEvent(new Event("cartUpdated"));
  },

  getCount(): number {
    return getCart().items.reduce((n, i) => n + i.qty, 0);
  },

  subscribe(fn: () => void): () => void {
    const handler = () => fn();
    window.addEventListener("cartUpdated", handler);
    return () => window.removeEventListener("cartUpdated", handler);
  },
};

// Orders
export interface Order {
  id: string;
  status: "confirmed" | "preparing" | "ready" | "out_for_delivery" | "delivered";
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  address: string;
  createdAt: string;
  estimatedTime: string;
  rider?: { name: string; phone: string };
}

function getOrders(): Order[] {
  try {
    const raw = localStorage.getItem("tanmatra_orders");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const orderStore = {
  getAll(): Order[] {
    return getOrders();
  },

  getById(id: string): Order | undefined {
    return getOrders().find((o) => o.id === id);
  },

  add(order: Omit<Order, "id" | "createdAt">): Order {
    const orders = getOrders();
    const seq = parseInt(localStorage.getItem("tanmatra_order_seq") || "1000") + 1;
    localStorage.setItem("tanmatra_order_seq", String(seq));
    const newOrder: Order = {
      ...order,
      id: "TM" + seq,
      createdAt: new Date().toISOString(),
    };
    orders.unshift(newOrder);
    localStorage.setItem("tanmatra_orders", JSON.stringify(orders));
    return newOrder;
  },

  updateStatus(id: string, status: Order["status"]) {
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (order) order.status = status;
    localStorage.setItem("tanmatra_orders", JSON.stringify(orders));
  },

  updatePaymentStatus(id: string, paymentStatus: Order["paymentStatus"]) {
    const orders = getOrders();
    const order = orders.find((o) => o.id === id);
    if (order) order.paymentStatus = paymentStatus;
    localStorage.setItem("tanmatra_orders", JSON.stringify(orders));
  },

  subscribe(fn: () => void): () => void {
    const handler = () => fn();
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  },
};

// Kitchen Orders (for KDS) — only PAID orders that are confirmed or preparing
export const kitchenStore = {
  getPending(): Order[] {
    return getOrders().filter((o) => (o.status === "confirmed" || o.status === "preparing") && o.paymentStatus === "paid");
  },

  getReady(): Order[] {
    return getOrders().filter((o) => o.status === "ready" && o.paymentStatus === "paid");
  },

  getAwaitingPayment(): Order[] {
    return getOrders().filter((o) => o.status === "confirmed" && o.paymentStatus === "pending");
  },
};
