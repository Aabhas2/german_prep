'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { TaskForm } from '@/components/forms/TaskForm'
import { Plus, Calendar, AlertTriangle, Edit, Trash2, CheckCircle } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { mockTasks } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Task } from '@/types'

export default function TasksPage() {
  const { settings } = useTheme()
  const [tasks, setTasks] = useState<Task[]>([])
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | undefined>()

  // Load data on mount
  useEffect(() => {
    setMounted(true)
    
    try {
      const savedTasks = localStorage.getItem('tasks')
      const parsedTasks = savedTasks ? JSON.parse(savedTasks).map((task: any) => ({
        ...task,
        dueDate: task.dueDate ? new Date(task.dueDate) : null,
        createdAt: task.createdAt ? new Date(task.createdAt) : new Date()
      })) : mockTasks
      setTasks(parsedTasks)
    } catch (error) {
      console.error('Error loading tasks:', error)
      setTasks(mockTasks)
    }
  }, [])

  // Save tasks when they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('tasks', JSON.stringify(tasks))
    }
  }, [tasks, mounted])

  const getPriorityVariant = useCallback((priority: Task['priority']) => {
    switch (priority) {
      case 'High': return 'error'
      case 'Medium': return 'warning'
      case 'Low': return 'default'
    }
  }, [])

  const tasksByStatus = useMemo(() => {
    try {
      // Filter tasks based on settings
      let filteredTasks = tasks
      if (!settings.tasks.showCompletedTasks) {
        filteredTasks = tasks.filter(task => task.status !== 'Completed')
      }

      // Sort tasks based on settings
      const sortedTasks = [...filteredTasks].sort((a, b) => {
        switch (settings.tasks.sortBy) {
          case 'dueDate':
            if (!a.dueDate && !b.dueDate) return 0
            if (!a.dueDate) return 1
            if (!b.dueDate) return -1
            const aDate = a.dueDate instanceof Date ? a.dueDate : new Date(a.dueDate)
            const bDate = b.dueDate instanceof Date ? b.dueDate : new Date(b.dueDate)
            return aDate.getTime() - bDate.getTime()
          case 'priority':
            const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 }
            return priorityOrder[b.priority] - priorityOrder[a.priority]
          case 'created':
            const aCreated = a.createdAt instanceof Date ? a.createdAt : new Date(a.createdAt)
            const bCreated = b.createdAt instanceof Date ? b.createdAt : new Date(b.createdAt)
            return bCreated.getTime() - aCreated.getTime()
          case 'title':
            return a.title.localeCompare(b.title)
          default:
            return 0
        }
      })

      return {
        'To Do': sortedTasks.filter(task => task.status === 'To Do'),
        'In Progress': sortedTasks.filter(task => task.status === 'In Progress'),
        'Completed': settings.tasks.showCompletedTasks 
          ? sortedTasks.filter(task => task.status === 'Completed')
          : []
      }
    } catch (error) {
      console.error('Error processing tasks:', error)
      return {
        'To Do': [],
        'In Progress': [],
        'Completed': []
      }
    }
  }, [tasks, settings.tasks.showCompletedTasks, settings.tasks.sortBy])

  const handleAddTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date()
    }
    setTasks(prev => [...prev, newTask])
    setIsModalOpen(false)
  }, [])

  const handleEditTask = useCallback((task: Task) => {
    setEditingTask(task)
    setIsModalOpen(true)
  }, [])

  const handleUpdateTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return
    
    const updatedTask: Task = {
      ...taskData,
      id: editingTask.id,
      createdAt: editingTask.createdAt
    }
    setTasks(prev => prev.map(task => task.id === editingTask.id ? updatedTask : task))
    setIsModalOpen(false)
    setEditingTask(undefined)
  }, [editingTask])

  const handleDeleteTask = useCallback((id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prev => prev.filter(task => task.id !== id))
    }
  }, [])

  const handleStatusChange = useCallback((id: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ))
  }, [])

  const TaskCard = React.memo(({ task }: { task: Task }) => (
    <Card className="mb-4 hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h3>
          <Badge variant={getPriorityVariant(task.priority)}>
            {task.priority}
          </Badge>
        </div>
        
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
        )}
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{task.category}</span>
          {task.dueDate && (
            <div className="flex items-center">
              <Calendar className="h-3 w-3 mr-1" />
              {formatDate(task.dueDate)}
            </div>
          )}
        </div>

        <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-1">
            <Button variant="outline" size="sm" onClick={() => handleEditTask(task)} className="text-xs px-2 py-1">
              <Edit className="h-3 w-3 mr-1" />
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleDeleteTask(task.id)} className="text-xs px-2 py-1 text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20">
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
          {task.status !== 'Completed' && (
            <Button 
              variant="primary" 
              size="sm" 
              className="text-xs px-2 py-1"
              onClick={() => {
                const nextStatus = task.status === 'To Do' ? 'In Progress' : 'Completed'
                handleStatusChange(task.id, nextStatus)
              }}
            >
              {task.status === 'To Do' ? 'Start' : 'Complete'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  ))

  TaskCard.displayName = 'TaskCard'

  const TaskColumn = ({ title, status, tasks: columnTasks }: { 
    title: string
    status: Task['status']
    tasks: Task[] 
  }) => (
    <div className="flex-1 min-w-0">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{title}</CardTitle>
            <Badge variant="default">{columnTasks.length}</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {columnTasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {columnTasks.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>No tasks</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Show nothing during SSR
  if (!mounted) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Task Manager</h1>
            <p className="text-gray-600 dark:text-gray-400">Organize and track your preparation tasks</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>

        {/* Task Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">To Do</p>
                <p className="text-2xl font-bold text-blue-600">{tasksByStatus['To Do'].length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-yellow-600">{tasksByStatus['In Progress'].length}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">{tasksByStatus['Completed'].length}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Kanban Board */}
        <div className="flex flex-col lg:flex-row gap-6 overflow-x-auto">
          <TaskColumn 
            title="To Do" 
            status="To Do" 
            tasks={tasksByStatus['To Do']} 
          />
          <TaskColumn 
            title="In Progress" 
            status="In Progress" 
            tasks={tasksByStatus['In Progress']} 
          />
          <TaskColumn 
            title="Completed" 
            status="Completed" 
            tasks={tasksByStatus['Completed']} 
          />
        </div>

        {/* Overdue Tasks Alert */}
        {tasks.some(task => task.dueDate && task.dueDate < new Date() && task.status !== 'Completed') && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="flex items-center p-4">
              <AlertTriangle className="h-5 w-5 text-red-600 mr-3" />
              <div>
                <h3 className="font-medium text-red-800">Overdue Tasks</h3>
                <p className="text-sm text-red-700">
                  You have {tasks.filter(task => task.dueDate && task.dueDate < new Date() && task.status !== 'Completed').length} overdue tasks that need attention.
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Task Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingTask(undefined)
          }}
          title={editingTask ? 'Edit Task' : 'Add New Task'}
        >
          <TaskForm
            task={editingTask}
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingTask(undefined)
            }}
          />
        </Modal>
      </div>
    </Layout>
  )
} 