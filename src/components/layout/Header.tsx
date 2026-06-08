'use client'

import { useState, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, GraduationCap, LogIn, LogOut, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Universities', href: '/universities' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Finance', href: '/finance' },
  { name: 'Exams', href: '/exams' },
  { name: 'Visa', href: '/visa' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Notes', href: '/notes' },
  { name: 'Settings', href: '/settings' },
]

const Header = memo(function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900 dark:text-gray-100">Prep Hub</span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-baseline space-x-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Visual Section */}
            <div className="border-l border-gray-200 dark:border-gray-700 h-6 pl-4 flex items-center space-x-3">
              {user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1.5 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <User className="h-4 w-4 text-gray-500" />
                    <span className="max-w-[100px] truncate">{user.displayName || user.email}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-1 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center space-x-1 px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            {user ? (
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LogOut className="h-5 w-5" />
              </button>
            ) : (
              <Link
                href="/login"
                className="p-2 text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
              >
                <LogIn className="h-5 w-5" />
              </Link>
            )}
            <button
              type="button"
              className="bg-white dark:bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 dark:text-gray-300 hover:text-gray-500 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMobileMenu}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200 dark:border-gray-700">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'block px-3 py-2 rounded-md text-base font-medium transition-colors',
                    pathname === item.href
                      ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-100'
                  )}
                  onClick={closeMobileMenu}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
})

export { Header } 