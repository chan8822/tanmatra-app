// Enhanced API Client for Tanmatra
// Backend-ready with localStorage fallback for standalone mode
// When backend is deployed, set VITE_API_BASE env var

import { categories, menuItems } from "@/data/menu";

const API_BASE = import.meta.env.VITE_API_BASE || (window as any).__API_BASE__ || "";
console.log("[API] Mode:", API_BASE ? `Backend: ${API_BASE}` : "STANDALONE (baked-in data)");

/* ───────── helpers ───────── */
const ls = {
  get: (key: string) => { try { return JSON.parse(localStorage.getItem(key) || "null"); } catch { return null; } },
  set: (key: string, val: any) => localStorage.setItem(key, JSON.stringify(val)),
};

async function apiFetch(method: string, path: string, body?: object) {
  if (!API_BASE) throw new Error("Backend not configured");
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`${method} ${path} → ${res.status}: ${errText}`);
  }
  return res.json();
}

// Try backend first, fall back to localStorage
async function withFallback<T>(
  backendCall: () => Promise<T>,
  fallback: () => T
): Promise<T> {
  try { if (API_BASE) return await backendCall(); } catch (e) { console.warn("[API] Backend failed, using fallback:", e); }
  return fallback();
}

/* ───────── Cart (localStorage-backed) ───────── */
const CART_KEY = "tanmatra_cart";

function getLocalCart() {
  return ls.get(CART_KEY) || { items: [], subtotal: 0, tax: 0, delivery_fee: 0, total: 0 };
}

function saveLocalCart(cart: any) {
  ls.set(CART_KEY, cart);
  window.dispatchEvent(new Event("cartUpdated"));
}

function calcTotals(items: any[]) {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const delivery_fee = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax + delivery_fee;
  return { subtotal, tax, delivery_fee, total };
}

/* ───────── Orders (localStorage-backed) ───────── */
const ORDERS_KEY = "tanmatra_orders";
let nextOrderId = parseInt(localStorage.getItem("tanmatra_order_seq") || "1001");

function getOrders(): any[] { return ls.get(ORDERS_KEY) || []; }
function saveOrder(order: any) {
  const orders = getOrders();
  orders.unshift(order);
  ls.set(ORDERS_KEY, orders);
  localStorage.setItem("tanmatra_order_seq", String(nextOrderId));
  return order;
}

/* ───────── Saved Locations ───────── */
const LOCATIONS_KEY = "tanmatra_saved_locations";
const ACTIVE_LOCATION_KEY = "tanmatra_active_location";

const DEFAULT_LOCATIONS = [
  { id: "home", icon: "home" as const, label: "Home", address: "52 U Block, Sector 24, Gurgaon", zone: "5km Elite", zoneType: "elite" as const, phone: "+91-9876543210", distance: "52 U Block", favorite: true },
  { id: "office", icon: "office" as const, label: "Office", address: "DLF Phase 3, Sector 26, Gurgaon", zone: "10km Wellness", zoneType: "wellness" as const, phone: "+91-9876543210", distance: "378 m", favorite: false },
  { id: "gym", icon: "gym" as const, label: "Gym", address: "Near Phoenix Mall, Sector 27, Gurgaon", zone: "5km Elite", zoneType: "elite" as const, phone: "+91-9876543210", distance: "1.2 km", favorite: false },
];

function getSavedLocations() {
  return ls.get(LOCATIONS_KEY) || DEFAULT_LOCATIONS;
}

function getActiveLocation() {
  return ls.get(ACTIVE_LOCATION_KEY) || DEFAULT_LOCATIONS[0];
}

