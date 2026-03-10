const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/auth', require('./routes/auth'));
app.use('/api/vocabulary', require('./routes/vocabulary'));
app.use('/api/reading', require('./routes/reading'));
app.use('/api/speaking', require('./routes/speaking'));
app.use('/api/writing', require('./routes/writing'));
app.use('/api/user', require('./routes/user'));
app.use('/api/study-plan', require('./routes/studyPlan'));

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🦞 托福AI教练后端服务启动成功`);
  console.log(`📡 端口: ${PORT}`);
  console.log(`🕐 时间: ${new Date().toLocaleString()}`);
});

module.exports = app;
