import { Cell } from './Cell.jsx'
import './Board.css'

export function Board({ board, puzzle, notes, noteHints, noteConflicts, conflicts, selected, onSelectCell }) {
  const selectedVal = selected ? board[selected.row][selected.col] : 0

  return (
    <div className="board">
      {board.map((row, r) =>
        row.map((val, c) => {
          const key = `${r},${c}`
          return (
            <Cell
              key={key}
              value={val}
              isGiven={puzzle[r][c] !== 0}
              notes={notes[r][c]}
              noteHints={noteHints[r][c]}
              noteConflicts={noteConflicts[r][c]}
              isSelected={selected?.row === r && selected?.col === c}
              isSameNumber={val !== 0 && val === selectedVal}
              isConflict={conflicts.has(key)}
              boxTop={r % 3 === 0}
              boxLeft={c % 3 === 0}
              onClick={() => onSelectCell(r, c)}
            />
          )
        })
      )}
    </div>
  )
}
