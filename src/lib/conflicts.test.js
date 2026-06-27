import { describe, it, expect } from 'vitest'
import { computeConflicts, computeNoteConflicts } from './conflicts.js'

const emptyBoard = () => Array.from({ length: 9 }, () => Array(9).fill(0))
const emptyNotes = () => Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set()))

describe('computeConflicts', () => {
  it('同行重複數字 → 兩格都標衝突', () => {
    const board = emptyBoard()
    board[0][0] = 5
    board[0][8] = 5
    const c = computeConflicts(board)
    expect(c.has('0,0')).toBe(true)
    expect(c.has('0,8')).toBe(true)
    expect(c.size).toBe(2)
  })

  it('同列重複數字 → 兩格都標衝突', () => {
    const board = emptyBoard()
    board[0][3] = 3
    board[8][3] = 3
    const c = computeConflicts(board)
    expect(c.has('0,3')).toBe(true)
    expect(c.has('8,3')).toBe(true)
  })

  it('同宮重複數字 → 兩格都標衝突', () => {
    const board = emptyBoard()
    board[0][0] = 7
    board[2][2] = 7
    const c = computeConflicts(board)
    expect(c.has('0,0')).toBe(true)
    expect(c.has('2,2')).toBe(true)
  })

  it('無衝突 → 空集合', () => {
    const board = emptyBoard()
    board[0][0] = 1
    board[0][1] = 2
    expect(computeConflicts(board).size).toBe(0)
  })
})

describe('computeNoteConflicts', () => {
  it('同行兩格有相同候選數字 → 標記為衝突', () => {
    const notes = emptyNotes()
    notes[0][0] = new Set([3])
    notes[0][5] = new Set([3])
    const result = computeNoteConflicts(notes)
    expect(result[0][0].has(3)).toBe(true)
    expect(result[0][5].has(3)).toBe(true)
  })

  it('不同行列宮的候選數字不衝突', () => {
    const notes = emptyNotes()
    notes[0][0] = new Set([5])
    notes[4][4] = new Set([5])
    const result = computeNoteConflicts(notes)
    expect(result[0][0].has(5)).toBe(false)
    expect(result[4][4].has(5)).toBe(false)
  })
})
