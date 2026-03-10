import { useState } from 'react';
import { Card, Button, Tag, Progress, message, Tabs, List, Statistic, Row, Col, Input, Modal } from 'antd';
import {
  EditOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { TextArea } = Input;
const { TabPane } = Tabs;

const Writing = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [currentTask, setCurrentTask] = useState(null);
  const [showTask, setShowTask] = useState(false);
  const [essay, setEssay] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 写作题目
  const writingTasks = [
    {
      id: 1,
      type: '独立写作',
      question: 'Do you agree or disagree with the following statement? "It is better to work in a team than to work alone." Use specific reasons and examples to support your answer.',
      timeLimit: 30,
      wordCount: { min: 300, recommended: 350 },
      tips: [
        'Choose one side and stick to it',
        'Provide 2-3 specific reasons',
        'Use examples to support your points',
        'Write a clear introduction and conclusion',
      ],
    },
    {
      id: 2,
      type: '独立写作',
      question: 'Some people think that the best way to reduce crime is to give criminals longer prison sentences. Others believe there are better alternatives. Discuss both views and give your opinion.',
      timeLimit: 30,
      wordCount: { min: 300, recommended: 350 },
      tips: [
        'Discuss both sides',
        'Give your clear opinion',
        'Support with examples',
      ],
    },
    {
      id: 3,
      type: '综合写作',
      reading: 'The reading passage discusses three theories about why the dinosaurs became extinct.',
      listening: 'The lecturer challenges the theories presented in the reading.',
      question: 'Summarize the points made in the lecture, being sure to explain how they cast doubt on specific points made in the reading passage.',
      timeLimit: 20,
      wordCount: { min: 150, recommended: 200 },
      tips: [
        'Summarize the lecture points',
        'Explain the relationship to reading',
        'Use contrast words',
      ],
    },
  ];

  // 高分范文
  const sampleEssays = [
    {
      id: 1,
      title: 'Teamwork vs Individual Work',
      score: 28,
      wordCount: 342,
      essay: `In my opinion, it is better to work in a team than to work alone. I feel this way for two reasons, which I will explore in the following essay.

First of all, working in a team allows us to combine different skills and perspectives. When people with diverse backgrounds collaborate, they can approach problems from multiple angles and find more creative solutions. For example, in my previous job, our team consisted of members from marketing, engineering, and design departments. When we faced a challenging project, each person contributed their unique expertise, and we were able to complete the task more effectively than any individual could have done alone.

Furthermore, working in a team provides emotional support and motivation. When facing difficult tasks, having teammates who encourage each other can help maintain enthusiasm and reduce stress. A good example of this is when I was preparing for my undergraduate thesis. Working with a study group helped me stay motivated during stressful periods.

In conclusion, I believe that working in a team is superior to working alone because it combines diverse skills and provides emotional support.`,
    },
  ];

  const startTask = (task) => {
    setCurrentTask(task);
    setShowTask(true);
    setEssay('');
    setWordCount(0);
    setEvaluationResult(null);
    setTimer(0);
    setIsTimerRunning(true);
    
    // 启动计时器
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= task.timeLimit * 60) {
          clearInterval(interval);
          setIsTimerRunning(false);
          message.warning('时间到！');
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleEssayChange = (e) => {
    const text = e.target.value;
    setEssay(text);
    setWordCount(text.trim().split(/\s+/).filter(w => w.length > 0).length);
  };

  const submitEssay = () => {
    setIsTimerRunning(false);
    
    // 模拟AI评估
    setTimeout(() => {
      setEvaluationResult({
        totalScore: 24,
        wordCount: wordCount,
        breakdown: {
          development: 8,
          organization: 8,
          languageUse: 8,
        },
        grammarErrors: [
          { error: 'I very like', correction: 'I like very much', explanation: 'Don\'t use "very" before verbs' },
        ],
        vocabularySuggestions: [
          { original: 'good', suggestion: 'beneficial', context: 'This is a good idea' },
        ],
        strengths: [
          'Clear thesis statement',
          'Good use of examples',
          'Logical organization',
        ],
        weaknesses: [
          'Some grammar errors',
          'Could use more advanced vocabulary',
        ],
        improvements: [
          'Use more transition words',
          'Expand on examples',
          'Check subject-verb agreement',
        ],
      });
    }, 1500);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderPracticeTab = () => (
    <div>
      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="已完成作文"
              value={12}
              suffix="篇"
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均得分"
              value={24}
              suffix="/30"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="总字数"
              value={4200}
              suffix="词"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="连续打卡"
              value={7}
              suffix="天"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 写作任务列表 */}
      <Card title="写作练习题目">
        <List
          dataSource={writingTasks}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => startTask(item)}>
                  开始写作
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span>
                    {item.type}
                    <Tag color="blue" style={{ marginLeft: 8 }}>{item.timeLimit}分钟</Tag>
                    <Tag color="green">{item.wordCount.min}-{item.wordCount.recommended}词</Tag>
                  </span>
                }
                description={
                  <div>
                    <p style={{ margin: '8px 0', color: '#666' }}>{item.question.substring(0, 150)}...</p>
                    {item.tips && (
                      <span>
                        {item.tips.slice(0, 2).map((tip, index) => (
                          <Tag key={index} size="small" style={{ marginRight: 4 }}>{tip}</Tag>
                        ))}
                      </span>
                    )}
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderSamplesTab = () => (
    <Card title="高分范文">
      <List
        dataSource={sampleEssays}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              title={
                <span>
                  {item.title}
                  <Tag color="success" style={{ marginLeft: 8 }}>{item.score}分</Tag>
                  <Tag>{item.wordCount}词</Tag>
                </span>
              }
              description={
                <div style={{ 
                  marginTop: 12,
                  padding: 16,
                  background: '#f6ffed',
                  borderRadius: 8,
                  whiteSpace: 'pre-wrap',
                  fontFamily: 'Georgia, serif',
                  lineHeight: 1.8,
                }}>
                  {item.essay}
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  const renderTemplatesTab = () => (
    <Card title="写作模板">
      <Tabs>
        <TabPane tab="独立写作" key="independent">
          <Card size="small" title="开头模板">
            <ul>
              <li>In my opinion, [state your position]. I feel this way for two reasons, which I will explore in the following essay.</li>
              <li>I strongly agree/disagree with the statement that [restate the topic]. My viewpoint is based on several key factors.</li>
            </ul>
          </Card>
          <Card size="small" title="主体模板" style={{ marginTop: 16 }}>
            <ul>
              <li>First of all, [reason]. For example, [specific example]. This demonstrates that [explanation].</li>
              <li>Furthermore, [reason]. A good example of this is [example]. Clearly, [explanation].</li>
            </ul>
          </Card>
          <Card size="small" title="结尾模板" style={{ marginTop: 16 }}>
            <ul>
              <li>In conclusion, I believe that [restate position] because [brief summary of reasons].</li>
            </ul>
          </Card>
        </TabPane>
        <TabPane tab="综合写作" key="integrated">
          <Card size="small" title="开头模板">
            <p>The lecture and the reading passage discuss [topic]. The lecturer challenges the points made in the reading by arguing that [main point].</p>
          </Card>
          <Card size="small" title="主体模板" style={{ marginTop: 16 }}>
            <ul>
              <li>First, the reading states that [reading point]. However, the lecturer claims that [lecture counterpoint].</li>
              <li>Second, according to the reading, [reading point]. In contrast, the lecturer points out that [lecture counterpoint].</li>
            </ul>
          </Card>
        </TabPane>
      </Tabs>
    </Card>
  );

  return (
    <div>
      <h2>写作批改 ✍️</h2>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="写作练习" key="practice">
          {renderPracticeTab()}
        </TabPane>
        <TabPane tab="高分范文" key="samples">
          {renderSamplesTab()}
        </TabPane>
        <TabPane tab="写作模板" key="templates">
          {renderTemplatesTab()}
        </TabPane>
      </Tabs>

      {/* 写作弹窗 */}
      <Modal
        title={currentTask?.type}
        open={showTask}
        onCancel={() => setShowTask(false)}
        footer={null}
        width={800}
      >
        {currentTask && (
          <div style={{ padding: 20 }}>
            {/* 题目 */}
            <Card style={{ marginBottom: 16 }}>
              <h4>题目</h4>
              <p>{currentTask.question}</p>
              {currentTask.reading && (
                <div style={{ marginTop: 12 }}>
                  <h5>阅读材料</h5>
                  <p style={{ color: '#666' }}>{currentTask.reading}</p>
                </div>
              )}
              {currentTask.tips && (
                <div style={{ marginTop: 12 }}>
                  <h5>提示</h5>
                  <ul>
                    {currentTask.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* 计时器和字数 */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <Tag color="red" size="large">
                <ClockCircleOutlined /> {formatTime(timer)}
              </Tag>
              <Tag color="blue" size="large">
                字数: {wordCount} / {currentTask.wordCount.recommended}
              </Tag>
            </div>

            {/* 写作区域 */}
            {!evaluationResult ? (
              <>
                <TextArea
                  rows={12}
                  value={essay}
                  onChange={handleEssayChange}
                  placeholder="请在这里输入你的作文..."
                  style={{ marginBottom: 16, fontSize: 16, lineHeight: 1.8 }}
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={submitEssay}
                  disabled={wordCount < currentTask.wordCount.min}
                  block
                >
                  提交作文
                </Button>
              </>
            ) : (
              <Card title="AI批改结果">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 48, color: '#1890ff', margin: 0 }}>
                    {evaluationResult.totalScore}
                  </h2>
                  <p>/30分</p>
                  <p>字数: {evaluationResult.wordCount}词</p>
                </div>

                <Row gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic title="Development" value={evaluationResult.breakdown.development} suffix="/10" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic title="Organization" value={evaluationResult.breakdown.organization} suffix="/10" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic title="Language Use" value={evaluationResult.breakdown.languageUse} suffix="/10" />
                    </Card>
                  </Col>
                </Row>

                <div style={{ marginBottom: 16 }}>
                  <h4>优点</h4>
                  <ul>
                    {evaluationResult.strengths.map((item, index) => (
                      <li key={index} style={{ color: '#52c41a' }}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <h4>语法错误</h4>
                  {evaluationResult.grammarErrors.map((error, index) => (
                    <Card key={index} size="small" style={{ marginBottom: 8 }}>
                      <p><strong>错误:</strong> {error.error}</p>
                      <p><strong>改正:</strong> {error.correction}</p>
                      <p style={{ color: '#999' }}>{error.explanation}</p>
                    </Card>
                  ))}
                </div>

                <div>
                  <h4>改进建议</h4>
                  <ul>
                    {evaluationResult.improvements.map((item, index) => (
                      <li key={index} style={{ color: '#faad14' }}>{item}</li>
                    ))}
                  </ul>
                </div>

                <Button type="primary" onClick={() => setShowTask(false)} style={{ marginTop: 16 }}>
                  完成
                </Button>
              </Card>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Writing;
