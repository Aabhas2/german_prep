import React from 'react'
import { GraduationCap } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
      <div className="text-center">
        <GraduationCap className="h-16 w-16 text-primary mx-auto animate-pulse" />
        <h1 className="text-2xl font-bold mt-4 text-foreground">UniRoute DE</h1>
        <p className="text-muted-foreground mt-2">Loading your dashboard...</p>
      </div>
    </div>
  )
}
 