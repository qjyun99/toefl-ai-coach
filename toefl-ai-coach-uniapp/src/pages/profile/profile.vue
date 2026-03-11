<template>
  <view class="container">
    <!-- 用户信息卡片 -->
    <view class="user-card">
      <view class="user-header">
        <image class="avatar" src="/static/default-avatar.png" mode="aspectFill" />
        <view class="user-info">
          <text class="username">{{ userInfo.username }}</text>
          <text class="user-level">{{ userInfo.level }}</text>
        </view>
        <text class="edit-btn" @click="editProfile">编辑</text>
      </view>
      <view class="user-stats">
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.studyDays }}</text>
          <text class="stat-label">学习天数</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.totalTime }}h</text>
          <text class="stat-label">学习时长</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userInfo.rank }}</text>
          <text class="stat-label">排名</text>
        </view>
      </view>
    </view>

    <!-- 我的成就 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">🏆 我的成就</text>
        <text class="card-action" @click="viewAllAchievements">查看全部</text>
      </view>
      <view class="achievement-list">
        <view 
          class="achievement-item" 
          v-for="(item, index) in achievements" 
          :key="index"
          :class="{ unlocked: item.unlocked }"
        >
          <view class="achievement-icon">{{ item.icon }}</view>
          <view class="achievement-info">
            <text class="achievement-name">{{ item.name }}</text>
            <text class="achievement-desc">{{ item.desc }}</text>
          </view>
          <text class="achievement-status">{{ item.unlocked ? '已获得' : '未解锁' }}</text>
        </view>
      </view>
    </view>

    <!-- 学习数据 -->
    <view class="card">
      <view class="card-header">
        <text class="card-title">📊 学习数据</text>
      </view>
      <view class="data-grid">
        <view class="data-item" @click="viewDetail('vocabulary')">
          <view class="data-icon">📚</view>
          <text class="data-value">{{ data.vocabulary }}</text>
          <text class="data-label">掌握词汇</text>
        </view>
        <view class="data-item" @click="viewDetail('reading')">
          <view class="data-icon">📖</view>
          <text class="data-value">{{ data.reading }}</text>
          <text class="data-label">阅读文章</text>
        </view>
        <view class="data-item" @click="viewDetail('speaking')">
          <view class="data-icon">🎤</view>
          <text class="data-value">{{ data.speaking }}</text>
          <text class="data-label">口语练习</text>
        </view>
        <view class="data-item" @click="viewDetail('writing')">
          <view class="data-icon">✍️</view>
          <text class="data-value">{{ data.writing }}</text>
          <text class="data-label">写作练习</text>
        </view>
      </view>
    </view>

    <!-- 功能菜单 -->
    <view class="card">
      <view class="menu-list">
        <view class="menu-item" @click="openMenu('favorites')">
          <view class="menu-icon">⭐</view>
          <text class="menu-name">我的收藏</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="openMenu('history')">
          <view class="menu-icon">📜</view>
          <text class="menu-name">学习记录</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="openMenu('wrong')">
          <view class="menu-icon">❌</view>
          <text class="menu-name">错题本</text>
          <text class="menu-badge">{{ wrongCount }}</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="openMenu('notes')">
          <view class="menu-icon">📝</view>
          <text class="menu-name">我的笔记</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 设置 -->
    <view class="card">
      <view class="menu-list">
        <view class="menu-item" @click="openSettings('reminder')">
          <view class="menu-icon">⏰</view>
          <text class="menu-name">学习提醒</text>
          <switch class="menu-switch" :checked="settings.reminder" @change="toggleReminder" />
        </view>
        <view class="menu-item" @click="openSettings('sound')">
          <view class="menu-icon">🔊</view>
          <text class="menu-name">音效设置</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="openSettings('download')">
          <view class="menu-icon">💾</view>
          <text class="menu-name">离线下载</text>
          <text class="menu-arrow">›</text>
        </view>
        <view class="menu-item" @click="openSettings('about')">
          <view class="menu-icon">ℹ️</view>
          <text class="menu-name">关于我们</text>
          <text class="menu-arrow">›</text>
        </view>
      </view>
    </view>

    <!-- 退出登录 -->
    <view class="logout-section">
      <text class="logout-btn" @click="logout">退出登录</text>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      userInfo: {
        username: '托福学员',
        level: '四级进阶 · 目标100分',
        studyDays: 15,
        totalTime: 45,
        rank: 128
      },
      achievements: [
        {
          icon: '🔥',
          name: '连续打卡7天',
          desc: '连续学习7天不间断',
          unlocked: true
        },
        {
          icon: '📚',
          name: '词汇达人',
          desc: '掌握500个托福词汇',
          unlocked: true
        },
        {
          icon: '🎯',
          name: '首考突破',
          desc: '完成首次模拟考试',
          unlocked: false
        },
        {
          icon: '🏆',
          name: '全能选手',
          desc: '四项能力均达到25分',
          unlocked: false
        }
      ],
      data: {
        vocabulary: 450,
        reading: 12,
        speaking: 28,
        writing: 8
      },
      wrongCount: 23,
      settings: {
        reminder: true
      }
    }
  },
  methods: {
    editProfile() {
      uni.showToast({ title: '编辑个人资料', icon: 'none' })
    },
    viewAllAchievements() {
      uni.showToast({ title: '查看全部成就', icon: 'none' })
    },
    viewDetail(type) {
      const names = {
        vocabulary: '词汇',
        reading: '阅读',
        speaking: '口语',
        writing: '写作'
      }
      uni.showToast({ title: `查看${names[type]}详情`, icon: 'none' })
    },
    openMenu(menu) {
      const names = {
        favorites: '我的收藏',
        history: '学习记录',
        wrong: '错题本',
        notes: '我的笔记'
      }
      uni.showToast({ title: names[menu], icon: 'none' })
    },
    openSettings(setting) {
      const names = {
        reminder: '学习提醒',
        sound: '音效设置',
        download: '离线下载',
        about: '关于我们'
      }
      uni.showToast({ title: names[setting], icon: 'none' })
    },
    toggleReminder(e) {
      this.settings.reminder = e.detail.value
      uni.showToast({ 
        title: e.detail.value ? '已开启提醒' : '已关闭提醒', 
        icon: 'none' 
      })
    },
    logout() {
      uni.showModal({
        title: '确认退出',
        content: '确定要退出登录吗？',
        success: (res) => {
          if (res.confirm) {
            uni.showToast({ title: '已退出登录', icon: 'success' })
          }
        }
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

.user-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20rpx;
  padding: 30rpx;
  margin-bottom: 20rpx;
  color: #fff;
}

.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 30rpx;
}

.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  border: 4rpx solid rgba(255,255,255,0.3);
  margin-right: 20rpx;
}

.user-info {
  flex: 1;
}

.username {
  font-size: 40rpx;
  font-weight: bold;
  display: block;
}

.user-level {
  font-size: 26rpx;
  opacity: 0.9;
  margin-top: 8rpx;
  display: block;
}

.edit-btn {
  font-size: 26rpx;
  padding: 12rpx 24rpx;
  background: rgba(255,255,255,0.2);
  border-radius: 30rpx;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20rpx;
  border-top: 1rpx solid rgba(255,255,255,0.2);
}

.stat-item {
  text-align: center;
}

.stat-num {
  font-size: 40rpx;
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

.achievement-list {
  .achievement-item {
    display: flex;
    align-items: center;
    padding: 20rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    opacity: 0.5;
    
    &.unlocked {
      opacity: 1;
    }
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.achievement-icon {
  width: 80rpx;
  height: 80rpx;
  background: #f8f8f8;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40rpx;
  margin-right: 20rpx;
}

.achievement-info {
  flex: 1;
}

.achievement-name {
  font-size: 30rpx;
  font-weight: bold;
  display: block;
}

.achievement-desc {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.achievement-status {
  font-size: 24rpx;
  color: #999;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20rpx;
}

.data-item {
  text-align: center;
  padding: 20rpx 0;
}

.data-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}

.data-value {
  font-size: 40rpx;
  font-weight: bold;
  color: #1890ff;
  display: block;
}

.data-label {
  font-size: 24rpx;
  color: #999;
  margin-top: 8rpx;
  display: block;
}

.menu-list {
  .menu-item {
    display: flex;
    align-items: center;
    padding: 24rpx 0;
    border-bottom: 1rpx solid #f0f0f0;
    
    &:last-child {
      border-bottom: none;
    }
  }
}

.menu-icon {
  width: 48rpx;
  height: 48rpx;
  background: #f8f8f8;
  border-radius: 12rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  margin-right: 20rpx;
}

.menu-name {
  flex: 1;
  font-size: 30rpx;
}

.menu-badge {
  font-size: 24rpx;
  color: #fff;
  background: #ff4d4f;
  padding: 4rpx 16rpx;
  border-radius: 20rpx;
  margin-right: 16rpx;
}

.menu-switch {
  transform: scale(0.8);
}

.menu-arrow {
  font-size: 40rpx;
  color: #999;
}

.logout-section {
  padding: 40rpx 0;
  text-align: center;
}

.logout-btn {
  font-size: 30rpx;
  color: #ff4d4f;
  padding: 24rpx 60rpx;
  border: 1rpx solid #ff4d4f;
  border-radius: 12rpx;
}
</style>
