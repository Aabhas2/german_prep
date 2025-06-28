import { Loader2 } from 'lucide-react'

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export function Loading({ size = 'md', text = 'Loading...', className = '' }: LoadingProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }

  return (
    <div className={`flex items-center justify-center space-x-2 ${className}`}>
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  )
}

export function LoadingPage({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loading size="lg" text={text} />
    </div>
  )
}

export function LoadingCard({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="p-8 text-center">
      <Loading size="md" text={text} />
    </div>
  )
} 