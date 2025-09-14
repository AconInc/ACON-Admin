import { useState, useEffect } from 'react'

/**
 * 디바운싱 훅
 * 
 * @param value - 디바운싱할 값
 * @param delay - 지연 시간 (밀리초)
 * @returns 디바운싱된 값
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    // delay 시간 후에 값을 업데이트하는 타이머 설정
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    // value나 delay가 변경되면 이전 타이머를 정리하고 새 타이머 시작
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}