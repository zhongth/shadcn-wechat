import { View, Text } from '@tarojs/components'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

export interface CheckboxProps {
  className?: string
  /** Controlled checked state */
  checked?: boolean
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Disable the checkbox */
  disabled?: boolean
}

/**
 * Checkbox component with custom styling.
 * Supports both controlled and uncontrolled patterns.
 *
 * Usage:
 * ```tsx
 * <Checkbox checked={checked} onCheckedChange={setChecked} />
 * <Checkbox defaultChecked />
 * ```
 */
function Checkbox({
  className,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  ...props
}: CheckboxProps) {
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  })

  const handleTap = () => {
    if (disabled) return
    setChecked(!checked)
  }

  return (
    <View
      className={cn(
        'h-4 w-4 shrink-0 rounded-sm border border-primary transition-colors',
        'flex items-center justify-center',
        checked && 'bg-primary text-primary-foreground',
        disabled && 'opacity-50',
        className
      )}
      onTap={handleTap}
      {...props}
    >
      {checked && (
        <Text className="text-xs leading-none text-primary-foreground">
          ✓
        </Text>
      )}
    </View>
  )
}

export { Checkbox }
