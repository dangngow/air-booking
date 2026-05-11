const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware bảo vệ route - yêu cầu đăng nhập
const protect = async (req, res, next) => {
  let token;

  // Lấy token từ header Authorization: Bearer <token>
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Tách lấy phần token (bỏ chữ "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // Giải mã token để lấy id người dùng
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Tìm user trong DB, bỏ trường password
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        return res.status(401).json({ message: 'Người dùng không tồn tại' });
      }

      next(); // Tiếp tục xử lý request
    } catch (error) {
      return res.status(401).json({ message: 'Token không hợp lệ hoặc đã hết hạn' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Chưa đăng nhập, vui lòng đăng nhập' });
  }
};

// Middleware kiểm tra quyền Admin
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Chỉ Admin mới có quyền thực hiện' });
  }
};

module.exports = { protect, adminOnly };