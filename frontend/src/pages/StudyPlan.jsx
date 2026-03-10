import { useState } from 'react';
import { Card, Button, Progress, Timeline, Tag, Statistic, Row, Col, Steps, List, Calendar, Badge } from 'antd';
import {
  CalendarOutlined,
  CheckCircleOutlined,
  FireOutlined,
  TrophyOutlined,
  ClockCircleOutlined,
  BookOutlined,
  TargetOutlined,
} from '@ant-design/icons';

const StudyPlan = () => {
  const [currentPhase, setCurrentPhase] = useState(0);

  // 学习计划数据
  const studyPlan = {
    name: '四级进阶计划',
    targetScore: 100,
    currentScore: 75,
    startDate: '2024-03-01',
    endDate: '2024-12-01',
    duration: 9,
    dailyTime: 60,
    completedDays: 45,
    totalDays: 270,
  };

  // 学习阶段
  const phases = [
    {
      title: '查漏补缺',
      duration: '第1-2个月',
      description: '快速过一遍四级词汇，标记薄弱词',
      status: 'completed',
      progress: 100,
      tasks: {
        vocabulary: { time: 25, count: 20, type: 'diagnostic' },
        reading: { time: 20, type: 'toefl' },
        listening: { time: 15, type: 'toefl' },
      },
      milestones: ['四级词汇掌握度达到90%'],
    },
    {
      title: '专项提升',
      duration: '第3-6个月',
      description: '全科均衡发展，技巧训练',
      status: 'current',
      progress: 35,
      tasks: {
        vocabulary: { time: 15, count: 15, type: 'toefl' },
        reading: { time: 20, type: 'toefl' },
        listening: { time: 15, type: 'toefl' },
        speaking: { time: 10, type: 'practice' },
        writing: { time: 10, type: 'practice' },
      },
      milestones: ['TPO阅读22+', '听力22+', '口语能完成45秒回答'],
    },
    {
      title: '冲刺模考',
      duration: '第7-9个月',
      description: '全真模考，考前冲刺',
      status: 'pending',
      progress: 0,
      tasks: {
        vocabulary: { time: 10, count: 10, type: 'review' },
        reading: { time: 20, type: 'mock' },
        listening: { time: 15, type: 'mock' },
        speaking: { time: 10, type: 'mock' },
        writing: { time: 15, type: 'mock' },
      },
      milestones: ['模考100+', '达到目标分数'],
    },
  ];

  // 今日任务
  const todayTasks = [
    { id: 1, title: '词汇学习', description: '学习15个托福高频词', time: 15, completed: false, type: 'vocabulary' },
    { id: 2, title: '阅读练习', description: '完成1篇TPO阅读', time: 20, completed: false, type: 'reading' },
    { id: 3, title: '听力训练', description: '精听1段TPO听力', time: 15, completed: true, type: 'listening' },
    { id: 4, title: '口语练习', description: '练习独立口语Task 1', time: 10, completed: false, type: 'speaking' },
    { id: 5, title: '写作练习', description: '写1篇独立写作', time: 10, completed: false, type: 'writing' },
  ];

  // 学习日历数据
  const getCalendarData = (value) => {
    const date = value.format('YYYY-MM-DD');
    // 模拟一些学习记录
    if (date === '2024-03-10') {
      return <Badge status="success" text="已完成" />;
    }
    if (date === '2024-03-09') {
      return <Badge status="success" text="已完成" />;
    }
    if (date === '2024-03-08') {
      return <Badge status="warning" text="部分完成" />;
    }
    return null;
  };

  const getTaskIcon = (type) => {
    switch (type) {
      case 'vocabulary': return <BookOutlined />;
      case 'reading': return <BookOutlined />;
      case 'listening': return <BookOutlined />;
      case 'speaking': return <BookOutlined />;
      case 'writing': return <BookOutlined />;
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
      <h2>学习计划 📅</h2>

      {/* 计划概览 */}
      <Card style={{ marginBottom: 24 }}>
        <Row gutter={16} align="middle">
          <Col span={16}>
            <h3>{studyPlan.name}</h3>
            <p style={{ color: '#666' }}>
              目标分数: <Tag color="red">{studyPlan.targetScore}分</Tag>
              当前预估: <Tag color="blue">{studyPlan.currentScore}分</Tag>
            </p>
            <Progress 
              percent={Math.round((studyPlan.completedDays / studyPlan.totalDays) * 100)} 
              status="active"
              format={() => `${studyPlan.completedDays}/${studyPlan.totalDays}天`}
            />
          </Col>
          <Col span={8} style={{ textAlign: 'center' }}>
            <Statistic
              title="连续打卡"
              value={7}
              suffix="天"
              prefix={<FireOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Col>
        </Row>
      </Card>

      {/* 学习阶段 */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        {phases.map((phase, index) => (
          <Col span={8} key={index}>
            <Card 
              title={phase.title}
              extra={<Tag color={phase.status === 'completed' ? 'success' : phase.status === 'current' ? 'processing' : 'default'}>
                {phase.status === 'completed' ? '已完成' : phase.status === 'current' ? '进行中' : '未开始'}
              </Tag>}
              style={{ height: '100%' }}
            >
              <p style={{ color: '#666' }}>{phase.duration}</p>
              <p>{phase.description}</p>
              <Progress percent={phase.progress} size="small" />
              <div style={{ marginTop: 12 }}>
                <h5>每日任务:</h5>
                <div>
                  {Object.entries(phase.tasks).map(([key, task]) => (
                    <Tag key={key} size="small" style={{ margin: '2px' }}>
                      {key}: {task.time}分钟
                    </Tag>
                  ))}
                </div>
              </div>
              <div style={{ marginTop: 12 }}>
                <h5>阶段目标:</h5>
                <ul style={{ paddingLeft: 16 }}>
                  {phase.milestones.map((milestone, idx) => (
                    <li key={idx} style={{ fontSize: 12, color: '#666' }}>{milestone}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 今日任务和日历 */}
      <Row gutter={16}>
        <Col span={12}>
          <Card 
            title="今日任务" 
            extra={<Button type="primary">开始学习</Button>}
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
                    </Button>,
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
          <Card title="学习日历">
            <Calendar 
              fullscreen={false} 
              dateCellRender={getCalendarData}
            />
          </Card>
        </Col>
      </Row>

      {/* 学习统计 */}
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="本周学习时长"
              value={420}
              suffix="分钟"
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本周完成任务"
              value={35}
              suffix="个"
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="词汇增长"
              value={105}
              suffix="个"
              prefix={<BookOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="距离考试"
              value={85}
              suffix="天"
              prefix={<TargetOutlined style={{ color: '#ff4d4f' }} />}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudyPlan;
