import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Đã đăng xuất!');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl">
          <span className="text-2xl">✈️</span>
          <span>DANG_Air</span>
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <Link to="/flights" className="hover:text-primary">Chuyến bay</Link>
          {user && (
            <Link to="/my-bookings" className="hover:text-primary">Vé của tôi</Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/dashboard" className="hover:text-primary text-purple-600">
              Dashboard
            </Link>
          )}
        </div>

        {/* Auth buttons */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden md:block">
                Xin chào, <strong>{user.name}</strong>
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium"
              >
                Đăng xuất
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white font-medium"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-blue-700 font-medium"
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}