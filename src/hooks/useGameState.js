import { useReducer } from 'react'

function createInitialState(difficulty = 'hard') {
  return {
    puzzle: Array.from({ length: 9 }, () => Array(9).fill(0)),
    solution: Array.from({ length: 9 }, () => Array(9).fill(0)),
    board: Array.from({ length: 9 }, () => Array(9).fill(0)),
    notes: Array.from({ length: 9 }, () => Array.from({ length: 9 }, () => new Set())),
    selected: null,
    mode: 'normal',
    history: [],
    difficulty,
    status: 'idle',
    startTime: null,
  }
}

function isComplete(board, solution) {
  for (let r = 0; r < 9; r++)
    for (let c = 0; c < 9; c++)
      if (board[r][c] !== solution[r][c]) return false
  return true
}

function clampHistory(history) {
  return history.slice(-10)
}

function gameReducer(state, action) {
  switch (action.type) {
    case 'SELECT_CELL':
      if (state.status === 'idle') {
        return { ...state, selected: action.payload, status: 'playing', startTime: Date.now() }
      }
      return { ...state, selected: action.payload }

    case 'SET_PUZZLE':
      return {
        ...createInitialState(state.difficulty),
        puzzle: action.payload.puzzle,
        solution: action.payload.solution,
        board: action.payload.puzzle.map(r => [...r]),
      }

    case 'INPUT_NUMBER': {
      const sel = state.selected
      if (!sel || state.puzzle[sel.row][sel.col] !== 0) return state
      const num = action.payload
      const newBoard = state.board.map(r => [...r])
      newBoard[sel.row][sel.col] = num

      // 自動清掉同行、同列、同宮格的相同候選數字
      const newNotes = state.notes.map(r => r.map(s => new Set(s)))
      const clearedNotesCells = []
      const br = Math.floor(sel.row / 3) * 3
      const bc = Math.floor(sel.col / 3) * 3
      const peers = new Set()
      for (let i = 0; i < 9; i++) {
        peers.add(`${sel.row},${i}`)
        peers.add(`${i},${sel.col}`)
      }
      for (let r = br; r < br + 3; r++)
        for (let c = bc; c < bc + 3; c++)
          peers.add(`${r},${c}`)
      for (const key of peers) {
        const [r, c] = key.split(',').map(Number)
        if (newNotes[r][c].has(num)) {
          newNotes[r][c].delete(num)
          clearedNotesCells.push({ row: r, col: c })
        }
      }

      const entry = { type: 'board', row: sel.row, col: sel.col, prev: state.board[sel.row][sel.col], num, clearedNotesCells }
      const newHistory = clampHistory([...state.history, entry])
      const newStatus = isComplete(newBoard, state.solution) ? 'won' : 'playing'
      return { ...state, board: newBoard, notes: newNotes, history: newHistory, status: newStatus }
    }

    case 'TOGGLE_NOTE': {
      const sel = state.selected
      if (!sel || state.puzzle[sel.row][sel.col] !== 0 || state.board[sel.row][sel.col] !== 0) return state
      const newNotes = state.notes.map(r => r.map(s => new Set(s)))
      const num = action.payload
      const prevHas = newNotes[sel.row][sel.col].has(num)
      if (prevHas) newNotes[sel.row][sel.col].delete(num)
      else newNotes[sel.row][sel.col].add(num)
      const entry = { type: 'note', row: sel.row, col: sel.col, num, prevHas }
      return { ...state, notes: newNotes, history: clampHistory([...state.history, entry]) }
    }

    case 'CLEAR_CELL': {
      const sel = state.selected
      if (!sel || state.puzzle[sel.row][sel.col] !== 0) return state
      const newBoard = state.board.map(r => [...r])
      const newNotes = state.notes.map(r => r.map(s => new Set(s)))
      const entry = {
        type: 'clear',
        row: sel.row, col: sel.col,
        prevBoard: state.board[sel.row][sel.col],
        prevNotes: new Set(state.notes[sel.row][sel.col]),
      }
      newBoard[sel.row][sel.col] = 0
      newNotes[sel.row][sel.col] = new Set()
      return { ...state, board: newBoard, notes: newNotes, history: clampHistory([...state.history, entry]), status: 'playing' }
    }

    case 'UNDO': {
      if (!state.history.length) return state
      const last = state.history[state.history.length - 1]
      const newHistory = state.history.slice(0, -1)
      if (last.type === 'board') {
        const newBoard = state.board.map(r => [...r])
        newBoard[last.row][last.col] = last.prev
        const newNotes = state.notes.map(r => r.map(s => new Set(s)))
        // 還原被自動清掉的候選數字
        if (last.clearedNotesCells) {
          for (const { row, col } of last.clearedNotesCells) newNotes[row][col].add(last.num)
        }
        return { ...state, board: newBoard, notes: newNotes, history: newHistory, status: 'playing' }
      }
      if (last.type === 'note') {
        const newNotes = state.notes.map(r => r.map(s => new Set(s)))
        if (last.prevHas) newNotes[last.row][last.col].add(last.num)
        else newNotes[last.row][last.col].delete(last.num)
        return { ...state, notes: newNotes, history: newHistory }
      }
      if (last.type === 'clear') {
        const newBoard = state.board.map(r => [...r])
        const newNotes = state.notes.map(r => r.map(s => new Set(s)))
        newBoard[last.row][last.col] = last.prevBoard
        newNotes[last.row][last.col] = new Set(last.prevNotes)
        return { ...state, board: newBoard, notes: newNotes, history: newHistory }
      }
      return state
    }

    case 'TOGGLE_MODE':
      return { ...state, mode: state.mode === 'normal' ? 'pencil' : 'normal' }

    case 'SET_DIFFICULTY':
      return { ...state, difficulty: action.payload }

    default:
      return state
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(gameReducer, undefined, () => createInitialState('hard'))
  return { state, dispatch }
}
