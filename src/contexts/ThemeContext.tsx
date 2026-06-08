'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { dbSettings } from '@/lib/db'
import { Settings } from '@/types'



export const defaultSettings: Settings = {
  theme: 'system',
  personalDetails: {
    name: '',
    email: '',
    targetCountry: 'Germany',
    targetStartDate: ''
  },
  currency: {
    primary: 'EUR',
    secondary: 'USD',
    displaySymbol: true,
    exchangeRates: {
      EUR: 1,
      USD: 1.1,
      GBP: 0.85,
      INR: 90
    },
    lastUpdated: new Date().toISOString(),
    autoUpdate: false
  },
  dashboard: {
    showProgressBars: true,
    showRecentTasks: true,
    showFinancialOverview: true,
    showQuickActions: true,
    tasksToShow: 5
  },
  notifications: {
    deadlineReminders: true,
    taskUpdates: true,
    emailNotifications: false
  },
  tasks: {
    defaultPriority: 'Medium',
    defaultCategory: 'General',
    showCompletedTasks: true,
    autoArchiveCompleted: false,
    sortBy: 'dueDate',
    groupByCategory: false
  },
  universities: {
    defaultLanguage: 'English',
    showDeadlineWarnings: true,
    warningDaysBefore: 30,
    sortBy: 'deadline',
    showOnlyActive: false
  },
  finance: {
    budgetWarningThreshold: 80,
    showCategoryBreakdown: true,
    defaultCategory: 'Other',
    trackActualAmounts: true,
    showCurrencyConverter: true
  },
  appearance: {
    compactMode: false,
    showAnimations: true,
    fontSize: 'medium',
    colorScheme: 'blue',
    sidebarCollapsed: false
  },
  data: {
    autoSave: true,
    backupFrequency: 'weekly',
    exportFormat: 'json',
    syncEnabled: false
  }
}

interface ThemeContextType {
  settings: Settings
  updateSettings: (newSettings: Partial<Settings>) => void
  resetSettings: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings)
  const [mounted, setMounted] = useState(false)
  const { user } = useAuth()

  // Load settings on mount
  useEffect(() => {
    setMounted(true)

    try {
      const savedSettings = localStorage.getItem('settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        setSettings({ ...defaultSettings, ...parsed })
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    }
  }, [])

  // Sync settings from Firebase if user is logged in
  useEffect(() => {
    if (!mounted || !user) return

    const loadCloudSettings = async () => {
      try {
        const cloudSettings = await dbSettings.fetch(user.uid)
        if (cloudSettings) {
          setSettings(cloudSettings)
        } else {
          // If no settings exist in cloud, write current settings
          await dbSettings.update(user.uid, settings)
        }
      } catch (error) {
        console.error('Error loading settings from cloud:', error)
      }
    }

    loadCloudSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mounted])

  // Save settings when they change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem('settings', JSON.stringify(settings))
        if (user) {
          dbSettings.update(user.uid, settings)
        }
      } catch (error) {
        console.error('Error saving settings:', error)
      }
    }
  }, [settings, mounted, user])

  // Apply theme to document
  useEffect(() => {
    if (!mounted) return

    const applyTheme = () => {
      const root = document.documentElement

      if (settings.theme === 'system') {
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        root.classList.toggle('dark', systemPrefersDark)
      } else {
        root.classList.toggle('dark', settings.theme === 'dark')
      }
    }

    applyTheme()

    if (settings.theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', applyTheme)
      return () => mediaQuery.removeEventListener('change', applyTheme)
    }
  }, [settings.theme, mounted])

  const updateSettings = (newSettings: Partial<Settings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }

  const resetSettings = () => {
    setSettings(defaultSettings)
  }

  // Always render children, even during SSR
  return (
    <ThemeContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
} 