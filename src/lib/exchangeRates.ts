// Exchange rate utilities — fetches from /api/exchange-rates (server route)
// which proxies to free open.er-api.com with no key required

export interface ExchangeRateResult {
  success: boolean
  rates?: { USD: number; INR: number; GBP: number; [key: string]: number }
  error?: string
  source?: 'api' | 'fallback'
}

// Fallback rates used when API is unavailable
export const FALLBACK_RATES = {
  USD: 1.14,
  INR: 109.88,
  GBP: 0.86,
  EUR: 1,
}

export async function updateExchangeRates(): Promise<ExchangeRateResult> {
  try {
    const res = await fetch('/api/exchange-rates', { cache: 'no-store' })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const data = await res.json()
    if (data.rates) {
      return { success: true, rates: data.rates, source: 'api' }
    }
    return { success: true, rates: FALLBACK_RATES, source: 'fallback' }
  } catch (e: any) {
    return { success: true, rates: FALLBACK_RATES, source: 'fallback', error: e.message }
  }
}

export function formatExchangeRate(rate: number, decimals = 4): string {
  if (!rate || isNaN(rate)) return '—'
  return rate.toFixed(decimals)
}