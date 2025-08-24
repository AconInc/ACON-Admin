import type { 
  SpotListResponse, 
  SpotFilters,
  SpotItem,
  SpotStatus
} from '@/types/spot.types'

class SpotService {
  private baseUrl = '/api/admin/spots'

  // 장소 목록 조회 (범용)
  async getSpots(filters?: SpotFilters): Promise<SpotListResponse> {
    try {
      const params = this.buildQueryParams(filters)
      const url = `${this.baseUrl}${params ? `?${params}` : ''}`
      
      // TODO: 실제 API 호출로 교체
      // const response = await fetch(url, {
      //   headers: {
      //     // 'Authorization': `Bearer ${token}`, // 필요시 추가
      //     'Content-Type': 'application/json',
      //   },
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }
      // return await response.json()

      // 임시 더미 데이터 (서버 연결 시 위 코드로 교체)
      await this.simulateApiDelay()
      return this.getDummyData(filters)
      
    } catch (error) {
      console.error('장소 데이터 조회 실패:', error)
      throw error
    }
  }

  // 장소 상태 변경 (승인/거부/휴지통 등)
  async updateSpotStatus(id: number, status: SpotStatus): Promise<void> {
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await fetch(`${this.baseUrl}/${id}/status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ status }),
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }

      await this.simulateApiDelay()
      console.log(`장소 ${id}의 상태가 ${status}로 변경됨`)
      
    } catch (error) {
      console.error('장소 상태 변경 실패:', error)
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
      // TODO: 실제 API 호출로 교체
      // const response = await fetch(`${this.baseUrl}/${id}`, {
      //   method: 'DELETE',
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }

      await this.simulateApiDelay()
      console.log(`장소 ${id} 영구 삭제됨`)
      
    } catch (error) {
      console.error('장소 영구 삭제 실패:', error)
      throw error
    }
  }

  // 일괄 상태 변경
  async bulkUpdateStatus(ids: number[], status: SpotStatus): Promise<void> {
    try {
      // TODO: 실제 API 호출로 교체
      // const response = await fetch(`${this.baseUrl}/bulk-status`, {
      //   method: 'PATCH',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ ids, status }),
      // })
      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`)
      // }

      await this.simulateApiDelay()
      console.log(`장소 ${ids.length}개의 상태가 ${status}로 일괄 변경됨`)
      
    } catch (error) {
      console.error('장소 일괄 상태 변경 실패:', error)
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

  // ========== 더미 데이터 (서버 연결 시 제거) ==========
  
  private async simulateApiDelay(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 800))
  }

  private getDummyData(filters?: SpotFilters): SpotListResponse {
    const allSpots: SpotItem[] = [
      { id: 1, userNickname: '김성민', spotName: '커피 리브레 서교동', spotStatus: 'PENDING', spotType: 'CAFE', updatedAt: '2025-08-06T10:00:00' },
      { id: 2, userNickname: '김시은', spotName: '프릳츠 커피 컴퍼니 도화점', spotStatus: 'PENDING', spotType: 'CAFE', updatedAt: '2025-08-06T10:15:00' },
      { id: 3, userNickname: '김유림', spotName: '빈브라더스 성수동', spotStatus: 'ACTIVE', spotType: 'CAFE', updatedAt: '2025-08-06T10:30:00' },
      { id: 4, userNickname: '김창균', spotName: '스시효 청담', spotStatus: 'ACTIVE', spotType: 'RESTAURANT', updatedAt: '2025-08-06T10:45:00' },
      { id: 5, userNickname: '박지현', spotName: '홍연참치 논현', spotStatus: 'INACTIVE', spotType: 'RESTAURANT', updatedAt: '2025-08-06T11:00:00' },
      { id: 6, userNickname: '이상일', spotName: '리틀넥 성수 브런치', spotStatus: 'DISCARDED', spotType: 'RESTAURANT', updatedAt: '2025-08-06T11:15:00' },
      { id: 7, userNickname: '이수민', spotName: '로리스 더 프라임 립 강남', spotStatus: 'DISCARDED', spotType: 'RESTAURANT', updatedAt: '2025-08-06T11:30:00' },
      { id: 8, userNickname: '한울빌', spotName: '한울빌국수', spotStatus: 'DISCARDED', spotType: 'RESTAURANT', updatedAt: '2023-07-23T00:00:00' },
      { id: 9, userNickname: '@UserName', spotName: '테스트카페', spotStatus: 'DISCARDED', spotType: 'CAFE', updatedAt: '2023-07-24T00:00:00' },
      { id: 10, userNickname: '@UserName', spotName: '새로운레스토랑', spotStatus: 'DISCARDED', spotType: 'RESTAURANT', updatedAt: '2023-07-25T00:00:00' }
    ]

    // 필터 적용
    let filteredSpots = allSpots
    
    // 상태 필터
    if (filters?.status && filters.status.length > 0) {
      filteredSpots = filteredSpots.filter(spot => filters.status!.includes(spot.spotStatus))
    }
    
    // 검색 필터
    if (filters?.query && filters?.queryTarget) {
      const searchTerm = filters.query.toLowerCase()
      filteredSpots = filteredSpots.filter(spot => {
        switch (filters.queryTarget) {
          case 'SPOT_ID':
            return spot.id.toString().includes(searchTerm)
          case 'USER_NICKNAME':
            return spot.userNickname.toLowerCase().includes(searchTerm)
          case 'SPOT_NAME':
            return spot.spotName.toLowerCase().includes(searchTerm)
          default:
            return false
        }
      })
    }

    return {
      spotList: filteredSpots
    }
  }
}

// 싱글톤 인스턴스 export
export const spotService = new SpotService()