import { ApiErrorResponse } from '../types/ApiErrorResponse'
import { getStoredCSRFToken } from '../utils/tokens'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

interface FetchOptions extends RequestInit {
  requireAuth?: boolean
}

/**
 * API 에러 클래스
 */
export class ApiError extends Error {
  public code: number
  public statusCode: number
  public responseData?: any

  constructor(code: number, message: string, statusCode: number, responseData?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.statusCode = statusCode
    this.responseData = responseData
  }
}

/**
 * 쿠키 상태 디버깅 함수 - localStorage 기반
 */
function debugCookies(): void {
  if (typeof window !== 'undefined') {
    // document.cookie는 Path 문제로 읽기 포기
    console.log('🍪 Cookie reading skipped (Path=/admin issue)')
    
    // localStorage의 CSRF 토큰만 확인
    const storedToken = localStorage.getItem('csrf_token')
    console.log('🔑 Stored CSRF token:', storedToken ? `${storedToken.substring(0, 10)}...` : 'NOT FOUND')
    
    // 현재 페이지 경로 확인
    console.log('📍 Current path:', window.location.pathname)
    console.log('🔄 Note: JSESSIONID will be sent automatically via credentials: "include"')
  }
}

/**
 * 403 CSRF 에러 처리 함수 - 무조건 로그아웃 정책
 */
