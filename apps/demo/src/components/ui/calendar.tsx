import { View, Text } from '@tarojs/components'
import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'

// --- Date utilities (no external library) ---

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number, weekStartsOn: 0 | 1 = 0): number {
  const day = new Date(year, month, 1).getDay()
  return weekStartsOn === 1 ? (day === 0 ? 6 : day - 1) : day
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

function isInRange(date: Date, from: Date, to: Date): boolean {
  const t = date.getTime()
  return t >= from.getTime() && t <= to.getTime()
}

function isToday(date: Date): boolean {
  return isSameDay(date, new Date())
}

const WEEK_DAYS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const WEEK_DAYS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']

// --- Types ---

export interface CalendarProps {
  className?: string
  /** Selection mode */
  mode?: 'single' | 'range' | 'multiple'
  /** Selected date(s) */
  selected?: Date | Date[] | { from: Date; to?: Date }
  /** Called when selection changes */
  onSelect?: (value: Date | Date[] | { from: Date; to?: Date }) => void
  /** Controlled displayed month */
  month?: Date
  /** Called when displayed month changes */
  onMonthChange?: (month: Date) => void
  /** Minimum selectable date */
  minDate?: Date
  /** Maximum selectable date */
  maxDate?: Date
  /** Custom disabled check */
  disabled?: (date: Date) => boolean
  /** Week starts on (0=Sunday, 1=Monday) */
  weekStartsOn?: 0 | 1
}

/**
 * Calendar component with month-view grid.
 * Supports single, range, and multiple date selection.
 *
 * Usage:
 * ```tsx
 * const [date, setDate] = useState<Date>()
 * <Calendar mode="single" selected={date} onSelect={setDate} />
 * ```
 */
function Calendar({
  className,
  mode = 'single',
  selected,
  onSelect,
  month: monthProp,
  onMonthChange,
  minDate,
  maxDate,
  disabled,
  weekStartsOn = 0,
}: CalendarProps) {
  const [internalMonth, setInternalMonth] = useState(
    () => monthProp || (selected instanceof Date ? selected : new Date())
  )

  const displayMonth = monthProp || internalMonth
  const year = displayMonth.getFullYear()
  const month = displayMonth.getMonth()

  const weekDays = weekStartsOn === 1 ? WEEK_DAYS_MON : WEEK_DAYS_SUN

  const changeMonth = useCallback(
    (delta: number) => {
      const newMonth = new Date(year, month + delta, 1)
      if (monthProp === undefined) {
        setInternalMonth(newMonth)
      }
      onMonthChange?.(newMonth)
    },
    [year, month, monthProp, onMonthChange]
  )

  // Build calendar grid
  const days = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month)
    const firstDay = getFirstDayOfWeek(year, month, weekStartsOn)
    const cells: Array<{ date: Date; isCurrentMonth: boolean } | null> = []

    // Leading empty cells
    for (let i = 0; i < firstDay; i++) {
      cells.push(null)
    }

    // Days of month
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ date: new Date(year, month, d), isCurrentMonth: true })
    }

    return cells
  }, [year, month, weekStartsOn])

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (disabled?.(date)) return true
      if (minDate && date.getTime() < minDate.getTime()) return true
      if (maxDate && date.getTime() > maxDate.getTime()) return true
      return false
    },
    [disabled, minDate, maxDate]
  )

  const isDateSelected = useCallback(
    (date: Date): boolean => {
      if (!selected) return false
      if (mode === 'single' && selected instanceof Date) {
        return isSameDay(date, selected)
      }
      if (mode === 'multiple' && Array.isArray(selected)) {
        return selected.some((d) => isSameDay(date, d))
      }
      if (mode === 'range' && typeof selected === 'object' && 'from' in selected) {
        const range = selected as { from: Date; to?: Date }
        if (!range.to) return isSameDay(date, range.from)
        return isInRange(date, range.from, range.to)
      }
      return false
    },
    [selected, mode]
  )

  const isRangeStart = useCallback(
    (date: Date): boolean => {
      if (mode !== 'range' || !selected || !('from' in (selected as any))) return false
      return isSameDay(date, (selected as { from: Date }).from)
    },
    [selected, mode]
  )

  const isRangeEnd = useCallback(
    (date: Date): boolean => {
      if (mode !== 'range' || !selected || !('to' in (selected as any))) return false
      const to = (selected as { from: Date; to?: Date }).to
      return to ? isSameDay(date, to) : false
    },
    [selected, mode]
  )

  const handleDayTap = useCallback(
    (date: Date) => {
      if (isDateDisabled(date)) return

      if (mode === 'single') {
        onSelect?.(date)
      } else if (mode === 'multiple') {
        const current = (Array.isArray(selected) ? selected : []) as Date[]
        const exists = current.findIndex((d) => isSameDay(d, date))
        if (exists >= 0) {
          onSelect?.(current.filter((_, i) => i !== exists))
        } else {
          onSelect?.([...current, date])
        }
      } else if (mode === 'range') {
        const range = selected as { from: Date; to?: Date } | undefined
        if (!range || range.to || !range.from) {
          // Start new range
          onSelect?.({ from: date })
        } else {
          // Complete range
          if (date.getTime() < range.from.getTime()) {
            onSelect?.({ from: date, to: range.from })
          } else {
            onSelect?.({ from: range.from, to: date })
          }
        }
      }
    },
    [mode, selected, onSelect, isDateDisabled]
  )

  const monthLabel = `${year}-${String(month + 1).padStart(2, '0')}`

  return (
    <View className={cn('p-3', className)}>
      {/* Header: nav + month label */}
      <View className="flex flex-row items-center justify-between mb-4">
        <View
          className="h-7 w-7 flex items-center justify-center rounded-md active:bg-accent"
          onTap={() => changeMonth(-1)}
        >
          <Text className="text-sm text-muted-foreground">‹</Text>
        </View>
        <Text className="text-sm font-medium">{monthLabel}</Text>
        <View
          className="h-7 w-7 flex items-center justify-center rounded-md active:bg-accent"
          onTap={() => changeMonth(1)}
        >
          <Text className="text-sm text-muted-foreground">›</Text>
        </View>
      </View>

      {/* Weekday header */}
      <View className="grid grid-cols-7 gap-1 mb-1">
        {weekDays.map((day) => (
          <View key={day} className="flex items-center justify-center h-8">
            <Text className="text-xs text-muted-foreground font-medium">{day}</Text>
          </View>
        ))}
      </View>

      {/* Day grid */}
      <View className="grid grid-cols-7 gap-1">
        {days.map((cell, i) => {
          if (!cell) {
            return <View key={`empty-${i}`} className="h-9" />
          }

          const { date } = cell
          const isDisabled = isDateDisabled(date)
          const isSelected = isDateSelected(date)
          const isTodayDate = isToday(date)
          const isStart = isRangeStart(date)
          const isEnd = isRangeEnd(date)

          return (
            <View
              key={date.getDate()}
              className={cn(
                'h-9 flex items-center justify-center rounded-md',
                'text-sm transition-colors',
                isSelected && 'bg-primary text-primary-foreground',
                !isSelected && isTodayDate && 'border border-primary',
                !isSelected && !isDisabled && 'active:bg-accent',
                isDisabled && 'opacity-30',
                // Range styling
                isStart && 'rounded-r-none',
                isEnd && 'rounded-l-none',
                isSelected && !isStart && !isEnd && mode === 'range' && 'rounded-none bg-accent text-accent-foreground',
              )}
              onTap={() => handleDayTap(date)}
            >
              <Text
                className={cn(
                  'text-sm',
                  isSelected && 'text-primary-foreground font-medium',
                )}
              >
                {date.getDate()}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export { Calendar }
