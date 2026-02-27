import { useEffect } from 'react'
import { useCallbackRef } from './use-callback-ref'

/**
 * Declarative setTimeout hook.
 * Pass `null` as delay to pause/cancel the timeout.
 *
 * Usage:
 * ```tsx
 * useTimeout(() => dismiss(), 3000)  // fires after 3s
 * useTimeout(() => dismiss(), null)  // paused
 * ```
 */
function useTimeout(callback: () => void, delay: number | null) {
  const savedCallback = useCallbackRef(callback)

  useEffect(() => {
    if (delay === null) return

    const id = setTimeout(() => savedCallback(), delay)
    return () => clearTimeout(id)
  }, [delay, savedCallback])
}

export { useTimeout }
