import { apiRequest } from '@/lib/api'
import type { 
  SpotListResponse, 
  SpotFilters,
  SpotItem,
  SpotStatus
} from '@/types/spot.types'

class SpotService {
  private baseUrl = '/admin/spots'

  // 장소 목록 조회 (실제 API 연결)
  async getSpots(filters?: SpotFilters): Promise<SpotListResponse> {
    try {
      const params = this.buildQueryParams(filters)
      const url = `${this.baseUrl}${params ? `?${params}` : ''}`
      
      console.log('🔍 Fetching spots with filters:', filters)
      
      const response = await apiRequest<SpotListResponse>(url, {
        method: 'GET',
        requireAuth: true, // CSRF 토큰 필요
      })
      
      console.log('✅ Spots fetched successfully:', response.spotList.length, 'items')
      return response
      
    } catch (error) {
      console.error('❌ 장소 데이터 조회 실패:', error)
      throw error
    }
  }

  // 장소 상태 변경 - POST /admin/spots/{spotId}/status
  async updateSpotStatus(id: number, status: SpotStatus): Promise<void> {
    try {
      console.log(`🔄 Updating spot ${id} status to ${status}`)
      
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'POST', // PATCH가 아닌 POST 사용
        requireAuth: true,
        body: JSON.stringify({ targetStatus: status }), // Request Body 형식 변경
      })
      
      console.log(`✅ Spot ${id} status updated to ${status}`)
      
    } catch (error) {
      console.error('❌ 장소 상태 변경 실패:', error)
      throw error
    }
  }

  // 장소 복원 (DISCARDED → ACTIVE)
  async restoreSpot(id: number): Promise<void> {
    return this.updateSpotStatus(id, 'ACTIVE')
  }

  // 장소 휴지통으로 이동 (→ DISCARDED)
  async moveToTrash(id: number): Promise<void> {
    return this.updateSpotStatus(id, 'DISCARDED')
  }

  // 장소 승인 (PENDING → ACTIVE)
  async approveSpot(id: number): Promise<void> {
    return this.updateSpotStatus(id, 'ACTIVE')
  }

  // 장소 거부 (PENDING → INACTIVE)
  async rejectSpot(id: number): Promise<void> {
    return this.updateSpotStatus(id, 'INACTIVE')
  }

  // 장소 영구 삭제
  async permanentDeleteSpot(id: number): Promise<void> {
    try {
      console.log(`🗑️ Permanently deleting spot ${id}`)
      
      await apiRequest<void>(`${this.baseUrl}/${id}`, {
        method: 'DELETE',
        requireAuth: true,
      })
      
      console.log(`✅ Spot ${id} permanently deleted`)
      
    } catch (error) {
      console.error('❌ 장소 영구 삭제 실패:', error)
      throw error
    }
  }

  // 일괄 상태 변경
  async bulkUpdateStatus(ids: number[], status: SpotStatus): Promise<void> {
    try {
      console.log(`🔄 Bulk updating ${ids.length} spots to ${status}`)
      
      await apiRequest<void>(`${this.baseUrl}/bulk-status`, {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify({ ids, status }),
      })
      
      console.log(`✅ ${ids.length} spots bulk updated to ${status}`)
      
    } catch (error) {
      console.error('❌ 장소 일괄 상태 변경 실패:', error)
      throw error
    }
  }

  // ========== 유틸리티 메소드 ==========
  
  private buildQueryParams(filters?: SpotFilters): string {
    if (!filters) return ''
    
    const params = new URLSearchParams()
    
    if (filters.query) params.append('query', filters.query)
    if (filters.queryTarget) params.append('queryTarget', filters.queryTarget)
    if (filters.status) {
      filters.status.forEach(status => params.append('status', status))
    }
    if (filters.missingField) params.append('missingField', filters.missingField)
    
    return params.toString()
  }
}

// 싱글톤 인스턴스 export
export const spotService = new SpotService()