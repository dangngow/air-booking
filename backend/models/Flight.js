const mongoose = require('mongoose');

// Định nghĩa cấu trúc dữ liệu chuyến bay
const flightSchema = new mongoose.Schema(
  {
    flightNumber: {
      type: String,
      required: [true, 'Vui lòng nhập số hiệu chuyến bay'],
      unique: true,
      uppercase: true, // Tự chuyển thành chữ hoa (VD: vn123 → VN123)
      trim: true,
    },
    airline: {
      type: String,
      required: [true, 'Vui lòng nhập tên hãng hàng không'],
      trim: true,
    },
    from: {
      city: { type: String, required: true },
      airport: { type: String, required: true },
      code: { type: String, required: true, uppercase: true }, // VD: HAN, SGN
    },
    to: {
      city: { type: String, required: true },
      airport: { type: String, required: true },
      code: { type: String, required: true, uppercase: true },
    },
    departureTime: {
      type: Date,
      required: [true, 'Vui lòng nhập giờ khởi hành'],
    },
    arrivalTime: {
      type: Date,
      required: [true, 'Vui lòng nhập giờ đến'],
    },
    price: {
      economy: { type: Number, required: true, min: 0 },    // Ghế phổ thông
      business: { type: Number, required: true, min: 0 },   // Ghế thương gia
    },
    seats: {
      economy: { type: Number, required: true, min: 0 },    // Số ghế phổ thông còn lại
      business: { type: Number, required: true, min: 0 },   // Số ghế thương gia còn lại
    },
    status: {
      type: String,
      enum: ['scheduled', 'delayed', 'cancelled', 'completed'],
      default: 'scheduled',
    },
    image: {
      type: String,
      default: '', // URL ảnh đại diện chuyến bay
    },
  },
  {
    timestamps: true,
  }
);

const Flight = mongoose.model('Flight', flightSchema);
module.exports = Flight;