const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Hàm tạo JWT token từ user id
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// @desc   Đăng ký tài khoản mới
// @route  POST /api/auth/register
// @access Public (không cần đăng nhập)
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    // Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email đã được sử dụng' });
    }

    // Tạo user mới (password sẽ tự mã hóa nhờ middleware trong model)
    const user = await User.create({ name, email, password, phone });

    // Trả về thông tin user + token
    res.status(201).json({
      message: 'Đăng ký thành công',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Đăng nhập
// @route  POST /api/auth/login
// @access Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập email và mật khẩu' });
    }

    // Tìm user theo email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // So sánh password (dùng method từ User model)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Email hoặc mật khẩu không đúng' });
    }

    // Đăng nhập thành công → trả về token
    res.json({
      message: 'Đăng nhập thành công',
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Lỗi server: ' + error.message });
  }
};

// @desc   Lấy thông tin người dùng hiện tại
// @route  GET /api/auth/me
// @access Private (cần đăng nhập)
const getMe = async (req, res) => {
  // req.user đã được gán trong authMiddleware
  res.json({ user: req.user });
};

module.exports = { register, login, getMe };