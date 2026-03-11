<template>
  <view class="container">
    <!-- 学习进度概览 -->
    <view class="progress-card">
      <view class="progress-header">
        <text class="progress-title">学习进度</text>
        <text class="progress-days">第 {{ currentDay }} 天 / 共 {{ totalDays }} 天</text>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: (currentDay/totalDays*100) + '%' }"></view>
      </view>
      <view class="progress-stats">
        <view class="stat-item">
          <text class="stat-num">{{ stats.completed }}</text>
          <text class="stat-label">已完成</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.remaining }}</text>
          <text class="stat-label">剩余任务</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ stats.streak }}</text>
          <text class="stat-label">连续打卡</text>
        </view>
      </view>
    </view>

    <!-- 目标分数 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">目标设定</text>
        <text class="card-action" @click="editTarget">修改</text>
      </view>
      <view class="target-display">
        <view class="target-item">
          <text class="target-label">当前水平</text>
          <text class="target-value">{{ target.current }}</text>
        </view>
        <view class="target-arrow">→</view>
        <view class="target-item">
          <text class="target-label">目标分数</text>
          <text class="target-value highlight">{{ target.goal }}</text>
        </view>
        <view class="target-item">
          <text class="target-label">考试日期</text>
          <text class="target-value">{{ target.examDate }}</text>
        </view>
      </view>
      <view class="score-breakdown">
        <view class="score-item" v-for="(item, index) in target.breakdown" :key="index">
          <text class="score-name">{{ item.name }}</text>
          <view class="score-bar">
            <view class="score-current" :style="{ width: (item.current/30*100) + '%' }"></view>
            <view class="score-goal" :style="{ width: ((item.goal-item.current)/30*100) + '%', left: (item.current/30*100) + '%' }"></view>
          </view>
          <view class="score-values">
            <text class="current">{{ item.current }}</text>
            <text class="goal">→ {{ item.goal }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 今日学习计划 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">今日计划</text>
        <text class="card-date">{{ today }}</text>
      </view>
      <view class="plan-timeline">
        <view 
          class="timeline-item" 
          v-for="(task, index) in todayPlan" 
          :key="task.id"
          :class="{ completed: task.completed, active: task.active }"
        >
          <view class="timeline-dot"></view>
          <view class="timeline-content">
            <view class="task-header">
              <text class="task-time">{{ task.time }}</text>
              <text class="task-duration">{{ task.duration }}分钟</text>
            </view>
            <view class="task-body">
              <text class="task-name">{{ task.name }}</text>
              <text class="task-desc">{{ task.desc }}</text>
            </view>
            <view class="task-footer">
              <text class="task-type">{{ task.type }}</text>
              <text 
                class="task-action" 
                :class="{ done: task.completed }"
                @click="toggleTask(task)"
              >{{ task.completed ? '已完成' : '去完成' }}</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 本周学习日历 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">本周日历</text>
        <text class="card-action" @click="viewFullCalendar">查看全部</text>
      </view>
      <view class="calendar-grid">
        <view 
          class="calendar-day" 
          v-for="(day, index) in weekDays" 
          :key="index"
          :class="{ today: day.isToday, completed: day.completed }"
        >
          <text class="day-name">{{ day.name }}</text>
          <text class="day-num">{{ day.date }}</text>
          <view class="day-status">
            <text v-if="day.completed" class="status-check">✓</text>
            <text v-else-if="day.isToday" class="status-dot"></text>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习统计 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">学习统计</text>
      </view>
      <view class="chart-container">
        <view class="chart-title">近7天学习时长（分钟）</view>
        <view class="bar-chart">
          <view 
            class="chart-bar" 
            v-for="(day, index) in weeklyStats" 
            :key="index"
          >
            <view class="bar-fill" :style="{ height: (day.minutes/120*100) + '%' }"></view>
            <text class="bar-label">{{ day.day }}</text>
            <text class="bar-value">{{ day.minutes }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习建议 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">🤖 AI 学习建议</text>
      </view>
      <view class="suggestion-list">
        <view class="suggestion-item" v-for="(suggestion, index) in suggestions" :key="index">
          <text class="suggestion-icon">{{ suggestion.icon }}</text>
          <view class="suggestion-content">
            <text class="suggestion-title">{{ suggestion.title }}</text>
            <text class="suggestion-desc">{{ suggestion.desc }}</text>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      currentDay: 15,
      totalDays: 90,
      stats: {
        completed: 14,
        remaining: 3,
        streak: 7
      },
      target: {
        current: '四级水平',
        goal: 100,
        examDate: '2026-06-15',
        breakdown: [
          { name: '阅读', current: 18, goal: 26 },
          { name: '听力', current: 17, goal: 25 },
          { name: '口语', current: 16, goal: 24 },
          { name: '写作', current: 17, goal: 25 }
        ]
      },
      today: '3月11日 周三',
      todayPlan: [
        {
          id: 1,
          time: '08:00',
          duration: 30,
          name: '词汇学习',
          desc: '托福核心词汇 20个新词 + 复习',
          type: '词汇',
          completed: true,
          active: false
        },
        {
          id: 2,
          time: '09:00',
          duration: 45,
          name: '阅读练习',
          desc: 'TPO 阅读 passage 1',
          type: '阅读',
          completed: true,
          active: false
        },
        {
          id: 3,
          time: '14:00',
          duration: 60,
          name: '口语练习',
          desc: '独立口语 Task 1 & 2',
          type: '口语',
          completed: false,
          active: true
        },
        {
          id: 4,
          time: '16:00',
          duration: 45,
          name: '听力训练',
          desc: 'TPO 听力 conversation',
          type: '听力',
          completed: false,
          active: false
        },
        {
          id: 5,
          time: '20:00',
          duration: 30,
          name: '写作练习',
          desc: '独立写作练习 + AI批改',
          type: '写作',
          completed: false,
          active: false
        }
      ],
      weekDays: [
        { name: '周一', date: '9', isToday: false, completed: true },
        { name: '周二', date: '10', isToday: false, completed: true },
        { name: '周三', date: '11', isToday: true, completed: false },
        { name: '周四', date: '12', isToday: false, completed: false },
        { name: '周五', date: '13', isToday: false, completed: false },
        { name: '周六', date: '14', isToday: false, completed: false },
        { name: '周日', date: '15', isToday: false, completed: false }
      ],
      weeklyStats: [
        { day: '一', minutes: 90 },
        { day: '二', minutes: 120 },
        { day: '三', minutes: 75 },
        { day: '四', minutes: 105 },
        { day: '五', minutes: 60 },
        { day: '六', minutes: 150 },
        { day: '日', minutes: 120 }
      ],
      suggestions: [
        {
          icon: '📈',
          title: '口语练习需要加强',
          desc: '本周口语练习时长较少，建议每天增加15分钟口语练习'
        },
        {
          icon: '🎯',
          title: '词汇量稳步提升',
          desc: '已掌握450个托福核心词，继续保持每天20个新词的学习节奏'
        },
        {
          icon: '⏰',
          title: '建议调整学习时间',
          desc: '根据你的学习数据，上午9-11点效率最高，可将难点任务安排在此时间段'
        }
      ]
    }
  },
  methods: {
    editTarget() {
      uni.showToast({ title: '修改目标', icon: 'none' })
    },
    toggleTask(task) {
      task.completed = !task.completed
      if (task.completed) {
        this.stats.completed++
        this.stats.remaining--
        uni.showToast({ title: '任务完成！', icon: 'success' })
      } else {
        this.stats.completed--
        this.stats.remaining++
      }
    },
    viewFullCalendar() {
      uni.showToast({ title: '查看完整日历', icon: 'none' })
    }
  }
}
</script>

