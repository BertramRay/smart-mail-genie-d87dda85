const mongoose = require('mongoose');

const MailboxSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  provider: {
    type: String,
    enum: ['gmail', 'outlook', 'yahoo', 'other'],
    default: 'other',
  },
  // IMAP 设置 - 用于读取邮件
  imap: {
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
      default: 993,
    },
    secure: {
      type: Boolean,
      default: true,
    },
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tls: {
      type: Boolean,
      default: true,
    },
  },
  // SMTP 设置 - 用于发送邮件
  smtp: {
    host: {
      type: String,
      required: true,
    },
    port: {
      type: Number,
      required: true,
      default: 587,
    },
    secure: {
      type: Boolean,
      default: false,
    },
    user: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tls: {
      type: Boolean,
      default: true,
    },
  },
  // 同步相关信息
  syncStatus: {
    lastSync: {
      type: Date,
      default: null,
    },
    lastSyncStatus: {
      type: String,
      enum: ['success', 'failed', 'pending', null],
      default: null,
    },
    lastSyncError: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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
MailboxSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Mailbox', MailboxSchema); 