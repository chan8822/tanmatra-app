// Tanmatra API Client - calls the FastAPI backend
const API_BASE = '';

async function apiGET(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error(`GET ${path} failed: ${res.status}`);
  return res.json();
}

async function apiPOST(path, body) {
  const res = await fetch(API_BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`POST ${path} failed: ${res.status}`);
  return res.json();
}

async function apiDELETE(path) {
  const res = await fetch(API_BASE + path, { method: 'DELETE' });
  if (!res.ok) throw new Error(`DELETE ${path} failed: ${res.status}`);
  return res.json();
}

const TanmatraAPI = {
  // Auth
  auth: {
    sendOTP: (phone) => apiPOST('/api/auth/otp/send', { phone }),
    verifyOTP: (phone, otp) => apiPOST('/api/auth/otp/verify', { phone, otp }),
    me: (userId) => apiGET(`/api/auth/me?user_id=${userId}`),
  },

  // Menu
  menu: {
    categories: () => apiGET('/api/menu/categories'),
    items: (categoryId, search) => {
      let q = '/api/menu/items';
      if (categoryId) q += `?category_id=${categoryId}`;
      if (search) q += `${categoryId ? '&' : '?'}search=${encodeURIComponent(search)}`;
      return apiGET(q);
    },
    item: (id) => apiGET(`/api/menu/items/${id}`),
  },

  // Cart
  cart: {
    get: (userId) => apiGET(`/api/cart/${userId}`),
    add: (userId, menuItemId, qty, instructions) => apiPOST('/api/cart', {
      user_id: userId, menu_item_id: menuItemId, quantity: qty, special_instructions: instructions
    }),
    remove: (cartItemId) => apiDELETE(`/api/cart/${cartItemId}`),
  },

  // Orders
  orders: {
    list: (userId, status) => {
      let q = '/api/orders';
      const params = [];
      if (userId) params.push(`user_id=${userId}`);
      if (status) params.push(`status=${status}`);
      if (params.length) q += '?' + params.join('&');
      return apiGET(q);
    },
    create: (data) => apiPOST('/api/orders', data),
    get: (id) => apiGET(`/api/orders/${id}`),
  },

  // Razorpay Payments
  payments: {
    createOrder: (amount, receipt, userId) => apiPOST('/api/payments/razorpay/order?user_id=' + (userId || 1), { amount, receipt }),
    verify: (payment_id, order_id, signature) => apiPOST('/api/payments/razorpay/verify', { payment_id, order_id, signature }),
    createPlan: (name, amount, interval) => apiPOST('/api/payments/razorpay/subscription-plan', { name, amount, interval }),
    createSubscription: (plan_id, userId) => apiPOST('/api/payments/razorpay/subscription?user_id=' + (userId || 1), { plan_id }),
  },

  // Gemini AI
  ai: {
    recommend: (userId) => apiPOST('/api/ai/recommend?user_id=' + (userId || 1)),
    analyzeNutrition: (meals, userId) => apiPOST('/api/ai/nutrition-analysis?user_id=' + (userId || 1), meals),
    chat: (message, userId) => apiPOST('/api/ai/chat?user_id=' + (userId || 1), { message }),
  },

  // Enatega Delivery
  delivery: {
    estimate: (zone, total, priority) => apiGET(`/api/delivery/estimate?zone=${encodeURIComponent(zone)}&order_total=${total}&priority=${priority}`),
    assignRider: (orderId, zone, priority) => apiPOST('/api/delivery/assign-rider', { order_id: orderId, zone, priority }),
    updateStatus: (orderId, status) => apiPOST('/api/delivery/update-status', { order_id: orderId, status }),
    tracking: (orderId) => apiGET(`/api/delivery/tracking/${orderId}`),
    zones: () => apiGET('/api/delivery/zones'),
    zoneAnalytics: () => apiGET('/api/delivery/zone-analytics'),
  },

  // Admin
  admin: {
    inventory: () => apiGET('/api/inventory'),
    lowStock: () => apiGET('/api/inventory/low-stock'),
    stockLedger: () => apiGET('/api/stock-ledger'),
    staff: (dept) => apiGET(`/api/staff${dept ? '?department=' + dept : ''}`),
    subscriptions: (status) => apiGET(`/api/subscriptions${status ? '?status=' + status : ''}`),
    customers: () => apiGET('/api/customers'),
    analytics: () => apiGET('/api/analytics/summary'),
    kds: () => apiGET('/api/kds/status'),
    updateKDS: (orderId, state) => apiPOST(`/api/kds/status/${orderId}`, { state }),
    purchaseOrders: (status) => apiGET(`/api/procurement/purchase-orders${status ? '?status=' + status : ''}`),
    recipeBOMs: () => apiGET('/api/recipe-boms'),
  }
};

window.TanmatraAPI = TanmatraAPI;
