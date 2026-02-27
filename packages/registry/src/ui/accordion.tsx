import { View, Text } from '@tarojs/components'
import { createContext, useContext, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

// --- Context ---

type AccordionContextValue = {
  expandedItems: string[]
  toggleItem: (value: string) => void
}

const AccordionContext = createContext<AccordionContextValue>({
  expandedItems: [],
  toggleItem: () => {},
})

type AccordionItemContextValue = {
  value: string
  isExpanded: boolean
}

const AccordionItemContext = createContext<AccordionItemContextValue>({
  value: '',
  isExpanded: false,
})

// --- Accordion ---

export interface AccordionSingleProps {
  type: 'single'
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  /** Allow collapsing all items in single mode */
  collapsible?: boolean
}

export interface AccordionMultipleProps {
  type: 'multiple'
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

export type AccordionProps = (AccordionSingleProps | AccordionMultipleProps) & {
  className?: string
  children?: React.ReactNode
}

/**
 * Accordion component for collapsible content sections.
 *
 * Usage:
 * ```tsx
 * <Accordion type="single" collapsible defaultValue="item-1">
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content 1</AccordionContent>
 *   </AccordionItem>
 *   <AccordionItem value="item-2">
 *     <AccordionTrigger>Section 2</AccordionTrigger>
 *     <AccordionContent>Content 2</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 */
function Accordion(props: AccordionProps) {
  const { className, children, type, ...rest } = props

  if (type === 'single') {
    return (
      <AccordionSingle className={className} {...(rest as Omit<AccordionSingleProps, 'type'>)}>
        {children}
      </AccordionSingle>
    )
  }

  return (
    <AccordionMultiple className={className} {...(rest as Omit<AccordionMultipleProps, 'type'>)}>
      {children}
    </AccordionMultiple>
  )
}

// --- Single mode ---

function AccordionSingle({
  className,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  collapsible = false,
}: Omit<AccordionSingleProps, 'type'> & { className?: string; children?: React.ReactNode }) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? '',
    onChange: onValueChange,
  })

  const toggleItem = useCallback(
    (itemValue: string) => {
      if (value === itemValue) {
        if (collapsible) setValue('')
      } else {
        setValue(itemValue)
      }
    },
    [value, setValue, collapsible]
  )

  const expandedItems = value ? [value] : []

  return (
    <AccordionContext.Provider value={{ expandedItems, toggleItem }}>
      <View className={cn(className)}>{children}</View>
    </AccordionContext.Provider>
  )
}

// --- Multiple mode ---

function AccordionMultiple({
  className,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
}: Omit<AccordionMultipleProps, 'type'> & { className?: string; children?: React.ReactNode }) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue ?? [],
    onChange: onValueChange,
  })

  const toggleItem = useCallback(
    (itemValue: string) => {
      const items = value ?? []
      if (items.includes(itemValue)) {
        setValue(items.filter((v) => v !== itemValue))
      } else {
        setValue([...items, itemValue])
      }
    },
    [value, setValue]
  )

  return (
    <AccordionContext.Provider value={{ expandedItems: value ?? [], toggleItem }}>
      <View className={cn(className)}>{children}</View>
    </AccordionContext.Provider>
  )
}

// --- AccordionItem ---

export interface AccordionItemProps {
  className?: string
  children?: React.ReactNode
  value: string
}

function AccordionItem({ className, children, value, ...props }: AccordionItemProps) {
  const { expandedItems } = useContext(AccordionContext)
  const isExpanded = expandedItems.includes(value)

  return (
    <AccordionItemContext.Provider value={{ value, isExpanded }}>
      <View
        className={cn('border-b border-border', className)}
        {...props}
      >
        {children}
      </View>
    </AccordionItemContext.Provider>
  )
}

// --- AccordionTrigger ---

export interface AccordionTriggerProps {
  className?: string
  children?: React.ReactNode
}

function AccordionTrigger({ className, children, ...props }: AccordionTriggerProps) {
  const { value, isExpanded } = useContext(AccordionItemContext)
  const { toggleItem } = useContext(AccordionContext)

  return (
    <View
      className={cn(
        'flex flex-row items-center justify-between py-4',
        'transition-all',
        className
      )}
      onTap={() => toggleItem(value)}
      {...props}
    >
      <View className="flex-1">
        {children}
      </View>
      <Text
        className={cn(
          'text-sm text-muted-foreground transition-transform duration-200',
          isExpanded && 'rotate-180'
        )}
      >
        ▾
      </Text>
    </View>
  )
}

// --- AccordionContent ---

export interface AccordionContentProps {
  className?: string
  children?: React.ReactNode
}

function AccordionContent({ className, children, ...props }: AccordionContentProps) {
  const { isExpanded } = useContext(AccordionItemContext)

  return (
    <View
      className={cn(
        'overflow-hidden transition-all duration-300',
      )}
      style={{
        maxHeight: isExpanded ? '500px' : '0px',
        opacity: isExpanded ? 1 : 0,
      }}
    >
      <View className={cn('pb-4 pt-0', className)} {...props}>
        {children}
      </View>
    </View>
  )
}

export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
}
