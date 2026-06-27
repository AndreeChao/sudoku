import { useState, useEffect } from 'react'
import { useGameState } from '../hooks/useGameState.js'
import { useTimer } from '../hooks/useTimer.js'
import { usePuzzleGenerator } from '../hooks/usePuzzleGenerator.js'
import { computeConflicts, computeNoteConflicts } from '../lib/conflicts.js'
import { Board } from './Board.jsx'
import { NumberPad } from './NumberPad.jsx'
import { StatusBar } from './StatusBar.jsx'
import { WinScreen } from './WinScreen.jsx'
import './App.css'

function fmtSecs(s) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}
function bestKey(difficulty) { return `sudoku-best-${difficulty}` }

export function App() {
  const { state, dispatch } = useGameState()
  const [genKey, setGenKey] = useState(0)
  const { result, loading } = usePuzzleGenerator(state.difficulty, genKey)
  const timer = useTimer(state.startTime, state.status)

  const [bestTime, setBestTime] = useState(() => {
    const s = localStorage.getItem(bestKey('hard'))
    return s ? fmtSecs(Number(s)) : '--:--'
  })

  // 難度切換時讀取對應最快紀錄
  useEffect(() => {
    const s = localStorage.getItem(bestKey(state.difficulty))
    setBestTime(s ? fmtSecs(Number(s)) : '--:--')
  }, [state.difficulty])

  // 完成時更新最快紀錄
  useEffect(() => {
    if (state.status !== 'won') return
    const elapsed = Math.floor((Date.now() - state.startTime) / 1000)
    const key = bestKey(state.difficulty)
    const stored = localStorage.getItem(key)
    if (!stored || elapsed < Number(stored)) {
      localStorage.setItem(key, String(elapsed))
      setBestTime(fmtSecs(elapsed))
    }
  }, [state.status, state.difficulty, state.startTime])

  // 謎題生成完成後載入
  useEffect(() => {
    if (result) dispatch({ type: 'SET_PUZZLE', payload: result })
  }, [result])

  const conflicts = computeConflicts(state.board)
  const noteConflicts = computeNoteConflicts(state.notes)

  const handleSelectCell = (row, col) => {
    dispatch({ type: 'SELECT_CELL', payload: { row, col } })
  }

  const handleNumber = (num) => {
    if (!state.selected) return
    if (state.mode === 'pencil') {
      dispatch({ type: 'TOGGLE_NOTE', payload: num })
    } else {
      dispatch({ type: 'INPUT_NUMBER', payload: num })
    }
  }

  const handleDifficultyChange = (difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', payload: difficulty })
    setGenKey(k => k + 1)
  }

  const handleNewGame = () => setGenKey(k => k + 1)

  return (
    <div className="app">
      {loading && (
        <div className="loading-overlay">
          <span>生成謎題中…</span>
        </div>
      )}

      <Board
        board={state.board}
        puzzle={state.puzzle}
        notes={state.notes}
        noteConflicts={noteConflicts}
        conflicts={conflicts}
        selected={state.selected}
        onSelectCell={handleSelectCell}
      />

      <NumberPad
        mode={state.mode}
        onNumber={handleNumber}
        onUndo={() => dispatch({ type: 'UNDO' })}
        onClear={() => dispatch({ type: 'CLEAR_CELL' })}
        onToggleMode={() => dispatch({ type: 'TOGGLE_MODE' })}
        onNewGame={handleNewGame}
      />

      <StatusBar
        difficulty={state.difficulty}
        timer={timer}
        bestTime={bestTime}
        onDifficultyChange={handleDifficultyChange}
      />

      {state.status === 'won' && (
        <WinScreen
          timer={timer}
          difficulty={state.difficulty}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  )
}
