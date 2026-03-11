<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-info">
        <image class="avatar" src="/static/default-avatar.png" mode="aspectFill" />
        <view class="user-meta">
          <text class="username">{{ userInfo.username || '托福学员' }}</text>
          <text class="level">{{ userInfo.level || '四级进阶' }}</text>
        </view>
      </view>
      <view class="target-score">
        <text class="label">目标分数</text>
        <text class="score">{{ userInfo.targetScore || 100 }}</text>
      </view>
    </view>

    <!-- 学习统计 -->
    <view class="stats-grid">
      <view class="stat-item">
        <text class="stat-value">{{ stats.studyDays }}</text>
        <text class="stat-label">学习天数</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.streak }}</text>
        <text class="stat-label">连续打卡</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.vocabularyCount }}</text>
        <text class="stat-label">已学词汇</text>
      </view>
      <view class="stat-item">
        <text class="stat-value">{{ stats.totalTime }}h</text>
        <text class="stat-label">学习时长</text>
      </view>
    </view>

    <!-- 能力雷达图 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">能力分析</text>
      </view>
      <view class="ability-list">
        <view class="ability-item" v-for="(item, index) in abilities" :key="index">
          <text class="ability-name">{{ item.name }}</text>
          <view class="ability-bar">
            <view class="ability-progress" :style="{ width: item.score + '%' }"></view>
          </view>
          <text class="ability-score">{{ item.score }}</text>
        </view>
      </view>
    </view>

    <!-- 今日任务 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">今日任务</text>
        <text class="card-subtitle">{{ completedTasks }}/{{ todayTasks.length }}</text>
      </view>
      <view class="task-list">
        <view 
          class="task-item" 
          v-for="(task, index) in todayTasks" 
          :key="task.id"
          @click="goToTask(task)"
        >
          <view class="task-icon" :class="task.type">
            <text class="icon-text">{{ getTaskIcon(task.type) }}</text>
          </view>
          <view class="task-content">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.description }}</text>
          </view>
          <view class="task-status">
            <text v-if="task.completed" class="status-completed">✓</text>
            <text v-else class="status-pending">○</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 快捷入口 -->
    <view class="quick-actions">
      <view class="action-item" @click="navigateTo('/pages/vocabulary/vocabulary')">
        <view class="action-icon vocabulary">📚</view>
        <text class="action-text">词汇</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/reading/reading')">
        <view class="action-icon reading">📖</view>
        <text class="action-text">阅读</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/speaking/speaking')">
        <view class="action-icon speaking">🎤</view>
        <text class="action-text">口语</text>
      </view>
      <view class="action-item" @click="navigateTo('/pages/writing/writing')">
        <view class="action-icon writing">✍️</view>
        <text class="action-text">写作</text>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        username: '托福学员',
        level: '四级进阶',
        targetScore: 100
      },
      stats: {
        studyDays: 15,
        streak: 7,
        vocabularyCount: 450,
        totalTime: 45
      },
      abilities: [
        { name: '词汇', score: 45 },
        { name: '阅读', score: 75 },
        { name: '听力', score: 70 },
        { name: '口语', score: 60 },
        { name: '写作', score: 65 }
      ],
      todayTasks: [
        { id: 1, title: '词汇学习', description: '学习20个新单词', completed: false, type: 'vocabulary' },
        { id: 2, title: '阅读练习', description: '完成1篇托福阅读', completed: false, type: 'reading' },
        { id: 3, title: '听力训练', description: '精听1段TPO听力', completed: true, type: 'listening' },
        { id: 4, title: '口语练习', description: '练习独立口语', completed: false, type: 'speaking' }
      ]
    }
  },
  computed: {
    completedTasks() {
      return this.todayTasks.filter(t => t.completed).length
    }
  },
  methods: {
    getTaskIcon(type) {
      const icons = {
        vocabulary: '词',
        reading: '读',
        listening: '听',
        speaking: '说',
        writing: '写'
      }
      return icons[type] || '学'
    },
    goToTask(task) {
      const routes = {
        vocabulary: '/pages/vocabulary/vocabulary',
        reading: '/pages/reading/reading',
        listening: '/pages/speaking/speaking',
        speaking: '/pages/speaking/speaking',
        writing: '/pages/writing/writing'
      }
      uni.navigateTo({ url: routes[task.type] || '/pages/index/index' })
    },
    navigateTo(url) {
      uni.switchTab({ url })
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

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}

.user-info {
  display: flex;
  align-items: center;
}

.avatar {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
}

.user-meta {
  margin-left: 20rpx;
}

.username {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}

.level {
  font-size: 24rpx;
  opacity: 0.9;
  margin-top: 8rpx;
  display: block;
}

.target-score {
  text-align: center;
}

.target-score .label {
  font-size: 24rpx;
  opacity: 0.9;
  display: block;
}

.target-score .score {
  font-size: 48rpx;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.stat-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 20rpx;
  text-align: center;
}

.stat-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #1890ff;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  color: #999;
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

.card-subtitle {
  font-size: 28rpx;
  color: #999;
}

.ability-list {
  .ability-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
}

.ability-name {
  width: 100rpx;
  font-size: 28rpx;
}

.ability-bar {
  flex: 1;
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.ability-progress {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #52c41a);
  border-radius: 8rpx;
  transition: width 0.3s;
}

.ability-score {
  width: 60rpx;
  text-align: right;
  font-size: 28rpx;
  color: #1890ff;
  font-weight: bold;
}

.task-list {
  .task-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20rpx;
  
  &.vocabulary { background: #e6f7ff; }
  &.reading { background: #f6ffed; }
  &.listening { background: #fff7e6; }
  &.speaking { background: #f9f0ff; }
  &.writing { background: #fff1f0; }
}

.icon-text {
  font-size: 32rpx;
  font-weight: bold;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 30rpx;
  font-weight: 500;
  display: block;
}

.task-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.task-status {
  width: 60rpx;
  text-align: center;
}

.status-completed {
  color: #52c41a;
  font-size: 40rpx;
  font-weight: bold;
}

.status-pending {
  color: #d9d9d9;
  font-size: 40rpx;
}

.quick-actions {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
  margin-top: 20rpx;
}

.action-item {
  background: #fff;
  border-radius: 16rpx;
  padding: 30rpx 20rpx;
  text-align: center;
}

.action-icon {
  width: 100rpx;
  height: 100rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16rpx;
  font-size: 48rpx;
  
  &.vocabulary { background: #e6f7ff; }
  &.reading { background: #f6ffed; }
  &.speaking { background: #fff7e6; }
  &.writing { background: #f9f0ff; }
}

.action-text {
  font-size: 28rpx;
  color: #666;
}
</style>
