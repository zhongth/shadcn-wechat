import { useRef, useEffect, useMemo } from 'react'

/**
 * Returns a stable callback reference that always calls the latest function.
 * Useful for event handlers in effects that shouldn't re-trigger on every render.
 */
function useCallbackRef<T extends (...args: any[]) => any>(
  callback: T | undefined
): T {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  })

  return useMemo(
    () =>
      ((...args: any[]) => {
        return callbackRef.current?.(...args)
      }) as T,
    []
  )
}

export { useCallbackRef }
