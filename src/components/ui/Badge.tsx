import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'primary' | 'accent'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants: Record<string, string> = {
    default: 'status-neutral',
    success: 'status-success',
    warning: 'status-warning',
    error:   'status-danger',
    info:    'status-info',
    primary: 'bg-primary/10 text-primary border border-primary/20',
    accent:  'bg-accent/10 text-accent-foreground border border-accent/20',
  }

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant] ?? variants.default,
      className
    )}>
      {children}
    </span>
  )
}