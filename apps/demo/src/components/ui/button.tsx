import { View, Text } from '@tarojs/components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground active:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground active:bg-destructive/90',
        outline:
          'border border-input bg-background active:bg-accent active:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground active:bg-secondary/80',
        ghost:
          'active:bg-accent active:text-accent-foreground',
        link:
          'text-primary underline-offset-4 active:underline',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  className?: string
  disabled?: boolean
  children?: React.ReactNode
  onTap?: () => void
}

function Button({
  className,
  variant,
  size,
  disabled,
  children,
  onTap,
  ...props
}: ButtonProps) {
  return (
    <View
      className={cn(buttonVariants({ variant, size, className }))}
      onTap={disabled ? undefined : onTap}
      {...props}
    >
      <Text>{children}</Text>
    </View>
  )
}

export { Button, buttonVariants }
