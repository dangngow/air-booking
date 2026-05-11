const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load biến môi trường từ file .env
dotenv.config();

// Kết nối MongoDB
connectDB();

const app = express();

// ==================== MIDDLEWARE ====================

// Cho phép frontend (React) gọi API từ domain khác
app.use(cors());

// Parse JSON từ request body
app.use(express.json());

// Parse URL-encoded data (form submit)
app.use(express.urlencoded({ extended: true }));

// ==================== ROUTES ====================

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/flights', require('./routes/flightRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

// Route kiểm tra server còn sống không
app.get('/', (req, res) => {
  res.json({ message: '✈️ Airline Booking API đang chạy!' });
});

// ==================== ERROR HANDLING ====================

// Xử lý route không tồn tại (404)
app.use(notFound);

// Xử lý lỗi chung (500)
app.use(errorHandler);

// ==================== START SERVER ====================

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server đang chạy tại: http://localhost:${PORT}`);
});