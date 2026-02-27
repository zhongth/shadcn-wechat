import { View, Image, Text } from '@tarojs/components'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export interface AvatarProps {
  className?: string
  src?: string
  alt?: string
  fallback?: string
  size?: 'sm' | 'default' | 'lg'
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  default: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
}

function Avatar({
  className,
  src,
  alt,
  fallback,
  size = 'default',
  ...props
}: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const showImage = src && !hasError

  return (
    <View
      className={cn(
        'relative flex shrink-0 overflow-hidden rounded-full',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <Image
          className="aspect-square h-full w-full"
          src={src}
          mode="aspectFill"
          onError={() => setHasError(true)}
        />
      ) : (
        <View className="flex h-full w-full items-center justify-center rounded-full bg-muted">
          <Text className="font-medium text-muted-foreground">
            {fallback || alt?.charAt(0)?.toUpperCase() || '?'}
          </Text>
        </View>
      )}
    </View>
  )
}

export { Avatar }
