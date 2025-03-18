const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
require('dotenv').config();

// 创建HTTP服务器
const server = http.createServer(app);

// 初始化Socket.io
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Socket.io连接
io.on('connection', (socket) => {
  console.log('新客户端已连接:', socket.id);
  
  // 加入用户特定房间以接收通知
  socket.on('join', (userId) => {
    if (userId) {
      socket.join(`user-${userId}`);
      console.log(`用户 ${userId} 已加入私人房间`);
    }
  });
  
  // 断开连接
  socket.on('disconnect', () => {
    console.log('客户端已断开连接');
  });
});

// 配置全局变量
global.io = io;

// 服务器端口
const PORT = process.env.PORT || 5000;

// 启动服务器
server.listen(PORT, () => {
  console.log(`服务器在端口 ${PORT} 上运行中`);
});

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  process.exit(1);
});

// 处理未处理的 Promise rejection
process.on('unhandledRejection', (err) => {
  console.error('未处理的 Promise 拒绝:', err);
  process.exit(1);
}); 