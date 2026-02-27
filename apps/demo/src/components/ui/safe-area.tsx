import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export interface SafeAreaProps {
  className?: string
  children?: React.ReactNode
  /** Which safe area insets to apply */
  position?: 'top' | 'bottom' | 'both'
}

/**
 * SafeArea component that adds padding for device safe area insets.
 * Essential for bottom-fixed elements (TabBar, ActionSheet) and custom NavigationBar.
 */
function SafeArea({ className, children, position = 'bottom' }: SafeAreaProps) {
  const insets = useMemo(() => {
    try {
      const systemInfo = Taro.getSystemInfoSync()
      const safeArea = systemInfo.safeArea
      if (!safeArea) return { top: 0, bottom: 0 }

      return {
        top: safeArea.top,
        bottom: systemInfo.screenHeight - safeArea.bottom,
      }
    } catch {
      return { top: 0, bottom: 0 }
    }
  }, [])

  const style: React.CSSProperties = {}
  if (position === 'top' || position === 'both') {
    style.paddingTop = `${insets.top}px`
  }
  if (position === 'bottom' || position === 'both') {
    style.paddingBottom = `${insets.bottom}px`
  }

  return (
    <View className={cn(className)} style={style}>
      {children}
    </View>
  )
}

export { SafeArea }
