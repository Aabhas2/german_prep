import { cn } from '@/lib/utils'

interface CurrencyToggleProps {
  currentCurrency: string
  onCurrencyChange: (currency: string) => void
  className?: string
}

export function CurrencyToggle({ currentCurrency, onCurrencyChange, className }: CurrencyToggleProps) {
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ] as const

  return (
    <div className={cn("inline-flex rounded-lg border border-gray-200 bg-white p-1", className)}>
      {currencies.map((currency) => (
        <button
          key={currency.code}
          onClick={() => onCurrencyChange(currency.code)}
          className={cn(
            "flex items-center space-x-1 px-3 py-1.5 text-sm font-medium rounded-md transition-all",
            currentCurrency === currency.code
              ? "bg-blue-600 text-white shadow-sm"
              : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
          )}
          title={currency.name}
        >
          <span className="text-xs">{currency.symbol}</span>
          <span>{currency.code}</span>
        </button>
      ))}
    </div>
  )
} 