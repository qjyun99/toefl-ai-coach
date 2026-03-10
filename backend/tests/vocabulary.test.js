const vocabularyService = require('../src/services/vocabularyService');
const { Word, UserWord, VocabularyTest } = require('../src/models/Vocabulary');

describe('词汇系统测试', () => {
  const testUserId = 'test_user_001';
  
  beforeEach(async () => {
    // 清理测试数据
    await UserWord.deleteMany({ userId: testUserId });
    await VocabularyTest.deleteMany({ userId: testUserId });
  });

  describe('词汇诊断测试', () => {
    test('应该生成包含200道题的诊断测试', async () => {
      const test = await vocabularyService.generateDiagnosticTest(testUserId);
      
      expect(test).toBeDefined();
      expect(test.totalQuestions).toBe(200);
      expect(test.questions).toHaveLength(200);
      expect(test.estimatedTime).toBe(15);
    });

    test('测试题目应该包含5种题型', async () => {
      const test = await vocabularyService.generateDiagnosticTest(testUserId);
      
      const types = new Set(test.questions.map(q => q.type));
      expect(types).toContain('recognition');
      expect(types).toContain('spelling');
      expect(types).toContain('listening');
      expect(types).toContain('synonym');
      expect(types).toContain('antonym');
    });

    test('测试题目应该包含5个等级', async () => {
      const test = await vocabularyService.generateDiagnosticTest(testUserId);
      
      const levels = new Set(test.questions.map(q => q.level));
      expect(levels).toContain('level0');
      expect(levels).toContain('level1');
      expect(levels).toContain('level2');
      expect(levels).toContain('level3');
      expect(levels).toContain('level4');
    });
  });

  describe('测试结果提交', () => {
    test('应该正确计算得分和生成报告', async () => {
      // 模拟答案
      const answers = Array(200).fill(null).map((_, i) => ({
        wordId: `word_${i}`,
        word: `test_word_${i}`,
        level: `level${Math.floor(i / 40)}`,
        type: 'recognition',
        userAnswer: i % 2 === 0 ? 'correct' : 'wrong',
        correctAnswer: 'correct',
        responseTime: 5000
      }));

      const report = await vocabularyService.submitTestResults(
        testUserId,
        'test_001',
        answers
      );

      expect(report).toBeDefined();
      expect(report.totalWords).toBe(200);
      expect(report.correctWords).toBe(100); // 50%正确率
      expect(report.accuracy).toBe(50);
      expect(report.estimatedVocabulary).toBeGreaterThan(0);
      expect(report.levelDistribution).toBeDefined();
      expect(report.weakAreas).toBeDefined();
      expect(report.recommendations).toBeDefined();
    });

    test('应该识别薄弱环节', async () => {
      // 模拟低正确率的答案
      const answers = Array(200).fill(null).map((_, i) => ({
        wordId: `word_${i}`,
        word: `test_word_${i}`,
        level: i < 40 ? 'level0' : `level${Math.floor(i / 40)}`,
        type: 'recognition',
        userAnswer: i < 30 ? 'correct' : 'wrong', // level0只有30%正确率
        correctAnswer: 'correct',
        responseTime: 5000
      }));

      const report = await vocabularyService.submitTestResults(
        testUserId,
        'test_002',
        answers
      );

      const level0Weak = report.weakAreas.find(w => w.level === 'level0');
      expect(level0Weak).toBeDefined();
      expect(level0Weak.accuracy).toBeLessThan(50);
    });
  });

  describe('艾宾浩斯遗忘曲线', () => {
    test('应该正确计算下次复习时间', () => {
      const userWord = {
        reviewCount: 0,
        mastery: 50
      };
      
      const nextReview = vocabularyService.calculateNextReview(userWord);
      const now = new Date();
      const diff = nextReview - now;
      
      // 第一次复习应该在20分钟左右
      expect(diff).toBeGreaterThan(19 * 60 * 1000);
      expect(diff).toBeLessThan(21 * 60 * 1000);
    });

    test('掌握度高的单词应该有更长的复习间隔', () => {
      const lowMastery = { reviewCount: 2, mastery: 30 };
      const highMastery = { reviewCount: 2, mastery: 90 };
      
      const lowInterval = vocabularyService.calculateNextReview(lowMastery) - new Date();
      const highInterval = vocabularyService.calculateNextReview(highMastery) - new Date();
      
      expect(highInterval).toBeGreaterThan(lowInterval);
    });
  });

  describe('词汇量预估', () => {
    test('应该根据各级别正确率估算词汇量', () => {
      const levelStats = {
        level0: { known: 35, total: 40 }, // 87.5%
        level1: { known: 30, total: 40 }, // 75%
        level2: { known: 20, total: 30 }, // 66.7%
        level3: { known: 10, total: 30 }, // 33.3%
        level4: { known: 5, total: 10 },  // 50%
        level5: { known: 0, total: 0 }
      };

      const estimated = vocabularyService.estimateVocabulary(levelStats);
      
      // 预估词汇量应该在5000-8000之间
      expect(estimated).toBeGreaterThan(5000);
      expect(estimated).toBeLessThan(8000);
    });

    test('全部掌握应该预估接近10000', () => {
      const levelStats = {
        level0: { known: 40, total: 40 },
        level1: { known: 40, total: 40 },
        level2: { known: 30, total: 30 },
        level3: { known: 30, total: 30 },
        level4: { known: 10, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const estimated = vocabularyService.estimateVocabulary(levelStats);
      expect(estimated).toBeGreaterThan(9000);
    });
  });

  describe('学习建议生成', () => {
    test('词汇量低于5000应该建议先补基础', () => {
      const levelStats = {
        level0: { known: 20, total: 40 },
        level1: { known: 10, total: 40 },
        level2: { known: 5, total: 30 },
        level3: { known: 0, total: 30 },
        level4: { known: 0, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const recommendations = vocabularyService.generateRecommendations(levelStats, 4000);
      
      const basicRecommendation = recommendations.find(r => 
        r.title.includes('基础') || r.title.includes('四级')
      );
      expect(basicRecommendation).toBeDefined();
      expect(basicRecommendation.priority).toBe('high');
    });

    test('学科词汇薄弱应该给出相应建议', () => {
      const levelStats = {
        level0: { known: 35, total: 40 },
        level1: { known: 35, total: 40 },
        level2: { known: 25, total: 30 },
        level3: { known: 20, total: 30 },
        level4: { known: 2, total: 10 }, // 学科词汇薄弱
        level5: { known: 0, total: 0 }
      };

      const recommendations = vocabularyService.generateRecommendations(levelStats, 7000);
      
      const subjectRecommendation = recommendations.find(r => 
        r.title.includes('学科')
      );
      expect(subjectRecommendation).toBeDefined();
    });
  });

  describe('用户单词记录更新', () => {
    test('答对应该增加掌握度和连续正确次数', async () => {
      const wordId = 'test_word_001';
      
      await vocabularyService.updateUserWord(testUserId, wordId, true, 'recognition');
      
      const userWord = await UserWord.findOne({ userId: testUserId, wordId });
      expect(userWord).toBeDefined();
      expect(userWord.correctCount).toBe(1);
      expect(userWord.streak).toBe(1);
      expect(userWord.mastery).toBeGreaterThan(0);
    });

    test('答错应该重置连续正确次数', async () => {
      const wordId = 'test_word_002';
      
      // 先答对一次
      await vocabularyService.updateUserWord(testUserId, wordId, true, 'recognition');
      // 再答错
      await vocabularyService.updateUserWord(testUserId, wordId, false, 'spelling');
      
      const userWord = await UserWord.findOne({ userId: testUserId, wordId });
      expect(userWord.streak).toBe(0);
    });

    test('掌握度达到90%应该标记为mastered', async () => {
      const wordId = 'test_word_003';
      
      // 连续答对多次
      for (let i = 0; i < 10; i++) {
        await vocabularyService.updateUserWord(testUserId, wordId, true, 'recognition');
      }
      
      const userWord = await UserWord.findOne({ userId: testUserId, wordId });
      expect(userWord.status).toBe('mastered');
    });
  });
});

describe('API路由测试', () => {
  const request = require('supertest');
  const app = require('../src/index');

  describe('词汇API', () => {
    test('POST /api/vocabulary/diagnostic-test 应该返回测试', async () => {
      const response = await request(app)
        .post('/api/vocabulary/diagnostic-test')
        .send({ userId: 'test_user' });
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.totalQuestions).toBe(200);
    });

    test('GET /api/vocabulary/today-tasks/:userId 应该返回今日任务', async () => {
      const response = await request(app)
        .get('/api/vocabulary/today-tasks/test_user');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });

  describe('阅读API', () => {
    test('GET /api/reading/articles 应该返回文章列表', async () => {
      const response = await request(app)
        .get('/api/reading/articles');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.articles).toBeDefined();
      expect(response.body.data.articles.length).toBeGreaterThan(0);
    });

    test('GET /api/reading/article/:id 应该返回单篇文章', async () => {
      const response = await request(app)
        .get('/api/reading/article/article_001');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.content).toBeDefined();
    });
  });

  describe('学习计划API', () => {
    test('GET /api/study-plan/templates 应该返回计划模板', async () => {
      const response = await request(app)
        .get('/api/study-plan/templates');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    test('GET /api/study-plan/today/:userId 应该返回今日任务', async () => {
      const response = await request(app)
        .get('/api/study-plan/today/test_user');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.tasks).toBeDefined();
      expect(response.body.data.tasks.length).toBeGreaterThan(0);
    });
  });
});

// 运行测试
console.log('🦞 开始运行托福AI教练系统测试...');
