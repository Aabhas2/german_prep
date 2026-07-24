import { db } from './firebase'
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  getDoc
} from 'firebase/firestore'
import { Task, University, Exam, FinanceItem, Note, Scholarship, VisaStep, Settings, SavingsGoal, HousingApplication } from '@/types'

// Helpers to get subcollection paths
const getTasksRef = (userId: string) => collection(db, 'users', userId, 'tasks')
const getUniversitiesRef = (userId: string) => collection(db, 'users', userId, 'universities')
const getExamsRef = (userId: string) => collection(db, 'users', userId, 'exams')
const getFinanceItemsRef = (userId: string) => collection(db, 'users', userId, 'financeItems')
const getNotesRef = (userId: string) => collection(db, 'users', userId, 'notes')
const getScholarshipsRef = (userId: string) => collection(db, 'users', userId, 'scholarships')
const getVisaStepsRef = (userId: string) => collection(db, 'users', userId, 'visaSteps')
const getSavingsGoalsRef = (userId: string) => collection(db, 'users', userId, 'savingsGoals')
const getHousingRef = (userId: string) => collection(db, 'users', userId, 'housing')
const getUserSettingsDocRef = (userId: string) => doc(db, 'users', userId, 'settings', 'appSettings')

// Tasks CRUD
export const dbTasks = {
  fetch: async (userId: string): Promise<Task[]> => {
    try {
      const snapshot = await getDocs(getTasksRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
        } as Task
      })
    } catch (err: any) {
      console.warn('Firestore fetch tasks warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
    try {
      const docRef = await addDoc(getTasksRef(userId), {
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: new Date().toISOString()
      })
      return {
        ...task,
        id: docRef.id,
        createdAt: new Date()
      }
    } catch (err: any) {
      console.warn('Firestore add task warning:', err?.message || err)
      return { ...task, id: Date.now().toString(), createdAt: new Date() }
    }
  },
  update: async (userId: string, task: Task): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'tasks', task.id)
      await updateDoc(docRef, {
        ...task,
        dueDate: task.dueDate ? task.dueDate.toISOString() : null,
        createdAt: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString()
      })
    } catch (err: any) {
      console.warn('Firestore update task warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'tasks', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete task warning:', err?.message || err)
    }
  }
}

// Universities CRUD
export const dbUniversities = {
  fetch: async (userId: string): Promise<University[]> => {
    try {
      const snapshot = await getDocs(getUniversitiesRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : new Date()
        } as University
      })
    } catch (err: any) {
      console.warn('Firestore fetch universities warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, uni: Omit<University, 'id'>): Promise<University> => {
    try {
      const safeDeadline = uni.applicationDeadline instanceof Date
        ? uni.applicationDeadline
        : new Date(uni.applicationDeadline)
      const docRef = await addDoc(getUniversitiesRef(userId), {
        ...uni,
        applicationDeadline: safeDeadline.toISOString()
      })
      return { ...uni, id: docRef.id }
    } catch (err: any) {
      console.warn('Firestore add uni warning:', err?.message || err)
      return { ...uni, id: Date.now().toString() }
    }
  },
  update: async (userId: string, uni: University): Promise<void> => {
    try {
      const safeDeadline = uni.applicationDeadline instanceof Date
        ? uni.applicationDeadline
        : new Date(uni.applicationDeadline)
      const docRef = doc(db, 'users', userId, 'universities', uni.id)
      await updateDoc(docRef, {
        ...uni,
        applicationDeadline: safeDeadline.toISOString()
      })
    } catch (err: any) {
      console.warn('Firestore update uni warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'universities', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete uni warning:', err?.message || err)
    }
  }
}

