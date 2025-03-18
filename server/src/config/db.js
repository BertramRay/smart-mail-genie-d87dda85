const mongoose = require('mongoose');
require('dotenv').config();

/**
 * 连接到MongoDB数据库
 * @returns {Promise} MongoDB连接的Promise
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // MongoDB连接选项
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB已连接: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB连接错误: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB; 