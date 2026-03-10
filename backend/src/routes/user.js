const express = require('express');
const router = express.Router();

// 模拟用户数据
const userProfiles = new Map();

// 获取用户信息
router.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profile = userProfiles.get(userId);
  
  if (!profile) {
    // 创建默认用户档案
    const defaultProfile = {
      userId,
      nickname: '托福学员',
      avatar: '',
      targetScore: 100,
      currentLevel: 'level1',
      studyDays: 0,
      totalStudyTime: 0,
      vocabularySize: 0,
      streak: 0,
      createdAt: new Date()
    };
    userProfiles.set(userId, defaultProfile);
    
    return res.json({
      success: true,
      data: defaultProfile
    });
  }
  
  res.json({
    success: true,
    data: profile
  });
});

// 更新用户信息
router.put('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const updates = req.body;
  
  let profile = userProfiles.get(userId);
  if (!profile) {
    profile = { userId, createdAt: new Date() };
  }
  
  Object.assign(profile, updates, { updatedAt: new Date() });
  userProfiles.set(userId, profile);
  
  res.json({
    success: true,
    data: profile
  });
});

// 获取学习统计
router.get('/stats/:userId', (req, res) => {
  const { userId } = req.params;
  
  // 模拟统计数据
  const stats = {
    userId,
    totalStudyDays: 15,
    currentStreak: 7,
    longestStreak: 12,
    totalStudyTime: 45, // 小时
    vocabulary: {
      learned: 450,
      mastered: 280,
      reviewing: 120,
      forgotten: 50
    },
    reading: {
      articlesCompleted: 25,
      averageScore: 75,
      totalWords: 15000
    },
    speaking: {
      tasksCompleted: 30,
      averageScore: 22,
      totalPracticeTime: 8 // 小时
    },
    writing: {
      essaysCompleted: 12,
      averageScore: 24,
      totalWords: 4200
    },
    weeklyProgress: [
      { day: '周一', studyTime: 60, tasks: 5 },
      { day: '周二', studyTime: 45, tasks: 4 },
      { day: '周三', studyTime: 90, tasks: 8 },
      { day: '周四', studyTime: 30, tasks: 3 },
      { day: '周五', studyTime: 60, tasks: 5 },
      { day: '周六', studyTime: 120, tasks: 10 },
      { day: '周日', studyTime: 90, tasks: 8 }
    ]
  };
  
  res.json({
    success: true,
    data: stats
  });
});

// 获取成就
router.get('/achievements/:userId', (req, res) => {
  const achievements = [
    {
      id: 'ach_001',
      title: '初次打卡',
      description: '完成第一次学习',
      icon: '🎯',
      unlocked: true,
      unlockedAt: '2024-03-01'
    },
    {
      id: 'ach_002',
      title: '坚持7天',
      description: '连续学习7天',
      icon: '🔥',
      unlocked: true,
      unlockedAt: '2024-03-07'
    },
    {
      id: 'ach_003',
      title: '词汇达人',
      description: '掌握500个单词',
      icon: '📚',
      unlocked: true,
      unlockedAt: '2024-03-10'
    },
    {
      id: 'ach_004',
      title: '阅读先锋',
      description: '完成20篇阅读',
      icon: '📖',
      unlocked: true,
      unlockedAt: '2024-03-12'
    },
    {
      id: 'ach_005',
      title: '口语之星',
      description: '完成30个口语任务',
      icon: '🎤',
      unlocked: false
    },
    {
      id: 'ach_006',
      title: '写作高手',
      description: '完成20篇作文',
      icon: '✍️',
      unlocked: false
    },
    {
      id: 'ach_007',
      title: '坚持30天',
      description: '连续学习30天',
      icon: '💎',
      unlocked: false
    },
    {
      id: 'ach_008',
      title: '托福预备',
      description: '词汇量达到8000',
      icon: '🏆',
      unlocked: false
    }
  ];
  
  res.json({
    success: true,
    data: achievements
  });
});

// 记录学习打卡
router.post('/checkin/:userId', (req, res) => {
  const { userId } = req.params;
  const { studyTime, tasks } = req.body;
  
  let profile = userProfiles.get(userId);
  if (!profile) {
    profile = { userId, studyDays: 0, streak: 0, createdAt: new Date() };
  }
  
  profile.studyDays = (profile.studyDays || 0) + 1;
  profile.streak = (profile.streak || 0) + 1;
  profile.totalStudyTime = (profile.totalStudyTime || 0) + studyTime;
  profile.lastCheckIn = new Date();
  
  userProfiles.set(userId, profile);
  
  res.json({
    success: true,
    data: {
      message: '打卡成功！',
      studyDays: profile.studyDays,
      streak: profile.streak,
      studyTime,
      tasks
    }
  });
});

module.exports = router;
