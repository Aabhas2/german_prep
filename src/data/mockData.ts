import { University, Exam, Scholarship, FinanceItem, SavingsGoal, VisaStep, Task, Note } from '@/types'

export const mockUniversities: University[] = [
  {
    id: '1',
    name: 'Technical University of Munich (TUM)',
    location: 'Munich, Bavaria',
    course: 'Computer Science (M.Sc.)',
    language: 'English',
    applicationDeadline: new Date('2024-07-15'),
    status: 'Applied',
    website: 'https://www.tum.de',
    notes: 'Strong in AI and Machine Learning'
  },
  {
    id: '2',
    name: 'RWTH Aachen University',
    location: 'Aachen, North Rhine-Westphalia',
    course: 'Data Science (M.Sc.)',
    language: 'English',
    applicationDeadline: new Date('2024-08-01'),
    status: 'Interested',
    website: 'https://www.rwth-aachen.de'
  },
  {
    id: '3',
    name: 'University of Stuttgart',
    location: 'Stuttgart, Baden-Württemberg',
    course: 'Information Technology (M.Sc.)',
    language: 'English',
    applicationDeadline: new Date('2024-06-30'),
    status: 'Applied',
    website: 'https://www.uni-stuttgart.de'
  }
]

export const mockExams: Exam[] = [
  {
    id: '1',
    name: 'IELTS Academic',
    registrationLink: 'https://www.ielts.org',
    fee: 250,
    plannedDate: new Date('2024-05-15'),
    status: 'Registered',
    preparationResources: ['Cambridge IELTS Books', 'Online Practice Tests', 'Speaking Partner']
  },
  {
    id: '2',
    name: 'TestAS',
    registrationLink: 'https://www.testas.de',
    fee: 200,
    plannedDate: new Date('2024-06-01'),
    status: 'To Register',
    preparationResources: ['TestAS Preparation Course', 'Sample Tests']
  },
  {
    id: '3',
    name: 'APS Certificate',
    fee: 175,
    status: 'Completed',
    actualDate: new Date('2024-03-20'),
    score: 'Passed',
    preparationResources: ['Academic Transcript Review', 'Interview Preparation']
  }
]

export const mockScholarships: Scholarship[] = [
  {
    id: '1',
    name: 'DAAD Scholarship',
    amount: 861,
    currency: 'EUR',
    eligibility: 'Master\'s students from developing countries',
    deadline: new Date('2024-09-30'),
    status: 'To Apply',
    website: 'https://www.daad.de',
    requirements: ['Academic Excellence', 'Language Proficiency', 'Motivation Letter']
  },
  {
    id: '2',
    name: 'Deutschland Stipendium',
    amount: 300,
    currency: 'EUR',
    eligibility: 'High-achieving students',
    deadline: new Date('2024-07-31'),
    status: 'Applied',
    requirements: ['Good Grades', 'Social Engagement', 'Financial Need']
  }
]

export const mockFinanceItems: FinanceItem[] = [
  {
    id: '1',
    category: 'Application',
    description: 'University Application Fees',
    estimatedAmount: 150,
    actualAmount: 125,
    currency: 'EUR',
    paid: true
  },
  {
    id: '2',
    category: 'Travel',
    description: 'Flight Ticket',
    estimatedAmount: 800,
    currency: 'EUR',
    paid: false
  },
  {
    id: '3',
    category: 'Living',
    description: 'First Month Rent + Deposit',
    estimatedAmount: 1200,
    currency: 'EUR',
    paid: false
  },
  {
    id: '4',
    category: 'Tuition',
    description: 'Semester Fee',
    estimatedAmount: 350,
    currency: 'EUR',
    paid: false
  }
]

export const mockSavingsGoals: SavingsGoal[] = [
  {
    id: '1',
    title: 'Study Abroad Fund',
    targetAmount: 15000,
    currentAmount: 8500,
    currency: 'EUR',
    deadline: new Date('2024-08-01'),
    description: 'Total fund needed for first year in Germany',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    title: 'Emergency Fund',
    targetAmount: 3000,
    currentAmount: 1200,
    currency: 'EUR',
    deadline: new Date('2024-07-01'),
    description: 'Emergency backup fund for unexpected expenses',
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    title: 'Travel & Setup',
    targetAmount: 2000,
    currentAmount: 750,
    currency: 'EUR',
    description: 'Flight tickets, initial setup, and moving expenses',
    createdAt: new Date('2024-03-01')
  }
]

export const mockVisaSteps: VisaStep[] = [
  {
    id: '1',
    title: 'Gather Required Documents',
    description: 'Collect all necessary documents for visa application',
    status: 'In Progress',
    dueDate: new Date('2024-06-15'),
    documents: ['Passport', 'University Admission Letter', 'Financial Proof', 'Health Insurance']
  },
  {
    id: '2',
    title: 'Book Visa Appointment',
    description: 'Schedule appointment at German consulate',
    status: 'Pending',
    dueDate: new Date('2024-07-01'),
    documents: ['Completed Application Form']
  },
  {
    id: '3',
    title: 'Attend Visa Interview',
    description: 'Attend the scheduled visa interview',
    status: 'Pending',
    documents: ['All original documents', 'Copies of documents']
  }
]

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete IELTS Registration',
    description: 'Register for IELTS exam and pay fees',
    category: 'Exams',
    priority: 'High',
    status: 'To Do',
    dueDate: new Date('2024-05-01'),
    createdAt: new Date('2024-04-15')
  },
  {
    id: '2',
    title: 'Write Motivation Letter for TUM',
    description: 'Draft and finalize motivation letter for TUM application',
    category: 'Applications',
    priority: 'High',
    status: 'In Progress',
    dueDate: new Date('2024-05-20'),
    createdAt: new Date('2024-04-10')
  },
  {
    id: '3',
    title: 'Research Accommodation Options',
    description: 'Look for student housing in Munich',
    category: 'Accommodation',
    priority: 'Medium',
    status: 'To Do',
    dueDate: new Date('2024-06-01'),
    createdAt: new Date('2024-04-20')
  }
]

export const mockNotes: Note[] = [
  {
    id: '1',
    title: 'German Language Learning Tips',
    content: 'Focus on B2 level for most universities. Use Duolingo, Babbel, and practice speaking with native speakers. Grammar is crucial for academic writing.',
    tags: ['language', 'german', 'study-tips'],
    category: 'Language',
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  },
  {
    id: '2',
    title: 'Cost of Living in Munich',
    content: 'Average monthly expenses: Rent (400-800€), Food (200-300€), Transport (70€), Miscellaneous (150€). Total: ~1000€/month',
    tags: ['finances', 'munich', 'cost-of-living'],
    category: 'Finance',
    createdAt: new Date('2024-03-25'),
    updatedAt: new Date('2024-04-05')
  },
  {
    id: '3',
    title: 'Visa Interview Preparation',
    content: 'Common questions: Why Germany? Why this university? How will you finance your studies? What are your career plans? Practice answers in both English and German.',
    tags: ['visa', 'interview', 'preparation'],
    category: 'Visa',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-04-10')
  }
] 