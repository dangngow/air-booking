const mongoose = require('mongoose');

// Hàm kết nối tới MongoDB
const connectDB = async () => {
  try {
    // Dùng URI từ file .env
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB đã kết nối: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Lỗi kết nối MongoDB: ${error.message}`);
    // Thoát chương trình nếu không kết nối được DB
    process.exit(1);
  }
};

module.exports = connectDB;