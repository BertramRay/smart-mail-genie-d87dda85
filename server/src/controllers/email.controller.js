const Email = require('../models/email.model');
const Mailbox = require('../models/mailbox.model');
const SmtpService = require('../services/email/smtp.service');
const OpenAIService = require('../services/ai/openai.service');

// 获取用户的邮件
exports.getEmails = async (req, res) => {
  try {
    const { category = 'inbox', page = 1, limit = 20, search, mailboxId } = req.query;
    
    // 构建查询条件
    const query = {
      user: req.user._id,
    };
    
    // 根据类别过滤
    switch (category) {
      case 'starred':
        query.isStarred = true;
        break;
      case 'sent':
        // 查找用户发送的邮件
        query['from.email'] = { $in: [] };
        
        // 获取用户的所有邮箱
        const userMailboxes = await Mailbox.find({ user: req.user._id });
        userMailboxes.forEach(mailbox => {
          query['from.email'].$in.push(mailbox.email);
        });
        break;
      case 'archived':
        query.isArchived = true;
        break;
      case 'trash':
        query.isDeleted = true;
        break;
      case 'inbox':
      default:
        query.isArchived = false;
        query.isDeleted = false;
        break;
    }
    
    // 如果指定了邮箱 ID，则只查询该邮箱的邮件
    if (mailboxId) {
      query.mailbox = mailboxId;
    }
    
    // 搜索功能
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { text: { $regex: search, $options: 'i' } },
        { 'from.name': { $regex: search, $options: 'i' } },
        { 'from.email': { $regex: search, $options: 'i' } },
      ];
    }
    
    // 分页
    const skip = (page - 1) * limit;
    
    // 获取邮件总数
    const total = await Email.countDocuments(query);
    
    // 获取邮件
    const emails = await Email.find(query)
      .sort({ date: -1 }) // 按日期降序排序
      .skip(skip)
      .limit(parseInt(limit))
      .populate('mailbox', 'name email provider');
    
    // 格式化返回的数据
    const formattedEmails = emails.map(email => ({
      id: email._id,
      messageId: email.messageId,
      subject: email.subject,
      sender: email.from,
      preview: email.text.substring(0, 150) + (email.text.length > 150 ? '...' : ''),
      timestamp: email.date,
      isRead: email.isRead,
      isStarred: email.isStarred,
      isReplied: email.isReplied,
      labels: email.labels,
      attachments: email.attachments.map(att => ({
        filename: att.filename,
        contentType: att.contentType,
        size: att.size,
      })),
      mailbox: {
        id: email.mailbox._id,
        name: email.mailbox.name,
        email: email.mailbox.email,
        provider: email.mailbox.provider,
      },
      analysis: email.analysis ? {
        summary: email.analysis.summary,
        importance: email.analysis.importance,
        sentiment: email.analysis.sentiment,
        keywords: email.analysis.keywords,
        category: email.analysis.category,
        requiredResponse: email.analysis.requiredResponse,
      } : null,
    }));
    
    res.json({
      success: true,
      emails: formattedEmails,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Get emails error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮件失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 获取单个邮件详情
exports.getEmail = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找邮件并确保属于当前用户
    const email = await Email.findOne({
      _id: id,
      user: req.user._id,
    }).populate('mailbox', 'name email provider');
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: '邮件不存在或无权访问',
      });
    }
    
    // 如果邮件未读，则标记为已读
    if (!email.isRead) {
      email.isRead = true;
      await email.save();
    }
    
    res.json({
      success: true,
      email: {
        id: email._id,
        messageId: email.messageId,
        subject: email.subject,
        from: email.from,
        to: email.to,
        cc: email.cc,
        bcc: email.bcc,
        date: email.date,
        text: email.text,
        html: email.html,
        isRead: email.isRead,
        isStarred: email.isStarred,
        isReplied: email.isReplied,
        labels: email.labels,
        attachments: email.attachments.map(att => ({
          filename: att.filename,
          contentType: att.contentType,
          size: att.size,
          id: att._id,
        })),
        mailbox: {
          id: email.mailbox._id,
          name: email.mailbox.name,
          email: email.mailbox.email,
          provider: email.mailbox.provider,
        },
        analysis: email.analysis || null,
        autoReply: email.autoReply || null,
      },
    });
  } catch (error) {
    console.error('Get email error:', error);
    res.status(500).json({
      success: false,
      message: '获取邮件详情失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 标记邮件为已读/未读
exports.markEmailReadStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isRead } = req.body;
    
    // 查找邮件并确保属于当前用户
    const email = await Email.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: '邮件不存在或无权访问',
      });
    }
    
    // 更新已读状态
    email.isRead = !!isRead;
    await email.save();
    
    res.json({
      success: true,
      message: `邮件已标记为${isRead ? '已读' : '未读'}`,
    });
  } catch (error) {
    console.error('Mark email read status error:', error);
    res.status(500).json({
      success: false,
      message: '标记邮件状态失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 标记邮件为星标/取消星标
exports.toggleStarEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { isStarred } = req.body;
    
    // 查找邮件并确保属于当前用户
    const email = await Email.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: '邮件不存在或无权访问',
      });
    }
    
    // 更新星标状态
    email.isStarred = !!isStarred;
    await email.save();
    
    res.json({
      success: true,
      message: `邮件已${isStarred ? '标记星标' : '取消星标'}`,
    });
  } catch (error) {
    console.error('Toggle star email error:', error);
    res.status(500).json({
      success: false,
      message: '更新邮件星标状态失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 回复邮件
exports.replyToEmail = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    
    // 查找邮件并确保属于当前用户
    const email = await Email.findOne({
      _id: id,
      user: req.user._id,
    }).populate('mailbox');
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: '邮件不存在或无权访问',
      });
    }
    
    // 使用 SMTP 服务发送回复
    const smtpService = new SmtpService(email.mailbox);
    const result = await smtpService.replyToEmail(
      id,
      content,
      req.user._id,
      email.mailbox._id
    );
    
    res.json({
      success: true,
      message: '邮件回复已发送',
      sentEmail: {
        id: result.sentEmail._id,
        subject: result.sentEmail.subject,
      },
    });
  } catch (error) {
    console.error('Reply to email error:', error);
    res.status(500).json({
      success: false,
      message: '回复邮件失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 使用 AI 分析邮件
exports.analyzeEmail = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找邮件并确保属于当前用户
    const email = await Email.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: '邮件不存在或无权访问',
      });
    }
    
    // 使用 OpenAI 服务分析邮件
    const openAIService = new OpenAIService();
    const analysis = await openAIService.analyzeEmail(email, req.user._id);
    
    // 更新邮件分析结果
    email.analysis = {
      summary: analysis.summary,
      importance: analysis.importance,
      sentiment: analysis.sentiment,
      keywords: analysis.keywords,
      topics: analysis.topics,
      actionItems: analysis.actionItems,
      category: analysis.category,
      entities: analysis.entities || [],
      requiredResponse: analysis.requiredResponse,
      suggestedResponseText: analysis.suggestedResponseText,
      analyzedAt: new Date(),
    };
    
    // 更新标签
    if (analysis.labels && Array.isArray(analysis.labels)) {
      email.labels = [...new Set([...email.labels, ...analysis.labels])];
    }
    
    // 标星邮件
    if (analysis.shouldStar) {
      email.isStarred = true;
    }
    
    await email.save();
    
    res.json({
      success: true,
      message: '邮件分析完成',
      analysis: email.analysis,
    });
  } catch (error) {
    console.error('Analyze email error:', error);
    res.status(500).json({
      success: false,
      message: '分析邮件失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 生成邮件回复建议
exports.generateReply = async (req, res) => {
  try {
    const { id } = req.params;
    
    // 查找邮件并确保属于当前用户
    const email = await Email.findOne({
      _id: id,
      user: req.user._id,
    });
    
    if (!email) {
      return res.status(404).json({
        success: false,
        message: '邮件不存在或无权访问',
      });
    }
    
    // 获取邮件链的上下文
    let context = '';
    if (email.inReplyTo) {
      const previousEmails = await Email.find({
        user: req.user._id,
        $or: [
          { messageId: email.inReplyTo },
          { references: email.messageId },
        ],
      }).sort({ date: -1 }).limit(3);
      
      if (previousEmails.length > 0) {
        context = '先前的邮件历史:\n\n' + previousEmails.map(prevEmail => 
          `发件人: ${prevEmail.from.name} <${prevEmail.from.email}>\n` +
          `日期: ${new Date(prevEmail.date).toLocaleString()}\n` +
          `内容: ${prevEmail.text.substring(0, 300)}${prevEmail.text.length > 300 ? '...' : ''}\n`
        ).join('\n---\n\n');
      }
    }
    
    // 使用 OpenAI 服务生成回复
    const openAIService = new OpenAIService();
    const replyText = await openAIService.generateReply(email, context);
    
    res.json({
      success: true,
      replyText,
    });
  } catch (error) {
    console.error('Generate reply error:', error);
    res.status(500).json({
      success: false,
      message: '生成回复失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};