const Mailbox = require('../../models/mailbox.model');
const User = require('../../models/user.model');
const Email = require('../../models/email.model');
const ImapService = require('./imap.service');
const SmtpService = require('./smtp.service');
const OpenAIService = require('../ai/openai.service');

class EmailSyncService {
  constructor() {
    this.openAIService = new OpenAIService();
    this.syncJobs = new Map(); // 存储进行中的同步任务
  }

  // 同步单个邮箱
  async syncMailbox(mailboxId, options = {}) {
    try {
      const mailbox = await Mailbox.findById(mailboxId);
      
      if (!mailbox) {
        throw new Error('邮箱不存在');
      }
      
      // 检查是否已经在同步
      if (this.syncJobs.has(mailboxId)) {
        return { 
          success: false, 
          message: '该邮箱已经在同步中' 
        };
      }
      
      // 标记邮箱为同步状态
      this.syncJobs.set(mailboxId, true);
      mailbox.syncStatus.lastSyncStatus = 'pending';
      await mailbox.save();

      // 获取邮件选项
      const limit = options.limit || 20;
      const analyzeEmails = options.analyzeEmails !== false;
      const processNewEmails = options.processNewEmails !== false;
      
      // 创建 IMAP 服务
      const imapService = new ImapService(mailbox);
      
      try {
        // 获取最近的邮件
        const emails = await imapService.getRecentEmails(limit);
        
        // 保存邮件到数据库
        const savedEmails = await ImapService.saveEmailsToDB(emails, mailbox.user, mailbox._id);
        
        // 更新同步状态
        mailbox.syncStatus.lastSync = new Date();
        mailbox.syncStatus.lastSyncStatus = 'success';
        await mailbox.save();
        
        // 如果需要分析邮件
        if (analyzeEmails && processNewEmails) {
          // 异步分析邮件
          this._analyzeNewEmails(savedEmails, mailbox);
        }
        
        // 移除同步标记
        this.syncJobs.delete(mailboxId);
        
        return {
          success: true,
          count: savedEmails.length,
          message: '邮箱同步成功'
        };
      } catch (error) {
        // 更新同步状态为失败
        mailbox.syncStatus.lastSyncStatus = 'failed';
        mailbox.syncStatus.lastSyncError = error.message;
        await mailbox.save();
        
        // 移除同步标记
        this.syncJobs.delete(mailboxId);
        
        throw error;
      }
    } catch (error) {
      console.error(`Error syncing mailbox ${mailboxId}:`, error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // 异步分析新邮件
  async _analyzeNewEmails(emails, mailbox) {
    try {
      // 筛选未分析的新邮件
      const newEmails = emails.filter(email => 
        !email.analysis || !email.analysis.analyzedAt
      );
      
      if (newEmails.length === 0) {
        return;
      }
      
      for (const email of newEmails) {
        try {
          // 使用 OpenAI 分析邮件
          const analysisResult = await this.openAIService.analyzeEmail(email, mailbox.user);
          
          // 更新邮件的分析结果
          email.analysis = {
            summary: analysisResult.summary,
            importance: analysisResult.importance,
            sentiment: analysisResult.sentiment,
            keywords: analysisResult.keywords,
            topics: analysisResult.topics,
            actionItems: analysisResult.actionItems,
            category: analysisResult.category,
            entities: analysisResult.entities || [],
            requiredResponse: analysisResult.requiredResponse,
            suggestedResponseText: analysisResult.suggestedResponseText,
            analyzedAt: new Date(),
          };
          
          // 更新标签
          if (analysisResult.labels && Array.isArray(analysisResult.labels)) {
            email.labels = [...new Set([...email.labels, ...analysisResult.labels])];
          }
          
          // 标星邮件
          if (analysisResult.shouldStar) {
            email.isStarred = true;
          }
          
          await email.save();
          
          // 如果需要自动回复
          if (
            analysisResult.requiredResponse && 
            analysisResult.suggestedResponseText && 
            !email.autoReply?.hasAutoReplied
          ) {
            await this._autoReplyToEmail(email, analysisResult.suggestedResponseText, mailbox);
          }
        } catch (error) {
          console.error(`Error analyzing email ${email._id}:`, error);
        }
      }
    } catch (error) {
      console.error('Error analyzing new emails:', error);
    }
  }

  // 自动回复邮件
  async _autoReplyToEmail(email, replyText, mailbox) {
    try {
      // 获取用户设置
      const user = await User.findById(mailbox.user);
      
      // 检查用户是否允许自动回复
      if (!user.settings.autoReply) {
        return;
      }
      
      // 发送自动回复
      const smtpService = new SmtpService(mailbox);
      const result = await smtpService.sendAutoReply(
        email, 
        replyText, 
        mailbox.user, 
        mailbox._id
      );
      
      return result;
    } catch (error) {
      console.error(`Error auto-replying to email ${email._id}:`, error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // 同步用户的所有邮箱
  async syncAllMailboxes(userId, options = {}) {
    try {
      // 获取用户的所有活跃邮箱
      const mailboxes = await Mailbox.find({
        user: userId,
        'syncStatus.isActive': true
      });
      
      if (mailboxes.length === 0) {
        return {
          success: false,
          message: '没有找到活跃的邮箱'
        };
      }
      
      const results = {};
      
      // 顺序同步所有邮箱
      for (const mailbox of mailboxes) {
        try {
          const result = await this.syncMailbox(mailbox._id, options);
          results[mailbox._id] = result;
        } catch (error) {
          results[mailbox._id] = {
            success: false,
            message: error.message
          };
        }
      }
      
      return {
        success: true,
        results
      };
    } catch (error) {
      console.error(`Error syncing all mailboxes for user ${userId}:`, error);
      return {
        success: false,
        message: error.message
      };
    }
  }

  // 获取邮箱同步状态
  async getMailboxSyncStatus(mailboxId) {
    try {
      const mailbox = await Mailbox.findById(mailboxId);
      
      if (!mailbox) {
        throw new Error('邮箱不存在');
      }
      
      return {
        lastSync: mailbox.syncStatus.lastSync,
        lastSyncStatus: mailbox.syncStatus.lastSyncStatus,
        lastSyncError: mailbox.syncStatus.lastSyncError,
        isActive: mailbox.syncStatus.isActive,
        isSyncing: this.syncJobs.has(mailboxId),
      };
    } catch (error) {
      console.error(`Error getting mailbox sync status for ${mailboxId}:`, error);
      throw error;
    }
  }
}

module.exports = new EmailSyncService(); 