const mongoose = require('mongoose');

const RuleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastProcessed: {
    type: Date,
    default: null,
  },
  version: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 更新 updatedAt 的预保存中间件
RuleSchema.pre('save', function (next) {
  // 如果内容发生变化，增加版本号
  if (this.isModified('content')) {
    this.version += 1;
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Rule', RuleSchema); 