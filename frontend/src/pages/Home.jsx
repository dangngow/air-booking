import { useEffect, useState } from 'react';
import api from '../api/axios';
import SearchForm from '../components/SearchForm';
import FlightCard from '../components/FlightCard';

export default function Home() {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  // Lấy 6 chuyến bay mới nhất để hiển thị ở trang chủ
  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await api.get('/flights');
        setFlights(res.data.flights.slice(0, 6)); // Chỉ lấy 6 cái
      } catch (err) {
        console.error('Lỗi tải chuyến bay:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  return (
    <div>
      {/* ===== BANNER ===== */}
      <section className="bg-gradient-to-br from-primary via-blue-600 to-blue-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            ✈️ Đặt Vé Máy Bay<br />Nhanh Chóng & Tiện Lợi
          </h1>
          <p className="text-blue-100 text-lg mb-10">
            Hàng trăm chuyến bay mỗi ngày — Giá tốt nhất thị trường
          </p>

          {/* Form tìm kiếm nằm trong banner */}
          <SearchForm />
        </div>
      </section>

      {/* ===== TÍNH NĂNG NỔI BẬT ===== */}
      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '⚡', title: 'Đặt vé nhanh', desc: 'Chỉ mất 2 phút để hoàn tất đặt vé' },
            { icon: '💰', title: 'Giá tốt nhất', desc: 'Cam kết giá rẻ, không phí ẩn' },
            { icon: '🔒', title: 'An toàn & Bảo mật', desc: 'Thông tin cá nhân được mã hóa' },
          ].map((item) => (
            <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md">
              <div className="text-4xl mb-3">{item.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ===== CHUYẾN BAY NỔI BẬT ===== */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">🔥 Chuyến Bay Nổi Bật</h2>
          <a href="/flights" className="text-primary text-sm hover:underline">Xem tất cả →</a>
        </div>

        {loading ? (
          // Loading spinner
          <div className="flex justify-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : flights.length === 0 ? (
          <p className="text-center text-gray-400 py-10">Chưa có chuyến bay nào</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flights.map((f) => (
              <FlightCard key={f._id} flight={f} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}