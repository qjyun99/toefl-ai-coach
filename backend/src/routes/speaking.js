const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// 口语题目数据库
const speakingTasks = {
  independent: [
    {
      id: 'ind_001',
      type: 'task1',
      question: 'Describe a place you have visited that was very interesting. Explain why you found it interesting.',
      preparationTime: 15,
      responseTime: 45,
      tips: ['Use specific details', 'Explain your feelings', 'Give examples'],
      sampleAnswer: 'One of the most interesting places I have visited is the ancient city of Kyoto in Japan...'
    },
    {
      id: 'ind_002',
      type: 'task2',
      question: 'Some people prefer to study alone, while others prefer to study in a group. Which do you prefer and why?',
      preparationTime: 15,
      responseTime: 45,
      tips: ['Choose one side clearly', 'Give specific reasons', 'Provide examples'],
      sampleAnswer: 'I prefer to study alone because it allows me to focus better and manage my time more efficiently...'
    }
  ],
  integrated: [
    {
      id: 'int_003',
      type: 'task3',
      reading: 'The university has announced a new policy that requires all students to complete an internship before graduation. This policy aims to provide students with practical work experience and better prepare them for their future careers.',
      listening: 'The student in the conversation disagrees with this policy. She argues that many students already have part-time jobs or family responsibilities that make it difficult to complete an internship. She also mentions that some majors, such as theoretical mathematics, may not have relevant internship opportunities available.',
      question: 'The woman expresses her opinion about the university\'s new policy. State her opinion and explain the reasons she gives for holding that opinion.',
      preparationTime: 30,
      responseTime: 60,
      tips: ['Summarize the reading', 'Explain the listening', 'Connect them clearly']
    }
  ],
  shadowing: [
    {
      id: 'sha_001',
      title: 'TOEFL Speaking Sample',
      audioUrl: '/audio/sha_001.mp3',
      transcript: 'I believe that technology has greatly improved our lives in many ways. First of all...',
      difficulty: 'medium'
    }
  ]
};

// 获取口语题目
router.get('/task/:type', (req, res) => {
  const { type } = req.params;
  const tasks = speakingTasks[type] || [];
  
  if (tasks.length === 0) {
    return res.status(404).json({
      success: false,
      error: '题目类型不存在'
    });
  }
  
  // 随机返回一道题
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  
  res.json({
    success: true,
    data: task
  });
});

// AI评分口语
router.post('/evaluate', async (req, res) => {
  try {
    const { taskId, transcript, audioUrl } = req.body;
    
    // 使用OpenAI评估口语
    const prompt = `
You are a TOEFL speaking evaluator. Please evaluate the following speaking response based on TOEFL scoring criteria (0-30 points).

Task ID: ${taskId}
Student Response: ${transcript}

Please evaluate based on these criteria:
1. Delivery (fluency, pronunciation, intonation) - 0-10 points
2. Language Use (grammar, vocabulary, sentence structure) - 0-10 points
3. Topic Development (organization, coherence, completeness) - 0-10 points

Provide:
- Total score (0-30)
- Breakdown by criteria
- Specific feedback on strengths
- Specific suggestions for improvement
- Sample high-scoring response

Format your response as JSON:
{
  "totalScore": number,
  "breakdown": {
    "delivery": number,
    "languageUse": number,
    "topicDevelopment": number
  },
  "strengths": [string],
  "weaknesses": [string],
  "suggestions": [string],
  "sampleResponse": string
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert TOEFL speaking evaluator.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7
    });
    
    const evaluation = JSON.parse(completion.choices[0].message.content);
    
    res.json({
      success: true,
      data: evaluation
    });
  } catch (error) {
    console.error('口语评估失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 获取跟读材料
router.get('/shadowing', (req, res) => {
  const { difficulty = 'medium' } = req.query;
  const materials = speakingTasks.shadowing.filter(s => s.difficulty === difficulty);
  
  res.json({
    success: true,
    data: materials
  });
});

// AI对话练习
router.post('/chat', async (req, res) => {
  try {
    const { message, context = [] } = req.body;
    
    const systemPrompt = `You are a friendly TOEFL speaking coach. Help the student practice English conversation and improve their speaking skills. 

Guidelines:
- Correct grammar mistakes gently
- Suggest better vocabulary when appropriate
- Encourage the student to speak more
- Ask follow-up questions to keep the conversation going
- Be supportive and encouraging

Current conversation context:
${context.map(c => `${c.role}: ${c.content}`).join('\n')}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: 0.8
    });
    
    const response = completion.choices[0].message.content;
    
    res.json({
      success: true,
      data: {
        response,
        corrections: extractCorrections(message, response),
        suggestions: extractSuggestions(response)
      }
    });
  } catch (error) {
    console.error('对话失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 提取纠正建议
function extractCorrections(userMessage, aiResponse) {
  // 简化实现，实际应该用更复杂的逻辑
  const corrections = [];
  
  // 检查常见错误
  if (userMessage.includes('I very like')) {
    corrections.push({
      error: 'I very like',
      correction: 'I like ... very much',
      explanation: 'In English, we don\'t use "very" before verbs. Use "very much" after the verb.'
    });
  }
  
  return corrections;
}

// 提取学习建议
function extractSuggestions(aiResponse) {
  const suggestions = [];
  
  if (aiResponse.includes('vocabulary')) {
    suggestions.push('Try to use more advanced vocabulary');
  }
  if (aiResponse.includes('grammar')) {
    suggestions.push('Pay attention to grammar accuracy');
  }
  
  return suggestions;
}

module.exports = router;
