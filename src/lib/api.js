import axios from 'axios'

const api = axios.create({
  baseURL: 'https://khabar-backend-pwnp.onrender.com/api',
})

// Automatically attach the saved JWT token (if any) to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('khabar_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
