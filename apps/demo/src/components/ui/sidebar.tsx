import { View, Text } from '@tarojs/components'
import { cn } from '@/lib/utils'
import { Drawer } from './drawer'

// --- Sidebar ---

export interface SidebarProps {
  className?: string
  children?: React.ReactNode
  /** Controlled open state */
  open?: boolean
  /** Called when open state changes */
  onOpenChange?: (open: boolean) => void
}

/**
 * Sidebar navigation using a left-positioned Drawer.
 *
 * Usage:
 * ```tsx
 * <Sidebar open={open} onOpenChange={setOpen}>
 *   <SidebarMenu>
 *     <SidebarGroup label="Navigation">
 *       <SidebarMenuItem icon={<Text>🏠</Text>} active>Home</SidebarMenuItem>
 *       <SidebarMenuItem icon={<Text>📊</Text>}>Dashboard</SidebarMenuItem>
 *     </SidebarGroup>
 *   </SidebarMenu>
 * </Sidebar>
 * ```
 */
function Sidebar({ className, children, open, onOpenChange }: SidebarProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} position="left">
      <View className={cn('h-full py-4', className)}>
        {children}
      </View>
    </Drawer>
  )
}

// --- SidebarMenu ---

export interface SidebarMenuProps {
  className?: string
  children?: React.ReactNode
}

function SidebarMenu({ className, children }: SidebarMenuProps) {
  return (
    <View className={cn('flex flex-col', className)}>
      {children}
    </View>
  )
}

// --- SidebarGroup ---

export interface SidebarGroupProps {
  className?: string
  children?: React.ReactNode
  /** Group label */
  label?: string
}

function SidebarGroup({ className, children, label }: SidebarGroupProps) {
  return (
    <View className={cn('px-2 py-2', className)}>
      {label && (
        <Text className="px-3 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {label}
        </Text>
      )}
      <View className="mt-1 flex flex-col gap-0.5">
        {children}
      </View>
    </View>
  )
}

// --- SidebarMenuItem ---

export interface SidebarMenuItemProps {
  className?: string
  children?: React.ReactNode
  /** Icon element */
  icon?: React.ReactNode
  /** Active state */
  active?: boolean
  /** Tap handler */
  onTap?: () => void
  /** Badge on the right */
  badge?: React.ReactNode
}

function SidebarMenuItem({
  className,
  children,
  icon,
  active = false,
  onTap,
  badge,
}: SidebarMenuItemProps) {
  return (
    <View
      className={cn(
        'flex flex-row items-center gap-3 rounded-md px-3 py-2',
        'transition-colors active:bg-accent',
        active && 'bg-accent text-accent-foreground font-medium',
        !active && 'text-muted-foreground',
        className
      )}
      onTap={onTap}
    >
      {icon && <View className="shrink-0">{icon}</View>}
      <Text className="flex-1 text-sm truncate">{children}</Text>
      {badge && <View className="shrink-0">{badge}</View>}
    </View>
  )
}

export { Sidebar, SidebarMenu, SidebarGroup, SidebarMenuItem }
