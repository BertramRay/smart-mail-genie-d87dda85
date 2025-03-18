const express = require('express');
const router = express.Router();
const mailboxController = require('../controllers/mailbox.controller');
const { protect } = require('../middleware/auth.middleware');

// 所有邮箱路由都需要身份验证
router.use(protect);

// 获取用户的所有邮箱
router.get('/', mailboxController.getMailboxes);

// 添加新邮箱
router.post('/', mailboxController.addMailbox);

// 删除邮箱
router.delete('/:id', mailboxController.deleteMailbox);

// 同步邮箱
router.post('/:id/sync', mailboxController.syncMailbox);

// 获取邮箱同步状态
router.get('/:id/status', mailboxController.getMailboxStatus);

module.exports = router; 