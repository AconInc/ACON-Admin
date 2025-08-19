// API 응답 타입
export interface SpotItem {
  id: number
  userNickname: string
  spotName: string
  spotStatus: SpotStatus
  spotType: SpotType
  updatedAt: string
}

export interface SpotListResponse {
  spotList: SpotItem[]
}

// API 요청 파라미터 타입
export interface SpotFilters {
  query?: string                    // 검색어
  queryTarget?: QueryTarget         // 검색 대상 필드
  status?: SpotStatus[]
  missingField?: MissingField
}

// Enum 타입
export type QueryTarget = 'SPOT_ID' | 'USER_NICKNAME' | 'SPOT_NAME'

export type SpotStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'DISCARDED'

export type SpotType = 'CAFE' | 'RESTAURANT'

export type MissingField = 'ALL' | 'SPOT_IMAGE' | 'OPENING_HOURS'

// 에러 타입
export interface SpotError {
  message: string
  code?: string
}

// 페이지별 기본 필터
export const PAGE_FILTERS = {
  ALL: {}, // 전체 장소
  NEW: { status: ['PENDING'] as SpotStatus[] }, // 신규 장소
  TRASH: { status: ['DISCARDED'] as SpotStatus[] }, // 휴지통
  ACTIVE: { status: ['ACTIVE', 'INACTIVE'] as SpotStatus[] } // 활성 장소들
} as const