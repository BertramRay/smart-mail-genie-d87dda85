const OpenAI = require('openai');
const Rule = require('../../models/rule.model');

class OpenAIService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  // 基础的邮件分析
  async analyzeEmail(email, userId) {
    try {
      // 获取用户的处理规则
      const userRules = await Rule.find({ user: userId, isActive: true })
        .sort({ updatedAt: -1 })
        .limit(1);

      const rulesContent = userRules.length > 0 ? userRules[0].content : '';

      // 构建 prompt
      const prompt = this._buildEmailAnalysisPrompt(email, rulesContent);

      // 调用 OpenAI API
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // 使用 GPT-4o 模型
        messages: [
          {
            role: 'system',
            content: prompt.system,
          },
          {
            role: 'user',
            content: prompt.user,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      // 解析响应
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error analyzing email with OpenAI:', error);
      throw new Error(`邮件分析失败: ${error.message}`);
    }
  }

  // 构建邮件分析 prompt
  _buildEmailAnalysisPrompt(email, rules) {
    const systemPrompt = `你是一个专业的电子邮件分析助手。你的任务是分析以下电子邮件并提供结构化输出。
分析时请考虑以下用户定义的规则：

${rules || '没有指定规则。'}

请根据邮件内容和上述规则，返回以下 JSON 格式的分析结果：`;

    const userPrompt = `
邮件信息:
发件人: ${email.from.name} <${email.from.email}>
主题: ${email.subject}
日期: ${new Date(email.date).toLocaleString()}
正文:
${email.text}

请对这封邮件进行全面分析，并以JSON格式返回结果，包括以下字段：
- summary: 简短概括邮件内容（50-100字）
- importance: 重要性评分（0-10，10最高）
- sentiment: 情感分析（"positive"、"negative"或"neutral"）
- keywords: 关键词列表
- topics: 话题列表
- actionItems: 需要执行的操作列表
- category: 邮件类别（如"工作"、"通知"、"营销"等）
- labels: 建议添加的标签列表
- requiredResponse: 是否需要回复（boolean）
- suggestedResponseText: 如果需要回复，建议的回复内容
- shouldStar: 是否应该标星（boolean）
- reasoning: 对分析结果的简短解释，尤其是为什么设置某些字段

注意：分析必须严格遵守用户定义的规则。`;

    return {
      system: systemPrompt,
      user: userPrompt,
    };
  }

  // 解析邮件处理规则
  async parseRules(rulesContent) {
    try {
      const prompt = `你是一个专业的电子邮件规则分析专家。
请分析以下用户定义的邮件处理规则，并将其转换为结构化格式。
这些规则将用于自动处理电子邮件，包括标记、分类、自动回复等功能。

用户定义的规则:
${rulesContent}

请提取规则的关键部分，并以JSON格式返回，包括以下字段：
- parsedRules: 已解析的规则数组，每条规则包含:
  - type: 规则类型（如"star"、"label"、"reply"、"archive"等）
  - condition: 触发规则的条件（如"from:boss@example.com"、"contains:urgent"等）
  - action: 要执行的操作（如"add-label:Important"、"send-reply:我会尽快回复您"等）
  - priority: 规则优先级（1-10，10最高）
- summary: 规则集的简短总结

请确保规则解析正确，并且能够被程序理解和执行。`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // 使用 GPT-4o 模型
        messages: [
          {
            role: 'system',
            content: '你是一个帮助解析邮件规则的AI助手。请将用户提供的自然语言规则转换为结构化格式。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.3,
        response_format: { type: 'json_object' },
      });

      // 解析响应
      const result = JSON.parse(response.choices[0].message.content);
      return result;
    } catch (error) {
      console.error('Error parsing rules with OpenAI:', error);
      throw new Error(`规则解析失败: ${error.message}`);
    }
  }

  // 生成邮件回复
  async generateReply(email, context) {
    try {
      const prompt = `你是一个专业的邮件回复助手。
请根据以下邮件内容和上下文，生成一个适当的回复。

原始邮件信息:
发件人: ${email.from.name} <${email.from.email}>
主题: ${email.subject}
日期: ${new Date(email.date).toLocaleString()}
正文:
${email.text}

上下文信息:
${context || '没有额外上下文。'}

请生成一个专业、礼貌且符合上下文的回复。回复应该直接、清晰，并解决邮件中提出的问题或要求。`;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o', // 使用 GPT-4o 模型
        messages: [
          {
            role: 'system',
            content: '你是一个专业的邮件回复助手，负责生成高质量的邮件回复。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.7,
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('Error generating reply with OpenAI:', error);
      throw new Error(`回复生成失败: ${error.message}`);
    }
  }
}

module.exports = OpenAIService;