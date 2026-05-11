import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import toast from 'react-hot-toast';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);
const formatDateTime = (d) =>
  new Date(d).toLocaleString('vi-VN', {
    weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

export default function FlightDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [flight, setFlight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState('economy');

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const res = await api.get(`/flights/${id}`);
        setFlight(res.data);
      } catch {
        toast.error('Không tìm thấy chuyến bay');
        navigate('/flights');
      } finally {
        setLoading(false);
      }
    };
    fetchFlight();
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
      toast.error('Vui lòng đăng nhập để đặt vé!');
      navigate('/login');
      return;
    }
    setShowModal(true);
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!flight) return null;

  const duration = Math.round((new Date(flight.arrivalTime) - new Date(flight.departureTime)) / 60000);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">

      {/* Nút quay lại */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-primary mb-6 text-sm">
        ← Quay lại
      </button>

      {/* Card chính */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-blue-700 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm">Hãng hàng không</p>
              <h1 className="text-2xl font-bold">{flight.airline}</h1>
              <p className="text-blue-200 text-sm mt-1">Số hiệu: {flight.flightNumber}</p>
            </div>
            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
              {flight.status === 'scheduled' ? '✅ Đúng giờ' : '⚠️ ' + flight.status}
            </span>
          </div>
        </div>

        {/* Thông tin bay */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 text-center mb-6">
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {new Date(flight.departureTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-primary font-bold text-xl">{flight.from.code}</p>
              <p className="text-gray-500 text-sm">{flight.from.city}</p>
              <p className="text-gray-400 text-xs mt-1">{flight.from.airport}</p>
            </div>

            <div className="flex flex-col items-center justify-center">
              <p className="text-gray-400 text-sm">{Math.floor(duration / 60)}h {duration % 60}p</p>
              <div className="flex items-center w-full my-2">
                <div className="flex-1 h-px bg-gray-200"></div>
                <span className="mx-2 text-primary">✈</span>
                <div className="flex-1 h-px bg-gray-200"></div>
              </div>
              <p className="text-gray-400 text-xs">Bay thẳng</p>
            </div>

            <div>
              <p className="text-3xl font-bold text-gray-800">
                {new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
              </p>
              <p className="text-primary font-bold text-xl">{flight.to.code}</p>
              <p className="text-gray-500 text-sm">{flight.to.city}</p>
              <p className="text-gray-400 text-xs mt-1">{flight.to.airport}</p>
            </div>
          </div>

          {/* Ngày giờ */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-sm text-gray-600">
            <p>🛫 Khởi hành: <strong>{formatDateTime(flight.departureTime)}</strong></p>
            <p className="mt-1">🛬 Hạ cánh: <strong>{formatDateTime(flight.arrivalTime)}</strong></p>
          </div>

          {/* Chọn hạng ghế */}
          <h3 className="font-bold text-gray-700 mb-3">Chọn hạng ghế</h3>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {/* Economy */}
            <div
              onClick={() => setSelectedClass('economy')}
              className={`border-2 rounded-xl p-4 cursor-pointer ${
                selectedClass === 'economy' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-700">🪑 Phổ thông</p>
              <p className="text-primary font-bold text-lg mt-1">{formatPrice(flight.price.economy)}</p>
              <p className="text-gray-400 text-xs mt-1">Còn {flight.seats.economy} ghế</p>
            </div>

            {/* Business */}
            <div
              onClick={() => setSelectedClass('business')}
              className={`border-2 rounded-xl p-4 cursor-pointer ${
                selectedClass === 'business' ? 'border-primary bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <p className="font-semibold text-gray-700">💺 Thương gia</p>
              <p className="text-primary font-bold text-lg mt-1">{formatPrice(flight.price.business)}</p>
              <p className="text-gray-400 text-xs mt-1">Còn {flight.seats.business} ghế</p>
            </div>
          </div>

          {/* Nút đặt vé */}
          <button
            onClick={handleBookClick}
            disabled={flight.seats[selectedClass] === 0}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {flight.seats[selectedClass] === 0 ? '❌ Hết ghế' : '🎫 Đặt Vé Ngay'}
          </button>
        </div>
      </div>

      {/* Modal đặt vé */}
      {showModal && (
        <BookingModal
          flight={flight}
          seatClass={selectedClass}
          onClose={() => setShowModal(false)}
          onSuccess={() => navigate('/')}
        />
      )}
    </div>
  );
}