import { apiRequest } from '@/lib/api'
import type { 
  SpotDetailResponse, 
  SpotCreateRequest, 
  SpotUpdateRequest
} from '@/types/spot-detail.types'

// PresignedURL API 응답 타입
interface PresignedUrlResponse {
  fileUrl: string      // 실제 파일 URL
  preSignedUrl: string // S3 업로드용 Presigned URL
}

class SpotDetailService {
  private baseUrl = '/admin/spots'

  async postPresignedUrl(imageType: 'SPOT' | 'MENUBOARD', originalFileName: string): Promise<PresignedUrlResponse> {
    try {
      console.log('🔄 Getting presigned URL for:', imageType, originalFileName)

      const response = await apiRequest<PresignedUrlResponse>(`/admin/images/presigned-url`, {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify({ imageType, originalFileName }),
      })
      
      console.log('✅ Presigned URL obtained successfully')
      console.log('📋 File URL:', response.fileUrl)
      return response
      
    } catch (error) {
      console.error('❌ Presigned URL 획득 실패:', error)
      throw error
    }
  }

  // S3에 직접 이미지 업로드
  async uploadImageToS3(file: File, presignedUrl: string): Promise<void> {
    try {
      console.log('🔄 Uploading image to S3:', file.name)
      
      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error(`S3 upload failed: ${uploadResponse.status}`)
      }

      console.log('✅ Image uploaded to S3 successfully')
      
    } catch (error) {
      console.error('❌ S3 이미지 업로드 실패:', error)
      throw error
    }
  }

  // 장소 상세 정보 조회 - GET /admin/spots/{spotId}
  async getSpotDetail(spotId: number): Promise<SpotDetailResponse> {
    try {
      console.log('🔄 Fetching spot detail for ID:', spotId)
      
      const response = await apiRequest<SpotDetailResponse>(`${this.baseUrl}/${spotId}`, {
        method: 'GET',
        requireAuth: true,
      })
      
      console.log('✅ Spot detail fetched successfully:', response.spotName)
      return response
      
    } catch (error) {
      console.error('❌ 장소 상세 정보 조회 실패:', error)
      throw error
    }
  }

  // 장소 생성 - POST
  async createSpot(data: SpotCreateRequest): Promise<{ spotId: number }> {
    try {
      console.log('🔄 Creating new spot:', data.spotName)
      
      const response = await apiRequest<{ spotId: number }>(this.baseUrl, {
        method: 'POST',
        requireAuth: true,
        body: JSON.stringify(data),
      })
      
      console.log('✅ Spot created successfully with ID:', response.spotId)
      return response
      
    } catch (error) {
      console.error('❌ 장소 생성 실패:', error)
      throw error
    }
  }

  // 장소 수정 - PATCH
  async updateSpot(spotId: number, data: SpotUpdateRequest): Promise<void> {
    try {
      console.log('🔄 Updating spot ID:', spotId, 'with data:', data)
      
      await apiRequest<void>(`${this.baseUrl}/${spotId}`, {
        method: 'PATCH',
        requireAuth: true,
        body: JSON.stringify(data),
      })
      
      console.log('✅ Spot updated successfully')
      
    } catch (error) {
      console.error('❌ 장소 수정 실패:', error)
      throw error
    }
  }
}

export const spotDetailService = new SpotDetailService()