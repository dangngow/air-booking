import axios from 'axios';

// Tạo instance axios với cấu hình mặc định
const api = axios.create({
  baseURL: '/api', // Vite proxy sẽ chuyển → http://localhost:5000/api
  headers: { 'Content-Type': 'application/json' },
});

// Interceptor: Tự động gắn JWT token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: Xử lý lỗi response (VD: token hết hạn → tự logout)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token hết hạn → xóa và về trang login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;