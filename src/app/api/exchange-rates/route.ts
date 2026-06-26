import { NextResponse } from 'next/server'

// Free exchange rate API — no key needed
const API_URL = 'https://open.er-api.com/v6/latest/EUR'

const FALLBACK_RATES = {
  USD: 1.09,
  INR: 90.5,
  GBP: 0.86,
  EUR: 1,
}

export async function GET() {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: 3600 }, // Cache 1 hour at the edge
    })

    if (!res.ok) {
      return NextResponse.json(
        { rates: FALLBACK_RATES, source: 'fallback', error: `API returned ${res.status}` },
        { status: 200 }
      )
    }

    const data = await res.json()

    if (data.result === 'success' && data.rates) {
      return NextResponse.json({
        rates: {
          USD: data.rates.USD,
          INR: data.rates.INR,
          GBP: data.rates.GBP,
          EUR: 1,
        },
        source: 'api',
        lastUpdated: data.time_last_update_utc,
      })
    }

    return NextResponse.json({ rates: FALLBACK_RATES, source: 'fallback' })
  } catch (err: any) {
    return NextResponse.json(
      { rates: FALLBACK_RATES, source: 'fallback', error: err.message },
      { status: 200 } // Always 200 — caller uses fallback gracefully
    )
  }
}
