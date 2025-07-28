import React from 'react';
import Image from 'next/image';

export const metadata = {
  title: '대시보드',
  description: '관리자 대시보드 페이지',
};

export default function DashboardPage() {
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
        <div style={{ 
            position: 'relative',
            backgroundColor: 'var(--color-gray-100)',
            padding: '40px',
            borderRadius: '16px', 
            minWidth: '400px',
            display: 'flex',
            textAlign: 'center'
        }}>
            <Image
                src="/images/icons/ic_upload.svg"
                alt="직접 등록 아이콘"
                width={56}
                height={56}
            /><div style={{
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
        <div style={{ 
            position: 'relative',
            backgroundColor: 'var(--color-gray-100)',
            padding: '40px',
            borderRadius: '16px', 
            minWidth: '400px',
            display: 'flex',
            textAlign: 'center'
        }}>
            <Image
                src="/images/icons/ic_picture.svg"
                alt="미처리된 장소 아이콘"
                width={56}
                height={56}
            /><div style={{
                marginLeft: '20px',
                textAlign: 'left',
                font: 'var(--font-sb-18)',
                color: 'var(--color-black)',
                display: 'flex',
                alignItems: 'center'
            }}>
               미처리된 장소<br/>7건
            </div>
        </div>
      </div>
    </div>
  )
}