/* ───────── API ───────── */
export const API = {
  /* ── Menu ── */
  categories: () =>
    withFallback(
      () => apiFetch("GET", "/api/menu/categories"),
      () => categories
    ),

  items: async (cat?: string, search?: string, page = 1, pageSize = 12) => {
    const fallback = () => {
      let list = menuItems.map((i: any) => ({ ...i, is_rd_verified: true, rd_verified: true, prep_time: i.prep_time || 20 + Math.floor(Math.random() * 20) }));
      if (cat && cat !== "all") list = list.filter((i) => i.category_id === cat);
      if (search) list = list.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()));
      const start = (page - 1) * pageSize;
      return { items: list.slice(start, start + pageSize), total: list.length, page, has_next: start + pageSize < list.length };
    };
    return withFallback(
      () => {
        const p = new URLSearchParams();
        if (cat && cat !== "all") p.append("category_id", cat);
        if (search) p.append("search", search);
        p.append("page", String(page));
        p.append("page_size", String(pageSize));
        return apiFetch("GET", `/api/menu/items?${p}`);
      },
      fallback
    );
  },

  itemById: async (id: string) =>
    withFallback(
      () => apiFetch("GET", `/api/menu/items/${id}`),
      () => menuItems.find((i) => String(i.id) === id || i.id === id) || null
    ),

  /* ── Search ── */
  searchDishes: async (query: string, limit = 10) => {
    if (!query.trim()) return { results: [] };
    return withFallback(
      () => apiFetch("GET", `/api/search/dishes?query=${encodeURIComponent(query)}&limit=${limit}`),
      () => {
        const q = query.toLowerCase();
        const results = menuItems
          .filter((i) => i.name.toLowerCase().includes(q) || (i.tags || []).some((t: string) => t.toLowerCase().includes(q)))
          .slice(0, limit)
          .map((i) => ({ id: i.id, name: i.name, image_url: i.image, price: i.price, protein: i.protein || 0 }));
        return { results };
      }
    );
  },

  popularSearches: () =>
    withFallback(
      () => apiFetch("GET", "/api/search/popular"),
      () => ({ searches: ["High-Protein", "Salad", "Quick meals", "Paneer", "Athlete"] })
    ),

  /* ── Cart ── */
  getCart: async () =>
    withFallback(
      () => apiFetch("GET", "/api/cart"),
      () => getLocalCart()
    ),

  addToCart: async (dishId: string, quantity = 1, customizations?: any[]) => {
    return withFallback(
      async () => {
        const res = await apiFetch("POST", "/api/cart/items", { dish_id: dishId, quantity, customizations });
        return res;
      },
      () => {
        const cart = getLocalCart();
        const item = menuItems.find((i) => String(i.id) === dishId || i.id === dishId);
        if (!item) throw new Error("Item not found");
        const existing = cart.items.find((i: any) => i.dish_id === dishId);
        if (existing) {
          existing.quantity += quantity;
        } else {
          cart.items.push({
            id: Date.now(),
            dish_id: dishId,
            dish_name: item.name,
            quantity,
            price: item.price,
            image: item.image,
            customizations: customizations || [],
          });
        }
        const totals = calcTotals(cart.items);
        Object.assign(cart, totals);
        saveLocalCart(cart);
        return { cart, success: true };
      }
    );
  },

  removeCartItem: async (cartItemId: number) => {
    return withFallback(
      () => apiFetch("DELETE", `/api/cart/items/${cartItemId}`),
      () => {
        const cart = getLocalCart();
        cart.items = cart.items.filter((i: any) => i.id !== cartItemId);
        const totals = calcTotals(cart.items);
        Object.assign(cart, totals);
        saveLocalCart(cart);
        return { cart };
      }
    );
  },

  updateCartQuantity: async (cartItemId: number, quantity: number) => {
    return withFallback(
      () => apiFetch("PATCH", `/api/cart/items/${cartItemId}`, { quantity }),
      () => {
        const cart = getLocalCart();
        const item = cart.items.find((i: any) => i.id === cartItemId);
        if (item) {
          item.quantity = quantity;
          if (quantity <= 0) cart.items = cart.items.filter((i: any) => i.id !== cartItemId);
        }
        const totals = calcTotals(cart.items);
        Object.assign(cart, totals);
        saveLocalCart(cart);
        return { cart };
      }
    );
  },

  clearCart: async () => {
    return withFallback(
      () => apiFetch("DELETE", "/api/cart"),
      () => {
        const cart = { items: [], subtotal: 0, tax: 0, delivery_fee: 0, total: 0 };
        saveLocalCart(cart);
        return { cart };
      }
    );
  },

  applyCoupon: async (code: string) => {
    return withFallback(
      () => apiFetch("POST", "/api/cart/apply-coupon", { code }),
      () => {
        const cart = getLocalCart();
        // Simple coupon logic
        if (code === "FIRST20" && cart.subtotal > 0) {
          const discount = Math.min(Math.round(cart.subtotal * 0.2), 100);
          cart.discount = discount;
          cart.total = cart.subtotal + cart.tax + cart.delivery_fee - discount;
          cart.coupon = code;
        }
        saveLocalCart(cart);
        return { cart, discount: cart.discount || 0 };
      }
    );
  },

  /* ── Orders ── */
  listOrders: async () =>
    withFallback(
      () => apiFetch("GET", "/api/orders"),
      () => ({ orders: getOrders(), total: getOrders().length })
    ),

  createOrder: async (data: any) => {
    return withFallback(
      () => apiFetch("POST", "/api/orders", data),
      () => {
        const orderId = `TAN-${nextOrderId++}`;
        const order = { id: orderId, order_id: orderId, ...data, status: "received", created_at: new Date().toISOString() };
        saveOrder(order);
        return order;
      }
    );
  },

  getOrder: async (orderId: string) =>
    withFallback(
      () => apiFetch("GET", `/api/orders/${orderId}`),
      () => getOrders().find((o) => o.id === orderId || o.order_id === orderId)
    ),

  /* ── Locations / Zones ── */
  getZones: () =>
    withFallback(
      () => apiFetch("GET", "/api/zones"),
      () => ({ zones: [
        { id: 1, name: "Noida Elite", radius_km: 5, delivery_fee: 0, min_order_value: 299 },
        { id: 2, name: "Noida Wellness", radius_km: 10, delivery_fee: 29, min_order_value: 199 },
      ]})
    ),

  checkDelivery: (lat: number, lng: number) =>
    withFallback(
      () => apiFetch("POST", "/api/zones/check-delivery", { latitude: lat, longitude: lng }),
      () => ({ zone_id: 1, distance_km: 2.1, is_available: true, delivery_fee: 0 })
    ),

  getSavedLocations: async () =>
    withFallback(
      () => apiFetch("GET", "/api/user/addresses"),
      () => ({ locations: getSavedLocations() })
    ),

  saveLocation: async (loc: any) =>
    withFallback(
      () => apiFetch("POST", "/api/user/addresses", loc),
      () => {
        const locs = getSavedLocations();
        locs.push({ ...loc, id: `loc_${Date.now()}` });
        ls.set(LOCATIONS_KEY, locs);
        return { location: loc };
      }
    ),

  setActiveLocation: async (loc: any) => {
    ls.set(ACTIVE_LOCATION_KEY, loc);
    window.dispatchEvent(new CustomEvent("locationChanged", { detail: loc }));
    return withFallback(
      () => apiFetch("POST", "/api/user/set-delivery-location", { location_id: loc.id, zone_id: loc.zone_id }),
      () => ({ success: true })
    );
  },

  getActiveLocation: () => getActiveLocation(),

  /* ── Auth ── */
  sendOTP: (phone: string) => apiFetch("POST", `/api/auth/otp/send?phone=${encodeURIComponent(phone)}`),
  verifyOTP: (phone: string, otp: string) => apiFetch("POST", `/api/auth/otp/verify?phone=${encodeURIComponent(phone)}&otp=${otp}`),
  me: (userId: number) => apiFetch("GET", `/api/auth/me?user_id=${userId}`),

  /* ── Payments ── */
  createRazorpayOrder: (amount: number, receipt: string) =>
    apiFetch("POST", `/api/payments/razorpay/order?amount=${amount}&receipt=${receipt}`),

  verifyPayment: (data: any) =>
    apiFetch("POST", "/api/payments/verify", data),

  /* ── AI ── */
  chat: (message: string) =>
    apiFetch("POST", `/api/ai/chat?user_id=1&message=${encodeURIComponent(message)}`),
  recommend: () =>
    withFallback(
      () => apiFetch("POST", "/api/ai/recommend?user_id=1"),
      () => ({
        recommendations: [
          { dish: "Grilled Paneer Salad", reason: "High protein, perfect for Athlete track", category: "Salads", price: 200 },
          { dish: "Chicken Tikka Wrap", reason: "Post-workout protein boost", category: "Wraps", price: 180 },
          { dish: "Quinoa Khichdi", reason: "Gut-friendly, easy to digest for seniors", category: "Healthy Meals", price: 150 },
        ],
      })
    ),

  /* ── Delivery ── */
  estimateDelivery: (zone: string, total: number) =>
    apiFetch("GET", `/api/delivery/estimate?zone=${encodeURIComponent(zone)}&order_total=${total}`),

  tracking: async (orderId: string) =>
    withFallback(
      () => apiFetch("GET", `/api/delivery/tracking/${orderId}`),
      () => ({
        order_id: orderId,
        status: "out_for_delivery",
        rider: { name: "Vikram D.", phone: "98765 43213", bike: "UP16 GH 3456", rating: 4.7 },
        eta_minutes: 18,
        location: { lat: 28.6139, lng: 77.2090 },
      })
    ),

  /* ── Health ── */
  health: () => apiFetch("GET", "/health"),
};

export default API;
