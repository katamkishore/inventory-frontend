const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(endpoint, options = {}) {
  const token = getToken()
  const isFormData = options.body instanceof FormData
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(!isFormData ? { 'Content-Type': 'application/json' } : {}),
    ...options.headers,
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
    cache: 'no-store',
  })
  let data
  try {
    const text = await response.text()
    data = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(response.ok ? 'Invalid server response' : 'Request failed')
  }
  if (!response.ok) throw new Error(data.message || 'Request failed')
  return data
}

export const api = {
  // Auth
  register: (body) => request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) => request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  forgotPassword: (body) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify(body) }),
  verifyOTP: (body) => request('/auth/verify-otp', { method: 'POST', body: JSON.stringify(body) }),
  resetPassword: (body) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(body) }),

  // Dashboard
  getDashboard: () => request('/dashboard'),

  // Products
  getProducts: (params = {}) => {
    const page = params.page ?? 1
    const limit = params.limit ?? 10
    const search = params.search
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search != null && String(search).trim() !== '') q.set('search', String(search).trim())
    return request(`/products?${q}`)
  },
  createProduct: (formData) => request('/products', { method: 'POST', body: formData }),
  uploadCSV: (formData) => request('/products/csv', { method: 'POST', body: formData }),
  buyProduct: (id, body) => request(`/products/${id}/buy`, { method: 'POST', body: JSON.stringify(body) }),
  deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

  // Invoices
  getInvoices: (params = {}) => request(`/invoices?${new URLSearchParams(params)}`),
  getInvoice: (id) => request(`/invoices/${id}`),
  updateInvoice: (id, body) => request(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteInvoice: (id) => request(`/invoices/${id}`, { method: 'DELETE' }),

  // Statistics
  getStatistics: () => request('/statistics'),
  updateCardOrder: (body) => request('/statistics/card-order', { method: 'PUT', body: JSON.stringify(body) }),

  // Settings
  getSettings: () => request('/settings'),
  updateSettings: (body) => request('/settings', { method: 'PUT', body: JSON.stringify(body) }),
}
