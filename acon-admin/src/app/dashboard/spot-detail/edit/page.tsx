'use client'

import { useParams } from 'next/navigation'
import SpotForm from '@/components/ui/spot-detail/SpotForm'

export default function SpotEditPage() {
  const params = useParams()
  const spotId = params.spotId ? parseInt(params.spotId as string) : undefined

  if (!spotId) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        fontSize: '16px',
        color: 'var(--color-gray-500)'
      }}>
        잘못된 장소 ID입니다.
      </div>
    )
  }

  return <SpotForm mode="edit" spotId={spotId} />
}