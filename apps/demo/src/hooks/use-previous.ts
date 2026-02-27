import { useRef, useEffect } from 'react'

/**
 * Tracks the previous value of a prop or state.
 * Useful for comparing current vs previous for animations or direction detection.
 */
function usePrevious<T>(value: T): T | undefined {
  const ref = useRef<T | undefined>(undefined)

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

export { usePrevious }
