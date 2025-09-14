// hooks/useSpots.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { spotService } from '@/services/spot.service'
import type { SpotFilters, SpotListResponse, SpotStatus } from '@/types/spot.types'
import { PAGE_FILTERS } from '@/types/spot.types'

// 쿼리 키 상수
const QUERY_KEYS = {
  spots: (filters?: SpotFilters) => ['spots', filters] as const,
  allSpots: (filters?: SpotFilters) => ['spots', 'all', filters] as const,
  newSpots: (filters?: SpotFilters) => ['spots', 'new', filters] as const,
  trashSpots: (filters?: SpotFilters) => ['spots', 'trash', filters] as const,
}

// 범용 장소 조회 훅
export const useSpots = (filters?: SpotFilters) => {
  return useQuery({
    queryKey: QUERY_KEYS.spots(filters),
    queryFn: () => spotService.getSpots(filters),
    staleTime: 5 * 60 * 1000, // 5분간 fresh
    gcTime: 10 * 60 * 1000, // 10분간 캐시 유지
  })
}

// 전체 장소 조회 (필터 포함)
export const useAllSpots = (filters?: SpotFilters) => {
  const combinedFilters = {
    ...PAGE_FILTERS.ALL,
    ...filters
  }
  
  return useQuery({
    queryKey: QUERY_KEYS.allSpots(combinedFilters),
    queryFn: () => spotService.getSpots(combinedFilters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// 신규 장소 조회 (PENDING 상태)
export const useNewSpots = (filters?: SpotFilters) => {
  const combinedFilters = {
    ...PAGE_FILTERS.NEW,
    ...filters
  }
  
  return useQuery({
    queryKey: QUERY_KEYS.newSpots(combinedFilters),
    queryFn: () => spotService.getSpots(combinedFilters),
    staleTime: 2 * 60 * 1000, // 신규 장소는 더 자주 업데이트
    gcTime: 5 * 60 * 1000,
  })
}

// 휴지통 장소 조회 (DISCARDED 상태)
export const useTrashSpots = (filters?: SpotFilters) => {
  const combinedFilters = {
    ...PAGE_FILTERS.TRASH,
    ...filters
  }
  
  return useQuery({
    queryKey: QUERY_KEYS.trashSpots(combinedFilters),
    queryFn: () => spotService.getSpots(combinedFilters),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// 장소 상태 변경 뮤테이션
export const useUpdateSpotStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: SpotStatus }) => 
      spotService.updateSpotStatus(id, status),
    onSuccess: () => {
      // 모든 spots 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Spot status updated, queries invalidated')
    },
    onError: (error) => {
      console.error('❌ Failed to update spot status:', error)
    }
  })
}

// 장소 승인 뮤테이션
export const useApproveSpot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => spotService.approveSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Spot approved')
    }
  })
}

// 장소 거부 뮤테이션
export const useRejectSpot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => spotService.rejectSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Spot rejected')
    }
  })
}

// 장소 휴지통 이동 뮤테이션
export const useMoveToTrash = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => spotService.moveToTrash(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Spot moved to trash')
    }
  })
}

// 장소 복원 뮤테이션
export const useRestoreSpot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => spotService.restoreSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Spot restored')
    }
  })
}

// 장소 영구 삭제 뮤테이션
export const usePermanentDeleteSpot = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: number) => spotService.permanentDeleteSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Spot permanently deleted')
    }
  })
}

// 일괄 상태 변경 뮤테이션
export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: SpotStatus }) => 
      spotService.bulkUpdateStatus(ids, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['spots'] })
      console.log('✅ Bulk status update completed')
    }
  })
}