import { View, Text } from '@tarojs/components'
import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'
import { useTimeout } from '@/hooks/use-timeout'

// --- Types ---

type ToastVariant = 'default' | 'success' | 'error' | 'warning'

interface ToastData {
  id: string
  message: string
  variant: ToastVariant
  duration: number
}

// --- Module-level state for imperative API ---

type ToastListener = (toasts: ToastData[]) => void

let toastListeners: ToastListener[] = []
let toastQueue: ToastData[] = []
let toastIdCounter = 0

function notifyListeners() {
  toastListeners.forEach((listener) => listener([...toastQueue]))
}

function addToast(message: string, variant: ToastVariant = 'default', duration = 3000) {
  const id = `toast-${++toastIdCounter}`
  toastQueue = [...toastQueue, { id, message, variant, duration }]
  notifyListeners()
  return id
}

function removeToast(id: string) {
  toastQueue = toastQueue.filter((t) => t.id !== id)
  notifyListeners()
}

// --- Imperative API ---

/**
 * Imperative toast API.
 *
 * Usage:
 * ```tsx
 * toast('Hello world')
 * toast.success('Saved!')
 * toast.error('Something went wrong')
 * toast.warning('Be careful')
 * ```
 */
function toast(message: string, duration?: number) {
  return addToast(message, 'default', duration)
}

toast.success = (message: string, duration?: number) =>
  addToast(message, 'success', duration)

toast.error = (message: string, duration?: number) =>
  addToast(message, 'error', duration)

toast.warning = (message: string, duration?: number) =>
  addToast(message, 'warning', duration)

toast.dismiss = (id: string) => removeToast(id)

// --- Toast Item ---

interface ToastItemProps {
  data: ToastData
  onDismiss: (id: string) => void
}

function ToastItem({ data, onDismiss }: ToastItemProps) {
  const [visible, setVisible] = useState(false)

  // Enter animation
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 20)
    return () => clearTimeout(timer)
  }, [])

  // Auto-dismiss
  useTimeout(() => {
    setVisible(false)
    // Remove after exit animation
    setTimeout(() => onDismiss(data.id), 300)
  }, data.duration)

  return (
    <View
      className={cn(
        'mb-2 px-4 py-3 rounded-lg shadow-lg transition-all duration-300',
        visible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-2',
        getVariantClasses(data.variant)
      )}
      onTap={() => {
        setVisible(false)
        setTimeout(() => onDismiss(data.id), 300)
      }}
    >
      <View className="flex flex-row items-center">
        {/* Variant icon */}
        <Text className="mr-2">{getVariantIcon(data.variant)}</Text>
        <Text className="text-sm font-medium flex-1">{data.message}</Text>
      </View>
    </View>
  )
}

function getVariantClasses(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return 'bg-primary text-primary-foreground'
    case 'error':
      return 'bg-destructive text-destructive-foreground'
    case 'warning':
      return 'bg-accent text-accent-foreground border border-border'
    default:
      return 'bg-background text-foreground border border-border'
  }
}

function getVariantIcon(variant: ToastVariant): string {
  switch (variant) {
    case 'success':
      return '✓'
    case 'error':
      return '✕'
    case 'warning':
      return '!'
    default:
      return 'ℹ'
  }
}

// --- Toaster Component ---

export interface ToasterProps {
  className?: string
  /** Position of toast container */
  position?: 'top' | 'bottom'
}

/**
 * Toaster component renders active toasts.
 * Place once at the root of your page.
 *
 * Usage:
 * ```tsx
 * // In your page:
 * <View>
 *   {/* page content *\/}
 *   <Toaster />
 * </View>
 *
 * // Anywhere in your code:
 * import { toast } from '@/components/ui/toast'
 * toast('Hello!')
 * toast.success('Saved')
 * ```
 */
function Toaster({ className, position = 'top' }: ToasterProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  useEffect(() => {
    const listener: ToastListener = (newToasts) => {
      setToasts(newToasts)
    }
    toastListeners.push(listener)
    return () => {
      toastListeners = toastListeners.filter((l) => l !== listener)
    }
  }, [])

  const handleDismiss = useCallback((id: string) => {
    removeToast(id)
  }, [])

  if (toasts.length === 0) return null

  return (
    <View
      className={cn(
        'fixed left-0 right-0 z-[60] px-4',
        position === 'top' ? 'top-0 pt-safe' : 'bottom-0 pb-safe',
        className
      )}
      style={position === 'top' ? { paddingTop: '48px' } : { paddingBottom: '48px' }}
      catchMove
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} data={t} onDismiss={handleDismiss} />
      ))}
    </View>
  )
}

export { Toaster, toast }
