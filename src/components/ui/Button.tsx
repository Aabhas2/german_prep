import React from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const buttonVariants = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-ring',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 focus:ring-ring',
  outline: 'border border-input bg-transparent text-foreground hover:bg-secondary/20 hover:text-foreground focus:ring-ring',
  ghost: 'text-foreground/80 hover:bg-secondary/20 hover:text-foreground focus:ring-ring'
}

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}

export const Button = React.memo(({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  disabled,
  ...props 
}: ButtonProps) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]'
  
  return (
    <button
      className={cn(
        baseClasses,
        buttonVariants[variant],
        buttonSizes[size],
        disabled && 'opacity-50 cursor-not-allowed hover:scale-100',
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = 'Button' 