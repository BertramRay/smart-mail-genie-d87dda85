const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // 对于 OAuth 用户密码是可选的
  },
  githubId: {
    type: String,
    unique: true,
    sparse: true, // 允许有多个空值
  },
  avatar: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  settings: {
    autoSync: {
      type: Boolean,
      default: true,
    },
    syncInterval: {
      type: Number,
      default: 15, // 以分钟为单位
    },
    autoReply: {
      type: Boolean,
      default: false,
    },
    processNewEmails: {
      type: Boolean,
      default: true,
    },
  },
});

// 密码加密中间件
UserSchema.pre('save', async function (next) {
  // 只有在密码被修改时才进行哈希处理
  if (!this.isModified('password') || !this.password) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// 验证密码
UserSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema); 