/**
 * 本地存储工具
 */

const storage = {
  // 设置缓存
  set(key, value) {
    try {
      uni.setStorageSync(key, value)
    } catch (e) {
      console.error('Storage set error:', e)
    }
  },

  // 获取缓存
  get(key, defaultValue = null) {
    try {
      return uni.getStorageSync(key) || defaultValue
    } catch (e) {
      console.error('Storage get error:', e)
      return defaultValue
    }
  },

  // 删除缓存
  remove(key) {
    try {
      uni.removeStorageSync(key)
    } catch (e) {
      console.error('Storage remove error:', e)
    }
  },

  // 清空缓存
  clear() {
    try {
      uni.clearStorageSync()
    } catch (e) {
      console.error('Storage clear error:', e)
    }
  },

  // 获取用户信息
  getUserInfo() {
    return this.get('userInfo', {})
  },

  // 设置用户信息
  setUserInfo(userInfo) {
    this.set('userInfo', userInfo)
  },

  // 获取token
  getToken() {
    return this.get('token', '')
  },

  // 设置token
  setToken(token) {
    this.set('token', token)
  },

  // 清除登录信息
  clearAuth() {
    this.remove('token')
    this.remove('userInfo')
  },

  // 获取学习进度
  getStudyProgress() {
    return this.get('studyProgress', {
      vocabulary: { mastered: 0, learning: 0, remaining: 2000 },
      reading: { completed: 0, total: 0 },
      speaking: { completed: 0, total: 0 },
      writing: { completed: 0, total: 0 }
    })
  },

  // 设置学习进度
  setStudyProgress(progress) {
    this.set('studyProgress', progress)
  },

  // 获取今日任务
  getTodayTasks() {
    return this.get('todayTasks', [])
  },

  // 设置今日任务
  setTodayTasks(tasks) {
    this.set('todayTasks', tasks)
  },

  // 获取学习设置
  getSettings() {
    return this.get('settings', {
      reminder: true,
      reminderTime: '20:00',
      sound: true,
      autoPlay: false
    })
  },

  // 设置学习设置
  setSettings(settings) {
    this.set('settings', settings)
  }
}

export default storage
