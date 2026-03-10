const { Word, UserWord, VocabularyTest } = require('../models/Vocabulary');
const { OpenAI } = require('openai');

// 初始化OpenAI客户端（如果没有API Key则使用模拟模式）
const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

class VocabularyService {
  /**
   * 生成词汇诊断测试
   * @param {string} userId - 用户ID
   * @returns {Object} 测试题目
   */
  async generateDiagnosticTest(userId) {
    try {
      // 从各级别随机抽取单词
      const level0Words = await Word.aggregate([
        { $match: { level: 'level0' } },
        { $sample: { size: 40 } }
      ]);
      
      const level1Words = await Word.aggregate([
        { $match: { level: 'level1' } },
        { $sample: { size: 40 } }
      ]);
      
      const level2Words = await Word.aggregate([
        { $match: { level: 'level2' } },
        { $sample: { size: 30 } }
      ]);
      
      const level3Words = await Word.aggregate([
        { $match: { level: 'level3' } },
        { $sample: { size: 30 } }
      ]);
      
      const level4Words = await Word.aggregate([
        { $match: { level: 'level4' } },
        { $sample: { size: 10 } }
      ]);

      // 生成测试题目
      const questions = [];
      
      // Level 0: 看英文选中文（认识吗？）
      level0Words.slice(0, 20).forEach(word => {
        questions.push(this.createRecognitionQuestion(word, 'level0'));
      });
      
      // Level 0: 看中文写英文（会写吗？）
      level0Words.slice(20, 30).forEach(word => {
        questions.push(this.createSpellingQuestion(word, 'level0'));
      });
      
      // Level 1: 看英文选中文
      level1Words.slice(0, 20).forEach(word => {
        questions.push(this.createRecognitionQuestion(word, 'level1'));
      });
      
      // Level 1: 听发音选词义
      level1Words.slice(20, 30).forEach(word => {
        questions.push(this.createListeningQuestion(word, 'level1'));
      });
      
      // Level 2: 看英文选中文
      level2Words.slice(0, 20).forEach(word => {
        questions.push(this.createRecognitionQuestion(word, 'level2'));
      });
      
      // Level 2: 选同义词
      level2Words.slice(20, 30).forEach(word => {
        questions.push(this.createSynonymQuestion(word, 'level2'));
      });
      
      // Level 3: 看英文选中文
      level3Words.slice(0, 20).forEach(word => {
        questions.push(this.createRecognitionQuestion(word, 'level3'));
      });
      
      // Level 3: 选反义词
      level3Words.slice(20, 30).forEach(word => {
        questions.push(this.createAntonymQuestion(word, 'level3'));
      });
      
      // Level 4: 学科词汇
      level4Words.forEach(word => {
        questions.push(this.createRecognitionQuestion(word, 'level4'));
      });

      return {
        testId: `diagnostic_${Date.now()}`,
        totalQuestions: questions.length,
        estimatedTime: 15, // 分钟
        questions: questions
      };
    } catch (error) {
      console.error('生成诊断测试失败:', error);
      throw error;
    }
  }

  /**
   * 创建"看英文选中文"题目
   */
  createRecognitionQuestion(word, level) {
    return {
      wordId: word._id,
      word: word.word,
      phonetic: word.phonetic,
      pronunciation: word.pronunciation,
      type: 'recognition',
      level: level,
      question: `请选择 "${word.word}" 的中文意思`,
      options: this.generateOptions(word, 'chinese'),
      correctAnswer: word.meanings[0]?.chinese || ''
    };
  }

  /**
   * 创建"看中文写英文"题目
   */
  createSpellingQuestion(word, level) {
    return {
      wordId: word._id,
      word: word.word,
      type: 'spelling',
      level: level,
      question: `请写出 "${word.meanings[0]?.chinese || ''}" 的英文单词`,
      hint: `首字母: ${word.word[0]}, 长度: ${word.word.length}`,
      correctAnswer: word.word
    };
  }

  /**
   * 创建"听发音选词义"题目
   */
  createListeningQuestion(word, level) {
    return {
      wordId: word._id,
      word: word.word,
      pronunciation: word.pronunciation,
      type: 'listening',
      level: level,
      question: '请听发音，选择正确的词义',
      options: this.generateOptions(word, 'chinese'),
      correctAnswer: word.meanings[0]?.chinese || ''
    };
  }

  /**
   * 创建"选同义词"题目
   */
  createSynonymQuestion(word, level) {
    return {
      wordId: word._id,
      word: word.word,
      type: 'synonym',
      level: level,
      question: `请选择 "${word.word}" 的同义词`,
      options: word.synonyms.slice(0, 4).length > 0 
        ? [...word.synonyms.slice(0, 4), word.word].sort(() => Math.random() - 0.5)
        : this.generateOptions(word, 'synonym'),
      correctAnswer: word.synonyms[0] || word.word
    };
  }

