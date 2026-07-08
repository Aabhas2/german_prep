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
  documents?: {
    sopStatus: 'Idea' | 'Draft' | 'Final' | 'Submitted'
    lor1Status: 'Not Requested' | 'Requested' | 'Received'
    lor2Status: 'Not Requested' | 'Requested' | 'Received'
    transcriptStatus: 'Not Requested' | 'Requested' | 'Received' | 'Attested'
  }
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

export type Theme = 'light' | 'dark' | 'system'

export interface CurrencySettings {
  primary: string
  secondary?: string
  displaySymbol: boolean
  exchangeRates: Record<string, number>
  lastUpdated?: string
  autoUpdate?: boolean
}

export interface DashboardSettings {
  showProgressBars: boolean
  showRecentTasks: boolean
  showFinancialOverview: boolean
  showQuickActions: boolean
  tasksToShow: number
}

export interface Settings {
  theme: Theme
  personalDetails: {
    name: string
    email: string
    targetCountry: string
    targetStartDate: string
  }
  certificateStatus?: {
    aps: 'Not Started' | 'Document Collection' | 'Applied' | 'Processing' | 'Received'
    dmat: 'Not Started' | 'Registered' | 'Passed' | 'Failed' | 'N/A'
  }
  languageStatus?: {
    german: {
      exam: 'TestDaF' | 'DSH' | 'Goethe' | 'telc' | 'None'
      currentLevel: 'None' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
      targetLevel: 'B1' | 'B2' | 'C1' | 'C2'
    },
    english: {
      exam: 'IELTS' | 'TOEFL' | 'None'
      currentScore: string
      targetScore: string
    }
  }
  currency: CurrencySettings
  dashboard: DashboardSettings
  notifications: {
    deadlineReminders: boolean
    taskUpdates: boolean
    emailNotifications: boolean
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
    colorScheme: string  // e.g. 'burgundy' | 'ocean' | 'forest' | 'slate' | 'rose' | 'amber'
    sidebarCollapsed: boolean
  }
  data: {
    autoSave: boolean
    backupFrequency: 'daily' | 'weekly' | 'monthly'
    exportFormat: 'json' | 'csv'
    syncEnabled: boolean
  }
}

export interface HousingApplication {
  id: string
  title: string
  type: 'WG' | 'Dormitory' | 'Studio' | 'Apartment'
  city: string
  rent: number
  currency: string
  status: 'Draft' | 'Applied' | 'Interview/Viewing' | 'Offered' | 'Rejected' | 'Accepted'
  moveInDate?: Date
  website?: string
  contactInfo?: string
  notes?: string
}