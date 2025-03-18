const express = require('express');
const router = express.Router();
const emailController = require('../controllers/email.controller');
const { protect } = require('../middleware/auth.middleware');

// 所有邮件路由都需要身份验证
router.use(protect);

// 获取邮件列表
router.get('/', emailController.getEmails);

// 获取单个邮件详情
router.get('/:id', emailController.getEmail);

// 标记邮件已读/未读状态
router.put('/:id/read', emailController.markEmailReadStatus);

// 标记邮件星标状态
router.put('/:id/star', emailController.toggleStarEmail);

// 回复邮件
router.post('/:id/reply', emailController.replyToEmail);

// 使用 AI 分析邮件
router.post('/:id/analyze', emailController.analyzeEmail);

// 生成邮件回复建议
router.get('/:id/suggest-reply', emailController.generateReply);

module.exports = router; 