  /**
   * 创建"选反义词"题目
   */
  createAntonymQuestion(word, level) {
    return {
      wordId: word._id,
      word: word.word,
      type: 'antonym',
      level: level,
      question: `请选择 "${word.word}" 的反义词`,
      options: word.antonyms.slice(0, 4).length > 0
        ? [...word.antonyms.slice(0, 4), word.word].sort(() => Math.random() - 0.5)
        : this.generateOptions(word, 'antonym'),
      correctAnswer: word.antonyms[0] || ''
    };
  }

  /**
   * 生成干扰选项
   */
  async generateOptions(word, type) {
    // 从同级别的其他单词中随机选择
    const otherWords = await Word.aggregate([
      { 
        $match: { 
          level: word.level,
          _id: { $ne: word._id }
        } 
      },
      { $sample: { size: 3 } }
    ]);

    if (type === 'chinese') {
      const options = otherWords.map(w => w.meanings[0]?.chinese || '');
      options.push(word.meanings[0]?.chinese || '');
      return options.sort(() => Math.random() - 0.5);
    }
    
    return otherWords.map(w => w.word);
  }

  /**
   * 提交测试结果并生成报告
   */
  async submitTestResults(userId, testId, answers) {
    try {
      let correctCount = 0;
      const results = [];
      const levelStats = {
        level0: { known: 0, total: 0 },
        level1: { known: 0, total: 0 },
        level2: { known: 0, total: 0 },
        level3: { known: 0, total: 0 },
        level4: { known: 0, total: 0 },
        level5: { known: 0, total: 0 }
      };

      // 统计各等级正确率
      for (const answer of answers) {
        const isCorrect = answer.userAnswer === answer.correctAnswer;
        if (isCorrect) correctCount++;
        
        levelStats[answer.level].total++;
        if (isCorrect) levelStats[answer.level].known++;

        results.push({
          wordId: answer.wordId,
          word: answer.word,
          testType: answer.type,
          correct: isCorrect,
          responseTime: answer.responseTime || 0
        });

        // 更新用户单词学习记录
        await this.updateUserWord(userId, answer.wordId, isCorrect, answer.type);
      }

      // 计算预估词汇量
      const estimatedVocabulary = this.estimateVocabulary(levelStats);

      // 生成报告
      const report = {
        totalWords: answers.length,
        correctWords: correctCount,
        accuracy: Math.round((correctCount / answers.length) * 100),
        estimatedVocabulary: estimatedVocabulary,
        levelDistribution: levelStats,
        weakAreas: this.identifyWeakAreas(levelStats),
        recommendations: this.generateRecommendations(levelStats, estimatedVocabulary)
      };

      // 保存测试记录
      await VocabularyTest.create({
        userId,
        testType: 'diagnostic',
        results,
        statistics: report
      });

      return report;
    } catch (error) {
      console.error('提交测试结果失败:', error);
      throw error;
    }
  }

  /**
   * 更新用户单词学习记录
   */
  async updateUserWord(userId, wordId, isCorrect, testType) {
    try {
      let userWord = await UserWord.findOne({ userId, wordId });
      
      if (!userWord) {
        userWord = new UserWord({
          userId,
          wordId,
          status: 'learning'
        });
      }

      // 更新测试记录
      userWord.testResults.push({
        type: testType,
        correct: isCorrect,
        timestamp: new Date()
      });

      // 更新掌握度
      if (isCorrect) {
        userWord.correctCount++;
        userWord.streak++;
        userWord.mastery = Math.min(100, userWord.mastery + 10);
      } else {
        userWord.streak = 0;
        userWord.mastery = Math.max(0, userWord.mastery - 5);
      }

      userWord.reviewCount++;
      userWord.lastStudiedAt = new Date();

      // 根据掌握度更新状态
      if (userWord.mastery >= 90) {
        userWord.status = 'mastered';
      } else if (userWord.mastery >= 60) {
        userWord.status = 'reviewing';
      } else if (userWord.mastery < 30 && userWord.reviewCount > 3) {
        userWord.status = 'forgotten';
      }

      // 计算下次复习时间（艾宾浩斯遗忘曲线）
      userWord.nextReviewAt = this.calculateNextReview(userWord);

      await userWord.save();
    } catch (error) {
      console.error('更新用户单词记录失败:', error);
      throw error;
    }
  }

  /**
   * 计算下次复习时间（艾宾浩斯遗忘曲线）
   */
  calculateNextReview(userWord) {
    const intervals = [20 * 60 * 1000, 60 * 60 * 1000, 9 * 60 * 60 * 1000, 
                       24 * 60 * 60 * 1000, 2 * 24 * 60 * 60 * 1000, 
                       6 * 24 * 60 * 60 * 1000, 31 * 24 * 60 * 60 * 1000];
    
    const reviewCount = Math.min(userWord.reviewCount, intervals.length - 1);
    const interval = intervals[reviewCount];
    
    // 根据掌握度调整间隔
    const masteryFactor = userWord.mastery / 100;
    const adjustedInterval = interval * (0.8 + masteryFactor * 0.4);
    
    return new Date(Date.now() + adjustedInterval);
  }

