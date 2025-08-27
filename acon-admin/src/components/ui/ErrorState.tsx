'use client'

export interface ErrorStateProps {
  onRetry: () => void
  message?: string
}

export const ErrorState = ({ 
  onRetry, 
  message = "데이터를 불러오는데 실패했습니다." 
}: ErrorStateProps) => (
  <div style={{
    border: '1px solid var(--color-gray-300)',
    borderRadius: '8px',
    padding: '16px',
    color: 'var(--color-primary-red)',
  }}>
    <p style={{ margin: '0 0 8px 0' }}>{message}</p>
    <button 
      onClick={onRetry}
      style={{
        padding: '8px 16px',
        backgroundColor: 'var(--color-primary-red)',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
      }}
    >
      다시 시도
    </button>
  </div>
)