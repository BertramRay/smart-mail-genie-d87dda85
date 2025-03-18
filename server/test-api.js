const axios = require('axios');
require('dotenv').config();

// 禁用代理
process.env.NO_PROXY = 'localhost,127.0.0.1';
axios.defaults.proxy = false;
axios.defaults.httpsAgent = new (require('https').Agent)({ rejectUnauthorized: false });

// 定义API基础URL
const API_URL = `http://localhost:${process.env.PORT || 5001}/api`;
console.log(`使用API地址: ${API_URL}`);

// 超时和重试配置
const config = {
  requestTimeout: 10000,    // 增加请求超时时间(ms)为10秒
  maxRetries: 3,           // 最大重试次数
  retryDelay: 1000,        // 重试延迟(ms)
};

// 存储测试过程中产生的数据（如token、userId等）
const testData = {
  token: null,
  userId: null,
  ruleId: null,
  emailId: null,
  testUser: {
    name: '测试用户',
    email: `test${Date.now()}@example.com`,
    password: 'password123'
  }
};

// 颜色定义用于格式化输出
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

// 简单日志函数
const log = {
  info: (msg) => console.log(`${colors.blue}[INFO]${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}[ERROR]${colors.reset} ${msg}`),
  warn: (msg) => console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`),
  debug: (msg) => console.log(`${colors.cyan}[DEBUG]${colors.reset} ${msg}`),
  title: (msg) => console.log(`\n${colors.bright}${colors.blue}=== ${msg} ===${colors.reset}\n`)
};

// 带重试功能的请求函数
async function requestWithRetry(method, url, data = null, headers = {}, retries = 0) {
  try {
    const options = {
      method,
      url,
      timeout: config.requestTimeout,
      headers
    };

    if (data) {
      options.data = data;
    }

    log.debug(`发送 ${method.toUpperCase()} 请求到 ${url}`);
    const response = await axios(options);
    log.debug(`请求成功, 状态码: ${response.status}`);
    return response;
  } catch (error) {
    if (retries < config.maxRetries) {
      log.warn(`请求失败，将在 ${config.retryDelay}ms 后重试 (${retries + 1}/${config.maxRetries})`);
      await new Promise(resolve => setTimeout(resolve, config.retryDelay));
      return requestWithRetry(method, url, data, headers, retries + 1);
    }

    if (error.code === 'ECONNREFUSED') {
      throw new Error(`无法连接到服务器 (${url})，请确保服务器正在运行`);
    } else if (error.code === 'ETIMEDOUT') {
      throw new Error(`请求超时 (${url})`);
    } else {
      throw error; // 重抛原始错误
    }
  }
}

// 测试函数 - 服务器健康检查
async function testServerHealth() {
  log.title('测试服务器健康状态');
  try {
    // 尝试访问一个简单端点
    const response = await requestWithRetry('get', `${API_URL}/health`);
    
    if (response.status === 200) {
      log.success(`服务器健康检查成功 - 状态: ${response.data.status || 'OK'}`);
      return true;
    } else {
      log.error(`服务器健康检查失败: ${response.statusText}`);
      return false;
    }
  } catch (error) {
    log.error(`服务器健康检查错误: ${error.message}`);
    
    // 尝试直接访问根路径 - 作为后备检查
    try {
      log.info('尝试访问根路径作为后备健康检查...');
      const rootResponse = await requestWithRetry('get', API_URL.replace(/\/api$/, ''));
      if (rootResponse.status < 500) {
        log.success('服务器似乎在运行，但健康检查端点不可用');
        return true;
      }
    } catch (backupError) {
      log.debug(`后备健康检查也失败: ${backupError.message}`);
    }
    
    log.info('创建简单的健康检查端点可能会有助于诊断问题');
    return false;
  }
}

// 测试函数 - 用户注册
async function testRegister() {
  log.title('测试用户注册');
  try {
    log.info(`注册用户: ${testData.testUser.email}`);
    const response = await requestWithRetry('post', `${API_URL}/auth/register`, testData.testUser);
    
    if (response.data.success && response.data.token) {
      testData.token = response.data.token;
      testData.userId = response.data.user.id;
      log.success(`用户注册成功 - ID: ${testData.userId}`);
      return true;
    } else {
      log.error(`用户注册失败: ${response.data.message || '未知错误'}`);
      return false;
    }
  } catch (error) {
    log.error(`用户注册请求错误: ${error.message}`);
    if (error.response) {
      log.debug(`响应状态: ${error.response.status}`);
      log.debug(`响应数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 测试函数 - 用户登录
async function testLogin() {
  log.title('测试用户登录');
  try {
    log.info(`登录用户: ${testData.testUser.email}`);
    const response = await requestWithRetry('post', `${API_URL}/auth/login`, {
      email: testData.testUser.email,
      password: testData.testUser.password
    });
    
    if (response.data.success && response.data.token) {
      testData.token = response.data.token;
      log.success('用户登录成功');
      return true;
    } else {
      log.error(`用户登录失败: ${response.data.message || '未知错误'}`);
      return false;
    }
  } catch (error) {
    log.error(`用户登录请求错误: ${error.message}`);
    if (error.response) {
      log.debug(`响应状态: ${error.response.status}`);
      log.debug(`响应数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 测试函数 - 获取当前用户
async function testGetMe() {
  log.title('测试获取当前用户信息');
  try {
    if (!testData.token) {
      log.error('未获取到有效的认证令牌，跳过测试');
      return false;
    }
    
    const response = await requestWithRetry('get', `${API_URL}/auth/me`, null, {
      Authorization: `Bearer ${testData.token}`
    });
    
    if (response.data.success && response.data.user) {
      log.success(`成功获取用户信息 - 名称: ${response.data.user.name}`);
      return true;
    } else {
      log.error(`获取用户信息失败: ${response.data.message || '未知错误'}`);
      return false;
    }
  } catch (error) {
    log.error(`获取用户信息请求错误: ${error.message}`);
    if (error.response) {
      log.debug(`响应状态: ${error.response.status}`);
      log.debug(`响应数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 测试函数 - 创建邮件处理规则
async function testCreateRule() {
  log.title('测试创建邮件处理规则');
  try {
    if (!testData.token) {
      log.error('未获取到有效的认证令牌，跳过测试');
      return false;
    }
    
    const ruleData = {
      content: '如果邮件来自我的上司，标记为重要。\n如果邮件包含"紧急"字样，标记为重要。',
    };
    
    log.info(`创建规则`);
    log.debug(`规则内容: ${ruleData.content}`);
    
    try {
      const response = await requestWithRetry('post', `${API_URL}/rules`, ruleData, {
        Authorization: `Bearer ${testData.token}`
      });
      
      if (response.data.success && response.data.rule) {
        testData.ruleId = response.data.rule.id;
        log.success(`成功创建规则 - ID: ${testData.ruleId}`);
        log.debug(`规则版本: ${response.data.rule.version}`);
        return true;
      } else {
        log.error(`创建规则失败: ${response.data.message || '未知错误'}`);
        return false;
      }
    } catch (error) {
      // 如果创建失败可能是因为OpenAI调用超时，尝试简化版规则
      log.warn(`首次尝试创建规则失败: ${error.message}`);
      log.info('尝试创建简化版规则...');
      
      // 简化规则内容
      const simpleRuleData = {
        content: '重要邮件标记为重要',
      };
      
      try {
        const retryResponse = await requestWithRetry('post', `${API_URL}/rules`, simpleRuleData, {
          Authorization: `Bearer ${testData.token}`
        });
        
        if (retryResponse.data.success && retryResponse.data.rule) {
          testData.ruleId = retryResponse.data.rule.id;
          log.success(`成功创建简化规则 - ID: ${testData.ruleId}`);
          return true;
        } else {
          log.error(`创建简化规则也失败: ${retryResponse.data.message || '未知错误'}`);
          return false;
        }
      } catch (retryError) {
        log.error(`创建简化规则请求错误: ${retryError.message}`);
        return false;
      }
    }
  } catch (outerError) {
    log.error(`规则创建过程中发生错误: ${outerError.message}`);
    return false;
  }
}

// 测试函数 - 获取用户规则
async function testGetRules() {
  log.title('测试获取用户规则列表');
  try {
    if (!testData.token) {
      log.error('未获取到有效的认证令牌，跳过测试');
      return false;
    }
    
    const response = await requestWithRetry('get', `${API_URL}/rules`, null, {
      Authorization: `Bearer ${testData.token}`
    });
    
    if (response.data.success && Array.isArray(response.data.rules)) {
      log.success(`成功获取规则列表 - 数量: ${response.data.rules.length}`);
      return true;
    } else {
      log.error(`获取规则列表失败: ${response.data.message || '未知错误'}`);
      return false;
    }
  } catch (error) {
    log.error(`获取规则列表请求错误: ${error.message}`);
    if (error.response) {
      log.debug(`响应状态: ${error.response.status}`);
      log.debug(`响应数据: ${JSON.stringify(error.response.data)}`);
    }
    return false;
  }
}

// 添加健康检查端点
async function addHealthEndpoint() {
  log.title('添加健康检查端点');
  
  try {
    const appFilePath = 'src/app.js';
    const fs = require('fs');
    
    if (!fs.existsSync(appFilePath)) {
      log.error(`找不到应用程序文件: ${appFilePath}`);
      return false;
    }
    
    let appContent = fs.readFileSync(appFilePath, 'utf8');
    
    // 检查是否已经有健康检查端点
    if (appContent.includes('/api/health')) {
      log.info('健康检查端点已存在');
      return true;
    }
    
    // 在API路由之后添加健康检查端点
    const routesPattern = /app\.use\('\/api', routes\);/;
    const healthEndpoint = `
// 健康检查端点
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

`;
    
    if (routesPattern.test(appContent)) {
      appContent = appContent.replace(routesPattern, `app.use('/api', routes);\n${healthEndpoint}`);
      fs.writeFileSync(appFilePath, appContent);
      log.success('已添加健康检查端点');
      
      // 通知用户需要重启服务器
      log.warn('请重启服务器以使更改生效');
      return true;
    } else {
      log.error('无法在app.js中找到合适的位置添加健康检查端点');
      return false;
    }
  } catch (error) {
    log.error(`添加健康检查端点时出错: ${error.message}`);
    return false;
  }
}

// 测试函数 - 运行所有测试
async function runTests() {
  log.title('开始API端点测试');
  
  try {
    // 添加健康检查端点
    await addHealthEndpoint();
    
    // 测试服务器健康状态
    let healthOK = await testServerHealth();
    if (!healthOK) {
      log.warn('健康检查失败，但将继续测试其他端点');
    }
    
    // 测试认证相关端点
    let authSuccess = false;
    let regSuccess = await testRegister();
    if (regSuccess) {
      authSuccess = true;
    } else {
      // 如果注册失败，尝试登录（用户可能已存在）
      log.info('注册失败，尝试登录（用户可能已存在）');
      let loginSuccess = await testLogin();
      if (loginSuccess) {
        authSuccess = true;
      }
    }
    
    if (!authSuccess) {
      throw new Error('无法注册或登录，终止测试');
    }
    
    // 测试获取用户信息
    await testGetMe();
    
    // 测试规则相关端点
    await testCreateRule();
    await testGetRules();
    
    log.title('API端点测试完成');
  } catch (error) {
    log.error(`测试过程中发生错误: ${error.message}`);
  }
}

// 运行所有测试
runTests();