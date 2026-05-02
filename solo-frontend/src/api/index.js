import axios from 'axios'

const API = axios.create({
  baseURL: 'https://solo-production-eb9d.up.railway.app/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt')

  if (token && !config.url.startsWith('/auth/local')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Auth
export const registerUser = (data) => API.post('/auth/local/register', data)
export const loginUser = (data) => API.post('/auth/local', data)
export const updateUserXP = (id, xp) => API.post(`/leaderboard/xp`, { userId: id, xp })
export const getLeaderboard = () => API.get('/leaderboard')

// Courses
export const getCourses = () => API.get('/courses?populate=*')

// Enrollments
export const getEnrollments = () => API.get('/enrollments?populate[course][populate]=modules')
export const enrollCourse = (courseDocumentId) =>
  API.post('/enrollments', { data: { course: courseDocumentId } })

// Progress
export const getProgress = (userId) => API.get(`/progress-trackings?filters[user][id][$eq]=${userId}&populate=module`)
export const createProgress = (data) => API.post('/progress-trackings', { data })
export const updateProgress = (id, data) => API.put(`/progress-trackings/${id}`, { data })