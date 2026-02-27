import { View, Text } from '@tarojs/components'
import { createContext, useContext, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { Popup, type PopupProps } from './popup'

// --- Context ---

type DialogContextValue = {
  onClose: () => void
}

const DialogContext = createContext<DialogContextValue>({
  onClose: () => {},
})

// --- Dialog (Root) ---

export interface DialogProps extends Omit<PopupProps, 'position'> {
  children?: React.ReactNode
}

/**
 * Dialog component for modal content.
 * Built on top of Popup with center positioning.
 *
 * Usage:
 * ```tsx
 * <Dialog open={open} onOpenChange={setOpen}>
 *   <DialogContent>
 *     <DialogHeader>
 *       <DialogTitle>Title</DialogTitle>
 *       <DialogDescription>Description text</DialogDescription>
 *     </DialogHeader>
 *     <DialogFooter>
 *       <DialogClose asChild>
 *         <Button variant="outline">Cancel</Button>
 *       </DialogClose>
 *       <Button onTap={handleConfirm}>Confirm</Button>
 *     </DialogFooter>
 *   </DialogContent>
 * </Dialog>
 * ```
 */
function Dialog({
  children,
  onOpenChange,
  ...props
}: DialogProps) {
  const handleClose = useCallback(() => {
    onOpenChange?.(false)
  }, [onOpenChange])

  return (
    <DialogContext.Provider value={{ onClose: handleClose }}>
      <Popup
        position="center"
        onOpenChange={onOpenChange}
        {...props}
      >
        {children}
      </Popup>
    </DialogContext.Provider>
  )
}

// --- DialogContent ---

export interface DialogContentProps {
  className?: string
  children?: React.ReactNode
}

function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <View
      className={cn(
        'bg-background rounded-lg shadow-lg p-6 w-[80vw] max-w-[350px]',
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
}

// --- DialogHeader ---

export interface DialogHeaderProps {
  className?: string
  children?: React.ReactNode
}

function DialogHeader({ className, children, ...props }: DialogHeaderProps) {
  return (
    <View
      className={cn('flex flex-col space-y-1.5 text-center mb-4', className)}
      {...props}
    >
      {children}
    </View>
  )
}

// --- DialogTitle ---

export interface DialogTitleProps {
  className?: string
  children?: React.ReactNode
}

function DialogTitle({ className, children, ...props }: DialogTitleProps) {
  return (
    <Text
      className={cn(
        'text-lg font-semibold leading-none tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </Text>
  )
}

// --- DialogDescription ---

export interface DialogDescriptionProps {
  className?: string
  children?: React.ReactNode
}

function DialogDescription({ className, children, ...props }: DialogDescriptionProps) {
  return (
    <Text
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Text>
  )
}

// --- DialogFooter ---

export interface DialogFooterProps {
  className?: string
  children?: React.ReactNode
}

function DialogFooter({ className, children, ...props }: DialogFooterProps) {
  return (
    <View
      className={cn(
        'flex flex-row justify-end space-x-2 mt-4',
        className
      )}
      {...props}
    >
      {children}
    </View>
  )
}

// --- DialogClose ---

export interface DialogCloseProps {
  className?: string
  children?: React.ReactNode
}

function DialogClose({ className, children, ...props }: DialogCloseProps) {
  const { onClose } = useContext(DialogContext)

  return (
    <View
      className={cn(className)}
      onTap={onClose}
      {...props}
    >
      {children}
    </View>
  )
}

export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
}
