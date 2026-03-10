const express = require('express');
const router = express.Router();
const { OpenAI } = require('openai');

const openai = process.env.OPENAI_API_KEY 
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

// 写作题目数据库
const writingTasks = {
  independent: [
    {
      id: 'ind_write_001',
      type: 'independent',
      question: 'Do you agree or disagree with the following statement? "It is better to work in a team than to work alone." Use specific reasons and examples to support your answer.',
      timeLimit: 30,
      wordCount: { min: 300, recommended: 350 },
      tips: [
        'Choose one side and stick to it',
        'Provide 2-3 specific reasons',
        'Use examples to support your points',
        'Write a clear introduction and conclusion'
      ],
      sampleOutline: {
        introduction: 'State your opinion clearly',
        body1: 'Reason 1 + Example',
        body2: 'Reason 2 + Example',
        body3: 'Reason 3 + Example (optional)',
        conclusion: 'Restate your opinion'
      }
    },
    {
      id: 'ind_write_002',
      type: 'independent',
      question: 'Some people think that the best way to reduce crime is to give criminals longer prison sentences. Others believe there are better alternatives. Discuss both views and give your opinion.',
      timeLimit: 30,
      wordCount: { min: 300, recommended: 350 },
      tips: [
        'Discuss both sides',
        'Give your clear opinion',
        'Support with examples'
      ]
    }
  ],
  integrated: [
    {
      id: 'int_write_001',
      type: 'integrated',
      reading: 'The reading passage discusses three theories about why the dinosaurs became extinct. The first theory suggests that climate change was the primary cause. The second theory proposes that volcanic activity led to their extinction. The third theory argues that an asteroid impact was responsible.',
      listening: 'The lecturer challenges the theories presented in the reading. First, she argues that climate change was too gradual to cause sudden extinction. Second, she points out that volcanic activity had occurred before without causing mass extinction. Third, she agrees with the asteroid theory but adds that it caused a "nuclear winter" effect that blocked sunlight for years.',
      question: 'Summarize the points made in the lecture, being sure to explain how they cast doubt on specific points made in the reading passage.',
      timeLimit: 20,
      wordCount: { min: 150, recommended: 200 },
      tips: [
        'Summarize the lecture points',
        'Explain the relationship to reading',
        'Use contrast words (however, but, whereas)'
      ]
    }
  ]
};

// 获取写作题目
router.get('/task/:type', (req, res) => {
  const { type } = req.params;
  const tasks = writingTasks[type] || [];
  
  if (tasks.length === 0) {
    return res.status(404).json({
      success: false,
      error: '题目类型不存在'
    });
  }
  
  const task = tasks[Math.floor(Math.random() * tasks.length)];
  
  res.json({
    success: true,
    data: task
  });
});

