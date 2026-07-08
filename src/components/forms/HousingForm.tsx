import { useState, useEffect } from 'react'
import { HousingApplication } from '@/types'
import { Button } from '@/components/ui/Button'

interface HousingFormProps {
  initialData?: HousingApplication
  onSubmit: (data: Omit<HousingApplication, 'id'>) => void
  onCancel: () => void
}

export function HousingForm({ initialData, onSubmit, onCancel }: HousingFormProps) {
  const [formData, setFormData] = useState<Omit<HousingApplication, 'id'>>({
    title: '',
    type: 'WG',
    city: '',
    rent: 0,
    currency: 'EUR',
    status: 'Draft',
    notes: '',
    website: '',
    contactInfo: ''
  })

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Title</label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. WG in Mitte"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">City</label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g. Berlin"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="WG">WG (Shared Apartment)</option>
            <option value="Dormitory">Dormitory</option>
            <option value="Studio">Studio</option>
            <option value="Apartment">Apartment</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="Draft">Draft / Interested</option>
            <option value="Applied">Applied</option>
            <option value="Interview/Viewing">Interview / Viewing</option>
            <option value="Offered">Offered</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Rent (Warmmiete)</label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-muted-foreground text-sm">€</span>
            <input
              type="number"
              required
              min="0"
              value={formData.rent}
              onChange={(e) => setFormData({ ...formData, rent: Number(e.target.value) })}
              className="w-full rounded-md border border-input bg-background pl-7 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">Move-in Date</label>
          <input
            type="date"
            value={formData.moveInDate ? new Date(formData.moveInDate).toISOString().split('T')[0] : ''}
            onChange={(e) => setFormData({ ...formData, moveInDate: e.target.value ? new Date(e.target.value) : undefined })}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Listing Website URL</label>
        <input
          type="url"
          value={formData.website}
          onChange={(e) => setFormData({ ...formData, website: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="https://..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">Notes</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
          placeholder="Viewing on Tuesday, need Schufa..."
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {initialData ? 'Save Changes' : 'Add Application'}
        </Button>
      </div>
    </form>
  )
}
