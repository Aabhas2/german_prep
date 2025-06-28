'use client'

import React, { useMemo } from 'react'
import { useIsClient } from '@/hooks/useIsClient'
import { formatCurrency } from '@/lib/utils'

interface ClientCurrencyProps {
  amount: number
  currency: string
  showSymbol?: boolean
  className?: string
}

export const ClientCurrency = React.memo(({ 
  amount, 
  currency, 
  showSymbol = true, 
  className 
}: ClientCurrencyProps) => {
  const isClient = useIsClient()
  
  const formattedAmount = useMemo(() => {
    if (!isClient) return 'Loading...'
    
    try {
      return formatCurrency(amount, currency, showSymbol)
    } catch (error) {
      console.error('Currency formatting error:', error)
      return `${currency} ${amount.toFixed(2)}`
    }
  }, [amount, currency, showSymbol, isClient])

  return (
    <span className={className}>
      {formattedAmount}
    </span>
  )
})

ClientCurrency.displayName = 'ClientCurrency' 