/**
 * 通用工具函数
 */

export default {
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    const d = new Date(date)
    const year = d.getFullYear()
    const month = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const hour = String(d.getHours()).padStart(2, '0')
    const minute = String(d.getMinutes()).padStart(2, '0')
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hour)
      .replace('mm', minute)
  },

  // 格式化时间（秒 -> 分:秒）
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  },

  // 防抖函数
  debounce(fn, delay = 300) {
    let timer = null
    return function(...args) {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, delay)
    }
  },

  // 节流函数
  throttle(fn, interval = 300) {
    let lastTime = 0
    return function(...args) {
      const now = Date.now()
      if (now - lastTime >= interval) {
        lastTime = now
        fn.apply(this, args)
      }
    }
  },

  // 计算距今天数
  daysFromNow(date) {
    const now = new Date()
    const target = new Date(date)
    const diff = target - now
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  },

  // 随机打乱数组
  shuffle(array) {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  },

  // 计算艾宾浩斯遗忘曲线复习时间
  calculateReviewTimes(firstStudyTime) {
    const intervals = [1, 2, 4, 7, 15, 30] // 天数
    return intervals.map(days => {
      const date = new Date(firstStudyTime)
      date.setDate(date.getDate() + days)
      return date
    })
  },

  // 判断是否为今天
  isToday(date) {
    const today = new Date()
    const target = new Date(date)
    return today.toDateString() === target.toDateString()
  },

  // 获取星期几
  getWeekDay(date) {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
    return days[new Date(date).getDay()]
  },

  // 深拷贝
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  },

  // 显示Toast
  showToast(title, icon = 'none') {
    uni.showToast({
      title,
      icon,
      duration: 2000
    })
  },

  // 显示Loading
  showLoading(title = '加载中...') {
    uni.showLoading({ title, mask: true })
  },

  // 隐藏Loading
  hideLoading() {
    uni.hideLoading()
  },

  // 显示Modal
  showModal(options) {
    return new Promise((resolve) => {
      uni.showModal({
        title: options.title || '提示',
        content: options.content || '',
        showCancel: options.showCancel !== false,
        cancelText: options.cancelText || '取消',
        confirmText: options.confirmText || '确定',
        success: (res) => {
          resolve(res)
        }
      })
    })
  },

  // 页面跳转
  navigateTo(url) {
    uni.navigateTo({ url })
  },

  // 返回上一页
  goBack(delta = 1) {
    uni.navigateBack({ delta })
  },

  // 重定向
  redirectTo(url) {
    uni.redirectTo({ url })
  },

  // 跳转到Tab页
  switchTab(url) {
    uni.switchTab({ url })
  },

  // 获取系统信息
  getSystemInfo() {
    return uni.getSystemInfoSync()
  },

  // 检查网络状态
  checkNetwork() {
    return new Promise((resolve) => {
      uni.getNetworkType({
        success: (res) => {
          resolve(res.networkType !== 'none')
        },
        fail: () => {
          resolve(false)
        }
      })
    })
  }
}
