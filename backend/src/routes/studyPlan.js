const express = require('express');
const router = express.Router();

// 学习计划模板
const studyPlanTemplates = {
  beginner: {
    name: '零基础起步计划',
    duration: 12, // 个月
    dailyTime: 60, // 分钟
    phases: [
      {
        phase: 1,
        name: '基础夯实',
        duration: '第1-3个月',
        focus: ['词汇', '基础语法'],
        dailyTasks: {
          vocabulary: { time: 30, count: 20, type: 'new' },
          reading: { time: 20, type: 'simple' },
          listening: { time: 10, type: 'slow' },
          speaking: { time: 0 },
          writing: { time: 0 }
        },
        milestones: ['词汇量达到6000', '能读懂简单学术文章']
      },
      {
        phase: 2,
        name: '专项突破',
        duration: '第4-6个月',
        focus: ['阅读', '听力', '口语起步'],
        dailyTasks: {
          vocabulary: { time: 20, count: 15, type: 'mixed' },
          reading: { time: 20, type: 'toefl_easy' },
          listening: { time: 15, type: 'normal' },
          speaking: { time: 5, type: 'shadowing' },
          writing: { time: 0 }
        },
        milestones: ['TPO阅读20+', '能听懂常速英语', '口语能自我介绍']
      },
      {
        phase: 3,
        name: '强化训练',
        duration: '第7-9个月',
        focus: ['全科强化', '真题训练'],
        dailyTasks: {
          vocabulary: { time: 15, count: 10, type: 'review' },
          reading: { time: 20, type: 'toefl' },
          listening: { time: 15, type: 'toefl' },
          speaking: { time: 10, type: 'practice' },
          writing: { time: 10, type: 'practice' }
        },
        milestones: ['TPO阅读25+', '听力25+', '口语能流利表达']
      },
      {
        phase: 4,
        name: '冲刺备考',
        duration: '第10-12个月',
        focus: ['模考冲刺', '弱项突破'],
        dailyTasks: {
          vocabulary: { time: 10, count: 10, type: 'review' },
          reading: { time: 20, type: 'mock' },
          listening: { time: 15, type: 'mock' },
          speaking: { time: 10, type: 'mock' },
          writing: { time: 15, type: 'mock' }
        },
        milestones: ['模考100+', '达到目标分数']
      }
    ]
  },
  
  intermediate: {
    name: '四级进阶计划',
    duration: 9,
    dailyTime: 60,
    phases: [
      {
        phase: 1,
        name: '查漏补缺',
        duration: '第1-2个月',
        focus: ['词汇诊断', '弱项强化'],
        dailyTasks: {
          vocabulary: { time: 25, count: 20, type: 'diagnostic' },
          reading: { time: 20, type: 'toefl' },
          listening: { time: 15, type: 'toefl' },
          speaking: { time: 0 },
          writing: { time: 0 }
        }
      },
      {
        phase: 2,
        name: '专项提升',
        duration: '第3-6个月',
        focus: ['全科均衡', '技巧训练'],
        dailyTasks: {
          vocabulary: { time: 15, count: 15, type: 'toefl' },
          reading: { time: 20, type: 'toefl' },
          listening: { time: 15, type: 'toefl' },
          speaking: { time: 10, type: 'practice' },
          writing: { time: 10, type: 'practice' }
        }
      },
      {
        phase: 3,
        name: '冲刺模考',
        duration: '第7-9个月',
        focus: ['模考训练', '考前冲刺'],
        dailyTasks: {
          vocabulary: { time: 10, count: 10, type: 'review' },
          reading: { time: 20, type: 'mock' },
          listening: { time: 15, type: 'mock' },
          speaking: { time: 10, type: 'mock' },
          writing: { time: 15, type: 'mock' }
        }
      }
    ]
  },
  
  advanced: {
    name: '冲刺高分计划',
    duration: 6,
    dailyTime: 90,
    phases: [
      {
        phase: 1,
        name: '快速诊断',
        duration: '第1个月',
        focus: ['水平测试', '弱项定位'],
        dailyTasks: {
          vocabulary: { time: 20, count: 20, type: 'advanced' },
          reading: { time: 25, type: 'toefl' },
          listening: { time: 20, type: 'toefl' },
          speaking: { time: 15, type: 'practice' },
          writing: { time: 15, type: 'practice' }
        }
      },
      {
        phase: 2,
        name: '全科强化',
        duration: '第2-4个月',
        focus: ['高分技巧', '速度提升'],
        dailyTasks: {
          vocabulary: { time: 15, count: 15, type: 'advanced' },
          reading: { time: 25, type: 'toefl' },
          listening: { time: 20, type: 'toefl' },
          speaking: { time: 15, type: 'practice' },
          writing: { time: 20, type: 'practice' }
        }
      },
      {
        phase: 3,
        name: '模考冲刺',
        duration: '第5-6个月',
        focus: ['全真模考', '考前调整'],
        dailyTasks: {
          vocabulary: { time: 10, count: 10, type: 'review' },
          reading: { time: 25, type: 'mock' },
          listening: { time: 20, type: 'mock' },
          speaking: { time: 15, type: 'mock' },
          writing: { time: 25, type: 'mock' }
        }
      }
    ]
  }
};

