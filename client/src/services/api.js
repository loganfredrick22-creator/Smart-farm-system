import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${API_BASE}/auth/refresh`, {}, { withCredentials: true });
        return api(originalRequest);
      } catch {
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  refresh: () => api.post('/auth/refresh'),
  getMe: () => api.get('/auth/me'),
  changePassword: (data) => api.post('/auth/change-password', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (data) => api.post('/auth/reset-password', data),
};

export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.patch('/users/profile', data),
  list: (params) => api.get('/users', { params }),
  toggleStatus: (id, action) => api.patch(`/users/${id}/status`, { action }),
};

export const livestockAPI = {
  list: (params) => api.get('/livestock', { params }),
  getById: (id) => api.get(`/livestock/${id}`),
  create: (data) => api.post('/livestock', data),
  update: (id, data) => api.patch(`/livestock/${id}`, data),
  delete: (id) => api.delete(`/livestock/${id}`),
  addVaccination: (id, data) => api.post(`/livestock/${id}/vaccinations`, data),
  addMedicalRecord: (id, data) => api.post(`/livestock/${id}/medical-records`, data),
  addBreeding: (id, data) => api.post(`/livestock/${id}/breeding`, data),
  getStats: (farmId) => api.get(`/livestock/stats/${farmId}`),
};

export const cropAPI = {
  list: (params) => api.get('/crops', { params }),
  getById: (id) => api.get(`/crops/${id}`),
  create: (data) => api.post('/crops', data),
  update: (id, data) => api.patch(`/crops/${id}`, data),
  delete: (id) => api.delete(`/crops/${id}`),
  addTreatment: (id, data) => api.post(`/crops/${id}/treatments`, data),
  getStats: (farmId) => api.get(`/crops/stats/${farmId}`),
};

export const financeAPI = {
  listTransactions: (params) => api.get('/finance/transactions', { params }),
  getTransaction: (id) => api.get(`/finance/transactions/${id}`),
  createTransaction: (data) => api.post('/finance/transactions', data),
  updateTransaction: (id, data) => api.patch(`/finance/transactions/${id}`, data),
  deleteTransaction: (id) => api.delete(`/finance/transactions/${id}`),
  getSummary: (farmId, params) => api.get(`/finance/summary/${farmId}`, { params }),
  getCategoryBreakdown: (farmId, params) => api.get(`/finance/category-breakdown/${farmId}`, { params }),
  listBudgets: (params) => api.get('/finance/budgets', { params }),
  createBudget: (data) => api.post('/finance/budgets', data),
  updateBudget: (id, data) => api.patch(`/finance/budgets/${id}`, data),
  deleteBudget: (id) => api.delete(`/finance/budgets/${id}`),
};

export const healthAPI = {
  list: (params) => api.get('/health', { params }),
  getById: (id) => api.get(`/health/${id}`),
  create: (data) => api.post('/health', data),
  update: (id, data) => api.patch(`/health/${id}`, data),
  delete: (id) => api.delete(`/health/${id}`),
  getOpenCases: (farmId) => api.get(`/health/open-cases/${farmId}`),
};

export const messagingAPI = {
  listConversations: () => api.get('/messaging/conversations'),
  createConversation: (data) => api.post('/messaging/conversations', data),
  getConversation: (id) => api.get(`/messaging/conversations/${id}`),
  getMessages: (conversationId, params) => api.get(`/messaging/conversations/${conversationId}/messages`, { params }),
  sendMessage: (data) => api.post('/messaging/messages', data),
  getUnreadCount: () => api.get('/messaging/unread-count'),
};

export const alertAPI = {
  list: (params) => api.get('/alerts', { params }),
  create: (data) => api.post('/alerts', data),
  markRead: (id) => api.patch(`/alerts/${id}/read`),
  markAllRead: () => api.patch('/alerts/mark-all-read'),
  resolve: (id) => api.patch(`/alerts/${id}/resolve`),
  delete: (id) => api.delete(`/alerts/${id}`),
  getUnreadCount: () => api.get('/alerts/unread-count'),
  getActionRequired: (farmId) => api.get(`/alerts/action-required/${farmId}`),
};
