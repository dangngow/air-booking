import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Vui lòng điền đầy đủ thông tin');
      return;
    }
    try {
      setLoading(true);
      const user = await login(form.email, form.password);
      toast.success(`Chào mừng ${user.name}!`);
      navigate(user.role === 'admin' ? '/dashboard' : '/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Đăng nhập thất bại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-2">✈️</div>
          <h1 className="text-2xl font-bold text-gray-800">Đăng nhập</h1>
          <p className="text-gray-400 text-sm mt-1">Chào mừng trở lại DANG_Air</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700 disabled:opacity-50 mt-2"
          >
            {loading ? '⏳ Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-primary font-medium hover:underline">
            Đăng ký ngay
          </Link>
        </p>

        {/* Tài khoản demo */}
        <div className="mt-6 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
        </div>
      </div>
    </div>
  );
}