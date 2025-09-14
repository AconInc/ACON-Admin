'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import SpotForm from '@/components/ui/spot-detail/SpotForm'

function SpotEditPageContent() {
  const searchParams = useSearchParams()
  const spotId = searchParams.get('spotId') ? parseInt(searchParams.get('spotId') as string) : undefined
  
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

export default function SpotEditPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SpotEditPageContent />
    </Suspense>
  )
}