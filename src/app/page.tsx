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
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Welcome to Your Germany Prep Hub</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your study abroad preparation journey</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Universities</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{universities.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed Tasks</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.completedTasks}/{stats.totalTasks}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exams</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{exams.length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Budget Used</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <ClientCurrency 
                    amount={financialStats.totalPaid} 
                    currency={settings.currency.primary} 
                    showSymbol={settings.currency.displaySymbol}
                  />
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
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
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Total Tasks:</span>
                    <span className="ml-2 font-medium text-gray-900 dark:text-gray-100">{stats.totalTasks}</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Completed:</span>
                    <span className="ml-2 font-medium text-green-600">{stats.completedTasks}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Upcoming Deadlines</CardTitle>
              <Calendar className="h-5 w-5 text-gray-400" />
            </CardHeader>
            <CardContent>
              {upcomingDeadlines.length > 0 ? (
                <div className="space-y-3">
                  {upcomingDeadlines.map((deadline, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{deadline.title}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{deadline.type}</p>
                      </div>
                      <Badge variant="default">
                        {formatDate(deadline.date)}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No upcoming deadlines</p>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                onClick={() => handleQuickAction('university')}
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <BookOpen className="h-6 w-6" />
                <span>Add University</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleQuickAction('exam')}
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>Add Exam</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleQuickAction('task')}
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <Plus className="h-6 w-6" />
                <span>Add Task</span>
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handleQuickAction('note')}
                className="h-20 flex flex-col items-center justify-center space-y-2"
              >
                <FileText className="h-6 w-6" />
                <span>Add Note</span>
              </Button>
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