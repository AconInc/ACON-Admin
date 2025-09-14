'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { getDashboardInfo, DashboardInfo } from '../../../lib/dashboard';

export default function DashboardPage() {
  const router = useRouter();
  const [dashboardInfo, setDashboardInfo] = useState<DashboardInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 대시보드 정보 로드
  useEffect(() => {
    const loadDashboardInfo = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const info = await getDashboardInfo();
        setDashboardInfo(info);
        
        console.log('📊 Dashboard loaded with pending spots:', info.pendingSpotCount);
      } catch (err) {
        console.error('❌ Failed to load dashboard info:', err);
        setError('대시보드 정보를 불러오는데 실패했습니다.');
        // 에러가 발생해도 기본값으로 표시
        setDashboardInfo({ pendingSpotCount: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardInfo();
  }, []);

  const handleDirectRegistration = () => {
    router.push('/dashboard/spot-detail/create');
  };

  const handlePendingSpots = () => {
    router.push('/dashboard/store-management/new-store');
  };

  return (
    <div>
      {/* 헤더 */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          color: '#999',
          marginBottom: '8px',
          font: 'var(--font-r-14)',
        }}>
          아콘화이팅 🐿️
        </div>
        <div style={{
          font: 'var(--font-sb-24)',
          margin: 0
        }}>
          메인 대시보드
        </div>
      </div>

      {/* 중앙 컨텐츠 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '80px',
        flexWrap: 'wrap',
        padding: '0 20px',
        marginTop: '100px'
      }}>
        {/* 직접 장소 등록 */}
        <div
          onClick={handleDirectRegistration}
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-gray-100)',
            padding: '40px',
            borderRadius: '16px',
            minWidth: '400px',
            display: 'flex',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-200)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Image
            src="/images/icons/ic_upload.svg"
            alt="직접 등록 아이콘"
            width={56}
            height={56}
          />
          <div style={{
            marginLeft: '20px',
            textAlign: 'left',
            font: 'var(--font-sb-18)',
            color: 'var(--color-primary-blue)',
            display: 'flex',
            alignItems: 'center'
          }}>
            직접 장소 등록하기
          </div>
        </div>

        {/* 오른쪽: 미처리된 장소 */}
        <div
          onClick={handlePendingSpots}
          style={{
            position: 'relative',
            backgroundColor: 'var(--color-gray-100)',
            padding: '40px',
            borderRadius: '16px',
            minWidth: '400px',
            display: 'flex',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-200)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-gray-100)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Image
            src="/images/icons/ic_picture.svg"
            alt="미처리된 장소 아이콘"
            width={56}
            height={56}
          />
          <div style={{
            marginLeft: '20px',
            textAlign: 'left',
            font: 'var(--font-sb-18)',
            color: 'var(--color-black)',
            display: 'flex',
            alignItems: 'center'
          }}>
            미처리된 장소<br/>
            {isLoading ? (
              <span style={{ color: '#999' }}>로딩중...</span>
            ) : error ? (
              <span style={{ color: '#ff6b6b' }}>-건</span>
            ) : (
              `${dashboardInfo?.pendingSpotCount || 0}건`
            )}
          </div>
        </div>
      </div>

      {/* 에러 메시지 (필요시 표시) */}
      {error && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#ff6b6b',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '8px',
          font: 'var(--font-r-14)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}
    </div>
  )
}