import { View, Text, ScrollView } from '@tarojs/components'
import { Input as TaroInput } from '@tarojs/components'
import { createContext, useContext, useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

// --- Context ---

type CommandContextValue = {
  search: string
  onSearchChange: (value: string) => void
}

const CommandContext = createContext<CommandContextValue>({
  search: '',
  onSearchChange: () => {},
})

// --- Command ---

export interface CommandProps {
  className?: string
  children?: React.ReactNode
  /** Custom filter function */
  filter?: (value: string, search: string) => boolean
}

/**
 * Command/Search component with filterable list.
 *
 * Usage:
 * ```tsx
 * <Command>
 *   <CommandInput placeholder="Search..." />
 *   <CommandList>
 *     <CommandGroup heading="Suggestions">
 *       <CommandItem value="calendar" onSelect={handleSelect}>Calendar</CommandItem>
 *       <CommandItem value="search" onSelect={handleSelect}>Search</CommandItem>
 *     </CommandGroup>
 *     <CommandEmpty>No results found.</CommandEmpty>
 *   </CommandList>
 * </Command>
 * ```
 */
function Command({ className, children, filter }: CommandProps) {
  const [search, setSearch] = useState('')

  return (
    <CommandContext.Provider value={{ search, onSearchChange: setSearch }}>
      <View
        className={cn(
          'flex flex-col overflow-hidden rounded-lg border border-border bg-background',
          className
        )}
      >
        {children}
      </View>
    </CommandContext.Provider>
  )
}

// --- CommandInput ---

export interface CommandInputProps {
  className?: string
  placeholder?: string
  /** Controlled value */
  value?: string
  /** Called on input change */
  onValueChange?: (value: string) => void
}

function CommandInput({
  className,
  placeholder = 'Search...',
  value,
  onValueChange,
}: CommandInputProps) {
  const ctx = useContext(CommandContext)

  return (
    <View className={cn('flex items-center border-b border-border px-3', className)}>
      <Text className="text-muted-foreground mr-2 text-sm">🔍</Text>
      <TaroInput
        className="flex-1 h-10 bg-transparent text-sm text-foreground outline-none placeholder-muted-foreground"
        placeholder={placeholder}
        value={value !== undefined ? value : ctx.search}
        onInput={(e) => {
          const val = e.detail.value
          if (onValueChange) {
            onValueChange(val)
          }
          ctx.onSearchChange(val)
        }}
      />
    </View>
  )
}

// --- CommandList ---

export interface CommandListProps {
  className?: string
  children?: React.ReactNode
}

function CommandList({ className, children }: CommandListProps) {
  return (
    <ScrollView
      scrollY
      className={cn('max-h-[300px]', className)}
      style={{ maxHeight: '300px' }}
    >
      {children}
    </ScrollView>
  )
}

// --- CommandGroup ---

export interface CommandGroupProps {
  className?: string
  children?: React.ReactNode
  /** Group heading */
  heading?: string
}

function CommandGroup({ className, children, heading }: CommandGroupProps) {
  return (
    <View className={cn('overflow-hidden p-1', className)}>
      {heading && (
        <Text className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {heading}
        </Text>
      )}
      {children}
    </View>
  )
}

// --- CommandItem ---

export interface CommandItemProps {
  className?: string
  children?: React.ReactNode
  /** Item value for filtering */
  value: string
  /** Called when item is selected */
  onSelect?: (value: string) => void
  /** Disable this item */
  disabled?: boolean
}

function CommandItem({
  className,
  children,
  value,
  onSelect,
  disabled = false,
}: CommandItemProps) {
  const ctx = useContext(CommandContext)

  // Filter: hide items that don't match search
  const isVisible = useMemo(() => {
    if (!ctx.search) return true
    return value.toLowerCase().includes(ctx.search.toLowerCase())
  }, [ctx.search, value])

  if (!isVisible) return null

  return (
    <View
      className={cn(
        'relative flex flex-row items-center rounded-sm px-2 py-1.5',
        'text-sm active:bg-accent active:text-accent-foreground',
        'transition-colors',
        disabled && 'opacity-50',
        className
      )}
      onTap={() => {
        if (!disabled) onSelect?.(value)
      }}
    >
      {children}
    </View>
  )
}

// --- CommandEmpty ---

export interface CommandEmptyProps {
  className?: string
  children?: React.ReactNode
}

function CommandEmpty({ className, children }: CommandEmptyProps) {
  return (
    <View className={cn('py-6 text-center', className)}>
      <Text className="text-sm text-muted-foreground">
        {children || 'No results found.'}
      </Text>
    </View>
  )
}

// --- CommandSeparator ---

function CommandSeparator({ className }: { className?: string }) {
  return <View className={cn('h-px bg-border mx-1', className)} />
}

export {
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandEmpty,
  CommandSeparator,
}
