import { View } from '@tarojs/components'
import { useRef, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'
import { useId } from '@/hooks/use-id'

export interface SliderProps {
  className?: string
  /** Controlled value */
  value?: number
  /** Default value for uncontrolled mode */
  defaultValue?: number
  /** Called continuously during drag */
  onValueChange?: (value: number) => void
  /** Called when drag ends (committed value) */
  onValueCommit?: (value: number) => void
  /** Minimum value */
  min?: number
  /** Maximum value */
  max?: number
  /** Step increment */
  step?: number
  /** Disable the slider */
  disabled?: boolean
}

/**
 * Slider component for selecting a numeric value within a range.
 * Uses touch events and Taro.createSelectorQuery() for position tracking.
 *
 * Usage:
 * ```tsx
 * <Slider
 *   value={volume}
 *   onValueChange={setVolume}
 *   min={0}
 *   max={100}
 *   step={1}
 * />
 * ```
 */
function Slider({
  className,
  value: valueProp,
  defaultValue = 0,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  ...props
}: SliderProps) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  const trackId = useId()
  const trackRectRef = useRef<{ left: number; width: number } | null>(null)
  const isDraggingRef = useRef(false)

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100))

  const calculateValue = useCallback(
    (clientX: number) => {
      const rect = trackRectRef.current
      if (!rect || rect.width === 0) return value

      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const rawValue = ratio * (max - min) + min
      const stepped = Math.round(rawValue / step) * step
      return Math.max(min, Math.min(max, stepped))
    },
    [value, min, max, step]
  )

  const measureTrack = useCallback(() => {
    return new Promise<void>((resolve) => {
      const query = Taro.createSelectorQuery()
      query
        .select(`#${trackId}`)
        .boundingClientRect((res: any) => {
          if (res) {
            trackRectRef.current = { left: res.left, width: res.width }
          }
          resolve()
        })
        .exec()
    })
  }, [trackId])

  const handleTouchStart = useCallback(
    async (e: any) => {
      if (disabled) return
      isDraggingRef.current = true

      await measureTrack()

      const touch = e.touches[0]
      const newValue = calculateValue(touch.clientX)
      setValue(newValue)
    },
    [disabled, measureTrack, calculateValue, setValue]
  )

  const handleTouchMove = useCallback(
    (e: any) => {
      if (disabled || !isDraggingRef.current) return

      const touch = e.touches[0]
      const newValue = calculateValue(touch.clientX)
      setValue(newValue)
    },
    [disabled, calculateValue, setValue]
  )

  const handleTouchEnd = useCallback(() => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    onValueCommit?.(value)
  }, [value, onValueCommit])

  return (
    <View
      className={cn(
        'relative flex w-full items-center py-2',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {/* Track */}
      <View
        id={trackId}
        className="relative h-2 w-full rounded-full bg-secondary"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Filled portion */}
        <View
          className="absolute h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />

        {/* Thumb */}
        <View
          className={cn(
            'absolute top-1/2 h-5 w-5 rounded-full',
            'border-2 border-primary bg-background shadow',
          )}
          style={{
            left: `${percentage}%`,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </View>
    </View>
  )
}

export { Slider }
