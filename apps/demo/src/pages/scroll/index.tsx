import { View, Text } from '@tarojs/components'
import { useState, useCallback } from 'react'
import { Button } from '../../components/ui/button'
import { Typography } from '../../components/ui/text'
import { Separator } from '../../components/ui/separator'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselDots,
} from '../../components/ui/carousel'
import { InfiniteScroll } from '../../components/ui/infinite-scroll'
import { PullToRefresh } from '../../components/ui/pull-to-refresh'
import { VirtualList } from '../../components/ui/virtual-list'
import { SwipeCell } from '../../components/ui/swipe-cell'

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <View className="mb-8">
      <Typography variant="h3" className="text-foreground">
        {title}
      </Typography>
      <Separator className="my-3" />
      {children}
    </View>
  )
}

export default function ScrollDemo() {
  // InfiniteScroll state
  const [items, setItems] = useState(() =>
    Array.from({ length: 10 }, (_, i) => ({ id: i, title: `Item ${i + 1}` }))
  )
  const [hasMore, setHasMore] = useState(true)

  const loadMore = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setItems((prev) => {
      const next = Array.from({ length: 5 }, (_, i) => ({
        id: prev.length + i,
        title: `Item ${prev.length + i + 1}`,
      }))
      const newItems = [...prev, ...next]
      if (newItems.length >= 30) setHasMore(false)
      return newItems
    })
  }, [])

  // PullToRefresh state
  const [refreshItems, setRefreshItems] = useState([
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
  ])

  const handleRefresh = useCallback(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setRefreshItems((prev) => [`New item ${Date.now() % 1000}`, ...prev].slice(0, 8))
  }, [])

  // VirtualList data
  const virtualData = Array.from({ length: 1000 }, (_, i) => ({
    id: i,
    title: `Virtual Item #${i + 1}`,
    subtitle: `Description for item ${i + 1}`,
  }))

  return (
    <View className="p-4 pb-8">
      <View className="mb-6">
        <Typography variant="h2" className="text-foreground">
          Scroll & List Components
        </Typography>
        <Typography variant="muted" className="mt-1">
          Carousel, InfiniteScroll, PullToRefresh, VirtualList, SwipeCell
        </Typography>
      </View>

      {/* Carousel */}
      <Section title="Carousel">
        <Carousel autoplay circular>
          <CarouselContent height={160}>
            <CarouselItem>
              <View className="h-full w-full bg-primary/10 flex items-center justify-center rounded-md">
                <Text className="text-2xl">🎨 Slide 1</Text>
              </View>
            </CarouselItem>
            <CarouselItem>
              <View className="h-full w-full bg-primary/20 flex items-center justify-center rounded-md">
                <Text className="text-2xl">🎵 Slide 2</Text>
              </View>
            </CarouselItem>
            <CarouselItem>
              <View className="h-full w-full bg-primary/30 flex items-center justify-center rounded-md">
                <Text className="text-2xl">📸 Slide 3</Text>
              </View>
            </CarouselItem>
          </CarouselContent>
          <CarouselDots total={3} />
        </Carousel>
      </Section>

      {/* SwipeCell */}
      <Section title="SwipeCell">
        <Typography variant="muted" className="mb-3">
          Swipe left to reveal actions
        </Typography>
        <View className="space-y-2">
          <SwipeCell
            rightActions={
              <View className="flex flex-row h-full">
                <View className="w-20 bg-primary flex items-center justify-center">
                  <Text className="text-primary-foreground text-sm">Edit</Text>
                </View>
                <View className="w-20 bg-destructive flex items-center justify-center">
                  <Text className="text-destructive-foreground text-sm">Delete</Text>
                </View>
              </View>
            }
            rightActionWidth={160}
          >
            <View className="p-4 bg-background border border-border rounded-md">
              <Text className="text-foreground">Swipe me left →</Text>
            </View>
          </SwipeCell>

          <SwipeCell
            leftActions={
              <View className="flex flex-row h-full">
                <View className="w-20 bg-green-500 flex items-center justify-center">
                  <Text className="text-white text-sm">Archive</Text>
                </View>
              </View>
            }
            leftActionWidth={80}
            rightActions={
              <View className="flex flex-row h-full">
                <View className="w-20 bg-destructive flex items-center justify-center">
                  <Text className="text-destructive-foreground text-sm">Delete</Text>
                </View>
              </View>
            }
            rightActionWidth={80}
          >
            <View className="p-4 bg-background border border-border rounded-md">
              <Text className="text-foreground">← Swipe both ways →</Text>
            </View>
          </SwipeCell>
        </View>
      </Section>

      {/* InfiniteScroll */}
      <Section title="InfiniteScroll">
        <Typography variant="muted" className="mb-3">
          Scroll down to load more (loads 5 items, max 30)
        </Typography>
        <InfiniteScroll
          onLoadMore={loadMore}
          hasMore={hasMore}
          height={250}
          className="border border-border rounded-md"
        >
          {items.map((item) => (
            <View
              key={item.id}
              className="px-4 py-3 border-b border-border"
            >
              <Text className="text-sm text-foreground">{item.title}</Text>
            </View>
          ))}
        </InfiniteScroll>
      </Section>

      {/* PullToRefresh */}
      <Section title="PullToRefresh">
        <Typography variant="muted" className="mb-3">
          Pull down to refresh the list
        </Typography>
        <PullToRefresh
          onRefresh={handleRefresh}
          height={200}
          className="border border-border rounded-md"
        >
          {refreshItems.map((item, i) => (
            <View
              key={`${item}-${i}`}
              className="px-4 py-3 border-b border-border"
            >
              <Text className="text-sm text-foreground">{item}</Text>
            </View>
          ))}
        </PullToRefresh>
      </Section>

      {/* VirtualList */}
      <Section title="VirtualList">
        <Typography variant="muted" className="mb-3">
          1000 items, rendering only visible ones
        </Typography>
        <View className="border border-border rounded-md overflow-hidden">
          <VirtualList
            data={virtualData}
            itemHeight={56}
            height={280}
            keyExtractor={(item) => String(item.id)}
            renderItem={(item) => (
              <View className="px-4 py-2 border-b border-border flex flex-col justify-center h-full">
                <Text className="text-sm text-foreground font-medium">
                  {item.title}
                </Text>
                <Text className="text-xs text-muted-foreground">
                  {item.subtitle}
                </Text>
              </View>
            )}
          />
        </View>
      </Section>
    </View>
  )
}
