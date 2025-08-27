'use client'

import { useState } from 'react'
import { useAllSpots } from '@/hooks/useSpots'
import { SpotTable } from '@/components/ui/spot-table'
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui'
import { Breadcrumb, PageHeader } from '@/components/layout'
import type { SpotFilters } from '@/types/spot.types'

export default function AllSpotsPage() {
  const [filters, setFilters] = useState<SpotFilters>({})
  
  const {
    data,
    isLoading,
    error,
    refetch
  } = useAllSpots()

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh'
    }}>
      <Breadcrumb current="전체 장소" />
      
      {data && (
        <PageHeader 
          title="전체 장소" 
          totalCount={data.spotList.length}
        />
      )}

      {error && <ErrorState onRetry={() => refetch()} />}
      {isLoading && <LoadingSpinner />}
      
      {data && data.spotList.length === 0 && (
        <EmptyState 
          icon="📍" 
          message="등록된 장소가 없습니다." 
        />
      )}
      
      {data && data.spotList.length > 0 && (
        <SpotTable 
          items={data.spotList}
          preset="ALL_SPOTS"
          useBuiltInActions={true}
        />
      )}
    </div>
  )
}