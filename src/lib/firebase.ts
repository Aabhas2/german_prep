import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Helper to strip hidden whitespace and newlines from env variables
const cleanEnv = (val?: string) => (val ? val.trim().replace(/[\r\n\t]/g, '') : '')

// Use environment variables for client-side Firebase config with sanitized values
const firebaseConfig = {
  apiKey: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_API_KEY) || 'dummy-api-key',
  authDomain: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN) || 'study-abroad-hub.firebaseapp.com',
  projectId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) || 'study-abroad-hub',
  storageBucket: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET) || 'study-abroad-hub.firebasestorage.app',
  messagingSenderId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID) || '1234567890',
  appId: cleanEnv(process.env.NEXT_PUBLIC_FIREBASE_APP_ID) || '1:1234567890:web:1234567890'
}

// Initialize Firebase (safeguard for server-side rendering)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
const auth = getAuth(app)
const db = getFirestore(app)

export { app, auth, db }
