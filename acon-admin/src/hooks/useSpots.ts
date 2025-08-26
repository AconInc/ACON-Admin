import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { spotService } from '@/services/spot.service'
import type { SpotFilters, SpotStatus } from '@/types/spot.types'

// Query Keys
export const spotKeys = {
  all: ['spots'] as const,
  lists: () => [...spotKeys.all, 'list'] as const,
  list: (filters?: SpotFilters) => [...spotKeys.lists(), filters] as const,
  details: () => [...spotKeys.all, 'detail'] as const,
  detail: (id: number) => [...spotKeys.details(), id] as const,
}

// 장소 목록 조회 훅
export const useSpots = (filters?: SpotFilters) => {
  return useQuery({
    queryKey: spotKeys.list(filters),
    queryFn: () => spotService.getSpots(filters),
    staleTime: 1000 * 60 * 5, // 5분간 fresh
    gcTime: 1000 * 60 * 30,   // 30분간 캐시 유지
    refetchOnWindowFocus: false,
    retry: 2
  })
}

// 장소 상태 변경 훅
export const useUpdateSpotStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: SpotStatus }) => 
      spotService.updateSpotStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
    },
    onError: (error) => {
      console.error('상태 변경 실패:', error)
    }
  })
}

// 장소 복원 훅 (휴지통 → 활성)
export const useRestoreSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => spotService.restoreSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
      console.log('장소가 복원되었습니다.')
    },
    onError: (error) => {
      console.error('복원 실패:', error)
    }
  })
}

// 장소 휴지통 이동 훅
export const useMoveToTrash = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => spotService.moveToTrash(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
      console.log('장소가 휴지통으로 이동되었습니다.')
    },
    onError: (error) => {
      console.error('휴지통 이동 실패:', error)
    }
  })
}

// 장소 승인 훅 (신규 → 활성)
export const useApproveSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => spotService.approveSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
      console.log('장소가 승인되었습니다.')
    },
    onError: (error) => {
      console.error('승인 실패:', error)
    }
  })
}

// 장소 거부 훅 (신규 → 비활성)
export const useRejectSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => spotService.rejectSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
      console.log('장소가 거부되었습니다.')
    },
    onError: (error) => {
      console.error('거부 실패:', error)
    }
  })
}

// 장소 영구 삭제 훅
export const usePermanentDeleteSpot = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => spotService.permanentDeleteSpot(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
      console.log('장소가 영구 삭제되었습니다.')
    },
    onError: (error) => {
      console.error('영구 삭제 실패:', error)
    }
  })
}

// 일괄 상태 변경 훅
export const useBulkUpdateStatus = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ ids, status }: { ids: number[]; status: SpotStatus }) => 
      spotService.bulkUpdateStatus(ids, status),
    onSuccess: (_, { ids, status }) => {
      queryClient.invalidateQueries({ queryKey: spotKeys.all })
      console.log(`${ids.length}개의 장소가 ${status} 상태로 변경되었습니다.`)
    },
    onError: (error) => {
      console.error('일괄 상태 변경 실패:', error)
    }
  })
}

// 편의 훅
export const useTrashSpots = () => useSpots({ status: ['DISCARDED'] })
export const useNewSpots = () => useSpots({ status: ['PENDING'] })
export const useActiveSpots = () => useSpots({ status: ['ACTIVE', 'INACTIVE'] })