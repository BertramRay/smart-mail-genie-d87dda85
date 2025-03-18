const nodemailer = require('nodemailer');
const Email = require('../../models/email.model');

class SmtpService {
  constructor(mailboxConfig) {
    // 创建 SMTP 传输器
    this.transporter = nodemailer.createTransport({
      host: mailboxConfig.smtp.host,
      port: mailboxConfig.smtp.port,
      secure: mailboxConfig.smtp.secure,
      auth: {
        user: mailboxConfig.smtp.user,
        pass: mailboxConfig.smtp.password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
    
    this.from = {
      name: mailboxConfig.name || '',
      address: mailboxConfig.email,
    };
  }

  // 验证 SMTP 连接
  async verifyConnection() {
    try {
      await this.transporter.verify();
      return true;
    } catch (error) {
      console.error('SMTP connection verification failed:', error);
      throw error;
    }
  }

  // 发送电子邮件
  async sendEmail(mailOptions) {
    try {
      const result = await this.transporter.sendMail({
        from: this.from,
        ...mailOptions,
      });
      return result;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // 回复邮件
  async replyToEmail(originalEmailId, content, userId, mailboxId) {
    try {
      // 获取原始邮件
      const originalEmail = await Email.findById(originalEmailId);
      
      if (!originalEmail) {
        throw new Error('原始邮件未找到');
      }
      
      // 构建回复邮件选项
      const mailOptions = {
        to: [originalEmail.from.email],
        subject: `Re: ${originalEmail.subject}`,
        text: content,
        html: content.replace(/\n/g, '<br>'),
        references: [...(originalEmail.references || []), originalEmail.messageId],
        inReplyTo: originalEmail.messageId,
      };
      
      // 发送邮件
      const result = await this.sendEmail(mailOptions);
      
      // 创建已发送邮件记录
      const sentEmail = new Email({
        user: userId,
        mailbox: mailboxId,
        messageId: result.messageId,
        subject: mailOptions.subject,
        from: {
          name: this.from.name,
          email: this.from.address,
        },
        to: [{ name: originalEmail.from.name, email: originalEmail.from.email }],
        text: content,
        html: content.replace(/\n/g, '<br>'),
        inReplyTo: originalEmail.messageId,
        references: mailOptions.references,
        date: new Date(),
        receivedDate: new Date(),
        isRead: true,
      });
      
      await sentEmail.save();
      
      // 更新原始邮件的回复状态
      originalEmail.isReplied = true;
      originalEmail.autoReply = {
        hasAutoReplied: true,
        autoReplyText: content,
        autoRepliedAt: new Date(),
        autoReplyId: sentEmail._id.toString(),
      };
      
      await originalEmail.save();
      
      return { sentEmail, info: result };
    } catch (error) {
      console.error('Error replying to email:', error);
      throw error;
    }
  }

  // 发送自动回复
  async sendAutoReply(email, replyText, userId, mailboxId) {
    try {
      // 检查是否已经自动回复过
      if (email.autoReply && email.autoReply.hasAutoReplied) {
        return { 
          success: false, 
          message: '已经自动回复过该邮件' 
        };
      }
      
      // 构建回复邮件选项
      const mailOptions = {
        to: [email.from.email],
        subject: `Re: ${email.subject}`,
        text: replyText,
        html: replyText.replace(/\n/g, '<br>'),
        references: [...(email.references || []), email.messageId],
        inReplyTo: email.messageId,
      };
      
      // 发送邮件
      const result = await this.sendEmail(mailOptions);
      
      // 创建已发送邮件记录
      const sentEmail = new Email({
        user: userId,
        mailbox: mailboxId,
        messageId: result.messageId,
        subject: mailOptions.subject,
        from: {
          name: this.from.name,
          email: this.from.address,
        },
        to: [{ name: email.from.name, email: email.from.email }],
        text: replyText,
        html: replyText.replace(/\n/g, '<br>'),
        inReplyTo: email.messageId,
        references: mailOptions.references,
        date: new Date(),
        receivedDate: new Date(),
        isRead: true,
      });
      
      await sentEmail.save();
      
      // 更新原始邮件的自动回复状态
      email.autoReply = {
        hasAutoReplied: true,
        autoReplyText: replyText,
        autoRepliedAt: new Date(),
        autoReplyId: sentEmail._id.toString(),
      };
      
      await email.save();
      
      return { 
        success: true, 
        sentEmail, 
        info: result 
      };
    } catch (error) {
      console.error('Error sending auto-reply:', error);
      return { 
        success: false, 
        error: error.message 
      };
    }
  }
}

module.exports = SmtpService; 