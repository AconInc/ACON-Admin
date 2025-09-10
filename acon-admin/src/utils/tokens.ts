/**
 * localStorage에서 CSRF 토큰 조회
 */
export function getStoredCSRFToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('csrf_token')
}

/**
 * CSRF 토큰 저장
 */
export function storeCSRFToken(token: string): void {
  if (typeof window === 'undefined') return
  localStorage.setItem('csrf_token', token)
  if (process.env.NODE_ENV !== 'production') {
    console.log('🔑 CSRF token stored:', token.substring(0, 10) + '...')
  }
}

/**
 * 토큰 삭제
 */
export function clearStoredTokens(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem('csrf_token')
  console.log('🗑️ All tokens cleared')
}