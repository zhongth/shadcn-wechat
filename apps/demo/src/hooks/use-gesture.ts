import { useRef, useCallback } from 'react'

type Point = { x: number; y: number }

type GestureDirection = 'left' | 'right' | 'up' | 'down' | null

type UseGestureOptions = {
  /** Called when a swipe gesture is detected */
  onSwipe?: (direction: GestureDirection) => void
  /** Called during pan/drag with delta position */
  onPan?: (delta: Point, event: any) => void
  /** Called when pan starts */
  onPanStart?: (point: Point, event: any) => void
  /** Called when pan ends */
  onPanEnd?: (delta: Point, velocity: Point, event: any) => void
  /** Called on long press (>= 500ms) */
  onLongPress?: (point: Point) => void
  /** Minimum distance in px to qualify as a swipe */
  swipeThreshold?: number
  /** Maximum time in ms for a swipe gesture */
  swipeTimeout?: number
}

/**
 * Touch gesture recognition for mini programs.
 * Returns Taro-compatible touch event handlers.
 *
 * Usage:
 * ```tsx
 * const gesture = useGesture({ onSwipe: (dir) => console.log(dir) })
 * <View {...gesture.bindHandlers()} />
 * ```
 */
function useGesture({
  onSwipe,
  onPan,
  onPanStart,
  onPanEnd,
  onLongPress,
  swipeThreshold = 30,
  swipeTimeout = 300,
}: UseGestureOptions = {}) {
  const startPoint = useRef<Point | null>(null)
  const startTime = useRef(0)
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastPoint = useRef<Point | null>(null)
  const lastTime = useRef(0)

  const clearLongPress = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current)
      longPressTimer.current = null
    }
  }, [])

  const onTouchStart = useCallback(
    (e: any) => {
      const touch = e.touches[0]
      const point = { x: touch.clientX, y: touch.clientY }

      startPoint.current = point
      lastPoint.current = point
      startTime.current = Date.now()
      lastTime.current = Date.now()

      onPanStart?.(point, e)

      // Long press detection
      if (onLongPress) {
        clearLongPress()
        longPressTimer.current = setTimeout(() => {
          onLongPress(point)
        }, 500)
      }
    },
    [onPanStart, onLongPress, clearLongPress]
  )

  const onTouchMove = useCallback(
    (e: any) => {
      if (!startPoint.current) return

      const touch = e.touches[0]
      const currentPoint = { x: touch.clientX, y: touch.clientY }
      const delta = {
        x: currentPoint.x - startPoint.current.x,
        y: currentPoint.y - startPoint.current.y,
      }

      lastPoint.current = currentPoint
      lastTime.current = Date.now()

      // Cancel long press if moved too much
      if (Math.abs(delta.x) > 10 || Math.abs(delta.y) > 10) {
        clearLongPress()
      }

      onPan?.(delta, e)
    },
    [onPan, clearLongPress]
  )

  const onTouchEnd = useCallback(
    (e: any) => {
      clearLongPress()

      if (!startPoint.current || !lastPoint.current) return

      const delta = {
        x: lastPoint.current.x - startPoint.current.x,
        y: lastPoint.current.y - startPoint.current.y,
      }
      const elapsed = Date.now() - startTime.current
      const timeElapsed = Math.max(Date.now() - lastTime.current, 1)

      const velocity = {
        x: delta.x / timeElapsed,
        y: delta.y / timeElapsed,
      }

      onPanEnd?.(delta, velocity, e)

      // Swipe detection
      if (onSwipe && elapsed < swipeTimeout) {
        const absX = Math.abs(delta.x)
        const absY = Math.abs(delta.y)

        if (absX > swipeThreshold || absY > swipeThreshold) {
          let direction: GestureDirection = null

          if (absX > absY) {
            direction = delta.x > 0 ? 'right' : 'left'
          } else {
            direction = delta.y > 0 ? 'down' : 'up'
          }

          onSwipe(direction)
        }
      }

      startPoint.current = null
      lastPoint.current = null
    },
    [onSwipe, onPanEnd, clearLongPress, swipeThreshold, swipeTimeout]
  )

  const bindHandlers = useCallback(
    () => ({
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    }),
    [onTouchStart, onTouchMove, onTouchEnd]
  )

  return { onTouchStart, onTouchMove, onTouchEnd, bindHandlers }
}

export { useGesture }
export type { UseGestureOptions, GestureDirection, Point }
