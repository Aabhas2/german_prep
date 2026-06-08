import { useState, useEffect } from 'react'

/**
 * Hook to detect if code is running on client side
 * Useful for preventing hydration mismatches
 */
export function useIsClient() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
} 