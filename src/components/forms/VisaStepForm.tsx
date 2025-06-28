'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { VisaStep } from '@/types'

interface VisaStepFormProps {
  visaStep?: VisaStep
  onSave: (visaStep: VisaStep) => void
  onCancel: () => void
}

export const VisaStepForm = ({ visaStep, onSave, onCancel }: VisaStepFormProps) => {
  const [formData, setFormData] = useState({
    title: visaStep?.title || '',
    description: visaStep?.description || '',
    status: visaStep?.status || 'Pending' as VisaStep['status'],
    dueDate: visaStep?.dueDate ? visaStep.dueDate.toISOString().split('T')[0] : '',
    documents: visaStep?.documents || [''],
    notes: visaStep?.notes || ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Step title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Step description is required'
    }

    if (formData.documents.filter(doc => doc.trim()).length === 0) {
      newErrors.documents = 'At least one document is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const visaStepData: VisaStep = {
      id: visaStep?.id || Date.now().toString(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      status: formData.status,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      documents: formData.documents.filter(doc => doc.trim()),
      notes: formData.notes.trim() || undefined
    }

    onSave(visaStepData)
  }

  const handleDocumentChange = (index: number, value: string) => {
    const newDocuments = [...formData.documents]
    newDocuments[index] = value
    setFormData({ ...formData, documents: newDocuments })
  }

  const addDocument = () => {
    setFormData({ ...formData, documents: [...formData.documents, ''] })
  }

  const removeDocument = (index: number) => {
    if (formData.documents.length > 1) {
      const newDocuments = formData.documents.filter((_, i) => i !== index)
      setFormData({ ...formData, documents: newDocuments })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Step Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="e.g., Gather Required Documents"
          />
          {errors.title && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as VisaStep['status'] })}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Describe what needs to be done in this step"
        />
        {errors.description && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.description}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Due Date (Optional)
        </label>
        <input
          type="date"
          value={formData.dueDate}
          onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Required Documents *
        </label>
        {formData.documents.map((document, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={document}
              onChange={(e) => handleDocumentChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter required document"
            />
            {formData.documents.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDocument(index)}
              >
                Remove
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDocument}
          className="mt-2"
        >
          Add Document
        </Button>
        {errors.documents && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.documents}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Notes (Optional)
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Add any additional notes or instructions"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {visaStep ? 'Update' : 'Add'} Step
        </Button>
      </div>
    </form>
  )
} 