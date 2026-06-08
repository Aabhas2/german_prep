'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { User, Mail, Lock, ShieldAlert, LogIn, UserPlus } from 'lucide-react'
import { migrateLocalDataToCloud } from '@/lib/db'
import { defaultSettings } from '@/contexts/ThemeContext'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail } = useAuth()

  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/')
    }
  }, [user, loading, router])

  const triggerMigrationAfterLogin = async () => {
    const currentUser = auth.currentUser
    if (!currentUser) return

    // Check if there is local data
    const tasksLocal = localStorage.getItem('tasks')
    const universitiesLocal = localStorage.getItem('universities')
    const examsLocal = localStorage.getItem('exams')
    const financeLocal = localStorage.getItem('financeItems')
    const notesLocal = localStorage.getItem('notes')
    const scholarshipsLocal = localStorage.getItem('scholarships')
    const visaStepsLocal = localStorage.getItem('visaSteps')
    const settingsLocal = localStorage.getItem('settings')

    // If there is any local data, let's migrate it
    const hasLocalData = tasksLocal || universitiesLocal || examsLocal || financeLocal || notesLocal || scholarshipsLocal || visaStepsLocal

    if (hasLocalData) {
      try {
        const tasks = tasksLocal ? JSON.parse(tasksLocal) : []
        const universities = universitiesLocal ? JSON.parse(universitiesLocal) : []
        const exams = examsLocal ? JSON.parse(examsLocal) : []
        const financeItems = financeLocal ? JSON.parse(financeLocal) : []
        const notes = notesLocal ? JSON.parse(notesLocal) : []
        const scholarships = scholarshipsLocal ? JSON.parse(scholarshipsLocal) : []
        const visaSteps = visaStepsLocal ? JSON.parse(visaStepsLocal) : []
        
        let settings = defaultSettings
        if (settingsLocal) {
          try {
            settings = { ...defaultSettings, ...JSON.parse(settingsLocal) }
          } catch (e) {
            console.error('Error parsing local settings:', e)
          }
        }

        // Migrate to firestore
        await migrateLocalDataToCloud(currentUser.uid, {
          tasks,
          universities,
          exams,
          financeItems,
          notes,
          scholarships,
          visaSteps,
          settings
        })

        // Clear local storage keys so we don't migrate them again next time
        localStorage.removeItem('tasks')
        localStorage.removeItem('universities')
        localStorage.removeItem('exams')
        localStorage.removeItem('financeItems')
        localStorage.removeItem('notes')
        localStorage.removeItem('scholarships')
        localStorage.removeItem('visaSteps')
        localStorage.removeItem('settings')
      } catch (err) {
        console.error('Error migrating local data to cloud:', err)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setAuthLoading(true)

    try {
      if (isSignUp) {
        if (!name.trim()) {
          throw new Error('Please enter your name.')
        }
        await signUpWithEmail(email, password, name)
      } else {
        await signInWithEmail(email, password)
      }
      await triggerMigrationAfterLogin()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    setAuthLoading(true)
    try {
      await signInWithGoogle()
      await triggerMigrationAfterLogin()
      router.push('/')
    } catch (err: any) {
      setError(err.message || 'Google Sign-In failed.')
    } finally {
      setAuthLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-950 px-4">
      <div className="w-full max-w-md">
        {/* Glassmorphic Brand Card */}
        <Card className="border border-white/20 dark:border-gray-800/40 bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl shadow-2xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-2">
              <span className="text-4xl">🌎</span>
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Study Abroad Prep Hub
            </CardTitle>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {isSignUp ? 'Create your profile to start planning' : 'Log in to access your dashboard'}
            </p>
          </CardHeader>

          <CardContent className="mt-4">
            {error && (
              <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm mb-4 border border-red-200 dark:border-red-900/50">
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isSignUp && (
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                    <User className="h-4 w-4" />
                  </span>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                  />
                </div>
              )}

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Mail className="h-4 w-4" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
                  <Lock className="h-4 w-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-gray-100"
                />
              </div>

              <Button
                type="submit"
                disabled={authLoading}
                className="w-full flex items-center justify-center space-x-2 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20"
              >
                {authLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></div>
                ) : isSignUp ? (
                  <>
                    <UserPlus className="h-4 w-4" />
                    <span>Create Account</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-4 w-4" />
                    <span>Log In</span>
                  </>
                )}
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white/70 dark:bg-gray-900 px-2 text-gray-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              disabled={authLoading}
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center space-x-2 border border-gray-300 dark:border-gray-700 bg-white/50 hover:bg-gray-50 dark:bg-gray-800/50 dark:hover:bg-gray-800 rounded-lg py-2"
            >
              <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5.04c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 1.74 14.96 1 12 1 7.42 1 3.53 3.63 1.67 7.43l3.86 3C6.46 7.37 9 5.04 12 5.04z"
                />
                <path
                  fill="#4285F4"
                  d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.89c2.18-2.01 3.7-4.99 3.7-8.62z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.53 14.28c-.24-.72-.38-1.49-.38-2.28s.14-1.56.38-2.28L1.67 6.72C.61 8.87 0 11.36 0 14s.61 5.13 1.67 7.28l3.86-3z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.24 0 5.97-1.09 7.96-2.93l-3.73-2.89c-1.1.74-2.5 1.18-4.23 1.18-3 0-5.54-2.33-6.47-5.39L1.67 16C3.53 19.8 7.42 22.4 12 22.4z"
                />
              </svg>
              <span>Sign in with Google</span>
            </Button>

            <div className="text-center mt-6 text-sm">
              <span className="text-gray-500 dark:text-gray-400">
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
              </span>
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-blue-600 dark:text-blue-400 hover:underline font-medium focus:outline-none"
              >
                {isSignUp ? 'Log In' : 'Sign Up'}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
