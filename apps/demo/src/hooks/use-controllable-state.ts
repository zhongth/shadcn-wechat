import { useState, useCallback, useRef, useEffect } from 'react'
import { useCallbackRef } from './use-callback-ref'

type UseControllableStateParams<T> = {
  /** The controlled value */
  prop?: T
  /** The default value for uncontrolled mode */
  defaultProp?: T
  /** Callback when the value changes */
  onChange?: (value: T) => void
}

/**
 * Manages controlled vs uncontrolled state pattern.
 * If `prop` is provided, the component is controlled.
 * If only `defaultProp` is provided, the component is uncontrolled.
 */
function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>) {
  const [uncontrolledValue, setUncontrolledValue] = useUncontrolledState({
    defaultProp,
    onChange,
  })

  const isControlled = prop !== undefined
  const value = isControlled ? prop : uncontrolledValue
  const handleChange = useCallbackRef(onChange)

  const setValue = useCallback(
    (nextValue: T | ((prev: T) => T)) => {
      if (isControlled) {
        const setter = nextValue as (prev: T) => T
        const newValue =
          typeof nextValue === 'function' ? setter(prop as T) : nextValue

        if (newValue !== prop) {
          handleChange(newValue)
        }
      } else {
        setUncontrolledValue(nextValue)
      }
    },
    [isControlled, prop, setUncontrolledValue, handleChange]
  )

  return [value, setValue] as const
}

function useUncontrolledState<T>({
  defaultProp,
  onChange,
}: Omit<UseControllableStateParams<T>, 'prop'>) {
  const [value, setValue] = useState(defaultProp as T)
  const prevValueRef = useRef(value)
  const handleChange = useCallbackRef(onChange)

  useEffect(() => {
    if (prevValueRef.current !== value) {
      handleChange(value)
      prevValueRef.current = value
    }
  }, [value, handleChange])

  return [value, setValue] as const
}

export { useControllableState }
export type { UseControllableStateParams }
