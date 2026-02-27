import { View } from '@tarojs/components'
import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useDisclosure, type UseDisclosureProps } from '@/hooks/use-disclosure'

export interface PopupProps extends UseDisclosureProps {
  className?: string
  children?: React.ReactNode
  /** Content position */
  position?: 'center' | 'bottom' | 'top' | 'left' | 'right'
  /** Show backdrop overlay */
  overlay?: boolean
  /** Close when backdrop is tapped */
  closable?: boolean
  /** Prevent background scroll */
  lockScroll?: boolean
  /** Custom backdrop className */
  overlayClassName?: string
}

type AnimationState = 'closed' | 'entering' | 'open' | 'exiting'

/**
 * Popup is the overlay primitive for the entire component library.
 * Dialog, ActionSheet, Toast, Drawer, Select all build on this.
 *
 * Features:
 * - Fixed-position overlay (no createPortal needed)
 * - CSS transition-based enter/exit animations
 * - Configurable position: center, bottom, top, left, right
 * - Backdrop with tap-to-close
 *
 * IMPORTANT: Place at page root to avoid clipping by ancestor overflow:hidden
 */
function Popup({
  className,
  children,
  open: openProp,
  defaultOpen,
  onOpenChange,
  position = 'center',
  overlay = true,
  closable = true,
  lockScroll = true,
  overlayClassName,
}: PopupProps) {
  const { isOpen, onClose } = useDisclosure({
    open: openProp,
    defaultOpen,
    onOpenChange,
  })

  const [animState, setAnimState] = useState<AnimationState>(
    isOpen ? 'open' : 'closed'
  )

  // Handle open/close transitions
  useEffect(() => {
    if (isOpen) {
      // Mount and trigger enter animation
      setAnimState('entering')
      const timer = setTimeout(() => setAnimState('open'), 20)
      return () => clearTimeout(timer)
    } else {
      if (animState === 'open' || animState === 'entering') {
        // Trigger exit animation
        setAnimState('exiting')
        const timer = setTimeout(() => setAnimState('closed'), 300)
        return () => clearTimeout(timer)
      }
    }
  }, [isOpen])

  const handleOverlayTap = useCallback(() => {
    if (closable) {
      onClose()
    }
  }, [closable, onClose])

  const handleContentTap = useCallback((e: any) => {
    // Prevent tap from bubbling to overlay
    e.stopPropagation()
  }, [])

  // Don't render anything when fully closed
  if (animState === 'closed') return null

  const isVisible = animState === 'open'

  return (
    <View
      className={cn(
        'fixed inset-0 z-50',
        lockScroll && 'overflow-hidden'
      )}
      catchMove={lockScroll}
    >
      {/* Backdrop */}
      {overlay && (
        <View
          className={cn(
            'absolute inset-0 bg-black/50 transition-opacity duration-300',
            isVisible ? 'opacity-100' : 'opacity-0',
            overlayClassName
          )}
          onTap={handleOverlayTap}
        />
      )}

      {/* Content */}
      <View
        className={cn(
          'absolute z-[1]',
          getPositionClasses(position),
          getTransitionClasses(position, isVisible),
          className
        )}
        onTap={handleContentTap}
      >
        {children}
      </View>
    </View>
  )
}

/** Position classes for the content container */
function getPositionClasses(position: string): string {
  switch (position) {
    case 'center':
      return 'inset-0 flex items-center justify-center'
    case 'bottom':
      return 'left-0 right-0 bottom-0'
    case 'top':
      return 'left-0 right-0 top-0'
    case 'left':
      return 'left-0 top-0 bottom-0'
    case 'right':
      return 'right-0 top-0 bottom-0'
    default:
      return 'inset-0 flex items-center justify-center'
  }
}

/** Transition classes based on position and visibility */
function getTransitionClasses(position: string, isVisible: boolean): string {
  const base = 'transition-all duration-300'

  switch (position) {
    case 'center':
      return cn(
        base,
        isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95'
      )
    case 'bottom':
      return cn(
        base,
        isVisible
          ? 'translate-y-0'
          : 'translate-y-full'
      )
    case 'top':
      return cn(
        base,
        isVisible
          ? 'translate-y-0'
          : '-translate-y-full'
      )
    case 'left':
      return cn(
        base,
        isVisible
          ? 'translate-x-0'
          : '-translate-x-full'
      )
    case 'right':
      return cn(
        base,
        isVisible
          ? 'translate-x-0'
          : 'translate-x-full'
      )
    default:
      return cn(base, isVisible ? 'opacity-100' : 'opacity-0')
  }
}

export { Popup }
