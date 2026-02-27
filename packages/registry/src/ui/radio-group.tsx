import { View } from '@tarojs/components'
import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

// --- Context ---

type RadioGroupContextValue = {
  value: string | undefined
  onValueChange: (value: string) => void
}

const RadioGroupContext = createContext<RadioGroupContextValue>({
  value: undefined,
  onValueChange: () => {},
})

// --- RadioGroup ---

export interface RadioGroupProps {
  className?: string
  children?: React.ReactNode
  /** Controlled value */
  value?: string
  /** Default value for uncontrolled mode */
  defaultValue?: string
  /** Called when value changes */
  onValueChange?: (value: string) => void
  /** Disable the entire group */
  disabled?: boolean
}

/**
 * RadioGroup manages a group of mutually exclusive radio items.
 *
 * Usage:
 * ```tsx
 * <RadioGroup value={value} onValueChange={setValue}>
 *   <RadioGroupItem value="a" />
 *   <RadioGroupItem value="b" />
 *   <RadioGroupItem value="c" />
 * </RadioGroup>
 * ```
 */
function RadioGroup({
  className,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  ...props
}: RadioGroupProps) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  return (
    <RadioGroupContext.Provider value={{ value, onValueChange: setValue }}>
      <View
        className={cn('flex flex-col gap-2', disabled && 'opacity-50', className)}
        {...props}
      >
        {children}
      </View>
    </RadioGroupContext.Provider>
  )
}

// --- RadioGroupItem ---

export interface RadioGroupItemProps {
  className?: string
  /** Value for this radio item */
  value: string
  /** Disable this item */
  disabled?: boolean
}

function RadioGroupItem({
  className,
  value,
  disabled = false,
  ...props
}: RadioGroupItemProps) {
  const context = useContext(RadioGroupContext)
  const isSelected = context.value === value

  const handleTap = () => {
    if (disabled) return
    context.onValueChange(value)
  }

  return (
    <View
      className={cn(
        'h-4 w-4 rounded-full border border-primary',
        'flex items-center justify-center',
        'transition-colors',
        disabled && 'opacity-50',
        className
      )}
      onTap={handleTap}
      {...props}
    >
      {isSelected && (
        <View className="h-2.5 w-2.5 rounded-full bg-primary" />
      )}
    </View>
  )
}

export { RadioGroup, RadioGroupItem }
