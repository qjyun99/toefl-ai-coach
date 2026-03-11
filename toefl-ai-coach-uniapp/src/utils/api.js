/**
 * API 接口配置
 * 托福AI教练 - 后端接口
 */

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api'

// 请求封装
const request = (options) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: API_BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          resolve(res.data)
        } else {
          reject(res)
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// API 接口
export default {
  // 用户相关
  user: {
    login: (data) => request({ url: '/user/login', method: 'POST', data }),
    register: (data) => request({ url: '/user/register', method: 'POST', data }),
    getProfile: () => request({ url: '/user/profile' }),
    updateProfile: (data) => request({ url: '/user/profile', method: 'PUT', data })
  },

  // 词汇相关
  vocabulary: {
    getDailyWords: () => request({ url: '/vocabulary/daily' }),
    getProgress: () => request({ url: '/vocabulary/progress' }),
    markWord: (data) => request({ url: '/vocabulary/mark', method: 'POST', data }),
    getReviewWords: () => request({ url: '/vocabulary/review' }),
    getWrongWords: () => request({ url: '/vocabulary/wrong' })
  },

  // 阅读相关
  reading: {
    getArticles: (params) => request({ url: '/reading/articles', data: params }),
    getArticleDetail: (id) => request({ url: `/reading/articles/${id}` }),
    submitAnswers: (data) => request({ url: '/reading/submit', method: 'POST', data }),
    getHistory: () => request({ url: '/reading/history' })
  },

  // 口语相关
  speaking: {
    getTasks: (type) => request({ url: `/speaking/tasks/${type}` }),
    uploadAudio: (data) => request({ url: '/speaking/upload', method: 'POST', data }),
    getFeedback: (id) => request({ url: `/speaking/feedback/${id}` }),
    getHistory: () => request({ url: '/speaking/history' })
  },

  // 写作相关
  writing: {
    getPrompts: (type) => request({ url: `/writing/prompts/${type}` }),
    submitEssay: (data) => request({ url: '/writing/submit', method: 'POST', data }),
    getFeedback: (id) => request({ url: `/writing/feedback/${id}` }),
    getTemplates: () => request({ url: '/writing/templates' }),
    getSamples: () => request({ url: '/writing/samples' }),
    saveDraft: (data) => request({ url: '/writing/draft', method: 'POST', data })
  },

  // 学习计划相关
  studyPlan: {
    getPlan: () => request({ url: '/study-plan' }),
    updateTask: (data) => request({ url: '/study-plan/task', method: 'PUT', data }),
    getStats: () => request({ url: '/study-plan/stats' }),
    getSuggestions: () => request({ url: '/study-plan/suggestions' })
  },

  // 统计相关
  statistics: {
    getOverview: () => request({ url: '/statistics/overview' }),
    getWeekly: () => request({ url: '/statistics/weekly' }),
    getAbilities: () => request({ url: '/statistics/abilities' })
  }
}
