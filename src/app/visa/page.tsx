'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { Plus, CheckCircle, Clock, AlertTriangle, Calendar, FileText, Edit, Trash2 } from 'lucide-react'
import { mockVisaSteps } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { VisaStep } from '@/types'
import { VisaStepForm } from '@/components/forms/VisaStepForm'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useIsClient } from '@/hooks/useIsClient'
import { Loading } from '@/components/ui/Loading'

export default function VisaPage() {
  const isClient = useIsClient()
  const [visaSteps, setVisaSteps] = useLocalStorage<VisaStep[]>('visaSteps', mockVisaSteps)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingStep, setEditingStep] = useState<VisaStep | undefined>(undefined)

  const getStatusIcon = (status: VisaStep['status']) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'In Progress': return <Clock className="h-5 w-5 text-blue-600" />
      case 'Pending': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    }
  }

  const getStatusVariant = (status: VisaStep['status']) => {
    switch (status) {
      case 'Completed': return 'success'
      case 'In Progress': return 'info'
      case 'Pending': return 'warning'
    }
  }

  const completedSteps = visaSteps.filter(step => step.status === 'Completed').length
  const totalSteps = visaSteps.length
  const progressPercentage = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0

  const handleAddStep = () => {
    setEditingStep(undefined)
    setIsModalOpen(true)
  }

  const handleEditStep = (step: VisaStep) => {
    setEditingStep(step)
    setIsModalOpen(true)
  }

  const handleDeleteStep = (stepId: string) => {
    if (confirm('Are you sure you want to delete this step?')) {
      setVisaSteps(prev => prev.filter(s => s.id !== stepId))
    }
  }

  const handleSaveStep = (step: VisaStep) => {
    if (editingStep) {
      setVisaSteps(prev => prev.map(s => s.id === step.id ? step : s))
    } else {
      setVisaSteps(prev => [...prev, step])
    }
    setIsModalOpen(false)
    setEditingStep(undefined)
  }

  const handleCancelEdit = () => {
    setIsModalOpen(false)
    setEditingStep(undefined)
  }

  const handleMarkComplete = (stepId: string) => {
    setVisaSteps(prev => prev.map(step => 
      step.id === stepId 
        ? { ...step, status: 'Completed' as VisaStep['status'] }
        : step
    ))
  }

  const handleBookAppointment = () => {
    // Open German consulate appointment booking page
    window.open('https://service2.diplo.de/rktermin/extern/choose_categoryList.do?locationCode=indi&realmId=108&categoryId=373', '_blank', 'noopener,noreferrer')
  }

  const handleDocumentChecklist = () => {
    // Create a new visa step with document checklist
    const checklistStep: VisaStep = {
      id: Date.now().toString(),
      title: 'Document Checklist',
      description: 'Complete document checklist for German student visa',
      status: 'Pending',
      documents: [
        'Valid passport (6+ months validity)',
        'University admission letter',
        'Proof of financial resources (€11,208/year)',
        'Health insurance coverage',
        'Academic transcripts and certificates',
        'Language proficiency certificates',
        'Completed visa application form',
        'Biometric photos'
      ]
    }
    setVisaSteps(prev => [...prev, checklistStep])
  }

  const handleTrackApplication = () => {
    // Open visa application tracking page
    window.open('https://visa.vfsglobal.com/ind/en/deu/track-application', '_blank', 'noopener,noreferrer')
  }

  const VisaStepCard = ({ step, index }: { step: VisaStep; index: number }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-medium text-sm">
              {index + 1}
            </div>
            <CardTitle className="text-lg">{step.title}</CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusIcon(step.status)}
            <Badge variant={getStatusVariant(step.status)}>
              {step.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-gray-600">{step.description}</p>

        {step.dueDate && (
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center text-sm text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              Due Date
            </div>
            <span className="font-medium">{formatDate(step.dueDate)}</span>
          </div>
        )}

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Required Documents</h4>
          <div className="space-y-2">
            {step.documents.map((document, docIndex) => (
              <div key={docIndex} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full" />
                <span className="text-sm text-gray-600">{document}</span>
              </div>
            ))}
          </div>
        </div>

        {step.notes && (
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Notes</h4>
            <p className="text-sm text-gray-600">{step.notes}</p>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditStep(step)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDeleteStep(step.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          {step.status !== 'Completed' && (
            <Button 
              variant="primary" 
              size="sm"
              onClick={() => handleMarkComplete(step.id)}
            >
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (!isClient) {
    return (
      <Layout>
        <Loading text="Loading your visa process..." />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Visa Process</h1>
            <p className="text-gray-600">Track your German student visa application</p>
          </div>
          <Button onClick={handleAddStep}>
            <Plus className="h-4 w-4 mr-2" />
            Add Step
          </Button>
        </div>

        {/* Progress Overview */}
        <Card>
          <CardHeader>
            <CardTitle>Visa Application Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <ProgressBar 
              value={progressPercentage} 
              label="Overall Progress"
              className="mb-6"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">{totalSteps}</div>
                <div className="text-sm text-gray-600">Total Steps</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedSteps}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{totalSteps - completedSteps}</div>
                <div className="text-sm text-gray-600">Remaining</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visa Steps */}
        <div className="space-y-6">
          {visaSteps.map((step, index) => (
            <VisaStepCard key={step.id} step={step} index={index} />
          ))}
        </div>

        {visaSteps.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No visa steps added yet</h3>
            <p className="text-gray-600 mb-4">Start by adding your visa application steps</p>
            <Button onClick={handleAddStep}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Step
            </Button>
          </div>
        )}

        {/* Visa Information */}
        <Card>
          <CardHeader>
            <CardTitle>German Student Visa Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Required Documents</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Valid passport (6+ months validity)</li>
                  <li>• University admission letter</li>
                  <li>• Proof of financial resources (€11,208/year)</li>
                  <li>• Health insurance coverage</li>
                  <li>• Academic transcripts and certificates</li>
                  <li>• Language proficiency certificates</li>
                  <li>• Completed visa application form</li>
                  <li>• Biometric photos</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Important Tips</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Apply 3 months before travel date</li>
                  <li>• Book appointment early at German consulate</li>
                  <li>• Prepare for visa interview questions</li>
                  <li>• Keep all original documents ready</li>
                  <li>• Processing time: 4-12 weeks typically</li>
                  <li>• Visa fee: €75 for most countries</li>
                  <li>• Consider blocked account for financial proof</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-16 flex-col"
                onClick={handleBookAppointment}
              >
                <Calendar className="h-6 w-6 mb-2" />
                Book Appointment
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col"
                onClick={handleDocumentChecklist}
              >
                <FileText className="h-6 w-6 mb-2" />
                Document Checklist
              </Button>
              <Button 
                variant="outline" 
                className="h-16 flex-col"
                onClick={handleTrackApplication}
              >
                <CheckCircle className="h-6 w-6 mb-2" />
                Track Application
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancelEdit}
          title={editingStep ? 'Edit Visa Step' : 'Add New Visa Step'}
        >
          <VisaStepForm
            visaStep={editingStep}
            onSave={handleSaveStep}
            onCancel={handleCancelEdit}
          />
        </Modal>
      </div>
    </Layout>
  )
} 