import { View, Text } from '@tarojs/components'
import { useMemo } from 'react'
import Taro from '@tarojs/taro'
import { cn } from '@/lib/utils'

export interface TabBarItem {
  /** Unique key */
  key: string
  /** Display label */
  label: string
  /** Icon element (inactive state) */
  icon?: React.ReactNode
  /** Icon element (active state) */
  activeIcon?: React.ReactNode
  /** Badge count */
  badge?: number | string
  /** Show red dot indicator */
  dot?: boolean
}

export interface TabBarProps {
  className?: string
  /** Tab items */
  items: TabBarItem[]
  /** Currently active tab key */
  activeKey?: string
  /** Called when a tab is tapped */
  onTabChange?: (key: string) => void
}

/**
 * Custom TabBar for bottom navigation.
 * Must be used with `custom` tabBar config in app.config.ts.
 *
 * Usage:
 * ```tsx
 * <TabBar
 *   items={[
 *     { key: 'home', label: 'Home', icon: <Text>🏠</Text> },
 *     { key: 'profile', label: 'Profile', icon: <Text>👤</Text> },
 *   ]}
 *   activeKey="home"
 *   onTabChange={(key) => Taro.switchTab({ url: `/pages/${key}/index` })}
 * />
 * ```
 */
function TabBar({
  className,
  items,
  activeKey,
  onTabChange,
}: TabBarProps) {
  const bottomInset = useMemo(() => {
    try {
      const info = Taro.getSystemInfoSync()
      const safeArea = info.safeArea
      if (!safeArea) return 0
      return info.screenHeight - safeArea.bottom
    } catch {
      return 0
    }
  }, [])

  return (
    <View
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'bg-background border-t border-border',
        className
      )}
      style={{ paddingBottom: `${bottomInset}px` }}
    >
      <View className="flex flex-row h-12">
        {items.map((item) => {
          const isActive = activeKey === item.key
          return (
            <View
              key={item.key}
              className={cn(
                'flex-1 flex flex-col items-center justify-center',
                'active:opacity-70 transition-colors'
              )}
              onTap={() => onTabChange?.(item.key)}
            >
              {/* Icon with badge/dot */}
              <View className="relative">
                {isActive ? (item.activeIcon || item.icon) : item.icon}

                {/* Badge */}
                {item.badge !== undefined && (
                  <View
                    className={cn(
                      'absolute -top-1 -right-2',
                      'bg-destructive rounded-full min-w-[16px] h-4',
                      'flex items-center justify-center px-1'
                    )}
                  >
                    <Text className="text-[10px] text-destructive-foreground leading-none">
                      {item.badge}
                    </Text>
                  </View>
                )}

                {/* Dot */}
                {item.dot && !item.badge && (
                  <View className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-destructive rounded-full" />
                )}
              </View>

              {/* Label */}
              <Text
                className={cn(
                  'text-[10px] mt-0.5',
                  isActive ? 'text-primary font-medium' : 'text-muted-foreground'
                )}
              >
                {item.label}
              </Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

export { TabBar }
