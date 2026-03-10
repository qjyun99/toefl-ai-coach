const express = require('express');
const router = express.Router();

// 模拟阅读文章数据库
const readingArticles = [
  {
    id: 'article_001',
    title: 'The History of Chocolate',
    level: 'level1',
    wordCount: 350,
    content: `Chocolate has a long and fascinating history that dates back thousands of years. The ancient Mesoamerican cultures, including the Mayans and Aztecs, were among the first to cultivate cacao trees and use the beans to make a bitter drink. They believed that cacao was a gift from the gods and used it in religious ceremonies.

The Spanish conquistadors who arrived in the Americas in the 16th century were introduced to chocolate by the Aztecs. They brought cacao beans back to Europe, where sugar and other ingredients were added to create the sweet chocolate we know today. The drink became popular among the European aristocracy.

In the 19th century, advances in technology led to the development of solid chocolate and mass production techniques. This made chocolate more affordable and accessible to the general public. Today, chocolate is enjoyed by people all over the world and is a multi-billion dollar industry.

Despite its popularity, chocolate production has faced criticism for issues such as child labor in cacao farms and environmental concerns. Many companies are now working to address these problems through fair trade practices and sustainable farming methods.`,
    questions: [
      {
        id: 'q1',
        type: 'fact',
        question: 'Which ancient cultures were among the first to use cacao?',
        options: ['Romans and Greeks', 'Mayans and Aztecs', 'Egyptians and Persians', 'Chinese and Japanese'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        type: 'inference',
        question: 'What can be inferred about chocolate in Europe before the 16th century?',
        options: ['It was widely available', 'It was unknown', 'It was very expensive', 'It was used as medicine'],
        correctAnswer: 1
      },
      {
        id: 'q3',
        type: 'vocabulary',
        question: 'The word "cultivate" in paragraph 1 is closest in meaning to:',
        options: ['destroy', 'grow', 'trade', 'eat'],
        correctAnswer: 1
      }
    ],
    vocabulary: ['cultivate', 'conquistadors', 'aristocracy', 'accessible', 'sustainable'],
    timeLimit: 12 // 分钟
  },
  {
    id: 'article_002',
    title: 'The Water Cycle',
    level: 'level2',
    wordCount: 400,
    content: `The water cycle, also known as the hydrologic cycle, is the continuous movement of water on, above, and below the surface of the Earth. This complex system involves several key processes that work together to recycle water throughout the planet.

Evaporation is the process by which water changes from a liquid to a gas or vapor. Heat from the sun causes water in oceans, rivers, and lakes to evaporate and rise into the atmosphere. Plants also contribute to this process through transpiration, releasing water vapor from their leaves.

As water vapor rises, it cools and condenses to form clouds. This process is called condensation. When water droplets in clouds become too heavy, they fall back to Earth as precipitation in the form of rain, snow, sleet, or hail.

Once precipitation reaches the ground, it can take several paths. Some water flows across the surface as runoff, eventually reaching rivers, lakes, and oceans. Some water seeps into the ground through infiltration, becoming groundwater that can be stored in aquifers for thousands of years.

The water cycle is essential for life on Earth. It distributes fresh water to all parts of the planet, supports agriculture, and helps regulate global temperatures. Understanding this cycle is crucial for managing water resources and addressing challenges such as drought and flooding.`,
    questions: [
      {
        id: 'q1',
        type: 'fact',
        question: 'What is another name for the water cycle?',
        options: ['The carbon cycle', 'The hydrologic cycle', 'The nitrogen cycle', 'The oxygen cycle'],
        correctAnswer: 1
      },
      {
        id: 'q2',
        type: 'fact',
        question: 'What causes water to evaporate?',
        options: ['Wind', 'Gravity', 'Heat from the sun', 'Clouds'],
        correctAnswer: 2
      },
      {
        id: 'q3',
        type: 'inference',
        question: 'What can be inferred about groundwater from the passage?',
        options: ['It is not important', 'It can be stored for long periods', 'It is always polluted', 'It only exists in deserts'],
        correctAnswer: 1
      }
    ],
    vocabulary: ['hydrologic', 'evaporation', 'transpiration', 'condensation', 'precipitation', 'infiltration', 'aquifers'],
    timeLimit: 15
  }
];

// 获取阅读文章列表
router.get('/articles', (req, res) => {
  const { level, page = 1, limit = 10 } = req.query;
  
  let articles = readingArticles;
  if (level) {
    articles = articles.filter(a => a.level === level);
  }
  
  const start = (page - 1) * limit;
  const end = start + parseInt(limit);
  
  res.json({
    success: true,
    data: {
      articles: articles.slice(start, end).map(a => ({
        id: a.id,
        title: a.title,
        level: a.level,
        wordCount: a.wordCount,
        timeLimit: a.timeLimit,
        questionCount: a.questions.length
      })),
      total: articles.length,
      page: parseInt(page),
      totalPages: Math.ceil(articles.length / limit)
    }
  });
});

// 获取单篇文章
router.get('/article/:id', (req, res) => {
  const { id } = req.params;
  const article = readingArticles.find(a => a.id === id);
  
  if (!article) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }
  
  res.json({
    success: true,
    data: {
      id: article.id,
      title: article.title,
      level: article.level,
      content: article.content,
      wordCount: article.wordCount,
      timeLimit: article.timeLimit,
      vocabulary: article.vocabulary
    }
  });
});

// 提交阅读答案
router.post('/submit/:id', (req, res) => {
  const { id } = req.params;
  const { answers, timeSpent } = req.body;
  
  const article = readingArticles.find(a => a.id === id);
  if (!article) {
    return res.status(404).json({
      success: false,
      error: '文章不存在'
    });
  }
  
  // 计算得分
  let correctCount = 0;
  const results = article.questions.map((q, index) => {
    const userAnswer = answers[index];
    const isCorrect = userAnswer === q.correctAnswer;
    if (isCorrect) correctCount++;
    
    return {
      questionId: q.id,
      question: q.question,
      userAnswer,
      correctAnswer: q.correctAnswer,
      isCorrect,
      explanation: isCorrect ? '' : `正确答案是: ${q.options[q.correctAnswer]}`
    };
  });
  
  const score = Math.round((correctCount / article.questions.length) * 100);
  
  res.json({
    success: true,
    data: {
      articleId: id,
      totalQuestions: article.questions.length,
      correctCount,
      score,
      timeSpent,
      results,
      vocabulary: article.vocabulary,
      suggestions: generateReadingSuggestions(score, timeSpent, article.timeLimit)
    }
  });
});

// 生成学习建议
function generateReadingSuggestions(score, timeSpent, timeLimit) {
  const suggestions = [];
  
  if (score < 60) {
    suggestions.push({
      type: 'warning',
      message: '正确率较低，建议先学习文章中的生词，再重新阅读'
    });
  }
  
  if (timeSpent > timeLimit * 60) {
    suggestions.push({
      type: 'tip',
      message: '阅读速度偏慢，建议多练习限时阅读，提高阅读速度'
    });
  }
  
  if (score >= 80 && timeSpent <= timeLimit * 45) {
    suggestions.push({
      type: 'success',
      message: '表现优秀！可以尝试更高难度的文章'
    });
  }
  
  return suggestions;
}

module.exports = router;
