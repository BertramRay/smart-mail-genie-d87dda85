const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// GitHub OAuth 登录路由
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth 回调路由
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/login' }),
  authController.githubCallback
);

// 用户注册
router.post('/register', authController.register);

// 用户登录
router.post('/login', authController.login);

// 获取当前用户信息
router.get('/me', protect, authController.getMe);

module.exports = router; 