// Exams CRUD
export const dbExams = {
  fetch: async (userId: string): Promise<Exam[]> => {
    try {
      const snapshot = await getDocs(getExamsRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          plannedDate: data.plannedDate ? new Date(data.plannedDate) : undefined,
          actualDate: data.actualDate ? new Date(data.actualDate) : undefined
        } as Exam
      })
    } catch (err: any) {
      console.warn('Firestore fetch exams warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, exam: Omit<Exam, 'id'>): Promise<Exam> => {
    try {
      const docRef = await addDoc(getExamsRef(userId), {
        ...exam,
        plannedDate: exam.plannedDate ? exam.plannedDate.toISOString() : null,
        actualDate: exam.actualDate ? exam.actualDate.toISOString() : null
      })
      return { ...exam, id: docRef.id }
    } catch (err: any) {
      console.warn('Firestore add exam warning:', err?.message || err)
      return { ...exam, id: Date.now().toString() }
    }
  },
  update: async (userId: string, exam: Exam): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'exams', exam.id)
      await updateDoc(docRef, {
        ...exam,
        plannedDate: exam.plannedDate ? exam.plannedDate.toISOString() : null,
        actualDate: exam.actualDate ? exam.actualDate.toISOString() : null
      })
    } catch (err: any) {
      console.warn('Firestore update exam warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'exams', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete exam warning:', err?.message || err)
    }
  }
}

// Finance CRUD
export const dbFinance = {
  fetch: async (userId: string): Promise<FinanceItem[]> => {
    try {
      const snapshot = await getDocs(getFinanceItemsRef(userId))
      return snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as FinanceItem))
    } catch (err: any) {
      console.warn('Firestore fetch finance warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, item: Omit<FinanceItem, 'id'>): Promise<FinanceItem> => {
    try {
      const docRef = await addDoc(getFinanceItemsRef(userId), item as any)
      return { ...item, id: docRef.id }
    } catch (err: any) {
      console.warn('Firestore add finance item warning:', err?.message || err)
      return { ...item, id: Date.now().toString() }
    }
  },
  update: async (userId: string, item: FinanceItem): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'financeItems', item.id)
      await updateDoc(docRef, item as any)
    } catch (err: any) {
      console.warn('Firestore update finance warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'financeItems', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete finance warning:', err?.message || err)
    }
  }
}

// Savings Goals CRUD
export const dbSavingsGoals = {
  fetch: async (userId: string): Promise<SavingsGoal[]> => {
    try {
      const snapshot = await getDocs(getSavingsGoalsRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          deadline: data.deadline ? new Date(data.deadline) : undefined,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date()
        } as SavingsGoal
      })
    } catch (err: any) {
      console.warn('Firestore fetch savings warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, goal: Omit<SavingsGoal, 'id' | 'createdAt'>): Promise<SavingsGoal> => {
    try {
      const now = new Date()
      const docRef = await addDoc(getSavingsGoalsRef(userId), {
        ...goal,
        deadline: goal.deadline ? goal.deadline.toISOString() : null,
        createdAt: now.toISOString()
      })
      return { ...goal, id: docRef.id, createdAt: now }
    } catch (err: any) {
      console.warn('Firestore add savings goal warning:', err?.message || err)
      return { ...goal, id: Date.now().toString(), createdAt: new Date() }
    }
  },
  update: async (userId: string, goal: SavingsGoal): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'savingsGoals', goal.id)
      await updateDoc(docRef, {
        ...goal,
        deadline: goal.deadline ? goal.deadline.toISOString() : null,
        createdAt: goal.createdAt ? goal.createdAt.toISOString() : new Date().toISOString()
      })
    } catch (err: any) {
      console.warn('Firestore update savings goal warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'savingsGoals', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete savings goal warning:', err?.message || err)
    }
  }
}

// Notes CRUD
export const dbNotes = {
  fetch: async (userId: string): Promise<Note[]> => {
    try {
      const snapshot = await getDocs(getNotesRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          createdAt: data.createdAt ? new Date(data.createdAt) : new Date(),
          updatedAt: data.updatedAt ? new Date(data.updatedAt) : new Date()
        } as Note
      })
    } catch (err: any) {
      console.warn('Firestore fetch notes warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    try {
      const now = new Date()
      const docRef = await addDoc(getNotesRef(userId), {
        ...note,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString()
      })
      return {
        ...note,
        id: docRef.id,
        createdAt: now,
        updatedAt: now
      }
    } catch (err: any) {
      console.warn('Firestore add note warning:', err?.message || err)
      return { ...note, id: Date.now().toString(), createdAt: new Date(), updatedAt: new Date() }
    }
  },
  update: async (userId: string, note: Note): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'notes', note.id)
      await updateDoc(docRef, {
        ...note,
        createdAt: note.createdAt ? note.createdAt.toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
    } catch (err: any) {
      console.warn('Firestore update note warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'notes', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete note warning:', err?.message || err)
    }
  }
}

