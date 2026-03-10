import { useState } from 'react';
import { Card, Avatar, Button, Form, Input, Tag, Statistic, Row, Col, List, Progress, Tabs, Badge } from 'antd';
import {
  UserOutlined,
  EditOutlined,
  TrophyOutlined,
  FireOutlined,
  ClockCircleOutlined,
  BookOutlined,
  SettingOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();

  // 用户数据
  const userData = {
    username: '托福学员',
    email: 'student@example.com',
    avatar: '',
    targetScore: 100,
    currentLevel: '四级进阶',
    joinDate: '2024-03-01',
    studyDays: 45,
    streak: 7,
    totalStudyTime: 45, // 小时
  };

  // 成就数据
  const achievements = [
    { id: 1, title: '初次打卡', description: '完成第一次学习', icon: '🎯', unlocked: true, date: '2024-03-01' },
    { id: 2, title: '坚持7天', description: '连续学习7天', icon: '🔥', unlocked: true, date: '2024-03-07' },
    { id: 3, title: '词汇达人', description: '掌握500个单词', icon: '📚', unlocked: true, date: '2024-03-10' },
    { id: 4, title: '阅读先锋', description: '完成20篇阅读', icon: '📖', unlocked: true, date: '2024-03-12' },
    { id: 5, title: '口语之星', description: '完成30个口语任务', icon: '🎤', unlocked: false },
    { id: 6, title: '写作高手', description: '完成20篇作文', icon: '✍️', unlocked: false },
    { id: 7, title: '坚持30天', description: '连续学习30天', icon: '💎', unlocked: false },
    { id: 8, title: '托福预备', description: '词汇量达到8000', icon: '🏆', unlocked: false },
  ];

  // 学习统计
  const studyStats = {
    vocabulary: { learned: 450, mastered: 280, target: 10000 },
    reading: { completed: 25, averageScore: 75 },
    speaking: { completed: 30, averageScore: 22 },
    writing: { completed: 12, averageScore: 24 },
  };

  // 能力雷达图数据
  const abilityData = [
    { subject: '词汇', score: 45, fullMark: 100 },
    { subject: '阅读', score: 75, fullMark: 100 },
    { subject: '听力', score: 70, fullMark: 100 },
    { subject: '口语', score: 60, fullMark: 100 },
    { subject: '写作', score: 65, fullMark: 100 },
  ];

  const handleSave = (values) => {
    console.log('保存用户信息:', values);
    setIsEditing(false);
  };

  const renderBasicInfo = () => (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
        <Avatar size={100} icon={<UserOutlined />} style={{ marginRight: 24 }} />
        <div>
          <h2>{userData.username}</h2>
          <p style={{ color: '#666' }}>{userData.email}</p>
          <Tag color="blue">{userData.currentLevel}</Tag>
          <Tag color="red">目标: {userData.targetScore}分</Tag>
        </div>
      </div>

      {!isEditing ? (
        <>
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col span={8}>
              <Statistic title="学习天数" value={userData.studyDays} suffix="天" />
            </Col>
            <Col span={8}>
              <Statistic title="连续打卡" value={userData.streak} suffix="天" />
            </Col>
            <Col span={8}>
              <Statistic title="总学习时长" value={userData.totalStudyTime} suffix="小时" />
            </Col>
          </Row>
          <Button type="primary" icon={<EditOutlined />} onClick={() => setIsEditing(true)}>
            编辑资料
          </Button>
        </>
      ) : (
        <Form form={form} initialValues={userData} onFinish={handleSave}>
          <Form.Item name="username" label="昵称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="targetScore" label="目标分数">
            <Input type="number" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setIsEditing(false)}>取消</Button>
          </Form.Item>
        </Form>
      )}
    </Card>
  );

  const renderStats = () => (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="已学词汇"
              value={studyStats.vocabulary.learned}
              suffix={`/ ${studyStats.vocabulary.target}`}
              prefix={<BookOutlined />}
            />
            <Progress percent={Math.round(studyStats.vocabulary.learned / studyStats.vocabulary.target * 100)} size="small" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="阅读完成"
              value={studyStats.reading.completed}
              suffix="篇"
              prefix={<BookOutlined />}
            />
            <Progress percent={studyStats.reading.averageScore} size="small" status="active" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="口语练习"
              value={studyStats.speaking.completed}
              suffix="次"
              prefix={<BookOutlined />}
            />
            <Progress percent={studyStats.speaking.averageScore * 3} size="small" status="active" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="写作批改"
              value={studyStats.writing.completed}
              suffix="篇"
              prefix={<BookOutlined />}
            />
            <Progress percent={studyStats.writing.averageScore * 3} size="small" status="active" />
          </Card>
        </Col>
      </Row>

      <Card title="能力分析">
        <Row gutter={16}>
          <Col span={12}>
            {abilityData.map((item, index) => (
              <div key={index} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span>{item.subject}</span>
                  <span>{item.score}/100</span>
                </div>
                <Progress percent={item.score} size="small" />
              </div>
            ))}
          </Col>
          <Col span={12}>
            <div style={{ 
              height: 300, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: '#f6ffed',
              borderRadius: 8,
            }}>
              <p>能力雷达图占位</p>
            </div>
          </Col>
        </Row>
      </Card>
    </div>
  );

  const renderAchievements = () => (
    <Card title="我的成就">
      <Row gutter={[16, 16]}>
        {achievements.map(achievement => (
          <Col span={6} key={achievement.id}>
            <Card 
              style={{ 
                textAlign: 'center',
                opacity: achievement.unlocked ? 1 : 0.5,
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 8 }}>{achievement.icon}</div>
              <h4>{achievement.title}</h4>
              <p style={{ color: '#666', fontSize: 12 }}>{achievement.description}</p>
              {achievement.unlocked ? (
                <Tag color="success">已解锁</Tag>
              ) : (
                <Tag>未解锁</Tag>
              )}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );

  const renderSettings = () => (
    <Card title="设置">
      <Form layout="vertical">
        <Form.Item label="每日学习提醒">
          <Button type="primary">开启提醒</Button>
        </Form.Item>
        <Form.Item label="学习目标">
          <Input type="number" defaultValue={60} suffix="分钟/天" />
        </Form.Item>
        <Form.Item label="通知设置">
          <Button>配置通知</Button>
        </Form.Item>
        <Form.Item label="账号安全">
          <Button>修改密码</Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <div>
      <h2>个人中心 👤</h2>
      
      <Tabs defaultActiveKey="basic">
        <TabPane tab="基本信息" key="basic">
          {renderBasicInfo()}
        </TabPane>
        <TabPane tab="学习统计" key="stats">
          {renderStats()}
        </TabPane>
        <TabPane tab="我的成就" key="achievements">
          {renderAchievements()}
        </TabPane>
        <TabPane tab="设置" key="settings">
          {renderSettings()}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Profile;
