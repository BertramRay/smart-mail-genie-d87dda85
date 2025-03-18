const Mailbox = require('../models/mailbox.model');
const ImapService = require('../services/email/imap.service');
const SmtpService = require('../services/email/smtp.service');
const syncService = require('../services/email/sync.service');
const schedulerService = require('../services/email/scheduler.service');

// 获取用户的所有邮箱
exports.getMailboxes = async (req, res) => {
  try {
    const mailboxes = await Mailbox.find({ user: req.user._id });
    
    // 获取每个邮箱的同步状态
    const mailboxesWithStatus = await Promise.all(
      mailboxes.map(async (mailbox) => {
        try {
          const status = await syncService.getMailboxSyncStatus(mailbox._id);
          return {
            id: mailbox._id,
            name: mailbox.name,
            email: mailbox.email,
            provider: mailbox.provider,
            syncStatus: status,
            createdAt: mailbox.createdAt,
            updatedAt: mailbox.updatedAt,
          };
        } catch (error) {
          return {
            id: mailbox._id,
            name: mailbox.name,
            email: mailbox.email,
            provider: mailbox.provider,
            syncStatus: {
              error: error.message,
            },
            createdAt: mailbox.createdAt,
            updatedAt: mailbox.updatedAt,
          };
        }
      })
    );
    
    res.json({
      success: true,
      mailboxes: mailboxesWithStatus,
    });
  } catch (error) {
    console.error('Get mailboxes error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮箱列表失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 添加新邮箱
exports.addMailbox = async (req, res) => {
  try {
    const {
      name,
      email,
      provider,
      imapHost,
      imapPort,
      imapSecure,
      smtpHost,
      smtpPort,
      smtpSecure,
      username,
      password,
    } = req.body;
    
    // 创建邮箱配置
    const mailboxConfig = {
      user: req.user._id,
      name,
      email,
      provider,
      imap: {
        host: imapHost,
        port: parseInt(imapPort) || 993,
        secure: imapSecure !== false,
        user: username || email,
        password,
        tls: true,
      },
      smtp: {
        host: smtpHost,
        port: parseInt(smtpPort) || 587,
        secure: smtpSecure === true,
        user: username || email,
        password,
        tls: true,
      },
    };
    
    // 自动填充常见邮件服务商的配置
    if (provider && !imapHost) {
      switch (provider) {
        case 'gmail':
          mailboxConfig.imap.host = 'imap.gmail.com';
          mailboxConfig.imap.port = 993;
          mailboxConfig.imap.secure = true;
          mailboxConfig.smtp.host = 'smtp.gmail.com';
          mailboxConfig.smtp.port = 587;
          mailboxConfig.smtp.secure = false;
          break;
        case 'outlook':
          mailboxConfig.imap.host = 'outlook.office365.com';
          mailboxConfig.imap.port = 993;
          mailboxConfig.imap.secure = true;
          mailboxConfig.smtp.host = 'smtp.office365.com';
          mailboxConfig.smtp.port = 587;
          mailboxConfig.smtp.secure = false;
          break;
        case 'yahoo':
          mailboxConfig.imap.host = 'imap.mail.yahoo.com';
          mailboxConfig.imap.port = 993;
          mailboxConfig.imap.secure = true;
          mailboxConfig.smtp.host = 'smtp.mail.yahoo.com';
          mailboxConfig.smtp.port = 587;
          mailboxConfig.smtp.secure = false;
          break;
        default:
          // 如果没有提供服务器信息，但指定了非标准提供商
          return res.status(400).json({
            success: false,
            message: '请提供 IMAP 和 SMTP 服务器信息',
          });
      }
    }
    
    // 检查邮箱是否已存在
    const existingMailbox = await Mailbox.findOne({
      user: req.user._id,
      email,
    });
    
    if (existingMailbox) {
      return res.status(400).json({
        success: false,
        message: '该邮箱已添加',
      });
    }
    
    // 验证 IMAP 连接
    try {
      const imapService = new ImapService(mailboxConfig);
      await imapService.connect();
      await imapService.disconnect();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `IMAP 连接失败: ${error.message}`,
      });
    }
    
    // 验证 SMTP 连接
    try {
      const smtpService = new SmtpService(mailboxConfig);
      await smtpService.verifyConnection();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: `SMTP 连接失败: ${error.message}`,
      });
    }
    
    // 创建新邮箱
    const mailbox = new Mailbox(mailboxConfig);
    await mailbox.save();
    
    // 更新用户的调度器
    await schedulerService.updateUserScheduler(req.user._id);
    
    res.status(201).json({
      success: true,
      mailbox: {
        id: mailbox._id,
        name: mailbox.name,
        email: mailbox.email,
        provider: mailbox.provider,
      },
      message: '邮箱添加成功',
    });
  } catch (error) {
    console.error('Add mailbox error:', error);
    res.status(500).json({
      success: false,
      message: '添加邮箱失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 删除邮箱
exports.deleteMailbox = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查邮箱是否存在且属于当前用户
    const mailbox = await Mailbox.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!mailbox) {
      return res.status(404).json({
        success: false,
        message: '邮箱不存在或无权访问',
      });
    }
    
    // 删除邮箱
    await mailbox.remove();
    
    // 更新用户的调度器
    await schedulerService.updateUserScheduler(req.user._id);
    
    res.json({
      success: true,
      message: '邮箱已删除',
    });
  } catch (error) {
    console.error('Delete mailbox error:', error);
    res.status(500).json({
      success: false,
      message: '删除邮箱失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 同步邮箱
exports.syncMailbox = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查邮箱是否存在且属于当前用户
    const mailbox = await Mailbox.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!mailbox) {
      return res.status(404).json({
        success: false,
        message: '邮箱不存在或无权访问',
      });
    }
    
    // 获取同步选项
    const limit = req.query.limit ? parseInt(req.query.limit) : 50;
    const analyzeEmails = req.query.analyze !== 'false';
    
    // 启动同步过程
    const result = await syncService.syncMailbox(id, {
      limit,
      analyzeEmails,
      processNewEmails: true,
    });
    
    res.json({
      success: result.success,
      message: result.message,
      count: result.count,
    });
  } catch (error) {
    console.error('Sync mailbox error:', error);
    res.status(500).json({
      success: false,
      message: '同步邮箱失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 获取邮箱同步状态
exports.getMailboxStatus = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 检查邮箱是否存在且属于当前用户
    const mailbox = await Mailbox.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!mailbox) {
      return res.status(404).json({
        success: false,
        message: '邮箱不存在或无权访问',
      });
    }
    
    // 获取同步状态
    const status = await syncService.getMailboxSyncStatus(id);
    
    res.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Get mailbox status error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮箱状态失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}; 