async function handleCSRFError(errorCode: number, endpoint: string): Promise<void> {
  console.warn(`🔐 CSRF Error detected [${errorCode}] on ${endpoint} - Forcing logout for security`)
  
  // 1. 토큰 즉시 정리
  if (typeof window !== 'undefined') {
    localStorage.removeItem('csrf_token')
    console.log('🗑️ CSRF token cleared due to 403 error')
  }

  // 2. 로그아웃 API 호출 시도 (CSRF 토큰 없이, 세션 정리용)
  if (typeof window !== 'undefined') {
    try {
      await fetch(`${API_BASE_URL}/admin/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        credentials: 'include',
      })
      console.log('✅ Logout API called successfully')
    } catch (logoutError) {
      console.warn('⚠️ Logout API failed, but continuing with cleanup:', logoutError)
    }
    
    // 3. 로그인 페이지로 강제 리다이렉트 (현재 페이지가 로그인이 아닌 경우)
    if (window.location.pathname !== '/login') {
      console.log('🔄 Redirecting to login page due to CSRF security violation')
      window.location.href = '/login'
    }
  }
}

/**
 * 기본 fetch wrapper with 공통 에러 처리
 */
export async function apiRequest<T>(
  endpoint: string, 
  options: FetchOptions = {}
): Promise<T> {
  const { requireAuth = false, ...fetchOptions } = options
  
  const url = `${API_BASE_URL}${endpoint}`
  
  // 요청 전 상태 디버깅 (간소화)
  console.log(`🚀 API Request [${fetchOptions.method || 'GET'}] ${url}`)
  debugCookies()
  
  const config: RequestInit = {
    credentials: 'include', // 쿠키 포함 (JSESSIONID 자동 전송)
    headers: {
      'Content-Type': 'application/json',
      ...fetchOptions.headers,
    },
    ...fetchOptions,
  }

  // 인증이 필요한 경우 CSRF 토큰 추가 (localStorage에서만)
  if (requireAuth) {
    const csrfToken = getStoredCSRFToken()
    if (csrfToken) {
      config.headers = {
        ...config.headers,
        'X-XSRF-TOKEN': csrfToken,
      }
      console.log('🔑 CSRF token added to header:', `${csrfToken.substring(0, 10)}...`)
    } else {
      console.error('CSRF token not found for authenticated request')
      throw new ApiError(401, 'Authentication required', 401)
    }
  }

  // 요청 상세 로그
  console.log('📤 Request Details:', {
    url,
    method: config.method || 'GET',
    credentials: config.credentials,
    headers: config.headers,
    body: config.body
  })

  try {
    const response = await fetch(url, config)
    
    // 응답 상세 로그
    console.log('📥 Response Details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    // 응답 내용 파싱
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responseData: any = null
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json()
      console.log('📋 Response Body:', responseData)
    }

    // 상태 코드별 처리
    if (response.status === 200) {
      console.log(`✅ API Success [${response.status}] ${endpoint}`)
      return responseData || (response as unknown as T)
    } else if (response.status === 401) {
      const errorData: ApiErrorResponse = responseData || {
        code: response.status,
        message: response.statusText
      }
      
      console.error(`🚫 Authentication failed [${response.status}] ${endpoint}`)
      console.error('🔍 Possible reasons: JSESSIONID not sent or session expired')
      console.error('💡 Note: JSESSIONID should be sent automatically via credentials: include')
      
      throw new ApiError(errorData.code, errorData.message, response.status)
      throw new ApiError(errorData.code, errorData.message, response.status, responseData)
    } else if (response.status === 403) {
      // 403 Forbidden - CSRF 관련 에러 처리
      const errorData: ApiErrorResponse = responseData || {
        code: response.status,
        message: response.statusText
      }
      
      console.error(`🔐 API CSRF Error [${response.status}] ${endpoint}:`, {
        code: errorData.code,
        message: errorData.message,
        url,
        requestOptions: config
      })
      
      // CSRF 관련 에러 코드 확인 (requireAuth가 true인 경우에만)
      if (requireAuth && [40301, 40302, 40303].includes(errorData.code)) {
        await handleCSRFError(errorData.code, endpoint)
      }
      
      throw new ApiError(errorData.code, errorData.message, response.status)
      throw new ApiError(errorData.code, errorData.message, response.status, responseData)
    } else if (response.status >= 400 && response.status < 500) {
      // 기타 4xx 클라이언트 에러
      const errorData: ApiErrorResponse = responseData || {
        code: response.status,
        message: response.statusText
      }
      
      console.error(`❌ Client Error [${response.status}] ${endpoint}:`, {
        code: errorData.code,
        message: errorData.message,
        url,
        requestOptions: config
      })

      throw new ApiError(errorData.code, errorData.message, response.status, responseData)
    } else if (response.status >= 500) {
      // 5xx 서버 에러
      const errorData: ApiErrorResponse = responseData || {
        code: response.status,
        message: 'Internal Server Error'
      }
      
      console.error(`🔥 Server Error [${response.status}] ${endpoint}:`, {
        code: errorData.code,
        message: errorData.message,
        url,
        requestOptions: config
      })
      
      throw new ApiError(errorData.code, errorData.message, response.status, responseData)
    } else {
      // 기타 상태 코드
      console.warn(`⚠️ Unexpected Status [${response.status}] ${endpoint}`)
      return responseData || (response as unknown as T)
    }
  } catch (error) {
    // 네트워크 에러 등
    if (error instanceof ApiError) {
      throw error
    }
    
    console.error(`💥 Network Error ${endpoint}:`, error)
    throw new ApiError(0, 'Network connection failed', 0)
  }
}

/**
 * Form data 전용 요청 함수
 */
export async function apiRequestFormData<T>(
  endpoint: string,
  formData: URLSearchParams,
  additionalHeaders: Record<string, string> = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      ...additionalHeaders,
    },
    body: formData,
    credentials: 'include',
  }

  console.log('🚀 Form Data Request Details:', {
    url,
    method: 'POST',
    headers: config.headers,
    credentials: config.credentials,
    formData: Object.fromEntries(formData.entries())
  })

  try {
    const response = await fetch(url, config)
    
    console.log('📥 Form Response Details:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })
    
    // 로그인 성공 후 쿠키 확인
    if (response.status === 200 && endpoint === '/admin/login') {
      console.log('🎉 Login successful! Checking cookies after login...')
      setTimeout(() => {
        debugCookies()
      }, 100) // 쿠키 설정 대기
    }
    
    // 응답 내용 파싱
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let responseData: any = null
    const contentType = response.headers.get('content-type')
    
    if (contentType?.includes('application/json')) {
      responseData = await response.json()
      console.log('📋 Form Response Body:', responseData)
    }

    // 상태 코드별 처리
    if (response.status === 200) {
      console.log(`✅ Form Data Success [${response.status}] ${endpoint}`)
      return responseData || (response as unknown as T)
    } else if (response.status >= 400 && response.status < 500) {
      // 4xx 클라이언트 에러
      const errorData: ApiErrorResponse = responseData || {
        code: response.status,
        message: response.statusText
      }
      
      console.error(`❌ Form Data Client Error [${response.status}] ${endpoint}:`, {
        code: errorData.code,
        message: errorData.message,
        url,
        formData: Object.fromEntries(formData.entries())
      })
      
      throw new ApiError(errorData.code, errorData.message, response.status, responseData)
    } else if (response.status >= 500) {
      // 5xx 서버 에러
      const errorData: ApiErrorResponse = responseData || {
        code: response.status,
        message: 'Internal Server Error'
      }
      
      console.error(`🔥 Form Data Server Error [${response.status}] ${endpoint}:`, {
        code: errorData.code,
        message: errorData.message,
        url,
        formData: Object.fromEntries(formData.entries())
      })
      
      throw new ApiError(errorData.code, errorData.message, response.status, responseData)
    } else {
      // 기타 상태 코드
      console.warn(`⚠️ Form Data Unexpected Status [${response.status}] ${endpoint}`)
      return responseData || (response as unknown as T)
    }
  } catch (error) {
    // 네트워크 에러 등
    if (error instanceof ApiError) {
      throw error
    }
    
    console.error(`💥 Form Data Network Error ${endpoint}:`, error)
    throw new ApiError(0, 'Network connection failed', 0)
  }
}