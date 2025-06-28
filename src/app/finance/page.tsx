'use client'

import { useState, useEffect, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Plus, DollarSign, TrendingUp, TrendingDown, CheckCircle, X, Edit, Settings, Target, Trash2 } from 'lucide-react'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { mockFinanceItems, mockSavingsGoals } from '@/data/mockData'
import { FinanceItem, SavingsGoal, AppSettings } from '@/types'
import { formatCurrency, convertCurrency, defaultSettings, formatDate } from '@/lib/utils'
import { ClientCurrency } from '@/components/ui/ClientCurrency'
import { SavingsForm } from '@/components/forms/SavingsForm'
import { Modal } from '@/components/ui/Modal'
import { Loading } from '@/components/ui/Loading'
import { useIsClient } from '@/hooks/useIsClient'

export default function FinancePage() {
  const isClient = useIsClient()
  const [financeItems, setFinanceItems] = useLocalStorage<FinanceItem[]>('financeItems', mockFinanceItems)
  const [savingsGoals, setSavingsGoals] = useLocalStorage<SavingsGoal[]>('savingsGoals', mockSavingsGoals)
  const [settings, setSettings] = useLocalStorage<AppSettings>('appSettings', defaultSettings)
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'EUR' | 'INR'>('EUR')
  const [toCurrency, setToCurrency] = useState<'USD' | 'EUR' | 'INR'>('USD')
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false)
  const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | undefined>()

  const getCategoryColor = (category: FinanceItem['category']) => {
    switch (category) {
      case 'Application': return 'bg-blue-100 text-blue-800'
      case 'Travel': return 'bg-green-100 text-green-800'
      case 'Tuition': return 'bg-purple-100 text-purple-800'
      case 'Living': return 'bg-yellow-100 text-yellow-800'
      case 'Other': return 'bg-gray-100 text-gray-800'
    }
  }

  // Convert all amounts to primary currency
  const convertAmount = (amount: number) => {
    return convertCurrency(amount, 'EUR', settings.currency.primary, settings.currency.exchangeRates)
  }

  const totalEstimated = financeItems.reduce((sum, item) => sum + convertAmount(item.estimatedAmount), 0)
  const totalActual = financeItems.reduce((sum, item) => sum + convertAmount(item.actualAmount || 0), 0)
  const totalPaid = financeItems.filter(item => item.paid).reduce((sum, item) => sum + convertAmount(item.actualAmount || item.estimatedAmount), 0)
  const totalRemaining = totalEstimated - totalPaid

  const categoryTotals = financeItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = { estimated: 0, actual: 0, paid: 0 }
    }
    acc[item.category].estimated += convertAmount(item.estimatedAmount)
    acc[item.category].actual += convertAmount(item.actualAmount || 0)
    acc[item.category].paid += item.paid ? convertAmount(item.actualAmount || item.estimatedAmount) : 0
    return acc
  }, {} as Record<string, { estimated: number; actual: number; paid: number }>)

  const handleTogglePaid = (id: string) => {
    setFinanceItems(prev => prev.map(item => 
      item.id === id ? { ...item, paid: !item.paid } : item
    ))
  }

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      setFinanceItems(prev => prev.filter(item => item.id !== id))
    }
  }

  const handleUpdateActualAmount = (id: string, actualAmount: number) => {
    setFinanceItems(prev => prev.map(item => 
      item.id === id ? { ...item, actualAmount } : item
    ))
  }

  const handleAddExpense = () => {
    const description = prompt('Enter expense description:')
    const amount = prompt('Enter estimated amount:')
    const category = prompt('Enter category (Application/Travel/Tuition/Living/Other):')
    
    if (description && amount && category) {
      const newExpense: FinanceItem = {
        id: Date.now().toString(),
        description: description.trim(),
        estimatedAmount: parseFloat(amount),
        category: category as FinanceItem['category'],
        currency: 'EUR',
        paid: false
      }
      setFinanceItems(prev => [...prev, newExpense])
    }
  }

  const handleCurrencyChange = (newCurrency: string) => {
    setSettings(prev => ({
      ...prev,
      currency: {
        ...prev.currency,
        primary: newCurrency
      }
    }))
  }

  const convertCurrencyAmount = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return 0
    
    return convertCurrency(numAmount, fromCurrency, toCurrency, settings.currency.exchangeRates)
  }

  // Savings goal handlers
  const handleAddSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setSavingsGoals(prev => [...prev, newGoal])
    setIsSavingsModalOpen(false)
  }

  const handleEditSavingsGoal = (goal: SavingsGoal) => {
    setEditingSavingsGoal(goal)
    setIsSavingsModalOpen(true)
  }

  const handleUpdateSavingsGoal = (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    if (!editingSavingsGoal) return
    
    const updatedGoal: SavingsGoal = {
      ...goalData,
      id: editingSavingsGoal.id,
      createdAt: editingSavingsGoal.createdAt
    }
    setSavingsGoals(prev => prev.map(goal => goal.id === editingSavingsGoal.id ? updatedGoal : goal))
    setIsSavingsModalOpen(false)
    setEditingSavingsGoal(undefined)
  }

  const handleDeleteSavingsGoal = (id: string) => {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      setSavingsGoals(prev => prev.filter(goal => goal.id !== id))
    }
  }

  const handleUpdateSavingsAmount = (id: string, newAmount: number) => {
    setSavingsGoals(prev => prev.map(goal => 
      goal.id === id ? { ...goal, currentAmount: newAmount } : goal
    ))
  }

  // Calculate total savings
  const totalSavingsTarget = savingsGoals.reduce((sum, goal) => sum + convertCurrency(goal.targetAmount, goal.currency as any, settings.currency.primary, settings.currency.exchangeRates), 0)
  const totalSavingsCurrent = savingsGoals.reduce((sum, goal) => sum + convertCurrency(goal.currentAmount, goal.currency as any, settings.currency.primary, settings.currency.exchangeRates), 0)

  if (!isClient) {
    return (
      <Layout>
        <Loading text="Loading your finances..." />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Finance Planner</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your study abroad expenses and budget</p>
          </div>
          <div className="flex items-center space-x-4">
            <CurrencyToggle
              currentCurrency={settings.currency.primary}
              onCurrencyChange={handleCurrencyChange}
            />
            <Button variant="outline" onClick={handleAddExpense}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expense
            </Button>
            <Button onClick={() => setIsSavingsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Savings Goal
            </Button>
          </div>
        </div>

        {/* Financial Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Estimated</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <ClientCurrency 
                    amount={totalEstimated} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-green-600">
                  <ClientCurrency 
                    amount={totalPaid} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Remaining</p>
                <p className="text-2xl font-bold text-red-600">
                  <ClientCurrency 
                    amount={totalRemaining} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Progress</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round((totalPaid / totalEstimated) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>
        </div>

        {/* Budget Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar 
              value={totalPaid} 
              max={totalEstimated} 
              label="Overall Budget Usage"
              className="mb-6"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(categoryTotals).map(([category, totals]) => (
                <div key={category} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{category}</span>
                    <span className="text-sm text-gray-500">
                      <ClientCurrency 
                        amount={totals.paid} 
                        currency={settings.currency.primary} 
                        showSymbol={settings.currency.displaySymbol}
                      /> / <ClientCurrency 
                        amount={totals.estimated} 
                        currency={settings.currency.primary} 
                        showSymbol={settings.currency.displaySymbol}
                      />
                    </span>
                  </div>
                  <ProgressBar 
                    value={totals.paid} 
                    max={totals.estimated} 
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Expense List */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Description</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Estimated</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-600">Actual</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {financeItems.map((item) => (
                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium text-gray-900">{item.description}</div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge className={getCategoryColor(item.category)}>
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        <ClientCurrency 
                          amount={convertAmount(item.estimatedAmount)} 
                          currency={settings.currency.primary} 
                          showSymbol={settings.currency.displaySymbol}
                        />
                      </td>
                      <td className="py-3 px-4 text-right font-medium">
                        {item.actualAmount ? (
                          <ClientCurrency 
                            amount={convertAmount(item.actualAmount)} 
                            currency={settings.currency.primary} 
                            showSymbol={settings.currency.displaySymbol}
                          />
                        ) : '-'}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.paid ? (
                          <Badge variant="success">Paid</Badge>
                        ) : (
                          <Badge variant="warning">Pending</Badge>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex justify-center space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleTogglePaid(item.id)}
                            className={item.paid ? "text-green-600" : "text-blue-600"}
                          >
                            {item.paid ? 'Mark Unpaid' : 'Mark Paid'}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-red-600"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Currency Converter */}
        <Card>
          <CardHeader>
            <CardTitle>Currency Converter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Enter amount"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as 'USD' | 'EUR' | 'INR')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as 'USD' | 'EUR' | 'INR')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-center text-lg font-medium text-gray-900">
                Converted Amount: <ClientCurrency 
                  amount={convertCurrencyAmount()} 
                  currency={toCurrency} 
                  showSymbol={true}
                />
              </p>
              <p className="text-center text-sm text-gray-600 mt-1">
                Exchange rates are indicative and may vary (1 EUR = {settings.currency.exchangeRates.EUR_USD.toFixed(2)} USD, 1 EUR = {settings.currency.exchangeRates.EUR_INR.toFixed(2)} INR)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Savings Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
          </CardHeader>
          <CardContent>
            {savingsGoals.length === 0 ? (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No savings goals yet</h3>
                <p className="text-gray-600 mb-4">Start by setting your first savings goal</p>
                <Button onClick={() => setIsSavingsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Savings Goal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Target</p>
                    <p className="text-2xl font-bold text-blue-600">
                      <ClientCurrency 
                        amount={totalSavingsTarget} 
                        currency={settings.currency.primary} 
                        showSymbol={settings.currency.displaySymbol}
                      />
                    </p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600">Total Saved</p>
                    <p className="text-2xl font-bold text-green-600">
                      <ClientCurrency 
                        amount={totalSavingsCurrent} 
                        currency={settings.currency.primary} 
                        showSymbol={settings.currency.displaySymbol}
                      />
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {savingsGoals.map((goal) => {
                    const progress = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)
                    const convertedTarget = convertCurrency(goal.targetAmount, goal.currency as any, settings.currency.primary, settings.currency.exchangeRates)
                    const convertedCurrent = convertCurrency(goal.currentAmount, goal.currency as any, settings.currency.primary, settings.currency.exchangeRates)
                    
                    return (
                      <div key={goal.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-gray-900">{goal.title}</h4>
                            {goal.description && (
                              <p className="text-sm text-gray-600">{goal.description}</p>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleEditSavingsGoal(goal)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteSavingsGoal(goal.id)}
                              className="text-red-600"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{progress.toFixed(1)}%</span>
                          </div>
                          <ProgressBar value={progress} />
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>
                              <ClientCurrency 
                                amount={convertedCurrent} 
                                currency={settings.currency.primary} 
                                showSymbol={settings.currency.displaySymbol}
                              />
                            </span>
                            <span>
                              <ClientCurrency 
                                amount={convertedTarget} 
                                currency={settings.currency.primary} 
                                showSymbol={settings.currency.displaySymbol}
                              />
                            </span>
                          </div>
                          {goal.deadline && (
                            <p className="text-xs text-gray-500">
                              Target Date: {formatDate(goal.deadline)}
                            </p>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Savings Goal Modal */}
        <Modal
          isOpen={isSavingsModalOpen}
          onClose={() => {
            setIsSavingsModalOpen(false)
            setEditingSavingsGoal(undefined)
          }}
          title={editingSavingsGoal ? 'Edit Savings Goal' : 'Add New Savings Goal'}
        >
          <SavingsForm
            savingsGoal={editingSavingsGoal}
            onSubmit={editingSavingsGoal ? handleUpdateSavingsGoal : handleAddSavingsGoal}
            onCancel={() => {
              setIsSavingsModalOpen(false)
              setEditingSavingsGoal(undefined)
            }}
          />
        </Modal>
      </div>
    </Layout>
  )
} 