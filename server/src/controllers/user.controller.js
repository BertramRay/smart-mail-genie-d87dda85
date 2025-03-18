const User = require('../models/user.model');
const schedulerService = require('../services/email/scheduler.service');

// 获取用户信息
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
        settings: user.settings,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 更新用户信息
exports.updateUserProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
    
    // 更新信息
    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    
    await user.save();
    
    res.json({
      success: true,
      message: '用户信息已更新',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({
      success: false,
      message: '更新用户信息失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 更新用户密码
exports.updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: '当前密码和新密码都不能为空',
      });
    }
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
    
    // 如果用户是通过 GitHub 注册且没有设置过密码
    if (!user.password) {
      user.password = newPassword;
      await user.save();
      
      return res.json({
        success: true,
        message: '密码已设置',
      });
    }
    
    // 验证当前密码
    const isMatch = await user.matchPassword(currentPassword);
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '当前密码不正确',
      });
    }
    
    // 更新密码
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: '密码已更新',
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({
      success: false,
      message: '更新密码失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 更新自动化设置
exports.updateSettings = async (req, res) => {
  try {
    const {
      autoSync,
      syncInterval,
      autoReply,
      processNewEmails,
    } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: '用户不存在',
      });
    }
    
    // 更新设置
    if (autoSync !== undefined) user.settings.autoSync = autoSync;
    if (syncInterval) user.settings.syncInterval = parseInt(syncInterval);
    if (autoReply !== undefined) user.settings.autoReply = autoReply;
    if (processNewEmails !== undefined) user.settings.processNewEmails = processNewEmails;
    
    await user.save();
    
    // 更新邮件同步调度器
    await schedulerService.updateUserScheduler(user._id);
    
    res.json({
      success: true,
      message: '设置已更新',
      settings: user.settings,
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({
      success: false,
      message: '更新设置失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}; 