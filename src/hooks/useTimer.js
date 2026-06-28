import { useState, useEffect } from 'react'

export function useTimer(startTime, status) {
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    if (!startTime) {
      setElapsed(0)
      return
    }
    if (status !== 'playing') return
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)
    return () => clearInterval(id)
  }, [startTime, status])

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')
  return `${mm}:${ss}`
}
