import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGameState } from './useGameState.js'

const blankPuzzle = () => Array.from({ length: 9 }, () => Array(9).fill(0))
const mockSolution = () => Array.from({ length: 9 }, (_, r) =>
  Array.from({ length: 9 }, (_, c) => ((r * 3 + Math.floor(r / 3) + c) % 9) + 1)
)

function setup() {
  const { result } = renderHook(() => useGameState())
  act(() => result.current.dispatch({
    type: 'SET_PUZZLE',
    payload: { puzzle: blankPuzzle(), solution: mockSolution() },
  }))
  return result
}

describe('useGameState', () => {
  it('初始狀態難度為 hard', () => {
    const { result } = renderHook(() => useGameState())
    expect(result.current.state.difficulty).toBe('hard')
  })

  it('SELECT_CELL 更新 selected', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 3, col: 5 } }))
    expect(result.current.state.selected).toEqual({ row: 3, col: 5 })
  })

  it('INPUT_NUMBER 寫入 board', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 0, col: 0 } }))
    act(() => result.current.dispatch({ type: 'INPUT_NUMBER', payload: 5 }))
    expect(result.current.state.board[0][0]).toBe(5)
  })

  it('UNDO 還原上一步', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 0, col: 0 } }))
    act(() => result.current.dispatch({ type: 'INPUT_NUMBER', payload: 5 }))
    act(() => result.current.dispatch({ type: 'UNDO' }))
    expect(result.current.state.board[0][0]).toBe(0)
  })

  it('TOGGLE_NOTE 在鉛筆模式下新增候選數字', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 0, col: 0 } }))
    act(() => result.current.dispatch({ type: 'TOGGLE_MODE' }))
    act(() => result.current.dispatch({ type: 'TOGGLE_NOTE', payload: 3 }))
    expect(result.current.state.notes[0][0].has(3)).toBe(true)
  })

  it('TOGGLE_NOTE 再次觸發同數字 → 移除', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 0, col: 0 } }))
    act(() => result.current.dispatch({ type: 'TOGGLE_MODE' }))
    act(() => result.current.dispatch({ type: 'TOGGLE_NOTE', payload: 3 }))
    act(() => result.current.dispatch({ type: 'TOGGLE_NOTE', payload: 3 }))
    expect(result.current.state.notes[0][0].has(3)).toBe(false)
  })

  it('CLEAR_CELL 清空格子數字與候選', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 0, col: 0 } }))
    act(() => result.current.dispatch({ type: 'INPUT_NUMBER', payload: 7 }))
    act(() => result.current.dispatch({ type: 'CLEAR_CELL' }))
    expect(result.current.state.board[0][0]).toBe(0)
  })

  it('history 上限為 10 步', () => {
    const result = setup()
    act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: 0, col: 0 } }))
    for (let i = 1; i <= 12; i++) {
      act(() => result.current.dispatch({ type: 'INPUT_NUMBER', payload: (i % 9) + 1 }))
    }
    expect(result.current.state.history.length).toBeLessThanOrEqual(10)
  })

  it('填完且無衝突 → status 變 won', () => {
    const solution = mockSolution()
    const { result } = renderHook(() => useGameState())
    act(() => result.current.dispatch({
      type: 'SET_PUZZLE',
      payload: { puzzle: blankPuzzle(), solution },
    }))
    // 填入完整解答
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        act(() => result.current.dispatch({ type: 'SELECT_CELL', payload: { row: r, col: c } }))
        act(() => result.current.dispatch({ type: 'INPUT_NUMBER', payload: solution[r][c] }))
      }
    }
    expect(result.current.state.status).toBe('won')
  })
})
