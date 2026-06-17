import React, { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  max?: number
  label?: string
  showPercentage?: boolean
  className?: string
  variant?: 'default' | 'success' | 'warning' | 'danger'
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
  }), [percentage])

  // Determine color based on variant or auto-pick based on percentage
  const barColor = useMemo(() => {
    if (variant === 'success') return 'bg-success'
    if (variant === 'warning') return 'bg-warning'
    if (variant === 'danger')  return 'bg-danger'
    // default: auto-color based on percentage
    if (percentage >= 80) return 'bg-danger'
    if (percentage >= 50) return 'bg-warning'
    return 'bg-primary'
  }, [variant, percentage])

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm font-medium text-foreground">{label}</span>
          {showPercentage && (
            <span className="text-xs text-muted-foreground font-medium">{percentage.toFixed(0)}%</span>
          )}
        </div>
      )}
      <div className="w-full bg-muted rounded-full h-1.5 overflow-hidden">
        <div
          className={cn('h-full rounded-full transition-all duration-500 ease-out', barColor)}
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