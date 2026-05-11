import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

// Các phương thức thanh toán
const METHODS = [
  {
    id: 'vnpay',
    name: 'VNPay',
    desc: 'Thẻ ATM / Internet Banking',
    icon: '🏦',
    color: 'border-blue-200 bg-blue-50',
    activeColor: 'border-primary bg-blue-50',
    banks: ['Vietcombank', 'BIDV', 'Techcombank', 'Agribank', 'VPBank', 'MBBank'],
  },
  {
    id: 'card',
    name: 'Thẻ tín dụng / Ghi nợ',
    desc: 'Visa, Mastercard, JCB',
    icon: '💳',
    color: 'border-gray-200',
    activeColor: 'border-primary bg-blue-50',
    banks: [],
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    desc: 'Thanh toán qua ví điện tử MoMo',
    icon: '💜',
    color: 'border-pink-100 bg-pink-50',
    activeColor: 'border-pink-500 bg-pink-50',
    banks: [],
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    desc: 'Thanh toán qua ví ZaloPay',
    icon: '🔵',
    color: 'border-blue-100 bg-blue-50',
    activeColor: 'border-blue-500 bg-blue-50',
    banks: [],
  },
  {
    id: 'cash',
    name: 'Thanh toán tại quầy',
    desc: 'Thanh toán trực tiếp tại phòng vé',
    icon: '🏢',
    color: 'border-gray-200',
    activeColor: 'border-primary bg-blue-50',
    banks: [],
  },
];

// Validate số thẻ → format xxxx xxxx xxxx xxxx
const formatCardNumber = (v) =>
  v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();

// Validate ngày hết hạn MM/YY
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  return d.length >= 2 ? d.slice(0, 2) + '/' + d.slice(2) : d;
};

