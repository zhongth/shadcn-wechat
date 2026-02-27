import { View, Text } from '@tarojs/components'
import { useMemo } from 'react'
import Taro from '@tarojs/taro'
import { cn } from '@/lib/utils'

export interface NavigationBarProps {
  className?: string
  /** Page title */
  title?: string
  /** Show back button */
  showBack?: boolean
  /** Custom back handler (default: Taro.navigateBack) */
  onBack?: () => void
  /** Custom left slot (replaces back button) */
  left?: React.ReactNode
  /** Custom right slot */
  right?: React.ReactNode
  /** Transparent background (e.g. for hero pages) */
  transparent?: boolean
}

/**
 * Custom NavigationBar replacing the WeChat default.
 * Requires `navigationStyle: 'custom'` in page config.
 *
 * Usage:
 * ```tsx
 * <NavigationBar title="My Page" showBack />
 * ```
 */
function NavigationBar({
  className,
  title,
  showBack = false,
  onBack,
  left,
  right,
  transparent = false,
}: NavigationBarProps) {
  const { statusBarHeight, navHeight } = useMemo(() => {
    try {
      const info = Taro.getSystemInfoSync()
      const sbHeight = info.statusBarHeight || 20
      return {
        statusBarHeight: sbHeight,
        navHeight: sbHeight + 44,
      }
    } catch {
      return { statusBarHeight: 20, navHeight: 64 }
    }
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack().catch(() => {})
    }
  }

  return (
    <View>
      {/* Fixed nav bar */}
      <View
        className={cn(
          'fixed top-0 left-0 right-0 z-40',
          !transparent && 'bg-background border-b border-border',
          className
        )}
        style={{ height: `${navHeight}px` }}
      >
        {/* Status bar spacer */}
        <View style={{ height: `${statusBarHeight}px` }} />

        {/* Nav content - 44px */}
        <View
          className="flex flex-row items-center px-4"
          style={{ height: '44px' }}
        >
          {/* Left */}
          <View className="w-16 flex flex-row items-center">
            {left || (showBack && (
              <View
                className="flex items-center justify-center active:opacity-70"
                onTap={handleBack}
              >
                <Text className="text-lg text-foreground">‹</Text>
              </View>
            ))}
          </View>

          {/* Center - title */}
          <View className="flex-1 flex items-center justify-center">
            {title && (
              <Text className="text-base font-semibold text-foreground truncate">
                {title}
              </Text>
            )}
          </View>

          {/* Right */}
          <View className="w-16 flex flex-row items-center justify-end">
            {right}
          </View>
        </View>
      </View>

      {/* Spacer to push content below fixed nav */}
      <View style={{ height: `${navHeight}px` }} />
    </View>
  )
}

export { NavigationBar }
