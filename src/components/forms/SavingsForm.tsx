import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { SavingsGoal } from '@/types'
import { AlertCircle } from 'lucide-react'

interface SavingsFormProps {
  savingsGoal?: SavingsGoal
  onSubmit: (savingsGoal: Omit<SavingsGoal, 'id' | 'createdAt'>) => void
  onCancel: () => void
}

export function SavingsForm({ savingsGoal, onSubmit, onCancel }: SavingsFormProps) {
  const [formData, setFormData] = useState({
    title: savingsGoal?.title || '',
    targetAmount: savingsGoal?.targetAmount?.toString() || '',
    currentAmount: savingsGoal?.currentAmount?.toString() || '',
    currency: savingsGoal?.currency || 'EUR',
    deadline: savingsGoal?.deadline 
      ? new Date(savingsGoal.deadline).toISOString().split('T')[0] 
      : '',
    description: savingsGoal?.description || ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    
    if (!formData.title.trim() || !formData.targetAmount || !formData.currentAmount) {
      setError('Please fill in all required fields (Title, Target Amount, Current Amount)')
      return
    }

    const targetAmount = parseFloat(formData.targetAmount)
    const currentAmount = parseFloat(formData.currentAmount)

    if (isNaN(targetAmount) || targetAmount <= 0) {
      setError('Please enter a valid target amount greater than 0')
      return
    }

    if (isNaN(currentAmount) || currentAmount < 0) {
      setError('Please enter a valid current amount (must be 0 or more)')
      return
    }

    if (currentAmount > targetAmount) {
      setError('Current amount cannot be greater than target amount')
      return
    }

    let deadline: Date | undefined
    if (formData.deadline) {
      deadline = new Date(formData.deadline)
      if (isNaN(deadline.getTime())) {
        setError('Please enter a valid deadline date')
        return
      }
    }

    onSubmit({
      title: formData.title.trim(),
      targetAmount,
      currentAmount,
      currency: formData.currency as 'USD' | 'EUR' | 'INR',
      deadline,
      description: formData.description.trim() || undefined
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Goal Title *
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Study Abroad Fund"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-1">
            Target Amount *
          </label>
          <input
            type="number"
            name="targetAmount"
            value={formData.targetAmount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="15000"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-1">
            Current Amount *
          </label>
          <input
            type="number"
            name="currentAmount"
            value={formData.currentAmount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="8500"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-1">
            Currency
          </label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="EUR">EUR (Euro)</option>
            <option value="USD">USD (US Dollar)</option>
            <option value="INR">INR (Indian Rupee)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-1">
            Target Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Describe your savings goal..."
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {savingsGoal ? 'Update Goal' : 'Add Goal'}
        </Button>
      </div>
    </form>
  )
} 