import { View, Text, ScrollView } from '@tarojs/components'
import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface InfiniteScrollProps {
  className?: string
  children?: React.ReactNode
  /** Async function to load more data */
  onLoadMore: () => Promise<void>
  /** Whether more data is available */
  hasMore: boolean
  /** Distance from bottom to trigger load (default 100) */
  threshold?: number
  /** Custom loading indicator */
  loadingComponent?: React.ReactNode
  /** Custom end-of-list indicator */
  endComponent?: React.ReactNode
  /** ScrollView height (required) */
  height?: number | string
}

/**
 * InfiniteScroll wraps ScrollView with load-more behavior.
 * Triggers onLoadMore when user scrolls near the bottom.
 *
 * Usage:
 * ```tsx
 * <InfiniteScroll
 *   onLoadMore={fetchNextPage}
 *   hasMore={hasNextPage}
 *   height="100vh"
 * >
 *   {items.map(item => <ItemCard key={item.id} {...item} />)}
 * </InfiniteScroll>
 * ```
 */
function InfiniteScroll({
  className,
  children,
  onLoadMore,
  hasMore,
  threshold = 100,
  loadingComponent,
  endComponent,
  height = '100vh',
}: InfiniteScrollProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleScrollToLower = useCallback(async () => {
    if (isLoading || !hasMore) return
    setIsLoading(true)
    try {
      await onLoadMore()
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, onLoadMore])

  return (
    <ScrollView
      scrollY
      className={cn(className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      lowerThreshold={threshold}
      onScrollToLower={handleScrollToLower}
    >
      {children}

      {/* Loading indicator */}
      {isLoading && (
        loadingComponent || (
          <View className="flex items-center justify-center py-4">
            <View className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            <Text className="text-sm text-muted-foreground ml-2">Loading...</Text>
          </View>
        )
      )}

      {/* End of list */}
      {!hasMore && !isLoading && (
        endComponent || (
          <View className="flex items-center justify-center py-4">
            <Text className="text-sm text-muted-foreground">No more data</Text>
          </View>
        )
      )}
    </ScrollView>
  )
}

export { InfiniteScroll }
