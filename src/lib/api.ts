// Hybrid API Client for Tanmatra
// Uses baked-in menu data for standalone operation.
// When backend is deployed, switch API_BASE to your server URL.

import { categories, menuItems } from "@/data/menu";

const API_BASE = ""; // HOOK: Set to "https://your-backend.com" when backend is live

async function apiFetch(method: string, path: string, body?: object) {
  if (!API_BASE) throw new Error("Backend not configured");
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
}

// LocalStorage helpers for client-side persistence
const ls = {
  get: (key: string) => {
    try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; }
  },
  set: (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val)),
};

// Order storage (client-side until backend is live)
const ORDERS_KEY = "tanmatra_orders";
let nextOrderId = 1001;

function getOrders(): any[] {
  return ls.get(ORDERS_KEY) || [];
}

function saveOrder(order: any) {
  const orders = getOrders();
  orders.unshift(order);
  ls.set(ORDERS_KEY, orders);
  return order;
}

export const API = {
  // Menu — always returns baked-in data (backend override ready)
  categories: async () => {
    try {
      if (API_BASE) return await apiFetch("GET", "/api/menu/categories");
    } catch {}
    return categories;
  },

  items: async (cat?: string, search?: string) => {
    try {
      if (API_BASE) {
        const params = new URLSearchParams();
        if (cat && cat !== "all") params.append("category_id", cat);
        if (search) params.append("search", search);
        const q = params.toString();
        return await apiFetch("GET", `/api/menu/items${q ? "?" + q : ""}`);
      }
    } catch {}
    let list = menuItems;
    if (cat && cat !== "all") list = list.filter((i) => i.category_id === cat);
    if (search) list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
    return { items: list, total: list.length };
  },

  itemById: async (id: string) => {
    try {
      if (API_BASE) return await apiFetch("GET", `/api/menu/items/${id}`);
    } catch {}
    return menuItems.find((i) => i.id === id) || null;
  },

  // Auth
  sendOTP: (phone: string) => apiFetch("POST", `/api/auth/otp/send?phone=${encodeURIComponent(phone)}`),
  verifyOTP: (phone: string, otp: string) => apiFetch("POST", `/api/auth/otp/verify?phone=${encodeURIComponent(phone)}&otp=${otp}`),
  me: (userId: number) => apiFetch("GET", `/api/auth/me?user_id=${userId}`),

  // Cart — frontend localStorage only (synced to backend when available)
  getCart: (userId: number) => apiFetch("GET", `/api/cart/${userId}`),
  addToCart: (userId: number, itemId: string, qty: number, instructions?: string) =>
    apiFetch("POST", "/api/cart", { user_id: userId, menu_item_id: itemId, quantity: qty, special_instructions: instructions || "" }),
  removeCartItem: (id: number) => apiFetch("DELETE", `/api/cart/${id}`),

  // Orders — client-side with localStorage fallback
  listOrders: async (userId?: number, status?: string) => {
    try {
      if (API_BASE) {
        const params = new URLSearchParams();
        if (userId) params.append("user_id", String(userId));
        if (status) params.append("status", status);
        const q = params.toString();
        return await apiFetch("GET", `/api/orders${q ? "?" + q : ""}`);
      }
    } catch {}
    const orders = getOrders();
    return { orders, total: orders.length };
  },

  createOrder: async (data: any) => {
    try {
      if (API_BASE) return await apiFetch("POST", "/api/orders", data);
    } catch {}
    // Client-side order creation
    const orderId = `TAN-${nextOrderId++}`;
    const order = {
      id: orderId,
      order_id: orderId,
      ...data,
      status: "received",
      created_at: new Date().toISOString(),
      items: data.items || [],
    };
    saveOrder(order);
    return order;
  },

  // Razorpay
  createRazorpayOrder: (amount: number, receipt: string, userId?: number) =>
    apiFetch("POST", `/api/payments/razorpay/order?amount=${amount}&receipt=${receipt}&user_id=${userId || 1}`),

  // Gemini AI
  chat: (message: string, userId?: number) =>
    apiFetch("POST", `/api/ai/chat?user_id=${userId || 1}&message=${encodeURIComponent(message)}`),
  recommend: async (userId?: number) => {
    try {
      if (API_BASE) return await apiFetch("POST", `/api/ai/recommend?user_id=${userId || 1}`);
    } catch {}
    // Static fallback recommendations
    return {
      recommendations: [
        { dish: "Grilled Paneer Salad", reason: "High protein, perfect for Athlete track", category: "Salads", price: 200 },
        { dish: "Chicken Tikka Wrap", reason: "Post-workout protein boost", category: "Wraps", price: 180 },
        { dish: "Quinoa Khichdi", reason: "Gut-friendly, easy to digest for seniors", category: "Healthy Meals", price: 150 },
      ],
    };
  },

  // Delivery
  estimateDelivery: (zone: string, total: number, priority?: string) =>
    apiFetch("GET", `/api/delivery/estimate?zone=${encodeURIComponent(zone)}&order_total=${total}&priority=${priority || "Direct"}`),
  assignRider: (orderId: string, zone: string, priority?: string) =>
    apiFetch("POST", `/api/delivery/assign-rider?order_id=${orderId}&zone=${encodeURIComponent(zone)}&priority=${priority || "Direct"}`),
  tracking: async (orderId: string) => {
    try {
      if (API_BASE) return await apiFetch("GET", `/api/delivery/tracking/${orderId}`);
    } catch {}
    return {
      order_id: orderId,
      status: "out_for_delivery",
      rider: { name: "Vikram D.", phone: "98765 43213", bike: "UP16 GH 3456", rating: 4.7 },
      eta_minutes: 18,
      location: { lat: 28.6139, lng: 77.2090 },
    };
  },

  // Health check
  health: () => apiFetch("GET", "/health"),
};
