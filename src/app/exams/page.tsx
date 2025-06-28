'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Plus, Calendar, ExternalLink, BookOpen, Award, Edit, Trash2 } from 'lucide-react'
import { mockExams } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { Exam } from '@/types'
import { ExamForm } from '@/components/forms/ExamForm'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useIsClient } from '@/hooks/useIsClient'
import { Loading } from '@/components/ui/Loading'

export default function ExamsPage() {
  const isClient = useIsClient()
  const [exams, setExams] = useLocalStorage<Exam[]>('exams', mockExams)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingExam, setEditingExam] = useState<Exam | undefined>(undefined)

  const getStatusVariant = (status: Exam['status']) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'Registered': return 'info'
      case 'To Register': return 'warning'
    }
  }

  const handleAddExam = () => {
    setEditingExam(undefined)
    setIsModalOpen(true)
  }

  const handleEditExam = (exam: Exam) => {
    setEditingExam(exam)
    setIsModalOpen(true)
  }

  const handleDeleteExam = (examId: string) => {
    if (confirm('Are you sure you want to delete this exam?')) {
      setExams(prev => prev.filter(e => e.id !== examId))
    }
  }

  const handleSaveExam = (exam: Exam) => {
    if (editingExam) {
      setExams(prev => prev.map(e => e.id === exam.id ? exam : e))
    } else {
      setExams(prev => [...prev, exam])
    }
    setIsModalOpen(false)
    setEditingExam(undefined)
  }

  const handleCancelEdit = () => {
    setIsModalOpen(false)
    setEditingExam(undefined)
  }

  const handleMarkComplete = (examId: string) => {
    const score = prompt('Enter your score/result (optional):')
    setExams(prev => prev.map(exam => 
      exam.id === examId 
        ? { 
            ...exam, 
            status: 'Completed' as Exam['status'], 
            actualDate: new Date(),
            score: score || exam.score
          }
        : exam
    ))
  }

  const handleMarkRegistered = (examId: string) => {
    setExams(prev => prev.map(exam => 
      exam.id === examId 
        ? { ...exam, status: 'Registered' as Exam['status'] }
        : exam
    ))
  }

  const handleOpenRegistration = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const ExamCard = ({ exam }: { exam: Exam }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{exam.name}</CardTitle>
          <Badge variant={getStatusVariant(exam.status)}>
            {exam.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600 dark:text-gray-400">Fee:</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">€{exam.fee}</span>
          </div>
          
          {exam.plannedDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Planned Date:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(exam.plannedDate)}</span>
            </div>
          )}
          
          {exam.actualDate && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Completed:</span>
              <span className="font-medium text-gray-900 dark:text-gray-100">{formatDate(exam.actualDate)}</span>
            </div>
          )}
          
          {exam.score && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Score:</span>
              <span className="font-medium text-green-600">{exam.score}</span>
            </div>
          )}
        </div>

        {exam.preparationResources.length > 0 && (
          <div>
            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-2">Preparation Resources</h4>
            <div className="space-y-1">
              {exam.preparationResources.map((resource, index) => (
                <div key={index} className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <BookOpen className="h-3 w-3 mr-2" />
                  {resource}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditExam(exam)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDeleteExam(exam.id)}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            {exam.registrationLink && exam.status === 'To Register' && (
              <Button 
                variant="primary" 
                size="sm"
                onClick={() => {
                  handleOpenRegistration(exam.registrationLink!)
                  handleMarkRegistered(exam.id)
                }}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Register
              </Button>
            )}
            {exam.status === 'Registered' && (
              <Button 
                variant="secondary" 
                size="sm"
                onClick={() => handleMarkComplete(exam.id)}
              >
                Mark Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (!isClient) {
    return (
      <Layout>
        <Loading text="Loading your exams..." />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exams</h1>
            <p className="text-gray-600 dark:text-gray-400">Track your standardized tests and preparations</p>
          </div>
          <Button onClick={handleAddExam}>
            <Plus className="h-4 w-4 mr-2" />
            Add Exam
          </Button>
        </div>

        {/* Exam Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">{exams.length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">To Register</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {exams.filter(exam => exam.status === 'To Register').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Registered</p>
                <p className="text-2xl font-bold text-blue-600">
                  {exams.filter(exam => exam.status === 'Registered').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-green-600">
                  {exams.filter(exam => exam.status === 'Completed').length}
                </p>
              </div>
              <Award className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>

        {exams.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No exams added yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your required standardized tests</p>
            <Button onClick={handleAddExam}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Exam
            </Button>
          </div>
        )}

        {/* Exam Tips */}
        <Card>
          <CardHeader>
            <CardTitle>Exam Preparation Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">IELTS Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Practice all four skills: reading, writing, listening, speaking</li>
                  <li>• Take timed practice tests</li>
                  <li>• Focus on academic vocabulary</li>
                  <li>• Book your test 2-3 months in advance</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">TestAS Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Understand the test format and structure</li>
                  <li>• Practice logical reasoning problems</li>
                  <li>• Improve German language skills if taking in German</li>
                  <li>• Review your field-specific knowledge</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancelEdit}
          title={editingExam ? 'Edit Exam' : 'Add New Exam'}
        >
          <ExamForm
            exam={editingExam}
            onSave={handleSaveExam}
            onCancel={handleCancelEdit}
          />
        </Modal>
      </div>
    </Layout>
  )
} 