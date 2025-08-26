'use client'

export interface PageHeaderProps {
  title: string
  totalCount: number
  description?: string
  actions?: React.ReactNode
}

export const PageHeader = ({ 
  title, 
  totalCount,
  description,
  actions 
}: PageHeaderProps) => (
  <div style={{ 
    marginBottom: '24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end'
  }}>
    <div>
      <h1 style={{
        fontSize: '28px',
        fontWeight: '700',
        color: '#333',
        margin: '0 0 28px 0'
      }}>
        {title}
      </h1>
      <p style={{
        fontSize: '16px',
        color: '#666',
        margin: '0'
      }}>
        {description && <span>{description} </span>}
        <span style={{ color: 'var(--color-secondary-blue)', fontWeight: '600' }}>
          {totalCount.toLocaleString()}
        </span>
        개의 결과
      </p>
    </div>
    {actions && (
      <div style={{ marginLeft: '20px' }}>
        {actions}
      </div>
    )}
  </div>
)