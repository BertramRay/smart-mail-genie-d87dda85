/**
 * 异步处理中间件 - 用于包装异步路由处理器，自动捕获错误并传递给错误处理中间件
 * 
 * @param {Function} fn - 要包装的异步路由处理函数
 * @returns {Function} 返回一个包装好的中间件函数
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler; 