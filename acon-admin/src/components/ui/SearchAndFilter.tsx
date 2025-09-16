'use client'

import React, { useState, useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import type { SpotFilters, QueryTarget, SpotStatus, MissingField } from '@/types/spot.types'

interface SearchAndFilterProps {
  filters: SpotFilters
  onFiltersChange: (filters: SpotFilters) => void
  hideStatusFilter?: boolean // 특정 페이지에서 상태 필터 숨기기
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filters,
  onFiltersChange,
  hideStatusFilter = false
}) => {
  const [searchQuery, setSearchQuery] = useState(filters.query || '')
  const [queryTarget, setQueryTarget] = useState<QueryTarget>(filters.queryTarget || 'SPOT_NAME')
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)

  // 디바운스된 검색어
  const debouncedQuery = useDebounce(searchQuery, 300)

  // 검색어가 변경될 때마다 필터 업데이트
  useEffect(() => {
    onFiltersChange({
      ...filters,
      query: debouncedQuery || undefined,
      queryTarget: debouncedQuery ? queryTarget : undefined
    })
  }, [debouncedQuery, queryTarget])

  const queryTargetOptions = [
    { value: 'SPOT_NAME', label: '장소명' },
    { value: 'USER_NICKNAME', label: '닉네임' },
    { value: 'SPOT_ID', label: '장소 ID' }
  ]

  return (
    <>
      <div style={{
        display: 'flex',
        gap: '12px',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        {/* 검색 종류 선택 */}
        <div style={{ position: 'relative' }}>
          <select
            value={queryTarget}
            onChange={(e) => setQueryTarget(e.target.value as QueryTarget)}
            style={{
              padding: '12px 36px 12px 16px',
              fontSize: '14px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              appearance: 'none',
              minWidth: '120px'
            }}
          >
            {queryTargetOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            pointerEvents: 'none',
            color: 'var(--color-gray-500)'
          }}>
            ▼
          </div>
        </div>

        {/* 검색 필드 */}
        <div style={{
          position: 'relative',
          flex: '1',
          maxWidth: '400px'
        }}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="검색어를 입력하세요"
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '14px',
              border: '1px solid var(--color-gray-300)',
              borderRadius: '8px',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary-blue)'
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--color-gray-300)'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: 'var(--color-gray-400)',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              ×
            </button>
          )}
        </div>

        {/* 필터 버튼 */}
        <button
          onClick={() => setIsFilterModalOpen(true)}
          style={{
            padding: '12px 20px',
            fontSize: '14px',
            backgroundColor: filters.status?.length || filters.missingField ? 
              'var(--color-primary-blue)' : 'var(--color-white)',
            color: filters.status?.length || filters.missingField ? 
              'var(--color-white)' : 'var(--color-black)',
            border: filters.status?.length || filters.missingField ? 
              'none' : '1px solid var(--color-gray-300)',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '500',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            whiteSpace: 'nowrap'
          }}
        >
          정렬 및 필터
        </button>
      </div>

      {/* 필터 모달 */}
      {isFilterModalOpen && (
        <FilterModal
          filters={filters}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={(newFilters) => {
            onFiltersChange(newFilters)
            setIsFilterModalOpen(false)
          }}
          hideStatusFilter={hideStatusFilter}
        />
      )}
    </>
  )
}

// Filter Modal Component
interface FilterModalProps {
  filters: SpotFilters
  onClose: () => void
  onApply: (filters: SpotFilters) => void
  hideStatusFilter?: boolean
}

const FilterModal: React.FC<FilterModalProps> = ({
  filters,
  onClose,
  onApply,
  hideStatusFilter = false
}) => {
  const [selectedStatus, setSelectedStatus] = useState<SpotStatus[]>(filters.status || [])
  const [selectedMissingField, setSelectedMissingField] = useState<MissingField | undefined>(filters.missingField)

  const statusOptions = [
    { value: 'PENDING', label: '대기', color: 'var(--color-gray-700)' },
    { value: 'ACTIVE', label: '활성화', color:  'var(--color-gray-700)' },
    { value: 'INACTIVE', label: '비활성화', color:  'var(--color-gray-700)' }
  ]

  const missingFieldOptions = [
    { value: 'ALL', label: '전체' },
    { value: 'SPOT_IMAGE', label: '장소 이미지' },
    { value: 'OPENING_HOURS', label: '영업시간' }
  ]

  const handleStatusToggle = (status: SpotStatus) => {
    setSelectedStatus(prev => 
      prev.includes(status) 
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const handleApply = () => {
    onApply({
      ...filters,
      status: selectedStatus.length > 0 ? selectedStatus : undefined,
      missingField: selectedMissingField
    })
  }

  const handleReset = () => {
    setSelectedStatus([])
    setSelectedMissingField(undefined)
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '24px',
        maxWidth: '500px',
        width: '90%',
        maxHeight: '80vh',
        overflow: 'auto'
      }}>
        {/* 헤더 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <h2 style={{
            fontSize: '18px',
            fontWeight: '600',
            margin: 0
          }}>
            필터
          </h2>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '20px',
              cursor: 'pointer',
              padding: '4px'
            }}
          >
            ×
          </button>
        </div>

        {/* 상태 필터 - 전체 장소 페이지에서만 표시 */}
        {!hideStatusFilter && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              marginBottom: '16px',
              color: 'var(--color-gray-700)'
            }}>
              상태
            </h3>
            <div style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap'
            }}>
              {statusOptions.map(option => {
                const isSelected = selectedStatus.includes(option.value as SpotStatus)
                return (
                  <button
                    key={option.value}
                    onClick={() => handleStatusToggle(option.value as SpotStatus)}
                    style={{
                      padding: '8px 16px',
                      fontSize: '14px',
                      backgroundColor: isSelected ? 'var(--color-secondary-skyBlue)' : 'transparent',
                      color: isSelected ? 'var(--color-secondary-blue)' : option.color,
                      border: isSelected ? `1px solid var(--color-secondary-skyBlue)` : `1px solid ${option.color}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {option.label}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Null값 존재 필터 */}
        <div style={{ marginBottom: '32px' }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '16px',
            color: 'var(--color-gray-700)'
          }}>
            Null값 존재
          </h3>
          <div style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            {missingFieldOptions.map(option => {
              const isSelected = selectedMissingField === option.value
              return (
                <button
                  key={option.value}
                  onClick={() => setSelectedMissingField(
                    isSelected ? undefined : option.value as MissingField
                  )}
                  style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    backgroundColor: isSelected ? 'var(--color-secondary-skyBlue)' : 'transparent',
                    color: isSelected ? 'var(--color-secondary-blue)' : 'var(--color-gray-700)',
                    border: isSelected ? `1px solid var(--color-secondary-skyBlue)` : `1px solid var(--color-gray-700)`,
                    borderRadius: '20px',
                    cursor: 'pointer',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* 버튼 영역 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          justifyContent: 'flex-end'
        }}>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              backgroundColor: 'var(--color-gray-800)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            초기화
          </button>
          <button
            onClick={handleApply}
            style={{
              padding: '12px 24px',
              fontSize: '14px',
              backgroundColor: 'var(--color-primary-blue)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            적용하기
          </button>
        </div>
      </div>
    </div>
  )
}