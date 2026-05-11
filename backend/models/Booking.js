const mongoose = require('mongoose');

// Định nghĩa cấu trúc dữ liệu đặt vé
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới User
      ref: 'User',
      required: true,
    },
    flight: {
      type: mongoose.Schema.Types.ObjectId, // Tham chiếu tới Flight
      ref: 'Flight',
      required: true,
    },
    passengers: [
      {
        name: { type: String, required: true },
        age: { type: Number, required: true },
        passport: { type: String, required: true },
      },
    ],
    seatClass: {
      type: String,
      enum: ['economy', 'business'],
      default: 'economy',
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'confirmed',
    },
    bookingCode: {
      type: String,
      unique: true, // Mã đặt vé duy nhất
    },
  },
  {
    timestamps: true,
  }
);

// Middleware: Tự tạo mã đặt vé trước khi lưu
bookingSchema.pre('save', function (next) {
  if (!this.bookingCode) {
    // Tạo mã gồm 8 ký tự ngẫu nhiên viết hoa
    this.bookingCode = Math.random().toString(36).substring(2, 10).toUpperCase();
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;