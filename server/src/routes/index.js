const express = require('express');
const authRoutes = require('./auth.routes');
const userRoutes = require('./user.routes');
const mailboxRoutes = require('./mailbox.routes');
const emailRoutes = require('./email.routes');
const ruleRoutes = require('./rule.routes');

const router = express.Router();

// 健康检查端点
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: '服务运行正常' });
});

// API 路由
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/mailboxes', mailboxRoutes);
router.use('/emails', emailRoutes);
router.use('/rules', ruleRoutes);

module.exports = router; 