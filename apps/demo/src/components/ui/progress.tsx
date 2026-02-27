import { View } from '@tarojs/components'
import { cn } from '@/lib/utils'

export interface ProgressProps {
  className?: string
  /** Progress value from 0 to max */
  value?: number
  /** Maximum value, default 100 */
  max?: number
}

/**
 * Progress bar component.
 * Displays a horizontal bar indicating progress.
 */
function Progress({ className, value = 0, max = 100 }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100))

  return (
    <View
      className={cn(
        'relative h-4 w-full overflow-hidden rounded-full bg-secondary',
        className
      )}
    >
      <View
        className="h-full bg-primary transition-all duration-300 rounded-full"
        style={{ width: `${percentage}%` }}
      />
    </View>
  )
}

export { Progress }
