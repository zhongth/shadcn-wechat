import { View, ScrollView } from '@tarojs/components'
import { createContext, useContext } from 'react'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

// --- Context ---

type TabsContextValue = {
  value: string | undefined
  onValueChange: (value: string) => void
}

const TabsContext = createContext<TabsContextValue>({
  value: undefined,
  onValueChange: () => {},
})

// --- Tabs ---

export interface TabsProps {
  className?: string
  children?: React.ReactNode
  /** Controlled active tab value */
  value?: string
  /** Default active tab for uncontrolled mode */
  defaultValue?: string
  /** Called when active tab changes */
  onValueChange?: (value: string) => void
}

/**
 * Tabs component for switching between content panels.
 *
 * Usage:
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
function Tabs({
  className,
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  ...props
}: TabsProps) {
  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  })

  return (
    <TabsContext.Provider value={{ value, onValueChange: setValue }}>
      <View className={cn(className)} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  )
}

// --- TabsList ---

export interface TabsListProps {
  className?: string
  children?: React.ReactNode
}

function TabsList({ className, children, ...props }: TabsListProps) {
  return (
    <ScrollView
      scrollX
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-muted p-1',
        className
      )}
      {...props}
    >
      <View className="flex flex-row">
        {children}
      </View>
    </ScrollView>
  )
}

// --- TabsTrigger ---

export interface TabsTriggerProps {
  className?: string
  children?: React.ReactNode
  /** Tab value this trigger activates */
  value: string
  /** Disable this tab trigger */
  disabled?: boolean
}

function TabsTrigger({
  className,
  children,
  value,
  disabled = false,
  ...props
}: TabsTriggerProps) {
  const context = useContext(TabsContext)
  const isActive = context.value === value

  const handleTap = () => {
    if (disabled) return
    context.onValueChange(value)
  }

  return (
    <View
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap',
        'rounded-sm px-3 py-1.5 text-sm font-medium',
        'transition-colors shrink-0',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground',
        disabled && 'opacity-50',
        className
      )}
      onTap={handleTap}
      {...props}
    >
      {children}
    </View>
  )
}

// --- TabsContent ---

export interface TabsContentProps {
  className?: string
  children?: React.ReactNode
  /** Tab value this content belongs to */
  value: string
}

function TabsContent({
  className,
  children,
  value,
  ...props
}: TabsContentProps) {
  const context = useContext(TabsContext)

  if (context.value !== value) return null

  return (
    <View className={cn('mt-2', className)} {...props}>
      {children}
    </View>
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent }
