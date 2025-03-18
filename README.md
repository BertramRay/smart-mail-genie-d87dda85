# Smart Mail Genie

Smart Mail Genie是一个智能邮件管理系统，使用AI进行分析和处理邮件，提高邮件处理效率。

## 技术栈

### 前端
- React
- TypeScript
- Vite
- TailwindCSS
- Shadcn UI组件库
- React Query

### 后端
- Node.js
- Express
- MongoDB
- Mongoose
- JWT认证
- OpenAI API

## 开发环境设置

### 前提条件
- Node.js 18+
- MongoDB
- OpenAI API密钥

### 安装依赖

1. 安装前端依赖：
```bash
npm install
```

2. 安装后端依赖：
```bash
cd server
npm install
```

### 环境配置

1. 前端配置：
复制`.env.example`为`.env.local`并根据需要修改环境变量。
```bash
cp .env.example .env.local
```

2. 后端配置：
复制`server/.env.example`为`server/.env`并填写必要的环境变量。
```bash
cd server
cp .env.example .env
```

确保在`.env`文件中设置以下必要变量：
- `MONGODB_URI`: MongoDB连接URL
- `JWT_SECRET`: JWT签名密钥
- `OPENAI_API_KEY`: OpenAI API密钥
- `PORT`: 服务器端口，默认5001

### 运行应用

#### 开发模式（单独运行）

1. 运行后端服务器：
```bash
cd server
npm run dev
```

2. 在另一个终端运行前端开发服务器：
```bash
npm run dev
```

#### 开发模式（并行运行前后端）

使用concurrently同时运行前端和后端：
```bash
npm run dev:all
```

#### 生产模式

1. 构建前端应用：
```bash
npm run build
```

2. 运行生产模式服务器：
```bash
cd server
npm start
```

## API测试

可以使用内置的API测试脚本测试后端API：
```bash
cd server
node test-api.js
```

## 特性

- 用户认证（注册、登录、JWT授权）
- 邮箱连接和同步
- 智能邮件分析
- 个性化规则创建
- 邮件自动分类与处理
- 重要邮件提醒
- 智能回复建议

## 贡献指南

1. Fork项目
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

[MIT](LICENSE)
