'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useRef, useEffect } from 'react';
import Image from 'next/image'

export default function LoginForm() {
  const [id, setId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()
  const isMounted = useRef(true)
  const [error, setError] = useState<string>('');
  
  // 언마운트 시 정리
  useEffect(() => {
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 여기서 실제 로그인 API 호출
      // const response = await fetch('/api/auth/login', { ... })
      
      // 임시로 성공 처리
      setTimeout(() => {
        if (isMounted.current) {
          router.push('/dashboard')
          setLoading(false)
          setError('');
        }
      }, 1000)
    } catch (error) {
      setError('아이디 또는 비밀번호가 일치하지 않습니다.');
      if (isMounted.current) {
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* ID 입력 필드 */}
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
          onChange={(e) => setId(e.target.value)}
          placeholder="아이디를 입력해주세요"
          style={{
            width: '100%',
            padding: '16px 20px',
            border: '1px solid var(--color-gray-300)',
            borderRadius: '8px',
            boxSizing: 'border-box',
            outline: 'none',
            backgroundColor: '#fff',
            transition: 'border-color 0.2s ease',
            font: 'var(--font-r-14)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary-blue)'
            e.target.style.borderWidth = '2px'
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--color-gray-300)'
            e.target.style.borderWidth = '1px'
          }}
          required
        />
      </div>
      
      {/* Password 입력 필드 */}
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
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
            style={{
              width: '100%',
              padding: '16px 56px 16px 20px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: '12px',
              boxSizing: 'border-box',
              outline: 'none',
              backgroundColor: '#fff',
              font: 'var(--font-r-14)'
            }}
            onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-primary-blue)'
            e.target.style.borderWidth = '2px'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-gray-300)'
              e.target.style.borderWidth = '1px'
            }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: '20px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Image
              src={showPassword ? "images/icons/ic_eye_open.svg" : "images/icons/ic_eye_closed.svg"}
              alt={showPassword ? "비밀번호 숨기기" : "비밀번호 보기"}
              width={20}
              height={20}
              style={{
                transition: 'opacity 0.2s ease'
              }}
            />
          </button>
        </div>
        {/* 에러 메시지 - 여기가 올바른 위치 */}
        {error && (
          <div 
            style={{ 
              color: 'var(--color-primary-red)', 
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
      
      {/* 로그인 버튼 */}
      <button
        type="submit"
        disabled={loading}
        style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '12px',
          cursor: loading ? 'not-allowed' : 'pointer',
          opacity: loading ? 0.7 : 1,
          transition: 'all 0.2s ease',
          font: 'var(--font-sb-18)'
        }}
        onMouseOver={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = '#000'
          }
        }}
        onMouseOut={(e) => {
          if (!loading) {
            e.currentTarget.style.backgroundColor = '#333'
          }
        }}
      >
        {loading ? '로그인 중...' : '로그인'}
      </button>
    </form>
  )
}