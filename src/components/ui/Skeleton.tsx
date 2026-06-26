import { cn } from '@/lib/utils'

// ─── Skeleton primitives ───────────────────────────────────────────────────
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />
}

// ─── Stat card skeleton (matches the 4-card dashboard row) ─────────────────
export function SkeletonStatCard() {
  return (
    <div className="rounded-xl border border-border bg-card p-6 flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-7 w-16" />
      </div>
      <Skeleton className="h-12 w-12 rounded-xl" />
    </div>
  )
}

// ─── Generic card skeleton ─────────────────────────────────────────────────
export function SkeletonCard({ rows = 3 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 space-y-4">
      <Skeleton className="h-4 w-36" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg shrink-0" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3 w-2/3" />
          </div>
          <Skeleton className="h-6 w-16 rounded-full shrink-0" />
        </div>
      ))}
    </div>
  )
}

// ─── Table skeleton ────────────────────────────────────────────────────────
export function SkeletonTable({ rows = 4, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* header */}
      <div className="px-6 py-4 border-b border-border flex gap-4">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-3 flex-1" />
        ))}
      </div>
      {/* rows */}
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="px-6 py-4 border-b border-border last:border-0 flex items-center gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton key={c} className={cn('flex-1 h-4', c === 1 ? 'max-w-[80px]' : '')} />
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Page skeleton (title + content) ──────────────────────────────────────
export function SkeletonPage() {
  return (
    <div className="space-y-6 fade-in">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-32 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonStatCard key={i} />)}
      </div>
      <SkeletonCard rows={4} />
    </div>
  )
}
