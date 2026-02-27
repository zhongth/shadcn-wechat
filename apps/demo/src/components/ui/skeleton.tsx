import { View } from '@tarojs/components'
import { cn } from '@/lib/utils'

export interface SkeletonProps {
  className?: string
}

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <View
      className={cn('animate-pulse-slow rounded-md bg-muted', className)}
      {...props}
    />
  )
}

export { Skeleton }
