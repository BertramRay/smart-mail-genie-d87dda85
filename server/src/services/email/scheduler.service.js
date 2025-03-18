const User = require('../../models/user.model');
const Mailbox = require('../../models/mailbox.model');
const syncService = require('./sync.service');

class EmailSchedulerService {
  constructor() {
    this.schedulers = new Map(); // 存储用户的调度器
  }

  // 启动所有用户的邮件同步调度
  async startAllSchedulers() {
    try {
      // 获取所有用户
      const users = await User.find({ isActive: true });
      
      for (const user of users) {
        await this.startUserScheduler(user._id);
      }
      
      console.log(`Started email schedulers for ${this.schedulers.size} users`);
    } catch (error) {
      console.error('Error starting all email schedulers:', error);
    }
  }

  // 启动单个用户的邮件同步调度
  async startUserScheduler(userId) {
    try {
      // 如果该用户已有调度器，先停止
      if (this.schedulers.has(userId.toString())) {
        this.stopUserScheduler(userId);
      }
      
      // 获取用户
      const user = await User.findById(userId);
      
      if (!user || !user.isActive) {
        return false;
      }
      
      // 检查用户是否开启了自动同步
      if (!user.settings.autoSync) {
        return false;
      }
      
      // 获取同步间隔（分钟）
      const intervalMinutes = user.settings.syncInterval || 15;
      const intervalMs = intervalMinutes * 60 * 1000;
      
      // 创建调度器
      const scheduler = setInterval(async () => {
        try {
          // 同步用户的所有邮箱
          await syncService.syncAllMailboxes(userId, {
            analyzeEmails: true,
            processNewEmails: user.settings.processNewEmails,
          });
        } catch (error) {
          console.error(`Scheduled sync error for user ${userId}:`, error);
        }
      }, intervalMs);
      
      // 存储调度器
      this.schedulers.set(userId.toString(), scheduler);
      
      return true;
    } catch (error) {
      console.error(`Error starting scheduler for user ${userId}:`, error);
      return false;
    }
  }

  // 停止单个用户的邮件同步调度
  stopUserScheduler(userId) {
    const userIdStr = userId.toString();
    
    if (this.schedulers.has(userIdStr)) {
      clearInterval(this.schedulers.get(userIdStr));
      this.schedulers.delete(userIdStr);
      return true;
    }
    
    return false;
  }

  // 更新用户的邮件同步调度
  async updateUserScheduler(userId) {
    try {
      // 获取用户
      const user = await User.findById(userId);
      
      if (!user || !user.isActive) {
        this.stopUserScheduler(userId);
        return false;
      }
      
      // 如果用户禁用了自动同步，则停止调度
      if (!user.settings.autoSync) {
        this.stopUserScheduler(userId);
        return false;
      }
      
      // 否则重启调度器
      return await this.startUserScheduler(userId);
    } catch (error) {
      console.error(`Error updating scheduler for user ${userId}:`, error);
      return false;
    }
  }

  // 停止所有调度器
  stopAllSchedulers() {
    for (const [userId, scheduler] of this.schedulers.entries()) {
      clearInterval(scheduler);
      console.log(`Stopped scheduler for user ${userId}`);
    }
    
    this.schedulers.clear();
  }

  // 获取所有活跃的调度器
  getActiveSchedulers() {
    const activeSchedulers = [];
    
    for (const userId of this.schedulers.keys()) {
      activeSchedulers.push(userId);
    }
    
    return activeSchedulers;
  }
}

module.exports = new EmailSchedulerService();

 