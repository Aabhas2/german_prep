'use client'

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react'
import { cn } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────
type ToastVariant = 'success' | 'error' | 'warning' | 'info'

interface Toast {
  id: string
  message: string
  variant: ToastVariant
  duration?: number
}

interface ToastContextType {
  toast: (message: string, variant?: ToastVariant, duration?: number) => void
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

// ─── Context ─────────────────────────────────────────────────────────────────
const ToastContext = createContext<ToastContextType | undefined>(undefined)

// ─── Individual Toast Item ────────────────────────────────────────────────────
function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const duration = toast.duration ?? 3500

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10)
    // Trigger leave
    const l = setTimeout(() => {
      setLeaving(true)
      setTimeout(() => onRemove(toast.id), 300)
    }, duration)
    return () => { clearTimeout(t); clearTimeout(l) }
  }, [toast.id, duration, onRemove])

  const icons: Record<ToastVariant, React.ReactNode> = {
    success: <CheckCircle className="h-4 w-4 shrink-0" />,
    error:   <XCircle    className="h-4 w-4 shrink-0" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0" />,
    info:    <Info       className="h-4 w-4 shrink-0" />,
  }

  const styles: Record<ToastVariant, string> = {
    success: 'bg-card border-success/30 text-foreground [&_svg]:text-success',
    error:   'bg-card border-danger/30  text-foreground [&_svg]:text-danger',
    warning: 'bg-card border-warning/30 text-foreground [&_svg]:text-warning',
    info:    'bg-card border-info/30    text-foreground [&_svg]:text-info',
  }

  const progressColors: Record<ToastVariant, string> = {
    success: 'bg-success',
    error:   'bg-danger',
    warning: 'bg-warning',
    info:    'bg-info',
  }

  return (
    <div
      className={cn(
        'relative flex items-start gap-3 w-80 px-4 py-3 rounded-xl border shadow-lg overflow-hidden',
        'transition-all duration-300',
        styles[toast.variant],
        visible && !leaving ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'
      )}
    >
      {icons[toast.variant]}
      <p className="flex-1 text-sm leading-relaxed">{toast.message}</p>
      <button
        onClick={() => { setLeaving(true); setTimeout(() => onRemove(toast.id), 300) }}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
      >
        <X className="h-3.5 w-3.5" />
      </button>
      {/* Progress bar */}
      <div
        className={cn('absolute bottom-0 left-0 h-0.5 origin-left', progressColors[toast.variant])}
        style={{ animation: `shrink ${duration}ms linear forwards` }}
      />
    </div>
  )
}

// ─── Provider ─────────────────────────────────────────────────────────────────
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const add = useCallback((message: string, variant: ToastVariant = 'info', duration?: number) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts(prev => [...prev.slice(-2), { id, message, variant, duration }])
  }, [])

  const value: ToastContextType = {
    toast:   add,
    success: (m) => add(m, 'success'),
    error:   (m) => add(m, 'error'),
    warning: (m) => add(m, 'warning'),
    info:    (m) => add(m, 'info'),
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Portal-style fixed container */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div key={t.id} className="pointer-events-auto">
            <ToastItem toast={t} onRemove={remove} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
