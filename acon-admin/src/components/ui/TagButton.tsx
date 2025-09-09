import React from 'react'

interface TagButtonProps {
  isActive: boolean
  onClick: () => void
  children: React.ReactNode
  disabled?: boolean
  className?: string
  style?: React.CSSProperties
}

export const TagButton: React.FC<TagButtonProps> = ({
  isActive,
  onClick,
  children,
  disabled = false,
  className = '',
  style = {}
}) => {
  const baseStyle: React.CSSProperties = {
    padding: '12px 24px',
    border: '1px solid',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: '400',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    backgroundColor: isActive ? 'var(--color-secondary-lightOrange)' : 'transparent',
    borderColor: isActive ? 'transparent' : 'var(--color-gray-400)',
    color: isActive ? 'var(--color-secondary-orange)' : 'var(--color-gray-500)',
    ...style
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={baseStyle}
    >
      {children}
    </button>
  )
}