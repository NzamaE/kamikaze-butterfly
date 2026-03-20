// ================================================
// KAMIKAZE BUTTERFLY — API LAYER
// All backend calls go through here
// ================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// ================================================
// HELPERS
// ================================================

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${getToken()}`,
});

const handleResponse = async (res: Response) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ================================================
// AUTH
// ================================================

export const authAPI = {
  register: async (name: string, email: string, password: string, role: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, role }),
    });
    return handleResponse(res);
  },

  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await handleResponse(res);
    // Save token and user to localStorage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getMe: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: headers() });
    return handleResponse(res);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// ================================================
// WEDDING PLANS
// ================================================

export const plansAPI = {
  create: async (plan: {
    name: string;
    budget: number;
    location: string;
    guest_count: number;
    theme: string;
    wedding_date: string;
  }) => {
    const res = await fetch(`${BASE_URL}/plans`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(plan),
    });
    return handleResponse(res);
  },

  getAll: async () => {
    const res = await fetch(`${BASE_URL}/plans`, { headers: headers() });
    return handleResponse(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/plans/${id}`, { headers: headers() });
    return handleResponse(res);
  },

  update: async (id: string, data: Partial<{
    name: string;
    budget: number;
    location: string;
    guest_count: number;
    theme: string;
    wedding_date: string;
  }>) => {
    const res = await fetch(`${BASE_URL}/plans/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  delete: async (id: string) => {
    const res = await fetch(`${BASE_URL}/plans/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    return handleResponse(res);
  },

  publish: async (id: string) => {
    const res = await fetch(`${BASE_URL}/plans/${id}/publish`, {
      method: 'PATCH',
      headers: headers(),
    });
    return handleResponse(res);
  },

  getPublic: async (theme?: string, search?: string) => {
    const params = new URLSearchParams();
    if (theme) params.append('theme', theme);
    if (search) params.append('search', search);
    const res = await fetch(`${BASE_URL}/plans/public?${params}`);
    return handleResponse(res);
  },
};

// ================================================
// VENDORS
// ================================================

export const vendorsAPI = {
  getAll: async (filters?: {
    service_type?: string;
    location?: string;
    search?: string;
  }) => {
    const params = new URLSearchParams();
    if (filters?.service_type) params.append('service_type', filters.service_type);
    if (filters?.location) params.append('location', filters.location);
    if (filters?.search) params.append('search', filters.search);
    const res = await fetch(`${BASE_URL}/vendors?${params}`);
    return handleResponse(res);
  },

  getById: async (id: string) => {
    const res = await fetch(`${BASE_URL}/vendors/${id}`);
    return handleResponse(res);
  },

  create: async (data: {
    service_type: string;
    description: string;
    base_price: number;
    location: string;
  }) => {
    const res = await fetch(`${BASE_URL}/vendors`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  update: async (id: string, data: Partial<{
    service_type: string;
    description: string;
    base_price: number;
    location: string;
  }>) => {
    const res = await fetch(`${BASE_URL}/vendors/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  addAvailability: async (id: string, dates: string[]) => {
    const res = await fetch(`${BASE_URL}/vendors/${id}/availability`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ dates }),
    });
    return handleResponse(res);
  },

  getAvailability: async (id: string) => {
    const res = await fetch(`${BASE_URL}/vendors/${id}/availability`);
    return handleResponse(res);
  },

  addGalleryImage: async (id: string, image_url: string) => {
    const res = await fetch(`${BASE_URL}/vendors/${id}/gallery`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ image_url }),
    });
    return handleResponse(res);
  },
};

// ================================================
// SERVICE REQUESTS
// ================================================

export const requestsAPI = {
  create: async (data: {
    vendor_id: string;
    plan_id: string;
    checklist_item_id: string;
    requested_date: string;
  }) => {
    const res = await fetch(`${BASE_URL}/requests`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  getClientRequests: async () => {
    const res = await fetch(`${BASE_URL}/requests/client`, { headers: headers() });
    return handleResponse(res);
  },

  getVendorRequests: async () => {
    const res = await fetch(`${BASE_URL}/requests/vendor`, { headers: headers() });
    return handleResponse(res);
  },

  accept: async (id: string) => {
    const res = await fetch(`${BASE_URL}/requests/${id}/accept`, {
      method: 'PATCH',
      headers: headers(),
    });
    return handleResponse(res);
  },

  reject: async (id: string) => {
    const res = await fetch(`${BASE_URL}/requests/${id}/reject`, {
      method: 'PATCH',
      headers: headers(),
    });
    return handleResponse(res);
  },

  cancel: async (id: string) => {
    const res = await fetch(`${BASE_URL}/requests/${id}/cancel`, {
      method: 'PATCH',
      headers: headers(),
    });
    return handleResponse(res);
  },
};

// ================================================
// ADMIN
// ================================================

export const adminAPI = {
  getStats: async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, { headers: headers() });
    return handleResponse(res);
  },

  getAllVendors: async () => {
    const res = await fetch(`${BASE_URL}/admin/vendors`, { headers: headers() });
    return handleResponse(res);
  },

  getPendingVendors: async () => {
    const res = await fetch(`${BASE_URL}/admin/vendors/pending`, { headers: headers() });
    return handleResponse(res);
  },

  verifyVendor: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/vendors/${id}/verify`, {
      method: 'PATCH',
      headers: headers(),
    });
    return handleResponse(res);
  },

  removeVendor: async (id: string) => {
    const res = await fetch(`${BASE_URL}/admin/vendors/${id}`, {
      method: 'DELETE',
      headers: headers(),
    });
    return handleResponse(res);
  },

  getAllClients: async () => {
    const res = await fetch(`${BASE_URL}/admin/clients`, { headers: headers() });
    return handleResponse(res);
  },
};