// Exchange rate service for real-time currency conversion
export interface ExchangeRates {
  USD_EUR: number;
  USD_INR: number;
  EUR_USD: number;
  EUR_INR: number;
  INR_USD: number;
  INR_EUR: number;
}

// Fallback rates (updated January 2024)
export const fallbackRates: ExchangeRates = {
  USD_EUR: 0.92,   // 1 USD = 0.92 EUR
  USD_INR: 83.25,  // 1 USD = 83.25 INR
  EUR_USD: 1.09,   // 1 EUR = 1.09 USD
  EUR_INR: 90.50,  // 1 EUR = 90.50 INR
  INR_USD: 0.012,  // 1 INR = 0.012 USD
  INR_EUR: 0.011   // 1 INR = 0.011 EUR
}

// Free API endpoints for exchange rates
export const EXCHANGE_RATE_APIS = [
  {
    name: 'ExchangeRate-API',
    baseUrl: 'https://api.exchangerate-api.com/v4/latest',
    free: true
  },
  {
    name: 'Fixer.io',
    baseUrl: 'https://api.fixer.io/latest',
    free: false // Requires API key
  }
]

/**
 * Fetch exchange rates from a free API
 */
async function fetchFromAPI(): Promise<ExchangeRates | null> {
  try {
    // Try ExchangeRate-API (free, no API key required)
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD')
    
    if (!response.ok) {
      throw new Error(`API response not ok: ${response.status}`)
    }
    
    const data = await response.json()
    
    if (!data.rates) {
      throw new Error('Invalid API response format')
    }
    
    const { EUR, INR } = data.rates
    
    if (!EUR || !INR) {
      throw new Error('Missing required currency rates')
    }
    
    // Calculate all exchange rates
    const rates: ExchangeRates = {
      USD_EUR: EUR,
      USD_INR: INR,
      EUR_USD: 1 / EUR,
      EUR_INR: INR / EUR,
      INR_USD: 1 / INR,
      INR_EUR: EUR / INR
    }
    
    return rates
  } catch (error) {
    console.error('Failed to fetch exchange rates from API:', error)
    return null
  }
}

/**
 * Get current exchange rates (with fallback)
 */
export async function getCurrentExchangeRates(): Promise<{
  rates: ExchangeRates;
  source: 'api' | 'fallback';
  lastUpdated: string;
}> {
  try {
    const apiRates = await fetchFromAPI()
    
    if (apiRates) {
      return {
        rates: apiRates,
        source: 'api',
        lastUpdated: new Date().toISOString()
      }
    }
  } catch (error) {
    console.error('Error fetching real-time rates:', error)
  }
  
  // Fallback to static rates
  return {
    rates: fallbackRates,
    source: 'fallback',
    lastUpdated: new Date().toISOString()
  }
}

/**
 * Update exchange rates with retry logic
 */
export async function updateExchangeRates(
  retries: number = 3
): Promise<{
  success: boolean;
  rates?: ExchangeRates;
  source?: 'api' | 'fallback';
  error?: string;
}> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await getCurrentExchangeRates()
      return {
        success: true,
        rates: result.rates,
        source: result.source
      }
    } catch (error) {
      console.error(`Exchange rate update attempt ${attempt} failed:`, error)
      
      if (attempt === retries) {
        return {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000))
    }
  }
  
  return {
    success: false,
    error: 'All retry attempts failed'
  }
}

/**
 * Check if rates need updating (older than 1 hour)
 */
export function shouldUpdateRates(lastUpdated: string): boolean {
  const lastUpdate = new Date(lastUpdated)
  const now = new Date()
  const hoursDiff = (now.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60)
  
  return hoursDiff >= 1 // Update if older than 1 hour
}

/**
 * Format exchange rate for display
 */
export function formatExchangeRate(rate: number, precision: number = 4): string {
  return rate.toFixed(precision)
}

/**
 * Get exchange rate description
 */
export function getExchangeRateDescription(
  fromCurrency: string,
  toCurrency: string,
  rate: number
): string {
  return `1 ${fromCurrency} = ${formatExchangeRate(rate)} ${toCurrency}`
} 