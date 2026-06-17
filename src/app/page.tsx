'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from '@/components/forms/TaskForm'
import { ClientCurrency } from '@/components/ui/ClientCurrency'
import { Plus, Calendar, BookOpen, DollarSign, FileText, CheckCircle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'
import { mockTasks, mockUniversities, mockExams, mockFinanceItems } from '@/data/mockData'
import { dbTasks, dbUniversities, dbExams, dbFinance } from '@/lib/db'
import { formatDate, formatCurrency, convertCurrency } from '@/lib/utils'
import { Task, University, Exam, FinanceItem } from '@/types'

export default function Dashboard() {
  const router = useRouter()
  const { settings } = useTheme()
  const { user } = useAuth()
  
  // Simple state without complex localStorage logic
  const [tasks, setTasks] = useState<Task[]>([])
  const [universities, setUniversities] = useState<University[]>([])
  const [exams, setExams] = useState<Exam[]>([])
  const [financeItems, setFinanceItems] = useState<FinanceItem[]>([])
  const [mounted, setMounted] = useState(false)
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  // Load data only on client side
  useEffect(() => {
    setMounted(true)
    
    const loadData = async () => {
      if (user) {
        try {
          const [cloudTasks, cloudUnis, cloudExams, cloudFinance] = await Promise.all([
            dbTasks.fetch(user.uid),
            dbUniversities.fetch(user.uid),
            dbExams.fetch(user.uid),
            dbFinance.fetch(user.uid)
          ])
          setTasks(cloudTasks)
          setUniversities(cloudUnis)
          setExams(cloudExams)
          setFinanceItems(cloudFinance)
        } catch (error) {
          console.error('Error loading data from cloud:', error)
        }
      } else {
        // Load from localStorage or use mock data
        try {
          const savedTasks = localStorage.getItem('tasks')
          const savedUniversities = localStorage.getItem('universities')
          const savedExams = localStorage.getItem('exams')
          const savedFinanceItems = localStorage.getItem('financeItems')
          
          // Parse and convert date strings back to Date objects
          const parsedTasks = savedTasks ? JSON.parse(savedTasks).map((task: any) => ({
            ...task,
            dueDate: task.dueDate ? new Date(task.dueDate) : null,
            createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
          })) : mockTasks
          
          const parsedUniversities = savedUniversities ? JSON.parse(savedUniversities).map((uni: any) => ({
            ...uni,
            applicationDeadline: uni.applicationDeadline ? new Date(uni.applicationDeadline) : new Date()
          })) : mockUniversities
          
          const parsedExams = savedExams ? JSON.parse(savedExams).map((exam: any) => ({
            ...exam,
            plannedDate: exam.plannedDate ? new Date(exam.plannedDate) : null,
            actualDate: exam.actualDate ? new Date(exam.actualDate) : null
          })) : mockExams
          
          setTasks(parsedTasks)
          setUniversities(parsedUniversities)
          setExams(parsedExams)
          setFinanceItems(savedFinanceItems ? JSON.parse(savedFinanceItems) : mockFinanceItems)
        } catch (error) {
          console.error('Error loading data:', error)
          // Fallback to mock data
          setTasks(mockTasks)
          setUniversities(mockUniversities)
          setExams(mockExams)
          setFinanceItems(mockFinanceItems)
        }
      }
    }

    loadData()
  }, [user])

  // Save tasks when they change (local guest mode only)
  useEffect(() => {
    if (mounted && !user) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks, mounted, user])

  // Memoized calculations for performance
  const stats = useMemo(() => {
    const totalTasks = tasks.length
    const completedTasks = tasks.filter(task => task.status === 'Completed').length
    const overallProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
    
    return { totalTasks, completedTasks, overallProgress }
  }, [tasks])

  // Memoized upcoming deadlines
  const upcomingDeadlines = useMemo(() => {
    try {
      return [
        ...tasks.filter(task => task.dueDate && task.status !== 'Completed')
          .map(task => ({ type: 'Task', title: task.title, date: task.dueDate instanceof Date ? task.dueDate : new Date(task.dueDate!) })),
        ...universities.filter(uni => uni.applicationDeadline)
          .map(uni => ({ type: 'Application', title: uni.name, date: uni.applicationDeadline instanceof Date ? uni.applicationDeadline : new Date(uni.applicationDeadline) })),
        ...exams.filter(exam => exam.plannedDate)
          .map(exam => ({ type: 'Exam', title: exam.name, date: exam.plannedDate instanceof Date ? exam.plannedDate : new Date(exam.plannedDate!) }))
      ].filter(item => !isNaN(item.date.getTime())) // Filter out invalid dates
       .sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5)
    } catch (error) {
      console.error('Error processing deadlines:', error)
      return []
    }
  }, [tasks, universities, exams])

  // Memoized financial calculations
  const financialStats = useMemo(() => {
    const convertAmount = (amount: number) => {
      return convertCurrency(amount, 'EUR', settings.currency.primary, settings.currency.exchangeRates)
    }
    
    const totalEstimated = financeItems.reduce((sum, item) => sum + convertAmount(item.estimatedAmount), 0)
    const totalPaid = financeItems.filter(item => item.paid).reduce((sum, item) => sum + convertAmount(item.actualAmount || item.estimatedAmount), 0)
    
    return { totalEstimated, totalPaid }
  }, [financeItems, settings.currency.primary, settings.currency.exchangeRates])

  // Handler functions
  const handleAddTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (user) {
      try {
        const added = await dbTasks.add(user.uid, taskData)
        setTasks(prev => [...prev, added])
      } catch (error) {
        console.error('Error adding task:', error)
      }
    } else {
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date()
      }
      setTasks(prev => [...prev, newTask])
    }
    setIsTaskModalOpen(false)
  }, [user])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setIsTaskModalOpen(true)
  }, [])

  const handleUpdateTask = useCallback(async (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return
    
    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      createdAt: editingTask.createdAt
    }

    if (user) {
      try {
        await dbTasks.update(user.uid, updatedTask)
        setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task))
      } catch (error) {
        console.error('Error updating task:', error)
      }
    } else {
      setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task))
    }
    setIsTaskModalOpen(false)
    setEditingTask(undefined)
  }, [editingTask, user])

  const handleQuickAction = useCallback((action: string) => {
    switch (action) {
      case 'university':
        router.push('/universities')
        break
      case 'exam':
        router.push('/exams')
        break
      case 'note':
        router.push('/notes')
        break
      case 'task':
        setIsTaskModalOpen(true)
        break
    }
  }, [router])

  // Show nothing during SSR
  if (!mounted) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-accent/10 border border-border p-8 text-center">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-accent/5 rounded-full translate-y-12 -translate-x-12" />
          <h1 className="text-3xl font-bold text-foreground mb-2 relative">Welcome to Your {settings.personalDetails.targetCountry || 'Germany'} Prep Hub</h1>
          <p className="text-muted-foreground relative">Track and manage your entire study abroad preparation journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Universities</p>
                <p className="text-2xl font-bold text-foreground">{universities.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-info/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-info" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Tasks</p>
                <p className="text-2xl font-bold text-foreground">{stats.completedTasks}/{stats.totalTasks}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Exams</p>
                <p className="text-2xl font-bold text-foreground">{exams.length}</p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between p-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Budget Used</p>
                <p className="text-2xl font-bold text-foreground">
                  <ClientCurrency 
                    amount={financialStats.totalPaid} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Overall Progress */}
          {settings.dashboard.showProgressBars && (
            <Card>
              <CardHeader>
                <CardTitle>Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar 
                  value={stats.overallProgress} 
                  label="Preparation Completion" 
                  className="mb-4" 
                />
                <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                  <div className="flex justify-between px-3 py-2 bg-muted/40 rounded-lg">
                    <span className="text-muted-foreground">Total Tasks</span>
                    <span className="font-semibold text-foreground">{stats.totalTasks}</span>
                  </div>
                  <div className="flex justify-between px-3 py-2 bg-success/10 rounded-lg">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-semibold text-success">{stats.completedTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-2">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium text-foreground text-sm">{deadline.title}</p>
                        <p className="text-xs text-muted-foreground">{deadline.type}</p>
                      </div>
                      <Badge variant="info">
                        {formatDate(deadline.date)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm text-center py-4">No upcoming deadlines 🎉</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => handleQuickAction('university')}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-info/10 flex items-center justify-center group-hover:bg-info/20 transition-colors">
                  <BookOpen className="h-5 w-5 text-info" />
                </div>
                <span className="text-sm font-medium text-foreground">Add University</span>
              </button>
              <button
                onClick={() => handleQuickAction('exam')}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">Add Exam</span>
              </button>
              <button
                onClick={() => handleQuickAction('task')}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center group-hover:bg-success/20 transition-colors">
                  <Plus className="h-5 w-5 text-success" />
                </div>
                <span className="text-sm font-medium text-foreground">Add Task</span>
              </button>
              <button
                onClick={() => handleQuickAction('note')}
                className="flex flex-col items-center justify-center gap-2.5 p-5 rounded-xl border border-border bg-card hover:bg-muted/40 hover:border-primary/30 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <FileText className="h-5 w-5 text-accent" />
                </div>
                <span className="text-sm font-medium text-foreground">Add Note</span>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* Task Modal */}
        <Modal
          isOpen={isTaskModalOpen}
          onClose={() => {
            setIsTaskModalOpen(false)
            setEditingTask(undefined)
          }}
          title={editingTask ? 'Edit Task' : 'Add New Task'}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setIsTaskModalOpen(false)
              setEditingTask(undefined)
            }}
          />
        </Modal>
      </div>
    </Layout>
  )
} 