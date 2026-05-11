const express = require('express');
const router = express.Router();
const {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
} = require('../controllers/flightController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// GET  /api/flights        → Lấy danh sách (public)
// POST /api/flights        → Thêm mới (admin only)
router.route('/')
  .get(getFlights)
  .post(protect, adminOnly, createFlight);

// GET    /api/flights/:id  → Chi tiết (public)
// PUT    /api/flights/:id  → Cập nhật (admin only)
// DELETE /api/flights/:id  → Xóa (admin only)
router.route('/:id')
  .get(getFlightById)
  .put(protect, adminOnly, updateFlight)
  .delete(protect, adminOnly, deleteFlight);

module.exports = router;