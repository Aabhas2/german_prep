'use client'

import { useState, useEffect, useMemo } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Plus, DollarSign, TrendingUp, TrendingDown, CheckCircle, X, Edit, Settings, Target, Trash2 } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { CurrencyToggle } from '@/components/ui/CurrencyToggle'
import { mockFinanceItems, mockSavingsGoals } from '@/data/mockData'
import { FinanceItem, SavingsGoal } from '@/types'
import { dbFinance, dbSavingsGoals } from '@/lib/db'
import { formatCurrency, convertCurrency, formatDate } from '@/lib/utils'
import { ClientCurrency } from '@/components/ui/ClientCurrency'
import { SavingsForm } from '@/components/forms/SavingsForm'
import { Modal } from '@/components/ui/Modal'
import { Loading } from '@/components/ui/Loading'
import { useIsClient } from '@/hooks/useIsClient'

export default function FinancePage() {
  const isClient = useIsClient()
  const { settings, updateSettings } = useTheme()
  const { user } = useAuth()
  
  const [financeItems, setFinanceItems] = useState<FinanceItem[]>([])
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([])
  const [amount, setAmount] = useState('')
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'EUR' | 'INR'>('EUR')
  const [toCurrency, setToCurrency] = useState<'USD' | 'EUR' | 'INR'>('USD')
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false)
  const [editingSavingsGoal, setEditingSavingsGoal] = useState<SavingsGoal | undefined>()
  const [mounted, setMounted] = useState(false)

  // Load data on mount / auth state change
  useEffect(() => {
    setMounted(true)
    
    const loadFinances = async () => {
      if (user) {
        try {
          const [cloudFinance, cloudSavings] = await Promise.all([
            dbFinance.fetch(user.uid),
            dbSavingsGoals.fetch(user.uid)
          ])
          setFinanceItems(cloudFinance)
          setSavingsGoals(cloudSavings)
        } catch (error) {
          console.error('Error fetching finance data from cloud:', error)
        }
      } else {
        try {
          const savedItems = localStorage.getItem('financeItems')
          const savedSavings = localStorage.getItem('savingsGoals')
          
          setFinanceItems(savedItems ? JSON.parse(savedItems) : mockFinanceItems)
          setSavingsGoals(savedSavings ? JSON.parse(savedSavings).map((goal: any) => ({
            ...goal,
            deadline: goal.deadline ? new Date(goal.deadline) : undefined,
            createdAt: goal.createdAt ? new Date(goal.createdAt) : new Date()
          })) : mockSavingsGoals)
        } catch (error) {
          console.error('Error loading finance data:', error)
          setFinanceItems(mockFinanceItems)
          setSavingsGoals(mockSavingsGoals)
        }
      }
    }

    loadFinances()
  }, [user])

  // Save changes locally (guest mode only)
  useEffect(() => {
    if (mounted && !user) {
      localStorage.setItem('financeItems', JSON.stringify(financeItems))
      localStorage.setItem('savingsGoals', JSON.stringify(savingsGoals))
    }
  }, [financeItems, savingsGoals, mounted, user])

  const getCategoryColor = (category: FinanceItem['category']) => {
    switch (category) {
      case 'Application': return 'status-info'
      case 'Travel':      return 'status-success'
      case 'Tuition':     return 'bg-primary/10 text-primary border border-primary/20'
      case 'Living':      return 'status-warning'
      case 'Other':       return 'status-neutral'
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

  const handleTogglePaid = async (id: string) => {
    const matched = financeItems.find(item => item.id === id)
    if (!matched) return

    const updated = { ...matched, paid: !matched.paid }

    if (user) {
      try {
        await dbFinance.update(user.uid, updated)
        setFinanceItems(prev => prev.map(item => item.id === id ? updated : item))
      } catch (error) {
        console.error('Error toggling paid state:', error)
      }
    } else {
      setFinanceItems(prev => prev.map(item => item.id === id ? updated : item))
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      if (user) {
        try {
          await dbFinance.delete(user.uid, id)
          setFinanceItems(prev => prev.filter(item => item.id !== id))
        } catch (error) {
          console.error('Error deleting expense:', error)
        }
      } else {
        setFinanceItems(prev => prev.filter(item => item.id !== id))
      }
    }
  }

  const handleUpdateActualAmount = async (id: string, actualAmount: number) => {
    const matched = financeItems.find(item => item.id === id)
    if (!matched) return

    const updated = { ...matched, actualAmount }

    if (user) {
      try {
        await dbFinance.update(user.uid, updated)
        setFinanceItems(prev => prev.map(item => item.id === id ? updated : item))
      } catch (error) {
        console.error('Error updating actual amount:', error)
      }
    } else {
      setFinanceItems(prev => prev.map(item => item.id === id ? updated : item))
    }
  }

  const handleAddExpense = async () => {
    const description = prompt('Enter expense description:')
    const amount = prompt('Enter estimated amount:')
    const category = prompt('Enter category (Application/Travel/Tuition/Living/Other):')
    
    if (description && amount && category) {
      const data: Omit<FinanceItem, 'id'> = {
        description: description.trim(),
        estimatedAmount: parseFloat(amount),
        category: category as FinanceItem['category'],
        currency: 'EUR',
        paid: false
      }

      if (user) {
        try {
          const added = await dbFinance.add(user.uid, data)
          setFinanceItems(prev => [...prev, added])
        } catch (error) {
          console.error('Error adding expense:', error)
        }
      } else {
        const newExpense: FinanceItem = {
          ...data,
          id: Date.now().toString()
        }
        setFinanceItems(prev => [...prev, newExpense])
      }
    }
  }

  const handleCurrencyChange = (newCurrency: string) => {
    updateSettings({
      ...settings,
      currency: {
        ...settings.currency,
        primary: newCurrency
      }
    })
  }

  const convertCurrencyAmount = () => {
    const numAmount = parseFloat(amount)
    if (isNaN(numAmount)) return 0
    
    return convertCurrency(numAmount, fromCurrency, toCurrency, settings.currency.exchangeRates)
  }

  // Savings goal handlers
  const handleAddSavingsGoal = async (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    if (user) {
      try {
        const added = await dbSavingsGoals.add(user.uid, goalData)
        setSavingsGoals(prev => [...prev, added])
      } catch (error) {
        console.error('Error adding savings goal:', error)
      }
    } else {
      const newGoal: SavingsGoal = {
        ...goalData,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      setSavingsGoals(prev => [...prev, newGoal])
    }
    setIsSavingsModalOpen(false)
  }

  const handleEditSavingsGoal = (goal: SavingsGoal) => {
    setEditingSavingsGoal(goal)
    setIsSavingsModalOpen(true)
  }

  const handleUpdateSavingsGoal = async (goalData: Omit<SavingsGoal, 'id' | 'createdAt'>) => {
    if (!editingSavingsGoal) return
    
    const updatedGoal: SavingsGoal = {
      ...goalData,
      id: editingSavingsGoal.id,
      createdAt: editingSavingsGoal.createdAt
    }

    if (user) {
      try {
        await dbSavingsGoals.update(user.uid, updatedGoal)
        setSavingsGoals(prev => prev.map(goal => goal.id === editingSavingsGoal.id ? updatedGoal : goal))
      } catch (error) {
        console.error('Error updating savings goal:', error)
      }
    } else {
      setSavingsGoals(prev => prev.map(goal => goal.id === editingSavingsGoal.id ? updatedGoal : goal))
    }
    setIsSavingsModalOpen(false)
    setEditingSavingsGoal(undefined)
  }

  const handleDeleteSavingsGoal = async (id: string) => {
    if (confirm('Are you sure you want to delete this savings goal?')) {
      if (user) {
        try {
          await dbSavingsGoals.delete(user.uid, id)
          setSavingsGoals(prev => prev.filter(goal => goal.id !== id))
        } catch (error) {
          console.error('Error deleting savings goal:', error)
        }
      } else {
        setSavingsGoals(prev => prev.filter(goal => goal.id !== id))
      }
    }
  }

  const handleUpdateSavingsAmount = async (id: string, newAmount: number) => {
    const matched = savingsGoals.find(g => g.id === id)
    if (!matched) return

    const updated = { ...matched, currentAmount: newAmount }

    if (user) {
      try {
        await dbSavingsGoals.update(user.uid, updated)
        setSavingsGoals(prev => prev.map(goal => goal.id === id ? updated : goal))
      } catch (error) {
        console.error('Error updating savings amount:', error)
      }
    } else {
      setSavingsGoals(prev => prev.map(goal => goal.id === id ? updated : goal))
    }
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
            <h1 className="text-2xl font-bold text-foreground">Finance Planner</h1>
            <p className="text-muted-foreground text-sm">Track your study abroad expenses and budget</p>
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
                <p className="text-sm font-medium text-muted-foreground">Total Estimated</p>
                <p className="text-2xl font-bold text-foreground">
                  <ClientCurrency 
                    amount={totalEstimated} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-info" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Paid</p>
                <p className="text-2xl font-bold text-success">
                  <ClientCurrency 
                    amount={totalPaid} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-success" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Remaining</p>
                <p className="text-2xl font-bold text-danger">
                  <ClientCurrency 
                    amount={totalRemaining} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-danger" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Progress</p>
                <p className="text-2xl font-bold text-primary">
                  {Math.round((totalPaid / totalEstimated) * 100)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
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
                    <span className="text-sm font-medium text-foreground">{category}</span>
                    <span className="text-sm text-muted-foreground">
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
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Description</th>
                    <th className="text-left py-3 px-4">Category</th>
                    <th className="text-right py-3 px-4">Estimated</th>
                    <th className="text-right py-3 px-4">Actual</th>
                    <th className="text-center py-3 px-4">Status</th>
                    <th className="text-center py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {financeItems.map((item) => (
                    <tr key={item.id}>
                      <td className="py-3 px-4">
                        <div className="font-medium text-foreground">{item.description}</div>
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
              <div className="input-group">
                <label className="input-label">Amount</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field"
                  placeholder="Enter amount"
                />
              </div>
              <div className="input-group">
                <label className="input-label">From</label>
                <select 
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value as 'USD' | 'EUR' | 'INR')}
                  className="input-field"
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="INR">INR</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">To</label>
                <select 
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value as 'USD' | 'EUR' | 'INR')}
                  className="input-field"
                >
                  <option value="EUR">EUR</option>
                  <option value="USD">USD</option>
                  <option value="INR">INR</option>
                </select>
              </div>
            </div>
            <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
              <p className="text-center text-lg font-semibold text-foreground">
                Converted Amount: <ClientCurrency 
                  amount={convertCurrencyAmount()} 
                  currency={toCurrency} 
                  showSymbol={true}
                />
              </p>
              <p className="text-center text-sm text-muted-foreground mt-1">
                Exchange rates are indicative and may vary (1 EUR = {(settings.currency.exchangeRates?.USD || 1.1).toFixed(2)} USD, 1 EUR = {(settings.currency.exchangeRates?.INR || 90).toFixed(2)} INR)
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
              <div className="text-center py-10">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No savings goals yet</h3>
                <p className="text-muted-foreground mb-4">Start by setting your first savings goal</p>
                <Button onClick={() => setIsSavingsModalOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Savings Goal
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-info/10 border border-info/20 rounded-xl">
                    <p className="text-sm text-muted-foreground">Total Target</p>
                    <p className="text-2xl font-bold text-info">
                      <ClientCurrency 
                        amount={totalSavingsTarget} 
                        currency={settings.currency.primary} 
                        showSymbol={settings.currency.displaySymbol}
                      />
                    </p>
                  </div>
                  <div className="text-center p-4 bg-success/10 border border-success/20 rounded-xl">
                    <p className="text-sm text-muted-foreground">Total Saved</p>
                    <p className="text-2xl font-bold text-success">
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
                      <div key={goal.id} className="border border-border rounded-xl p-4 bg-card">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-medium text-foreground">{goal.title}</h4>
                            {goal.description && (
                              <p className="text-sm text-muted-foreground">{goal.description}</p>
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
                          <div className="flex justify-between text-sm text-muted-foreground">
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
                            <p className="text-xs text-muted-foreground">
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