import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

// Tạo Context để share trạng thái đăng nhập toàn app
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);       // Thông tin user
  const [loading, setLoading] = useState(true); // Đang kiểm tra đăng nhập

  // Khi app khởi động: kiểm tra có token trong localStorage không
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Hàm đăng nhập
  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    // Lưu vào localStorage để giữ đăng nhập khi reload trang
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  // Hàm đăng ký
  const register = async (name, email, password, phone) => {
    const res = await api.post('/auth/register', { name, email, password, phone });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    return user;
  };

  // Hàm đăng xuất
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook để dùng AuthContext dễ hơn
export const useAuth = () => useContext(AuthContext);