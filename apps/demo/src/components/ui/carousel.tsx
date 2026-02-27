import { View, Swiper, SwiperItem } from '@tarojs/components'
import { createContext, useContext, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useControllableState } from '@/hooks/use-controllable-state'

// --- Context ---

type CarouselContextValue = {
  current: number
  total: number
  onCurrentChange: (index: number) => void
  autoplay: boolean
  interval: number
  circular: boolean
  vertical: boolean
}

const CarouselContext = createContext<CarouselContextValue>({
  current: 0,
  total: 0,
  onCurrentChange: () => {},
  autoplay: false,
  interval: 3000,
  circular: false,
  vertical: false,
})

// --- Carousel ---

export interface CarouselProps {
  className?: string
  children?: React.ReactNode
  /** Autoplay slides */
  autoplay?: boolean
  /** Autoplay interval in ms */
  interval?: number
  /** Loop continuously */
  circular?: boolean
  /** Vertical slides */
  vertical?: boolean
  /** Controlled current index */
  current?: number
  /** Default index */
  defaultCurrent?: number
  /** Called when slide changes */
  onCurrentChange?: (index: number) => void
}

/**
 * Carousel component wrapping Taro's Swiper with shadcn-style API.
 *
 * Usage:
 * ```tsx
 * <Carousel autoplay circular>
 *   <CarouselContent>
 *     <CarouselItem>Slide 1</CarouselItem>
 *     <CarouselItem>Slide 2</CarouselItem>
 *     <CarouselItem>Slide 3</CarouselItem>
 *   </CarouselContent>
 *   <CarouselDots />
 * </Carousel>
 * ```
 */
function Carousel({
  className,
  children,
  autoplay = false,
  interval = 3000,
  circular = false,
  vertical = false,
  current: currentProp,
  defaultCurrent = 0,
  onCurrentChange,
}: CarouselProps) {
  const [current, setCurrent] = useControllableState({
    prop: currentProp,
    defaultProp: defaultCurrent,
    onChange: onCurrentChange,
  })

  return (
    <CarouselContext.Provider
      value={{
        current,
        total: 0,
        onCurrentChange: setCurrent,
        autoplay,
        interval,
        circular,
        vertical,
      }}
    >
      <View className={cn('relative', className)}>
        {children}
      </View>
    </CarouselContext.Provider>
  )
}

// --- CarouselContent ---

export interface CarouselContentProps {
  className?: string
  children?: React.ReactNode
  /** Swiper height (required by Taro Swiper) */
  height?: number | string
}

function CarouselContent({
  className,
  children,
  height = 200,
}: CarouselContentProps) {
  const ctx = useContext(CarouselContext)

  const handleChange = useCallback(
    (e: any) => {
      ctx.onCurrentChange(e.detail.current)
    },
    [ctx.onCurrentChange]
  )

  return (
    <Swiper
      className={cn('w-full rounded-md overflow-hidden', className)}
      style={{ height: typeof height === 'number' ? `${height}px` : height }}
      current={ctx.current}
      autoplay={ctx.autoplay}
      interval={ctx.interval}
      circular={ctx.circular}
      vertical={ctx.vertical}
      indicatorDots={false}
      onChange={handleChange}
    >
      {children}
    </Swiper>
  )
}

// --- CarouselItem ---

export interface CarouselItemProps {
  className?: string
  children?: React.ReactNode
}

function CarouselItem({ className, children }: CarouselItemProps) {
  return (
    <SwiperItem>
      <View className={cn('h-full w-full', className)}>
        {children}
      </View>
    </SwiperItem>
  )
}

// --- CarouselDots ---

export interface CarouselDotsProps {
  className?: string
  /** Total number of slides (auto-detect if not set) */
  total?: number
}

function CarouselDots({ className, total: totalProp }: CarouselDotsProps) {
  const ctx = useContext(CarouselContext)
  const total = totalProp || ctx.total || 3

  return (
    <View className={cn('flex flex-row items-center justify-center gap-1.5 mt-2', className)}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            ctx.current === i
              ? 'w-4 bg-primary'
              : 'w-1.5 bg-muted-foreground/30'
          )}
          onTap={() => ctx.onCurrentChange(i)}
        />
      ))}
    </View>
  )
}

export { Carousel, CarouselContent, CarouselItem, CarouselDots }
