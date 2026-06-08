'use client'

import { useState } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Bell, Download, Trash2, Moon, Sun, Settings as SettingsIcon, Palette, Zap, DollarSign, RefreshCw } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { countriesConfig } from '@/data/countries'
import { dbTasks } from '@/lib/db'
import { updateExchangeRates, formatExchangeRate } from '@/lib/exchangeRates'

export default function SettingsPage() {
  const { settings, updateSettings } = useTheme()
  const [isUpdatingRates, setIsUpdatingRates] = useState(false)
  const [rateUpdateStatus, setRateUpdateStatus] = useState<string>('')

  const { user } = useAuth()

  const handlePersonalDetailsChange = async (field: string, value: string) => {
    updateSettings({
      ...settings,
      personalDetails: {
        ...settings.personalDetails,
        [field]: value
      }
    })

    if (field === 'targetCountry') {
      const config = countriesConfig[value]
      if (config && confirm(`Would you like to import the standard 2026-2027 preparation phases and milestones for ${value} into your task manager?`)) {
        const newTasks = config.stages.map((stage, idx) => ({
          title: stage.title,
          description: `${stage.phase}: ${stage.description}`,
          category: 'Preparation',
          priority: 'Medium' as const,
          status: 'To Do' as const,
          dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + idx + 1, 1)
        }))

        if (user) {
          try {
            await Promise.all(newTasks.map(t => dbTasks.add(user.uid, t)))
            alert('Tasks successfully synced to Cloud Firestore!')
          } catch (e) {
            console.error('Failed to sync tasks to cloud:', e)
          }
        } else {
          try {
            const savedTasks = JSON.parse(localStorage.getItem('tasks') || '[]')
            const tasksWithIds = newTasks.map((t, idx) => ({
              ...t,
              id: `stage-${Date.now()}-${idx}`,
              createdAt: new Date()
            }))
            localStorage.setItem('tasks', JSON.stringify([...savedTasks, ...tasksWithIds]))
            alert('Tasks successfully imported to local storage!')
          } catch (e) {
            console.error('Failed to save tasks locally:', e)
          }
        }
      }
    }
  }

  const handleSettingChange = (section: keyof typeof settings, field: string, value: any) => {
    if (section === 'currency') {
      updateSettings({
        ...settings,
        currency: {
          ...settings.currency,
          [field]: value
        }
      })
    } else if (section === 'dashboard') {
      updateSettings({
        ...settings,
        dashboard: {
          ...settings.dashboard,
          [field]: value
        }
      })
    } else if (section === 'notifications') {
      updateSettings({
        ...settings,
        notifications: {
          ...settings.notifications,
          [field]: value
        }
      })
    } else if (section === 'data') {
      updateSettings({
        ...settings,
        data: {
          ...settings.data,
          [field]: value
        }
      })
    } else if (section === 'tasks') {
      updateSettings({
        ...settings,
        tasks: {
          ...settings.tasks,
          [field]: value
        }
      })
    } else if (section === 'universities') {
      updateSettings({
        ...settings,
        universities: {
          ...settings.universities,
          [field]: value
        }
      })
    } else if (section === 'finance') {
      updateSettings({
        ...settings,
        finance: {
          ...settings.finance,
          [field]: value
        }
      })
    } else if (section === 'appearance') {
      updateSettings({
        ...settings,
        appearance: {
          ...settings.appearance,
          [field]: value
        }
      })
    }
  }

  const handleSaveSettings = () => {
    alert('Settings saved successfully!')
  }

  const handleExportData = () => {
    // Export data as JSON
    const data = {
      settings,
      universities: JSON.parse(localStorage.getItem('universities') || '[]'),
      tasks: JSON.parse(localStorage.getItem('tasks') || '[]'),
      notes: JSON.parse(localStorage.getItem('notes') || '[]'),
      financeItems: JSON.parse(localStorage.getItem('financeItems') || '[]'),
      exams: JSON.parse(localStorage.getItem('exams') || '[]'),
      scholarships: JSON.parse(localStorage.getItem('scholarships') || '[]'),
      visaSteps: JSON.parse(localStorage.getItem('visaSteps') || '[]')
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { 
      type: settings.data.exportFormat === 'json' ? 'application/json' : 'text/csv' 
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `germany-prep-data.${settings.data.exportFormat}`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleClearData = () => {
    if (confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      localStorage.clear()
      alert('All data cleared successfully!')
      window.location.reload()
    }
  }

  const handleUpdateExchangeRates = async () => {
    setIsUpdatingRates(true)
    setRateUpdateStatus('Updating exchange rates...')
    
    try {
      const result = await updateExchangeRates()
      
      if (result.success && result.rates) {
        updateSettings({
          ...settings,
          currency: {
            ...settings.currency,
            exchangeRates: result.rates! as unknown as Record<string, number>,
            lastUpdated: new Date().toISOString()
          }
        })
        
        setRateUpdateStatus(
          result.source === 'api' 
            ? 'Exchange rates updated successfully!' 
            : 'Using fallback rates (API unavailable)'
        )
      } else {
        setRateUpdateStatus(`Failed to update rates: ${result.error}`)
      }
    } catch (error) {
      setRateUpdateStatus('Error updating exchange rates')
      console.error('Exchange rate update error:', error)
    }
    
    setIsUpdatingRates(false)
    
    // Clear status after 3 seconds
    setTimeout(() => setRateUpdateStatus(''), 3000)
  }

  const toggleAutoUpdate = () => {
    updateSettings({
      ...settings,
      currency: {
        ...settings.currency,
                  autoUpdate: !(settings.currency.autoUpdate ?? false)
      }
    })
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage your app preferences and data</p>
        </div>

        {/* Personal Details */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-gray-600" />
              <CardTitle>Personal Details</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.personalDetails.name}
                  onChange={(e) => handlePersonalDetailsChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.personalDetails.email}
                  onChange={(e) => handlePersonalDetailsChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Country
                </label>
                <select
                  value={settings.personalDetails.targetCountry}
                  onChange={(e) => handlePersonalDetailsChange('targetCountry', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="Germany">Germany</option>
                  <option value="Canada">Canada</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Austria">Austria</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Start Date
                </label>
                <input
                  type="date"
                  value={settings.personalDetails.targetStartDate}
                  onChange={(e) => handlePersonalDetailsChange('targetStartDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>App Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Theme
              </label>
              <div className="flex space-x-4">
                <button
                  onClick={() => updateSettings({ ...settings, theme: 'light' })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                    settings.theme === 'light' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  <Sun className="h-4 w-4" />
                  <span>Light</span>
                </button>
                <button
                  onClick={() => updateSettings({ ...settings, theme: 'dark' })}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md border transition-colors ${
                    settings.theme === 'dark' ? 'border-blue-500 bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-300' : 'border-gray-300 hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700'
                  }`}
                >
                  <Moon className="h-4 w-4" />
                  <span>Dark</span>
                </button>
              </div>
            </div>

            {/* Notifications */}
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Enable Notifications
                    </label>
                    <p className="text-sm text-gray-500">
                      Get notified about upcoming deadlines and tasks
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ ...settings, notifications: { ...settings.notifications, deadlineReminders: !settings.notifications.deadlineReminders } })}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.notifications.deadlineReminders ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.notifications.deadlineReminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Currency Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-gray-600" />
              <CardTitle>Currency Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Currency
              </label>
              <select
                value={settings.currency.primary}
                onChange={(e) => handleSettingChange('currency', 'primary', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="USD">US Dollar (USD)</option>
                <option value="EUR">Euro (EUR)</option>
                <option value="INR">Indian Rupee (INR)</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Display Currency Symbol
                </label>
                <p className="text-sm text-gray-500">
                  Show currency symbols in financial displays
                </p>
              </div>
              <button
                onClick={() => handleSettingChange('currency', 'displaySymbol', !settings.currency.displaySymbol)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.currency.displaySymbol ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.currency.displaySymbol ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Auto Update Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Auto-update Exchange Rates
                </label>
                <p className="text-sm text-gray-500">
                  Automatically fetch latest rates when needed
                </p>
              </div>
              <button
                onClick={toggleAutoUpdate}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    (settings.currency.autoUpdate ?? false) ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
              >
                <span
                                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      (settings.currency.autoUpdate ?? false) ? 'translate-x-6' : 'translate-x-1'
                    }`}
                />
              </button>
            </div>

            {/* Manual Update Button */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Last Updated: {settings.currency.lastUpdated ? new Date(settings.currency.lastUpdated).toLocaleString() : 'Never'}
                </p>
                {rateUpdateStatus && (
                  <p className={`text-sm mt-1 ${
                    rateUpdateStatus.includes('successfully') ? 'text-green-600' : 
                    rateUpdateStatus.includes('Failed') || rateUpdateStatus.includes('Error') ? 'text-red-600' : 
                    'text-blue-600'
                  }`}>
                    {rateUpdateStatus}
                  </p>
                )}
              </div>
              <Button
                onClick={handleUpdateExchangeRates}
                disabled={isUpdatingRates}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${isUpdatingRates ? 'animate-spin' : ''}`} />
                <span>{isUpdatingRates ? 'Updating...' : 'Update Rates'}</span>
              </Button>
            </div>

            {/* Exchange Rate Display */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Current Exchange Rates</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">USD → EUR:</span>
                  <span className="font-medium">{formatExchangeRate(settings.currency.exchangeRates['USD'] || 1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">USD → INR:</span>
                  <span className="font-medium">{formatExchangeRate(settings.currency.exchangeRates['INR'] || 1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EUR → USD:</span>
                  <span className="font-medium">{formatExchangeRate(1 / (settings.currency.exchangeRates['USD'] || 1))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">EUR → INR:</span>
                  <span className="font-medium">{formatExchangeRate(settings.currency.exchangeRates['INR'] / (settings.currency.exchangeRates['USD'] || 1))}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">INR → USD:</span>
                  <span className="font-medium">{formatExchangeRate(1 / (settings.currency.exchangeRates['INR'] || 1), 6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">INR → EUR:</span>
                  <span className="font-medium">{formatExchangeRate((settings.currency.exchangeRates['USD'] || 1) / (settings.currency.exchangeRates['INR'] || 1), 6)}</span>
                </div>
              </div>
            </div>

            {/* Manual Rate Override */}
            <details className="border border-gray-200 rounded-lg">
              <summary className="px-4 py-2 cursor-pointer text-sm font-medium text-gray-700 hover:bg-gray-50">
                Manual Rate Override (Advanced)
              </summary>
              <div className="p-4 border-t border-gray-200 space-y-4">
                <p className="text-sm text-gray-600 mb-4">
                  Manually adjust exchange rates. These will be overwritten when auto-update is enabled.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      USD → EUR
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={settings.currency.exchangeRates.USD_EUR}
                      onChange={(e) => handleSettingChange('currency', 'exchangeRates', {
                        ...settings.currency.exchangeRates,
                        USD_EUR: parseFloat(e.target.value) || 0.92
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      USD → INR
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.currency.exchangeRates.USD_INR}
                      onChange={(e) => handleSettingChange('currency', 'exchangeRates', {
                        ...settings.currency.exchangeRates,
                        USD_INR: parseFloat(e.target.value) || 83.25
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      EUR → USD
                    </label>
                    <input
                      type="number"
                      step="0.0001"
                      value={settings.currency.exchangeRates.EUR_USD}
                      onChange={(e) => handleSettingChange('currency', 'exchangeRates', {
                        ...settings.currency.exchangeRates,
                        EUR_USD: parseFloat(e.target.value) || 1.09
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      EUR → INR
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={settings.currency.exchangeRates.EUR_INR}
                      onChange={(e) => handleSettingChange('currency', 'exchangeRates', {
                        ...settings.currency.exchangeRates,
                        EUR_INR: parseFloat(e.target.value) || 90.50
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      INR → USD
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={settings.currency.exchangeRates.INR_USD}
                      onChange={(e) => handleSettingChange('currency', 'exchangeRates', {
                        ...settings.currency.exchangeRates,
                        INR_USD: parseFloat(e.target.value) || 0.012
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      INR → EUR
                    </label>
                    <input
                      type="number"
                      step="0.000001"
                      value={settings.currency.exchangeRates.INR_EUR}
                      onChange={(e) => handleSettingChange('currency', 'exchangeRates', {
                        ...settings.currency.exchangeRates,
                        INR_EUR: parseFloat(e.target.value) || 0.011
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </details>
          </CardContent>
        </Card>

        {/* Dashboard Customization */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <SettingsIcon className="h-5 w-5 text-gray-600" />
              <CardTitle>Dashboard Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show Progress Bars
                  </label>
                  <p className="text-sm text-gray-500">Display progress indicators</p>
                </div>
                <button
                  onClick={() => handleSettingChange('dashboard', 'showProgressBars', !settings.dashboard.showProgressBars)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dashboard.showProgressBars ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dashboard.showProgressBars ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show Quick Actions
                  </label>
                  <p className="text-sm text-gray-500">Display quick action buttons</p>
                </div>
                <button
                  onClick={() => handleSettingChange('dashboard', 'showQuickActions', !settings.dashboard.showQuickActions)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dashboard.showQuickActions ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dashboard.showQuickActions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show Recent Tasks
                  </label>
                  <p className="text-sm text-gray-500">Display recent task list</p>
                </div>
                <button
                  onClick={() => handleSettingChange('dashboard', 'showRecentTasks', !settings.dashboard.showRecentTasks)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dashboard.showRecentTasks ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dashboard.showRecentTasks ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show Financial Overview
                  </label>
                  <p className="text-sm text-gray-500">Display financial summary</p>
                </div>
                <button
                  onClick={() => handleSettingChange('dashboard', 'showFinancialOverview', !settings.dashboard.showFinancialOverview)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.dashboard.showFinancialOverview ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.dashboard.showFinancialOverview ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Tasks to Show
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={settings.dashboard.tasksToShow}
                onChange={(e) => handleSettingChange('dashboard', 'tasksToShow', parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Task Management Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-gray-600" />
              <CardTitle>Task Management</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Priority
                </label>
                <select
                  value={settings.tasks.defaultPriority}
                  onChange={(e) => handleSettingChange('tasks', 'defaultPriority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Default Category
                </label>
                <input
                  type="text"
                  value={settings.tasks.defaultCategory}
                  onChange={(e) => handleSettingChange('tasks', 'defaultCategory', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., General"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort Tasks By
                </label>
                <select
                  value={settings.tasks.sortBy}
                  onChange={(e) => handleSettingChange('tasks', 'sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dueDate">Due Date</option>
                  <option value="priority">Priority</option>
                  <option value="created">Created Date</option>
                  <option value="title">Title</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show Completed Tasks
                  </label>
                  <p className="text-sm text-gray-500">Display completed tasks in lists</p>
                </div>
                <button
                  onClick={() => handleSettingChange('tasks', 'showCompletedTasks', !settings.tasks.showCompletedTasks)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.tasks.showCompletedTasks ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.tasks.showCompletedTasks ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Group by Category
                  </label>
                  <p className="text-sm text-gray-500">Group tasks by their categories</p>
                </div>
                <button
                  onClick={() => handleSettingChange('tasks', 'groupByCategory', !settings.tasks.groupByCategory)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.tasks.groupByCategory ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.tasks.groupByCategory ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Palette className="h-5 w-5 text-gray-600" />
              <CardTitle>Appearance</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color Scheme
              </label>
              <div className="flex space-x-2">
                {['blue', 'green', 'purple', 'red', 'orange'].map((color) => (
                  <button
                    key={color}
                    onClick={() => handleSettingChange('appearance', 'colorScheme', color)}
                    className={`w-8 h-8 rounded-full bg-${color}-500 border-2 transition-all ${
                      settings.appearance.colorScheme === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Font Size
              </label>
              <select
                value={settings.appearance.fontSize}
                onChange={(e) => handleSettingChange('appearance', 'fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Compact Mode
                  </label>
                  <p className="text-sm text-gray-500">Reduce spacing and padding</p>
                </div>
                <button
                  onClick={() => handleSettingChange('appearance', 'compactMode', !settings.appearance.compactMode)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.appearance.compactMode ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.appearance.compactMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Show Animations
                  </label>
                  <p className="text-sm text-gray-500">Enable smooth transitions</p>
                </div>
                <button
                  onClick={() => handleSettingChange('appearance', 'showAnimations', !settings.appearance.showAnimations)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    settings.appearance.showAnimations ? 'bg-blue-600' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      settings.appearance.showAnimations ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" onClick={handleExportData} className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Button variant="outline" className="flex items-center justify-center">
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                variant="outline" 
                onClick={handleClearData}
                className="flex items-center justify-center text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Data
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              Export your data for backup or sharing. Clear all data will permanently delete all your information.
            </p>
          </CardContent>
        </Card>

        {/* Save Settings */}
        <div className="flex justify-end">
          <Button onClick={handleSaveSettings} className="px-8">
            Save Settings
          </Button>
        </div>

        {/* App Information */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-gray-600">
              <p><strong>Germany Prep Hub</strong> v1.0.0</p>
              <p>A comprehensive study abroad preparation dashboard</p>
              <p>Built with Next.js, TypeScript, and Tailwind CSS</p>
              <p className="pt-4 border-t border-gray-200">
                This app helps you organize and track all aspects of your study abroad preparation journey to Germany.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
} 