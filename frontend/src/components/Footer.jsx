import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <span>✈️</span><span>DANG_Air</span>
            </div>
            <p className="text-sm text-gray-400">
              Đặt vé máy bay nhanh chóng, tiện lợi và an toàn.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Liên kết</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white">Trang chủ</Link></li>
              <li><Link to="/flights" className="hover:text-white">Tìm chuyến bay</Link></li>
              <li><Link to="/login" className="hover:text-white">Đăng nhập</Link></li>
              <li><Link to="/register" className="hover:text-white">Đăng ký</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>📧 ngodang2301@gmail.com</li>
              <li>📞 0369993636</li>
              <li>📍 Thanh Hóa, Việt Nam</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-sm text-gray-500">
          © 2026 DANG_Air. Đồ án 1:Đồ án cơ sở N1.ND.
        </div>
      </div>
    </footer>
  );
}