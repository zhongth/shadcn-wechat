import { View, Text } from '@tarojs/components'
import { cn } from '@/lib/utils'

export interface CardProps {
  className?: string
  children?: React.ReactNode
}

function Card({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-lg border border-border bg-card text-card-foreground shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
}

function CardHeader({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
      {children}
    </View>
  )
}

function CardTitle({ className, children, ...props }: CardProps) {
  return (
    <Text
      className={cn(
        'text-2xl font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
}

function CardDescription({ className, children, ...props }: CardProps) {
  return (
    <Text className={cn('text-sm text-muted-foreground', className)} {...props}>
      {children}
    </Text>
  )
}

function CardContent({ className, children, ...props }: CardProps) {
  return (
    <View className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </View>
  )
}

function CardFooter({ className, children, ...props }: CardProps) {
  return (
    <View
      className={cn('flex items-center p-6 pt-0', className)}
      {...props}
    >
      {children}
    </View>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
