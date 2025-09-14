'use client'

import { useRouter } from 'next/navigation'
import type { SpotItem } from '@/types/spot.types'
import type { TablePresetType } from './config'
import { useSpotTableConfig, type ActionButton } from './useSpotTableConfig'

export interface SpotTableProps {
  items: SpotItem[]
  preset: TablePresetType
  actions?: ActionButton[]
  getActionsForItem?: (item: SpotItem) => ActionButton[]
  useBuiltInActions?: boolean
}

export const SpotTable = ({ 
  items, 
  preset, 
  actions, 
  getActionsForItem,
  useBuiltInActions = false
}: SpotTableProps) => {
  const router = useRouter()
  const { columns, renderCell } = useSpotTableConfig({
    preset,
    actions,
    getActionsForItem,
    useBuiltInActions
  })

  const handleRowClick = (item: SpotItem, columnKey: string) => {
  if (columnKey !== 'actions') {
    router.push(`/admin/dashboard/spot-detail/edit?spotId=${item.id}`)
  }
}
  
  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse'
      }}>
        <thead>
          <tr style={{
            backgroundColor: 'var(--color-gray-100)',
            borderBottom: '3px solid var(--color-gray-300)'
          }}>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{
                  padding: '16px',
                  textAlign: column.align || 'left',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: 'var(--color-gray-500)',
                  width: column.width
                }}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr 
              key={item.id}
              style={{
                borderBottom: '1px solid var(--color-gray-200)',
                height: '60px'
              }}
            >
              {columns.map((column) => (
                <td
                  key={column.key}
                  style={{
                    padding: '16px',
                    textAlign: column.align || 'left',
                    cursor: String(column.key) !== 'actions' ? 'pointer' : 'default'
                  }}
                  onClick={() => handleRowClick(item, column.key)}
                >
                  {renderCell(item, column.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}