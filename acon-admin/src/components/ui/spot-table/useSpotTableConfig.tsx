import { useMemo, useCallback } from 'react'
import type { SpotItem } from '@/types/spot.types'
import { SpotActions } from './SpotActions'
import {
  TABLE_PRESETS,
  COLUMN_META,
  TABLE_COLUMNS,
  formatDate,
  getSpotTypeDisplay,
  getStatusDisplay,
  type TablePresetType,
  type TableColumnType
} from './config'

export interface ActionButton {
  label: string
  onClick: (id: number) => void
  backgroundColor: string
  color?: string
}

export interface UseSpotTableConfigOptions {
  preset: TablePresetType
  actions?: ActionButton[]
  getActionsForItem?: (item: SpotItem) => ActionButton[]
  useBuiltInActions?: boolean
}

export const useSpotTableConfig = ({ 
  preset, 
  actions, 
  getActionsForItem,
  useBuiltInActions = false
}: UseSpotTableConfigOptions) => {
  
  const columns = useMemo(() => {
    return TABLE_PRESETS[preset].map(columnType => COLUMN_META[columnType])
  }, [preset])

  const renderCell = useCallback((item: SpotItem, columnType: TableColumnType) => {
    switch (columnType) {
      case TABLE_COLUMNS.SPOT_ID:
        return (
          <span style={{ color: '#666', fontSize: '14px' }}>
            {item.id}
          </span>
        )

      case TABLE_COLUMNS.USER_NICKNAME:
        return (
          <span style={{ color: '#333', fontSize: '14px' }}>
            {item.userNickname}
          </span>
        )

      case TABLE_COLUMNS.SPOT_NAME:
        return (
          <span style={{ color: '#333', fontSize: '14px' }}>
            {item.spotName}
          </span>
        )

      case TABLE_COLUMNS.SPOT_STATUS: {
        const statusInfo = getStatusDisplay(item.spotStatus)
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            backgroundColor: statusInfo.bg,
            color: statusInfo.color
          }}>
            {statusInfo.text}
          </span>
        )
      }

      case TABLE_COLUMNS.SPOT_TYPE:
        return (
          <span style={{
            padding: '4px 8px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '500',
            color: "var(--color-black)"
          }}>
            {getSpotTypeDisplay(item.spotType)}
          </span>
        )

      case TABLE_COLUMNS.UPDATED_AT:
        return (
          <span style={{ color: '#666', fontSize: '14px' }}>
            {formatDate(item.updatedAt)}
          </span>
        )

      case TABLE_COLUMNS.ACTIONS: {
        if (useBuiltInActions) {
          return <SpotActions item={item} />
        }

        const itemActions = getActionsForItem ? getActionsForItem(item) : (actions || [])
        return (
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
            {itemActions.map((action, actionIndex) => (
              <button
                key={actionIndex}
                onClick={() => action.onClick(item.id)}
                style={{
                  padding: '4px 8px',
                  fontSize: '12px',
                  backgroundColor: action.backgroundColor,
                  color: action.color || 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        )
      }

      default:
        return null
    }
  }, [actions, getActionsForItem, useBuiltInActions])

  return {
    columns,
    renderCell
  }
}