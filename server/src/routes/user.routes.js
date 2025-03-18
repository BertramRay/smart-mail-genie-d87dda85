const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { protect } = require('../middleware/auth.middleware');

// 用户路由需要身份验证
router.use(protect);

// 获取用户个人资料
router.get('/profile', userController.getUserProfile);

// 更新用户个人资料
router.put('/profile', userController.updateUserProfile);

// 更新用户密码
router.put('/password', userController.updatePassword);

// 更新用户设置
router.put('/settings', userController.updateSettings);

module.exports = router;