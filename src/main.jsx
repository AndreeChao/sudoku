import { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App.jsx'

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }
  static getDerivedStateFromError(error) {
    return { error }
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 24, fontFamily: 'monospace', fontSize: 14, color: '#c00' }}>
          <strong>Error:</strong><br />
          {this.state.error.message}<br /><br />
          {this.state.error.stack}
        </div>
      )
    }
    return this.props.children
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
)
