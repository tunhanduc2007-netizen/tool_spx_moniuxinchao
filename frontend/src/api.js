/**
 * Shopee Seller Pro - API Client & Data Service
 */

const API_BASE = "http://127.0.0.1:8000";

export const getToken = () => localStorage.getItem("shopee_token") || "";
export const setToken = (t) => localStorage.setItem("shopee_token", t);
export const removeToken = () => localStorage.removeItem("shopee_token");

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
    });

    if (res.status === 401) {
      removeToken();
    }

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.detail || data.message || "Lỗi xử lý yêu cầu");
    }
    return data;
  } catch (err) {
    console.warn(`API call failed for ${endpoint}:`, err);
    throw err;
  }
}

// Auth API
export const authAPI = {
  login: (username_or_email, password) => 
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username_or_email, password, remember_me: true })
    }),
  shopeeSellerLogin: (data = {}) =>
    request("/api/auth/shopee-seller-login", {
      method: "POST",
      body: JSON.stringify(data)
    }),
  getShopeeOAuthUrl: () => request("/api/auth/shopee-oauth-url"),
  logout: () => {
    removeToken();
    return request("/api/auth/logout", { method: "POST" }).catch(() => ({}));
  },
  ensureAuth: async () => {
    let token = getToken();
    if (token) {
      try {
        const me = await request("/api/auth/me");
        if (me && me.user) return me.user;
      } catch (e) {
        removeToken();
      }
    }
    return null;
  }
};

// Orders API
export const ordersAPI = {
  list: (status = "ALL", search = "") => 
    request(`/api/orders?status=${encodeURIComponent(status)}&search=${encodeURIComponent(search)}`),
  unprinted: () => request("/api/orders?is_printed=false"),
  detail: (id) => request(`/api/orders/${id}`),
  updateStatus: (id, order_status) => 
    request(`/api/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ order_status })
    }),
};


// Batch Print API
export const printAPI = {
  preview: (order_sns) => 
    request("/api/print/batch-preview", {
      method: "POST",
      body: JSON.stringify({ order_sns, paper_size: "THERMAL_100x150" })
    }),
  confirm: (order_sns) => 
    request("/api/print/confirm-printed", {
      method: "POST",
      body: JSON.stringify({ order_sns, paper_size: "THERMAL_100x150" })
    }),
};

// Warehouse & Inventory API
export const warehouseAPI = {
  list: () => request("/api/warehouse/list"),
  inventory: (warehouse_id = null, low_stock_only = false) => {
    let url = `/api/warehouse/inventory?low_stock_only=${low_stock_only}`;
    if (warehouse_id) url += `&warehouse_id=${warehouse_id}`;
    return request(url);
  },
  adjustStock: (sku_id, warehouse_id, quantity_delta, notes = "Điều chỉnh kiểm kê") =>
    request("/api/warehouse/inventory/adjust", {
      method: "POST",
      body: JSON.stringify({ sku_id, warehouse_id, quantity_delta, notes })
    }),
};

// Products API
export const productsAPI = {
  list: (search = "") => request(`/api/products?search=${encodeURIComponent(search)}`),
  pushStock: (sku_id) => request(`/api/products/skus/${sku_id}/push-stock`, { method: "POST" }),
};

// Customers CRM API
export const customersAPI = {
  list: (tier = "ALL", search = "") => 
    request(`/api/customers?tier=${encodeURIComponent(tier)}&search=${encodeURIComponent(search)}`),
  rankings: () => request("/api/customers/rankings"),
};

// Reports API
export const reportsAPI = {
  dashboard: () => request("/api/reports/dashboard"),
  analytics: () => request("/api/reports/analytics"),
};

// Shopee Open Platform API
export const shopeeAPI = {
  shops: () => request("/api/shopee/shops"),
  syncOrders: (shop_id) => request(`/api/shopee/shops/${shop_id}/sync-orders`, { method: "POST" }),
  syncProducts: (shop_id) => request(`/api/shopee/shops/${shop_id}/sync-products`, { method: "POST" }),
  inventoryTable: () => request("/api/shopee/api-inventory"),
};

// Users & Staff API
export const usersAPI = {
  list: () => request("/api/users"),
  create: (data) => request("/api/users/create", { method: "POST", body: JSON.stringify(data) }),
};

