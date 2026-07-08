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

  // Load settings on mount — deep merge so nested keys from new features are never lost
  useEffect(() => {
    setMounted(true)

    try {
      const savedSettings = localStorage.getItem('settings')
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        // Bug #5 fix: deep merge each sub-object so missing nested keys fall back to defaults
        setSettings(prev => ({
          ...prev,
          ...parsed,
          personalDetails: { ...prev.personalDetails, ...(parsed.personalDetails ?? {}) },
          currency:        { ...prev.currency,        ...(parsed.currency        ?? {}) },
          dashboard:       { ...prev.dashboard,       ...(parsed.dashboard       ?? {}) },
          notifications:   { ...prev.notifications,   ...(parsed.notifications   ?? {}) },
          tasks:           { ...prev.tasks,           ...(parsed.tasks           ?? {}) },
          universities:    { ...prev.universities,    ...(parsed.universities    ?? {}) },
          finance:         { ...prev.finance,         ...(parsed.finance         ?? {}) },
          appearance:      { ...prev.appearance,      ...(parsed.appearance      ?? {}) },
          data:            { ...prev.data,            ...(parsed.data            ?? {}) },
        }))
      }
    } catch (error) {
      console.error('Error loading settings from localStorage:', error)
    }
  }, [])

  // Sync settings from Firebase when user logs in
  useEffect(() => {
    if (!mounted || !user) return

    const loadCloudSettings = async () => {
      try {
        const cloudSettings = await dbSettings.fetch(user.uid)
        if (cloudSettings) {
          // Bug #6 fix: cloud settings exist — deep merge with defaults and apply
          setSettings(prev => ({
            ...prev,
            ...cloudSettings,
            personalDetails: { ...prev.personalDetails, ...(cloudSettings.personalDetails ?? {}) },
            currency:        { ...prev.currency,        ...(cloudSettings.currency        ?? {}) },
            dashboard:       { ...prev.dashboard,       ...(cloudSettings.dashboard       ?? {}) },
            notifications:   { ...prev.notifications,   ...(cloudSettings.notifications   ?? {}) },
            tasks:           { ...prev.tasks,           ...(cloudSettings.tasks           ?? {}) },
            universities:    { ...prev.universities,    ...(cloudSettings.universities    ?? {}) },
            finance:         { ...prev.finance,         ...(cloudSettings.finance         ?? {}) },
            appearance:      { ...prev.appearance,      ...(cloudSettings.appearance      ?? {}) },
            data:            { ...prev.data,            ...(cloudSettings.data            ?? {}) },
          }))
        } else {
          // Bug #6 fix: no cloud settings yet — write current local settings to cloud (safe first-login)
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

  // Apply dark/light theme to document
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

  // Bug #16 fix: Apply color scheme CSS variables globally on every load/change
  // so all pages get the correct palette without waiting for the Settings page to mount.
  useEffect(() => {
    if (!mounted) return

    const schemes: Record<string, Record<string, string>> = {
      burgundy: { '--primary': '0 50% 40%',   '--accent': '15 60% 45%' },
      ocean:    { '--primary': '210 65% 45%',  '--accent': '185 55% 40%' },
      forest:   { '--primary': '150 45% 35%',  '--accent': '90 40% 38%' },
      slate:    { '--primary': '215 25% 45%',  '--accent': '200 30% 42%' },
      rose:     { '--primary': '340 60% 45%',  '--accent': '310 45% 42%' },
      amber:    { '--primary': '38 75% 42%',   '--accent': '25 70% 45%' },
    }

    const scheme = schemes[settings.appearance?.colorScheme]
    if (scheme) {
      const root = document.documentElement
      Object.entries(scheme).forEach(([key, val]) => root.style.setProperty(key, val))
    }
  }, [settings.appearance?.colorScheme, mounted])

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