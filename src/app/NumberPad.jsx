import './NumberPad.css'

export function NumberPad({ onAnswerNumber, onPencilNumber, onUndo, onClear, onNewGame }) {
  return (
    <div className="numpad">
      <div className="numpad-numbers">
        <div className="answer-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} className="num-btn" onClick={() => onAnswerNumber(n)}>{n}</button>
          ))}
        </div>
        <div className="pencil-grid">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
            <button key={n} className="pencil-num-btn" onClick={() => onPencilNumber(n)}>{n}</button>
          ))}
        </div>
      </div>
      <div className="fn-row">
        <button className="fn-btn" onClick={onUndo} aria-label="復原">↩</button>
        <button className="fn-btn" onClick={onClear} aria-label="清除">✕</button>
        <button className="fn-btn new-game-btn" onClick={onNewGame} aria-label="新局">新局</button>
      </div>
    </div>
  )
}
