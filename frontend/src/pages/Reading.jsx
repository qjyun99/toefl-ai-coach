import { useState } from 'react';
import { Card, Button, Tag, Progress, Radio, List, Statistic, Row, Col, message, Modal } from 'antd';
import {
  ReadOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  FireOutlined,
  TrophyOutlined,
} from '@ant-design/icons';

const Reading = () => {
  const [currentArticle, setCurrentArticle] = useState(null);
  const [showArticle, setShowArticle] = useState(false);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  // 模拟文章数据
  const articles = [
    {
      id: 1,
      title: 'The History of Chocolate',
      level: 'Level 1',
      wordCount: 350,
      timeLimit: 12,
      difficulty: '简单',
      tags: ['历史', '文化'],
      content: `Chocolate has a long and fascinating history that dates back thousands of years. The ancient Mesoamerican cultures, including the Mayans and Aztecs, were among the first to cultivate cacao trees and use the beans to make a bitter drink. They believed that cacao was a gift from the gods and used it in religious ceremonies.

The Spanish conquistadors who arrived in the Americas in the 16th century were introduced to chocolate by the Aztecs. They brought cacao beans back to Europe, where sugar and other ingredients were added to create the sweet chocolate we know today. The drink became popular among the European aristocracy.

In the 19th century, advances in technology led to the development of solid chocolate and mass production techniques. This made chocolate more affordable and accessible to the general public. Today, chocolate is enjoyed by people all over the world and is a multi-billion dollar industry.

Despite its popularity, chocolate production has faced criticism for issues such as child labor in cacao farms and environmental concerns. Many companies are now working to address these problems through fair trade practices and sustainable farming methods.`,
      questions: [
        {
          id: 1,
          question: 'Which ancient cultures were among the first to use cacao?',
          options: ['Romans and Greeks', 'Mayans and Aztecs', 'Egyptians and Persians', 'Chinese and Japanese'],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: 'What can be inferred about chocolate in Europe before the 16th century?',
          options: ['It was widely available', 'It was unknown', 'It was very expensive', 'It was used as medicine'],
          correctAnswer: 1,
        },
        {
          id: 3,
          question: 'The word "cultivate" in paragraph 1 is closest in meaning to:',
          options: ['destroy', 'grow', 'trade', 'eat'],
          correctAnswer: 1,
        },
      ],
    },
    {
      id: 2,
      title: 'The Water Cycle',
      level: 'Level 2',
      wordCount: 400,
      timeLimit: 15,
      difficulty: '中等',
      tags: ['科学', '地理'],
      content: `The water cycle, also known as the hydrologic cycle, is the continuous movement of water on, above, and below the surface of the Earth. This complex system involves several key processes that work together to recycle water throughout the planet.

Evaporation is the process by which water changes from a liquid to a gas or vapor. Heat from the sun causes water in oceans, rivers, and lakes to evaporate and rise into the atmosphere. Plants also contribute to this process through transpiration, releasing water vapor from their leaves.

As water vapor rises, it cools and condenses to form clouds. This process is called condensation. When water droplets in clouds become too heavy, they fall back to Earth as precipitation in the form of rain, snow, sleet, or hail.

Once precipitation reaches the ground, it can take several paths. Some water flows across the surface as runoff, eventually reaching rivers, lakes, and oceans. Some water seeps into the ground through infiltration, becoming groundwater that can be stored in aquifers for thousands of years.`,
      questions: [
        {
          id: 1,
          question: 'What is another name for the water cycle?',
          options: ['The carbon cycle', 'The hydrologic cycle', 'The nitrogen cycle', 'The oxygen cycle'],
          correctAnswer: 1,
        },
        {
          id: 2,
          question: 'What causes water to evaporate?',
          options: ['Wind', 'Gravity', 'Heat from the sun', 'Clouds'],
          correctAnswer: 2,
        },
      ],
    },
  ];

  const startReading = (article) => {
    setCurrentArticle(article);
    setShowArticle(true);
    setAnswers({});
    setShowResults(false);
    setTimer(0);
    setIsTimerRunning(true);
    
    // 启动计时器
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev >= article.timeLimit * 60) {
          clearInterval(interval);
          setIsTimerRunning(false);
          message.warning('时间到！');
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitAnswers = () => {
    setIsTimerRunning(false);
    setShowResults(true);
    
    // 计算得分
    let correct = 0;
    currentArticle.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) {
        correct++;
      }
    });
    
    const score = Math.round((correct / currentArticle.questions.length) * 100);
    message.success(`测试完成！得分: ${score}%`);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      <h2>阅读练习 📖</h2>
      
      {!showArticle ? (
        <>
          {/* 统计卡片 */}
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="已完成文章"
                  value={25}
                  suffix="篇"
                  prefix={<FileTextOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="平均正确率"
                  value={75}
                  suffix="%"
                  prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="阅读速度"
                  value={120}
                  suffix="词/分"
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
                  prefix={<TrophyOutlined style={{ color: '#faad14' }} />}
                />
              </Card>
            </Col>
          </Row>

          {/* 文章列表 */}
          <Card title="阅读文章">
            <List
              dataSource={articles}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button type="primary" onClick={() => startReading(item)}>
                      开始阅读
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span>
                        {item.title}
                        <Tag color="blue" style={{ marginLeft: 8 }}>{item.level}</Tag>
                        <Tag color="green">{item.difficulty}</Tag>
                      </span>
                    }
                    description={
                      <div>
                        <span style={{ marginRight: 16 }}>
                          <FileTextOutlined /> {item.wordCount} 词
                        </span>
                        <span style={{ marginRight: 16 }}>
                          <ClockCircleOutlined /> {item.timeLimit} 分钟
                        </span>
                        <span>
                          {item.tags.map(tag => (
                            <Tag key={tag} size="small">{tag}</Tag>
                          ))}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </>
      ) : (
        <Card
          title={
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>{currentArticle.title}</span>
              <div>
                <Tag color="red">
                  <ClockCircleOutlined /> {formatTime(timer)}
                </Tag>
                <Button style={{ marginLeft: 16 }} onClick={() => setShowArticle(false)}>
                  返回列表
                </Button>
              </div>
            </div>
          }
        >
          {/* 文章内容 */}
          <div style={{ 
            fontSize: 16, 
            lineHeight: 1.8, 
            marginBottom: 32,
            padding: 20,
            background: '#f6ffed',
            borderRadius: 8,
          }}>
            {currentArticle.content.split('\n\n').map((paragraph, index) => (
              <p key={index} style={{ marginBottom: 16, textIndent: '2em' }}>
                {paragraph}
              </p>
            ))}
          </div>

          {/* 题目 */}
          <div style={{ marginTop: 32 }}>
            <h3>阅读理解题目</h3>
            {currentArticle.questions.map((q, index) => (
              <Card key={q.id} style={{ marginBottom: 16 }}>
                <p style={{ fontWeight: 'bold', marginBottom: 16 }}>
                  {index + 1}. {q.question}
                </p>
                <Radio.Group
                  onChange={(e) => handleAnswer(q.id, e.target.value)}
                  value={answers[q.id]}
                  disabled={showResults}
                >
                  {q.options.map((option, optIndex) => (
                    <div key={optIndex} style={{ marginBottom: 8 }}>
                      <Radio value={optIndex}>
                        {String.fromCharCode(65 + optIndex)}. {option}
                        {showResults && optIndex === q.correctAnswer && (
                          <Tag color="success" style={{ marginLeft: 8 }}>正确答案</Tag>
                        )}
                        {showResults && answers[q.id] === optIndex && optIndex !== q.correctAnswer && (
                          <Tag color="error" style={{ marginLeft: 8 }}>你的答案</Tag>
                        )}
                      </Radio>
                    </div>
                  ))}
                </Radio.Group>
              </Card>
            ))}

            {!showResults ? (
              <Button 
                type="primary" 
                size="large" 
                onClick={submitAnswers}
                disabled={Object.keys(answers).length !== currentArticle.questions.length}
                block
              >
                提交答案
              </Button>
            ) : (
              <Card title="测试结果">
                <Statistic
                  title="正确率"
                  value={Math.round(
                    (currentArticle.questions.filter(q => answers[q.id] === q.correctAnswer).length / 
                    currentArticle.questions.length) * 100
                  )}
                  suffix="%"
                />
                <Progress 
                  percent={Math.round(
                    (currentArticle.questions.filter(q => answers[q.id] === q.correctAnswer).length / 
                    currentArticle.questions.length) * 100
                  )} 
                  status="active" 
                />
                <p>用时: {formatTime(timer)}</p>
                <Button onClick={() => setShowArticle(false)}>返回列表</Button>
              </Card>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Reading;
