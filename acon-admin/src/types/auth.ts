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