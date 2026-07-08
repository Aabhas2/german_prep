import { 
  dbTasks, 
  dbUniversities, 
  dbExams, 
  dbFinance, 
  dbSavingsGoals, 
  dbNotes, 
  dbScholarships, 
  dbVisaSteps,
  dbSettings
} from './db'
import { Task, University, Exam, FinanceItem, SavingsGoal, Note, Scholarship, VisaStep, Settings } from '@/types'

export const hasLocalDataToMigrate = (): boolean => {
  if (typeof window === 'undefined') return false
  
  const keys = [
    'tasks',
    'universities',
    'exams',
    'financeItems',
    'savingsGoals',
    'notes',
    'scholarships',
    'visaSteps',
    'appSettings' 
  ]
  
  for (const key of keys) {
    const data = localStorage.getItem(key)
    if (data && data !== '[]' && data !== '{}') {
      return true
    }
  }
  
  return false
}

export const migrateLocalDataToCloud = async (userId: string): Promise<void> => {
  if (typeof window === 'undefined') return

  try {
    const promises: Promise<any>[] = []

    const localTasksStr = localStorage.getItem('tasks')
    if (localTasksStr) {
      const localTasks: Task[] = JSON.parse(localTasksStr)
      localTasks.forEach(task => {
        const { id, ...taskData } = task
        promises.push(dbTasks.add(userId, taskData))
      })
    }

    const localUnisStr = localStorage.getItem('universities')
    if (localUnisStr) {
      const localUnis: University[] = JSON.parse(localUnisStr)
      localUnis.forEach(uni => {
        const { id, ...uniData } = uni
        promises.push(dbUniversities.add(userId, uniData))
      })
    }

    const localExamsStr = localStorage.getItem('exams')
    if (localExamsStr) {
      const localExams: Exam[] = JSON.parse(localExamsStr)
      localExams.forEach(exam => {
        const { id, ...examData } = exam
        promises.push(dbExams.add(userId, examData))
      })
    }

    const localFinanceStr = localStorage.getItem('financeItems')
    if (localFinanceStr) {
      const localFinance: FinanceItem[] = JSON.parse(localFinanceStr)
      localFinance.forEach(item => {
        const { id, ...itemData } = item
        promises.push(dbFinance.add(userId, itemData))
      })
    }

    const localSavingsStr = localStorage.getItem('savingsGoals')
    if (localSavingsStr) {
      const localSavings: SavingsGoal[] = JSON.parse(localSavingsStr)
      localSavings.forEach(goal => {
        const { id, ...goalData } = goal
        promises.push(dbSavingsGoals.add(userId, goalData))
      })
    }

    const localNotesStr = localStorage.getItem('notes')
    if (localNotesStr) {
      const localNotes: Note[] = JSON.parse(localNotesStr)
      localNotes.forEach(note => {
        const { id, ...noteData } = note
        promises.push(dbNotes.add(userId, noteData))
      })
    }

    const localScholarshipsStr = localStorage.getItem('scholarships')
    if (localScholarshipsStr) {
      const localScholarships: Scholarship[] = JSON.parse(localScholarshipsStr)
      localScholarships.forEach(scholarship => {
        const { id, ...scholarshipData } = scholarship
        promises.push(dbScholarships.add(userId, scholarshipData))
      })
    }

    const localVisaStr = localStorage.getItem('visaSteps')
    if (localVisaStr) {
      const localVisa: VisaStep[] = JSON.parse(localVisaStr)
      localVisa.forEach(step => {
        const { id, ...stepData } = step
        promises.push(dbVisaSteps.add(userId, stepData))
      })
    }

    const localSettingsStr = localStorage.getItem('appSettings')
    if (localSettingsStr) {
      const localSettings: Partial<Settings> = JSON.parse(localSettingsStr)
      const cloudSettings = await dbSettings.fetch(userId)
      if (!cloudSettings || Object.keys(cloudSettings).length === 0) {
        promises.push(dbSettings.update(userId, localSettings as Settings))
      }
    }

    await Promise.all(promises)

    const keysToClear = [
      'tasks', 'universities', 'exams', 'financeItems', 
      'savingsGoals', 'notes', 'scholarships', 'visaSteps', 'appSettings'
    ]
    keysToClear.forEach(key => localStorage.removeItem(key))

  } catch (error) {
    console.error('Error during data migration:', error)
    throw error
  }
}
