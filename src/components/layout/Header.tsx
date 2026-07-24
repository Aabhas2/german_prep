'use client'

import Image from 'next/image'
import { useState, useCallback, memo } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, GraduationCap, LogIn, LogOut, User, Sun, Moon, Cloud, HardDrive } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Universities', href: '/universities' },
  { name: 'Scholarships', href: '/scholarships' },
  { name: 'Finance', href: '/finance' },
  { name: 'Exams', href: '/exams' },
  { name: 'Visa', href: '/visa' },
  { name: 'Tasks', href: '/tasks' },
  { name: 'Notes', href: '/notes' },
  { name: 'Housing', href: '/housing' },
  { name: 'Settings', href: '/settings' },
]

const Header = memo(function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()
  const { settings, updateSettings } = useTheme()

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev)
  }, [])

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false)
  }, [])

  const handleLogout = async () => {
    try {
      await logout()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark'
    updateSettings({ theme: next })
  }

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm transition-colors duration-300">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-20 items-center justify-between">

          {/* Brand */}
          <Link href="/" className="flex items-center group">
            <div className="h-16 w-44 sm:w-56 flex items-center justify-start overflow-hidden">
              <Image 
                src="/uni_transparentbg.png" 
                alt="UniRoute DE" 
                width={500} 
                height={500} 
                className="h-36 sm:h-44 w-auto object-contain shrink-0 group-hover:scale-105 transition-transform duration-200 dark:drop-shadow-[0_1px_2px_rgba(255,255,255,0.4)]" 
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">

            {/* Storage Mode Badge */}
            {user ? (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[11px] font-medium">
                <Cloud className="h-3 w-3" /> Cloud Synced
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted border border-border text-muted-foreground text-[11px] font-medium">
                <HardDrive className="h-3 w-3 text-primary" /> Offline Local Mode
              </span>
            )}

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle theme"
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              {settings.theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="hidden sm:flex items-center space-x-1 px-2.5 py-1 bg-muted rounded-lg border border-border">
                  <User className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium text-foreground max-w-[120px] truncate">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 rounded-lg text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity shadow-sm"
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-3 border-t border-border space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobileMenu}
                className={cn(
                  'block px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  pathname === item.href
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        )}
      </nav>
    </header>
  )
})

export default Header