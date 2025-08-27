import type { SpotItem } from '@/types/spot.types'

export const TABLE_COLUMNS = {
  SPOT_ID: 'SPOT_ID',
  USER_NICKNAME: 'USER_NICKNAME', 
  SPOT_NAME: 'SPOT_NAME',
  SPOT_STATUS: 'SPOT_STATUS',
  SPOT_TYPE: 'SPOT_TYPE',
  UPDATED_AT: 'UPDATED_AT',
  ACTIONS: 'ACTIONS'
} as const

export type TableColumnType = typeof TABLE_COLUMNS[keyof typeof TABLE_COLUMNS]

export interface ColumnMeta {
  key: TableColumnType
  label: string
  width?: string
  align?: 'left' | 'center' | 'right'
}

export const COLUMN_META: Record<TableColumnType, ColumnMeta> = {
  [TABLE_COLUMNS.SPOT_ID]: {
    key: 'SPOT_ID',
    label: 'ID', 
    width: '80px',
    align: 'center'
  },
  [TABLE_COLUMNS.USER_NICKNAME]: {
    key: 'USER_NICKNAME',
    label: '닉네임',
    width: '100px',
    align: 'left'
  },
  [TABLE_COLUMNS.SPOT_NAME]: {
    key: 'SPOT_NAME',
    label: '장소명',
    align: 'left'
  },
  [TABLE_COLUMNS.SPOT_STATUS]: {
    key: 'SPOT_STATUS',
    label: '상태',
    width: '100px',
    align: 'left'
  },
  [TABLE_COLUMNS.SPOT_TYPE]: {
    key: 'SPOT_TYPE',
    label: '장소 유형',
    width: '100px', 
    align: 'center'
  },
  [TABLE_COLUMNS.UPDATED_AT]: {
    key: 'UPDATED_AT',
    label: '수정 날짜',
    width: '220px',
    align: 'left'
  },
  [TABLE_COLUMNS.ACTIONS]: {
    key: 'ACTIONS',
    label: '액션',
    width: '180px',
    align: 'center'
  }
} as const

export const TABLE_PRESETS = {
  ALL_SPOTS: [
    TABLE_COLUMNS.SPOT_ID,
    TABLE_COLUMNS.USER_NICKNAME,
    TABLE_COLUMNS.SPOT_NAME,
    TABLE_COLUMNS.SPOT_STATUS,
    TABLE_COLUMNS.SPOT_TYPE,
    TABLE_COLUMNS.ACTIONS
  ],
  NEW_SPOTS: [
    TABLE_COLUMNS.SPOT_ID,
    TABLE_COLUMNS.USER_NICKNAME,
    TABLE_COLUMNS.SPOT_NAME,
    TABLE_COLUMNS.SPOT_TYPE,
    TABLE_COLUMNS.ACTIONS
  ],
  TRASH_SPOTS: [
    TABLE_COLUMNS.SPOT_ID,
    TABLE_COLUMNS.USER_NICKNAME,
    TABLE_COLUMNS.SPOT_NAME,
    TABLE_COLUMNS.SPOT_TYPE,
    TABLE_COLUMNS.UPDATED_AT,
    TABLE_COLUMNS.ACTIONS
  ]
} as const

export type TablePresetType = keyof typeof TABLE_PRESETS

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit', 
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const SPOT_TYPE_DISPLAY_MAP: Record<string, string> = {
  CAFE: '카페',
  RESTAURANT: '식당'
}

export const getSpotTypeDisplay = (type: string) => {
  return SPOT_TYPE_DISPLAY_MAP[type] ?? type
}

export const getStatusDisplay = (status: string) => {
  switch (status) {
    case 'ACTIVE': return { text: '활성화', color: 'var(--color-secondary-green)', bg: 'var(--color-secondary-lightGreen)' }
    case 'INACTIVE': return { text: '비활성화', color: 'var(--color-secondary-yellow)', bg: 'var(--color-secondary-lightYellow)' }
    case 'PENDING': return { text: '대기', color: 'var(--color-gray-800)', bg: 'var(--color-gray-300)' }
    case 'DISCARDED': return { text: '휴지통', color: 'var(--color-gray-600)', bg: 'var(--color-gray-200)' }
    default: return { text: status, color: 'var(--color-gray-600)', bg: 'var(--color-gray-200)' }
  }
}