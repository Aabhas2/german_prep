'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Exam } from '@/types'

interface ExamFormProps {
  exam?: Exam
  onSave: (exam: Exam) => void
  onCancel: () => void
}

export const ExamForm = ({ exam, onSave, onCancel }: ExamFormProps) => {
  const [formData, setFormData] = useState({
    name: exam?.name || '',
    fee: exam?.fee || 0,
    plannedDate: exam?.plannedDate ? exam.plannedDate.toISOString().split('T')[0] : '',
    actualDate: exam?.actualDate ? exam.actualDate.toISOString().split('T')[0] : '',
    status: exam?.status || 'To Register' as Exam['status'],
    score: exam?.score || '',
    registrationLink: exam?.registrationLink || '',
    preparationResources: exam?.preparationResources || ['']
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Exam name is required'
    }

    if (formData.fee < 0) {
      newErrors.fee = 'Fee cannot be negative'
    }

    if (formData.status === 'Registered' && !formData.plannedDate) {
      newErrors.plannedDate = 'Planned date is required for registered exams'
    }

    if (formData.status === 'Completed' && !formData.actualDate) {
      newErrors.actualDate = 'Actual date is required for completed exams'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const examData: Exam = {
      id: exam?.id || Date.now().toString(),
      name: formData.name.trim(),
      fee: formData.fee,
      status: formData.status,
      plannedDate: formData.plannedDate ? new Date(formData.plannedDate) : undefined,
      actualDate: formData.actualDate ? new Date(formData.actualDate) : undefined,
      score: formData.score.trim() || undefined,
      registrationLink: formData.registrationLink.trim() || undefined,
      preparationResources: formData.preparationResources.filter(resource => resource.trim())
    }

    onSave(examData)
  }

  const handleResourceChange = (index: number, value: string) => {
    const newResources = [...formData.preparationResources]
    newResources[index] = value
    setFormData({ ...formData, preparationResources: newResources })
  }

  const addResource = () => {
    setFormData({ ...formData, preparationResources: [...formData.preparationResources, ''] })
  }

  const removeResource = (index: number) => {
    if (formData.preparationResources.length > 1) {
      const newResources = formData.preparationResources.filter((_, i) => i !== index)
      setFormData({ ...formData, preparationResources: newResources })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Exam Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-input'
            }`}
            placeholder="e.g., IELTS, TestAS, APS"
          />
          {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Exam['status'] })}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="To Register">To Register</option>
            <option value="Registered">Registered</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Fee (EUR)
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.fee}
            onChange={(e) => setFormData({ ...formData, fee: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.fee ? 'border-red-500' : 'border-input'
            }`}
          />
          {errors.fee && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.fee}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Registration Link (Optional)
          </label>
          <input
            type="url"
            value={formData.registrationLink}
            onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Planned Date {formData.status === 'Registered' && '*'}
          </label>
          <input
            type="date"
            value={formData.plannedDate}
            onChange={(e) => setFormData({ ...formData, plannedDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.plannedDate ? 'border-red-500' : 'border-input'
            }`}
          />
          {errors.plannedDate && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.plannedDate}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Actual Date {formData.status === 'Completed' && '*'}
          </label>
          <input
            type="date"
            value={formData.actualDate}
            onChange={(e) => setFormData({ ...formData, actualDate: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.actualDate ? 'border-red-500' : 'border-input'
            }`}
          />
          {errors.actualDate && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.actualDate}</p>}
        </div>
      </div>

      {formData.status === 'Completed' && (
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Score/Result (Optional)
          </label>
          <input
            type="text"
            value={formData.score}
            onChange={(e) => setFormData({ ...formData, score: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 7.5, Passed, 85%"
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-2">
          Preparation Resources (Optional)
        </label>
        {formData.preparationResources.map((resource, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={resource}
              onChange={(e) => handleResourceChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter preparation resource"
            />
            {formData.preparationResources.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeResource(index)}
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
          onClick={addResource}
          className="mt-2"
        >
          Add Resource
        </Button>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 ">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {exam ? 'Update' : 'Add'} Exam
        </Button>
      </div>
    </form>
  )
} 