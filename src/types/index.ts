export interface University {
  id: string
  name: string
  location: string
  course: string
  language: string
  applicationDeadline: Date
  status: 'Interested' | 'Applied' | 'Accepted' | 'Rejected'
  website?: string
  notes?: string
}

export interface Exam {
  id: string
  name: string
  registrationLink?: string
  fee: number
  plannedDate?: Date
  actualDate?: Date
  status: 'To Register' | 'Registered' | 'Completed'
  score?: string
  preparationResources: string[]
}

export interface Scholarship {
  id: string
  name: string
  amount: number
  currency: string
  eligibility: string
  deadline: Date
  status: 'To Apply' | 'Applied' | 'Accepted' | 'Rejected'
  website?: string
  requirements: string[]
}

export interface FinanceItem {
  id: string
  category: 'Application' | 'Travel' | 'Tuition' | 'Living' | 'Other'
  description: string
  estimatedAmount: number
  actualAmount?: number
  currency: string
  paid: boolean
}

export interface SavingsGoal {
  id: string
  title: string
  targetAmount: number
  currentAmount: number
  currency: string
  deadline?: Date
  description?: string
  createdAt: Date
}

export interface VisaStep {
  id: string
  title: string
  description: string
  status: 'Pending' | 'In Progress' | 'Completed'
  dueDate?: Date
  documents: string[]
  notes?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  category: string
  priority: 'Low' | 'Medium' | 'High'
  status: 'To Do' | 'In Progress' | 'Completed'
  dueDate?: Date
  createdAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  category: string
  createdAt: Date
  updatedAt: Date
}

export interface AppSettings {
  theme: 'light' | 'dark'
  notifications: boolean
  personalDetails: {
    name: string
    email: string
    targetCountry: string
    targetStartDate: string
  }
  currency: {
    primary: string
    displaySymbol: boolean
    exchangeRates: Record<string, number>
    lastUpdated: string
    autoUpdate: boolean
  }
  dashboard: {
    showProgressBars: boolean
    showQuickActions: boolean
    showRecentTasks: boolean
    showFinancialOverview: boolean
    tasksToShow: number
    refreshInterval: number
  }
  tasks: {
    defaultPriority: 'Low' | 'Medium' | 'High'
    defaultCategory: string
    showCompletedTasks: boolean
    autoArchiveCompleted: boolean
    sortBy: 'dueDate' | 'priority' | 'created' | 'title'
    groupByCategory: boolean
  }
  universities: {
    defaultLanguage: 'English' | 'German' | 'Both'
    showDeadlineWarnings: boolean
    warningDaysBefore: number
    sortBy: 'deadline' | 'name' | 'status'
    showOnlyActive: boolean
  }
  finance: {
    budgetWarningThreshold: number
    showCategoryBreakdown: boolean
    defaultCategory: 'Application' | 'Travel' | 'Tuition' | 'Living' | 'Other'
    trackActualAmounts: boolean
    showCurrencyConverter: boolean
  }
  appearance: {
    compactMode: boolean
    showAnimations: boolean
    fontSize: 'small' | 'medium' | 'large'
    colorScheme: 'blue' | 'green' | 'purple' | 'red' | 'orange'
    sidebarCollapsed: boolean
  }
  data: {
    autoSave: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    exportFormat: 'json' | 'csv'
    syncEnabled: boolean
  }
} 