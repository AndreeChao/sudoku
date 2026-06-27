import './WinScreen.css'

const LABELS = { normal: '普通', hard: '困難', expert: '專家' }

export function WinScreen({ timer, difficulty, onNewGame }) {
  return (
    <div className="win-overlay">
      <div className="win-card">
        <div className="win-emoji">🎉</div>
        <h2 className="win-title">完成！</h2>
        <p className="win-info">難度：{LABELS[difficulty]}</p>
        <p className="win-info">用時：{timer}</p>
        <button className="win-btn" onClick={onNewGame}>再玩一局</button>
      </div>
    </div>
  )
}
