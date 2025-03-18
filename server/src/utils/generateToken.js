const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * 生成JWT令牌
 * @param {string} id - 用户ID
 * @param {object} options - 可选配置项
 * @returns {string} JWT令牌
 */
const generateToken = (id, options = {}) => {
  const { expiresIn = '30d' } = options;
  
  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

module.exports = generateToken; 