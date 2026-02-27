import { View, Text } from '@tarojs/components'
import { createContext, useContext, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { Label } from './label'

// --- Form Field Context ---

type FormFieldContextValue = {
  name: string
  error?: string
}

const FormFieldContext = createContext<FormFieldContextValue>({
  name: '',
})

function useFormField() {
  return useContext(FormFieldContext)
}

// --- Form ---

export interface FormProps {
  className?: string
  children?: React.ReactNode
}

/**
 * Form wrapper component. Provides layout for form fields.
 * Compatible with react-hook-form — pass RHF state via FormField's render prop.
 *
 * Usage with react-hook-form:
 * ```tsx
 * const form = useForm()
 *
 * <Form>
 *   <FormField name="email" error={form.formState.errors.email?.message}>
 *     <FormItem>
 *       <FormLabel>Email</FormLabel>
 *       <FormControl>
 *         <Input
 *           value={form.watch('email')}
 *           onInput={(e) => form.setValue('email', e.detail.value)}
 *         />
 *       </FormControl>
 *       <FormDescription>Your email address</FormDescription>
 *       <FormMessage />
 *     </FormItem>
 *   </FormField>
 * </Form>
 * ```
 *
 * Usage standalone:
 * ```tsx
 * <Form>
 *   <FormField name="name" error={errors.name}>
 *     <FormItem>
 *       <FormLabel>Name</FormLabel>
 *       <FormControl>
 *         <Input value={name} onInput={(e) => setName(e.detail.value)} />
 *       </FormControl>
 *       <FormMessage />
 *     </FormItem>
 *   </FormField>
 * </Form>
 * ```
 */
function Form({ className, children, ...props }: FormProps) {
  return (
    <View className={cn('space-y-6', className)} {...props}>
      {children}
    </View>
  )
}

// --- FormField ---

export interface FormFieldProps {
  /** Field name (for context) */
  name: string
  /** Error message string */
  error?: string
  children?: React.ReactNode
}

function FormField({ name, error, children }: FormFieldProps) {
  const contextValue = useMemo(
    () => ({ name, error }),
    [name, error]
  )

  return (
    <FormFieldContext.Provider value={contextValue}>
      {children}
    </FormFieldContext.Provider>
  )
}

// --- FormItem ---

export interface FormItemProps {
  className?: string
  children?: React.ReactNode
}

function FormItem({ className, children, ...props }: FormItemProps) {
  return (
    <View className={cn('space-y-2', className)} {...props}>
      {children}
    </View>
  )
}

// --- FormLabel ---

export interface FormLabelProps {
  className?: string
  children?: React.ReactNode
}

function FormLabel({ className, children, ...props }: FormLabelProps) {
  const { error } = useFormField()

  return (
    <Label
      className={cn(error && 'text-destructive', className)}
      {...props}
    >
      {children}
    </Label>
  )
}

// --- FormControl ---

export interface FormControlProps {
  className?: string
  children?: React.ReactNode
}

function FormControl({ className, children, ...props }: FormControlProps) {
  return (
    <View className={cn(className)} {...props}>
      {children}
    </View>
  )
}

// --- FormDescription ---

export interface FormDescriptionProps {
  className?: string
  children?: React.ReactNode
}

function FormDescription({ className, children, ...props }: FormDescriptionProps) {
  return (
    <Text
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    >
      {children}
    </Text>
  )
}

// --- FormMessage ---

export interface FormMessageProps {
  className?: string
  children?: React.ReactNode
}

function FormMessage({ className, children, ...props }: FormMessageProps) {
  const { error } = useFormField()
  const message = error || children

  if (!message) return null

  return (
    <Text
      className={cn('text-sm font-medium text-destructive', className)}
      {...props}
    >
      {String(message)}
    </Text>
  )
}

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  useFormField,
}
