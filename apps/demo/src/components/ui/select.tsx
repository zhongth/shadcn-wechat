import { View, Text, ScrollView } from '@tarojs/components'
import { createContext, useContext, useCallback, useState } from 'react'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'
import { Popup } from './popup'

// --- Context ---

type SelectContextValue = {
  value: string | undefined
  onValueChange: (value: string) => void
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

const SelectContext = createContext<SelectContextValue>({
  value: undefined,
  onValueChange: () => {},
  isOpen: false,
  onOpen: () => {},
  onClose: () => {},
})

// --- Select ---

export interface SelectProps {
  className?: string
  children?: React.ReactNode
  /** Controlled value */
  value?: string
  /** Default value for uncontrolled mode */
  defaultValue?: string
  /** Called when value changes */
  onValueChange?: (value: string) => void
  /** Disable the select */
  disabled?: boolean
}

/**
 * Select component with Popup-based dropdown.
 *
 * Usage:
 * ```tsx
 * <Select value={value} onValueChange={setValue}>
 *   <SelectTrigger placeholder="Select an option" />
 *   <SelectContent>
 *     <SelectItem value="a">Option A</SelectItem>
 *     <SelectItem value="b">Option B</SelectItem>
 *     <SelectItem value="c">Option C</SelectItem>
 *   </SelectContent>
 * </Select>
 * ```
 */
function Select({
  className,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  ...props
}: SelectProps) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  const [isOpen, setIsOpen] = useState(false)

  const onOpen = useCallback(() => {
    if (!disabled) setIsOpen(true)
  }, [disabled])

  const onClose = useCallback(() => {
    setIsOpen(false)
  }, [])

  const handleValueChange = useCallback(
    (newValue: string) => {
      setValue(newValue)
      onClose()
    },
    [setValue, onClose]
  )

  return (
    <SelectContext.Provider
      value={{
        value,
        onValueChange: handleValueChange,
        isOpen,
        onOpen,
        onClose,
      }}
    >
      <View className={cn(className)} {...props}>
        {children}
      </View>
    </SelectContext.Provider>
  )
}

// --- SelectTrigger ---

export interface SelectTriggerProps {
  className?: string
  children?: React.ReactNode
  /** Placeholder text when no value is selected */
  placeholder?: string
}

function SelectTrigger({
  className,
  children,
  placeholder = 'Select...',
  ...props
}: SelectTriggerProps) {
  const { value, onOpen } = useContext(SelectContext)

  return (
    <View
      className={cn(
        'flex flex-row h-10 w-full items-center justify-between',
        'rounded-md border border-input bg-background px-3 py-2',
        'text-sm',
        className
      )}
      onTap={onOpen}
      {...props}
    >
      <Text className={cn(value ? 'text-foreground' : 'text-muted-foreground')}>
        {children || value || placeholder}
      </Text>
      <Text className="text-muted-foreground text-xs ml-2">▾</Text>
    </View>
  )
}

// --- SelectContent ---

export interface SelectContentProps {
  className?: string
  children?: React.ReactNode
}

function SelectContent({ className, children, ...props }: SelectContentProps) {
  const { isOpen, onClose } = useContext(SelectContext)

  return (
    <Popup
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
      position="bottom"
    >
      <View
        className={cn(
          'bg-background rounded-t-xl',
          className
        )}
        {...props}
      >
        {/* Handle indicator */}
        <View className="flex items-center justify-center py-2">
          <View className="h-1 w-10 rounded-full bg-muted" />
        </View>

        {/* Options list */}
        <ScrollView
          scrollY
          className="max-h-[60vh]"
          style={{ maxHeight: '60vh' }}
        >
          {children}
        </ScrollView>

        {/* Bottom safe area padding */}
        <View style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }} />
      </View>
    </Popup>
  )
}

// --- SelectItem ---

export interface SelectItemProps {
  className?: string
  children?: React.ReactNode
  /** Item value */
  value: string
  /** Disable this item */
  disabled?: boolean
}

function SelectItem({
  className,
  children,
  value,
  disabled = false,
  ...props
}: SelectItemProps) {
  const context = useContext(SelectContext)
  const isSelected = context.value === value

  const handleTap = () => {
    if (disabled) return
    context.onValueChange(value)
  }

  return (
    <View
      className={cn(
        'flex flex-row items-center justify-between px-4 py-3',
        'active:bg-accent transition-colors',
        isSelected && 'bg-accent',
        disabled && 'opacity-50',
        className
      )}
      onTap={handleTap}
      {...props}
    >
      <Text className="text-sm text-foreground">{children}</Text>
      {isSelected && (
        <Text className="text-sm text-primary">✓</Text>
      )}
    </View>
  )
}

export { Select, SelectTrigger, SelectContent, SelectItem }
