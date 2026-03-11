<template>
  <view class="container">
    <!-- 学习进度卡片 -->
    <view class="progress-card">
      <view class="progress-header">
        <text class="progress-title">词汇量诊断</text>
        <text class="progress-subtitle">基于四级词汇掌握情况</text>
      </view>
      <view class="progress-stats">
        <view class="stat-box">
          <text class="stat-num">{{ stats.mastered }}</text>
          <text class="stat-label">已掌握</text>
        </view>
        <view class="stat-box">
          <text class="stat-num">{{ stats.learning }}</text>
          <text class="stat-label">学习中</text>
        </view>
        <view class="stat-box">
          <text class="stat-num">{{ stats.remaining }}</text>
          <text class="stat-label">待学习</text>
        </view>
      </view>
      <view class="progress-bar">
        <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
      </view>
      <text class="progress-text">已完成 {{ progressPercent }}%</text>
    </view>

    <!-- 今日学习任务 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">今日任务</text>
        <text class="card-action" @click="resetTasks">重置</text>
      </view>
      <view class="task-progress">
        <text class="task-count">{{ todayCompleted }}/{{ todayTotal }}</text>
        <view class="task-bar">
          <view class="task-fill" :style="{ width: (todayCompleted/todayTotal*100) + '%' }"></view>
        </view>
      </view>
      <view class="word-list">
        <view 
          class="word-item" 
          v-for="(word, index) in todayWords" 
          :key="word.id"
          @click="showWordDetail(word)"
        >
          <view class="word-info">
            <text class="word-text">{{ word.word }}</text>
            <text class="word-phonetic">{{ word.phonetic }}</text>
          </view>
          <view class="word-actions">
            <text class="word-meaning">{{ word.meaning }}</text>
            <view class="action-btns">
              <text 
                class="btn-know" 
                :class="{ active: word.status === 'mastered' }"
                @click.stop="markWord(word, 'mastered')"
              >认识</text>
              <text 
                class="btn-vague" 
                :class="{ active: word.status === 'learning' }"
                @click.stop="markWord(word, 'learning')"
              >模糊</text>
              <text 
                class="btn-unknown" 
                :class="{ active: word.status === 'new' }"
                @click.stop="markWord(word, 'new')"
              >不认识</text>
            </view>
          </view>
        </view>
      </view>
    </view>

    <!-- 学习模式选择 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">学习模式</text>
      </view>
      <view class="mode-grid">
        <view class="mode-item" @click="startMode('learn')">
          <view class="mode-icon">📖</view>
          <text class="mode-name">新词学习</text>
          <text class="mode-desc">每日20个新词</text>
        </view>
        <view class="mode-item" @click="startMode('review')">
          <view class="mode-icon">🔄</view>
          <text class="mode-name">复习巩固</text>
          <text class="mode-desc">艾宾浩斯复习</text>
        </view>
        <view class="mode-item" @click="startMode('test')">
          <view class="mode-icon">📝</view>
          <text class="mode-name">词汇测试</text>
          <text class="mode-desc">检验掌握程度</text>
        </view>
        <view class="mode-item" @click="startMode('wrong')">
          <view class="mode-icon">❌</view>
          <text class="mode-name">错题本</text>
          <text class="mode-desc">{{ wrongWords.length }}个待复习</text>
        </view>
      </view>
    </view>

    <!-- 词详情弹窗 -->
    <view class="modal" v-if="showModal" @click="closeModal">
      <view class="modal-content" @click.stop>
        <view class="modal-header">
          <text class="modal-word">{{ currentWord.word }}</text>
          <text class="modal-phonetic">{{ currentWord.phonetic }}</text>
          <text class="modal-audio" @click="playAudio">🔊</text>
        </view>
        <view class="modal-body">
          <view class="meaning-section">
            <text class="section-title">释义</text>
            <text class="meaning-text">{{ currentWord.meaning }}</text>
          </view>
          <view class="example-section">
            <text class="section-title">例句</text>
            <text class="example-en">{{ currentWord.exampleEn }}</text>
            <text class="example-cn">{{ currentWord.exampleCn }}</text>
          </view>
          <view class="memory-section">
            <text class="section-title">记忆技巧</text>
            <text class="memory-tip">{{ currentWord.memoryTip }}</text>
          </view>
        </view>
        <view class="modal-footer">
          <text class="btn-close" @click="closeModal">关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      stats: {
        mastered: 450,
        learning: 120,
        remaining: 1430
      },
      todayWords: [
        {
          id: 1,
          word: 'abandon',
          phonetic: '/əˈbændən/',
          meaning: 'v. 放弃，抛弃',
          exampleEn: 'He abandoned his car and ran for help.',
          exampleCn: '他弃车而去寻求帮助。',
          memoryTip: 'a(一个) + band(乐队) + on(在...上) → 一个乐队在台上被抛弃了',
          status: 'new'
        },
        {
          id: 2,
          word: 'abbreviate',
          phonetic: '/əˈbriːvieɪt/',
          meaning: 'v. 缩写，使简短',
          exampleEn: 'The name Benjamin is often abbreviated to Ben.',
          exampleCn: 'Benjamin这个名字常被缩写成Ben。',
          memoryTip: 'ab(不) + brevi(短) + ate → 使变短 → 缩写',
          status: 'new'
        },
        {
          id: 3,
          word: 'abnormal',
          phonetic: '/æbˈnɔːrml/',
          meaning: 'adj. 反常的，异常的',
          exampleEn: 'This warm weather is abnormal for February.',
          exampleCn: '对于二月来说，这种温暖的天气是不正常的。',
          memoryTip: 'ab(不) + normal(正常的) → 不正常的 → 反常的',
          status: 'new'
        },
        {
          id: 4,
          word: 'abolish',
          phonetic: '/əˈbɒlɪʃ/',
          meaning: 'v. 废除，废止',
          exampleEn: 'Slavery was abolished in the US in 1865.',
          exampleCn: '美国于1865年废除了奴隶制。',
          memoryTip: 'a(一个) + bolish(音似"暴力是") → 暴力是应该被废除的',
          status: 'new'
        },
        {
          id: 5,
          word: 'abrupt',
          phonetic: '/əˈbrʌpt/',
          meaning: 'adj. 突然的，唐突的',
          exampleEn: 'The bus came to an abrupt stop.',
          exampleCn: '公交车突然停了下来。',
          memoryTip: 'ab(离开) + rupt(断裂) → 突然断裂 → 突然的',
          status: 'new'
        }
      ],
      wrongWords: [12, 15, 23, 45, 67],
      showModal: false,
      currentWord: {}
    }
  },
  computed: {
    progressPercent() {
      const total = this.stats.mastered + this.stats.learning + this.stats.remaining
      return Math.round((this.stats.mastered / total) * 100)
    },
    todayTotal() {
      return this.todayWords.length
    },
    todayCompleted() {
      return this.todayWords.filter(w => w.status === 'mastered').length
    }
  },
  methods: {
    markWord(word, status) {
      word.status = status
      if (status === 'mastered') {
        this.stats.mastered++
        if (this.stats.remaining > 0) this.stats.remaining--
      }
    },
    showWordDetail(word) {
      this.currentWord = word
      this.showModal = true
    },
    closeModal() {
      this.showModal = false
    },
    playAudio() {
      uni.showToast({ title: '播放发音', icon: 'none' })
    },
    startMode(mode) {
      const titles = {
        learn: '新词学习',
        review: '复习巩固',
        test: '词汇测试',
        wrong: '错题本'
      }
      uni.showToast({ title: `进入${titles[mode]}`, icon: 'none' })
    },
    resetTasks() {
      this.todayWords.forEach(w => w.status = 'new')
      uni.showToast({ title: '任务已重置', icon: 'success' })
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
  margin-bottom: 20rpx;
}

.progress-title {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.progress-subtitle {
  font-size: 24rpx;
  opacity: 0.8;
  margin-top: 8rpx;
  display: block;
}

.progress-stats {
  display: flex;
  justify-content: space-around;
  margin: 30rpx 0;
}

.stat-box {
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

.progress-bar {
  height: 16rpx;
  background: rgba(255,255,255,0.3);
  border-radius: 8rpx;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #fff;
  border-radius: 8rpx;
  transition: width 0.3s;
}

.progress-text {
  font-size: 24rpx;
  text-align: center;
  margin-top: 16rpx;
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

.task-progress {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.task-count {
  font-size: 28rpx;
  color: #666;
  margin-right: 20rpx;
}

.task-bar {
  flex: 1;
  height: 12rpx;
  background: #f0f0f0;
  border-radius: 6rpx;
  overflow: hidden;
}

.task-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a, #1890ff);
  border-radius: 6rpx;
}

.word-item {
  display: flex;
  padding: 24rpx 0;
  border-bottom: 1rpx solid #f0f0f0;
}

.word-info {
  width: 200rpx;
}

.word-text {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.word-phonetic {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.word-actions {
  flex: 1;
}

.word-meaning {
  font-size: 28rpx;
  color: #666;
  margin-bottom: 16rpx;
  display: block;
}

.action-btns {
  display: flex;
  gap: 16rpx;
}

.btn-know, .btn-vague, .btn-unknown {
  padding: 12rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  border: 1rpx solid #d9d9d9;
}

.btn-know {
  &.active {
    background: #52c41a;
    color: #fff;
    border-color: #52c41a;
  }
}

.btn-vague {
  &.active {
    background: #faad14;
    color: #fff;
    border-color: #faad14;
  }
}

.btn-unknown {
  &.active {
    background: #ff4d4f;
    color: #fff;
    border-color: #ff4d4f;
  }
}

.mode-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20rpx;
}

.mode-item {
  background: #f8f8f8;
  border-radius: 16rpx;
  padding: 30rpx;
  text-align: center;
}

.mode-icon {
  font-size: 48rpx;
  margin-bottom: 16rpx;
}

.mode-name {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.mode-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 20rpx;
  width: 80%;
  max-height: 70%;
  overflow: hidden;
}

.modal-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40rpx;
  text-align: center;
  color: #fff;
}

.modal-word {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}

.modal-phonetic {
  font-size: 28rpx;
  opacity: 0.9;
  margin-top: 16rpx;
  display: block;
}

.modal-audio {
  font-size: 40rpx;
  margin-top: 20rpx;
  display: block;
}

.modal-body {
  padding: 30rpx;
}

.section-title {
  font-size: 28rpx;
  color: #999;
  margin-bottom: 12rpx;
  display: block;
}

.meaning-text {
  font-size: 32rpx;
  color: #333;
  margin-bottom: 24rpx;
  display: block;
}

.example-en {
  font-size: 28rpx;
  color: #333;
  display: block;
}

.example-cn {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.memory-tip {
  font-size: 28rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 20rpx;
  border-radius: 12rpx;
}

.modal-footer {
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-close {
  display: block;
  text-align: center;
  padding: 24rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  font-size: 30rpx;
  color: #666;
}
</style>
