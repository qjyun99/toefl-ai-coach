import { useState, useEffect } from 'react';
import { Card, Button, Progress, Tag, Statistic, Row, Col, Tabs, List, Badge, Radio, Input, message, Modal } from 'antd';
import {
  BookOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  SoundOutlined,
  EditOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const Vocabulary = () => {
  const [activeTab, setActiveTab] = useState('study');
  const [loading, setLoading] = useState(false);
  const [showTest, setShowTest] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [testResults, setTestResults] = useState(null);
  
  // 学习数据
  const [stats, setStats] = useState({
    totalWords: 450,
    mastered: 280,
    reviewing: 120,
    forgotten: 50,
    todayNew: 20,
    todayReview: 30,
    streak: 7,
  });

  // 今日任务
  const [todayTasks, setTodayTasks] = useState({
    newWords: [
      { id: 1, word: 'hypothesis', phonetic: '/haɪˈpɒθəsɪs/', meaning: '假设，假说', level: 'level2', status: 'new' },
      { id: 2, word: 'photosynthesis', phonetic: '/ˌfəʊtəʊˈsɪnθəsɪs/', meaning: '光合作用', level: 'level3', status: 'new' },
      { id: 3, word: 'supernova', phonetic: '/ˌsuːpəˈnəʊvə/', meaning: '超新星', level: 'level4', status: 'new' },
    ],
    reviewWords: [
      { id: 4, word: 'analyze', phonetic: '/ˈænəlaɪz/', meaning: '分析', level: 'level1', status: 'reviewing', mastery: 75 },
      { id: 5, word: 'significant', phonetic: '/sɪɡˈnɪfɪkənt/', meaning: '重要的', level: 'level1', status: 'reviewing', mastery: 60 },
    ],
  });

  // 模拟测试题目
  const mockQuestions = [
    {
      id: 1,
      word: 'hypothesis',
      type: 'recognition',
      question: '请选择 "hypothesis" 的中文意思',
      options: ['假设，假说', '照片，相片', '合成，综合', '假设的'],
      correctAnswer: 0,
    },
    {
      id: 2,
      word: 'photosynthesis',
      type: 'recognition',
      question: '请选择 "photosynthesis" 的中文意思',
      options: ['光子的', '光合作用', '合成照片', '光化学'],
      correctAnswer: 1,
    },
    {
      id: 3,
      word: 'supernova',
      type: 'spelling',
      question: '请写出 "超新星" 的英文单词',
      hint: '首字母: s, 长度: 9',
      correctAnswer: 'supernova',
    },
  ];

  const startDiagnosticTest = () => {
    setShowTest(true);
    setTestProgress(0);
    setCurrentQuestion(mockQuestions[0]);
  };

  const handleAnswer = (answer) => {
    // 模拟答题
    const isCorrect = answer === currentQuestion.correctAnswer;
    message[isCorrect ? 'success' : 'error'](isCorrect ? '回答正确！' : '回答错误');
    
    // 下一题
    const nextIndex = testProgress + 1;
    if (nextIndex < mockQuestions.length) {
      setTestProgress(nextIndex);
      setCurrentQuestion(mockQuestions[nextIndex]);
    } else {
      // 测试完成
      setTestResults({
        total: mockQuestions.length,
        correct: 2,
        accuracy: 67,
        estimatedVocabulary: 6500,
        weakAreas: ['level3', 'level4'],
      });
      setShowTest(false);
    }
  };

  const renderStudyTab = () => (
    <div>
      {/* 今日学习统计 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日新词"
              value={stats.todayNew}
              suffix="个"
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="今日复习"
              value={stats.todayReview}
              suffix="个"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="已掌握"
              value={stats.mastered}
              suffix="个"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="连续打卡"
              value={stats.streak}
              suffix="天"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>

      {/* 新词学习 */}
      <Card title="新词学习" style={{ marginBottom: 24 }}>
        <List
          dataSource={todayTasks.newWords}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="primary" icon={<SoundOutlined />}>发音</Button>,
                <Button>认识</Button>,
                <Button type="dashed">不认识</Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {item.word}
                    <Tag color="blue" style={{ marginLeft: 8 }}>{item.phonetic}</Tag>
                  </span>
                }
                description={
                  <div>
                    <p style={{ fontSize: 16, margin: '8px 0' }}>{item.meaning}</p>
                    <Tag color="orange">{item.level}</Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* 复习单词 */}
      <Card title="今日复习">
        <List
          dataSource={todayTasks.reviewWords}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="primary">记得</Button>,
                <Button danger>忘记</Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span style={{ fontSize: 18, fontWeight: 'bold' }}>
                    {item.word}
                    <Progress 
                      percent={item.mastery} 
                      size="small" 
                      style={{ width: 100, marginLeft: 16 }}
                    />
                  </span>
                }
                description={
                  <div>
                    <p style={{ fontSize: 16, margin: '8px 0' }}>{item.meaning}</p>
                    <Tag color="green">掌握度: {item.mastery}%</Tag>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderTestTab = () => (
    <div style={{ textAlign: 'center', padding: 40 }}>
      {!testResults ? (
        <>
          <h2>词汇量诊断测试</h2>
          <p style={{ fontSize: 16, color: '#666', margin: '20px 0' }}>
            15分钟快速测试，精准定位你的词汇水平
          </p>
          <div style={{ margin: '40px 0' }}>
            <Statistic title="测试题目" value={200} suffix="道" />
            <Statistic title="预计时间" value={15} suffix="分钟" style={{ marginLeft: 40 }} />
          </div>
          <Button type="primary" size="large" onClick={startDiagnosticTest}>
            开始测试
          </Button>
        </>
      ) : (
        <Card title="测试结果" style={{ maxWidth: 600, margin: '0 auto' }}>
          <Statistic
            title="预估词汇量"
            value={testResults.estimatedVocabulary}
            suffix="词"
            style={{ marginBottom: 24 }}
          />
          <Progress percent={testResults.accuracy} status="active" />
          <p>正确率: {testResults.accuracy}%</p>
          <p>薄弱环节: {testResults.weakAreas.join(', ')}</p>
          <Button type="primary" onClick={() => setTestResults(null)}>
            重新测试
          </Button>
        </Card>
      )}
    </div>
  );

  const renderStatsTab = () => (
    <Row gutter={16}>
      <Col span={12}>
        <Card title="词汇掌握分布">
          <Progress type="circle" percent={Math.round(stats.mastered / stats.totalWords * 100)} />
          <div style={{ marginTop: 16 }}>
            <p><Badge color="#52c41a" text={`已掌握: ${stats.mastered}词`} /></p>
            <p><Badge color="#faad14" text={`复习中: ${stats.reviewing}词`} /></p>
            <p><Badge color="#ff4d4f" text={`需加强: ${stats.forgotten}词`} /></p>
          </div>
        </Card>
      </Col>
      <Col span={12}>
        <Card title="学习趋势">
          <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <p>本周学习新词: 140个</p>
          </div>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div>
      <h2>词汇训练 📚</h2>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="每日学习" key="study">
          {renderStudyTab()}
        </TabPane>
        <TabPane tab="诊断测试" key="test">
          {renderTestTab()}
        </TabPane>
        <TabPane tab="学习统计" key="stats">
          {renderStatsTab()}
        </TabPane>
      </Tabs>

      {/* 测试弹窗 */}
      <Modal
        title="词汇测试"
        open={showTest}
        onCancel={() => setShowTest(false)}
        footer={null}
        width={600}
      >
        {currentQuestion && (
          <div style={{ padding: 20 }}>
            <Progress percent={((testProgress + 1) / mockQuestions.length) * 100} />
            <h3 style={{ margin: '20px 0' }}>{currentQuestion.question}</h3>
            
            {currentQuestion.type === 'recognition' && (
              <div>
                {currentQuestion.options.map((option, index) => (
                  <Button
                    key={index}
                    style={{ margin: '8px', width: '100%' }}
                    onClick={() => handleAnswer(index)}
                  >
                    {option}
                  </Button>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'spelling' && (
              <div>
                <p style={{ color: '#999' }}>{currentQuestion.hint}</p>
                <Input.Search
                  placeholder="请输入单词"
                  enterButton="提交"
                  onSearch={(value) => handleAnswer(value.toLowerCase() === currentQuestion.correctAnswer.toLowerCase() ? 0 : -1)}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Vocabulary;
