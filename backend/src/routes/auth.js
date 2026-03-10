const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 模拟用户数据库（实际应该用MongoDB）
const users = new Map();

// 注册
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (users.has(email)) {
      return res.status(400).json({
        success: false,
        error: '用户已存在'
      });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = `user_${Date.now()}`;
    
    users.set(email, {
      id: userId,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });
    
    const token = jwt.sign(
      { userId, email },
      process.env.JWT_SECRET || 'toefl-ai-secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        userId,
        username,
        email,
        token
      }
    });
  } catch (error) {
    console.error('注册失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 登录
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = users.get(email);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: '用户不存在'
      });
    }
    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: '密码错误'
      });
    }
    
    const token = jwt.sign(
      { userId: user.id, email },
      process.env.JWT_SECRET || 'toefl-ai-secret',
      { expiresIn: '7d' }
    );
    
    res.json({
      success: true,
      data: {
        userId: user.id,
        username: user.username,
        email,
        token
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
