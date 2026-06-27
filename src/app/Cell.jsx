import './Cell.css'

export function Cell({ value, isGiven, notes, noteHints, noteConflicts, isSelected, isSameNumber, isConflict, boxTop, boxLeft, boxRight, boxBottom, onClick }) {
  const classNames = [
    'cell',
    isGiven ? 'given' : '',
    isSelected ? 'selected' : isConflict ? 'conflict' : isSameNumber ? 'same-number' : '',
    boxTop ? 'box-top' : '',
    boxLeft ? 'box-left' : '',
    boxRight ? 'box-right' : '',
    boxBottom ? 'box-bottom' : '',
  ].filter(Boolean).join(' ')

  if (value !== 0) {
    return (
      <div className={classNames} onClick={onClick}>
        {value}
      </div>
    )
  }

  return (
    <div className={`${classNames} notes-cell`} onClick={onClick}>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
        <span
          key={n}
          className={`note-num ${notes.has(n) ? 'visible' : ''} ${noteHints.has(n) ? 'note-hint' : noteConflicts.has(n) ? 'note-conflict' : ''}`}
        >
          {notes.has(n) ? n : ''}
        </span>
      ))}
    </div>
  )
}
