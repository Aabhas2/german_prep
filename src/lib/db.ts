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
import { Task, University, Exam, FinanceItem, Note, Scholarship, VisaStep, Settings, SavingsGoal } from '@/types'

// Helpers to get subcollection paths
const getTasksRef = (userId: string) => collection(db, 'users', userId, 'tasks')
const getUniversitiesRef = (userId: string) => collection(db, 'users', userId, 'universities')
const getExamsRef = (userId: string) => collection(db, 'users', userId, 'exams')
const getFinanceItemsRef = (userId: string) => collection(db, 'users', userId, 'financeItems')
const getNotesRef = (userId: string) => collection(db, 'users', userId, 'notes')
const getScholarshipsRef = (userId: string) => collection(db, 'users', userId, 'scholarships')
const getVisaStepsRef = (userId: string) => collection(db, 'users', userId, 'visaSteps')
const getSavingsGoalsRef = (userId: string) => collection(db, 'users', userId, 'savingsGoals')
const getUserSettingsDocRef = (userId: string) => doc(db, 'users', userId, 'settings', 'appSettings')

// Tasks CRUD
export const dbTasks = {
  fetch: async (userId: string): Promise<Task[]> => {
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
  },
  add: async (userId: string, task: Omit<Task, 'id' | 'createdAt'>): Promise<Task> => {
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
  },
  update: async (userId: string, task: Task): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'tasks', task.id)
    await updateDoc(docRef, {
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
      createdAt: task.createdAt ? task.createdAt.toISOString() : new Date().toISOString()
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'tasks', id)
    await deleteDoc(docRef)
  }
}

// Universities CRUD
export const dbUniversities = {
  fetch: async (userId: string): Promise<University[]> => {
    const snapshot = await getDocs(getUniversitiesRef(userId))
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        applicationDeadline: data.applicationDeadline ? new Date(data.applicationDeadline) : new Date()
      } as University
    })
  },
  add: async (userId: string, uni: Omit<University, 'id'>): Promise<University> => {
    const docRef = await addDoc(getUniversitiesRef(userId), {
      ...uni,
      applicationDeadline: uni.applicationDeadline.toISOString()
    })
    return { ...uni, id: docRef.id }
  },
  update: async (userId: string, uni: University): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'universities', uni.id)
    await updateDoc(docRef, {
      ...uni,
      applicationDeadline: uni.applicationDeadline.toISOString()
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'universities', id)
    await deleteDoc(docRef)
  }
}

// Exams CRUD
export const dbExams = {
  fetch: async (userId: string): Promise<Exam[]> => {
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
  },
  add: async (userId: string, exam: Omit<Exam, 'id'>): Promise<Exam> => {
    const docRef = await addDoc(getExamsRef(userId), {
      ...exam,
      plannedDate: exam.plannedDate ? exam.plannedDate.toISOString() : null,
      actualDate: exam.actualDate ? exam.actualDate.toISOString() : null
    })
    return { ...exam, id: docRef.id }
  },
  update: async (userId: string, exam: Exam): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'exams', exam.id)
    await updateDoc(docRef, {
      ...exam,
      plannedDate: exam.plannedDate ? exam.plannedDate.toISOString() : null,
      actualDate: exam.actualDate ? exam.actualDate.toISOString() : null
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'exams', id)
    await deleteDoc(docRef)
  }
}

// Finance CRUD
export const dbFinance = {
  fetch: async (userId: string): Promise<FinanceItem[]> => {
    const snapshot = await getDocs(getFinanceItemsRef(userId))
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }) as FinanceItem)
  },
  add: async (userId: string, item: Omit<FinanceItem, 'id'>): Promise<FinanceItem> => {
    const docRef = await addDoc(getFinanceItemsRef(userId), item)
    return { ...item, id: docRef.id }
  },
  update: async (userId: string, item: FinanceItem): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'financeItems', item.id)
    await updateDoc(docRef, item as any)
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'financeItems', id)
    await deleteDoc(docRef)
  }
}

