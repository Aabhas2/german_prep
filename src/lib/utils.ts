import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  try {
    const dateObj = date instanceof Date ? date : new Date(date)
    if (isNaN(dateObj.getTime())) {
      return 'Invalid Date'
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(dateObj)
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export function getProgressColor(percentage: number): string {
  if (percentage >= 80) return 'bg-green-500'
  if (percentage >= 60) return 'bg-blue-500'
  if (percentage >= 40) return 'bg-yellow-500'
  return 'bg-red-500'
}

export function saveToLocalStorage(key: string, data: any): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

export function loadFromLocalStorage(key: string): any {
  if (typeof window !== 'undefined') {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  }
  return null
}

export const formatCurrency = (amount: number, currency: string, showSymbol: boolean = true): string => {
  const symbols: Record<string, string> = {
    USD: '$',
    EUR: '€',
    INR: '₹',
    GBP: '£'
  }

  // Bug #11 fix: treat only null/undefined/NaN as empty — 0 is a valid amount
  if (amount === undefined || amount === null || isNaN(amount)) {
    const symbol = symbols[currency] || currency
    return showSymbol ? `${symbol}0.00` : '0.00'
  }

  let formatted: string

  try {
    if (currency === 'INR') {
      formatted = Math.round(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    } else {
      formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  } catch (error) {
    console.error('Error formatting currency:', error)
    formatted = amount.toFixed(2)
  }

  const symbol = symbols[currency] || currency
  return showSymbol ? `${symbol}${formatted}` : formatted
}

/**
 * Bug #2 fix: All exchangeRates are stored as "1 EUR = X currency".
 * Proper two-hop conversion:
 *   1. Convert fromCurrency → EUR  (divide by fromCurrency rate)
 *   2. Convert EUR → toCurrency    (multiply by toCurrency rate)
 * This handles any currency pair correctly (not just EUR-based ones).
 */
export const convertCurrency = (
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  exchangeRates: Record<string, number>
): number => {
  if (amount === undefined || amount === null || isNaN(amount)) return 0
  if (fromCurrency === toCurrency) return amount

  try {
    const rates = { EUR: 1, ...exchangeRates } as Record<string, number>

    const fromRate = rates[fromCurrency]
    const toRate   = rates[toCurrency]

    if (!fromRate || fromRate <= 0) {
      console.warn(`convertCurrency: no rate found for source currency '${fromCurrency}', returning original amount`)
      return amount
    }
    if (!toRate || toRate <= 0) {
      console.warn(`convertCurrency: no rate found for target currency '${toCurrency}', returning original amount`)
      return amount
    }

    // Step 1: source → EUR
    const amountInEUR = amount / fromRate
    // Step 2: EUR → target
    return amountInEUR * toRate
  } catch (error) {
    console.error('convertCurrency error:', error)
    return amount
  }
}

// NOTE: defaultSettings has been removed from utils.ts.
// Import it from '@/contexts/ThemeContext' instead.
// Keeping this comment to prevent accidental re-addition.

// @deprecated — do not use
export const _REMOVED_defaultSettings = {
  theme: 'light' as 'light' | 'dark',
  notifications: true,
  personalDetails: {
    name: '',
    email: '',
    targetCountry: 'Germany',
    targetStartDate: ''
  },
  currency: {
    primary: 'EUR' as 'USD' | 'EUR' | 'INR',
    displaySymbol: true,
    exchangeRates: {
      // Updated rates as of January 2024
      USD_EUR: 0.92,   // 1 USD = 0.92 EUR
      USD_INR: 83.25,  // 1 USD = 83.25 INR
      EUR_USD: 1.09,   // 1 EUR = 1.09 USD
      EUR_INR: 90.50,  // 1 EUR = 90.50 INR
      INR_USD: 0.012,  // 1 INR = 0.012 USD
      INR_EUR: 0.011   // 1 INR = 0.011 EUR
    },
    lastUpdated: new Date().toISOString(),
    autoUpdate: false
  },
  dashboard: {
    showProgressBars: true,
    showQuickActions: true,
    showRecentTasks: true,
    showFinancialOverview: true,
    tasksToShow: 5,
    refreshInterval: 30000
  },
  tasks: {
    defaultPriority: 'Medium' as 'Low' | 'Medium' | 'High',
    defaultCategory: 'General',
    showCompletedTasks: true,
    autoArchiveCompleted: false,
    sortBy: 'dueDate' as 'dueDate' | 'priority' | 'created' | 'title',
    groupByCategory: false
  },
  universities: {
    defaultLanguage: 'English' as 'English' | 'German' | 'Both',
    showDeadlineWarnings: true,
    warningDaysBefore: 30,
    sortBy: 'deadline' as 'deadline' | 'name' | 'status',
    showOnlyActive: false
  },
  finance: {
    budgetWarningThreshold: 80,
    showCategoryBreakdown: true,
    defaultCategory: 'Other' as 'Application' | 'Travel' | 'Tuition' | 'Living' | 'Other',
    trackActualAmounts: true,
    showCurrencyConverter: true
  },
  appearance: {
    compactMode: false,
    showAnimations: true,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    colorScheme: 'blue' as 'blue' | 'green' | 'purple' | 'red' | 'orange',
    sidebarCollapsed: false
  },
  data: {
    autoSave: true,
    backupFrequency: 'weekly' as 'daily' | 'weekly' | 'monthly',
    exportFormat: 'json' as 'json' | 'csv',
    syncEnabled: false
  }
} 