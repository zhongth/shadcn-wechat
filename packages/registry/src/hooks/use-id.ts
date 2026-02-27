import { useState } from 'react'

let idCounter = 0

/**
 * Generates a stable unique ID. Falls back to a counter-based approach
 * if React.useId is not available (Taro compatibility).
 */
function useId(prefix = 'sw') {
  const [id] = useState(() => `${prefix}-${++idCounter}`)
  return id
}

export { useId }
