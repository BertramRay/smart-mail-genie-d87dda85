const Rule = require('../models/rule.model');
const OpenAIService = require('../services/ai/openai.service');

// 获取用户的处理规则
exports.getUserRules = async (req, res) => {
  try {
    // 获取最新的一条规则
    const rule = await Rule.findOne({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(1);
    
    if (!rule) {
      return res.json({
        success: true,
        rule: null,
        message: '未找到处理规则',
      });
    }
    
    res.json({
      success: true,
      rule: {
        id: rule._id,
        content: rule.content,
        version: rule.version,
        isActive: rule.isActive,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
        lastProcessed: rule.lastProcessed,
      },
    });
  } catch (error) {
    console.error('Get rules error:', error);
    res.status(500).json({
      success: false,
      message: '获取处理规则失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 保存处理规则
exports.saveRules = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: '规则内容不能为空',
      });
    }
    
    // 解析规则（使用 OpenAI 进行解析）
    let parsedRules;
    try {
      const openAIService = new OpenAIService();
      parsedRules = await openAIService.parseRules(content);
    } catch (error) {
      console.error('Error parsing rules:', error);
      // 即使解析失败，也允许保存原始规则
    }
    
    // 查找现有规则或创建新规则
    let rule = await Rule.findOne({ user: req.user._id })
      .sort({ updatedAt: -1 })
      .limit(1);
    
    if (rule) {
      // 更新现有规则
      rule.content = content;
      rule.isActive = true; // 默认激活规则
      await rule.save();
    } else {
      // 创建新规则
      rule = new Rule({
        user: req.user._id,
        content,
        isActive: true,
      });
      await rule.save();
    }
    
    res.json({
      success: true,
      rule: {
        id: rule._id,
        content: rule.content,
        version: rule.version,
        isActive: rule.isActive,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      },
      parsedRules: parsedRules || null,
      message: '处理规则保存成功',
    });
  } catch (error) {
    console.error('Save rules error:', error);
    res.status(500).json({
      success: false,
      message: '保存处理规则失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 删除处理规则
exports.deleteRules = async (req, res) => {
  try {
    // 找到所有当前用户的规则并删除
    const result = await Rule.deleteMany({ user: req.user._id });
    
    res.json({
      success: true,
      count: result.deletedCount,
      message: '处理规则已删除',
    });
  } catch (error) {
    console.error('Delete rules error:', error);
    res.status(500).json({
      success: false,
      message: '删除处理规则失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// 解析处理规则
exports.parseRules = async (req, res) => {
  try {
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({
        success: false,
        message: '规则内容不能为空',
      });
    }
    
    // 使用 OpenAI 解析规则
    const openAIService = new OpenAIService();
    const parsedRules = await openAIService.parseRules(content);
    
    res.json({
      success: true,
      parsedRules,
    });
  } catch (error) {
    console.error('Parse rules error:', error);
    res.status(500).json({
      success: false,
      message: '解析处理规则失败',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}; 