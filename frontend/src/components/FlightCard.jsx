import { Link } from 'react-router-dom';

// Hàm format tiền Việt Nam
const formatPrice = (price) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

// Hàm format giờ từ ISO date
const formatTime = (dateStr) =>
  new Date(dateStr).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });

// Hàm tính thời gian bay
const calcDuration = (dep, arr) => {
  const diff = (new Date(arr) - new Date(dep)) / 60000; // phút
  return `${Math.floor(diff / 60)}h ${diff % 60}p`;
};

// Màu trạng thái chuyến bay
const statusColor = {
  scheduled: 'bg-green-100 text-green-700',
  delayed: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  completed: 'bg-gray-100 text-gray-600',
};

const statusLabel = {
  scheduled: 'Đúng giờ',
  delayed: 'Trễ',
  cancelled: 'Hủy',
  completed: 'Hoàn thành',
};

export default function FlightCard({ flight }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-1 overflow-hidden">

      {/* Header hãng hàng không */}
      <div className="bg-gradient-to-r from-primary to-blue-700 px-5 py-3 flex justify-between items-center">
        <div className="text-white">
          <p className="font-bold text-lg">{flight.airline}</p>
          <p className="text-blue-100 text-sm">{flight.flightNumber}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium bg-white ${
          flight.status === 'scheduled' ? 'text-green-600' :
          flight.status === 'delayed' ? 'text-yellow-600' : 'text-red-600'
        }`}>
          {statusLabel[flight.status]}
        </span>
      </div>

      {/* Thông tin bay */}
      <div className="px-5 py-4">
        <div className="flex items-center justify-between gap-4">

          {/* Điểm đi */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{formatTime(flight.departureTime)}</p>
            <p className="text-primary font-bold text-lg">{flight.from.code}</p>
            <p className="text-gray-400 text-xs">{flight.from.city}</p>
          </div>

          {/* Đường bay */}
          <div className="flex-1 text-center">
            <p className="text-gray-400 text-xs mb-1">{calcDuration(flight.departureTime, flight.arrivalTime)}</p>
            <div className="flex items-center gap-1">
              <div className="h-px flex-1 bg-gray-200"></div>
              <span className="text-gray-400">✈</span>
              <div className="h-px flex-1 bg-gray-200"></div>
            </div>
            <p className="text-gray-400 text-xs mt-1">Bay thẳng</p>
          </div>

          {/* Điểm đến */}
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{formatTime(flight.arrivalTime)}</p>
            <p className="text-primary font-bold text-lg">{flight.to.code}</p>
            <p className="text-gray-400 text-xs">{flight.to.city}</p>
          </div>
        </div>

        {/* Ghế còn lại */}
        <div className="flex gap-4 mt-4 text-xs text-gray-500">
          <span>🪑 Phổ thông: <strong>{flight.seats.economy}</strong> ghế</span>
          <span>💺 Thương gia: <strong>{flight.seats.business}</strong> ghế</span>
        </div>
      </div>

      {/* Footer giá + nút */}
      <div className="px-5 py-3 bg-gray-50 flex items-center justify-between border-t border-gray-100">
        <div>
          <p className="text-xs text-gray-400">Từ</p>
          <p className="text-primary font-bold text-lg">{formatPrice(flight.price.economy)}</p>
        </div>
        <Link
          to={`/flights/${flight._id}`}
          className="px-5 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          Xem chi tiết →
        </Link>
      </div>
    </div>
  );
}