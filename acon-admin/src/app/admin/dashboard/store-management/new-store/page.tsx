'use client'

import { useNewSpots } from '@/hooks/useSpots'
import { SpotTable } from '@/components/ui/spot-table'
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui'
import { Breadcrumb, PageHeader } from '@/components/layout'

export default function NewSpotsPage() {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useNewSpots()

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh'
    }}>
      <Breadcrumb current="신규 장소" />
      
      {data && (
        <PageHeader 
          title="신규 장소" 
          totalCount={data.spotList.length}
          description="승인 대기 중인"
        />
      )}

      {error && <ErrorState onRetry={() => refetch()} />}
      {isLoading && <LoadingSpinner />}
      
      {data && data.spotList.length === 0 && (
        <EmptyState 
          icon="✨" 
          message="승인 대기 중인 신규 장소가 없습니다." 
        />
      )}
      
      {data && data.spotList.length > 0 && (
        <SpotTable 
          items={data.spotList}
          preset="NEW_SPOTS"
          useBuiltInActions={true}
        />
      )}
    </div>
  )
}