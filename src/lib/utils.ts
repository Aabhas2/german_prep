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
  
  // Handle edge cases
  if (!amount || isNaN(amount)) {
    const symbol = symbols[currency] || currency
    return showSymbol ? `${symbol}0` : '0'
  }
  
  let formatted: string
  
  try {
    if (currency === 'INR') {
      // Use Indian number system (lakhs and crores)
      formatted = Math.round(amount).toLocaleString('en-IN', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      })
    } else {
      // Use Western number system for USD and EUR
      formatted = amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  } catch (error) {
    console.error('Error formatting currency:', error)
    formatted = amount.toString()
  }
  
  const symbol = symbols[currency] || currency
  return showSymbol ? `${symbol}${formatted}` : formatted
}

export const convertCurrency = (
  amount: number, 
  fromCurrency: string, 
  toCurrency: string,
  exchangeRates: Record<string, number>
): number => {
  // Validate inputs
  if (!amount || isNaN(amount)) return 0
  if (fromCurrency === toCurrency) return amount
  
  try {
    // If we have a direct rate, use it
    const directRate = exchangeRates[toCurrency]
    if (directRate && directRate > 0) {
      return amount * directRate
    }
    
    // Try reverse conversion
    const reverseRate = exchangeRates[fromCurrency]
    if (reverseRate && reverseRate > 0) {
      return amount / reverseRate
    }
    
    // If no rate found, return original amount
    console.warn(`No exchange rate found for ${fromCurrency} to ${toCurrency}`)
    return amount
  } catch (error) {
    console.error('Error converting currency:', error)
    return amount
  }
}

export const defaultSettings = {
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