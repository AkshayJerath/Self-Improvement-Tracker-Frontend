import axios from './axios';

/**
 * API service for making requests to the backend
 */
const api = {
  // Authentication
  auth: {
    register: (data) => axios.post('/auth/register', data),
    login: (data) => axios.post('/auth/login', data),
    refreshToken: (refreshToken) => axios.post('/auth/refresh-token', { refreshToken }),
    getProfile: () => axios.get('/auth/me'),
    updateProfile: (data) => axios.put('/auth/updatedetails', data),
    updatePassword: (data) => axios.put('/auth/updatepassword', data),
    updatePreferences: (data) => axios.put('/auth/preferences', data),
    forgotPassword: (email) => axios.post('/auth/forgotpassword', { email }),
    resetPassword: (token, password) => axios.put(`/auth/resetpassword/${token}`, { password }),
    logout: () => axios.get('/auth/logout')
  },
  
  // Behaviors
  behaviors: {
    getAll: () => axios.get('/behaviors'),
    getTop: () => axios.get('/behaviors/top'),
    getById: (id) => axios.get(`/behaviors/${id}`),
    create: (data) => axios.post('/behaviors', data),
    update: (id, data) => axios.put(`/behaviors/${id}`, data),
    delete: (id) => axios.delete(`/behaviors/${id}`)
  },
  
  // Todos
  todos: {
    getByBehavior: (behaviorId) => axios.get(`/behaviors/${behaviorId}/todos`),
    getById: (id) => axios.get(`/todos/${id}`),
    create: (behaviorId, data) => axios.post(`/behaviors/${behaviorId}/todos`, data),
    update: (id, data) => axios.put(`/todos/${id}`, data),
    toggle: (id) => axios.put(`/todos/${id}/toggle`),
    delete: (id) => axios.delete(`/todos/${id}`)
  },
  
  // Statistics
  stats: {
    getOverall: () => axios.get('/stats'),
    getBehaviorStats: (behaviorId) => axios.get(`/stats/behaviors/${behaviorId}`),
    getStreakData: () => axios.get('/stats/streak')
  },
  
  // Achievements
  achievements: {
    getAll: () => axios.get('/achievements'),
    check: () => axios.post('/achievements/check')
  }
};

export default api;