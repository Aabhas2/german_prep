'use client'

import { useState, useEffect } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { UniversityForm } from '@/components/forms/UniversityForm'
import { Plus, ExternalLink, MapPin, Calendar, Globe, Edit, Trash2 } from 'lucide-react'
import { mockUniversities } from '@/data/mockData'
import { formatDate } from '@/lib/utils'
import { University } from '@/types'

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState<University[]>([])
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUniversity, setEditingUniversity] = useState<University | undefined>()

  // Load data on mount
  useEffect(() => {
    setMounted(true)
    
    try {
      const savedUniversities = localStorage.getItem('universities')
      const parsedUniversities = savedUniversities ? JSON.parse(savedUniversities).map((uni: any) => ({
        ...uni,
        applicationDeadline: uni.applicationDeadline ? new Date(uni.applicationDeadline) : new Date()
      })) : mockUniversities
      setUniversities(parsedUniversities)
    } catch (error) {
      console.error('Error loading universities:', error)
      setUniversities(mockUniversities)
    }
  }, [])

  // Save universities when they change
  useEffect(() => {
    if (mounted) {
      localStorage.setItem('universities', JSON.stringify(universities))
    }
  }, [universities, mounted])

  const getStatusVariant = (status: University['status']) => {
    switch (status) {
      case 'Accepted': return 'success'
      case 'Applied': return 'info'
      case 'Rejected': return 'error'
      default: return 'default'
    }
  }

  const handleAddUniversity = (universityData: Omit<University, 'id'>) => {
    const newUniversity: University = {
      ...universityData,
      id: Date.now().toString()
    }
    setUniversities(prev => [...prev, newUniversity])
    setIsModalOpen(false)
  }

  const handleEditUniversity = (university: University) => {
    setEditingUniversity(university)
    setIsModalOpen(true)
  }

  const handleUpdateUniversity = (universityData: Omit<University, 'id'>) => {
    if (!editingUniversity) return
    
    const updatedUniversity: University = {
      ...universityData,
      id: editingUniversity.id
    }
    setUniversities(prev => prev.map(uni => uni.id === editingUniversity.id ? updatedUniversity : uni))
    setIsModalOpen(false)
    setEditingUniversity(undefined)
  }

  const handleDeleteUniversity = (id: string) => {
    if (confirm('Are you sure you want to delete this university?')) {
      setUniversities(prev => prev.filter(uni => uni.id !== id))
    }
  }

  const handleStatusChange = (id: string, newStatus: University['status']) => {
    setUniversities(prev => prev.map(uni => 
      uni.id === id ? { ...uni, status: newStatus } : uni
    ))
  }

  const handleVisitWebsite = (website: string) => {
    window.open(website, '_blank')
  }

  // Show nothing during SSR
  if (!mounted) {
    return null
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Universities</h1>
            <p className="text-gray-600 dark:text-gray-400">Manage your university applications</p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add University
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {universities.map((university) => (
            <Card key={university.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{university.name}</CardTitle>
                  <Badge variant={getStatusVariant(university.status)}>
                    {university.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MapPin className="h-4 w-4 mr-2" />
                    {university.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    {university.language}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    Deadline: {formatDate(university.applicationDeadline)}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Course</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{university.course}</p>
                </div>

                {university.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1">Notes</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{university.notes}</p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditUniversity(university)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleDeleteUniversity(university.id)} className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex space-x-2">
                    {university.website && (
                      <Button variant="ghost" size="sm" onClick={() => handleVisitWebsite(university.website!)}>
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Visit
                      </Button>
                    )}
                    {university.status === 'Interested' && (
                      <Button variant="primary" size="sm" onClick={() => handleStatusChange(university.id, 'Applied')}>
                        Apply
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {universities.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Plus className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No universities added yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your target universities</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First University
            </Button>
          </div>
        )}

        {/* University Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setEditingUniversity(undefined)
          }}
          title={editingUniversity ? 'Edit University' : 'Add New University'}
          className="sm:max-w-2xl"
        >
          <UniversityForm
            university={editingUniversity}
            onSubmit={editingUniversity ? handleUpdateUniversity : handleAddUniversity}
            onCancel={() => {
              setIsModalOpen(false)
              setEditingUniversity(undefined)
            }}
          />
        </Modal>
      </div>
    </Layout>
  )
} 