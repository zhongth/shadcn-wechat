import { Text } from '@tarojs/components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const labelVariants = cva(
  'text-sm font-medium leading-none'
)

export interface LabelProps extends VariantProps<typeof labelVariants> {
  className?: string
  children?: React.ReactNode
}

function Label({ className, children, ...props }: LabelProps) {
  return (
    <Text className={cn(labelVariants(), className)} {...props}>
      {children}
    </Text>
  )
}

export { Label, labelVariants }
