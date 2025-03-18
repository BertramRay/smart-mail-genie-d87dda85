const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const passport = require('passport');
const path = require('path');
const routes = require('./routes');
const errorHandler = require('./middleware/error.middleware');
const connectDB = require('./config/db');
const configPassport = require('./config/passport');

// 连接数据库
connectDB();

const app = express();

// CORS配置
const corsOptions = {
  origin: ['http://localhost:8080', 'http://localhost:5173', process.env.FRONTEND_URL].filter(Boolean),
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  optionsSuccessStatus: 204,
};

// 中间件
app.use(helmet()); // 安全头
app.use(compression()); // 压缩响应
app.use(cors(corsOptions)); // 跨域
app.use(morgan('dev')); // 日志
app.use(express.json({ limit: '10mb' })); // 解析JSON请求体
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // 解析URL编码的请求体

// 初始化Passport
app.use(passport.initialize());
configPassport(passport);

// API路由
app.use('/api', routes);

// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// 在生产环境中提供静态文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/build/index.html'));
  });
}

// 错误处理中间件
app.use(errorHandler);

// 未找到的路由处理
app.use((req, res, next) => {
  res.status(404).json({ message: '找不到请求的资源' });
});

module.exports = app; 