export default function Payment() {
  const navigate = useNavigate();
  const [draft, setDraft] = useState(null);       // Dữ liệu từ BookingModal
  const [method, setMethod] = useState('vnpay');   // Phương thức đang chọn
  const [bank, setBank] = useState('');            // Ngân hàng (VNPay)
  const [processing, setProcessing] = useState(false); // Đang xử lý
  const [step, setStep] = useState(1);             // Bước hiện tại (1: chọn PT, 2: nhập TT, 3: xác nhận)

  // Form thẻ tín dụng
  const [card, setCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  // Đọc dữ liệu booking từ sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem('bookingDraft');
    if (!saved) {
      toast.error('Không tìm thấy thông tin đặt vé');
      navigate('/flights');
      return;
    }
    setDraft(JSON.parse(saved));
  }, []);

  if (!draft) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const selectedMethod = METHODS.find(m => m.id === method);

  // Giả lập gọi API đặt vé + thanh toán
  const handlePay = async () => {
    // Validate form thẻ
    if (method === 'card') {
      if (card.number.replace(/\s/g, '').length < 16) return toast.error('Số thẻ không hợp lệ');
      if (!card.name) return toast.error('Vui lòng nhập tên chủ thẻ');
      if (card.expiry.length < 5) return toast.error('Ngày hết hạn không hợp lệ');
      if (card.cvv.length < 3) return toast.error('CVV không hợp lệ');
    }
    if (method === 'vnpay' && !bank) return toast.error('Vui lòng chọn ngân hàng');

    try {
      setProcessing(true);

      // Gọi API tạo booking thật sự
      const res = await api.post('/bookings', {
        flightId: draft.flight._id,
        passengers: draft.passengers,
        seatClass: draft.seatClass,
      });

      // Giả lập thời gian xử lý thanh toán (2 giây)
      await new Promise(r => setTimeout(r, 2000));

      // Lưu thông tin thành công để trang PaymentSuccess đọc
      sessionStorage.setItem('paymentResult', JSON.stringify({
        booking: res.data.booking,
        method: selectedMethod.name,
        flight: draft.flight,
        passengers: draft.passengers,
        seatClass: draft.seatClass,
        totalPrice: draft.totalPrice,
        paidAt: new Date().toISOString(),
      }));

      // Xóa draft
      sessionStorage.removeItem('bookingDraft');

      navigate('/payment-success');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Thanh toán thất bại, vui lòng thử lại');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Tiêu đề */}
      <div className="mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-primary text-sm mb-3 flex items-center gap-1">
          ← Quay lại
        </button>
        <h1 className="text-2xl font-bold text-gray-800">💳 Thanh Toán</h1>
      </div>

      {/* Thanh tiến trình */}
      <div className="flex items-center gap-2 mb-8">
        {['Hành khách', 'Thanh toán', 'Xác nhận'].map((s, i) => (
          <div key={s} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
              i < 1 ? 'bg-green-500 text-white' : i === 1 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < 1 ? '✓' : i + 1}
            </div>
            <span className={`text-sm hidden sm:block ${i === 1 ? 'font-semibold text-primary' : 'text-gray-400'}`}>{s}</span>
            {i < 2 && <div className="flex-1 h-px bg-gray-200"></div>}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ===== CỘT TRÁI: Form thanh toán ===== */}
        <div className="lg:col-span-2 space-y-5">

          {/* Chọn phương thức thanh toán */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-bold text-gray-700 mb-4">Chọn phương thức thanh toán</h2>
            <div className="space-y-3">
              {METHODS.map(m => (
                <div
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    method === m.id ? m.activeColor + ' border-2' : 'border-gray-100 hover:border-gray-200'
                  }`}
                  style={{ borderColor: method === m.id ? (m.id === 'momo' ? '#ec4899' : m.id === 'zalopay' ? '#3b82f6' : '#2563eb') : '' }}
                >
                  <span className="text-2xl">{m.icon}</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-700 text-sm">{m.name}</p>
                    <p className="text-gray-400 text-xs">{m.desc}</p>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    method === m.id ? 'border-primary bg-primary' : 'border-gray-300'
                  }`}>
                    {method === m.id && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Form chi tiết theo phương thức */}
          {method === 'vnpay' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-700 mb-4">🏦 Chọn ngân hàng</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {METHODS[0].banks.map(b => (
                  <button
                    key={b}
                    onClick={() => setBank(b)}
                    className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      bank === b ? 'border-primary bg-blue-50 text-primary' : 'border-gray-100 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    🏦 {b}
                  </button>
                ))}
              </div>
              {bank && (
                <div className="mt-4 p-4 bg-blue-50 rounded-xl text-sm text-blue-700">
                  <p className="font-medium">✅ Đã chọn: {bank}</p>
                  <p className="text-blue-500 text-xs mt-1">Bạn sẽ được chuyển đến cổng thanh toán {bank} (giả lập)</p>
                </div>
              )}
            </div>
          )}

          {method === 'card' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-700 mb-4">💳 Thông tin thẻ</h2>

              {/* Preview thẻ ảo */}
              <div className="w-full h-44 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white mb-5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-10 translate-x-10"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
                <p className="text-blue-200 text-xs mb-4">✈️ AirBook Payment Card</p>
                <p className="text-xl font-mono tracking-widest">
                  {card.number || '•••• •••• •••• ••••'}
                </p>
                <div className="flex justify-between items-end mt-4">
                  <div>
                    <p className="text-blue-200 text-xs">Chủ thẻ</p>
                    <p className="font-semibold text-sm uppercase">
                      {card.name || 'TEN CHU THE'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-blue-200 text-xs">Hết hạn</p>
                    <p className="font-semibold text-sm">{card.expiry || 'MM/YY'}</p>
                  </div>
                </div>
              </div>

              {/* Form nhập thẻ */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Số thẻ</label>
                  <input
                    placeholder="1234 5678 9012 3456"
                    value={card.number}
                    onChange={e => setCard({ ...card, number: formatCardNumber(e.target.value) })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Tên chủ thẻ</label>
                  <input
                    placeholder="NGUYEN VAN A"
                    value={card.name}
                    onChange={e => setCard({ ...card, name: e.target.value.toUpperCase() })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm uppercase focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Ngày hết hạn</label>
                    <input
                      placeholder="MM/YY"
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">CVV</label>
                    <input
                      placeholder="•••"
                      type="password"
                      maxLength={4}
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {(method === 'momo' || method === 'zalopay') && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center">
              <div className="text-6xl mb-3">{selectedMethod.icon}</div>
              <h3 className="font-bold text-gray-700 text-lg mb-2">
                Thanh toán qua {selectedMethod.name}
              </h3>
              <p className="text-gray-400 text-sm mb-4">
                Nhấn "Xác nhận thanh toán" để tiến hành.<br />
                Hệ thống sẽ mô phỏng quá trình thanh toán.
              </p>
              <div className="bg-gray-50 rounded-xl p-4 inline-block">
                <p className="text-xs text-gray-400">Số tiền cần thanh toán</p>
                <p className="text-2xl font-bold text-primary">{formatPrice(draft.totalPrice)}</p>
              </div>
            </div>
          )}

          {method === 'cash' && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-bold text-gray-700 mb-3">🏢 Hướng dẫn thanh toán tại quầy</h2>
              <ol className="space-y-3 text-sm text-gray-600">
                {[
                  'Sau khi xác nhận, bạn sẽ nhận mã đặt chỗ tạm thời',
                  'Mang mã đặt chỗ đến quầy vé AirBook gần nhất',
                  'Thanh toán trong vòng 24 giờ để giữ chỗ',
                  'Nhận vé sau khi thanh toán thành công',
                ].map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-xs flex-shrink-0">{i + 1}</span>
                    {s}
                  </li>
                ))}
              </ol>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-100 rounded-xl text-xs text-yellow-700">
                ⚠️ Lưu ý: Chỗ sẽ bị hủy nếu không thanh toán trong 24 giờ
              </div>
            </div>
          )}
        </div>

        {/* ===== CỘT PHẢI: Tóm tắt đơn hàng ===== */}
        <div className="space-y-4">

          {/* Chi tiết chuyến bay */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-700 mb-4">📋 Tóm tắt đơn hàng</h3>

            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="font-semibold text-gray-700 text-sm">{draft.flight.airline}</p>
              <p className="text-2xl font-bold text-gray-800 mt-1">
                {draft.flight.from.code}
                <span className="text-primary mx-2 text-lg">→</span>
                {draft.flight.to.code}
              </p>
              <p className="text-gray-500 text-xs mt-1">
                {new Date(draft.flight.departureTime).toLocaleDateString('vi-VN', {
                  weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric'
                })}
              </p>
            </div>

            {/* Hành khách */}
            <div className="space-y-2 mb-4">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Hành khách</p>
              {draft.passengers.map((p, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-600">👤 {p.name}</span>
                  <span className="text-gray-400">{formatPrice(draft.flight.price[draft.seatClass])}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Hạng ghế</span>
                <span>{draft.seatClass === 'economy' ? 'Phổ thông' : 'Thương gia'}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Số lượng</span>
                <span>{draft.passengers.length} vé</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Phí thanh toán</span>
                <span className="text-green-600">Miễn phí</span>
              </div>
            </div>

            <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-700">Tổng cộng</span>
              <span className="font-bold text-primary text-xl">{formatPrice(draft.totalPrice)}</span>
            </div>
          </div>

          {/* Nút thanh toán */}
          <button
            onClick={handlePay}
            disabled={processing}
            className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 disabled:opacity-70 relative overflow-hidden"
          >
            {processing ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Đang xử lý thanh toán...
              </span>
            ) : (
              `✅ Xác nhận thanh toán • ${formatPrice(draft.totalPrice)}`
            )}
          </button>

          {/* Bảo mật */}
          <div className="text-center space-y-1">
            <p className="text-xs text-gray-400">🔒 Thanh toán được bảo mật bằng SSL 256-bit</p>
            <p className="text-xs text-gray-300">Thông tin thẻ được mã hóa an toàn</p>
          </div>
        </div>
      </div>
    </div>
  );
}