'use client'

import { useState, useEffect } from 'react'
import type { 
  SpotDetailResponse, 
  SpotFormData, 
  PageMode, 
  SpotType, 
  CafeFeature, 
  RestaurantFeature,
  PriceFeature,
  DayOfWeek,
  OpeningHour,
  SignatureMenu 
} from '@/types/spot-detail.types'
import { spotDetailService } from '@/services/spot-detail.service'
import { Breadcrumb, PageHeader } from '@/components/layout'
import { TagButton } from '@/components/ui/TagButton'
import { LoadingSpinner } from '@/components/ui'

interface SpotFormProps {
  mode: PageMode
  spotId?: number
}

interface LocalImage {
  file: File
  url: string
}

export default function SpotForm({ mode, spotId }: SpotFormProps) {
  const [loading, setLoading] = useState(false)
  const [spotData, setSpotData] = useState<SpotDetailResponse | null>(null)
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>('MONDAY')
  const [menuImages, setMenuImages] = useState<LocalImage[]>([])
  const [spotImages, setSpotImages] = useState<LocalImage[]>([])
  const [existingMenuImages, setExistingMenuImages] = useState<string[]>([])
  const [existingSpotImages, setExistingSpotImages] = useState<string[]>([])
  const [previewModal, setPreviewModal] = useState<{
    isOpen: boolean
    images: string[]
    currentIndex: number
    type: 'menu' | 'spot'
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
    type: 'menu'
  })
  
  const [formData, setFormData] = useState<SpotFormData>({
    spotName: '',
    address: '',
    spotType: 'CAFE',
    localAcornCount: null,
    basicAcornCount: null,
    openingHourList: [
      { dayOfWeek: 'MONDAY', closed: false },
      { dayOfWeek: 'TUESDAY', closed: false },
      { dayOfWeek: 'WEDNESDAY', closed: false },
      { dayOfWeek: 'THURSDAY', closed: false },
      { dayOfWeek: 'FRIDAY', closed: false },
      { dayOfWeek: 'SATURDAY', closed: false },
      { dayOfWeek: 'SUNDAY', closed: false }
    ],
    signatureMenuList: [],
    recommendedMenuList: [],
    menuboardImageList: [],
    spotImageList: []
  })

  const dayLabels: Record<DayOfWeek, string> = {
    MONDAY: '월', TUESDAY: '화', WEDNESDAY: '수', THURSDAY: '목',
    FRIDAY: '금', SATURDAY: '토', SUNDAY: '일'
  }

  const cafeFeatureLabels: Record<CafeFeature, string> = {
    WORK_FRIENDLY: '업무하기 좋아요',
  }

  const restaurantFeatureLabels = {
    KOREAN: '한식',
    CHINESE: '중식',
    JAPANESE: '일식',
    WESTERN: '양식',
    SOUTHEAST_ASIAN: '아시안',
    FUSION: '퓨전',
    BUNSIK: '분식',
    BUFFET: '뷔페',
    DRINKING_PLACE: '술/Bar',
    OTHERS: '기타'
  }

  const priceFeatureLabels: Record<PriceFeature, string> = {
    CHEAP: '가성비 좋아요',
    REASONABLE: '보통이에요',
    EXPENSIVE: '가성비 별로에요'
  }

  useEffect(() => {
    if (mode === 'edit' && spotId) {
      loadSpotData()
    }
  }, [mode, spotId])

  const loadSpotData = async () => {
    if (!spotId) return
    
    setLoading(true)
    try {
      const data = await spotDetailService.getSpotDetail(spotId)
      setSpotData(data)
      
      setFormData({
        spotName: data.spotName,
        address: data.address,
        spotType: data.spotType,
        spotFeature: data.spotFeature,
        localAcornCount: data.localAcornCount,
        basicAcornCount: data.basicAcornCount,
        priceFeature: data.priceFeature,
        openingHourList: data.openingHourList,
        signatureMenuList: data.signatureMenuList || [],
        recommendedMenuList: data.recommendedMenuList,
        menuboardImageList: data.menuboardImageList || [],
        spotImageList: data.spotImageList || []
      })
      
      // 기존 이미지 fileName들 저장
      setExistingMenuImages(data.menuboardImageList || [])
      setExistingSpotImages(data.spotImageList || [])
    } catch (error) {
      console.error('데이터 로드 실패:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, type: 'menu' | 'spot') => {
    const files = event.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        const localImage: LocalImage = { file, url }
        
        if (type === 'menu') {
          setMenuImages(prev => [...prev, localImage])
        } else {
          setSpotImages(prev => [...prev, localImage])
        }
      }
      reader.readAsDataURL(file)
    })
    
    // input 초기화
    event.target.value = ''
  }

  const removeNewImage = (index: number, type: 'menu' | 'spot') => {
    if (type === 'menu') {
      setMenuImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setSpotImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const removeExistingImage = (index: number, type: 'menu' | 'spot') => {
    if (type === 'menu') {
      setExistingMenuImages(prev => prev.filter((_, i) => i !== index))
    } else {
      setExistingSpotImages(prev => prev.filter((_, i) => i !== index))
    }
  }

  const openPreview = (images: string[], index: number, type: 'menu' | 'spot') => {
    setPreviewModal({
      isOpen: true,
      images,
      currentIndex: index,
      type
    })
  }

  const closePreview = () => {
    setPreviewModal({
      isOpen: false,
      images: [],
      currentIndex: 0,
      type: 'menu'
    })
  }

  const nextImage = () => {
    setPreviewModal(prev => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.images.length
    }))
  }

  const prevImage = () => {
    setPreviewModal(prev => ({
      ...prev,
      currentIndex: prev.currentIndex === 0 ? prev.images.length - 1 : prev.currentIndex - 1
    }))
  }

  const uploadImagesToS3 = async (images: LocalImage[], imageType: 'SPOT' | 'MENUBOARD'): Promise<string[]> => {
    const uploadedFileNames: string[] = []
    
    for (const image of images) {
      try {
        // 1. Presigned URL 획득
        const presignedData = await spotDetailService.getPresignedUrl(imageType)
        
        // 2. S3에 직접 업로드
        const uploadResponse = await fetch(presignedData.presignedUrl, {
          method: 'PUT',
          body: image.file,
          headers: {
            'Content-Type': image.file.type,
          },
        })

        if (!uploadResponse.ok) {
          throw new Error('이미지 업로드 실패')
        }

        uploadedFileNames.push(presignedData.fileName)
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
        throw error
      }
    }
    
    return uploadedFileNames
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      let menuboardImageList: string[] = [...existingMenuImages]
      let spotImageList: string[] = [...existingSpotImages]

      // 새로 추가된 이미지들을 S3에 업로드
      if (menuImages.length > 0) {
        const uploadedMenuFileNames = await uploadImagesToS3(menuImages, 'MENUBOARD')
        menuboardImageList = [...menuboardImageList, ...uploadedMenuFileNames]
      }

      if (spotImages.length > 0) {
        const uploadedSpotFileNames = await uploadImagesToS3(spotImages, 'SPOT')
        spotImageList = [...spotImageList, ...uploadedSpotFileNames]
      }

      const submitData = {
        ...formData,
        localAcornCount: formData.localAcornCount || 0,
        basicAcornCount: formData.basicAcornCount || 0,
        menuboardImageList: menuboardImageList.length > 0 ? menuboardImageList : undefined,
        spotImageList: spotImageList.length > 0 ? spotImageList : undefined
      }

      if (mode === 'create') {
        await spotDetailService.createSpot(submitData)
        alert('장소가 등록되었습니다.')
      } else if (spotId) {
        await spotDetailService.updateSpot({ ...submitData, spotId })
        alert('장소가 수정되었습니다.')
      }
    } catch (error) {
      console.error('저장 실패:', error)
      alert('저장에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!spotId || !confirm('정말 삭제하시겠습니까?')) return
    
    setLoading(true)
    try {
      await spotDetailService.deleteSpot(spotId)
      alert('장소가 삭제되었습니다.')
    } catch (error) {
      console.error('삭제 실패:', error)
      alert('삭제에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const updateSignatureMenu = (index: number, field: keyof SignatureMenu, value: string | number) => {
    setFormData(prev => {
      const newList = [...prev.signatureMenuList]
      
      while (newList.length <= index) {
        newList.push({ name: '', price: 0 })
      }
      
      newList[index] = { ...newList[index], [field]: value }
      
      return {
        ...prev,
        signatureMenuList: newList
      }
    })
  }

  const updateOpeningHour = (dayOfWeek: DayOfWeek, field: keyof OpeningHour, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      openingHourList: prev.openingHourList.map((hour) => 
        hour.dayOfWeek === dayOfWeek ? { ...hour, [field]: value } : hour
      )
    }))
  }

  const getCurrentDayData = () => {
    return formData.openingHourList.find(hour => hour.dayOfWeek === selectedDay) || 
           { dayOfWeek: selectedDay, closed: false }
  }

  const renderImageGrid = (
    existingImages: string[], 
    newImages: LocalImage[], 
    type: 'menu' | 'spot'
  ) => {
    const allImages = [
      ...existingImages.map(fileName => `https://cdn.example.com/images/${fileName}`), // 기존 이미지 URL 변환
      ...newImages.map(img => img.url)
    ]

    const totalImages = existingImages.length + newImages.length
    const maxImages = 10

    if (totalImages === 0) {
      return (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '8px'
        }}>
          <div style={{
            aspectRatio: '1',
            border: '2px dashed var(--color-gray-400)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f9fafb'
          }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e, type)}
              style={{ display: 'none' }}
              id={`${type}-upload`}
            />
            <label htmlFor={`${type}-upload`} style={{ cursor: 'pointer', display: 'block' }}>
              <div style={{ fontSize: '12px', color: 'var(--color-gray-800)' }}>
                이미지를<br/>업로드하세요
              </div>
            </label>
          </div>
        </div>
      )
    }

    const gridItems = []

    // 기존 이미지들
    existingImages.forEach((fileName, index) => {
      gridItems.push(
        <div
          key={`existing-${index}`}
          style={{
            position: 'relative',
            aspectRatio: '1',
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => openPreview(allImages, index, type)}
        >
          <img
            src={`https://cdn.example.com/images/${fileName}`}
            alt={`${type} ${index + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeExistingImage(index, type)
            }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      )
    })

    // 새로 추가된 이미지들
    newImages.forEach((image, index) => {
      gridItems.push(
        <div
          key={`new-${index}`}
          style={{
            position: 'relative',
            aspectRatio: '1',
            borderRadius: '4px',
            overflow: 'hidden',
            cursor: 'pointer',
            backgroundColor: '#f0f0f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={() => openPreview(allImages, existingImages.length + index, type)}
        >
          <img
            src={image.url}
            alt={`새 ${type} ${index + 1}`}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain'
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation()
              removeNewImage(index, type)
            }}
            style={{
              position: 'absolute',
              top: '4px',
              right: '4px',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              color: 'white',
              cursor: 'pointer',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ×
          </button>
        </div>
      )
    })

    // 이미지 추가 버튼 (10개 미만일 때만)
    if (totalImages < maxImages) {
      gridItems.push(
        <div
          key="add-button"
          style={{
            aspectRatio: '1',
            border: '2px dashed var(--color-gray-400)',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: '#f9fafb'
          }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleImageUpload(e, type)}
            style={{ display: 'none' }}
            id={`${type}-upload-additional`}
          />
          <label htmlFor={`${type}-upload-additional`} style={{ cursor: 'pointer', display: 'block' }}>
            <div style={{ fontSize: '12px', color: 'var(--color-gray-800)' }}>
              + 이미지<br/>추가
            </div>
          </label>
        </div>
      )
    }

    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '8px'
      }}>
        {gridItems}
      </div>
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  const currentDayData = getCurrentDayData()

  {/* UI */}
  return (
    <div style={{
      padding: '24px',
      minHeight: '100vh'
    }}>
      <Breadcrumb current="장소 상세 정보" />
      
      <PageHeader 
        title="장소 상세 정보" 
      />

      {/* 메인 폼 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px'
      }}>
        {/* 사용자 정보 */}
        <div style={{
          marginBottom: '12px'
        }}>
          {mode === 'edit' && spotData ? (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '16px', color: 'var(--color-black)', fontWeight: '500' }}>
                #{spotData.spotId} {spotData.userNickname}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--color-gray-800)' }}>
                최근 수정일: {new Date(spotData.updatedAt).toLocaleDateString()}
              </span>
            </div>
          ) : (
            <div style={{ fontSize: '16px', color: 'var(--color-black)', fontWeight: '800' }}>
              aconadmin
            </div>
          )}
        </div>

        <div style={{
          width: '100%',
          height: '2px',
          backgroundColor: '#e5e7eb',
          marginBottom: '24px'
        }}>
        </div>

        <div>
          {/* 기본 정보 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--color-gray-800)'
              }}>
                장소명 <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.spotName}
                onChange={(e) => setFormData(prev => ({ ...prev, spotName: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--color-gray-400)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="장소명을 입력하세요"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--color-gray-800)'
              }}>
                도로명주소 <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid var(--color-gray-400)',
                  borderRadius: '6px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="서울특별시 강남구 역삼동 12-1"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                marginBottom: '8px',
                color: 'var(--color-gray-800)'
              }}>
                장소 종류 <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <div style={{ display: 'flex', gap: '16px'}}>
                <TagButton
                  isActive={formData.spotType === 'RESTAURANT'}
                  onClick={() => setFormData(prev => ({ ...prev, spotType: 'RESTAURANT', spotFeature: undefined }))}
                  style={{ height: '30px', padding: '0 24px' }}
                >
                  식당
                </TagButton>
                <TagButton
                  isActive={formData.spotType === 'CAFE'}
                  onClick={() => setFormData(prev => ({ ...prev, spotType: 'CAFE', spotFeature: undefined }))}
                  style={{ height: '30px', padding: '0 24px' }}
                >
                  카페
                </TagButton>
              </div>
            </div>
          </div>

          {/* 도토리 개수 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: 'var(--color-gray-800)'
                }}>
                  로컬 도토리 개수 <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.localAcornCount ?? ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    localAcornCount: e.target.value === '' ? null : parseInt(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--color-gray-400)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="56"
                />
              </div>
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '500',
                  marginBottom: '8px',
                  color: 'var(--color-gray-800)'
                }}>
                  일반 도토리 개수 <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="number"
                  value={formData.basicAcornCount ?? ''}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    basicAcornCount: e.target.value === '' ? null : parseInt(e.target.value) 
                  }))}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid var(--color-gray-400)',
                    borderRadius: '6px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="56"
                />
              </div>
            </div>
          </div>

          {/* 장소 특징 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: 'var(--color-gray-800)'
            }}>
              {formData.spotType === 'CAFE' ? '카페 특성' : '식당 특성'} <span style={{ color: 'var(--color-secondary-orange)' }}>*</span>
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {formData.spotType === 'CAFE' ? (
                Object.entries(cafeFeatureLabels).map(([key, label]) => (
                  <TagButton
                    key={key}
                    isActive={formData.spotFeature === key}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      spotFeature: prev.spotFeature === key ? undefined : key as CafeFeature 
                    }))}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '16px'
                    }}
                  >
                    {label}
                  </TagButton>
                ))
              ) : (
                Object.entries(restaurantFeatureLabels).map(([key, label]) => (
                  <TagButton
                    key={key}
                    isActive={formData.spotFeature === key}
                    onClick={() => setFormData(prev => ({ 
                      ...prev, 
                      spotFeature: prev.spotFeature === key ? undefined : key as RestaurantFeature
                    }))}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      borderRadius: '16px'
                    }}
                  >
                    {label}
                  </TagButton>
                ))
              )}
            </div>
          </div>

          {/* 영업 시간 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: 'var(--color-gray-800)'
            }}>
              영업 시간
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              {formData.openingHourList.map((hour) => (
                <TagButton
                  key={hour.dayOfWeek}
                  isActive={selectedDay === hour.dayOfWeek}
                  onClick={() => setSelectedDay(hour.dayOfWeek)}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    borderRadius: '4px'
                  }}
                >
                  {dayLabels[hour.dayOfWeek]}
                </TagButton>
              ))}
            </div>
            
            <div style={{
              padding: '16px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              backgroundColor: '#f9fafb'
            }}>
              {!currentDayData.closed && (
                <>
                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'center', 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-gray-800)' }}>
                      영업 시간을 입력해 주세요 (ex.9:00)
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    marginBottom: '16px' 
                  }}>
                    <input
                      type="text"
                      value={currentDayData.startTime || ''}
                      onChange={(e) => updateOpeningHour(selectedDay, 'startTime', e.target.value)}
                      placeholder="영업 시작 시간 (ex.9:00)"
                      style={{
                        padding: '12px',
                        border: '1px solid var(--color-gray-400)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    />
                    <input
                      type="text"
                      value={currentDayData.endTime || ''}
                      onChange={(e) => updateOpeningHour(selectedDay, 'endTime', e.target.value)}
                      placeholder="영업 종료 시간 (ex.23:00)"
                      style={{
                        padding: '12px',
                        border: '1px solid var(--color-gray-400)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    gap: '12px', 
                    alignItems: 'center', 
                    marginBottom: '16px' 
                  }}>
                    <span style={{ fontSize: '14px', color: 'var(--color-gray-800)' }}>
                      브레이크 타임 시간을 입력해 주세요 (ex.14:00)
                    </span>
                  </div>
                  
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '1fr 1fr', 
                    gap: '12px',
                    marginBottom: '16px' 
                  }}>
                    <input
                      type="text"
                      value={currentDayData.breakStartTime || ''}
                      onChange={(e) => updateOpeningHour(selectedDay, 'breakStartTime', e.target.value)}
                      placeholder="브레이크타임 시작 시간 (ex.15:00)"
                      style={{
                        padding: '12px',
                        border: '1px solid var(--color-gray-400)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    />
                    <input
                      type="text"
                      value={currentDayData.breakEndTime || ''}
                      onChange={(e) => updateOpeningHour(selectedDay, 'breakEndTime', e.target.value)}
                      placeholder="브레이크타임 종료 시간 (ex.17:00)"
                      style={{
                        padding: '12px',
                        border: '1px solid var(--color-gray-400)',
                        borderRadius: '6px',
                        fontSize: '14px',
                        backgroundColor: 'white'
                      }}
                    />
                  </div>
                </>
              )}

              <div style={{ 
                display: 'flex', 
                gap: '8px', 
                alignItems: 'center' 
              }}>
                <input
                  type="checkbox"
                  checked={currentDayData.closed || false}
                  onChange={(e) => updateOpeningHour(selectedDay, 'closed', e.target.checked)}
                  style={{
                    width: '16px',
                    height: '16px'
                  }}
                />
                <span style={{ fontSize: '14px', color: 'var(--color-gray-800)' }}>
                  휴무일
                </span>
              </div>
            </div>
          </div>

          {/* 대표 메뉴 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: 'var(--color-gray-800)'
            }}>
              대표 메뉴
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[0, 1, 2].map((index) => (
                <div key={index} style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 300px',
                  gap: '8px'
                }}>
                  <input
                    type="text"
                    value={formData.signatureMenuList[index]?.name || ''}
                    onChange={(e) => updateSignatureMenu(index, 'name', e.target.value)}
                    placeholder="메뉴명"
                    style={{
                      padding: '8px',
                      border: '1px solid var(--color-gray-400)',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                  <input
                    type="number"
                    value={formData.signatureMenuList[index]?.price ?? ''}
                    onChange={(e) => updateSignatureMenu(index, 'price', e.target.value === '' ? 0 : parseInt(e.target.value))}
                    placeholder="5500"
                    style={{
                      padding: '8px',
                      border: '1px solid var(--color-gray-400)',
                      borderRadius: '4px',
                      fontSize: '14px'
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 가성비 */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: 'var(--color-gray-800)'
            }}>
              가성비
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {Object.entries(priceFeatureLabels).map(([key, label]) => (
                <TagButton
                  key={key}
                  isActive={formData.priceFeature === key}
                  onClick={() => setFormData(prev => ({ 
                    ...prev, 
                    priceFeature: prev.priceFeature === key ? undefined : key as PriceFeature 
                  }))}
                  style={{
                    padding: '6px 12px',
                    fontSize: '12px',
                    borderRadius: '16px'
                  }}
                >
                  {label}
                </TagButton>
              ))}
            </div>
          </div>

          {/* 메뉴판 이미지 업로드 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: 'var(--color-gray-800)'
            }}>
              메뉴판
            </label>
            {renderImageGrid(existingMenuImages, menuImages, 'menu')}
          </div>

          {/* 장소 이미지 업로드 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              marginBottom: '8px',
              color: 'var(--color-gray-800)'
            }}>
              장소 이미지
            </label>
            {renderImageGrid(existingSpotImages, spotImages, 'spot')}
          </div>
        </div>
        
        {/* 버튼 영역 */}
        <div style={{
          padding: '20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div>
            {mode === 'edit' && (
              <button
                type="button"
                onClick={handleDelete}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#fee2e2',
                  color: '#dc2626',
                  border: '1px solid #fecaca',
                  borderRadius: '4px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                삭제
              </button>
            )}
          </div>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center',
            flex: 1
          }}>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: loading ? 'var(--color-gray-800)' : '#000000',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? '저장 중...' : (mode === 'create' ? '활성화' : '저장')}
            </button>
          </div>
        </div>
      </div>

      {/* 이미지 미리보기 모달 */}
      {previewModal.isOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            position: 'relative',
            width: '90vw',
            height: '90vh',
            maxWidth: '800px',
            maxHeight: '600px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'white',
            borderRadius: '8px',
            padding: '20px',
            boxSizing: 'border-box',
            overflow: 'hidden'
          }}>
            {/* 닫기 버튼 */}
            <button
              onClick={closePreview}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                cursor: 'pointer',
                fontSize: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001
              }}
            >
              ×
            </button>

            {/* 이전 버튼 */}
            {previewModal.images.length > 1 && (
              <button
                onClick={prevImage}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1001
                }}
              >
                ‹
              </button>
            )}

            {/* 다음 버튼 */}
            {previewModal.images.length > 1 && (
              <button
                onClick={nextImage}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  border: 'none',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1001
                }}
              >
                ›
              </button>
            )}

            {/* 이미지 */}
            <img
              src={previewModal.images[previewModal.currentIndex]}
              alt={`${previewModal.type} 미리보기`}
              style={{
                maxWidth: 'calc(100% - 80px)',
                maxHeight: 'calc(100% - 80px)',
                objectFit: 'contain',
                display: 'block'
              }}
            />

            {/* 페이지 인디케이터 */}
            {previewModal.images.length > 1 && (
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '50%',
                transform: 'translateX(-50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px'
              }}>
                {previewModal.currentIndex + 1} / {previewModal.images.length}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}