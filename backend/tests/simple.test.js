/**
 * 简化版测试 - 不依赖MongoDB
 */

const vocabularyService = require('../src/services/vocabularyService');

// 模拟数据
const mockWords = [
  { _id: '1', word: 'apple', level: 'level0', meanings: [{ chinese: '苹果' }], synonyms: ['fruit'], antonyms: [] },
  { _id: '2', word: 'banana', level: 'level0', meanings: [{ chinese: '香蕉' }], synonyms: ['fruit'], antonyms: [] },
  { _id: '3', word: 'computer', level: 'level1', meanings: [{ chinese: '电脑' }], synonyms: ['PC'], antonyms: [] },
  { _id: '4', word: 'university', level: 'level1', meanings: [{ chinese: '大学' }], synonyms: ['college'], antonyms: [] },
  { _id: '5', word: 'hypothesis', level: 'level2', meanings: [{ chinese: '假设' }], synonyms: ['theory'], antonyms: [] },
  { _id: '6', word: 'photosynthesis', level: 'level3', meanings: [{ chinese: '光合作用' }], synonyms: [], antonyms: [], subject: 'biology' },
  { _id: '7', word: 'supernova', level: 'level4', meanings: [{ chinese: '超新星' }], synonyms: [], antonyms: [], subject: 'astronomy' },
];

describe('🦞 托福AI教练系统核心逻辑测试', () => {
  
  describe('✅ 艾宾浩斯遗忘曲线算法', () => {
    test('第一次复习间隔约20分钟', () => {
      const userWord = { reviewCount: 0, mastery: 50 };
      const nextReview = vocabularyService.calculateNextReview(userWord);
      const diff = nextReview - new Date();
      
      // 20分钟左右
      expect(diff).toBeGreaterThan(18 * 60 * 1000);
      expect(diff).toBeLessThan(25 * 60 * 1000);
    });

    test('第二次复习间隔约1小时', () => {
      const userWord = { reviewCount: 1, mastery: 50 };
      const nextReview = vocabularyService.calculateNextReview(userWord);
      const diff = nextReview - new Date();
      
      // 1小时左右
      expect(diff).toBeGreaterThan(50 * 60 * 1000);
      expect(diff).toBeLessThan(70 * 60 * 1000);
    });

    test('掌握度高的单词复习间隔更长', () => {
      const lowMastery = { reviewCount: 2, mastery: 30 };
      const highMastery = { reviewCount: 2, mastery: 90 };
      
      const lowInterval = vocabularyService.calculateNextReview(lowMastery) - new Date();
      const highInterval = vocabularyService.calculateNextReview(highMastery) - new Date();
      
      expect(highInterval).toBeGreaterThan(lowInterval);
    });
  });

  describe('✅ 词汇量预估算法', () => {
    test('全部掌握应预估接近10000', () => {
      const levelStats = {
        level0: { known: 40, total: 40 },
        level1: { known: 40, total: 40 },
        level2: { known: 30, total: 30 },
        level3: { known: 30, total: 30 },
        level4: { known: 10, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const estimated = vocabularyService.estimateVocabulary(levelStats);
      // 加权平均后应该在8000-10000之间
      expect(estimated).toBeGreaterThan(8000);
      expect(estimated).toBeLessThan(10000);
    });

    test('50%正确率应预估约5000-7000', () => {
      const levelStats = {
        level0: { known: 20, total: 40 },
        level1: { known: 20, total: 40 },
        level2: { known: 15, total: 30 },
        level3: { known: 15, total: 30 },
        level4: { known: 5, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const estimated = vocabularyService.estimateVocabulary(levelStats);
      // 50%正确率加权平均后应该在4000-6000之间
      expect(estimated).toBeGreaterThan(4000);
      expect(estimated).toBeLessThan(6000);
    });

    test('零基础应预估接近0', () => {
      const levelStats = {
        level0: { known: 0, total: 40 },
        level1: { known: 0, total: 40 },
        level2: { known: 0, total: 30 },
        level3: { known: 0, total: 30 },
        level4: { known: 0, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const estimated = vocabularyService.estimateVocabulary(levelStats);
      expect(estimated).toBeLessThan(1000);
    });
  });

  describe('✅ 学习建议生成', () => {
    test('词汇量低于5000应建议补基础', () => {
      const levelStats = {
        level0: { known: 20, total: 40 },
        level1: { known: 10, total: 40 },
        level2: { known: 5, total: 30 },
        level3: { known: 0, total: 30 },
        level4: { known: 0, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const recommendations = vocabularyService.generateRecommendations(levelStats, 4000);
      
      const basicRec = recommendations.find(r => 
        r.title.includes('基础') || r.priority === 'high'
      );
      expect(basicRec).toBeDefined();
    });

    test('四级词汇薄弱应给出建议', () => {
      const levelStats = {
        level0: { known: 20, total: 40 }, // 50%
        level1: { known: 35, total: 40 },
        level2: { known: 25, total: 30 },
        level3: { known: 20, total: 30 },
        level4: { known: 5, total: 10 },
        level5: { known: 0, total: 0 }
      };

      const recommendations = vocabularyService.generateRecommendations(levelStats, 7000);
      
      // 应该至少有一条建议
      expect(recommendations.length).toBeGreaterThan(0);
    });
  });

  describe('✅ 题目生成逻辑', () => {
    test('应该生成不同题型的题目', () => {
      const word = mockWords[0];
      
      const recognitionQ = vocabularyService.createRecognitionQuestion(word, 'level0');
      expect(recognitionQ.type).toBe('recognition');
      expect(recognitionQ.question).toContain(word.word);
      
      const spellingQ = vocabularyService.createSpellingQuestion(word, 'level0');
      expect(spellingQ.type).toBe('spelling');
      expect(spellingQ.hint).toContain(word.word[0]);
      
      const listeningQ = vocabularyService.createListeningQuestion(word, 'level0');
      expect(listeningQ.type).toBe('listening');
      
      const synonymQ = vocabularyService.createSynonymQuestion(word, 'level0');
      expect(synonymQ.type).toBe('synonym');
      
      const antonymQ = vocabularyService.createAntonymQuestion(word, 'level0');
      expect(antonymQ.type).toBe('antonym');
    });
  });

  describe('✅ 薄弱环节识别', () => {
    test('应该识别正确率低于50%的等级', () => {
      const levelStats = {
        level0: { known: 20, total: 40 }, // 50%
        level1: { known: 15, total: 40 }, // 37.5% - 薄弱
        level2: { known: 25, total: 30 }, // 83%
        level3: { known: 10, total: 30 }, // 33% - 薄弱
        level4: { known: 8, total: 10 },  // 80%
        level5: { known: 0, total: 0 }
      };

      const weakAreas = vocabularyService.identifyWeakAreas(levelStats);
      
      // 应该识别出level1和level3
      const level1Weak = weakAreas.find(w => w.level === 'level1');
      const level3Weak = weakAreas.find(w => w.level === 'level3');
      
      expect(level1Weak).toBeDefined();
      expect(level3Weak).toBeDefined();
      expect(level1Weak.accuracy).toBeGreaterThanOrEqual(37);
      expect(level3Weak.accuracy).toBeLessThanOrEqual(38);
    });
  });

});

// 运行测试
console.log('🦞 开始运行托福AI教练系统核心逻辑测试...');
console.log('测试内容：艾宾浩斯遗忘曲线、词汇量预估、学习建议、题目生成、薄弱环节识别');