// Scholarships CRUD
export const dbScholarships = {
  fetch: async (userId: string): Promise<Scholarship[]> => {
    try {
      const snapshot = await getDocs(getScholarshipsRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          deadline: data.deadline ? new Date(data.deadline) : new Date()
        } as Scholarship
      })
    } catch (err: any) {
      console.warn('Firestore fetch scholarships warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, scholarship: Omit<Scholarship, 'id'>): Promise<Scholarship> => {
    try {
      const docRef = await addDoc(getScholarshipsRef(userId), {
        ...scholarship,
        deadline: scholarship.deadline ? scholarship.deadline.toISOString() : new Date().toISOString()
      })
      return { ...scholarship, id: docRef.id }
    } catch (err: any) {
      console.warn('Firestore add scholarship warning:', err?.message || err)
      return { ...scholarship, id: Date.now().toString() }
    }
  },
  update: async (userId: string, scholarship: Scholarship): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'scholarships', scholarship.id)
      await updateDoc(docRef, {
        ...scholarship,
        deadline: scholarship.deadline ? scholarship.deadline.toISOString() : new Date().toISOString()
      })
    } catch (err: any) {
      console.warn('Firestore update scholarship warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'scholarships', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete scholarship warning:', err?.message || err)
    }
  }
}

// Visa Steps CRUD
export const dbVisaSteps = {
  fetch: async (userId: string): Promise<VisaStep[]> => {
    try {
      const snapshot = await getDocs(getVisaStepsRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          dueDate: data.dueDate ? new Date(data.dueDate) : undefined
        } as VisaStep
      })
    } catch (err: any) {
      console.warn('Firestore fetch visa steps warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, step: Omit<VisaStep, 'id'>): Promise<VisaStep> => {
    try {
      const docRef = await addDoc(getVisaStepsRef(userId), {
        ...step,
        dueDate: step.dueDate ? step.dueDate.toISOString() : null
      })
      return { ...step, id: docRef.id }
    } catch (err: any) {
      console.warn('Firestore add visa step warning:', err?.message || err)
      return { ...step, id: Date.now().toString() }
    }
  },
  update: async (userId: string, step: VisaStep): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'visaSteps', step.id)
      await updateDoc(docRef, {
        ...step,
        dueDate: step.dueDate ? step.dueDate.toISOString() : null
      })
    } catch (err: any) {
      console.warn('Firestore update visa step warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'visaSteps', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete visa step warning:', err?.message || err)
    }
  }
}

// User Settings CRUD
export const dbSettings = {
  fetch: async (userId: string): Promise<Settings | null> => {
    try {
      const docRef = getUserSettingsDocRef(userId)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        return docSnap.data() as Settings
      }
      return null
    } catch (err: any) {
      console.warn('Firestore fetch settings warning:', err?.message || err)
      return null
    }
  },
  save: async (userId: string, settings: Partial<Settings>): Promise<void> => {
    try {
      const docRef = getUserSettingsDocRef(userId)
      await setDoc(docRef, settings, { merge: true })
    } catch (err: any) {
      console.warn('Firestore save settings warning:', err?.message || err)
    }
  }
}

// Housing CRUD
export const dbHousing = {
  fetch: async (userId: string): Promise<HousingApplication[]> => {
    try {
      const snapshot = await getDocs(getHousingRef(userId))
      return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          ...data,
          id: doc.id,
          moveInDate: data.moveInDate ? new Date(data.moveInDate) : undefined
        } as HousingApplication
      })
    } catch (err: any) {
      console.warn('Firestore fetch housing warning:', err?.message || err)
      return []
    }
  },
  add: async (userId: string, app: Omit<HousingApplication, 'id'>): Promise<HousingApplication> => {
    try {
      const safeDate = app.moveInDate instanceof Date
        ? app.moveInDate
        : (app.moveInDate ? new Date(app.moveInDate) : undefined)
      const docRef = await addDoc(getHousingRef(userId), {
        ...app,
        moveInDate: safeDate ? safeDate.toISOString() : null
      })
      return { ...app, id: docRef.id }
    } catch (err: any) {
      console.warn('Firestore add housing warning:', err?.message || err)
      return { ...app, id: Date.now().toString() }
    }
  },
  update: async (userId: string, app: HousingApplication): Promise<void> => {
    try {
      const safeDate = app.moveInDate instanceof Date
        ? app.moveInDate
        : (app.moveInDate ? new Date(app.moveInDate) : undefined)
      const docRef = doc(db, 'users', userId, 'housing', app.id)
      await updateDoc(docRef, {
        ...app,
        moveInDate: safeDate ? safeDate.toISOString() : null
      })
    } catch (err: any) {
      console.warn('Firestore update housing warning:', err?.message || err)
    }
  },
  delete: async (userId: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, 'users', userId, 'housing', id)
      await deleteDoc(docRef)
    } catch (err: any) {
      console.warn('Firestore delete housing warning:', err?.message || err)
    }
  }
}

