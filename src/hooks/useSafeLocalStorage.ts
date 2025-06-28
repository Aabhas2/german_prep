import { useState, useEffect } from 'react'

/**
 * A hook that safely handles localStorage without causing hydration mismatches
 */
export function useSafeLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage once on client-side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error)
      }
      setIsLoaded(true)
    }
  }, [key])

  // Save to localStorage when value changes
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value
      
      // Save state
      setStoredValue(valueToStore)
      
      // Save to localStorage only on client-side and when loaded
      if (typeof window !== 'undefined' && isLoaded) {
        localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }

  return [storedValue, setValue] as const
} 