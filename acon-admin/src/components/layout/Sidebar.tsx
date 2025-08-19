'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'

// 타입 정의 추가
interface SubMenuItem {
  id: number
  name: string
  path: string
}

interface MenuItem {
  id: number
  name: string
  path: string
  hasSubmenu?: boolean
  submenu?: SubMenuItem[]
}

export default function Sidebar() {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({})
  
  const menuItems: MenuItem[] = [
    { id: 1, name: 'MY홈', path: '/dashboard' },
    { id: 2, name: '유저 관리', path: '/dashboard/user-management' },
    { 
      id: 3, 
      name: '장소 관리', 
      path: '/dashboard/store-management',
      hasSubmenu: true,
      submenu: [
        { id: 31, name: '전체 장소', path: '/dashboard/store-management/all-store' },
        { id: 32, name: '신규 장소', path: '/dashboard/store-management/new-store' },
        { id: 33, name: '휴지통', path: '/dashboard/store-management/trash-store' }
      ]
    }
  ]
  
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }
  
  const toggleSubmenu = (menuId: number, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }))
  }

  // 호버로 서브메뉴 표시
  const handleMouseEnter = (menuId: number) => {
    if (!isCollapsed) {
      setExpandedMenus(prev => ({
        ...prev,
        [menuId]: true
      }))
    }
  }

  const handleMouseLeave = (menuId: number) => {
    if (!isCollapsed) {
      setTimeout(() => {
        setExpandedMenus(prev => ({
          ...prev,
          [menuId]: false
        }))
      }, 200)
    }
  }
  
  return (
    <div 
      style={{ 
        width: isCollapsed ? '80px' : '280px',
        backgroundColor: 'var(--color-gray-300)', 
        borderRight: '2px solid var(--color-gray-500)',
        height: '100vh',
        padding: '20px 0',
        transition: 'width 0.3s ease',
        position: 'relative'
      }}
    >
      {/* 토글 버튼 */}
      <button
        onClick={toggleSidebar}
        style={{
          position: 'absolute',
          top: '20px',
          right: '-12px',
          width: '24px',
          height: '24px',
          backgroundColor: 'white',
          border: '2px solid var(--color-gray-500)',
          borderRadius: '50%',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          zIndex: 10
        }}
      >
        {isCollapsed ? '<' : '>'}
      </button>

      {/* 로고 영역 */}
      <div style={{ 
        padding: '0 24px', 
        marginBottom: '32px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          justifyContent: isCollapsed ? 'center' : 'flex-start'
        }}>
          <Image
            src="/images/photos/img_logo.png"
            alt="Acon Logo"
            width={28}
            height={32}
          />
          {!isCollapsed && (
            <span style={{ 
              font: 'var(--font-sb-24)',
              whiteSpace: 'nowrap'
            }}>
              Acon
            </span>
          )}
        </div>
      </div>
      
      {/* 메뉴 아이템들 */}
      <nav style={{ padding: '0 16px' }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const isSubmenuActive = item.submenu?.some(sub => pathname === sub.path)
          const isExpanded = expandedMenus[item.id] || false
          
          return (
            <div 
              key={item.id}
              onMouseEnter={item.hasSubmenu ? () => handleMouseEnter(item.id) : undefined}
              onMouseLeave={item.hasSubmenu ? () => handleMouseLeave(item.id) : undefined}
            >
              {/* 메인 메뉴 아이템 */}
              {item.hasSubmenu ? (
                <div style={{ position: 'relative' }}>
                  <Link
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '8px',
                      textDecoration: 'none',
                      backgroundColor: (isActive || isSubmenuActive) ? '#ffe4d6' : 'transparent',
                      color: (isActive || isSubmenuActive) ? 'var(--color-secondary-orange)' : '#666',
                      transition: 'all 0.2s ease',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      position: 'relative'
                    }}
                    title={isCollapsed ? item.name : ''}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* 아이콘 영역 */}
                      <div style={{ 
                        width: '20px', 
                        height: '20px',
                        backgroundColor: (isActive || isSubmenuActive) ? 'var(--color-secondary-orange)' : '#999',
                        borderRadius: '4px',
                        flexShrink: 0
                      }} />
                      
                      {!isCollapsed && (
                        <span style={{ 
                          font: 'var(--font-sb-16)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden'
                        }}>
                          {item.name}
                        </span>
                      )}
                    </div>
                  </Link>
                  
                  {/* 토글 버튼 (별도 영역) */}
                  {!isCollapsed && (
                    <button
                      onClick={(e) => toggleSubmenu(item.id, e)}
                      style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '12px',
                        color: (isActive || isSubmenuActive) ? 'var(--color-secondary-orange)' : '#666',
                        padding: '4px',
                        transition: 'transform 0.2s ease'
                      }}
                    >
                      <span style={{ 
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                        display: 'block'
                      }}>
                        ▼
                      </span>
                    </button>
                  )}
                </div>
              ) : (
                <Link
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
                    transition: 'all 0.2s ease',
                    justifyContent: isCollapsed ? 'center' : 'flex-start',
                    position: 'relative'
                  }}
                  title={isCollapsed ? item.name : ''}
                >
                  {/* 아이콘 영역 */}
                  <div style={{ 
                    width: '20px', 
                    height: '20px',
                    backgroundColor: isActive ? 'var(--color-secondary-orange)' : '#999',
                    borderRadius: '4px',
                    flexShrink: 0
                  }} />
                  
                  {!isCollapsed && (
                    <span style={{ 
                      font: 'var(--font-sb-16)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden'
                    }}>
                      {item.name}
                    </span>
                  )}
                </Link>
              )}
              
              {/* 서브메뉴 */}
              {item.hasSubmenu && !isCollapsed && isExpanded && item.submenu && (
                <div style={{ 
                  paddingLeft: '20px',
                  marginBottom: '8px'
                }}>
                  {item.submenu.map((subItem) => {
                    const isSubActive = pathname === subItem.path
                    return (
                      <Link
                        key={subItem.id}
                        href={subItem.path}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '8px 16px',
                          borderRadius: '6px',
                          marginBottom: '4px',
                          textDecoration: 'none',
                          backgroundColor: isSubActive ? '#ffe4d6' : 'transparent',
                          color: isSubActive ? 'var(--color-secondary-orange)' : '#666',
                          transition: 'all 0.2s ease',
                          fontSize: '14px'
                        }}
                      >
                        <div style={{ 
                          width: '16px', 
                          height: '16px',
                          backgroundColor: isSubActive ? 'var(--color-secondary-orange)' : '#ccc',
                          borderRadius: '3px',
                          flexShrink: 0
                        }} />
                        <span style={{ 
                          font: 'var(--font-sb-14)',
                          whiteSpace: 'nowrap'
                        }}>
                          {subItem.name}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}