// Batch migration from localStorage to Firestore
export const migrateLocalDataToCloud = async (userId: string, data: {
  tasks: Task[]
  universities: University[]
  exams: Exam[]
  financeItems: FinanceItem[]
  notes: Note[]
  scholarships: Scholarship[]
  visaSteps: VisaStep[]
  settings: Settings
  housing: HousingApplication[]
}): Promise<void> => {
  try {
    const batch = writeBatch(db)

    // Settings
    const settingsRef = getUserSettingsDocRef(userId)
    batch.set(settingsRef, data.settings, { merge: true })

    // Tasks
    data.tasks.forEach(task => {
      const ref = doc(getTasksRef(userId))
      batch.set(ref, {
        ...task,
        dueDate: task.dueDate ? (task.dueDate instanceof Date ? task.dueDate.toISOString() : new Date(task.dueDate).toISOString()) : null,
        createdAt: task.createdAt ? (task.createdAt instanceof Date ? task.createdAt.toISOString() : new Date(task.createdAt).toISOString()) : new Date().toISOString()
      })
    })

    // Universities
    data.universities.forEach(uni => {
      const ref = doc(getUniversitiesRef(userId))
      batch.set(ref, {
        ...uni,
        applicationDeadline: uni.applicationDeadline instanceof Date ? uni.applicationDeadline.toISOString() : new Date(uni.applicationDeadline).toISOString()
      })
    })

    // Exams
    data.exams.forEach(exam => {
      const ref = doc(getExamsRef(userId))
      batch.set(ref, {
        ...exam,
        plannedDate: exam.plannedDate ? (exam.plannedDate instanceof Date ? exam.plannedDate.toISOString() : new Date(exam.plannedDate).toISOString()) : null,
        actualDate: exam.actualDate ? (exam.actualDate instanceof Date ? exam.actualDate.toISOString() : new Date(exam.actualDate).toISOString()) : null
      })
    })

    // Finance Items
    data.financeItems.forEach(item => {
      const ref = doc(getFinanceItemsRef(userId))
      batch.set(ref, item)
    })

    // Notes
    data.notes.forEach(note => {
      const ref = doc(getNotesRef(userId))
      batch.set(ref, {
        ...note,
        createdAt: note.createdAt ? (note.createdAt instanceof Date ? note.createdAt.toISOString() : new Date(note.createdAt).toISOString()) : new Date().toISOString(),
        updatedAt: note.updatedAt ? (note.updatedAt instanceof Date ? note.updatedAt.toISOString() : new Date(note.updatedAt).toISOString()) : new Date().toISOString()
      })
    })

    // Scholarships
    data.scholarships.forEach(s => {
      const ref = doc(getScholarshipsRef(userId))
      batch.set(ref, {
        ...s,
        deadline: s.deadline instanceof Date ? s.deadline.toISOString() : new Date(s.deadline).toISOString()
      })
    })

    // Visa Steps
    data.visaSteps.forEach(vs => {
      const ref = doc(getVisaStepsRef(userId))
      batch.set(ref, {
        ...vs,
        dueDate: vs.dueDate ? (vs.dueDate instanceof Date ? vs.dueDate.toISOString() : new Date(vs.dueDate).toISOString()) : null
      })
    })

    // Housing
    data.housing.forEach(app => {
      const ref = doc(getHousingRef(userId))
      batch.set(ref, {
        ...app,
        moveInDate: app.moveInDate ? (app.moveInDate instanceof Date ? app.moveInDate.toISOString() : new Date(app.moveInDate).toISOString()) : null
      })
    })

    await batch.commit()
  } catch (err: any) {
    console.warn('Cloud migration warning (Firestore error):', err?.message || err)
  }
}
