import { cn } from '@/lib/utils'

interface CurrencyToggleProps {
  currentCurrency: string
  onCurrencyChange: (currency: string) => void
  className?: string
}

export function CurrencyToggle({ currentCurrency, onCurrencyChange, className }: CurrencyToggleProps) {
  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar (USD)' },
    { code: 'EUR', symbol: '€', name: 'Euro (EUR)' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee (INR)' }
  ] as const

  return (
    <div className={cn("inline-flex items-center rounded-xl border border-border bg-card/80 backdrop-blur-sm p-1 shadow-sm", className)}>
      {currencies.map((currency) => {
        const isSelected = currentCurrency === currency.code
        return (
          <button
            key={currency.code}
            type="button"
            onClick={() => onCurrencyChange(currency.code)}
            className={cn(
              "flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-200 focus:outline-none",
              isSelected
                ? "bg-primary text-primary-foreground shadow-md ring-1 ring-primary/20 scale-[1.02]"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/80"
            )}
            title={currency.name}
          >
            <span className="font-bold">{currency.symbol}</span>
            <span>{currency.code}</span>
          </button>
        )
      })}
    </div>
  )
}