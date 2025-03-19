const passport = require('passport');
const User = require('../models/user.model');
const { generateToken } = require('../utils/jwt.utils');

// GitHub OAuth 登录回调
exports.githubCallback = (req, res, next) => {
  // 打印请求参数
  console.log('GitHub回调请求参数:', {
    code: req.query.code,
    state: req.query.state,
    error: req.query.error,
    url: req.url
  });
  
  passport.authenticate('github', { session: false }, (err, user, info) => {
    console.log('GitHub回调处理:', { 
      userId: user?._id, 
      hasError: !!err, 
      errorMessage: err?.message,
      info,
      authInfo: info
    });
    
    if (err) {
      console.error('GitHub授权错误详情:', {
        message: err.message,
        stack: err.stack,
        code: err.code
      });
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=github_auth_failed&message=${encodeURIComponent(err.message || '授权失败')}`);
    }
    
    if (!user) {
      console.error('GitHub授权失败，未返回用户', { info });
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=no_user_returned`);
    }
    
    try {
      // 生成 JWT 令牌
      const token = generateToken(user._id);
      console.log('生成的JWT令牌:', { token: token.substring(0, 10) + '...', userId: user._id });
      
      // 重定向到前端，带上令牌
      return res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
    } catch (tokenError) {
      console.error('生成JWT令牌错误:', tokenError);
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=token_generation_failed`);
    }
  })(req, res, next);
};

// 用户注册
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // 检查邮箱是否已经存在
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已被注册',
      });
    }
    
    // 创建新用户
    const user = new User({
      name,
      email,
      password,
    });
    
    await user.save();
    
    // 生成 JWT 令牌
    const token = generateToken(user._id);
    
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 用户登录
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 查找用户
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      });
    }
    
    // 验证密码
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      });
    }
    
    // 更新最后登录时间
    user.lastLogin = Date.now();
    await user.save();
    
    // 生成 JWT 令牌
    const token = generateToken(user._id);
    
    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 获取当前用户信息
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        settings: user.settings,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}; 