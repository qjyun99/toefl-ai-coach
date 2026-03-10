# 🦞 托福AI教练 (TOEFL AI Coach)

一个基于AI的托福学习应用，帮助用户高效备考托福考试。

## 核心功能

### 📚 词汇训练
- 词汇诊断测试（200题，5种题型）
- 艾宾浩斯遗忘曲线智能复习
- 5级词汇体系（四级→托福→学科词汇）
- 个性化学习路径

### 📖 阅读练习
- 分级阅读材料
- 限时阅读训练
- 智能题目生成
- 错题分析

### 🎤 口语教练
- AI口语评测
- 独立口语练习
- 综合口语训练
- 跟读模仿

### ✍️ 写作批改
- AI作文批改
- 语法错误纠正
- 词汇建议
- 高分范文

### 📅 学习计划
- 个性化学习计划
- 每日任务推送
- 学习进度追踪
- 阶段目标设定

## 技术栈

### 后端
- Node.js + Express
- MongoDB (数据存储)
- OpenAI API (AI能力)
- JWT (认证)

### 前端
- React 18
- Ant Design 5
- React Router 6
- Axios

## 快速开始

### 后端启动
```bash
cd backend
npm install
npm start
```

### 前端启动
```bash
cd frontend
npm install
npm run dev
```

## 测试

```bash
cd backend
npm test
```

## 项目结构

```
toefl-ai-coach/
├── backend/          # 后端代码
│   ├── src/
│   │   ├── models/   # 数据模型
│   │   ├── routes/   # API路由
│   │   └── services/ # 业务逻辑
│   └── tests/        # 测试代码
├── frontend/         # 前端代码
│   └── src/
│       ├── components/ # 组件
│       └── pages/      # 页面
└── README.md
```

## 许可证

MIT
