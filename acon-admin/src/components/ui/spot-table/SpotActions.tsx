'use client'

import { useState } from 'react'
import type { SpotItem, SpotStatus } from '@/types/spot.types'
import { useUpdateSpotStatus } from '@/hooks/useSpots'

interface SpotActionsProps {
  item: SpotItem
}

export const SpotActions = ({ item }: SpotActionsProps) => {
  const [actionMessage, setActionMessage] = useState<string>('')
  const updateStatusMutation = useUpdateSpotStatus()

  const showActionMessage = (message: string) => {
    setActionMessage(message)
  }

  const handleStatusChange = (newStatus: SpotStatus, successMessage: string) => {
    updateStatusMutation.mutate(
      { id: item.id, status: newStatus },
      {
        onSuccess: () => {
          showActionMessage(successMessage)
        }
      }
    )
  }

  if (actionMessage) {
    return (
      <span style={{
        color: 'var(--color-secondary-blue)',
        fontSize: '14px',
        fontWeight: '500'
      }}>
        {actionMessage}
      </span>
    )
  }

  const renderActionButtons = () => {
    switch (item.spotStatus) {
      case 'PENDING':
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleStatusChange('DISCARDED', '휴지통 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-black)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              휴지통
            </button>
            <button
              onClick={() => handleStatusChange('ACTIVE', '활성화 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-gray-800)',
                color: 'var(--color-white)',
                border: '1px solid var(--color-gray-800)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              활성화
            </button>
          </div>
        )

      case 'ACTIVE':
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleStatusChange('DISCARDED', '휴지통 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-black)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              휴지통
            </button>
            <button
              onClick={() => handleStatusChange('INACTIVE', '비활성화 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-black)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              비활성화
            </button>
          </div>
        )

      case 'INACTIVE':
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleStatusChange('DISCARDED', '휴지통 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-black)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              휴지통
            </button>
            <button
              onClick={() => handleStatusChange('ACTIVE', '활성화 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-gray-800)',
                color: 'var(--color-white)',
                border: '1px solid var(--color-gray-800)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              활성화
            </button>
          </div>
        )
      case 'DISCARDED':
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            <button
              onClick={() => handleStatusChange('INACTIVE', '비활성화 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-white)',
                color: 'var(--color-black)',
                border: '1px solid var(--color-gray-300)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              비활성화
            </button>
            <button
              onClick={() => handleStatusChange('ACTIVE', '활성화 처리 완료!')}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'var(--color-gray-800)',
                color: 'var(--color-white)',
                border: '1px solid var(--color-gray-800)',
                borderRadius: '6px',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              활성화
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return renderActionButtons()
}