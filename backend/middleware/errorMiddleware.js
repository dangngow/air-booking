// Middleware xử lý lỗi 404 - Route không tồn tại
const notFound = (req, res, next) => {
  const error = new Error(`Không tìm thấy: ${req.originalUrl}`);
  res.status(404);
  next(error); // Chuyển lỗi sang errorHandler
};

// Middleware xử lý lỗi chung - đặt cuối cùng trong server.js
const errorHandler = (err, req, res, next) => {
  // Nếu status vẫn là 200 thì đổi thành 500
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

  res.status(statusCode).json({
    message: err.message,
    // Chỉ hiển thị stack trace khi đang phát triển (development)
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };