import './NumberPad.css'

export function NumberPad({ mode, onNumber, onUndo, onClear, onToggleMode, onNewGame }) {
  return (
    <div className="numpad">
      <button
        className={`fn-btn pencil-btn ${mode === 'pencil' ? 'active' : ''}`}
        onClick={onToggleMode}
        aria-label="鉛筆模式"
      >
        ✏️
      </button>
      {[1, 2, 3].map(n => (
        <button key={n} className="num-btn" onClick={() => onNumber(n)}>{n}</button>
      ))}

      <button className="fn-btn" onClick={onUndo} aria-label="復原">↩</button>
      {[4, 5, 6].map(n => (
        <button key={n} className="num-btn" onClick={() => onNumber(n)}>{n}</button>
      ))}

      <button className="fn-btn" onClick={onClear} aria-label="清除">✕</button>
      {[7, 8, 9].map(n => (
        <button key={n} className="num-btn" onClick={() => onNumber(n)}>{n}</button>
      ))}

      <button className="new-game-btn" onClick={onNewGame} aria-label="新局">新局</button>
    </div>
  )
}
