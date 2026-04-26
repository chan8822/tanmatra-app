// API Client for Tanmatra FastAPI Backend
const API_BASE = "";

async function apiFetch(method: string, path: string, body?: object) {
  const opts: RequestInit = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(`${API_BASE}${path}`, opts);
  if (!res.ok) throw new Error(`${method} ${path} failed: ${res.status}`);
  return res.json();
}

export const API = {
  // Menu
  categories: () => apiFetch("GET", "/api/menu/categories"),
  items: (cat?: string, search?: string) => {
    const params = new URLSearchParams();
    if (cat && cat !== "all") params.append("category_id", cat);
    if (search) params.append("search", search);
    const q = params.toString();
    return apiFetch("GET", `/api/menu/items${q ? "?" + q : ""}`);
  },
  
  // Auth
  sendOTP: (phone: string) => apiFetch("POST", `/api/auth/otp/send?phone=${encodeURIComponent(phone)}`),
  verifyOTP: (phone: string, otp: string) => apiFetch("POST", `/api/auth/otp/verify?phone=${encodeURIComponent(phone)}&otp=${otp}`),
  me: (userId: number) => apiFetch("GET", `/api/auth/me?user_id=${userId}`),
  
  // Cart
  getCart: (userId: number) => apiFetch("GET", `/api/cart/${userId}`),
  addToCart: (userId: number, itemId: string, qty: number, instructions?: string) => 
    apiFetch("POST", "/api/cart", { user_id: userId, menu_item_id: itemId, quantity: qty, special_instructions: instructions || "" }),
  removeCartItem: (id: number) => apiFetch("DELETE", `/api/cart/${id}`),
  
  // Orders
  listOrders: (userId?: number, status?: string) => {
    const params = new URLSearchParams();
    if (userId) params.append("user_id", String(userId));
    if (status) params.append("status", status);
    const q = params.toString();
    return apiFetch("GET", `/api/orders${q ? "?" + q : ""}`);
  },
  createOrder: (data: object) => apiFetch("POST", "/api/orders", data),
  
  // Razorpay
  createRazorpayOrder: (amount: number, receipt: string, userId?: number) =>
    apiFetch("POST", `/api/payments/razorpay/order?amount=${amount}&receipt=${receipt}&user_id=${userId || 1}`),
  
  // Gemini AI
  chat: (message: string, userId?: number) =>
    apiFetch("POST", `/api/ai/chat?user_id=${userId || 1}&message=${encodeURIComponent(message)}`),
  recommend: (userId?: number) =>
    apiFetch("POST", `/api/ai/recommend?user_id=${userId || 1}`),
  
  // Delivery
  estimateDelivery: (zone: string, total: number, priority?: string) =>
    apiFetch("GET", `/api/delivery/estimate?zone=${encodeURIComponent(zone)}&order_total=${total}&priority=${priority || "Direct"}`),
  assignRider: (orderId: string, zone: string, priority?: string) =>
    apiFetch("POST", `/api/delivery/assign-rider?order_id=${orderId}&zone=${encodeURIComponent(zone)}&priority=${priority || "Direct"}`),
  tracking: (orderId: string) => apiFetch("GET", `/api/delivery/tracking/${orderId}`),
  
  // Health check
  health: () => apiFetch("GET", "/health"),
};
