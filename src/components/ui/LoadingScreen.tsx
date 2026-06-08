import React from 'react'
import { GraduationCap } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-50">
      <div className="text-center">
        <GraduationCap className="h-16 w-16 text-blue-600 mx-auto animate-pulse" />
        <h1 className="text-2xl font-bold mt-4 text-gray-900 dark:text-gray-100">Germany Prep Hub</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Loading your dashboard...</p>
      </div>
    </div>
  )
} 