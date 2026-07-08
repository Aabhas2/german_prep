import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { University } from '@/types'

interface UniversityFormProps {
  university?: University
  onSubmit: (university: Omit<University, 'id'>) => void
  onCancel: () => void
}

export function UniversityForm({ university, onSubmit, onCancel }: UniversityFormProps) {
  const [formData, setFormData] = useState({
    name: university?.name || '',
    location: university?.location || '',
    course: university?.course || '',
    language: university?.language || 'English',
    applicationDeadline: university?.applicationDeadline 
      ? new Date(university.applicationDeadline).toISOString().split('T')[0] 
      : '',
    status: university?.status || 'Interested' as University['status'],
    website: university?.website || '',
    notes: university?.notes || '',
    documents: university?.documents || {
      sopStatus: 'Idea',
      lor1Status: 'Not Requested',
      lor2Status: 'Not Requested',
      transcriptStatus: 'Not Requested'
    } as NonNullable<University['documents']>
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name.trim() || !formData.location.trim() || !formData.course.trim() || !formData.applicationDeadline) {
      alert('Please fill in all required fields')
      return
    }

    // Validate date
    const deadline = new Date(formData.applicationDeadline)
    if (isNaN(deadline.getTime())) {
      alert('Please enter a valid application deadline')
      return
    }

    // Validate website URL if provided
    if (formData.website && formData.website.trim()) {
      try {
        new URL(formData.website)
      } catch {
        alert('Please enter a valid website URL')
        return
      }
    }

    onSubmit({
      name: formData.name.trim(),
      location: formData.location.trim(),
      course: formData.course.trim(),
      language: formData.language,
      applicationDeadline: deadline,
      status: formData.status,
      website: formData.website.trim() || undefined,
      notes: formData.notes.trim() || undefined,
      documents: formData.documents
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          University Name *
        </label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Technical University of Munich"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Location *
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Munich, Bavaria"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Course *
        </label>
        <input
          type="text"
          name="course"
          value={formData.course}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g., Computer Science (M.Sc.)"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-1">
            Language
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="English">English</option>
            <option value="German">German</option>
            <option value="Both">Both</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground/85 mb-1">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Interested">Interested</option>
            <option value="Applied">Applied</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Application Deadline *
        </label>
        <input
          type="date"
          name="applicationDeadline"
          value={formData.applicationDeadline}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Website
        </label>
        <input
          type="url"
          name="website"
          value={formData.website}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="https://www.university.edu"
        />
      </div>

      <div className="pt-4 pb-2 border-t border-border mt-4">
        <h4 className="text-sm font-semibold text-foreground mb-3">Documents Tracker</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-foreground/85 mb-1">SOP Status</label>
            <select
              value={formData.documents.sopStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, sopStatus: e.target.value as any } }))}
              className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-card focus:ring-2 focus:ring-primary"
            >
              <option value="Idea">Idea</option>
              <option value="Draft">Draft</option>
              <option value="Final">Final</option>
              <option value="Submitted">Submitted</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground/85 mb-1">Transcript Status</label>
            <select
              value={formData.documents.transcriptStatus}
              onChange={(e) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, transcriptStatus: e.target.value as any } }))}
              className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-card focus:ring-2 focus:ring-primary"
            >
              <option value="Not Requested">Not Requested</option>
              <option value="Requested">Requested</option>
              <option value="Received">Received</option>
              <option value="Attested">Attested</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground/85 mb-1">LOR 1 Status</label>
            <select
              value={formData.documents.lor1Status}
              onChange={(e) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, lor1Status: e.target.value as any } }))}
              className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-card focus:ring-2 focus:ring-primary"
            >
              <option value="Not Requested">Not Requested</option>
              <option value="Requested">Requested</option>
              <option value="Received">Received</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-foreground/85 mb-1">LOR 2 Status</label>
            <select
              value={formData.documents.lor2Status}
              onChange={(e) => setFormData(prev => ({ ...prev, documents: { ...prev.documents, lor2Status: e.target.value as any } }))}
              className="w-full px-3 py-1.5 text-sm border border-input rounded-md bg-card focus:ring-2 focus:ring-primary"
            >
              <option value="Not Requested">Not Requested</option>
              <option value="Requested">Requested</option>
              <option value="Received">Received</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-foreground/85 mb-1">
          Notes
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-input rounded-md bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Additional notes about this university..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {university ? 'Update University' : 'Add University'}
        </Button>
      </div>
    </form>
  )
} 