import React from 'react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export const Card = React.memo(({ children, className, hover = true }: CardProps) => (
  <div className={cn(
    'bg-card text-card-foreground rounded-xl border border-border shadow-sm transition-all duration-200 fade-in',
    hover && 'hover:shadow-md hover:-translate-y-0.5',
    className
  )}>
    {children}
  </div>
))

Card.displayName = 'Card'

interface CardHeaderProps {
  children: ReactNode
  className?: string
}

export const CardHeader = React.memo(({ children, className }: CardHeaderProps) => (
  <div className={cn('px-6 py-4 border-b border-border', className)}>
    {children}
  </div>
))

CardHeader.displayName = 'CardHeader'

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export const CardTitle = React.memo(({ children, className }: CardTitleProps) => (
  <h3 className={cn('text-base font-semibold text-foreground tracking-tight', className)}>
    {children}
  </h3>
))

CardTitle.displayName = 'CardTitle'

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent = React.memo(({ children, className }: CardContentProps) => (
  <div className={cn('p-6', className)}>
    {children}
  </div>
))

CardContent.displayName = 'CardContent'