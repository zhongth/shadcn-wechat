import { View, Text } from '@tarojs/components'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Calendar, type CalendarProps } from './calendar'
import { Popup } from './popup'

export interface DatePickerProps {
  className?: string
  /** Selected date */
  value?: Date
  /** Default date for uncontrolled mode */
  defaultValue?: Date
  /** Called when date changes */
  onValueChange?: (date: Date) => void
  /** Placeholder text */
  placeholder?: string
  /** Date display formatter */
  format?: (date: Date) => string
  /** Pass-through Calendar props */
  calendarProps?: Partial<CalendarProps>
  /** Disable the picker */
  disabled?: boolean
}

function defaultFormat(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/**
 * DatePicker combines a trigger button with a Calendar popup.
 *
 * Usage:
 * ```tsx
 * const [date, setDate] = useState<Date>()
 * <DatePicker
 *   value={date}
 *   onValueChange={setDate}
 *   placeholder="Pick a date"
 * />
 * ```
 */
function DatePicker({
  className,
  value,
  defaultValue,
  onValueChange,
  placeholder = 'Pick a date',
  format = defaultFormat,
  calendarProps,
  disabled = false,
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<Date | undefined>(defaultValue)
  const selectedDate = value !== undefined ? value : internalValue

  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = useCallback(
    (date: Date | Date[] | { from: Date; to?: Date }) => {
      const d = date as Date
      if (value === undefined) {
        setInternalValue(d)
      }
      onValueChange?.(d)
      setIsOpen(false)
    },
    [value, onValueChange]
  )

  return (
    <View className={cn(className)}>
      {/* Trigger */}
      <View
        className={cn(
          'flex flex-row h-10 w-full items-center',
          'rounded-md border border-input bg-background px-3 py-2',
          'text-sm',
          disabled && 'opacity-50',
        )}
        onTap={() => {
          if (!disabled) setIsOpen(true)
        }}
      >
        <Text
          className={cn(
            'flex-1',
            selectedDate ? 'text-foreground' : 'text-muted-foreground'
          )}
        >
          {selectedDate ? format(selectedDate) : placeholder}
        </Text>
        <Text className="text-muted-foreground text-xs">📅</Text>
      </View>

      {/* Calendar popup */}
      <Popup
        open={isOpen}
        onOpenChange={setIsOpen}
        position="bottom"
      >
        <View className="bg-background rounded-t-xl">
          {/* Handle */}
          <View className="flex items-center justify-center pt-3 pb-1">
            <View className="h-1 w-10 rounded-full bg-muted" />
          </View>

          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            {...calendarProps}
          />

          {/* Bottom safe area */}
          <View style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
        </View>
      </Popup>
    </View>
  )
}

export { DatePicker }