// AI批改作文
router.post('/evaluate', async (req, res) => {
  try {
    const { taskId, essay, taskType } = req.body;
    
    const prompt = `
You are an expert TOEFL writing evaluator. Please evaluate the following essay based on TOEFL scoring criteria (0-30 points).

Task Type: ${taskType}
Task ID: ${taskId}
Student Essay:
${essay}

Please evaluate based on these criteria:
1. Development (organization, coherence, completeness) - 0-10 points
2. Organization (clear structure, transitions) - 0-10 points
3. Language Use (grammar, vocabulary, sentence variety) - 0-10 points

Provide detailed feedback:
- Total score (0-30)
- Breakdown by criteria
- Word count analysis
- Grammar errors with corrections
- Vocabulary suggestions (advanced alternatives)
- Structure analysis
- Specific improvements needed
- Sample high-scoring response

Format as JSON:
{
  "totalScore": number,
  "wordCount": number,
  "breakdown": {
    "development": number,
    "organization": number,
    "languageUse": number
  },
  "grammarErrors": [{"error": string, "correction": string, "explanation": string}],
  "vocabularySuggestions": [{"original": string, "suggestion": string, "context": string}],
  "structureAnalysis": string,
  "strengths": [string],
  "weaknesses": [string],
  "improvements": [string],
  "sampleResponse": string
}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are an expert TOEFL writing evaluator with years of experience.' },
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
    console.error('作文批改失败:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 生成写作模板
router.get('/templates/:type', (req, res) => {
  const { type } = req.params;
  
  const templates = {
    independent: {
      introduction: [
        'In my opinion, [state your position]. I feel this way for two reasons, which I will explore in the following essay.',
        'I strongly agree/disagree with the statement that [restate the topic]. My viewpoint is based on several key factors.',
        'The question of [topic] is a complex one. While some people believe [opposite view], I believe that [your view].'
      ],
      body: [
        'First of all, [reason]. For example, [specific example]. This demonstrates that [explanation].',
        'Furthermore, [reason]. A good example of this is [example]. Clearly, [explanation].',
        'Moreover, [reason]. Take [example] for instance. This shows that [explanation].'
      ],
      conclusion: [
        'In conclusion, I believe that [restate position] because [brief summary of reasons].',
        'To sum up, [restate position]. The reasons discussed above clearly support this viewpoint.'
      ],
      transitions: ['First of all', 'Furthermore', 'Moreover', 'In addition', 'Finally', 'In conclusion'],
      advancedVocabulary: ['demonstrates', 'illustrates', 'highlights', 'underscores', 'emphasizes']
    },
    integrated: {
      introduction: [
        'The lecture and the reading passage discuss [topic]. The lecturer challenges the points made in the reading by arguing that [main point].',
        'While the reading suggests that [reading point], the lecturer argues that [lecture point].'
      ],
      body: [
        'First, the reading states that [reading point]. However, the lecturer claims that [lecture counterpoint].',
        'Second, according to the reading, [reading point]. In contrast, the lecturer points out that [lecture counterpoint].',
        'Finally, the reading mentions that [reading point]. The lecturer, on the other hand, argues that [lecture counterpoint].'
      ],
      conclusion: [
        'In summary, the lecturer challenges the reading by providing evidence that contradicts the reading\'s main points.',
        'To conclude, the lecture casts doubt on the reading by presenting opposing viewpoints.'
      ],
      contrastWords: ['However', 'In contrast', 'On the other hand', 'Whereas', 'While', 'Although']
    }
  };
  
  res.json({
    success: true,
    data: templates[type] || {}
  });
});

// 获取高分范文
router.get('/samples/:type', (req, res) => {
  const { type } = req.params;
  
  const samples = {
    independent: [
      {
        id: 'sample_001',
        title: 'Teamwork vs Individual Work',
        score: 28,
        wordCount: 342,
        essay: `In my opinion, it is better to work in a team than to work alone. I feel this way for two reasons, which I will explore in the following essay.

First of all, working in a team allows us to combine different skills and perspectives. When people with diverse backgrounds collaborate, they can approach problems from multiple angles and find more creative solutions. For example, in my previous job, our team consisted of members from marketing, engineering, and design departments. When we faced a challenging project, each person contributed their unique expertise, and we were able to complete the task more effectively than any individual could have done alone. This demonstrates that teamwork leverages collective intelligence.

Furthermore, working in a team provides emotional support and motivation. When facing difficult tasks, having teammates who encourage each other can help maintain enthusiasm and reduce stress. A good example of this is when I was preparing for my undergraduate thesis. Working with a study group helped me stay motivated during stressful periods, and we celebrated each other's successes. Clearly, the social aspect of teamwork contributes to better outcomes and personal well-being.

In conclusion, I believe that working in a team is superior to working alone because it combines diverse skills and provides emotional support. These advantages make teamwork essential in both academic and professional settings.`
      }
    ],
    integrated: [
      {
        id: 'sample_002',
        title: 'Dinosaur Extinction Theories',
        score: 27,
        wordCount: 189,
        essay: `The lecture and the reading passage discuss theories about dinosaur extinction. The lecturer challenges the points made in the reading by arguing that only the asteroid theory is valid.

First, the reading suggests that climate change caused the extinction. However, the lecturer claims that climate change was too gradual to cause sudden extinction. She argues that dinosaurs would have had time to adapt to gradual changes.

Second, according to the reading, volcanic activity led to extinction. In contrast, the lecturer points out that volcanic activity had occurred before without causing mass extinction. Therefore, this theory is not convincing.

Finally, the reading mentions the asteroid theory. The lecturer agrees with this but adds important details. She explains that the asteroid caused a "nuclear winter" effect that blocked sunlight for years, which led to the extinction of plants and subsequently dinosaurs.

In summary, the lecturer challenges the reading by providing evidence that contradicts the climate change and volcanic activity theories while supporting and elaborating on the asteroid theory.`
      }
    ]
  };
  
  res.json({
    success: true,
    data: samples[type] || []
  });
});

module.exports = router;
