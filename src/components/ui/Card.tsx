import React from 'react'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export const Card = React.memo(({ children, className }: CardProps) => (
  <div className={cn(
    'bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] gpu-accelerated fade-in',
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
  <div className={cn('mb-4', className)}>
    {children}
  </div>
))

CardHeader.displayName = 'CardHeader'

interface CardTitleProps {
  children: ReactNode
  className?: string
}

export const CardTitle = React.memo(({ children, className }: CardTitleProps) => (
  <h3 className={cn('text-xl font-semibold text-gray-900 dark:text-gray-100', className)}>
    {children}
  </h3>
))

CardTitle.displayName = 'CardTitle'

interface CardContentProps {
  children: ReactNode
  className?: string
}

export const CardContent = React.memo(({ children, className }: CardContentProps) => (
  <div className={cn('', className)}>
    {children}
  </div>
))

CardContent.displayName = 'CardContent' 