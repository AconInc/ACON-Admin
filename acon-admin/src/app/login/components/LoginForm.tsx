'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'

export default function LoginForm() {
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const isMounted = useRef(true)
  
  const { login, isLoading, error, clearError } = useAuth()
  
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!isMounted.current || isLoading) return
    
    try {
      await login({ 
        username: id.trim(), 
        password: password 
      })
    } catch (err) {
      console.log('Form submission error handled by useAuth hook')
    }
  }

  const handleIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value)
    if (error) {
      clearError()
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (error) {
      clearError()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const isFormValid = id.trim().length > 0 && password.length > 0
  const isSubmitDisabled = isLoading || !isFormValid

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: '24px', textAlign: 'left' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: 'var(--color-gray-700)',
          font: 'var(--font-sb-18)'
        }}>
          ID
        </label>
        <input
          type="text"
          value={id}
          onChange={handleIdChange}
          placeholder="아이디를 입력해주세요"
          disabled={isLoading}
          autoComplete="username"
          style={{
            width: '100%',
            padding: '16px 20px',
            border: '1px solid var(--color-gray-300)',
            borderRadius: '8px',
            boxSizing: 'border-box',
            outline: 'none',
            backgroundColor: isLoading ? '#f5f5f5' : '#fff',
            transition: 'border-color 0.2s ease',
            font: 'var(--font-r-14)',
            cursor: isLoading ? 'not-allowed' : 'text'
          }}
          onFocus={(e) => {
            if (!isLoading) {
              e.target.style.borderColor = 'var(--color-primary-blue)'
              e.target.style.borderWidth = '2px'
            }
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-gray-300)'
            e.target.style.borderWidth = '1px'
          }}
          required
        />
      </div>
      
      <div style={{ marginBottom: '32px', textAlign: 'left' }}>
        <label style={{ 
          display: 'block', 
          marginBottom: '8px', 
          color: 'var(--color-gray-700)',
          font: 'var(--font-sb-18)'
        }}>
          Password
        </label>
        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={handlePasswordChange}
            placeholder="비밀번호를 입력해주세요"
            disabled={isLoading}
            autoComplete="current-password"
            style={{
              width: '100%',
              padding: '16px 56px 16px 20px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: '8px',
              boxSizing: 'border-box',
              outline: 'none',
              backgroundColor: isLoading ? '#f5f5f5' : '#fff',
              font: 'var(--font-r-14)',
              cursor: isLoading ? 'not-allowed' : 'text'
            }}
            onFocus={(e) => {
              if (!isLoading) {
                e.target.style.borderColor = 'var(--color-primary-blue)'
                e.target.style.borderWidth = '2px'
              }
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-gray-300)'
              e.target.style.borderWidth = '1px'
            }}
            required
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={isLoading}
            aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isLoading ? 0.5 : 1
            }}
          >
            <Image
              src={showPassword ? "/images/icons/ic_eye_open.svg" : "/images/icons/ic_eye_closed.svg"}
              alt={showPassword ? "비밀번호 보기" : "비밀번호 숨기기"}
              width={20}
              height={20}
              style={{
                transition: 'opacity 0.2s ease'
              }}
            />
          </button>
        </div>
        
        {error && (
          <div 
            style={{ 
              color: 'var(--color-primary-red)', 
              backgroundColor: 'transparent',
              font: 'var(--font-r-14)',
              marginTop: '8px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}
          >
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        disabled={isSubmitDisabled}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: isSubmitDisabled ? '#ccc' : '#333',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: isSubmitDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          font: 'var(--font-sb-18)'
        }}
        onMouseOver={(e) => {
          if (!isSubmitDisabled) {
            e.currentTarget.style.backgroundColor = '#000'
          }
        }}
        onMouseOut={(e) => {
          if (!isSubmitDisabled) {
            e.currentTarget.style.backgroundColor = '#333'
          }
        }}
      >
        {isLoading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}