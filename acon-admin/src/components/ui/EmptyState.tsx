'use client'

export interface EmptyStateProps {
  icon: string
  message: string
  action?: {
    label: string
    onClick: () => void
  }
}

export const EmptyState = ({ 
  icon, 
  message,
  action 
}: EmptyStateProps) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '300px',
    backgroundColor: 'white',
    borderRadius: '12px',
    color: '#666'
  }}>
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{icon}</div>
    <p style={{ fontSize: '16px', margin: '0 0 16px 0' }}>{message}</p>
    {action && (
      <button
        onClick={action.onClick}
        style={{
          padding: '8px 16px',
          backgroundColor: 'var(--color-secondary-blue)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
      >
        {action.label}
      </button>
    )}
  </div>
)