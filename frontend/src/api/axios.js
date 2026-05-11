import axios from 'axios';

// Khi build production (Netlify/Render) → dùng VITE_API_URL
// Khi dev local (npm run dev)           → dùng proxy /api → localhost:5000
const BASE_URL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Tự động gắn JWT token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Token hết hạn → tự logout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ redirect về login khi đang ở trang cần auth (không phải trang login/register)
    if (error.response?.status === 401) {
      const publicPaths = ['/login', '/register'];
      const isPublic = publicPaths.some(p => window.location.pathname.startsWith(p));
      if (!isPublic) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;