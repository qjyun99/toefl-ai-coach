const mongoose = require('mongoose');

// 单词Schema
const wordSchema = new mongoose.Schema({
  word: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  phonetic: {
    type: String,
    default: ''
  },
  pronunciation: {
    type: String,  // 音频URL
    default: ''
  },
  meanings: [{
    pos: String,  // 词性: n./v./adj./adv.
    definition: String,
    chinese: String,
    examples: [{
      sentence: String,
      translation: String
    }]
  }],
  level: {
    type: String,
    enum: ['level0', 'level1', 'level2', 'level3', 'level4', 'level5'],
    required: true
  },
  category: {
    type: String,
    enum: ['basic', 'cet4', 'cet6', 'toefl', 'academic', 'subject'],
    required: true
  },
  subject: {
    type: String,
    enum: ['', 'astronomy', 'biology', 'geology', 'history', 'art', 'business', 'chemistry', 'physics'],
    default: ''
  },
  tags: [String],
  frequency: {
    type: Number,  // 在托福中出现频率
    default: 0
  },
  synonyms: [String],
  antonyms: [String],
  wordFamily: [{
    word: String,
    pos: String
  }],
  etymology: {
    type: String,  // 词源
    default: ''
  },
  memoryTip: {
    type: String,  // 记忆技巧
    default: ''
  },
  difficulty: {
    type: Number,  // 难度系数 1-5
    default: 3
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// 用户单词学习记录Schema
const userWordSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  wordId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Word',
    required: true
  },
  status: {
    type: String,
    enum: ['new', 'learning', 'reviewing', 'mastered', 'forgotten'],
    default: 'new'
  },
  mastery: {
    type: Number,  // 掌握度 0-100
    default: 0
  },
  testResults: [{
    type: {
      type: String,  // recognize, spell, listen, synonym, antonym, context
      required: true
    },
    correct: Boolean,
    responseTime: Number,  // 响应时间(毫秒)
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  reviewSchedule: [{
    reviewAt: Date,
    completed: Boolean
  }],
  nextReviewAt: {
    type: Date,
    default: Date.now
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  correctCount: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,  // 连续正确次数
    default: 0
  },
  lastStudiedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// 词汇测试记录Schema
const vocabularyTestSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  testType: {
    type: String,
    enum: ['diagnostic', 'level0', 'level1', 'level2', 'level3', 'level4', 'level5', 'daily'],
    required: true
  },
  results: [{
    wordId: mongoose.Schema.Types.ObjectId,
    word: String,
    testType: String,  // 测试类型
    correct: Boolean,
    responseTime: Number
  }],
  statistics: {
    totalWords: Number,
    correctWords: Number,
    accuracy: Number,
    estimatedVocabulary: Number,  // 预估词汇量
    levelDistribution: {
      level0: { known: Number, total: Number },
      level1: { known: Number, total: Number },
      level2: { known: Number, total: Number },
      level3: { known: Number, total: Number },
      level4: { known: Number, total: Number },
      level5: { known: Number, total: Number }
    }
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
});

// 索引
wordSchema.index({ level: 1, category: 1 });
wordSchema.index({ word: 'text' });
userWordSchema.index({ userId: 1, wordId: 1 }, { unique: true });
userWordSchema.index({ userId: 1, nextReviewAt: 1 });

const Word = mongoose.model('Word', wordSchema);
const UserWord = mongoose.model('UserWord', userWordSchema);
const VocabularyTest = mongoose.model('VocabularyTest', vocabularyTestSchema);

module.exports = {
  Word,
  UserWord,
  VocabularyTest
};
