'use client'

import { useState, useEffect } from 'react'
import { UploadCloud, X } from 'lucide-react'
import { Button } from './Button'
import { useAuth } from '@/contexts/AuthContext'
import { hasLocalDataToMigrate, migrateLocalDataToCloud } from '@/lib/migration'
import { useToast } from './Toast'

export function MigrationBanner() {
  const { user } = useAuth()
  const toast = useToast()
  
  const [isVisible, setIsVisible] = useState(false)
  const [isMigrating, setIsMigrating] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    if (user && !isDismissed) {
      const timer = setTimeout(() => {
        if (hasLocalDataToMigrate()) {
          setIsVisible(true)
        } else {
          setIsVisible(false)
        }
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsVisible(false)
    }
  }, [user, isDismissed])

  const handleMigrate = async () => {
    if (!user) return
    
    setIsMigrating(true)
    try {
      await migrateLocalDataToCloud(user.uid)
      toast.success('Successfully migrated your local data to the cloud!')
      setIsVisible(false)
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    } catch (error) {
      console.error('Migration failed:', error)
      toast.error('Failed to migrate data. Please try again.')
      setIsMigrating(false)
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div className="bg-primary text-primary-foreground px-4 py-3 shadow-md relative overflow-hidden flex items-center justify-between">
      <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
      
      <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4 z-10 relative">
        <div className="flex items-center gap-3">
          <div className="bg-primary-foreground/20 p-2 rounded-full">
            <UploadCloud className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-primary-foreground m-0">Sync your offline data</h3>
            <p className="text-primary-foreground/80 text-sm m-0">
              We noticed you have data saved locally. Migrate it to the cloud to access it from anywhere!
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 shrink-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleDismiss}
            disabled={isMigrating}
            className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
          >
            Dismiss
          </Button>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={handleMigrate}
            disabled={isMigrating}
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-medium"
          >
            {isMigrating ? 'Migrating...' : 'Migrate to Cloud'}
          </Button>
        </div>
      </div>
      
      <button 
        onClick={handleDismiss}
        className="absolute top-2 right-2 sm:hidden text-primary-foreground/70 hover:text-primary-foreground"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
