'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { AlertCircle, Calendar, ChevronRight, Clock, Bell } from 'lucide-react'
import { useDeadlines } from '@/hooks/useDeadlines'

export function DeadlineAlerts() {
  const { deadlines, loading } = useDeadlines(30) // Next 30 days

  const urgentDeadlines = useMemo(() => {
    const now = new Date()
    const next7Days = new Date(now)
    next7Days.setDate(now.getDate() + 7)
    
    return deadlines.filter(d => d.date <= next7Days)
  }, [deadlines])

  if (loading) {
    return (
      <Card className="animate-pulse">
        <CardHeader className="pb-3"><div className="h-6 w-1/3 bg-muted rounded"></div></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-muted rounded-md w-full"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (deadlines.length === 0) return null

  return (
    <Card className={`border-primary/20 ${urgentDeadlines.length > 0 ? 'bg-warning/5 border-warning/30' : 'bg-card'}`}>
      <CardHeader className="pb-3 border-b border-border/50">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Bell className={`h-5 w-5 ${urgentDeadlines.length > 0 ? 'text-warning' : 'text-primary'}`} />
            Upcoming Deadlines
            {urgentDeadlines.length > 0 && (
              <span className="bg-warning text-warning-foreground text-xs font-bold px-2 py-0.5 rounded-full ml-2 flex items-center">
                {urgentDeadlines.length} Urgent
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="pt-4 p-0">
        <div className="divide-y divide-border/50 max-h-[300px] overflow-y-auto custom-scrollbar">
          {deadlines.slice(0, 5).map(deadline => {
            const daysLeft = Math.ceil((deadline.date.getTime() - new Date().getTime()) / (1000 * 3600 * 24))
            const isUrgent = daysLeft <= 7
            
            return (
              <Link href={deadline.href} key={deadline.id}>
                <div className="p-4 hover:bg-muted/50 transition-colors flex items-start gap-3 cursor-pointer group">
                  <div className={`mt-0.5 rounded-full p-1.5 shrink-0 ${isUrgent ? 'bg-warning/20 text-warning' : 'bg-primary/10 text-primary'}`}>
                    {isUrgent ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-sm font-medium truncate ${isUrgent ? 'text-foreground' : 'text-foreground/90'}`}>
                      {deadline.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {deadline.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-muted/60 font-medium">
                        {deadline.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className={`text-xs font-semibold ${isUrgent ? 'text-warning' : 'text-muted-foreground'}`}>
                      {daysLeft === 0 ? 'Today' : `${daysLeft} days`}
                    </span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
        
        {deadlines.length > 5 && (
          <div className="p-3 text-center border-t border-border/50 bg-muted/20">
            <span className="text-xs text-muted-foreground font-medium">
              +{deadlines.length - 5} more deadlines in the next 30 days
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
