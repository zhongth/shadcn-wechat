import { Text as TaroText } from '@tarojs/components'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const textVariants = cva('', {
  variants: {
    variant: {
      h1: 'text-4xl font-extrabold tracking-tight',
      h2: 'text-3xl font-semibold tracking-tight',
      h3: 'text-2xl font-semibold tracking-tight',
      h4: 'text-xl font-semibold tracking-tight',
      p: 'text-base leading-7',
      lead: 'text-xl text-muted-foreground',
      large: 'text-lg font-semibold',
      small: 'text-sm font-medium leading-none',
      muted: 'text-sm text-muted-foreground',
      code: 'relative rounded bg-muted px-1 py-0.5 font-mono text-sm font-semibold',
    },
  },
  defaultVariants: {
    variant: 'p',
  },
})

export interface TextProps extends VariantProps<typeof textVariants> {
  className?: string
  children?: React.ReactNode
}

function Typography({ className, variant, children, ...props }: TextProps) {
  return (
    <TaroText
      className={cn(textVariants({ variant, className }))}
      {...props}
    >
      {children}
    </TaroText>
  )
}

export { Typography, textVariants }
