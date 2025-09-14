import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { loginUser, logoutUser, isAuthenticated } from '../lib/auth'
import { LoginCredentials } from '../types/auth'
import { ApiError } from '../lib/api'

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  // 로그인 상태 확인
  const checkAuthStatus = useCallback(() => {
    return isAuthenticated()
  }, [])

  // 로그인
  const login = useCallback(async (credentials: LoginCredentials) => {
    console.log('🎯 useAuth: Starting login...')
    setIsLoading(true)
    setError('')
    
    try {
      await loginUser(credentials)
      console.log('🎉 useAuth: Login successful, redirecting to dashboard')
      router.push('/admin/dashboard')
    } catch (err) {
      console.error('❌ useAuth: Login failed:', err)
      
      let errorMessage = '로그인 중 오류가 발생했습니다.'
      
      if (err instanceof ApiError) {
        // CSRF 에러는 이미 handleCSRFError에서 처리되어 리다이렉트됨
        // 하지만 로그인 API에서는 리다이렉트하지 않으므로 에러 메시지 표시
        if ([40301, 40302, 40303].includes(err.code)) {
          errorMessage = '보안 오류가 발생했습니다. 새로고침 / 브라우저 종료 / 사파리 외 다른 브라우저로 전환 후 다시 시도해주세요.'
        } else {
          // 일반적인 로그인 에러 처리
          switch (err.code) {
            case 40105: // 아이디/비밀번호 불일치
              errorMessage = '아이디 또는 비밀번호가 일치하지 않습니다.'
              break
            case 40101: // 필수 필드 누락
              errorMessage = '아이디와 비밀번호를 모두 입력해주세요.'
              break
            case 42901: // 계정 잠금
              errorMessage = '계정이 잠겨있습니다. 관리자에게 문의하세요.'
              break
            default:
              if (err.statusCode >= 400 && err.statusCode < 500) {
                errorMessage = err.message || '아이디 또는 비밀번호가 일치하지 않습니다.'
              } else if (err.statusCode >= 500) {
                errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
              } else if (err.statusCode === 0) {
                errorMessage = '네트워크 연결을 확인해주세요.'
              }
          }
        }
      } else if (err instanceof Error) {
        if (err.message.includes('Network')) {
          errorMessage = '네트워크 연결을 확인해주세요.'
        } else {
          errorMessage = err.message
        }
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [router])

  // 로그아웃
  const logout = useCallback(async () => {
    console.log('👋 useAuth: Starting logout...')
    
    try {
      await logoutUser()
      console.log('✅ useAuth: Logout successful, redirecting to login')
      router.push('/login')
    } catch (err) {
      console.error('❌ useAuth: Logout error:', err)
      // 로그아웃은 실패해도 리다이렉트
      router.push('/login')
    }
  }, [router])

  // 에러 클리어
  const clearError = useCallback(() => {
    setError('')
  }, [])

  return {
    // 상태
    isAuthenticated: checkAuthStatus,
    isLoading,
    error,
    
    // 액션
    login,
    logout,
    clearError,
  }
}