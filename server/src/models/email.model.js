const mongoose = require('mongoose');

const EmailSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mailbox: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mailbox',
    required: true,
  },
  // 邮件元数据
  messageId: {
    type: String,
    required: true,
    unique: true,
  },
  subject: {
    type: String,
    default: '(无主题)',
  },
  from: {
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  },
  to: [{
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  }],
  cc: [{
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  }],
  bcc: [{
    name: String,
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
  }],
  inReplyTo: {
    type: String,
    default: null,
  },
  references: [{
    type: String,
  }],
  // 邮件内容
  text: {
    type: String,
  },
  html: {
    type: String,
  },
  // 附件信息
  attachments: [{
    filename: String,
    contentType: String,
    size: Number,
    content: Buffer, // 存储小型附件内容
    path: String,    // 存储大型附件的路径或 ID
  }],
  // 邮件日期
  date: {
    type: Date,
    required: true,
  },
  receivedDate: {
    type: Date,
    default: Date.now,
  },
  // 邮件状态
  isRead: {
    type: Boolean,
    default: false,
  },
  isStarred: {
    type: Boolean,
    default: false,
  },
  isReplied: {
    type: Boolean,
    default: false,
  },
  isForwarded: {
    type: Boolean,
    default: false,
  },
  isDeleted: {
    type: Boolean,
    default: false,
  },
  isArchived: {
    type: Boolean,
    default: false,
  },
  // 标签
  labels: [{
    type: String,
  }],
  // AI 分析结果
  analysis: {
    summary: {
      type: String,
    },
    importance: {
      type: Number,
      min: 0,
      max: 10,
    },
    sentiment: {
      type: String,
      enum: ['positive', 'negative', 'neutral', null],
      default: null,
    },
    keywords: [{
      type: String,
    }],
    topics: [{
      type: String,
    }],
    actionItems: [{
      type: String,
    }],
    category: {
      type: String,
    },
    entities: [{
      name: String,
      type: String,
      value: String,
    }],
    requiredResponse: {
      type: Boolean,
      default: false,
    },
    suggestedResponseText: String,
    analyzedAt: {
      type: Date,
      default: null,
    },
  },
  // 自动回复信息
  autoReply: {
    hasAutoReplied: {
      type: Boolean,
      default: false,
    },
    autoReplyText: String,
    autoRepliedAt: Date,
    autoReplyId: String, // 对应自动回复邮件的 ID
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

// 索引
EmailSchema.index({ user: 1, mailbox: 1 });
EmailSchema.index({ messageId: 1 });
EmailSchema.index({ date: -1 });
EmailSchema.index({ 'from.email': 1 });
EmailSchema.index({ subject: 'text', text: 'text' });

// 更新 updatedAt 的预保存中间件
EmailSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Email', EmailSchema); 