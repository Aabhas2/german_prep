import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'error'
}

const variantStyles = {
  default: 'bg-blue-500',
  success: 'bg-green-500',
  warning: 'bg-yellow-500',
  error: 'bg-red-500'
}

export const ProgressBar = React.memo(({ 
  value, 
  max = 100, 
  label, 
  showPercentage = true, 
  className,
  variant = 'default'
}: ProgressBarProps) => {
  const percentage = useMemo(() => {
    if (max === 0) return 0
    return Math.min(Math.max((value / max) * 100, 0), 100)
  }, [value, max])

  const progressStyle = useMemo(() => ({
    width: `${percentage}%`,
    transition: 'width 0.3s ease-out'
  }), [percentage])

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{percentage.toFixed(1)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-out',
            variantStyles[variant]
          )}
          style={progressStyle}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  )
})

ProgressBar.displayName = 'ProgressBar' 