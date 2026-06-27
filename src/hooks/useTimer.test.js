import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useTimer } from './useTimer.js'

describe('useTimer', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('初始顯示 00:00', () => {
    const { result } = renderHook(() => useTimer(Date.now(), 'playing'))
    expect(result.current).toBe('00:00')
  })

  it('1 秒後顯示 00:01', () => {
    const start = Date.now()
    const { result } = renderHook(() => useTimer(start, 'playing'))
    act(() => { vi.advanceTimersByTime(1000) })
    expect(result.current).toBe('00:01')
  })

  it('61 秒後顯示 01:01', () => {
    const start = Date.now()
    const { result } = renderHook(() => useTimer(start, 'playing'))
    act(() => { vi.advanceTimersByTime(61000) })
    expect(result.current).toBe('01:01')
  })

  it('status 為 won 時停止計時', () => {
    const start = Date.now()
    const { result, rerender } = renderHook(
      ({ status }) => useTimer(start, status),
      { initialProps: { status: 'playing' } }
    )
    act(() => { vi.advanceTimersByTime(5000) })
    rerender({ status: 'won' })
    act(() => { vi.advanceTimersByTime(5000) })
    expect(result.current).toBe('00:05')
  })
})
