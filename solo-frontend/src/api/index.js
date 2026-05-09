import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://solo-production-eb9d.up.railway.app/api',
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
export const getMe = () => API.get('/users/me')
export const updateUserXP = (id, xp) => API.post(`/leaderboard/xp`, { userId: id, xp })
export const updateUserGoal = (id, goal) => API.post(`/user/goal`, { userId: id, goal })
export const getLeaderboard = () => API.get('/leaderboard')

// Courses
export const getCourses = () => API.get('/courses?populate=*')

// Enrollments
export const getEnrollments = () => API.get('/enrollments?populate=course.modules')
export const enrollCourse = (courseDocumentId) =>
  API.post('/enrollments', { data: { course: courseDocumentId } })

// Progress
export const getProgress = (userId) => API.get(`/progress-trackings?filters[user][id][$eq]=${userId}&populate=module`)
export const createProgress = (data) => API.post('/progress-trackings', { data })
export const updateProgress = (id, data) => API.put(`/progress-trackings/${id}`, { data })

// Comments
export const getComments = (moduleId) => API.get(`/comments?filters[module][id][$eq]=${moduleId}&populate[0]=user&populate[1]=parent&sort=createdAt:asc`)
export const createComment = (data) => API.post('/comments', { data })