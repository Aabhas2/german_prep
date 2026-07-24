import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ToastProvider } from '@/components/ui/Toast'
import { MigrationBanner } from '@/components/ui/MigrationBanner'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'UniRoute DE — German Study Abroad Planner',
  description: 'Your personalized German study abroad preparation dashboard — track university applications, Blocked Account (Sperrkonto), APS, visa, exams, and housing.',
  keywords: 'study abroad, Germany, university application, visa, Sperrkonto, APS, dMAT, academic planner, UniRoute DE',
  icons: {
    icon: '/uni.png',
    shortcut: '/uni.png',
    apple: '/uni.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={inter.variable}
        style={{ fontFamily: 'var(--font-inter), Inter, system-ui, sans-serif' }}
        suppressHydrationWarning
      >
        <AuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <MigrationBanner />
              {children}
              <Analytics />
              <SpeedInsights />
            </ToastProvider>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}