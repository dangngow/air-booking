import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const formatPrice = (p) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

export default function PaymentSuccess() {
  const navigate  = useNavigate();
  const ticketRef = useRef();               // Ref để chụp vé thành PDF
  const [result, setResult]     = useState(null);
  const [show, setShow]         = useState(false);
  const [exporting, setExporting] = useState(false); // Loading khi xuất PDF
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    const saved = sessionStorage.getItem('paymentResult');
    if (!saved) { navigate('/'); return; }
    setResult(JSON.parse(saved));
    setTimeout(() => setShow(true), 100);
  }, []);

  // ===== XUẤT PDF dùng jsPDF + html2canvas =====
  const handleExportPDF = async () => {
    try {
      setExporting(true);
      toast.loading('Đang tạo file PDF...', { id: 'pdf' });

      // Import động để tránh lỗi SSR
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');

      // Chụp ảnh phần tử vé
      const canvas = await html2canvas(ticketRef.current, {
        scale: 2,           // Độ phân giải cao x2
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const imgData    = canvas.toDataURL('image/png');
      const pdf        = new jsPDF('p', 'mm', 'a4');
      const pageWidth  = pdf.internal.pageSize.getWidth();   // 210mm
      const pageHeight = pdf.internal.pageSize.getHeight();  // 297mm

      // Tính chiều cao ảnh theo tỉ lệ
      const imgWidth   = pageWidth - 20;  // padding 10mm mỗi bên
      const imgHeight  = (canvas.height * imgWidth) / canvas.width;

      // Canh giữa theo chiều dọc nếu vé ngắn
      const yOffset = imgHeight < pageHeight ? (pageHeight - imgHeight) / 2 : 10;

      pdf.addImage(imgData, 'PNG', 10, yOffset, imgWidth, imgHeight);

      // Tên file: ve-VN101-ABC12345.pdf
      const fileName = `ve-${result.flight.flightNumber}-${result.booking.bookingCode}.pdf`;
      pdf.save(fileName);

      toast.success('Xuất PDF thành công!', { id: 'pdf' });
    } catch (err) {
      console.error(err);
      toast.error('Lỗi xuất PDF, vui lòng thử lại', { id: 'pdf' });
    } finally {
      setExporting(false);
    }
  };

  // ===== GỬI EMAIL GIẢ LẬP =====
  const handleFakeEmail = () => {
    if (emailSent) {
      toast('Email đã được gửi trước đó rồi!', { icon: 'ℹ️' });
      return;
    }
    // Giả lập loading 1.5 giây
    const id = toast.loading('Đang gửi email...');
    setTimeout(() => {
      toast.success(
        `Email xác nhận đã gửi!\nMã vé: ${result?.booking?.bookingCode}`,
        { id, duration: 4000 }
      );
      setEmailSent(true);
    }, 1500);
  };

  if (!result) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  const { booking, method, flight, passengers, seatClass, totalPrice, paidAt } = result;

  // Tính thời gian bay
  const duration = Math.round(
    (new Date(flight.arrivalTime) - new Date(flight.departureTime)) / 60000
  );

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">

      {/* ===== ANIMATION THÀNH CÔNG ===== */}
      <div className={`text-center mb-8 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <div className="relative inline-block mb-4">
          {/* Vòng pulse */}
          <div className="absolute inset-0 bg-green-400 rounded-full animate-ping opacity-20"></div>
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white text-4xl relative">
            ✓
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-800">Thanh toán thành công!</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Cảm ơn bạn đã đặt vé tại AirBook ✈️ — Chúc chuyến bay vui vẻ!
        </p>
      </div>

      {/* ===== VÉ MÁY BAY (phần này sẽ được xuất PDF) ===== */}
      <div
        ref={ticketRef}
        className={`bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6
          transition-all duration-700 delay-150
          ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Header gradient */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-200 text-xs tracking-widest uppercase mb-1">✈ AirBook E-Ticket</p>
              <h2 className="text-2xl font-bold">{flight.airline}</h2>
              <p className="text-blue-200 text-sm mt-0.5">Chuyến bay {flight.flightNumber}</p>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs uppercase tracking-wide">Mã đặt vé</p>
              <p className="text-3xl font-black font-mono tracking-widest mt-1">
                {booking.bookingCode}
              </p>
            </div>
          </div>
        </div>

        {/* Thông tin hành trình */}
        <div className="px-6 py-5">
          <div className="grid grid-cols-3 gap-2 text-center mb-5">
            {/* Điểm đi */}
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {new Date(flight.departureTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <p className="text-primary font-black text-2xl">{flight.from.code}</p>
              <p className="text-gray-500 text-sm">{flight.from.city}</p>
              <p className="text-gray-300 text-xs mt-0.5">{flight.from.airport}</p>
            </div>

            {/* Đường bay */}
            <div className="flex flex-col items-center justify-center gap-1">
              <p className="text-gray-400 text-xs font-medium">
                {Math.floor(duration / 60)}h {duration % 60}p
              </p>
              <div className="flex items-center w-full gap-1">
                <div className="h-px flex-1 bg-gray-300"></div>
                <span className="text-blue-400 text-lg">✈</span>
                <div className="h-px flex-1 bg-gray-300"></div>
              </div>
              <p className="text-gray-300 text-xs">Bay thẳng</p>
            </div>

            {/* Điểm đến */}
            <div>
              <p className="text-3xl font-bold text-gray-800">
                {new Date(flight.arrivalTime).toLocaleTimeString('vi-VN', {
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <p className="text-primary font-black text-2xl">{flight.to.code}</p>
              <p className="text-gray-500 text-sm">{flight.to.city}</p>
              <p className="text-gray-300 text-xs mt-0.5">{flight.to.airport}</p>
            </div>
          </div>

          {/* Ngày bay */}
          <div className="text-center mb-5">
            <span className="inline-block bg-blue-50 text-primary text-sm font-medium px-4 py-1.5 rounded-full">
              📅 {new Date(flight.departureTime).toLocaleDateString('vi-VN', {
                weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric',
              })}
            </span>
          </div>

          {/* Đường kẻ đứt kiểu vé xé */}
          <div className="relative my-5 mx-[-24px]">
            <div className="border-t-2 border-dashed border-gray-200 mx-6"></div>
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-50 rounded-full border border-gray-200 -translate-x-2.5"></div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-5 h-5 bg-gray-50 rounded-full border border-gray-200 translate-x-2.5"></div>
          </div>

          {/* Chi tiết hành khách & thanh toán */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">Hành khách</p>
              {passengers.map((p, i) => (
                <div key={i} className="flex items-center gap-2 mb-1">
                  <span className="w-5 h-5 bg-blue-100 text-primary rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="font-semibold text-gray-700">{p.name}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">Hạng ghế</p>
              <p className="font-semibold text-gray-700">
                {seatClass === 'economy' ? '🪑 Phổ thông (Economy)' : '💺 Thương gia (Business)'}
              </p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">Phương thức TT</p>
              <p className="font-semibold text-gray-700">💳 {method}</p>
            </div>

            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1.5">Thời gian TT</p>
              <p className="font-semibold text-gray-700">
                {new Date(paidAt).toLocaleString('vi-VN', {
                  day: '2-digit', month: '2-digit', year: 'numeric',
                  hour: '2-digit', minute: '2-digit',
                })}
              </p>
            </div>
          </div>

          {/* Tổng tiền */}
          <div className="mt-5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-4 flex justify-between items-center">
            <div>
              <p className="text-xs text-green-600 font-medium">✅ Đã thanh toán thành công</p>
              <p className="text-gray-400 text-xs mt-0.5">
                {passengers.length} hành khách × {formatPrice(flight.price?.[seatClass])}
              </p>
            </div>
            <p className="text-2xl font-black text-green-600">{formatPrice(totalPrice)}</p>
          </div>

          {/* Footer vé */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-xs text-gray-300">airbook.vn | support@airbook.vn | 1900 1234</p>
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
              {/* QR code giả — chỉ là ảnh placeholder */}
              <div className="grid grid-cols-4 gap-0.5">
                {Array.from({ length: 16 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2.5 h-2.5 rounded-sm"
                    style={{ background: Math.random() > 0.5 ? '#1e3a5f' : 'transparent' }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== NÚT HÀNH ĐỘNG ===== */}
      <div className={`space-y-3 transition-all duration-700 delay-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>

        {/* Hàng 1: Email + PDF */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleFakeEmail}
            className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium border transition-all ${
              emailSent
                ? 'bg-green-50 border-green-200 text-green-600 cursor-default'
                : 'bg-white border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
            }`}
          >
            {emailSent ? '✅ Đã gửi email' : '📧 Gửi email xác nhận'}
          </button>

          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-primary hover:text-primary disabled:opacity-50"
          >
            {exporting ? (
              <>
                <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                Đang tạo PDF...
              </>
            ) : (
              '📄 Xuất vé PDF'
            )}
          </button>
        </div>

        {/* Hàng 2: Vé của tôi + Đặt thêm */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            to="/my-bookings"
            className="flex items-center justify-center gap-2 py-3.5 bg-blue-50 border border-primary rounded-xl text-sm font-semibold text-primary hover:bg-blue-100"
          >
            🎫 Xem vé của tôi
          </Link>
          <Link
            to="/flights"
            className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            ✈️ Đặt thêm vé
          </Link>
        </div>
      </div>

      {/* Ghi chú */}
      <p className="text-center text-xs text-gray-300 mt-6">
        🔒 Giao dịch được bảo mật · Mã vé: <strong className="font-mono">{booking.bookingCode}</strong>
      </p>
    </div>
  );
}