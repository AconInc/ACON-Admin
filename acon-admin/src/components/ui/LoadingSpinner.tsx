'use client'

export const LoadingSpinner = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
    color: '#666'
  }}>
    <div style={{
      width: '24px',
      height: '24px',
      border: '2px solid var(--color-gray-300)',
      borderTop: '2px solid var(--color-secondary-orange)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)