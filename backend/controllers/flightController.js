const Flight = require('../models/Flight');

// @desc   Lấy danh sách chuyến bay (có tìm kiếm + lọc)
// @route  GET /api/flights
// @access Public
const getFlights = async (req, res) => {
  try {
    const { from, to, date, minPrice, maxPrice } = req.query;

    // Xây dựng điều kiện tìm kiếm
    let filter = {};

    // Tìm kiếm không phân biệt hoa thường, trim khoảng trắng
    if (from && from.trim()) {
      filter['from.code'] = from.trim().toUpperCase();
    }
    if (to && to.trim()) {
      filter['to.code'] = to.trim().toUpperCase();
    }

    // Lọc theo ngày bay
    if (date && date.trim()) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      filter.departureTime = { $gte: start, $lte: end };
    }

    // Lọc theo khoảng giá
    if (minPrice || maxPrice) {
      filter['price.economy'] = {};
      if (minPrice) filter['price.economy'].$gte = Number(minPrice);
      if (maxPrice) filter['price.economy'].$lte = Number(maxPrice);
    }

    const flights = await Flight.find(filter).sort({ departureTime: 1 });

    res.json({ count: flights.length, flights });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Lấy chi tiết 1 chuyến bay theo ID
// @route  GET /api/flights/:id
// @access Public
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
    }
    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Thêm chuyến bay mới
// @route  POST /api/flights
// @access Private - Admin only
const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json({ message: 'Thêm chuyến bay thành công', flight });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Số hiệu chuyến bay đã tồn tại' });
    }
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Cập nhật chuyến bay
// @route  PUT /api/flights/:id
// @access Private - Admin only
const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(
      req.params.id, req.body,
      { new: true, runValidators: true }
    );
    if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
    res.json({ message: 'Cập nhật thành công', flight });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Xóa chuyến bay
// @route  DELETE /api/flights/:id
// @access Private - Admin only
const deleteFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
    res.json({ message: 'Đã xóa chuyến bay thành công' });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

module.exports = { getFlights, getFlightById, createFlight, updateFlight, deleteFlight };