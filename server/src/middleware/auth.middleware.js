const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/user.model');

/**
 * 保护路由中间件 - 验证用户是否已登录
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;
  
  // 从请求头部获取token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 获取token
      token = req.headers.authorization.split(' ')[1];
      
      // 验证token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // 获取用户信息，不包含密码
      req.user = await User.findById(decoded.id).select('-password');
      
      // 如果用户不存在，抛出错误
      if (!req.user) {
        res.status(401);
        throw new Error('未授权，用户不存在');
      }
      
      next();
    } catch (error) {
      res.status(401);
      throw new Error('未授权，token无效');
    }
  }
  
  // 如果没有token
  if (!token) {
    res.status(401);
    throw new Error('未授权，没有token');
  }
});

/**
 * 管理员权限中间件 - 验证用户是否为管理员
 */
const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403);
    throw new Error('未授权，需要管理员权限');
  }
});

module.exports = { protect, admin }; 