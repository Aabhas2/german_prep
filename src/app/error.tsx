'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { AlertTriangle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app error:', error)
  }, [error])

  // Check if it's a Firebase permission error
  const isPermissionError = error.message.toLowerCase().includes('permission') || 
                            error.message.toLowerCase().includes('missing or insufficient')

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-card rounded-lg shadow-lg border border-border p-6 text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-danger" />
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Something went wrong</h2>
          
          {isPermissionError ? (
            <p className="text-muted-foreground text-sm">
              Your database permissions are missing. Please deploy the `firestore.rules` file to your Firebase project to enable cloud sync, or log out to use local storage mode.
            </p>
          ) : (
            <p className="text-muted-foreground text-sm">
              {error.message || "An unexpected error occurred while loading this page."}
            </p>
          )}
        </div>

        <div className="flex flex-col space-y-3 pt-4 border-t border-border">
          <Button onClick={() => reset()} variant="primary" className="w-full">
            Try again
          </Button>
          <Button onClick={() => window.location.href = '/dashboard'} variant="outline" className="w-full">
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
