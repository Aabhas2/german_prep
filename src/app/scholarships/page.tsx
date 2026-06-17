'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { Layout } from '@/components/layout/Layout'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Plus, Calendar, ExternalLink, DollarSign, Award, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { mockScholarships } from '@/data/mockData'
import { dbScholarships } from '@/lib/db'
import { formatDate } from '@/lib/utils'
import { Scholarship } from '@/types'
import { ScholarshipForm } from '@/components/forms/ScholarshipForm'

export default function ScholarshipsPage() {
  const { user } = useAuth()
  const [scholarships, setScholarships] = useState<Scholarship[]>([])
  const [mounted, setMounted] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingScholarship, setEditingScholarship] = useState<Scholarship | undefined>(undefined)

  // Load data on mount / auth state change
  useEffect(() => {
    setMounted(true)
    
    const loadScholarships = async () => {
      if (user) {
        try {
          const cloudScholarships = await dbScholarships.fetch(user.uid)
          setScholarships(cloudScholarships)
        } catch (error) {
          console.error('Error fetching cloud scholarships:', error)
        }
      } else {
        try {
          const savedScholarships = localStorage.getItem('scholarships')
          const parsedScholarships = savedScholarships ? JSON.parse(savedScholarships).map((scholarship: any) => ({
            ...scholarship,
            deadline: scholarship.deadline ? new Date(scholarship.deadline) : new Date()
          })) : mockScholarships
          setScholarships(parsedScholarships)
        } catch (error) {
          console.error('Error loading scholarships:', error)
          setScholarships(mockScholarships)
        }
      }
    }

    loadScholarships()
  }, [user])

  // Save scholarships locally (guest mode only)
  useEffect(() => {
    if (mounted && !user) {
      localStorage.setItem('scholarships', JSON.stringify(scholarships))
    }
  }, [scholarships, mounted, user])

  const getStatusVariant = (status: Scholarship['status']) => {
    switch (status) {
      case 'Accepted': return 'success'
      case 'Applied': return 'info'
      case 'Rejected': return 'error'
      case 'To Apply': return 'warning'
    }
  }

  const handleAddScholarship = useCallback(() => {
    setEditingScholarship(undefined)
    setIsModalOpen(true)
  }, [])

  const handleEditScholarship = useCallback((scholarship: Scholarship) => {
    setEditingScholarship(scholarship)
    setIsModalOpen(true)
  }, [])

  const handleDeleteScholarship = useCallback(async (scholarshipId: string) => {
    if (confirm('Are you sure you want to delete this scholarship?')) {
      if (user) {
        try {
          await dbScholarships.delete(user.uid, scholarshipId)
          setScholarships(prev => prev.filter(s => s.id !== scholarshipId))
        } catch (error) {
          console.error('Error deleting scholarship:', error)
        }
      } else {
        setScholarships(prev => prev.filter(s => s.id !== scholarshipId))
      }
    }
  }, [user])

  const handleSaveScholarship = useCallback(async (scholarship: Scholarship) => {
    if (editingScholarship) {
      if (user) {
        try {
          await dbScholarships.update(user.uid, scholarship)
          setScholarships(prev => prev.map(s => s.id === scholarship.id ? scholarship : s))
        } catch (error) {
          console.error('Error updating scholarship:', error)
        }
      } else {
        setScholarships(prev => prev.map(s => s.id === scholarship.id ? scholarship : s))
      }
    } else {
      if (user) {
        try {
          const { id, ...data } = scholarship
          const added = await dbScholarships.add(user.uid, data)
          setScholarships(prev => [...prev, added])
        } catch (error) {
          console.error('Error adding scholarship:', error)
        }
      } else {
        setScholarships(prev => [...prev, scholarship])
      }
    }
    setIsModalOpen(false)
    setEditingScholarship(undefined)
  }, [editingScholarship, user])

  const handleCancelEdit = useCallback(() => {
    setIsModalOpen(false)
    setEditingScholarship(undefined)
  }, [])

  const handleOpenWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const handleApplyNow = useCallback(async (scholarship: Scholarship) => {
    const updated = { ...scholarship, status: 'Applied' as Scholarship['status'] }

    if (user) {
      try {
        await dbScholarships.update(user.uid, updated)
        setScholarships(prev => prev.map(s => s.id === scholarship.id ? updated : s))
      } catch (error) {
        console.error('Error applying scholarship:', error)
      }
    } else {
      setScholarships(prev => prev.map(s => s.id === scholarship.id ? updated : s))
    }
    
    if (scholarship.website) {
      window.open(scholarship.website, '_blank', 'noopener,noreferrer')
    } else {
      alert('Application submitted! Please check your email for further instructions.')
    }
  }, [user])

  const ScholarshipCard = ({ scholarship }: { scholarship: Scholarship }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{scholarship.name}</CardTitle>
          <Badge variant={getStatusVariant(scholarship.status)}>
            {scholarship.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Amount:</span>
            <span className="font-bold text-green-600">
              {scholarship.currency}{scholarship.amount.toLocaleString()}/month
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Deadline:</span>
            <span className="font-medium">{formatDate(scholarship.deadline)}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-1">Eligibility</h4>
          <p className="text-sm text-gray-600">{scholarship.eligibility}</p>
        </div>

        <div>
          <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
          <div className="space-y-1">
            {scholarship.requirements.map((requirement, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                {requirement}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleEditScholarship(scholarship)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleDeleteScholarship(scholarship.id)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex space-x-2">
            {scholarship.website && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => handleOpenWebsite(scholarship.website!)}
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Visit
              </Button>
            )}
            {scholarship.status === 'To Apply' && (
              <Button variant="primary" size="sm" onClick={() => handleApplyNow(scholarship)}>
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const totalAmount = useMemo(() => 
    scholarships
      .filter(s => s.status === 'Accepted')
      .reduce((sum, s) => sum + s.amount, 0),
    [scholarships]
  )

  if (!mounted) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your scholarships...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Scholarships</h1>
            <p className="text-muted-foreground">Track and manage your scholarship applications</p>
          </div>
          <Button onClick={handleAddScholarship}>
            <Plus className="h-4 w-4 mr-2" />
            Add Scholarship
          </Button>
        </div>

        {/* Scholarship Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Scholarships</p>
                <p className="text-2xl font-bold text-foreground">{scholarships.length}</p>
              </div>
              <Award className="h-8 w-8 text-blue-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">To Apply</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {scholarships.filter(s => s.status === 'To Apply').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-blue-600">
                  {scholarships.filter(s => s.status === 'Applied').length}
                </p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-green-600">
                  €{totalAmount.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-600" />
            </CardContent>
          </Card>
        </div>

        {/* Scholarships Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {scholarships.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>

        {scholarships.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No scholarships added yet</h3>
            <p className="text-gray-600 mb-4">Start by adding scholarship opportunities</p>
            <Button onClick={handleAddScholarship}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Scholarship
            </Button>
          </div>
        )}

        {/* Scholarship Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Scholarship Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-foreground mb-3">Popular German Scholarships</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-secondary/30 border border-border/30 rounded">
                    <span className="text-sm">DAAD Scholarships</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/30 border border-border/30 rounded">
                    <span className="text-sm">Deutschland Stipendium</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-secondary/30 border border-border/30 rounded">
                    <span className="text-sm">Erasmus+ Program</span>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-foreground mb-3">Application Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Start applications early, deadlines are strict</li>
                  <li>• Tailor your motivation letter to each scholarship</li>
                  <li>• Highlight academic achievements and extracurriculars</li>
                  <li>• Get strong letters of recommendation</li>
                  <li>• Show clear career goals and how the scholarship helps</li>
                  <li>• Proofread all documents carefully</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add/Edit Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancelEdit}
          title={editingScholarship ? 'Edit Scholarship' : 'Add New Scholarship'}
        >
          <ScholarshipForm
            scholarship={editingScholarship}
            onSave={handleSaveScholarship}
            onCancel={handleCancelEdit}
          />
        </Modal>
      </div>
    </Layout>
  )
} 