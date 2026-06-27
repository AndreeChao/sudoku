import { useState, useEffect } from 'react'

export function usePuzzleGenerator(difficulty, key) {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setResult(null)
    const worker = new Worker(
      new URL('../lib/sudoku.worker.js', import.meta.url),
      { type: 'module' }
    )
    worker.onmessage = (e) => {
      setResult(e.data)
      setLoading(false)
    }
    worker.onerror = () => {
      setLoading(false)
    }
    worker.postMessage({ difficulty })
    return () => worker.terminate()
  }, [difficulty, key])

  return { result, loading }
}