  /**
   * 预估词汇量
   */
  estimateVocabulary(levelStats) {
    const levelVocabularies = {
      level0: 5000,  // 四级词汇
      level1: 6000,  // 六级词汇
      level2: 8000,  // 托福基础
      level3: 10000, // 托福核心
      level4: 12000, // 学科词汇
      level5: 15000  // 高级词汇
    };

    let estimated = 0;
    let totalWeight = 0;

    for (const [level, stats] of Object.entries(levelStats)) {
      if (stats.total > 0) {
        const accuracy = stats.known / stats.total;
        // 使用正确率作为权重，加权平均
        estimated += levelVocabularies[level] * accuracy;
        totalWeight += 1;
      }
    }

    // 加权平均
    if (totalWeight > 0) {
      estimated = estimated / totalWeight;
    }

    return Math.round(estimated);
  }

  /**
   * 识别薄弱环节
   */
  identifyWeakAreas(levelStats) {
    const weakAreas = [];
    
    for (const [level, stats] of Object.entries(levelStats)) {
      if (stats.total > 0) {
        const accuracy = Math.round((stats.known / stats.total) * 100) / 100; // 保留2位小数
        if (accuracy < 0.5) {
          weakAreas.push({
            level,
            accuracy: Math.round(accuracy * 100),
            description: this.getLevelDescription(level)
          });
        }
      }
    }

    return weakAreas.sort((a, b) => a.accuracy - b.accuracy);
  }

  /**
   * 获取等级描述
   */
  getLevelDescription(level) {
    const descriptions = {
      level0: '基础词汇（初中/高中/四级）',
      level1: '四级核心词汇',
      level2: '六级/托福基础词汇',
      level3: '托福核心词汇',
      level4: '学科词汇',
      level5: '高级词汇'
    };
    return descriptions[level] || level;
  }

  /**
   * 生成学习建议
   */
  generateRecommendations(levelStats, estimatedVocabulary) {
    const recommendations = [];

    if (estimatedVocabulary < 5000) {
      recommendations.push({
        priority: 'high',
        title: '优先补齐基础词汇',
        description: '你的词汇量还需要加强基础，建议先花1-2个月集中学习四级词汇。',
        action: '每天学习50个基础词汇，重点记忆高频词。'
      });
    }

    if (levelStats.level0.accuracy < 0.7) {
      recommendations.push({
        priority: 'high',
        title: '四级词汇掌握不牢',
        description: `四级词汇正确率仅${Math.round(levelStats.level0.accuracy * 100)}%，需要重点复习。`,
        action: '每天复习30个四级词汇，使用拼写和听写模式加强记忆。'
      });
    }

    if (levelStats.level4.known < 5) {
      recommendations.push({
        priority: 'medium',
        title: '学科词汇薄弱',
        description: '托福阅读涉及大量学科词汇，需要提前准备。',
        action: '从生物和天文词汇开始，每天学习10个学科词汇。'
      });
    }

    recommendations.push({
      priority: 'low',
      title: '坚持每日学习',
      description: '词汇学习需要长期积累，建议每天学习15-20个新词。',
      action: '设置每日提醒，保持学习习惯。'
    });

    return recommendations;
  }

  /**
   * 获取今日学习任务
   */
  async getTodayTasks(userId) {
    try {
      // 获取需要复习的单词
      const reviewWords = await UserWord.find({
        userId,
        nextReviewAt: { $lte: new Date() },
        status: { $in: ['learning', 'reviewing'] }
      }).limit(15).populate('wordId');

      // 获取新词（根据用户水平）
      const userLevel = await this.getUserLevel(userId);
      const newWords = await Word.aggregate([
        {
          $match: {
            level: userLevel,
            _id: {
              $nin: await UserWord.find({ userId }).distinct('wordId')
            }
          }
        },
        { $sample: { size: 20 - reviewWords.length } }
      ]);

      return {
        reviewCount: reviewWords.length,
        newCount: newWords.length,
        reviewWords: reviewWords.map(uw => ({
          wordId: uw.wordId._id,
          word: uw.wordId.word,
          phonetic: uw.wordId.phonetic,
          mastery: uw.mastery,
          status: uw.status
        })),
        newWords: newWords.map(w => ({
          wordId: w._id,
          word: w.word,
          phonetic: w.phonetic,
          meanings: w.meanings
        }))
      };
    } catch (error) {
      console.error('获取今日任务失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户当前词汇水平
   */
  async getUserLevel(userId) {
    const stats = await UserWord.aggregate([
      { $match: { userId: mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const mastered = stats.find(s => s._id === 'mastered')?.count || 0;
    
    if (mastered < 1000) return 'level0';
    if (mastered < 2000) return 'level1';
    if (mastered < 3500) return 'level2';
    if (mastered < 5000) return 'level3';
    if (mastered < 6500) return 'level4';
    return 'level5';
  }
}

module.exports = new VocabularyService();
