import { useEffect, useRef, useState, useCallback } from 'react'

type TimerMode = 'countdown' | 'stopwatch'

interface UseTimerOptions {
  initialSeconds?: number
  mode?: TimerMode
  onComplete?: () => void
}

export function useTimer(options: UseTimerOptions = {}) {
  const { initialSeconds = 60, mode = 'countdown', onComplete } = options
  const [seconds, setSeconds] = useState(initialSeconds)
  const [isRunning, setIsRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const initialRef = useRef(initialSeconds)

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const start = useCallback(() => {
    if (isRunning) return
    setIsRunning(true)
    intervalRef.current = setInterval(() => {
      setSeconds((prev) => {
        if (mode === 'countdown') {
          if (prev <= 1) {
            clear()
            setIsRunning(false)
            onComplete?.()
            return 0
          }
          return prev - 1
        }
        return prev + 1
      })
    }, 1000)
  }, [isRunning, mode, onComplete, clear])

  const pause = useCallback(() => {
    clear()
    setIsRunning(false)
  }, [clear])

  const reset = useCallback(
    (newSeconds?: number) => {
      clear()
      setIsRunning(false)
      const value = newSeconds ?? initialRef.current
      initialRef.current = value
      setSeconds(value)
    },
    [clear]
  )

  const setDuration = useCallback((value: number) => {
    initialRef.current = value
    setSeconds(value)
  }, [])

  useEffect(() => {
    return () => clear()
  }, [clear])

  return {
    seconds,
    isRunning,
    start,
    pause,
    reset,
    setDuration,
    progress:
      mode === 'countdown'
        ? initialRef.current > 0
          ? seconds / initialRef.current
          : 0
        : 1,
  }
}
