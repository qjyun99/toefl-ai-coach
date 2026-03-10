import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, Progress, Button, List, Tag, Calendar, Badge } from 'antd';
import {
  BookOutlined,
  ReadOutlined,
  AudioOutlined,
  EditOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { Line, Radar } from '@ant-design/charts';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    vocabulary: { learned: 450, mastered: 280, target: 10000 },
    reading: { completed: 25, averageScore: 75 },
    speaking: { completed: 30, averageScore: 22 },
    writing: { completed: 12, averageScore: 24 },
    studyDays: 15,
    streak: 7,
    totalTime: 45,
  });

  const [todayTasks, setTodayTasks] = useState([
    { id: 1, title: '词汇学习', description: '学习20个新单词，复习30个旧单词', time: 20, completed: false, type: 'vocabulary' },
    { id: 2, title: '阅读练习', description: '完成1篇托福阅读，限时15分钟', time: 20, completed: false, type: 'reading' },
    { id: 3, title: '听力训练', description: '精听1段TPO听力材料', time: 15, completed: true, type: 'listening' },
    { id: 4, title: '口语跟读', description: '跟读托福口语范文15分钟', time: 15, completed: false, type: 'speaking' },
  ]);

  useEffect(() => {
    // 模拟加载数据
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const abilityData = [
    { item: '词汇', score: 45, target: 100 },
    { item: '阅读', score: 75, target: 100 },
    { item: '听力', score: 70, target: 100 },
    { item: '口语', score: 60, target: 100 },
    { item: '写作', score: 65, target: 100 },
  ];

  const progressData = [
    { date: '周一', studyTime: 60, tasks: 5 },
    { date: '周二', studyTime: 45, tasks: 4 },
    { date: '周三', studyTime: 90, tasks: 8 },
    { date: '周四', studyTime: 30, tasks: 3 },
    { date: '周五', studyTime: 60, tasks: 5 },
    { date: '周六', studyTime: 120, tasks: 10 },
    { date: '周日', studyTime: 90, tasks: 8 },
  ];

  const getTaskIcon = (type) => {
    switch (type) {
      case 'vocabulary': return <BookOutlined />;
      case 'reading': return <ReadOutlined />;
      case 'listening': return <AudioOutlined />;
      case 'speaking': return <AudioOutlined />;
      case 'writing': return <EditOutlined />;
      default: return <CheckCircleOutlined />;
    }
  };

  const getTaskColor = (type) => {
    switch (type) {
      case 'vocabulary': return 'blue';
      case 'reading': return 'green';
      case 'listening': return 'orange';
      case 'speaking': return 'purple';
      case 'writing': return 'red';
      default: return 'default';
    }
  };

  return (
    <div>
      {/* 欢迎语 */}
      <div style={{ marginBottom: 24 }}>
        <h2>欢迎回来！🦞</h2>
        <p>今天是托福备考的第 {stats.studyDays} 天，连续打卡 {stats.streak} 天 🔥</p>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="已学词汇"
              value={stats.vocabulary.learned}
              suffix={`/ ${stats.vocabulary.target}`}
              prefix={<BookOutlined />}
            />
            <Progress percent={Math.round(stats.vocabulary.learned / stats.vocabulary.target * 100)} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="阅读完成"
              value={stats.reading.completed}
              suffix="篇"
              prefix={<ReadOutlined />}
            />
            <Progress percent={stats.reading.averageScore} size="small" status="active" />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="口语练习"
              value={stats.speaking.completed}
              suffix="次"
              prefix={<AudioOutlined />}
            />
            <Progress percent={stats.speaking.averageScore * 3} size="small" status="active" />
          </Card>
        </Col>
        <Col span={6}>
          <Card loading={loading}>
            <Statistic
              title="写作批改"
              value={stats.writing.completed}
              suffix="篇"
              prefix={<EditOutlined />}
            />
            <Progress percent={stats.writing.averageScore * 3} size="small" status="active" />
          </Card>
        </Col>
      </Row>

      {/* 今日任务和能力雷达图 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="今日任务" 
            extra={<Button type="primary">开始学习</Button>}
            loading={loading}
          >
            <List
              dataSource={todayTasks}
              renderItem={item => (
                <List.Item
                  actions={[
                    <Button 
                      type={item.completed ? 'primary' : 'default'}
                      size="small"
                      icon={item.completed ? <CheckCircleOutlined /> : null}
                    >
                      {item.completed ? '已完成' : '开始'}
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{ 
                        width: 40, 
                        height: 40, 
                        borderRadius: '50%', 
                        background: item.completed ? '#52c41a' : '#f0f0f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20
                      }}>
                        {getTaskIcon(item.type)}
                      </div>
                    }
                    title={
                      <span>
                        {item.title}
                        <Tag color={getTaskColor(item.type)} style={{ marginLeft: 8 }}>
                          {item.time}分钟
                        </Tag>
                      </span>
                    }
                    description={item.description}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="能力分析" loading={loading}>
            <Radar
              data={abilityData}
              xField="item"
              yField="score"
              seriesField="item"
              meta={{
                score: {
                  alias: '得分',
                  min: 0,
                  max: 100,
                },
              }}
              xAxis={{
                line: null,
                tickLine: null,
                grid: {
                  line: {
                    style: {
                      lineDash: null,
                    },
                  },
                },
              }}
              yAxis={{
                line: null,
                tickLine: null,
                grid: {
                  line: {
                    type: 'line',
                    style: {
                      lineDash: null,
                    },
                  },
                },
              }}
              point={{
                size: 3,
              }}
              area={{
                style: {
                  fillOpacity: 0.3,
                },
              }}
              legend={{
                position: 'bottom',
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 学习进度 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="本周学习进度" loading={loading}>
            <Line
              data={progressData}
              xField="date"
              yField="studyTime"
              seriesField="type"
              yAxis={{
                title: {
                  text: '学习时长（分钟）',
                },
              }}
              legend={{
                position: 'top',
              }}
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
