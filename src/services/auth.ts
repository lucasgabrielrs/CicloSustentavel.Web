import { clearCompanyStorage } from '@/utils/companyStorage'

const AUTH_STORAGE_KEYS = {
  token: 'token',
  userId: 'userId',
  userName: 'userName',
  userEmail: 'userEmail',
  userRole: 'userRole',
} as const

function parseJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const tokenParts = token.split('.')
    if (tokenParts.length < 2) return null
    const base64Url = tokenParts[1]

    if (!base64Url) return null

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const paddedBase64 = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
    const payloadJson = window.atob(paddedBase64)
    const payload = JSON.parse(payloadJson)

    if (!payload || typeof payload !== 'object') return null

    return payload as Record<string, unknown>
  } catch {
    return null
  }
}

export function getAccessToken(): string {
  return localStorage.getItem(AUTH_STORAGE_KEYS.token) || ''
}

export function setAccessToken(token: string) {
  localStorage.setItem(AUTH_STORAGE_KEYS.token, token)
}

export function isTokenExpired(token: string): boolean {
  if (!token) return true

  const payload = parseJwtPayload(token)
  if (!payload) return false

  const exp = Number(payload.exp)
  if (!Number.isFinite(exp)) return false

  const nowInSeconds = Math.floor(Date.now() / 1000)
  return exp <= nowInSeconds
}

export function isAuthenticated(): boolean {
  const token = getAccessToken()

  if (!token) return false

  if (isTokenExpired(token)) {
    clearAuthSession()
    return false
  }

  return true
}

export function saveAuthFromLogin(userData: Record<string, unknown>) {
  const token = String(userData.token ?? '').trim()

  if (token) setAccessToken(token)
  else localStorage.removeItem(AUTH_STORAGE_KEYS.token)

  const userId = String(userData.id ?? userData.userId ?? '').trim()
  if (userId) localStorage.setItem(AUTH_STORAGE_KEYS.userId, userId)
  else localStorage.removeItem(AUTH_STORAGE_KEYS.userId)

  const userName = String(userData.name ?? '').trim()
  if (userName) localStorage.setItem(AUTH_STORAGE_KEYS.userName, userName)
  else localStorage.removeItem(AUTH_STORAGE_KEYS.userName)

  const userEmail = String(userData.email ?? '').trim()
  if (userEmail) localStorage.setItem(AUTH_STORAGE_KEYS.userEmail, userEmail)
  else localStorage.removeItem(AUTH_STORAGE_KEYS.userEmail)

  const userRole = String(userData.role ?? '').trim()
  if (userRole) localStorage.setItem(AUTH_STORAGE_KEYS.userRole, userRole)
  else localStorage.removeItem(AUTH_STORAGE_KEYS.userRole)
}

export function clearAuthSession() {
  localStorage.removeItem(AUTH_STORAGE_KEYS.token)
  localStorage.removeItem(AUTH_STORAGE_KEYS.userId)
  localStorage.removeItem(AUTH_STORAGE_KEYS.userName)
  localStorage.removeItem(AUTH_STORAGE_KEYS.userEmail)
  localStorage.removeItem(AUTH_STORAGE_KEYS.userRole)
  clearCompanyStorage()
}
