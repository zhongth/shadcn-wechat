import { View } from '@tarojs/components'
import { useState, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Popup } from './popup'
import { useGesture } from '@/hooks/use-gesture'

export interface DrawerProps {
  className?: string
  children?: React.ReactNode
  /** Controlled open state */
  open?: boolean
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void
  /** Drawer position */
  position?: 'bottom' | 'left' | 'right'
  /** Allow drag-to-dismiss (default true) */
  dismissible?: boolean
}

/**
 * Drawer / Sheet component with drag-to-dismiss gesture.
 * Built on Popup with useGesture for swipe dismissal.
 *
 * Usage:
 * ```tsx
 * <Drawer open={open} onOpenChange={setOpen} position="bottom">
 *   <View className="p-6">
 *     <Text>Drawer content</Text>
 *   </View>
 * </Drawer>
 * ```
 */
function Drawer({
  className,
  children,
  open,
  onOpenChange,
  position = 'bottom',
  dismissible = true,
}: DrawerProps) {
  const [dragOffset, setDragOffset] = useState(0)
  const isDragging = useRef(false)
  const dismissThreshold = 80

  const handleClose = useCallback(() => {
    onOpenChange?.(false)
  }, [onOpenChange])

  const gesture = useGesture({
    onPanStart: () => {
      if (!dismissible) return
      isDragging.current = true
    },
    onPan: (delta) => {
      if (!dismissible || !isDragging.current) return

      // Only allow dragging in the dismiss direction
      if (position === 'bottom' && delta.y > 0) {
        setDragOffset(delta.y)
      } else if (position === 'left' && delta.x < 0) {
        setDragOffset(-delta.x)
      } else if (position === 'right' && delta.x > 0) {
        setDragOffset(delta.x)
      }
    },
    onPanEnd: (delta, velocity) => {
      if (!dismissible || !isDragging.current) return
      isDragging.current = false

      let shouldDismiss = false

      if (position === 'bottom') {
        shouldDismiss = delta.y > dismissThreshold || velocity.y > 0.5
      } else if (position === 'left') {
        shouldDismiss = delta.x < -dismissThreshold || velocity.x < -0.5
      } else if (position === 'right') {
        shouldDismiss = delta.x > dismissThreshold || velocity.x > 0.5
      }

      setDragOffset(0)
      if (shouldDismiss) {
        handleClose()
      }
    },
  })

  const getDragStyle = (): React.CSSProperties => {
    if (dragOffset === 0) return {}

    const transition = isDragging.current ? 'none' : 'transform 200ms ease-out'

    if (position === 'bottom') {
      return { transform: `translateY(${dragOffset}px)`, transition }
    } else if (position === 'left') {
      return { transform: `translateX(-${dragOffset}px)`, transition }
    } else if (position === 'right') {
      return { transform: `translateX(${dragOffset}px)`, transition }
    }
    return {}
  }

  return (
    <Popup
      open={open}
      onOpenChange={onOpenChange}
      position={position}
    >
      <View
        className={cn(
          'bg-background',
          position === 'bottom' && 'rounded-t-xl',
          position === 'left' && 'h-full w-72',
          position === 'right' && 'h-full w-72',
          className
        )}
        style={getDragStyle()}
        {...gesture.bindHandlers()}
      >
        {/* Drag handle for bottom drawer */}
        {position === 'bottom' && dismissible && (
          <View className="flex items-center justify-center pt-3 pb-1">
            <View className="h-1.5 w-12 rounded-full bg-muted" />
          </View>
        )}

        {children}
      </View>
    </Popup>
  )
}

// Sheet is an alias for Drawer
const Sheet = Drawer
type SheetProps = DrawerProps

export { Drawer, Sheet }
export type { SheetProps }
