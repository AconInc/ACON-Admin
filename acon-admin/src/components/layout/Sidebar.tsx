'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

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
  const router = useRouter()
  const submenuTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Record<number, boolean>>({})
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  
  const { logout } = useAuth()
  
  const menuItems: MenuItem[] = [
    { id: 1, name: 'MY홈', path: '/admin/dashboard' },
    { id: 2, name: '유저 관리', path: '/admin/dashboard/user-management' },
    { 
      id: 3, 
      name: '장소 관리', 
      path: '/admin/dashboard/store-management/all-store',
      hasSubmenu: true,
      submenu: [
        { id: 31, name: '전체 장소', path: '/admin/dashboard/store-management/all-store' },
        { id: 32, name: '신규 장소', path: '/admin/dashboard/store-management/new-store' },
        { id: 33, name: '휴지통', path: '/admin/dashboard/store-management/trash-store' }
      ]
    }
  ]
  
  // 컴포넌트 언마운트 시 타이머 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current)
        submenuTimeoutRef.current = null
      }
    }
  }, [])
  
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

  // 마우스가 들어올 때 - 기존 타이머가 있으면 취소
  const handleMouseEnter = (menuId: number) => {
    if (!isCollapsed) {
      // 기존 숨기기 타이머가 있으면 취소
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current)
        submenuTimeoutRef.current = null
      }
      
      setExpandedMenus(prev => ({
        ...prev,
        [menuId]: true
      }))
    }
  }

  // 마우스가 나갈 때 - 지연 후 메뉴 숨기기
  const handleMouseLeave = (menuId: number) => {
    if (!isCollapsed) {
      // 기존 타이머가 있으면 먼저 제거
      if (submenuTimeoutRef.current) {
        clearTimeout(submenuTimeoutRef.current)
      }
      
      // 새 타이머 설정 (300ms 후 메뉴 숨기기)
      submenuTimeoutRef.current = setTimeout(() => {
        setExpandedMenus(prev => ({
          ...prev,
          [menuId]: false
        }))
        submenuTimeoutRef.current = null
      }, 300)
    }
  }

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    if (isLoggingOut) return // 중복 실행 방지
    
    try {
      setIsLoggingOut(true)
      console.log('🚪 Sidebar: Starting logout process...')
      
      await logout()
      
      // logout 함수에서 이미 router.push('/login')을 처리하지만
      // 혹시 모르니 추가 보장 (스택 쌓임 방지를 위해 replace 사용)
      router.replace('/login')
      
    } catch (error) {
      console.error('❌ Sidebar logout error:', error)
      // 에러가 발생해도 로그인 페이지로 이동 (안전장치)
      router.replace('/login')
    } finally {
      setIsLoggingOut(false)
    }
  }
  
  return (
    <div 
      style={{ 
        width: isCollapsed ? '80px' : '280px',
        borderRight: '2px solid var(--color-gray-300)',
        height: '100vh',
        padding: '20px 0',
        transition: 'width 0.3s ease',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column'
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
          border: '1px solid var(--color-gray-500)',
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
      <nav style={{ padding: '0 16px', flex: 1 }}>
        {menuItems.map((item) => {
          const isActive = pathname === item.path
          const isSubmenuActive = item.submenu?.some(sub => pathname === sub.path)
          const isMainMenuActive = item.hasSubmenu ? pathname === item.path : isActive
          const isExpanded = expandedMenus[item.id] || isActive || isSubmenuActive
          
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
                      backgroundColor: isMainMenuActive ? '#ffe4d6' : 'transparent',
                      color: isMainMenuActive ? 'var(--color-secondary-orange)' : '#666',
                      transition: 'all 0.2s ease',
                      justifyContent: isCollapsed ? 'center' : 'space-between',
                      position: 'relative'
                    }}
                    title={isCollapsed ? item.name : ''}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                        color: isMainMenuActive ? 'var(--color-secondary-orange)' : '#666',
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
                          padding: '8px 4px',
                          borderRadius: '6px',
                          marginBottom: '8px',
                          textDecoration: 'none',
                          backgroundColor: isSubActive ? '#ffe4d6' : 'transparent',
                          color: isSubActive ? 'var(--color-secondary-orange)' : '#666',
                          transition: 'all 0.2s ease'
                        }}
                      >
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

      {/* 로그아웃 버튼 - 하단 고정 */}
      <div style={{ 
        padding: '16px', 
        borderTop: '1px solid var(--color-gray-200)',
        marginTop: 'auto'
      }}>
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'flex-start',
            gap: '12px',
            padding: '12px 16px',
            backgroundColor: isLoggingOut ? '#f8f9fa' : 'transparent',
            color: isLoggingOut ? '#999' : '#dc3545',
            border: '1px solid',
            borderColor: isLoggingOut ? '#dee2e6' : '#dc3545',
            borderRadius: '8px',
            cursor: isLoggingOut ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s ease',
            font: 'var(--font-sb-14)'
          }}
          onMouseOver={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = '#dc3545'
              e.currentTarget.style.color = 'white'
            }
          }}
          onMouseOut={(e) => {
            if (!isLoggingOut) {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = '#dc3545'
            }
          }}
          title={isCollapsed ? '로그아웃' : ''}
        >
          {/* 로그아웃 아이콘 */}
          <span style={{ fontSize: '16px' }}>🚪</span>
          
          {!isCollapsed && (
            <span style={{ whiteSpace: 'nowrap' }}>
              {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}