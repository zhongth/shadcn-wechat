import { View, Text } from '@tarojs/components'
import { useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Popup } from './popup'

export interface ActionSheetAction {
  /** Display label */
  label: string
  /** Unique value identifier */
  value: string
  /** Destructive action styling */
  destructive?: boolean
  /** Disable this action */
  disabled?: boolean
}

export interface ActionSheetProps {
  className?: string
  /** Controlled open state */
  open?: boolean
  /** Open state change handler */
  onOpenChange?: (open: boolean) => void
  /** List of action items */
  actions: ActionSheetAction[]
  /** Called when an action is tapped */
  onAction?: (value: string) => void
  /** Cancel button text */
  cancelText?: string
  /** Optional title above actions */
  title?: string
  /** Optional description below title */
  description?: string
}

/**
 * ActionSheet displays a list of actions from the bottom of the screen.
 * Built on top of Popup with bottom positioning.
 *
 * Usage:
 * ```tsx
 * <ActionSheet
 *   open={open}
 *   onOpenChange={setOpen}
 *   actions={[
 *     { label: 'Edit', value: 'edit' },
 *     { label: 'Delete', value: 'delete', destructive: true },
 *   ]}
 *   onAction={(value) => console.log(value)}
 * />
 * ```
 */
function ActionSheet({
  className,
  open,
  onOpenChange,
  actions,
  onAction,
  cancelText = '取消',
  title,
  description,
}: ActionSheetProps) {
  const handleAction = useCallback(
    (value: string) => {
      onAction?.(value)
      onOpenChange?.(false)
    },
    [onAction, onOpenChange]
  )

  const handleCancel = useCallback(() => {
    onOpenChange?.(false)
  }, [onOpenChange])

  return (
    <Popup
      open={open}
      onOpenChange={onOpenChange}
      position="bottom"
    >
      <View className={cn('bg-background rounded-t-xl pb-safe', className)}>
        {/* Header */}
        {(title || description) && (
          <View className="py-4 px-4 text-center">
            {title && (
              <Text className="text-sm font-medium text-foreground">
                {title}
              </Text>
            )}
            {description && (
              <Text className="text-xs text-muted-foreground mt-1">
                {description}
              </Text>
            )}
          </View>
        )}

        {/* Actions */}
        <View>
          {actions.map((action, index) => (
            <View
              key={action.value}
              className={cn(
                'py-3 px-4 text-center active:bg-accent transition-colors',
                index > 0 && 'border-t border-border',
                action.disabled && 'opacity-50'
              )}
              onTap={action.disabled ? undefined : () => handleAction(action.value)}
            >
              <Text
                className={cn(
                  'text-base',
                  action.destructive
                    ? 'text-destructive'
                    : 'text-foreground'
                )}
              >
                {action.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Gap */}
        <View className="h-2 bg-muted" />

        {/* Cancel button */}
        <View
          className="py-3 px-4 text-center active:bg-accent transition-colors"
          onTap={handleCancel}
        >
          <Text className="text-base font-medium text-foreground">
            {cancelText}
          </Text>
        </View>
      </View>
    </Popup>
  )
}

export { ActionSheet }
