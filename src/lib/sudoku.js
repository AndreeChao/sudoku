function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

function isValid(board, row, col, num) {
  for (let c = 0; c < 9; c++) if (board[row][c] === num) return false
  for (let r = 0; r < 9; r++) if (board[r][col] === num) return false
  const br = Math.floor(row / 3) * 3
  const bc = Math.floor(col / 3) * 3
  for (let r = br; r < br + 3; r++)
    for (let c = bc; c < bc + 3; c++)
      if (board[r][c] === num) return false
  return true
}

function findEmpty(board) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c] === 0) return [r, c]
  return null
}

function fillBoard(board) {
  const empty = findEmpty(board)
  if (!empty) return true
  const [row, col] = empty
  const nums = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])
  for (const num of nums) {
    if (isValid(board, row, col, num)) {
      board[row][col] = num
      if (fillBoard(board)) return true
      board[row][col] = 0
    }
  }
  return false
}

// 計算解的數量（上限 limit，超過就停止）—— 用於確保唯一解
function countSolutions(board, limit = 2) {
  const b = board.map(r => [...r])
  let count = 0
  function solve() {
    if (count >= limit) return
    const empty = findEmpty(b)
    if (!empty) { count++; return }
    const [row, col] = empty
    for (let num = 1; num <= 9; num++) {
      if (isValid(b, row, col, num)) {
        b[row][col] = num
        solve()
        b[row][col] = 0
      }
    }
  }
  solve()
  return count
}

const CLUES_PER_DIFFICULTY = { normal: 45, hard: 35, expert: 29 }

function removeNumbers(solution, clues) {
  const board = solution.map(r => [...r])
  const cells = shuffle(Array.from({ length: 81 }, (_, i) => i))
  let remaining = 81
  for (const idx of cells) {
    if (remaining <= clues) break
    const row = Math.floor(idx / 9)
    const col = idx % 9
    if (board[row][col] === 0) continue
    const backup = board[row][col]
    board[row][col] = 0
    if (countSolutions(board) === 1) {
      remaining--
    } else {
      board[row][col] = backup
    }
  }
  return board
}

export function generatePuzzle(difficulty = 'hard') {
  const solution = Array.from({ length: 9 }, () => Array(9).fill(0))
  fillBoard(solution)
  const clues = CLUES_PER_DIFFICULTY[difficulty]
  const puzzle = removeNumbers(solution, clues)
  return { puzzle, solution }
}

export function isValidBoard(board) {
  const check = (nums) => {
    const s = nums.filter(n => n !== 0)
    return s.length === new Set(s).size && s.every(n => n >= 1 && n <= 9)
  }
  for (let r = 0; r < 9; r++) if (!check(board[r])) return false
  for (let c = 0; c < 9; c++) if (!check(board.map(r => r[c]))) return false
  for (let br = 0; br < 3; br++)
    for (let bc = 0; bc < 3; bc++) {
      const box = []
      for (let r = br * 3; r < br * 3 + 3; r++)
        for (let c = bc * 3; c < bc * 3 + 3; c++)
          box.push(board[r][c])
      if (!check(box)) return false
    }
  if (board.flat().some(n => n === 0)) return false
  return true
}
