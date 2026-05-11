const express = require('express');
const router = express.Router();
const { createBooking, getMyBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Tất cả booking routes đều yêu cầu đăng nhập
// POST /api/bookings      → Đặt vé
// GET  /api/bookings      → Xem vé đã đặt
router.route('/')
  .post(protect, createBooking)
  .get(protect, getMyBookings);

// PUT /api/bookings/:id/cancel → Hủy vé
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;