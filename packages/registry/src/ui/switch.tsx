import { View } from '@tarojs/components'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

export interface SwitchProps {
  className?: string
  /** Controlled checked state */
  checked?: boolean
  /** Default checked state for uncontrolled mode */
  defaultChecked?: boolean
  /** Called when checked state changes */
  onCheckedChange?: (checked: boolean) => void
  /** Disable the switch */
  disabled?: boolean
}

/**
 * Switch toggle component with animated thumb.
 *
 * Usage:
 * ```tsx
 * <Switch checked={enabled} onCheckedChange={setEnabled} />
 * <Switch defaultChecked />
 * ```
 */
function Switch({
  className,
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  disabled = false,
  ...props
}: SwitchProps) {
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
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full',
        'border-2 border-transparent transition-colors duration-200',
        checked ? 'bg-primary' : 'bg-input',
        disabled && 'opacity-50',
        className
      )}
      onTap={handleTap}
      {...props}
    >
      <View
        className={cn(
          'h-5 w-5 rounded-full bg-background shadow-lg ring-0',
          'transition-transform duration-200'
        )}
        style={{
          transform: checked ? 'translateX(20px)' : 'translateX(0px)',
        }}
      />
    </View>
  )
}

export { Switch }
