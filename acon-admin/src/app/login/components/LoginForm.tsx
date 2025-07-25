'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginForm() {
  const [id, setId] = useState<string>('Acon')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      // 여기서 실제 로그인 API 호출
      // const response = await fetch('/api/auth/login', { ... })
      
      // 임시로 성공 처리
      setTimeout(() => {
        router.push('/dashboard')
        setLoading(false)
      }, 1000)
      
    } catch (error) {
      alert('로그인에 실패했습니다.')
      setLoading(false)
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
            <img
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