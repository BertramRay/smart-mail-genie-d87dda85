const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/rule.controller');
const { protect } = require('../middleware/auth.middleware');

// 所有规则路由都需要身份验证
router.use(protect);

// 获取用户的处理规则
router.get('/', ruleController.getUserRules);

// 保存处理规则
router.post('/', ruleController.saveRules);

// 删除处理规则
router.delete('/', ruleController.deleteRules);

// 解析处理规则
router.post('/parse', ruleController.parseRules);

module.exports = router; 