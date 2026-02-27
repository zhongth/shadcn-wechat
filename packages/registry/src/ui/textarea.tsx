import { Textarea as TaroTextarea } from '@tarojs/components'
import { cn } from '@/lib/utils'

export interface TextareaProps {
  className?: string
  placeholder?: string
  value?: string
  disabled?: boolean
  maxlength?: number
  autoHeight?: boolean
  onInput?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
}

function Textarea({
  className,
  placeholder,
  value,
  disabled,
  maxlength,
  autoHeight = false,
  onInput,
  onFocus,
  onBlur,
  ...props
}: TextareaProps) {
  return (
    <TaroTextarea
      className={cn(
        'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50',
        className
      )}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      maxlength={maxlength ?? -1}
      autoHeight={autoHeight}
      onInput={(e) => onInput?.(e.detail.value)}
      onFocus={() => onFocus?.()}
      onBlur={() => onBlur?.()}
      {...props}
    />
  )
}

export { Textarea }
