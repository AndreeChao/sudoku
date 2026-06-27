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

export function App() {
  const { state, dispatch } = useGameState()
  const [genKey, setGenKey] = useState(0)
  const { result, loading } = usePuzzleGenerator(state.difficulty, genKey)
  const timer = useTimer(state.startTime, state.status)

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
      />

      <StatusBar
        difficulty={state.difficulty}
        timer={timer}
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
