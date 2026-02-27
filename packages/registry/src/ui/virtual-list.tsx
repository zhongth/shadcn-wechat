import { View, ScrollView } from '@tarojs/components'
import { useState, useMemo, useCallback } from 'react'
import { cn } from '@/lib/utils'

export interface VirtualListProps<T> {
  className?: string
  /** Data array */
  data: T[]
  /** Fixed height per item in px */
  itemHeight: number
  /** Render function for each item */
  renderItem: (item: T, index: number) => React.ReactNode
  /** Extra items to render above/below viewport (default 5) */
  overscan?: number
  /** Called when scrolled near end */
  onEndReached?: () => void
  /** Distance from end to trigger onEndReached */
  endReachedThreshold?: number
  /** Container height (required) */
  height: number | string
  /** Key extractor */
  keyExtractor?: (item: T, index: number) => string
}

/**
 * VirtualList renders only visible items for large lists.
 * Uses windowed rendering based on scroll position.
 *
 * Usage:
 * ```tsx
 * <VirtualList
 *   data={items}
 *   itemHeight={60}
 *   height={500}
 *   renderItem={(item, index) => (
 *     <View className="h-[60px] p-3 border-b border-border">
 *       <Text>{item.title}</Text>
 *     </View>
 *   )}
 * />
 * ```
 */
function VirtualList<T>({
  className,
  data,
  itemHeight,
  renderItem,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 200,
  height,
  keyExtractor,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0)

  const containerHeight = typeof height === 'number' ? height : 500
  const totalHeight = data.length * itemHeight

  const { startIndex, endIndex, visibleItems } = useMemo(() => {
    const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
    const visibleCount = Math.ceil(containerHeight / itemHeight)
    const end = Math.min(data.length - 1, start + visibleCount + 2 * overscan)

    const items: Array<{ item: T; index: number; top: number }> = []
    for (let i = start; i <= end; i++) {
      items.push({
        item: data[i],
        index: i,
        top: i * itemHeight,
      })
    }

    return { startIndex: start, endIndex: end, visibleItems: items }
  }, [scrollTop, data, itemHeight, overscan, containerHeight])

  const handleScroll = useCallback(
    (e: any) => {
      const newScrollTop = e.detail.scrollTop
      setScrollTop(newScrollTop)

      // End reached detection
      if (onEndReached && totalHeight - newScrollTop - containerHeight < endReachedThreshold) {
        onEndReached()
      }
    },
    [totalHeight, containerHeight, endReachedThreshold, onEndReached]
  )

  return (
    <ScrollView
      scrollY
      className={cn(className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      onScroll={handleScroll}
      scrollWithAnimation={false}
    >
      {/* Total height spacer */}
      <View style={{ height: `${totalHeight}px`, position: 'relative' }}>
        {visibleItems.map(({ item, index, top }) => (
          <View
            key={keyExtractor ? keyExtractor(item, index) : index}
            style={{
              position: 'absolute',
              top: `${top}px`,
              left: 0,
              right: 0,
              height: `${itemHeight}px`,
            }}
          >
            {renderItem(item, index)}
          </View>
        ))}
      </View>
    </ScrollView>
  )
}

export { VirtualList }