// 获取学习计划列表
router.get('/templates', (req, res) => {
  const templates = Object.entries(studyPlanTemplates).map(([key, plan]) => ({
    id: key,
    name: plan.name,
    duration: plan.duration,
    dailyTime: plan.dailyTime,
    phases: plan.phases.length
  }));
  
  res.json({
    success: true,
    data: templates
  });
});

// 获取详细学习计划
router.get('/template/:planId', (req, res) => {
  const { planId } = req.params;
  const plan = studyPlanTemplates[planId];
  
  if (!plan) {
    return res.status(404).json({
      success: false,
      error: '学习计划不存在'
    });
  }
  
  res.json({
    success: true,
    data: plan
  });
});

// 为用户生成个性化学习计划
router.post('/generate/:userId', (req, res) => {
  const { userId } = req.params;
  const { currentLevel, targetScore, availableTime } = req.body;
  
  // 根据用户水平选择计划
  let planId = 'beginner';
  if (currentLevel === 'cet4') planId = 'intermediate';
  if (currentLevel === 'cet6' || currentLevel === 'toefl_80') planId = 'advanced';
  
  const basePlan = studyPlanTemplates[planId];
  
  // 个性化调整
  const personalizedPlan = {
    userId,
    planId,
    planName: basePlan.name,
    targetScore: targetScore || 100,
    startDate: new Date(),
    duration: basePlan.duration,
    dailyTime: availableTime || basePlan.dailyTime,
    currentPhase: 1,
    phases: basePlan.phases.map(phase => ({
      ...phase,
      completed: false,
      progress: 0
    })),
    todayTasks: generateTodayTasks(basePlan.phases[0], availableTime || basePlan.dailyTime)
  };
  
  res.json({
    success: true,
    data: personalizedPlan
  });
});

// 获取今日学习任务
router.get('/today/:userId', (req, res) => {
  const { userId } = req.params;
  
  // 模拟今日任务
  const todayTasks = {
    date: new Date().toISOString().split('T')[0],
    totalTime: 60,
    completed: false,
    tasks: [
      {
        id: 'task_001',
        type: 'vocabulary',
        title: '词汇学习',
        description: '学习20个新单词，复习30个旧单词',
        time: 20,
        completed: false,
        icon: '📚'
      },
      {
        id: 'task_002',
        type: 'reading',
        title: '阅读练习',
        description: '完成1篇托福阅读，限时15分钟',
        time: 20,
        completed: false,
        icon: '📖'
      },
      {
        id: 'task_003',
        type: 'listening',
        title: '听力训练',
        description: '精听1段TPO听力材料',
        time: 15,
        completed: false,
        icon: '🎧'
      },
      {
        id: 'task_004',
        type: 'speaking',
        title: '口语跟读',
        description: '跟读托福口语范文15分钟',
        time: 15,
        completed: false,
        icon: '🎤'
      }
    ],
    progress: {
      completed: 0,
      total: 4,
      percentage: 0
    }
  };
  
  res.json({
    success: true,
    data: todayTasks
  });
});

// 完成任务
router.post('/complete-task/:userId', (req, res) => {
  const { userId } = req.params;
  const { taskId, timeSpent } = req.body;
  
  res.json({
    success: true,
    data: {
      message: '任务完成！',
      taskId,
      timeSpent,
      earnedPoints: 10,
      streakBonus: 5
    }
  });
});

// 生成今日任务
function generateTodayTasks(phase, availableTime) {
  const tasks = [];
  const tasksConfig = phase.dailyTasks;
  
  if (tasksConfig.vocabulary.time > 0) {
    tasks.push({
      type: 'vocabulary',
      title: '词汇学习',
      time: tasksConfig.vocabulary.time,
      count: tasksConfig.vocabulary.count
    });
  }
  
  if (tasksConfig.reading.time > 0) {
    tasks.push({
      type: 'reading',
      title: '阅读练习',
      time: tasksConfig.reading.time
    });
  }
  
  if (tasksConfig.listening.time > 0) {
    tasks.push({
      type: 'listening',
      title: '听力训练',
      time: tasksConfig.listening.time
    });
  }
  
  if (tasksConfig.speaking.time > 0) {
    tasks.push({
      type: 'speaking',
      title: '口语练习',
      time: tasksConfig.speaking.time
    });
  }
  
  if (tasksConfig.writing.time > 0) {
    tasks.push({
      type: 'writing',
      title: '写作练习',
      time: tasksConfig.writing.time
    });
  }
  
  return tasks;
}

module.exports = router;
