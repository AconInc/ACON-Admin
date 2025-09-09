import type { 
  SpotDetailResponse, 
  SpotCreateRequest, 
  SpotUpdateRequest,
  PresignedUrlResponse
} from '@/types/spot-detail.types'

class SpotDetailService {
  private baseUrl = '/api/admin/spots'

  // Presigned URL 획득
  async getPresignedUrl(imageType: 'SPOT' | 'MENUBOARD'): Promise<PresignedUrlResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/presigned-url?imageType=${imageType}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('Presigned URL 획득 실패:', error)
      throw error
    }
  }

  // 장소 상세 정보 조회
  async getSpotDetail(spotId: number): Promise<SpotDetailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/${spotId}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('장소 상세 정보 조회 실패:', error)
      throw error
    }
  }

  // 장소 등록
  async createSpot(data: SpotCreateRequest): Promise<{ spotId: number }> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return await response.json()
    } catch (error) {
      console.error('장소 등록 실패:', error)
      throw error
    }
  }

  // 장소 수정
  async updateSpot(data: SpotUpdateRequest): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${data.spotId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('장소 수정 실패:', error)
      throw error
    }
  }

  // 장소 삭제
  async deleteSpot(spotId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${spotId}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    } catch (error) {
      console.error('장소 삭제 실패:', error)
      throw error
    }
  }
}

export const spotDetailService = new SpotDetailService()