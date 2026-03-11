# 🦞 托福AI教练 - UniApp版本

智能托福学习助手，AI驱动的个性化托福备考平台。

## 项目简介

基于 UniApp 开发的跨平台托福学习应用，支持微信小程序、H5、App等多端部署。

### 核心功能

- **词汇训练**：艾宾浩斯遗忘曲线复习、智能单词卡片、记忆技巧
- **阅读练习**：分级难度文章、TPO真题、答题反馈
- **口语教练**：独立/综合口语练习、AI录音反馈、发音纠正
- **写作批改**：综合/独立写作、AI智能批改、词汇升级建议
- **学习计划**：个性化学习路径、每日任务、进度追踪
- **能力评估**：全方位能力分析、学习建议

## 技术栈

- **前端框架**：UniApp + Vue 3
- **UI组件**：uni-ui
- **样式**：SCSS
- **状态管理**：Vuex
- **后端**：Node.js + Express（见 toefl-ai-coach 后端项目）

## 项目结构

```
toefl-ai-coach-uniapp/
├── src/
│   ├── pages/              # 页面
│   │   ├── index/          # 首页
│   │   ├── vocabulary/     # 词汇训练
│   │   ├── reading/        # 阅读练习
│   │   ├── speaking/       # 口语教练
│   │   ├── writing/        # 写作批改
│   │   ├── study-plan/     # 学习计划
│   │   └── profile/        # 个人中心
│   ├── utils/              # 工具函数
│   │   ├── api.js          # API接口
│   │   ├── storage.js      # 本地存储
│   │   └── common.js       # 通用工具
│   ├── static/             # 静态资源
│   ├── App.vue             # 应用入口
│   ├── main.js             # 主入口
│   ├── manifest.json       # 应用配置
│   ├── pages.json          # 页面配置
│   └── uni.scss            # 全局样式变量
├── package.json
└── README.md
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 开发运行

```bash
# H5
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App
npm run dev:app
```

### 打包构建

```bash
# H5
npm run build:h5

# 微信小程序
npm run build:mp-weixin

# App
npm run build:app
```

## 配置说明

### 修改后端API地址

编辑 `src/utils/api.js`：

```javascript
const API_BASE_URL = 'https://your-api-domain.com/api'
```

### 微信小程序配置

编辑 `src/manifest.json`：

```json
{
  "mp-weixin": {
    "appid": "your-wechat-appid"
  }
}
```

## 功能模块

### 1. 首页 Dashboard
- 用户信息卡片
- 学习统计
- 能力雷达图
- 今日任务
- 快捷入口

### 2. 词汇训练
- 学习进度追踪
- 艾宾浩斯复习
- 单词详情弹窗
- 多种学习模式

### 3. 阅读练习
- 难度分级（入门/进阶/托福）
- 文章列表
- 阅读理解答题
- 阅读技巧

### 4. 口语教练
- 独立口语 Task 1 & 2
- 综合口语 Task 3 & 4
- 录音计时
- AI反馈分析

### 5. 写作批改
- 综合写作
- 独立写作
- 写作模板
- 高分范文
- AI智能批改

### 6. 学习计划
- 目标设定
- 每日计划
- 学习日历
- 数据统计
- AI学习建议

### 7. 个人中心
- 用户信息
- 成就系统
- 学习数据
- 设置

## 后端接口

需要配合后端服务使用，后端项目地址：[toefl-ai-coach](../toefl-ai-coach)

## 开发团队

🦞 毒舌大龙虾

## 许可证

MIT
