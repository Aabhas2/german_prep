'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Note } from '@/types'

interface NoteFormProps {
  note?: Note
  onSave: (note: Note) => void
  onCancel: () => void
}

export const NoteForm = ({ note, onSave, onCancel }: NoteFormProps) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || '',
    tags: note?.tags ? note.tags.join(', ') : ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Note title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Note content is required'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const tags = formData.tags
      .split(',')
      .map(tag => tag.trim().toLowerCase())
      .filter(tag => tag.length > 0)

    const noteData: Note = {
      id: note?.id || Date.now().toString(),
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category.trim(),
      tags,
      createdAt: note?.createdAt || new Date(),
      updatedAt: new Date()
    }

    onSave(noteData)
  }

  const predefinedCategories = [
    'Language',
    'Finance',
    'Visa',
    'Universities',
    'Accommodation',
    'Travel',
    'Culture',
    'Legal',
    'Health',
    'General'
  ]

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Note Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.title ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            }`}
            placeholder="Enter note title"
          />
          {errors.title && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Category *
          </label>
          <div className="relative">
            <input
              type="text"
              list="categories"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.category ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
              }`}
              placeholder="Enter or select category"
            />
            <datalist id="categories">
              {predefinedCategories.map(category => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </div>
          {errors.category && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.category}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Content *
        </label>
        <textarea
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          className={`w-full px-3 py-2 border rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.content ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder="Write your note content here..."
        />
        {errors.content && <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.content}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Tags (Optional)
        </label>
        <input
          type="text"
          value={formData.tags}
          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter tags separated by commas (e.g., language, german, study-tips)"
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Separate multiple tags with commas. Tags will be converted to lowercase.
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-600">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {note ? 'Update' : 'Add'} Note
        </Button>
      </div>
    </form>
  )
} 