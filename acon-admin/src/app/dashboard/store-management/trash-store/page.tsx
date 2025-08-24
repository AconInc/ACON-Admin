'use client'

import { useState } from 'react'
import { useTrashSpots, useRestoreSpot, usePermanentDeleteSpot } from '@/hooks/use-spots'
import type { SpotItem } from '@/types/spot.types'

// Components
const Breadcrumb = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    color: '#666'
  }}>
    <span>장소 관리</span>
    <span>{'>'}</span>
    <span style={{ color: '#333', fontWeight: '500' }}>휴지통</span>
  </div>
)

const PageHeader = ({ totalCount }: { totalCount: number }) => (
  <div style={{ marginBottom: '24px' }}>
    <h1 style={{
      fontSize: '28px',
      fontWeight: '700',
      color: '#333',
      margin: '0 0 28px 0'
    }}>
      휴지통
    </h1>
    <p style={{
      fontSize: '16px',
      color: '#666',
      margin: '0 0 0 0'
    }}>
      <span style={{ color: 'var(--color-secondary-blue)', fontWeight: '600' }}>
        {totalCount}
      </span>
      개의 결과
    </p>
  </div>
)

const LoadingSpinner = () => (
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

const EmptyState = () => (
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
    <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗑️</div>
    <p style={{ fontSize: '16px', margin: 0 }}>휴지통이 비어있습니다.</p>
  </div>
)

const ErrorState = ({ onRetry }: { onRetry: () => void }) => (
  <div style={{
    border: '1px solid var(--color-gray-300)',
    borderRadius: '8px',
    padding: '16px',
    color: 'var(--color-primary-red)',
  }}>
    <p style={{ margin: '0 0 8px 0' }}>데이터를 불러오는데 실패했습니다.</p>
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

const TrashStoreTableHeader = () => (
  <thead>
    <tr style={{
      backgroundColor: 'var(--color-gray-100)',
      borderBottom: '3px solid var(--color-gray-300)'
    }}>
      <th style={{
        padding: '16px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-gray-500)',
        width: '80px'
      }}>
        ID
      </th>
      <th style={{
        padding: '16px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-gray-500)',
        width: '150px'
      }}>
        닉네임
      </th>
      <th style={{
        padding: '16px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-gray-500)'
      }}>
        장소명
      </th>
      <th style={{
        padding: '16px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-gray-500)',
        width: '100px'
      }}>
        장소 유형
      </th>
      <th style={{
        padding: '16px',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-gray-500)',
        width: '250px'
      }}>
        수정 날짜
      </th>
      <th style={{
        padding: '16px',
        textAlign: 'center',
        fontSize: '14px',
        fontWeight: '600',
        color: 'var(--color-gray-500)',
        width: '120px'
      }}>
        액션
      </th>
    </tr>
  </thead>
)

const TrashStoreTableRow = ({ item, onRestore}: { 
  item: SpotItem 
  onRestore: (id: number) => void
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getSpotTypeDisplay = (type: string) => {
    switch (type) {
      case 'CAFE': return '카페'
      case 'RESTAURANT': return '레스토랑'
      default: return type
    }
  }

  return (
    <tr style={{
      borderBottom: '1px solid var(--color-gray-200)',
      height: '60px'
    }}>
      <td style={{
        padding: '16px',
        textAlign: 'center',
        color: '#666',
        fontSize: '14px'
      }}>
        {item.id}
      </td>
      <td style={{
        padding: '16px',
        color: '#333',
        fontSize: '14px'
      }}>
        {item.userNickname}
      </td>
      <td style={{
        padding: '16px',
        color: '#333',
        fontSize: '14px'
      }}>
        {item.spotName}
      </td>
      <td style={{
        padding: '16px',
        textAlign: 'left'
      }}>
        <span style={{
          padding: '4px 8px',
          borderRadius: '8px',
          fontSize: '12px',
          fontWeight: '500',
          backgroundColor: item.spotType === 'CAFE' ? 'var(--color-secondary-lightYellow)' : 'var(--color-secondary-skyBlue)',
          color: item.spotType === 'CAFE' ? 'var(--color-secondary-brown)' : 'var(--color-secondary-purple)'
        }}>
          {getSpotTypeDisplay(item.spotType)}
        </span>
      </td>
      <td style={{
        padding: '16px',
        color: '#666',
        fontSize: '14px',
        textAlign: 'left'
      }}>
        {formatDate(item.updatedAt)}
      </td>
      <td style={{
        padding: '16px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          <button
            onClick={() => onRestore(item.id)}
            style={{
              padding: '4px 8px',
              fontSize: '12px',
              backgroundColor: 'var(--color-secondary-green)',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            복원
          </button>
        </div>
      </td>
    </tr>
  )
}

const TrashStoreTable = ({ 
  items, 
  onRestore
}: { 
  items: SpotItem[]
  onRestore: (id: number) => void
}) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '12px',
    overflow: 'hidden'
  }}>
    <table style={{
      width: '100%',
      borderCollapse: 'collapse'
    }}>
      <TrashStoreTableHeader />
      <tbody>
        {items.map((item) => (
          <TrashStoreTableRow 
            key={item.id} 
            item={item} 
            onRestore={onRestore}
          />
        ))}
      </tbody>
    </table>
  </div>
)

// Main Page Component
export default function TrashStorePage() {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useTrashSpots() // 휴지통 전용 훅 사용

  const restoreMutation = useRestoreSpot()
  const deleteMutation = usePermanentDeleteSpot()

  const handleRestore = (id: number) => {
    if (confirm('이 장소를 복원하시겠습니까?')) {
      restoreMutation.mutate(id)
    }
  }

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh'
    }}>
      <Breadcrumb />
      
      {data && <PageHeader totalCount={data.spotList.length} />}

      {error && <ErrorState onRetry={() => refetch()} />}
      
      {isLoading && <LoadingSpinner />}
      
      {data && data.spotList.length === 0 && <EmptyState />}
      
      {data && data.spotList.length > 0 && (
        <TrashStoreTable 
          items={data.spotList} 
          onRestore={handleRestore}
        />
      )}
    </div>
  )
}