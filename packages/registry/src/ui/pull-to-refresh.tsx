import { ScrollView } from '@tarojs/components'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface PullToRefreshProps {
  className?: string
  children?: React.ReactNode
  /** Async refresh handler */
  onRefresh: () => Promise<void>
  /** Controlled refreshing state */
  refreshing?: boolean
  /** Pull distance to trigger refresh (default 45) */
  refresherThreshold?: number
  /** ScrollView height (required) */
  height?: number | string
}

/**
 * PullToRefresh wraps ScrollView with native pull-to-refresh.
 * Uses WeChat's built-in refresher mechanism.
 *
 * Usage:
 * ```tsx
 * <PullToRefresh onRefresh={handleRefresh} height="100vh">
 *   {items.map(item => <ItemCard key={item.id} {...item} />)}
 * </PullToRefresh>
 * ```
 */
function PullToRefresh({
  className,
  children,
  onRefresh,
  refreshing,
  refresherThreshold = 45,
  height = '100vh',
}: PullToRefreshProps) {
  const [internalRefreshing, setInternalRefreshing] = useState(false)
  const isRefreshing = refreshing !== undefined ? refreshing : internalRefreshing

  const handleRefresh = useCallback(async () => {
    if (refreshing === undefined) {
      setInternalRefreshing(true)
    }
    try {
      await onRefresh()
    } finally {
      if (refreshing === undefined) {
        setInternalRefreshing(false)
      }
    }
  }, [onRefresh, refreshing])

  return (
    <ScrollView
      scrollY
      className={cn(className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      refresherEnabled
      refresherTriggered={isRefreshing}
      refresherThreshold={refresherThreshold}
      onRefresherRefresh={handleRefresh}
    >
      {children}
    </ScrollView>
  )
}

export { PullToRefresh }
