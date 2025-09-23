// lib/auth.ts
import { apiRequest, apiRequestFormData } from './api'
import { getStoredCSRFToken, storeCSRFToken, clearStoredTokens } from '../utils/tokens'
import { CSRFResponse, LoginCredentials } from '../types/auth'

/**
 * CSRF 토큰 발급
 */
export async function fetchCSRFToken(): Promise<string> {
  console.log('🔄 Fetching CSRF token...')
  
  const response = await apiRequest<CSRFResponse>('/admin/csrf', {
    method: 'GET'
  })
  
  storeCSRFToken(response.token)
  
  console.log('✅ CSRF token fetched successfully')
  console.log('📋 Token details:', {
    headerName: response.headerName,
    parameterName: response.parameterName,
    tokenPreview: response.token.substring(0, 10) + '...'
  })
  
  return response.token
}

/**
 * 로그인
 */
export async function loginUser(credentials: LoginCredentials): Promise<void> {
  console.log('🚀 Starting login process...')
  console.log('👤 Username:', credentials.username)

  // 1. 로그인 전 CSRF 토큰 발급
  console.log('📝 Step 1: Getting CSRF token before login')
  const csrfToken = await fetchCSRFToken()

  // 2. Form data 생성
  console.log('📝 Step 2: Creating form data')
  const formData = new URLSearchParams()
  formData.append('username', credentials.username)
  formData.append('password', credentials.password)

  // 3. 로그인 요청
  console.log('📝 Step 3: Sending login request')
  await apiRequestFormData<void>(
    '/admin/login',
    formData,
    {
      'X-XSRF-TOKEN': csrfToken,
    }
  )

  localStorage.setItem('user', JSON.stringify({
    username: credentials.username,
  }))

  console.log('✅ Login request successful')

  // 4. 로그인 후 새 CSRF 토큰 발급
  console.log('📝 Step 4: Getting new CSRF token after login')
  await fetchCSRFToken()

  console.log('🎉 Login process completed successfully')
}

/**
 * 로그아웃
 */
export async function logoutUser(): Promise<void> {
  console.log('👋 Starting logout process...')
  
  try {
    const csrfToken = getStoredCSRFToken()
    
    if (csrfToken) {
      console.log('📝 Sending logout request with CSRF token')
      await apiRequest<void>('/admin/logout', {
        method: 'POST',
        requireAuth: true,
      })
      console.log('✅ Logout request successful')
    } else {
      console.warn('⚠️ No CSRF token found, attempting logout without token')
      // CSRF 토큰이 없어도 로그아웃 시도 (세션 정리용)
      await apiRequestFormData<void>(
        '/admin/logout',
        new URLSearchParams(),
        {}
      )
    }
  } catch (error) {
    console.error('❌ Logout request failed:', error)
    // 로그아웃 요청이 실패해도 계속 진행
    // CSRF 에러든 다른 에러든 클라이언트 측 정리는 수행
  } finally {
    clearStoredTokens()
    localStorage.removeItem('user')
    console.log('🎉 Logout process completed - all tokens cleared')
  }
}

/**
 * 인증 상태 확인
 */
export function isAuthenticated(): boolean {
  const hasToken = !!getStoredCSRFToken()
  console.log('🔍 Authentication check:', hasToken ? 'Authenticated' : 'Not authenticated')
  return hasToken
}

export { getStoredCSRFToken, storeCSRFToken, clearStoredTokens } from '../utils/tokens'