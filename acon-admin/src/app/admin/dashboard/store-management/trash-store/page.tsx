'use client'

import { useTrashSpots } from '@/hooks/useSpots'
import { SpotTable } from '@/components/ui/spot-table'
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/ui'
import { Breadcrumb, PageHeader } from '@/components/layout'

export default function TrashSpotsPage() {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useTrashSpots()

  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh'
    }}>
      <Breadcrumb current="휴지통" />
      
      {data && (
        <PageHeader 
          title="휴지통" 
          totalCount={data.spotList.length}
        />
      )}

      {error && <ErrorState onRetry={() => refetch()} />}
      {isLoading && <LoadingSpinner />}
      
      {data && data.spotList.length === 0 && (
        <EmptyState 
          icon="🗑️" 
          message="휴지통이 비어있습니다." 
        />
      )}
      
      {data && data.spotList.length > 0 && (
        <SpotTable 
          items={data.spotList}
          preset="TRASH_SPOTS"
          useBuiltInActions={true}
        />
      )}
    </div>
  )
}