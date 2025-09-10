/**
 * CSRF 토큰 응답 타입
 */
export interface CSRFResponse {
  headerName: string
  parameterName: string
  token: string
}

/**
 * 로그인 요청 타입
 */
export interface LoginCredentials {
  username: string
  password: string
}

/**
 * 로그인 응답 타입 (성공 시 200 OK, 응답 바디 없음)
 */
export interface LoginResponse {
  // 성공 시 빈 응답이므로 추후 필요시 추가
}

/**
 * API 에러 응답 타입
 */
export interface ApiErrorResponse {
  code: number
  message: string
}