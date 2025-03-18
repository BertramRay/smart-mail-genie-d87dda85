/**
 * 错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  // 默认错误状态码
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  
  console.error('错误详情:', err);
  
  // 响应错误信息
  res.status(statusCode).json({
    message: err.message || '服务器内部错误',
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = errorHandler;