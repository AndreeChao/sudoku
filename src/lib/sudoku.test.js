import { describe, it, expect } from 'vitest'
import { generatePuzzle, isValidBoard } from './sudoku.js'

const CLUES = { normal: 45, hard: 35, expert: 29 }

describe('generatePuzzle', () => {
  it('normal 難度有 45 格提示', () => {
    const { puzzle } = generatePuzzle('normal')
    const clues = puzzle.flat().filter(n => n !== 0).length
    expect(clues).toBeGreaterThanOrEqual(CLUES.normal)
    expect(clues).toBeLessThanOrEqual(CLUES.normal + 4)
  })

  it('hard 難度有 35 格提示', () => {
    const { puzzle } = generatePuzzle('hard')
    const clues = puzzle.flat().filter(n => n !== 0).length
    expect(clues).toBeGreaterThanOrEqual(CLUES.hard)
    expect(clues).toBeLessThanOrEqual(CLUES.hard + 4)
  })

  it('expert 難度有 29 格提示', () => {
    const { puzzle } = generatePuzzle('expert')
    const clues = puzzle.flat().filter(n => n !== 0).length
    expect(clues).toBeGreaterThanOrEqual(CLUES.expert)
    expect(clues).toBeLessThanOrEqual(CLUES.expert + 4)
  })

  it('solution 是完整合法的數獨', () => {
    const { solution } = generatePuzzle('normal')
    expect(isValidBoard(solution)).toBe(true)
  })

  it('puzzle 中有數字的格子與 solution 對應', () => {
    const { puzzle, solution } = generatePuzzle('hard')
    for (let r = 0; r < 9; r++)
      for (let c = 0; c < 9; c++)
        if (puzzle[r][c] !== 0)
          expect(puzzle[r][c]).toBe(solution[r][c])
  })
})
