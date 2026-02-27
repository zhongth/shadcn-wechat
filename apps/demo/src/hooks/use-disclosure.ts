import { useCallback } from 'react'
import { useControllableState } from './use-controllable-state'

type UseDisclosureProps = {
  /** Controlled open state */
  open?: boolean
  /** Default open state for uncontrolled mode */
  defaultOpen?: boolean
  /** Callback when open state changes */
  onOpenChange?: (open: boolean) => void
}

/**
 * Manages open/close boolean state for overlays, accordions, etc.
 * Supports both controlled and uncontrolled patterns.
 */
function useDisclosure({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: UseDisclosureProps = {}) {
  const [isOpen, setIsOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  const onOpen = useCallback(() => {
    setIsOpen(true)
  }, [setIsOpen])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  const onToggle = useCallback(() => {
    setIsOpen((prev) => !prev)
  }, [setIsOpen])

  return {
    isOpen: !!isOpen,
    onOpen,
    onClose,
    onToggle,
    setIsOpen,
  }
}

export { useDisclosure }
export type { UseDisclosureProps }
