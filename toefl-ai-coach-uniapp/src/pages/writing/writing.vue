<template>
  <view class="container">
    <!-- 写作能力评估 -->
    <view class="ability-card">
      <view class="ability-header">
        <text class="ability-title">写作能力</text>
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

    <!-- 写作类型选择 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">写作类型</text>
      </view>
      <view class="type-list">
        <view class="type-card" @click="startWriting('integrated')">
          <view class="type-icon">📝</view>
          <view class="type-info">
            <text class="type-name">综合写作</text>
            <text class="type-desc">Integrated Writing - 阅读+听力综合</text>
            <text class="type-time">⏱ 20分钟 | 150-225词</text>
          </view>
          <text class="type-arrow">›</text>
        </view>
        <view class="type-card" @click="startWriting('independent')">
          <view class="type-icon">✍️</view>
          <view class="type-info">
            <text class="type-name">独立写作</text>
            <text class="type-desc">Independent Writing - 个人观点论述</text>
            <text class="type-time">⏱ 30分钟 | 300+词</text>
          </view>
          <text class="type-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 写作模板 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">写作模板</text>
        <text class="card-action" @click="viewAllTemplates">查看全部</text>
      </view>
      <view class="template-list">
        <view 
          class="template-item" 
          v-for="(template, index) in templates" 
          :key="index"
          @click="useTemplate(template)"
        >
          <text class="template-tag">{{ template.type }}</text>
          <text class="template-title">{{ template.title }}</text>
          <text class="template-preview">{{ template.preview }}</text>
        </view>
      </view>
    </view>

    <!-- 范文库 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">高分范文</text>
        <text class="card-action" @click="viewAllSamples">更多</text>
      </view>
      <view class="sample-list">
        <view 
          class="sample-item" 
          v-for="(sample, index) in samples" 
          :key="index"
          @click="viewSample(sample)"
        >
          <view class="sample-header">
            <text class="sample-type">{{ sample.type }}</text>
            <text class="sample-score">{{ sample.score }}分</text>
          </view>
          <text class="sample-title">{{ sample.title }}</text>
          <view class="sample-tags">
            <text class="tag" v-for="(tag, idx) in sample.tags" :key="idx">{{ tag }}</text>
          </view>
        </view>
      </view>
    </view>

    <!-- 写作练习弹窗 -->
    <view class="modal" v-if="showWritingModal" @click="closeWritingModal">
      <view class="writing-content" @click.stop>
        <view class="writing-header">
          <text class="writing-title">{{ currentType === 'integrated' ? '综合写作' : '独立写作' }}</text>
          <view class="timer-box">
            <text class="timer-icon">⏱</text>
            <text class="timer-value">{{ formatTime(remainingTime) }}</text>
          </view>
        </view>
        
        <scroll-view scroll-y class="writing-body">
          <!-- 综合写作材料 -->
          <view class="material-section" v-if="currentType === 'integrated'">
            <view class="material-tabs">
              <view 
                class="tab-item" 
                :class="{ active: activeTab === 'reading' }"
                @click="activeTab = 'reading'"
              >阅读材料</view>
              <view 
                class="tab-item" 
                :class="{ active: activeTab === 'listening' }"
                @click="activeTab = 'listening'"
              >听力要点</view>
            </view>
            <view class="material-content" v-if="activeTab === 'reading'">
              <text class="material-text">{{ integratedMaterial.reading }}</text>
            </view>
            <view class="material-content" v-if="activeTab === 'listening'">
              <view class="listening-box">
                <text class="listening-icon">🎧</text>
                <text class="listening-text">点击播放听力材料</text>
              </view>
              <view class="listening-points">
                <text class="points-title">听力要点：</text>
                <view class="point-item" v-for="(point, idx) in integratedMaterial.listeningPoints" :key="idx">
                  <text class="point-num">{{ idx + 1 }}.</text>
                  <text class="point-text">{{ point }}</text>
                </view>
              </view>
            </view>
          </view>
          
          <!-- 独立写作题目 -->
          <view class="prompt-section" v-if="currentType === 'independent'">
            <text class="prompt-label">写作题目</text>
            <text class="prompt-text">{{ independentPrompt }}</text>
          </view>
          
          <!-- 写作区域 -->
          <view class="writing-area">
            <text class="area-label">写作区域</text>
            <textarea 
              class="writing-textarea" 
              v-model="essayContent"
              placeholder="开始写作..."
              :maxlength="2000"
            />
            <text class="word-count">{{ essayContent.length }} / 2000 字符</text>
          </view>
        </scroll-view>
        
        <view class="writing-footer">
          <text class="btn-submit" @click="submitEssay">提交批改</text>
          <text class="btn-draft" @click="saveDraft">保存草稿</text>
          <text class="btn-close" @click="closeWritingModal">关闭</text>
        </view>
      </view>
    </view>

    <!-- AI批改结果弹窗 -->
    <view class="modal" v-if="showFeedbackModal" @click="closeFeedbackModal">
      <view class="feedback-content" @click.stop>
        <view class="feedback-header">
          <text class="feedback-title">🤖 AI 批改结果</text>
          <view class="total-score">
            <text class="score-num">{{ feedback.total }}</text>
            <text class="score-max">/30</text>
          </view>
        </view>
        
        <scroll-view scroll-y class="feedback-body">
          <!-- 分项评分 -->
          <view class="score-breakdown">
            <view class="score-item" v-for="(item, index) in feedback.breakdown" :key="index">
              <text class="score-name">{{ item.name }}</text>
              <view class="score-bar">
                <view class="score-fill" :style="{ width: (item.score/5*100) + '%' }"></view>
              </view>
              <text class="score-value">{{ item.score }}/5</text>
            </view>
          </view>
          
          <!-- 详细反馈 -->
          <view class="feedback-section">
            <text class="section-title">💡 改进建议</text>
            <view class="suggestion-list">
              <view class="suggestion-item" v-for="(suggestion, idx) in feedback.suggestions" :key="idx">
                <text class="suggestion-type">{{ suggestion.type }}</text>
                <text class="suggestion-text">{{ suggestion.content }}</text>
              </view>
            </view>
          </view>
          
          <!-- 语法错误 -->
          <view class="feedback-section" v-if="feedback.errors.length">
            <text class="section-title">⚠️ 语法问题</text>
            <view class="error-list">
              <view class="error-item" v-for="(error, idx) in feedback.errors" :key="idx">
                <text class="error-original">{{ error.original }}</text>
                <text class="error-arrow">→</text>
                <text class="error-corrected">{{ error.corrected }}</text>
                <text class="error-reason">{{ error.reason }}</text>
              </view>
            </view>
          </view>
          
          <!-- 词汇建议 -->
          <view class="feedback-section">
            <text class="section-title">📚 词汇升级</text>
            <view class="vocab-list">
              <view class="vocab-item" v-for="(vocab, idx) in feedback.vocabulary" :key="idx">
                <text class="vocab-basic">{{ vocab.basic }}</text>
                <text class="vocab-arrow">→</text>
                <text class="vocab-advanced">{{ vocab.advanced }}</text>
              </view>
            </view>
          </view>
        </scroll-view>
        
        <view class="feedback-footer">
          <text class="btn-primary" @click="retryWriting">再写一篇</text>
          <text class="btn-secondary" @click="closeFeedbackModal">关闭</text>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      overallScore: 82,
      abilities: [
        { name: '内容', score: 85 },
        { name: '结构', score: 80 },
        { name: '语法', score: 78 },
        { name: '词汇', score: 82 }
      ],
      templates: [
        {
          type: '综合写作',
          title: '反驳型模板',
          preview: 'The reading passage discusses..., but the lecturer challenges...'
        },
        {
          type: '独立写作',
          title: '观点对比型',
          preview: 'Some people believe..., while others think... In my opinion...'
        },
        {
          type: '独立写作',
          title: '问题解决型',
          preview: 'Nowadays, ... has become a serious issue. This essay will...'
        }
      ],
      samples: [
        {
          type: '综合写作',
          title: '恐龙是否为恒温动物',
          score: 28,
          tags: ['结构清晰', '反驳有力', '词汇丰富']
        },
          {
          type: '独立写作',
          title: '年轻人是否应该冒险',
          score: 29,
          tags: ['论证充分', '例子具体', '句式多样']
        },
        {
          type: '独立写作',
          title: '团队合作 vs 个人工作',
          score: 27,
          tags: ['观点明确', '逻辑连贯', '用词准确']
        }
      ],
      currentType: '',
      activeTab: 'reading',
      showWritingModal: false,
      showFeedbackModal: false,
      essayContent: '',
      remainingTime: 1200,
      timer: null,
      integratedMaterial: {
        reading: 'The reading passage discusses the theory that dinosaurs were warm-blooded animals, presenting three pieces of evidence: the presence of Haversian canals in dinosaur bones, the dinosaurs\' geographic distribution, and their body posture.',
        listeningPoints: [
          'Haversian canals can also be found in cold-blooded animals like crocodiles',
          'Geographic distribution does not necessarily indicate warm-bloodedness',
          'Body posture is not conclusive evidence of metabolism type'
        ]
      },
      independentPrompt: 'Do you agree or disagree with the following statement? It is better to take risks and try new things than to stick with familiar routines. Use specific reasons and examples to support your answer.',
      feedback: {
        total: 26,
        breakdown: [
          { name: '内容完整', score: 5 },
          { name: '结构组织', score: 4 },
          { name: '语言运用', score: 4 },
          { name: '词汇多样性', score: 4 },
          { name: '语法准确性', score: 4 },
          { name: '论证深度', score: 5 }
        ],
        suggestions: [
          { type: '内容', content: '观点明确，论证较为充分，但可以再增加一个具体例子来增强说服力' },
          { type: '结构', content: '段落过渡自然，建议开头段再简洁一些' },
          { type: '词汇', content: '词汇使用较为丰富，注意避免重复使用 "important" 等基础词汇' }
        ],
        errors: [
          { original: 'I think it is very important', corrected: 'I believe it is crucial', reason: '更正式的表达' },
          { original: 'There are many people', corrected: 'Numerous individuals', reason: '避免there be句型过度使用' }
        ],
        vocabulary: [
          { basic: 'important', advanced: 'crucial / significant / vital' },
          { basic: 'good', advanced: 'beneficial / advantageous / favorable' },
          { basic: 'bad', advanced: 'detrimental / adverse / unfavorable' }
        ]
      }
    }
  },
  methods: {
    startWriting(type) {
      this.currentType = type
      this.essayContent = ''
      this.remainingTime = type === 'integrated' ? 1200 : 1800
      this.showWritingModal = true
      this.startTimer()
    },
    startTimer() {
      this.timer = setInterval(() => {
        if (this.remainingTime > 0) {
          this.remainingTime--
        } else {
          this.submitEssay()
        }
      }, 1000)
    },
    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = seconds % 60
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },
    submitEssay() {
      clearInterval(this.timer)
      this.showWritingModal = false
      this.showFeedbackModal = true
    },
    saveDraft() {
      uni.showToast({ title: '草稿已保存', icon: 'success' })
    },
    closeWritingModal() {
      clearInterval(this.timer)
      this.showWritingModal = false
    },
    useTemplate(template) {
      uni.showToast({ title: `已选择: ${template.title}`, icon: 'none' })
    },
    viewAllTemplates() {
      uni.showToast({ title: '查看全部模板', icon: 'none' })
    },
    viewSample(sample) {
      uni.showToast({ title: `查看: ${sample.title}`, icon: 'none' })
    },
    viewAllSamples() {
      uni.showToast({ title: '查看更多范文', icon: 'none' })
    },
    closeFeedbackModal() {
      this.showFeedbackModal = false
    },
    retryWriting() {
      this.closeFeedbackModal()
      this.startWriting(this.currentType)
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
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
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

.card-action {
  font-size: 26rpx;
  color: #1890ff;
}

.type-list {
  .type-card {
    display: flex;
    align-items: center;
    padding: 24rpx;
    background: #f8f8f8;
    border-radius: 16rpx;
    margin-bottom: 16rpx;
  }
}

.type-icon {
  font-size: 48rpx;
  margin-right: 20rpx;
}

.type-info {
  flex: 1;
}

.type-name {
  font-size: 32rpx;
  font-weight: bold;
  display: block;
}

.type-desc {
  font-size: 26rpx;
  color: #666;
  margin-top: 8rpx;
  display: block;
}

.type-time {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.type-arrow {
  font-size: 40rpx;
  color: #999;
}

.template-list {
  .template-item {
    padding: 24rpx;
    background: #f8f8f8;
    border-radius: 12rpx;
    margin-bottom: 16rpx;
  }
}

.template-tag {
  font-size: 22rpx;
  color: #1890ff;
  background: #e6f7ff;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
  margin-bottom: 12rpx;
  display: inline-block;
}

.template-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.template-preview {
  font-size: 26rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.sample-list {
  .sample-item {
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
  }
}

.sample-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12rpx;
}

.sample-type {
  font-size: 24rpx;
  color: #1890ff;
}

.sample-score {
  font-size: 32rpx;
  font-weight: bold;
  color: #52c41a;
}

.sample-title {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.sample-tags {
  display: flex;
  gap: 12rpx;
  margin-top: 12rpx;
}

.tag {
  font-size: 22rpx;
  color: #999;
  background: #f5f5f5;
  padding: 4rpx 12rpx;
  border-radius: 8rpx;
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

.writing-content {
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

.writing-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
  color: #fff;
}

.writing-title {
  font-size: 36rpx;
  font-weight: bold;
}

.timer-box {
  display: flex;
  align-items: center;
  background: rgba(255,255,255,0.2);
  padding: 12rpx 24rpx;
  border-radius: 30rpx;
}

.timer-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.timer-value {
  font-size: 32rpx;
  font-weight: bold;
}

.writing-body {
  flex: 1;
  padding: 30rpx;
}

.material-section {
  margin-bottom: 30rpx;
}

.material-tabs {
  display: flex;
  gap: 20rpx;
  margin-bottom: 20rpx;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 20rpx;
  background: #f5f5f5;
  border-radius: 12rpx;
  font-size: 28rpx;
  
  &.active {
    background: #1890ff;
    color: #fff;
  }
}

.material-content {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 24rpx;
}

.material-text {
  font-size: 28rpx;
  line-height: 1.6;
  color: #333;
}

.listening-box {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40rpx;
  background: #e6f7ff;
  border-radius: 12rpx;
  margin-bottom: 20rpx;
}

.listening-icon {
  font-size: 48rpx;
  margin-right: 16rpx;
}

.listening-text {
  font-size: 28rpx;
  color: #1890ff;
}

.listening-points {
  .point-item {
    display: flex;
    margin-bottom: 16rpx;
  }
}

.points-title {
  font-size: 28rpx;
  font-weight: bold;
  margin-bottom: 16rpx;
  display: block;
}

.point-num {
  width: 40rpx;
  font-size: 28rpx;
  color: #1890ff;
}

.point-text {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}

.prompt-section {
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 24rpx;
  margin-bottom: 30rpx;
}

.prompt-label {
  font-size: 26rpx;
  color: #999;
  margin-bottom: 12rpx;
  display: block;
}

.prompt-text {
  font-size: 30rpx;
  line-height: 1.6;
  color: #333;
}

.writing-area {
  .area-label {
    font-size: 28rpx;
    font-weight: bold;
    margin-bottom: 16rpx;
    display: block;
  }
}

.writing-textarea {
  width: 100%;
  height: 400rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  padding: 24rpx;
  font-size: 28rpx;
  line-height: 1.6;
}

.word-count {
  font-size: 24rpx;
  color: #999;
  text-align: right;
  margin-top: 12rpx;
  display: block;
}

.writing-footer {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-submit, .btn-draft, .btn-close {
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

.btn-draft {
  background: #f6ffed;
  color: #52c41a;
}

.btn-close {
  background: #f5f5f5;
  color: #666;
}

.feedback-content {
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

.feedback-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 30rpx;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
}

.feedback-title {
  font-size: 32rpx;
  font-weight: bold;
}

.total-score {
  display: flex;
  align-items: baseline;
}

.score-num {
  font-size: 64rpx;
  font-weight: bold;
}

.score-max {
  font-size: 32rpx;
  opacity: 0.8;
}

.feedback-body {
  flex: 1;
  padding: 30rpx;
}

.score-breakdown {
  margin-bottom: 30rpx;
}

.score-item {
  display: flex;
  align-items: center;
  margin-bottom: 20rpx;
}

.score-name {
  width: 180rpx;
  font-size: 28rpx;
}

.score-bar {
  flex: 1;
  height: 16rpx;
  background: #f0f0f0;
  border-radius: 8rpx;
  margin: 0 20rpx;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(90deg, #52c41a, #1890ff);
  border-radius: 8rpx;
}

.score-value {
  width: 80rpx;
  text-align: right;
  font-size: 28rpx;
  font-weight: bold;
  color: #1890ff;
}

.feedback-section {
  margin-bottom: 30rpx;
  padding-bottom: 30rpx;
  border-bottom: 1rpx solid #f0f0f0;
}

.section-title {
  font-size: 30rpx;
  font-weight: bold;
  margin-bottom: 20rpx;
  display: block;
}

.suggestion-item {
  margin-bottom: 16rpx;
}

.suggestion-type {
  font-size: 26rpx;
  color: #1890ff;
  font-weight: bold;
  margin-bottom: 8rpx;
  display: block;
}

.suggestion-text {
  font-size: 28rpx;
  color: #333;
  line-height: 1.5;
}

.error-item {
  display: flex;
  align-items: center;
  margin-bottom: 16rpx;
  padding: 16rpx;
  background: #fff1f0;
  border-radius: 12rpx;
}

.error-original {
  font-size: 26rpx;
  color: #ff4d4f;
  text-decoration: line-through;
}

.error-arrow {
  margin: 0 16rpx;
  color: #999;
}

.error-corrected {
  font-size: 26rpx;
  color: #52c41a;
  font-weight: bold;
}

.error-reason {
  flex: 1;
  font-size: 24rpx;
  color: #999;
  text-align: right;
}

.vocab-item {
  display: flex;
  align-items: center;
  margin-bottom: 12rpx;
  padding: 16rpx;
  background: #f6ffed;
  border-radius: 12rpx;
}

.vocab-basic {
  font-size: 26rpx;
  color: #999;
}

.vocab-arrow {
  margin: 0 16rpx;
  color: #999;
}

.vocab-advanced {
  font-size: 26rpx;
  color: #52c41a;
  font-weight: bold;
  flex: 1;
}

.feedback-footer {
  display: flex;
  gap: 20rpx;
  padding: 20rpx 30rpx;
  border-top: 1rpx solid #f0f0f0;
}

.btn-primary, .btn-secondary {
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
</style>
