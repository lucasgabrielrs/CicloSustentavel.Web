import axios from 'axios'
import { clearAuthSession, getAccessToken, isTokenExpired } from '@/services/auth'
import { getActiveCompanyId } from '@/utils/companyStorage'

export const api = axios.create({
  baseURL: 'https://localhost:7281/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = getAccessToken()
  const activeCompanyId = getActiveCompanyId()

  if (token && !isTokenExpired(token)) {
    config.headers.Authorization = `Bearer ${token}`
  }

  if (activeCompanyId) {
    config.headers['X-Company-Id'] = activeCompanyId
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      clearAuthSession()

      const isAuthPage =
        window.location.pathname === '/login' || window.location.pathname === '/register'

      if (!isAuthPage) {
        window.location.assign('/login')
      }
    }

    return Promise.reject(error)
  },
)
