const express = require('express');
const router = express.Router();
const vocabularyService = require('../services/vocabularyService');

// 生成诊断测试
router.post('/diagnostic-test', async (req, res) => {
  try {
    const { userId } = req.body;
    const test = await vocabularyService.generateDiagnosticTest(userId);
    res.json({
      success: true,
      data: test
    });
  } catch (error) {
    console.error('生成诊断测试失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 提交测试结果
router.post('/submit-test', async (req, res) => {
  try {
    const { userId, testId, answers } = req.body;
    const report = await vocabularyService.submitTestResults(userId, testId, answers);
    res.json({
      success: true,
      data: report
    });
  } catch (error) {
    console.error('提交测试结果失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取今日学习任务
router.get('/today-tasks/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const tasks = await vocabularyService.getTodayTasks(userId);
    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('获取今日任务失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取学习统计
router.get('/statistics/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { UserWord, VocabularyTest } = require('../models/Vocabulary');
    
    // 获取总学习单词数
    const totalLearned = await UserWord.countDocuments({ userId });
    const mastered = await UserWord.countDocuments({ userId, status: 'mastered' });
    const learning = await UserWord.countDocuments({ userId, status: 'learning' });
    const reviewing = await UserWord.countDocuments({ userId, status: 'reviewing' });
    
    // 获取最近测试记录
    const recentTests = await VocabularyTest.find({ userId })
      .sort({ completedAt: -1 })
      .limit(5);
    
    // 计算平均正确率
    const avgAccuracy = recentTests.length > 0 
      ? recentTests.reduce((sum, t) => sum + t.statistics.accuracy, 0) / recentTests.length
      : 0;
    
    res.json({
      success: true,
      data: {
        totalLearned,
        mastered,
        learning,
        reviewing,
        avgAccuracy: Math.round(avgAccuracy),
        recentTests: recentTests.map(t => ({
          testType: t.testType,
          accuracy: t.statistics.accuracy,
          estimatedVocabulary: t.statistics.estimatedVocabulary,
          date: t.completedAt
        }))
      }
    });
  } catch (error) {
    console.error('获取统计失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
