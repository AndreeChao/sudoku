import { generatePuzzle } from './sudoku.js'

self.onmessage = (e) => {
  const { difficulty } = e.data
  const result = generatePuzzle(difficulty)
  self.postMessage(result)
}