// Savings Goals CRUD
export const dbSavingsGoals = {
  fetch: async (userId: string): Promise<SavingsGoal[]> => {
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
  },
  add: async (userId: string, goal: Omit<SavingsGoal, 'id' | 'createdAt'>): Promise<SavingsGoal> => {
    const docRef = await addDoc(getSavingsGoalsRef(userId), {
      ...goal,
      deadline: goal.deadline ? goal.deadline.toISOString() : null,
      createdAt: new Date().toISOString()
    })
    return {
      ...goal,
      id: docRef.id,
      createdAt: new Date()
    }
  },
  update: async (userId: string, goal: SavingsGoal): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'savingsGoals', goal.id)
    await updateDoc(docRef, {
      ...goal,
      deadline: goal.deadline ? goal.deadline.toISOString() : null,
      createdAt: goal.createdAt ? (goal.createdAt instanceof Date ? goal.createdAt.toISOString() : new Date(goal.createdAt).toISOString()) : new Date().toISOString()
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'savingsGoals', id)
    await deleteDoc(docRef)
  }
}

// Notes CRUD
export const dbNotes = {
  fetch: async (userId: string): Promise<Note[]> => {
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
  },
  add: async (userId: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Promise<Note> => {
    const now = new Date().toISOString()
    const docRef = await addDoc(getNotesRef(userId), {
      ...note,
      createdAt: now,
      updatedAt: now
    })
    return {
      ...note,
      id: docRef.id,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  },
  update: async (userId: string, note: Note): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'notes', note.id)
    await updateDoc(docRef, {
      ...note,
      createdAt: note.createdAt ? (note.createdAt instanceof Date ? note.createdAt.toISOString() : new Date(note.createdAt).toISOString()) : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'notes', id)
    await deleteDoc(docRef)
  }
}

// Scholarships CRUD
export const dbScholarships = {
  fetch: async (userId: string): Promise<Scholarship[]> => {
    const snapshot = await getDocs(getScholarshipsRef(userId))
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        deadline: data.deadline ? new Date(data.deadline) : new Date()
      } as Scholarship
    })
  },
  add: async (userId: string, scholarship: Omit<Scholarship, 'id'>): Promise<Scholarship> => {
    const docRef = await addDoc(getScholarshipsRef(userId), {
      ...scholarship,
      deadline: scholarship.deadline.toISOString()
    })
    return { ...scholarship, id: docRef.id }
  },
  update: async (userId: string, scholarship: Scholarship): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'scholarships', scholarship.id)
    await updateDoc(docRef, {
      ...scholarship,
      deadline: scholarship.deadline.toISOString()
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'scholarships', id)
    await deleteDoc(docRef)
  }
}

// Visa Steps CRUD
export const dbVisaSteps = {
  fetch: async (userId: string): Promise<VisaStep[]> => {
    const snapshot = await getDocs(getVisaStepsRef(userId))
    return snapshot.docs.map(doc => {
      const data = doc.data()
      return {
        ...data,
        id: doc.id,
        dueDate: data.dueDate ? new Date(data.dueDate) : undefined
      } as VisaStep
    })
  },
  add: async (userId: string, step: Omit<VisaStep, 'id'>): Promise<VisaStep> => {
    const docRef = await addDoc(getVisaStepsRef(userId), {
      ...step,
      dueDate: step.dueDate ? step.dueDate.toISOString() : null
    })
    return { ...step, id: docRef.id }
  },
  update: async (userId: string, step: VisaStep): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'visaSteps', step.id)
    await updateDoc(docRef, {
      ...step,
      dueDate: step.dueDate ? step.dueDate.toISOString() : null
    })
  },
  delete: async (userId: string, id: string): Promise<void> => {
    const docRef = doc(db, 'users', userId, 'visaSteps', id)
    await deleteDoc(docRef)
  }
}

// User Settings CRUD
export const dbSettings = {
  fetch: async (userId: string): Promise<Settings | null> => {
    const docRef = getUserSettingsDocRef(userId)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      return docSnap.data() as Settings
    }
    return null
  },
  update: async (userId: string, settings: Settings): Promise<void> => {
    const docRef = getUserSettingsDocRef(userId)
    await setDoc(docRef, settings, { merge: true })
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
}): Promise<void> => {
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

  await batch.commit()
}
