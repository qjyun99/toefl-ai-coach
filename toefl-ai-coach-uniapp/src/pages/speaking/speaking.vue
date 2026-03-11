<template>
  <view class="container">
    <!-- 口语能力评估 -->
    <view class="ability-card">
      <view class="ability-header">
        <text class="ability-title">口语能力</text>
        <text class="ability-score">{{ overallScore }}</text>
      </view>
      <view class="ability-bars">
        <view class="ability-item" v-for="(item, index) in abilities" :key="index">
          <text class="ability-name">{{ item.name }}</text>
          <view class="ability-bar">
            <view class="ability-fill" :style="{ width: item.score + '%' }"></view>
          </view>
          <text class="ability-value">{{ item.score }}</text>
        </view>
      </view>
    </view>

    <!-- 练习模式 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">练习模式</text>
      </view>
      <view class="mode-list">
        <view class="mode-card" @click="startPractice('independent')">
          <view class="mode-icon">🎤</view>
          <view class="mode-info">
            <text class="mode-name">独立口语</text>
            <text class="mode-desc">Task 1 & 2 - 个人观点表达</text>
          </view>
          <text class="mode-arrow">›</text>
        </view>
        <view class="mode-card" @click="startPractice('integrated')">
          <view class="mode-icon">🎧</view>
          <view class="mode-info">
            <text class="mode-name">综合口语</text>
            <text class="mode-desc">Task 3 & 4 - 听力阅读综合</text>
          </view>
          <text class="mode-arrow">›</text>
        </view>
        <view class="mode-card" @click="startPractice('mock')">
          <view class="mode-icon">📝</view>
          <view class="mode-info">
            <text class="mode-name">全真模拟</text>
            <text class="mode-desc">完整4题模拟考试</text>
          </view>
          <text class="mode-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 今日任务 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">今日任务</text>
        <text class="card-progress">{{ completedTasks }}/{{ todayTasks.length }}</text>
      </view>
      <view class="task-list">
        <view 
          class="task-item" 
          v-for="(task, index) in todayTasks" 
          :key="task.id"
          :class="{ completed: task.completed }"
          @click="startTask(task)"
        >
          <view class="task-icon">{{ task.icon }}</view>
          <view class="task-content">
            <text class="task-title">{{ task.title }}</text>
            <text class="task-desc">{{ task.desc }}</text>
          </view>
          <view class="task-status">
            <text v-if="task.completed" class="status-completed">✓</text>
            <text v-else class="status-pending">○</text>
          </view>
        </view>
      </view>
    </view>

    <!-- AI反馈记录 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">最近练习</text>
        <text class="card-action" @click="viewHistory">查看全部</text>
      </view>
      <view class="record-list">
        <view class="record-item" v-for="(record, index) in recentRecords" :key="index">
          <view class="record-info">
            <text class="record-type">{{ record.type }}</text>
            <text class="record-time">{{ record.time }}</text>
          </view>
          <view class="record-score">
            <text class="score-value">{{ record.score }}</text>
            <text class="score-label">分</text>
          </view>
          <view class="record-feedback">
            <text class="feedback-text">{{ record.feedback }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 练习弹窗 -->
    <view class="modal" v-if="showPracticeModal" @click="closePracticeModal">
      <view class="practice-content" @click.stop>
        <view class="practice-header">
          <text class="practice-title">{{ currentTask.title }}</text>
          <text class="practice-desc">{{ currentTask.desc }}</text>
        </view>
        
        <scroll-view scroll-y class="practice-body">
          <!-- 准备阶段 -->
          <view class="stage-section" v-if="practiceStage === 'prepare'">
            <view class="stage-badge">准备时间</view>
            <view class="timer-display">
              <text class="timer-value">{{ formatTime(prepareTime) }}</text>
            </view>
            <view class="question-box">
              <text class="question-label">题目</text>
              <text class="question-text">{{ currentTask.question }}</text>
            </view>
            <text class="stage-tip">准备你的观点和例子</text>
          </view>
          
          <!-- 录音阶段 -->
          <view class="stage-section" v-if="practiceStage === 'record'">
            <view class="stage-badge recording">录音中</view>
            <view class="timer-display">
              <text class="timer-value recording">{{ formatTime(recordTime) }}</text>
            </view>
            <view class="recording-indicator">
              <view class="wave-bar" v-for="n in 5" :key="n"></view>
            </view>
            <text class="stage-tip">正在录音，请清晰表达</text>
          </view>
          
          <!-- 完成阶段 -->
          <view class="stage-section" v-if="practiceStage === 'done'">
            <view class="stage-badge completed">已完成</view>
            <view class="audio-player">
              <text class="player-icon">▶️</text>
              <view class="player-progress">
                <view class="progress-bar">
                  <view class="progress-fill" style="width: 0%"></view>
                </view>
              </view>
              <text class="player-time">0:45</text>
            </view>
            <view class="ai-feedback">
              <text class="feedback-title">🤖 AI 反馈</text>
              <view class="feedback-item">
                <text class="feedback-label">流利度</text>
                <text class="feedback-value good">良好 - 语速适中，停顿自然</text>
              </view>
              <view class="feedback-item">
                <text class="feedback-label">发音</text>
                <text class="feedback-value warn">需改进 - 注意 /θ/ 和 /ð/ 的发音</text>
              </view>
              <view class="feedback-item">
                <text class="feedback-label">内容</text>
                <text class="feedback-value good">优秀 - 观点清晰，例子具体</text>
              </view>
              <view class="feedback-item">
                <text class="feedback-label">语法</text>
                <text class="feedback-value good">良好 - 基本无语法错误</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="practice-footer">
          <text v-if="practiceStage === 'prepare'" class="btn-primary" @click="startRecording">开始录音</text>
          <text v-if="practiceStage === 'record'" class="btn-danger" @click="stopRecording">结束录音</text>
          <text v-if="practiceStage === 'done'" class="btn-primary" @click="retryPractice">再练一次</text>
          <text class="btn-secondary" @click="closePracticeModal">关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      overallScore: 78,
      abilities: [
        { name: '流利度', score: 82 },
        { name: '发音', score: 75 },
        { name: '内容', score: 80 },
        { name: '语法', score: 85 }
      ],
      todayTasks: [
        {
          id: 1,
          icon: '🎯',
          title: '独立口语 Task 1',
          desc: '15秒准备，45秒回答',
          completed: false,
          question: 'Do you agree or disagree with the following statement? It is better to work in a team than to work alone. Use specific reasons and examples to support your answer.'
        },
        {
          id: 2,
          icon: '📚',
          title: '独立口语 Task 2',
          desc: '15秒准备，45秒回答',
          completed: true,
          question: 'Some people prefer to live in a big city. Others prefer to live in a small town. Which do you prefer and why?'
        },
        {
          id: 3,
          icon: '🎧',
          title: '综合口语 Task 3',
          desc: '阅读+听力，60秒回答',
          completed: false,
          question: 'The professor explains the concept of social loafing by using an example from a psychology experiment.'
        }
      ],
      recentRecords: [
        {
          type: '独立口语 Task 2',
          time: '今天 09:30',
          score: 26,
          feedback: '内容充实，发音清晰，注意语速控制'
        },
        {
          type: '综合口语 Task 3',
          time: '昨天 20:15',
          score: 24,
          feedback: '听力理解准确，转述完整'
        },
        {
          type: '独立口语 Task 1',
          time: '昨天 19:45',
          score: 25,
          feedback: '观点明确，例子恰当'
        }
      ],
      showPracticeModal: false,
      currentTask: {},
      practiceStage: 'prepare',
      prepareTime: 15,
      recordTime: 45,
      timer: null
    }
  },
  computed: {
    completedTasks() {
      return this.todayTasks.filter(t => t.completed).length
    }
  },
  methods: {
    startPractice(mode) {
      const modes = {
        independent: '独立口语',
        integrated: '综合口语',
        mock: '全真模拟'
      }
      uni.showToast({ title: `开始${modes[mode]}`, icon: 'none' })
    },
    startTask(task) {
      this.currentTask = task
      this.practiceStage = 'prepare'
      this.prepareTime = 15
      this.recordTime = 45
      this.showPracticeModal = true
      this.startPrepareTimer()
    },
    startPrepareTimer() {
      this.timer = setInterval(() => {
        if (this.prepareTime > 0) {
          this.prepareTime--
        } else {
          clearInterval(this.timer)
          this.startRecording()
        }
      }, 1000)
    },
    startRecording() {
      clearInterval(this.timer)
      this.practiceStage = 'record'
      this.timer = setInterval(() => {
        if (this.recordTime > 0) {
          this.recordTime--
        } else {
          this.stopRecording()
        }
      }, 1000)
    },
    stopRecording() {
      clearInterval(this.timer)
      this.practiceStage = 'done'
      this.currentTask.completed = true
    },
    retryPractice() {
      this.practiceStage = 'prepare'
      this.prepareTime = 15
      this.recordTime = 45
      this.startPrepareTimer()
    },
    closePracticeModal() {
      clearInterval(this.timer)
      this.showPracticeModal = false
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    viewHistory() {
      uni.showToast({ title: '查看历史记录', icon: 'none' })
    }
  },
  onUnload() {
    if (this.timer) {
      clearInterval(this.timer)
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

.ability-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  color: #fff;
}

.ability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30rpx;
}

.ability-title {
  font-size: 32rpx;
  font-weight: bold;
}

.ability-score {
  font-size: 64rpx;
  font-weight: bold;
}

.ability-bars {
  .ability-item {
    display: flex;
    align-items: center;
    margin-bottom: 20rpx;
  }
}

.ability-name {
  width: 120rpx;
  font-size: 26rpx;
}

.ability-bar {
  flex: 1;
  height: 16rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 8rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.ability-fill {
  height: 100%;
  background: #fff;
  border-radius: 8rpx;
  transition: width 0.3s;
}

.ability-value {
  width: 60rpx;
  text-align: right;
  font-size: 28rpx;
  font-weight: bold;
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

.card-progress {
  font-size: 28rpx;
  color: #1890ff;
}

.card-action {
  font-size: 26rpx;
  color: #1890ff;
}

.mode-list {
  .mode-card {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background: #f8f8f8;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
  }
}

.mode-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.mode-info {
  flex: 1;
}

.mode-name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.mode-desc {
  font-size: 26rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.mode-arrow {
  font-size: 40rpx;
  color: #999;
}

.task-list {
  .task-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &.completed {
      opacity: 0.6;
    }
  }
}

.task-icon {
  width: 80rpx;
  height: 80rpx;
  background: #e6f7ff;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.task-content {
  flex: 1;
}

.task-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.task-desc {
  font-size: 26rpx;
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
}

.status-pending {
  color: #d9d9d9;
  font-size: 40rpx;
}

.record-list {
  .record-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.record-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12rpx;
}

.record-type {
  font-size: 30rpx;
  font-weight: bold;
}

.record-time {
  font-size: 24rpx;
  color: #999;
}

.record-score {
  display: flex;
  align-items: baseline;
  margin-bottom: 12rpx;
}

.score-value {
  font-size: 48rpx;
  font-weight: bold;
  color: #1890ff;
}

.score-label {
  font-size: 24rpx;
  color: #999;
  margin-left: 8rpx;
}

.feedback-text {
  font-size: 26rpx;
  color: #666;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  z-index: 1000;
}

.practice-content {
  position: absolute;
  top: 5%;
  left: 5%;
  right: 5%;
  bottom: 5%;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.practice-header {
  padding: 30rpx;
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: #fff;
}

.practice-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}

.practice-desc {
  font-size: 26rpx;
  opacity: 0.9;
  margin-top: 12rpx;
  display: block;
}

.practice-body {
  flex: 1;
  padding: 30rpx;
}

.stage-section {
  text-align: center;
}

.stage-badge {
  display: inline-block;
  padding: 12rpx 30rpx;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 30rpx;
  font-size: 28rpx;
  margin-bottom: 30rpx;
  
  &.recording {
    background: #fff1f0;
    color: #ff4d4f;
    animation: pulse 1s infinite;
  }
  
  &.completed {
    background: #f6ffed;
    color: #52c41a;
  }
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.timer-display {
  margin: 40rpx 0;
}

.timer-value {
  font-size: 96rpx;
  font-weight: bold;
  color: #333;
  
  &.recording {
    color: #ff4d4f;
  }
}

.question-box {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 30rpx;
  margin: 30rpx 0;
}

.question-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 16rpx;
  display: block;
}

.question-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #333;
}

.stage-tip {
  font-size: 28rpx;
  color: #999;
}

.recording-indicator {
  display: flex;
  justify-content: center;
  gap: 12rpx;
  margin: 40rpx 0;
}

.wave-bar {
  width: 12rpx;
  height: 60rpx;
  background: #ff4d4f;
  border-radius: 6rpx;
  animation: wave 0.5s ease-in-out infinite;
  
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.2s; }
  &:nth-child(4) { animation-delay: 0.3s; }
  &:nth-child(5) { animation-delay: 0.4s; }
}

@keyframes wave {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.5); }
}

.audio-player {
  display: flex;
  align-items: center;
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  margin: 30rpx 0;
}

.player-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.player-progress {
  flex: 1;
  margin-right: 20rpx;
}

.progress-bar {
  height: 8rpx;
  background: #ddd;
  border-radius: 4rpx;
}

.progress-fill {
  height: 100%;
  background: #1890ff;
  border-radius: 4rpx;
}

.player-time {
  font-size: 26rpx;
  color: #666;
}

.ai-feedback {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 30rpx;
  margin-top: 30rpx;
}

.feedback-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.feedback-item {
  display: flex;
  margin-bottom: 16rpx;
}

.feedback-label {
  width: 140rpx;
  font-size: 28rpx;
  color: #666;
}

.feedback-value {
  flex: 1;
  font-size: 28rpx;
  
  &.good { color: #52c41a; }
  &.warn { color: #faad14; }
}

.practice-footer {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-primary, .btn-secondary, .btn-danger {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
}

.btn-primary {
  background: #1890ff;
  color: #fff;
}

.btn-secondary {
  background: #f5f5f5;
  color: #666;
}

.btn-danger {
  background: #ff4d4f;
  color: #fff;
}
</style>
