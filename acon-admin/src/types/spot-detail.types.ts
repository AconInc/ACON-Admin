export type SpotStatus = 'PENDING' | 'ACTIVE' | 'INACTIVE' | 'DISCARDED'
export type SpotType = 'CAFE' | 'RESTAURANT'
export type CafeFeature = 'WORK_FRIENDLY'
export type DayOfWeek = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY' | 'SUNDAY'
export type PriceFeature = 'CHEAP' | 'REASONABLE' | 'EXPENSIVE'

export interface OpeningHour {
  dayOfWeek: DayOfWeek
  closed: boolean
  startTime?: string
  endTime?: string
  breakStartTime?: string
  breakEndTime?: string
}

export interface SignatureMenu {
  name: string
  price: number
}

export interface RecommendedMenu {
  name: string
  recommendationCount: number
}

export interface PresignedUrlResponse {
  fileName: string
  presignedUrl: string
}

export interface SpotDetailResponse {
  spotStatus: SpotStatus
  spotId: number
  userNickname: string
  updatedAt: string
  spotName: string
  address: string
  localAcornCount: number
  basicAcornCount: number
  spotType: SpotType
  spotFeature?: CafeFeature
  openingHourList: OpeningHour[]
  signatureMenuList?: SignatureMenu[]
  recommendedMenuList: RecommendedMenu[]
  priceFeature?: PriceFeature
  menuboardImageList?: string[]  // fileName 배열
  spotImageList?: string[]       // fileName 배열
}

export interface SpotFormData {
  spotName: string
  address: string
  spotType: SpotType
  spotFeature?: CafeFeature
  localAcornCount: number | null
  basicAcornCount: number | null
  priceFeature?: PriceFeature
  openingHourList: OpeningHour[]
  signatureMenuList: SignatureMenu[]
  recommendedMenuList: RecommendedMenu[]
  menuboardImageList: string[]  // fileName 배열
  spotImageList: string[]       // fileName 배열
}

export interface SpotCreateRequest {
  spotName: string
  address: string
  spotType: SpotType
  spotFeature?: CafeFeature
  localAcornCount: number
  basicAcornCount: number
  priceFeature?: PriceFeature
  openingHourList: OpeningHour[]
  signatureMenuList?: SignatureMenu[]
  menuboardImageList?: string[]  // fileName 배열
  spotImageList?: string[]       // fileName 배열
}

export interface SpotUpdateRequest extends SpotCreateRequest {
  spotId: number
}

export type PageMode = 'create' | 'edit'