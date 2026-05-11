const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/auth/register → Đăng ký
router.post('/register', register);

// POST /api/auth/login → Đăng nhập
router.post('/login', login);

// GET /api/auth/me → Lấy thông tin user đang đăng nhập (cần token)
router.get('/me', protect, getMe);

module.exports = router;