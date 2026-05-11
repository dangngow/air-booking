const Booking = require('../models/Booking');
const Flight = require('../models/Flight');

// @desc   Đặt vé máy bay
// @route  POST /api/bookings
// @access Private (phải đăng nhập)
const createBooking = async (req, res) => {
  try {
    const { flightId, passengers, seatClass } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!flightId || !passengers || passengers.length === 0) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin đặt vé' });
    }

    // Tìm chuyến bay
    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
    }

    // Kiểm tra còn ghế không
    const cls = seatClass || 'economy';
    if (flight.seats[cls] < passengers.length) {
      return res.status(400).json({
        message: `Không đủ ghế ${cls}. Còn lại: ${flight.seats[cls]} ghế`,
      });
    }

    // Tính tổng tiền
    const totalPrice = flight.price[cls] * passengers.length;

    // Tạo booking
    const booking = await Booking.create({
      user: req.user._id,
      flight: flightId,
      passengers,
      seatClass: cls,
      totalPrice,
    });

    // Trừ số ghế còn lại
    flight.seats[cls] -= passengers.length;
    await flight.save();

    // Populate để trả về thông tin đầy đủ
    await booking.populate('flight');
    await booking.populate('user', 'name email');

    res.status(201).json({
      message: 'Đặt vé thành công!',
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Lấy danh sách vé đã đặt (của user hiện tại)
// @route  GET /api/bookings
// @access Private
const getMyBookings = async (req, res) => {
  try {
    // Nếu là admin → xem tất cả, nếu là user → chỉ xem của mình
    const filter = req.user.role === 'admin' ? {} : { user: req.user._id };

    const bookings = await Booking.find(filter)
      .populate('flight')           // Lấy thông tin chuyến bay
      .populate('user', 'name email') // Lấy tên và email user
      .sort({ createdAt: -1 });     // Mới nhất lên đầu

    res.json({ count: bookings.length, bookings });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Hủy vé
// @route  PUT /api/bookings/:id/cancel
// @access Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Không tìm thấy đặt vé' });
    }

    // Chỉ cho phép chủ sở hữu hoặc admin hủy
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Bạn không có quyền hủy vé này' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Vé đã được hủy trước đó' });
    }

    // Cập nhật trạng thái hủy
    booking.status = 'cancelled';
    await booking.save();

    // Hoàn lại số ghế cho chuyến bay
    const flight = await Flight.findById(booking.flight);
    if (flight) {
      flight.seats[booking.seatClass] += booking.passengers.length;
      await flight.save();
    }

    res.json({ message: 'Hủy vé thành công', booking });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking };