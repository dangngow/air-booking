import { useEffect, useState } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

const statusConfig = {
  confirmed: { label: 'Đã xác nhận', color: 'bg-green-100 text-green-700', icon: '✅' },
  pending:   { label: 'Chờ xử lý',   color: 'bg-yellow-100 text-yellow-700', icon: '⏳' },
  cancelled: { label: 'Đã hủy',      color: 'bg-red-100 text-red-600', icon: '❌' },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [cancelling, setCancelling] = useState(null); // id đang hủy

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings');
      setBookings(res.data.bookings);
    } catch {
      toast.error('Không tải được danh sách vé');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const handleCancel = async (id) => {
    if (!confirm('Bạn có chắc muốn hủy vé này không?')) return;
    try {
      setCancelling(id);
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Đã hủy vé thành công');
      fetchBookings(); // Tải lại danh sách
    } catch (err) {
      toast.error(err.response?.data?.message || 'Hủy vé thất bại');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">🎫 Vé Của Tôi</h1>
      <p className="text-gray-400 text-sm mb-6">Quản lý tất cả vé máy bay đã đặt</p>

      {bookings.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
          <p className="text-5xl mb-4">🎫</p>
          <p className="text-gray-500 font-medium">Bạn chưa có vé nào</p>
          <p className="text-gray-400 text-sm mt-1 mb-5">Hãy tìm kiếm và đặt vé ngay!</p>
          <a href="/flights" className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-700">
            Tìm chuyến bay
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map(b => {
            const sc = statusConfig[b.status] || statusConfig.confirmed;
            const flight = b.flight;
            if (!flight) return null;

            return (
              <div key={b._id} className={`bg-white rounded-2xl border shadow-sm overflow-hidden ${b.status === 'cancelled' ? 'opacity-60' : 'border-gray-100'}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${sc.color}`}>
                      {sc.icon} {sc.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      Mã: <strong className="text-gray-600 font-mono">{b.bookingCode}</strong>
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(b.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                {/* Nội dung */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">

                    {/* Thông tin bay */}
                    <div className="flex-1">
                      <p className="text-sm text-gray-400 mb-1">{flight.airline} • {flight.flightNumber}</p>
                      <div className="flex items-center gap-3">
                        <div className="text-center">
                          <p className="text-xl font-bold text-gray-800">
                            {new Date(flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-primary font-bold">{flight.from?.code}</p>
                          <p className="text-gray-400 text-xs">{flight.from?.city}</p>
                        </div>
                        <div className="flex-1 flex items-center">
                          <div className="flex-1 h-px bg-gray-200"></div>
                          <span className="mx-2 text-gray-300 text-sm">✈</span>
                          <div className="flex-1 h-px bg-gray-200"></div>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-gray-800">
                            {new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <p className="text-primary font-bold">{flight.to?.code}</p>
                          <p className="text-gray-400 text-xs">{flight.to?.city}</p>
                        </div>
                      </div>
                      <p className="text-gray-400 text-xs mt-2">
                        📅 {new Date(flight.departureTime).toLocaleDateString('vi-VN', {
                          weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </p>
                    </div>

                    {/* Giá + hành khách + nút */}
                    <div className="sm:text-right space-y-2 sm:min-w-[160px]">
                      <div>
                        <p className="text-xs text-gray-400">
                          {b.passengers?.length} khách •{' '}
                          {b.seatClass === 'economy' ? 'Phổ thông' : 'Thương gia'}
                        </p>
                        <p className="text-xl font-bold text-primary">{formatPrice(b.totalPrice)}</p>
                      </div>

                      {/* Tên hành khách */}
                      <div className="text-xs text-gray-400">
                        {b.passengers?.map((p, i) => (
                          <p key={i}>👤 {p.name}</p>
                        ))}
                      </div>

                      {/* Nút hủy (chỉ hiện khi confirmed) */}
                      {b.status === 'confirmed' && (
                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={cancelling === b._id}
                          className="text-xs text-red-400 hover:text-red-600 border border-red-200 hover:border-red-400 px-3 py-1.5 rounded-lg disabled:opacity-50"
                        >
                          {cancelling === b._id ? '⏳ Đang hủy...' : '🗑️ Hủy vé'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}