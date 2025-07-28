'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function Sidebar() {
  const pathname = usePathname()
  
  const menuItems = [
    { id: 1, name: 'MY홈', path: '/dashboard' },
    { id: 2, name: '유저 관리', path: '/dashboard/user-management' },
    { id: 3, name: '점포 관리', path: '/dashboard/store-management' }
  ]
  
  return (
    <div 
      style={{ 
        width: '280px', 
        backgroundColor: 'var(--color-gray-300)', 
        borderRight: '2px solid var(--color-gray-500)',
        height: '100vh',
        padding: '20px 0'
      }}
    >
      {/* 로고 영역 */}
      <div style={{ padding: '0 24px', marginBottom: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Image
            src="/images/photos/img_logo.png"
            alt="Acon Logo"
            width={28}
            height={32}
          />
          <span style={{ font: 'var(--font-sb-24)' }}>Acon</span>
        </div>
      </div>
      
      {/* 메뉴 아이템들 */}
      <nav style={{ padding: '0 16px' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          return (
            <Link
              key={item.id}
              href={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px',
                textDecoration: 'none',
                backgroundColor: isActive ? '#ffe4d6' : 'transparent',
                color: isActive ? 'var(--color-secondary-orange)' : '#666',
                transition: 'all 0.2s ease'
              }}
            >

              <span style={{ font: 'var(--font-sb-16)' }}>
                {item.name}
              </span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}