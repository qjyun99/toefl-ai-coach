<template>
  <view class="container">
    <!-- 阅读统计 -->
    <view class="stats-card">
      <view class="stat-item">
        <text class="stat-num">{{ stats.totalRead }}</text>
        <text class="stat-label">已读文章</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">{{ stats.avgScore }}</text>
        <text class="stat-label">平均得分</text>
      </view>
      <view class="stat-item">
        <text class="stat-num">{{ stats.accuracy }}%</text>
        <text class="stat-label">正确率</text>
      </view>
    </view>

    <!-- 难度选择 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">难度选择</text>
      </view>
      <view class="difficulty-tabs">
        <view 
          class="tab-item" 
          :class="{ active: currentDifficulty === 'easy' }"
          @click="selectDifficulty('easy')"
        >
          <text class="tab-name">入门</text>
          <text class="tab-desc">四级水平</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: currentDifficulty === 'medium' }"
          @click="selectDifficulty('medium')"
        >
          <text class="tab-name">进阶</text>
          <text class="tab-desc">六级水平</text>
        </view>
        <view 
          class="tab-item" 
          :class="{ active: currentDifficulty === 'hard' }"
          @click="selectDifficulty('hard')"
        >
          <text class="tab-name">托福</text>
          <text class="tab-desc">TPO真题</text>
        </view>
      </view>
    </view>

    <!-- 文章列表 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">推荐文章</text>
        <text class="card-action" @click="refreshArticles">换一批</text>
      </view>
      <view class="article-list">
        <view 
          class="article-item" 
          v-for="(article, index) in articles" 
          :key="article.id"
          @click="startReading(article)"
        >
          <view class="article-header">
            <text class="article-type">{{ article.type }}</text>
            <text class="article-difficulty" :class="article.difficulty">{{ article.difficultyText }}</text>
          </view>
          <text class="article-title">{{ article.title }}</text>
          <text class="article-desc">{{ article.desc }}</text>
          <view class="article-meta">
            <text class="meta-item">📖 {{ article.wordCount }}词</text>
            <text class="meta-item">⏱ {{ article.time }}分钟</text>
            <text class="meta-item" v-if="article.completed">✓ 已完成</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 阅读技巧 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">阅读技巧</text>
      </view>
      <view class="tip-list">
        <view class="tip-item" v-for="(tip, index) in tips" :key="index">
          <text class="tip-icon">💡</text>
          <view class="tip-content">
            <text class="tip-title">{{ tip.title }}</text>
            <text class="tip-desc">{{ tip.desc }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 阅读页面弹窗 -->
    <view class="modal" v-if="showReadingModal" @click="closeReadingModal">
      <view class="reading-content" @click.stop>
        <scroll-view scroll-y class="article-scroll">
          <view class="article-body">
            <text class="reading-title">{{ currentArticle.title }}</text>
            <view class="reading-meta">
              <text>难度: {{ currentArticle.difficultyText }}</text>
              <text>字数: {{ currentArticle.wordCount }}</text>
            </view>
            <text class="reading-text">{{ currentArticle.content }}</text>
          </view>
          
          <!-- 题目区域 -->
          <view class="questions-section" v-if="currentArticle.questions">
            <text class="section-title">阅读理解</text>
            <view 
              class="question-item" 
              v-for="(q, idx) in currentArticle.questions" 
              :key="idx"
            >
              <text class="question-text">{{ idx + 1 }}. {{ q.question }}</text>
              <view class="options-list">
                <view 
                  class="option-item" 
                  v-for="(opt, optIdx) in q.options" 
                  :key="optIdx"
                  :class="{ selected: answers[idx] === optIdx, correct: showResult && optIdx === q.answer, wrong: showResult && answers[idx] === optIdx && optIdx !== q.answer }"
                  @click="selectAnswer(idx, optIdx)"
                >
                  <text class="option-label">{{ ['A', 'B', 'C', 'D'][optIdx] }}</text>
                  <text class="option-text">{{ opt }}</text>
                </view>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="reading-footer">
          <text class="btn-submit" @click="submitAnswers">提交答案</text>
          <text class="btn-close" @click="closeReadingModal">关闭</text>
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
        totalRead: 12,
        avgScore: 28,
        accuracy: 75
      },
      currentDifficulty: 'medium',
      articles: [
        {
          id: 1,
          type: '自然科学',
          title: 'The Formation of Coral Reefs',
          desc: '探索珊瑚礁的形成过程及其生态系统的重要性',
          wordCount: 680,
          time: 15,
          difficulty: 'medium',
          difficultyText: '进阶',
          completed: false,
          content: `Coral reefs are among the most diverse and valuable ecosystems on Earth. They cover less than 1% of the ocean floor but support about 25% of all marine species. The formation of coral reefs is a fascinating process that takes thousands of years.

Coral reefs begin to form when free-swimming coral larvae attach to submerged rocks or other hard surfaces along the edges of islands or continents. These larvae are the product of coral reproduction, which can occur either sexually or asexually.

As the corals grow and expand, they create complex structures that provide habitat for countless other organisms. The three main types of coral reefs are fringing reefs, barrier reefs, and atolls. Fringing reefs grow directly from the shore, while barrier reefs are separated from land by a lagoon. Atolls are circular reefs that surround a lagoon without any central landmass.

The Great Barrier Reef in Australia is the largest coral reef system in the world, stretching over 2,300 kilometers. However, coral reefs face numerous threats including climate change, ocean acidification, and pollution. Rising water temperatures can cause coral bleaching, where corals expel the symbiotic algae living in their tissues, turning them white and often leading to death.

Conservation efforts are crucial to protect these valuable ecosystems. Scientists are working on various strategies including coral breeding programs, artificial reef structures, and reducing carbon emissions to slow climate change.`,
          questions: [
            {
              question: 'What percentage of marine species do coral reefs support?',
              options: ['10%', '15%', '25%', '50%'],
              answer: 2
            },
            {
              question: 'What causes coral bleaching?',
              options: ['Overfishing', 'Rising water temperatures', 'Oil spills', 'Noise pollution'],
              answer: 1
            },
            {
              question: 'Which is the largest coral reef system mentioned?',
              options: ['The Red Sea Reef', 'The Caribbean Reef', 'The Great Barrier Reef', 'The Maldives Reef'],
              answer: 2
            }
          ]
        },
        {
          id: 2,
          type: '社会科学',
          title: 'Urbanization and Its Challenges',
          desc: '城市化进程中的机遇与挑战分析',
          wordCount: 720,
          time: 18,
          difficulty: 'hard',
          difficultyText: '托福',
          completed: true,
          content: 'Urbanization is one of the most significant trends of the 21st century...',
          questions: []
        },
        {
          id: 3,
          type: '历史人文',
          title: 'The Renaissance in Europe',
          desc: '欧洲文艺复兴时期的文化变革',
          wordCount: 550,
          time: 12,
          difficulty: 'easy',
          difficultyText: '入门',
          completed: false,
          content: 'The Renaissance was a fervent period of European cultural, artistic, political and economic "rebirth" following the Middle Ages...',
          questions: []
        }
      ],
      tips: [
        {
          title: '先看题目再读文章',
          desc: '带着问题阅读，提高定位效率'
        },
        {
          title: '关注段落首尾句',
          desc: '主旨通常出现在开头或结尾'
        },
        {
          title: '学会跳读和略读',
          desc: '不必每个词都读，抓关键信息'
        }
      ],
      showReadingModal: false,
      currentArticle: {},
      answers: {},
      showResult: false
    }
  },
  methods: {
    selectDifficulty(difficulty) {
      this.currentDifficulty = difficulty
      uni.showToast({ title: '已切换难度', icon: 'none' })
    },
    refreshArticles() {
      uni.showToast({ title: '已刷新文章列表', icon: 'none' })
    },
    startReading(article) {
      this.currentArticle = article
      this.answers = {}
      this.showResult = false
      this.showReadingModal = true
    },
    closeReadingModal() {
      this.showReadingModal = false
    },
    selectAnswer(questionIdx, optionIdx) {
      if (this.showResult) return
      this.$set(this.answers, questionIdx, optionIdx)
    },
    submitAnswers() {
      this.showResult = true
      const correct = Object.keys(this.answers).filter(k => 
        this.answers[k] === this.currentArticle.questions[k].answer
      ).length
      uni.showToast({ 
        title: `答对 ${correct}/${this.currentArticle.questions.length} 题`, 
        icon: 'none',
        duration: 2000
      })
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

.stats-card {
  background: linear-gradient(135deg, #52c41a 0%, #1890ff 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  display: flex;
  justify-content: space-around;
}

.stat-item {
  text-align: center;
  color: #fff;
}

.stat-num {
  font-size: 48rpx;
  font-weight: bold;
  display: block;
}

.stat-label {
  font-size: 24rpx;
  opacity: 0.9;
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

.difficulty-tabs {
  display: flex;
  gap: 20rpx;
}

.tab-item {
  flex: 1;
  background: #f5f5f5;
  border-radius: 12rpx;
  padding: 20rpx;
  text-align: center;
  
  &.active {
    background: #1890ff;
    .tab-name, .tab-desc {
      color: #fff;
    }
  }
}

.tab-name {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.tab-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.article-list {
  .article-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.article-header {
  display: flex;
  gap: 16rpx;
  margin-bottom: 12rpx;
}

.article-type {
  font-size: 22rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
}

.article-difficulty {
  font-size: 22rpx;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  
  &.easy {
    color: #52c41a;
    background: #f6ffed;
  }
  
  &.medium {
    color: #faad14;
    background: #fffbe6;
  }
  
  &.hard {
    color: #ff4d4f;
    background: #fff1f0;
  }
}

.article-title {
  font-size: 32rpx;
  font-weight: bold;
  color: #333;
  display: block;
}

.article-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.article-meta {
  display: flex;
  gap: 24rpx;
  margin-top: 16rpx;
}

.meta-item {
  font-size: 24rpx;
  color: #999;
}

.tip-list {
  .tip-item {
    display: flex;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.tip-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
}

.tip-content {
  flex: 1;
}

.tip-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.tip-desc {
  font-size: 26rpx;
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
  z-index: 1000;
}

.reading-content {
  position: absolute;
  top: 10%;
  left: 5%;
  right: 5%;
  bottom: 10%;
  background: #fff;
  border-radius: 20rpx;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.article-scroll {
  flex: 1;
  padding: 30rpx;
}

.reading-title {
  font-size: 36rpx;
  font-weight: bold;
  display: block;
}

.reading-meta {
  display: flex;
  gap: 30rpx;
  margin: 20rpx 0;
  font-size: 26rpx;
  color: #999;
}

.reading-text {
  font-size: 30rpx;
  line-height: 1.8;
  color: #333;
}

.questions-section {
  margin-top: 40rpx;
  padding-top: 40rpx;
  border-top: 2rpx solid #f0f0f0;
}

.section-title {
  font-size: 32rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.question-item {
  margin-bottom: 30rpx;
}

.question-text {
  font-size: 30rpx;
  color: #333;
  margin-bottom: 16rpx;
  display: block;
}

.options-list {
  padding-left: 20rpx;
}

.option-item {
  display: flex;
  align-items: center;
  padding: 16rpx;
  margin-bottom: 12rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  
  &.selected {
    background: #e6f7ff;
    border: 1rpx solid #1890ff;
  }
  
  &.correct {
    background: #f6ffed;
    border: 1rpx solid #52c41a;
  }
  
  &.wrong {
    background: #fff1f0;
    border: 1rpx solid #ff4d4f;
  }
}

.option-label {
  width: 48rpx;
  height: 48rpx;
  background: #fff;
  border-radius: 50%;
  text-align: center;
  line-height: 48rpx;
  font-size: 26rpx;
  margin-right: 16rpx;
}

.option-text {
  font-size: 28rpx;
  flex: 1;
}

.reading-footer {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-submit, .btn-close {
  flex: 1;
  text-align: center;
  padding: 24rpx;
  border-radius: 12rpx;
  font-size: 30rpx;
}

.btn-submit {
  background: #1890ff;
  color: #fff;
}

.btn-close {
  background: #f5f5f5;
  color: #666;
}
</style>
