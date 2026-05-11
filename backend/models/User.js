const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Định nghĩa cấu trúc dữ liệu người dùng
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Vui lòng nhập tên'],
      trim: true, // Xóa khoảng trắng thừa
    },
    email: {
      type: String,
      required: [true, 'Vui lòng nhập email'],
      unique: true, // Không được trùng email
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Vui lòng nhập mật khẩu'],
      minlength: [6, 'Mật khẩu tối thiểu 6 ký tự'],
    },
    phone: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'], // Chỉ được là user hoặc admin
      default: 'user',
    },
  },
  {
    timestamps: true, // Tự thêm createdAt và updatedAt
  }
);

// Middleware: Tự động mã hóa password trước khi lưu vào DB
userSchema.pre('save', async function (next) {
  // Chỉ mã hóa nếu password bị thay đổi
  if (!this.isModified('password')) return next();

  // Mã hóa với độ phức tạp 12
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method: Kiểm tra password khi đăng nhập
userSchema.methods.comparePassword = async function (inputPassword) {
  return await bcrypt.compare(inputPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;