const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

// GitHub OAuth 状态检查端点
router.get('/github/status', (req, res) => {
  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET, GITHUB_CALLBACK_URL } = process.env;
  
  // 检查GitHub配置是否完整
  const missingConfigs = [];
  if (!GITHUB_CLIENT_ID) missingConfigs.push('客户端ID');
  if (!GITHUB_CLIENT_SECRET) missingConfigs.push('客户端密钥');
  if (!GITHUB_CALLBACK_URL) missingConfigs.push('回调URL');
  
  if (missingConfigs.length > 0) {
    return res.status(500).json({ 
      success: false,
      message: `GitHub OAuth 未正确配置，缺少：${missingConfigs.join(', ')}`,
      configured: false,
      callback_url: GITHUB_CALLBACK_URL || '未设置'
    });
  }
  
  // 尝试检查GitHub API是否通话可用，仅在开发环境中获取应用信息
  // 注意：生产环境中不应该暴露这些信息
  const isDev = process.env.NODE_ENV === 'development';
  
  res.status(200).json({ 
    success: true,
    message: 'GitHub OAuth 配置正常',
    configured: true,
    callback_url: isDev ? GITHUB_CALLBACK_URL : undefined,
    client_id_set: !!GITHUB_CLIENT_ID,
    client_secret_set: !!GITHUB_CLIENT_SECRET
  });
});

// GitHub OAuth 登录路由
router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

// GitHub OAuth 回调路由
router.get(
  '/github/callback',
  (req, res, next) => {
    console.log('收到GitHub回调请求:', {
      path: req.path,
      originalUrl: req.originalUrl,
      baseUrl: req.baseUrl,
      fullUrl: req.protocol + '://' + req.get('host') + req.originalUrl,
      callbackUrl: process.env.GITHUB_CALLBACK_URL // 输出配置的回调URL以便比较
    });
    next();
  },
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