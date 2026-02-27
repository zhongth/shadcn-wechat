import { View } from '@tarojs/components'
import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useGesture } from '@/hooks/use-gesture'

type SwipeSide = 'closed' | 'left' | 'right'

export interface SwipeCellProps {
  className?: string
  children?: React.ReactNode
  /** Left-side action buttons */
  leftActions?: React.ReactNode
  /** Right-side action buttons */
  rightActions?: React.ReactNode
  /** Width of left actions area (px) */
  leftActionWidth?: number
  /** Width of right actions area (px) */
  rightActionWidth?: number
  /** Called when actions are revealed */
  onOpen?: (side: 'left' | 'right') => void
  /** Called when cell returns to closed */
  onClose?: () => void
  /** Disable swipe */
  disabled?: boolean
}

/**
 * SwipeCell reveals hidden action buttons on horizontal swipe.
 *
 * Usage:
 * ```tsx
 * <SwipeCell
 *   rightActions={
 *     <View className="flex flex-row h-full">
 *       <Button variant="secondary">Edit</Button>
 *       <Button variant="destructive">Delete</Button>
 *     </View>
 *   }
 *   rightActionWidth={160}
 * >
 *   <View className="p-4 bg-background">Cell content</View>
 * </SwipeCell>
 * ```
 */
function SwipeCell({
  className,
  children,
  leftActions,
  rightActions,
  leftActionWidth = 80,
  rightActionWidth = 80,
  onOpen,
  onClose,
  disabled = false,
}: SwipeCellProps) {
  const [offset, setOffset] = useState(0)
  const [state, setState] = useState<SwipeSide>('closed')
  const isDragging = useRef(false)
  const startOffset = useRef(0)

  const snap = useCallback(
    (side: SwipeSide) => {
      setState(side)
      switch (side) {
        case 'left':
          setOffset(leftActionWidth)
          onOpen?.('left')
          break
        case 'right':
          setOffset(-rightActionWidth)
          onOpen?.('right')
          break
        default:
          setOffset(0)
          onClose?.()
          break
      }
    },
    [leftActionWidth, rightActionWidth, onOpen, onClose]
  )

  const gesture = useGesture({
    onPanStart: () => {
      if (disabled) return
      isDragging.current = true
      startOffset.current = offset
    },
    onPan: (delta) => {
      if (disabled || !isDragging.current) return

      // Only respond to mostly-horizontal gestures
      if (Math.abs(delta.x) < Math.abs(delta.y) * 1.5) return

      let newOffset = startOffset.current + delta.x

      // Clamp: don't swipe further than action width
      if (leftActions) {
        newOffset = Math.min(newOffset, leftActionWidth)
      } else {
        newOffset = Math.min(newOffset, 0)
      }
      if (rightActions) {
        newOffset = Math.max(newOffset, -rightActionWidth)
      } else {
        newOffset = Math.max(newOffset, 0)
      }

      setOffset(newOffset)
    },
    onPanEnd: (delta) => {
      if (disabled || !isDragging.current) return
      isDragging.current = false

      const threshold = 40

      if (offset > threshold && leftActions) {
        snap('left')
      } else if (offset < -threshold && rightActions) {
        snap('right')
      } else {
        snap('closed')
      }
    },
  })

  const transitionStyle = isDragging.current
    ? 'none'
    : 'transform 200ms ease-out'

  return (
    <View className={cn('relative overflow-hidden', className)}>
      {/* Left actions (behind, left-aligned) */}
      {leftActions && (
        <View
          className="absolute left-0 top-0 bottom-0 flex items-center"
          style={{ width: `${leftActionWidth}px` }}
        >
          {leftActions}
        </View>
      )}

      {/* Right actions (behind, right-aligned) */}
      {rightActions && (
        <View
          className="absolute right-0 top-0 bottom-0 flex items-center"
          style={{ width: `${rightActionWidth}px` }}
        >
          {rightActions}
        </View>
      )}

      {/* Main content (slides) */}
      <View
        style={{
          transform: `translateX(${offset}px)`,
          transition: transitionStyle,
        }}
        {...gesture.bindHandlers()}
        onTap={() => {
          if (state !== 'closed') snap('closed')
        }}
      >
        {children}
      </View>
    </View>
  )
}

export { SwipeCell }
