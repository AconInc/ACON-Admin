import { apiRequest } from './api'

/**
 * 대시보드 정보 응답 타입
 */
export interface DashboardInfo {
  pendingSpotCount: number
}

/**
 * 대시보드 정보 조회 API
 */
export async function getDashboardInfo(): Promise<DashboardInfo> {
  console.log('📊 Fetching dashboard info...')
  
  const response = await apiRequest<DashboardInfo>('/admin/dashboard', {
    method: 'GET',
    requireAuth: true,
  })
  
  console.log('✅ Dashboard info fetched:', response)
  
  return response
}