import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function BookingModal({ flight, seatClass, onClose }) {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([{ name: '', age: '', passport: '' }]);

  const addPassenger = () => {
    if (passengers.length >= 5) return;
    setPassengers([...passengers, { name: '', age: '', passport: '' }]);
  };

  const removePassenger = (i) =>
    setPassengers(passengers.filter((_, idx) => idx !== i));

  const updatePassenger = (i, field, value) => {
    const updated = [...passengers];
    updated[i][field] = value;
    setPassengers(updated);
  };

  const total = flight.price[seatClass] * passengers.length;

  // Thay vì gọi API đặt vé ngay → chuyển sang trang thanh toán
  const handleNext = () => {
    for (let p of passengers) {
      if (!p.name || !p.age || !p.passport) {
        alert('Vui lòng điền đầy đủ thông tin hành khách');
        return;
      }
    }
    // Lưu thông tin vào sessionStorage để trang Payment đọc
    sessionStorage.setItem('bookingDraft', JSON.stringify({
      flight,
      seatClass,
      passengers,
      totalPrice: total,
    }));
    onClose();
    navigate(`/payment/${flight._id}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-lg font-bold text-gray-800">🧑‍✈️ Thông tin hành khách</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Tóm tắt chuyến bay */}
          <div className="bg-blue-50 rounded-xl p-4 text-sm">
            <p className="font-semibold text-gray-700">{flight.airline} • {flight.flightNumber}</p>
            <p className="text-gray-500 mt-1">
              {flight.from.code} → {flight.to.code} •{' '}
              {seatClass === 'economy' ? 'Phổ thông' : 'Thương gia'}
            </p>
            <p className="text-primary font-bold mt-1">{formatPrice(flight.price[seatClass])}/người</p>
          </div>

          {/* Danh sách hành khách */}
          {passengers.map((p, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex justify-between items-center">
                <p className="font-medium text-gray-700">Hành khách {i + 1}</p>
                {passengers.length > 1 && (
                  <button onClick={() => removePassenger(i)} className="text-red-400 hover:text-red-600 text-sm">Xóa</button>
                )}
              </div>
              <input
                placeholder="Họ và tên *"
                value={p.name}
                onChange={(e) => updatePassenger(i, 'name', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number" placeholder="Tuổi *" value={p.age}
                  onChange={(e) => updatePassenger(i, 'age', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  placeholder="CCCD/Passport *" value={p.passport}
                  onChange={(e) => updatePassenger(i, 'passport', e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          ))}

          <button
            onClick={addPassenger}
            className="w-full border-2 border-dashed border-gray-200 py-2 rounded-xl text-sm text-gray-400 hover:border-primary hover:text-primary"
          >
            + Thêm hành khách
          </button>

          {/* Tổng tiền */}
          <div className="bg-gray-50 rounded-xl p-4 flex justify-between items-center">
            <span className="text-gray-600 font-medium">Tổng cộng ({passengers.length} khách)</span>
            <span className="text-primary font-bold text-xl">{formatPrice(total)}</span>
          </div>

          {/* Nút tiếp tục → trang thanh toán */}
          <button
            onClick={handleNext}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-blue-700"
          >
            Tiếp tục → Thanh toán
          </button>
        </div>
      </div>
    </div>
  );
}