<style lang="scss">
.container {
  padding: 20rpx;
  background: #f5f5f5;
  min-height: 100vh;
}

.progress-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  color: #fff;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.progress-title {
  font-size: 32rpx;
  font-weight: bold;
}

.progress-days {
  font-size: 26rpx;
  opacity: 0.9;
}

.progress-bar {
  height: 16rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 8rpx;
  overflow: hidden;
  margin-bottom: 30rpx;
}

.progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 8rpx;
  transition: width 0.3s;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.8;
  margin-top: 8rpx;
  display: block;
}

.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 32rpx;
  font-weight: bold;
}

.card-action {
  font-size: 26rpx;
  color: #1890ff;
}

.card-date {
  font-size: 26rpx;
  color: #999;
}

.target-display {
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 20rpx 0;
  margin-bottom: 30rpx;
}

.target-item {
  text-align: center;
}

.target-label {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.target-value {
  font-size: 36rpx;
  font-weight: bold;
  margin-top: 8rpx;
  display: block;
  
  &.highlight {
    color: #1890ff;
    font-size: 48rpx;
  }
}

.target-arrow {
  font-size: 40rpx;
  color: #999;
}

.score-breakdown {
  .score-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
}

.score-name {
  width: 100rpx;
  font-size: 28rpx;
}

.score-bar {
  flex: 1;
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  margin: 0 20rpx;
  position: relative;
  overflow: hidden;
}

.score-current {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: #1890ff;
  border-radius: 8rpx;
}

.score-goal {
  position: absolute;
  top: 0;
  height: 100%;
  background: #52c41a;
  border-radius: 0 8rpx 8rpx 0;
}

.score-values {
  width: 120rpx;
  text-align: right;
}

.current {
  font-size: 28rpx;
  font-weight: bold;
  color: #1890ff;
}

.goal {
  font-size: 24rpx;
  color: #52c41a;
}

.plan-timeline {
  position: relative;
  padding-left: 40rpx;
}

.timeline-item {
  position: relative;
  padding-bottom: 30rpx;
  
  &.completed {
    .timeline-dot {
      background: #52c41a;
    }
  }
  
  &.active {
    .timeline-dot {
      background: #1890ff;
      animation: pulse 1.5s infinite;
    }
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.timeline-dot {
  position: absolute;
  left: -40rpx;
  top: 8rpx;
  width: 20rpx;
  height: 20rpx;
  background: #d9d9d9;
  border-radius: 50%;
}

.timeline-content {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 24rpx;
}

.task-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.task-time {
  font-size: 28rpx;
  font-weight: bold;
  color: #1890ff;
}

.task-duration {
  font-size: 24rpx;
  color: #999;
}

.task-body {
  margin-bottom: 16rpx;
}

.task-name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.task-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.task-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-type {
  font-size: 22rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
}

.task-action {
  font-size: 26rpx;
  color: #1890ff;
  padding: 8rpx 24rpx;
  border: 1rpx solid #1890ff;
  border-radius: 8rpx;
  
  &.done {
    color: #52c41a;
    border-color: #52c41a;
    background: #f6ffed;
  }
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 16rpx;
}

.calendar-day {
  text-align: center;
  padding: 20rpx 0;
  border-radius: 12rpx;
  background: #f8f8f8;
  
  &.today {
    background: #e6f7ff;
    border: 2rpx solid #1890ff;
  }
  
  &.completed {
    background: #f6ffed;
  }
}

.day-name {
  font-size: 24rpx;
  color: #999;
  display: block;
}

.day-num {
  font-size: 32rpx;
  font-weight: bold;
  margin-top: 8rpx;
  display: block;
}

.day-status {
  margin-top: 8rpx;
}

.status-check {
  color: #52c41a;
  font-size: 28rpx;
}

.status-dot {
  width: 16rpx;
  height: 16rpx;
  background: #1890ff;
  border-radius: 50%;
  display: inline-block;
}

.chart-container {
  padding: 20rpx 0;
}

.chart-title {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 30rpx;
  text-align: center;
}

.bar-chart {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  height: 200rpx;
  padding-bottom: 40rpx;
}

.chart-bar {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 60rpx;
}

.bar-fill {
  width: 100%;
  background: linear-gradient(180deg, #1890ff, #52c41a);
  border-radius: 8rpx 8rpx 0 0;
  min-height: 4rpx;
}

.bar-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 12rpx;
}

.bar-value {
  font-size: 22rpx;
  color: #1890ff;
  position: absolute;
  bottom: 60rpx;
}

.suggestion-list {
  .suggestion-item {
    display: flex;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.suggestion-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.suggestion-content {
  flex: 1;
}

.suggestion-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.suggestion-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  line-height: 1.5;
  display: block;
}
</style>
