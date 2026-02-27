import { View, Text } from '@tarojs/components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'bg-background text-foreground border-border',
        destructive: 'border-destructive/50 text-destructive',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface AlertProps extends VariantProps<typeof alertVariants> {
  className?: string
  children?: React.ReactNode
}

function Alert({ className, variant, children, ...props }: AlertProps) {
  return (
    <View
      className={cn(alertVariants({ variant }), className)}
      {...props}
    >
      {children}
    </View>
  )
}

export interface AlertTitleProps {
  className?: string
  children?: React.ReactNode
}

function AlertTitle({ className, children, ...props }: AlertTitleProps) {
  return (
    <Text
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    >
      {children}
    </Text>
  )
}

export interface AlertDescriptionProps {
  className?: string
  children?: React.ReactNode
}

function AlertDescription({ className, children, ...props }: AlertDescriptionProps) {
  return (
    <Text
      className={cn('text-sm', className)}
      {...props}
    >
      {children}
    </Text>
  )
}

export { Alert, AlertTitle, AlertDescription, alertVariants }
