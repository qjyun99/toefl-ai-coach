import { useState, useRef } from 'react';
import { Card, Button, Tag, Progress, message, Tabs, List, Statistic, Row, Col, Modal } from 'antd';
import {
  AudioOutlined,
  PlayCircleOutlined,
  PauseCircleOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  SoundOutlined,
  MessageOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const Speaking = () => {
  const [activeTab, setActiveTab] = useState('practice');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [currentTask, setCurrentTask] = useState(null);
  const [showTask, setShowTask] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const timerRef = useRef(null);

  // 模拟口语任务
  const speakingTasks = [
    {
      id: 1,
      type: '独立口语',
      title: 'Task 1: 描述一个有趣的地方',
      question: 'Describe a place you have visited that was very interesting. Explain why you found it interesting.',
      preparationTime: 15,
      responseTime: 45,
      tips: ['Use specific details', 'Explain your feelings', 'Give examples'],
    },
    {
      id: 2,
      type: '独立口语',
      title: 'Task 2: 学习偏好',
      question: 'Some people prefer to study alone, while others prefer to study in a group. Which do you prefer and why?',
      preparationTime: 15,
      responseTime: 45,
      tips: ['Choose one side clearly', 'Give specific reasons', 'Provide examples'],
    },
    {
      id: 3,
      type: '综合口语',
      title: 'Task 3: 校园政策',
      reading: 'The university has announced a new policy that requires all students to complete an internship before graduation.',
      listening: 'The student disagrees with this policy, arguing that many students already have part-time jobs.',
      question: 'State her opinion and explain the reasons she gives.',
      preparationTime: 30,
      responseTime: 60,
    },
  ];

  // 跟读材料
  const shadowingMaterials = [
    {
      id: 1,
      title: 'TOEFL Speaking Sample 1',
      text: 'I believe that technology has greatly improved our lives in many ways. First of all, it has made communication much easier and faster.',
      difficulty: 'Medium',
    },
    {
      id: 2,
      title: 'TOEFL Speaking Sample 2',
      text: 'In my opinion, the best way to learn a new language is to immerse yourself in the culture and practice speaking every day.',
      difficulty: 'Medium',
    },
  ];

  const startTask = (task) => {
    setCurrentTask(task);
    setShowTask(true);
    setEvaluationResult(null);
    setRecordingTime(0);
  };

  const startRecording = () => {
    setIsRecording(true);
    setRecordingTime(0);
    
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => {
        if (prev >= currentTask.responseTime) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    setIsRecording(false);
    clearInterval(timerRef.current);
    
    // 模拟AI评估
    setTimeout(() => {
      setEvaluationResult({
        totalScore: 24,
        breakdown: {
          delivery: 8,
          languageUse: 8,
          topicDevelopment: 8,
        },
        feedback: [
          '发音清晰，语调自然',
          '词汇使用准确，但可以增加一些高级词汇',
          '内容完整，逻辑清晰',
        ],
        suggestions: [
          '注意连读和弱读',
          '多使用连接词',
          '增加细节描述',
        ],
      });
    }, 1000);
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
              title="练习次数"
              value={30}
              suffix="次"
              prefix={<AudioOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="平均得分"
              value={22}
              suffix="/30"
              prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="练习时长"
              value={8}
              suffix="小时"
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

      {/* 口语任务列表 */}
      <Card title="口语练习题目">
        <List
          dataSource={speakingTasks}
          renderItem={item => (
            <List.Item
              actions={[
                <Button type="primary" onClick={() => startTask(item)}>
                  开始练习
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <span>
                    {item.title}
                    <Tag color="blue" style={{ marginLeft: 8 }}>{item.type}</Tag>
                  </span>
                }
                description={
                  <div>
                    <p style={{ margin: '8px 0', color: '#666' }}>{item.question.substring(0, 100)}...</p>
                    <span>
                      <Tag>准备: {item.preparationTime}秒</Tag>
                      <Tag>回答: {item.responseTime}秒</Tag>
                    </span>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );

  const renderShadowingTab = () => (
    <Card title="跟读练习">
      <List
        dataSource={shadowingMaterials}
        renderItem={item => (
          <List.Item
            actions={[
              <Button icon={<SoundOutlined />}>播放</Button>,
              <Button type="primary" icon={<AudioOutlined />}>跟读</Button>,
            ]}
          >
            <List.Item.Meta
              title={item.title}
              description={
                <div>
                  <p style={{ 
                    padding: 12, 
                    background: '#f6ffed', 
                    borderRadius: 4,
                    fontStyle: 'italic'
                  }}>
                    "{item.text}"
                  </p>
                  <Tag color="green">难度: {item.difficulty}</Tag>
                </div>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  const renderHistoryTab = () => (
    <Card title="练习历史">
      <List
        dataSource={[
          { id: 1, task: 'Task 1: 描述一个有趣的地方', score: 24, date: '2024-03-10', duration: '45秒' },
          { id: 2, task: 'Task 2: 学习偏好', score: 22, date: '2024-03-09', duration: '43秒' },
          { id: 3, task: 'Task 3: 校园政策', score: 25, date: '2024-03-08', duration: '58秒' },
        ]}
        renderItem={item => (
          <List.Item
            actions={[
              <Button type="link">查看详情</Button>,
            ]}
          >
            <List.Item.Meta
              title={item.task}
              description={
                <span>
                  <Tag color={item.score >= 24 ? 'success' : item.score >= 20 ? 'warning' : 'error'}>
                    得分: {item.score}/30
                  </Tag>
                  <span style={{ marginLeft: 16, color: '#999' }}>
                    {item.date} · {item.duration}
                  </span>
                </span>
              }
            />
          </List.Item>
        )}
      />
    </Card>
  );

  return (
    <div>
      <h2>口语教练 🎤</h2>
      
      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="口语练习" key="practice">
          {renderPracticeTab()}
        </TabPane>
        <TabPane tab="跟读训练" key="shadowing">
          {renderShadowingTab()}
        </TabPane>
        <TabPane tab="练习历史" key="history">
          {renderHistoryTab()}
        </TabPane>
      </Tabs>

      {/* 练习弹窗 */}
      <Modal
        title={currentTask?.title}
        open={showTask}
        onCancel={() => setShowTask(false)}
        footer={null}
        width={700}
      >
        {currentTask && (
          <div style={{ padding: 20 }}>
            {/* 题目 */}
            <Card style={{ marginBottom: 24 }}>
              <h4>题目</h4>
              <p style={{ fontSize: 16 }}>{currentTask.question}</p>
              {currentTask.tips && (
                <div style={{ marginTop: 16 }}>
                  <h4>提示</h4>
                  <ul>
                    {currentTask.tips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>

            {/* 录音区域 */}
            {!evaluationResult ? (
              <Card style={{ textAlign: 'center', padding: 40 }}>
                <div style={{ marginBottom: 24 }}>
                  <Progress
                    type="circle"
                    percent={(recordingTime / currentTask.responseTime) * 100}
                    format={() => formatTime(recordingTime)}
                    status={isRecording ? 'active' : 'normal'}
                  />
                </div>
                
                {!isRecording ? (
                  <Button
                    type="primary"
                    size="large"
                    icon={<AudioOutlined />}
                    onClick={startRecording}
                  >
                    开始录音
                  </Button>
                ) : (
                  <Button
                    type="danger"
                    size="large"
                    icon={<PauseCircleOutlined />}
                    onClick={stopRecording}
                  >
                    停止录音
                  </Button>
                )}
                
                <p style={{ marginTop: 16, color: '#999' }}>
                  回答时间限制: {currentTask.responseTime}秒
                </p>
              </Card>
            ) : (
              <Card title="AI评估结果">
                <div style={{ textAlign: 'center', marginBottom: 24 }}>
                  <h2 style={{ fontSize: 48, color: '#1890ff', margin: 0 }}>
                    {evaluationResult.totalScore}
                  </h2>
                  <p>/30分</p>
                </div>
                
                <Row gutter={16} style={{ marginBottom: 24 }}>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic title="Delivery" value={evaluationResult.breakdown.delivery} suffix="/10" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic title="Language Use" value={evaluationResult.breakdown.languageUse} suffix="/10" />
                    </Card>
                  </Col>
                  <Col span={8}>
                    <Card size="small">
                      <Statistic title="Topic Development" value={evaluationResult.breakdown.topicDevelopment} suffix="/10" />
                    </Card>
                  </Col>
                </Row>

                <div style={{ marginBottom: 16 }}>
                  <h4>优点</h4>
                  <ul>
                    {evaluationResult.feedback.map((item, index) => (
                      <li key={index} style={{ color: '#52c41a' }}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4>改进建议</h4>
                  <ul>
                    {evaluationResult.suggestions.map((item, index) => (
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

export default Speaking;
