import './StatusBar.css'

const LABELS = { normal: '普通', hard: '困難', expert: '專家' }

export function StatusBar({ difficulty, timer, onDifficultyChange }) {
  return (
    <div className="status-bar">
      <select
        className="difficulty-select"
        value={difficulty}
        onChange={e => onDifficultyChange(e.target.value)}
      >
        {Object.entries(LABELS).map(([val, label]) => (
          <option key={val} value={val}>{label}</option>
        ))}
      </select>
      <span className="timer">{timer}</span>
    </div>
  )
}
