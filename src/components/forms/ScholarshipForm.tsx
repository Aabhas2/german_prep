'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Scholarship } from '@/types'

interface ScholarshipFormProps {
  scholarship?: Scholarship
  onSave: (scholarship: Scholarship) => void
  onCancel: () => void
}

export const ScholarshipForm = ({ scholarship, onSave, onCancel }: ScholarshipFormProps) => {
  const [formData, setFormData] = useState({
    name: scholarship?.name || '',
    amount: scholarship?.amount || 0,
    currency: scholarship?.currency || 'EUR',
    eligibility: scholarship?.eligibility || '',
    deadline: scholarship?.deadline ? scholarship.deadline.toISOString().split('T')[0] : '',
    status: scholarship?.status || 'To Apply' as Scholarship['status'],
    website: scholarship?.website || '',
    requirements: scholarship?.requirements || ['']
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Scholarship name is required'
    }

    if (formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    if (!formData.eligibility.trim()) {
      newErrors.eligibility = 'Eligibility criteria is required'
    }

    if (!formData.deadline) {
      newErrors.deadline = 'Deadline is required'
    }

    if (formData.requirements.filter(req => req.trim()).length === 0) {
      newErrors.requirements = 'At least one requirement is needed'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const scholarshipData: Scholarship = {
      id: scholarship?.id || Date.now().toString(),
      name: formData.name.trim(),
      amount: formData.amount,
      currency: formData.currency as 'USD' | 'EUR' | 'INR',
      eligibility: formData.eligibility.trim(),
      deadline: new Date(formData.deadline),
      status: formData.status,
      website: formData.website.trim() || undefined,
      requirements: formData.requirements.filter(req => req.trim())
    }

    onSave(scholarshipData)
  }

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements]
    newRequirements[index] = value
    setFormData({ ...formData, requirements: newRequirements })
  }

  const addRequirement = () => {
    setFormData({ ...formData, requirements: [...formData.requirements, ''] })
  }

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      const newRequirements = formData.requirements.filter((_, i) => i !== index)
      setFormData({ ...formData, requirements: newRequirements })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Scholarship Name *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-input'
            }`}
            placeholder="e.g., DAAD Scholarship"
          />
          {errors.name && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Status
          </label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Scholarship['status'] })}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="To Apply">To Apply</option>
            <option value="Applied">Applied</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Amount *
          </label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
            className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.amount ? 'border-red-500' : 'border-input'
            }`}
          />
          {errors.amount && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.amount}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-2">
            Currency
          </label>
          <select
            value={formData.currency}
            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EUR">EUR</option>
            <option value="USD">USD</option>
            <option value="INR">INR</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-2">
          Deadline *
        </label>
        <input
          type="date"
          value={formData.deadline}
          onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.deadline ? 'border-red-500' : 'border-input'
          }`}
        />
        {errors.deadline && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.deadline}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-2">
          Eligibility Criteria *
        </label>
        <textarea
          value={formData.eligibility}
          onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
          rows={3}
          className={`w-full px-3 py-2 border rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.eligibility ? 'border-red-500' : 'border-input'
          }`}
          placeholder="Describe who is eligible for this scholarship"
        />
        {errors.eligibility && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.eligibility}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-2">
          Website (Optional)
        </label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-2">
          Requirements *
        </label>
        {formData.requirements.map((requirement, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={requirement}
              onChange={(e) => handleRequirementChange(index, e.target.value)}
              className="flex-1 px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter requirement"
            />
            {formData.requirements.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeRequirement(index)}
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
          onClick={addRequirement}
          className="mt-2"
        >
          Add Requirement
        </Button>
        {errors.requirements && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.requirements}</p>}
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-border ">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {scholarship ? 'Update' : 'Add'} Scholarship
        </Button>
      </div>
    </form>
  )
} 