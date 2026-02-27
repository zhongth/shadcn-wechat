import { Input as TaroInput } from '@tarojs/components'
import type { InputProps as TaroInputProps } from '@tarojs/components'
import { cn } from '@/lib/utils'

export interface InputProps {
  className?: string
  type?: TaroInputProps['type']
  placeholder?: string
  value?: string
  disabled?: boolean
  maxlength?: number
  password?: boolean
  onInput?: (value: string) => void
  onFocus?: () => void
  onBlur?: () => void
  onConfirm?: (value: string) => void
}

function Input({
  className,
  type,
  placeholder,
  value,
  disabled,
  maxlength,
  password,
  onInput,
  onFocus,
  onBlur,
  onConfirm,
  ...props
}: InputProps) {
  return (
    <TaroInput
      className={cn(
        'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
        'placeholder:text-muted-foreground',
        'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        'disabled:opacity-50',
        className
      )}
      type={type}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      maxlength={maxlength}
      password={password}
      onInput={(e) => onInput?.(e.detail.value)}
      onFocus={() => onFocus?.()}
      onBlur={() => onBlur?.()}
      onConfirm={(e) => onConfirm?.(e.detail.value)}
      {...props}
    />
  )
}

export { Input }
