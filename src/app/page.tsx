'use client'

import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, ShieldCheck, DollarSign,
  Home, BookOpen, CheckCircle, ArrowRight, Zap, Cloud,
  Globe, Sparkles, UserCheck, Award
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      
      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/80 border-b border-border/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer group" onClick={() => router.push('/')}>
            <Image 
              src="/uni_transparentbg.png" 
              alt="UniRoute DE" 
              width={400} 
              height={140} 
              className="h-20 sm:h-24 w-auto object-contain shrink-0 -my-3 group-hover:scale-[1.05] transition-transform duration-200" 
              priority
            />
            <span className="text-[11px] font-semibold text-muted-foreground hidden sm:block border-l border-border pl-3 ml-1">
              Study Abroad Suite 🇩🇪
            </span>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => router.push('/dashboard')} variant="primary" className="shadow-md shadow-primary/20">
                Go to Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button onClick={() => router.push('/login')} variant="ghost" className="text-sm font-medium">
                  Cloud Sign In
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="primary" className="shadow-md shadow-primary/20">
                  Launch App (No Signup) <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold tracking-wide uppercase shadow-sm">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Updated for Academic Admissions · APS & dMAT Ready</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Master Your German Study Abroad Journey <br className="hidden sm:inline" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              100% Free & No Sign-up Required
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
            The all-in-one suite for international students heading to Germany. Track your **Universities, SOPs, LORs, Sperrkonto (Blocked Account), APS & dMAT milestones, WG Housing & DAAD Scholarships** directly in your browser.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg shadow-primary/25 bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-semibold transition-all hover:scale-[1.02]"
            >
              <Zap className="mr-2 h-5 w-5 fill-current" />
              Launch Workspace (No Account Needed)
            </Button>

            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-6 py-6 rounded-xl border-border hover:bg-muted/50 font-medium"
            >
              <Cloud className="mr-2 h-5 w-5 text-primary" />
              Sign In to Sync Across Devices
            </Button>
          </div>

          {/* Trust points */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-success" /> Works 100% Offline
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-success" /> No Credit Card or Account Mandatory
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> Your Data Stays Private in Browser
            </span>
          </div>

        </div>
      </section>

      {/* ── Feature Showcase Grid ───────────────────────────────────────── */}
      <section className="py-16 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Everything You Need for German Higher Education
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base">
              Built specifically around German admission regulations, uni-assist workflows, and consulate visa requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                color: 'text-info',
                bg: 'bg-info/10',
                title: 'University & SOP Tracker',
                desc: 'Track Uni-Assist applications, deadlines, SOP progress (Draft to Final), Transcript attestations & LOR requests.'
              },
              {
                icon: DollarSign,
                color: 'text-accent',
                bg: 'bg-accent/10',
                title: 'Sperrkonto & Finance Calculator',
                desc: 'Calculate your Blocked Account requirement (€11,904/year), monthly living budget, and multi-currency conversions (EUR/INR/USD).'
              },
              {
                icon: ShieldCheck,
                color: 'text-primary',
                bg: 'bg-primary/10',
                title: 'APS & dMAT Certificate Milestone',
                desc: 'Track APS India verification steps, document courier submission, and dMAT entrance test preparations.'
              },
              {
                icon: Home,
                color: 'text-warning',
                bg: 'bg-warning/10',
                title: 'German Housing & WG Manager',
                desc: 'Organize applications for WG-Gesucht, Studentenwerk dormitories, and private apartments across Munich, Berlin, etc.'
              },
              {
                icon: BookOpen,
                color: 'text-success',
                bg: 'bg-success/10',
                title: 'Language Proficiency Grid',
                desc: 'Monitor your CEFR German level progress (A1 to C1) for Goethe-Zertifikat/TestDaF and English IELTS/TOEFL scores.'
              },
              {
                icon: Award,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
                title: 'DAAD Scholarship Database',
                desc: 'Explore pre-populated verified scholarships (DAAD, Deutschlandstipendium, Heinrich Böll) and save them directly to your tracker.'
              }
            ].map(({ icon: Icon, color, bg, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 ${color}`} />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ & German Facts ───────────────────────────────────────────── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">Clear answers for international applicants</p>
        </div>

        <div className="space-y-4">
          {[
            {
              q: 'Do I really need to sign up to use UniRoute DE?',
              a: 'No! You can use 100% of the features instantly without an account. All your data is saved safely in your local browser storage. Signing up with email is completely optional and only needed if you want cloud sync across your phone and laptop.'
            },
            {
              q: 'What is the required Blocked Account (Sperrkonto) amount for Germany?',
              a: 'The current official German visa standard for international students is €11,904 for 1 year (€992 per month). Our Finance tab includes a real-time Sperrkonto tracker and currency converter.'
            },
            {
              q: 'What are the APS and dMAT requirements?',
              a: 'Students applying from countries like India require an APS Certificate (Academic Evaluation Centre) to verify their academic degree authenticity before applying for a German visa. The dMAT exam may be required by specific tech programs.'
            }
          ].map(({ q, a }) => (
            <div key={q} className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-base font-semibold text-foreground mb-1.5 flex items-center gap-2">
                <Globe className="h-4 w-4 text-primary shrink-0" />
                {q}
              </h3>
              <p className="text-sm text-muted-foreground pl-6 leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ──────────────────────────────────────────────────── */}
      <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            Ready to Begin Your German Study Journey?
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            Start organizing your deadlines, universities, and documents right now. Free forever, no sign up required.
          </p>
          <div className="pt-2">
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="text-base px-8 py-6 rounded-xl bg-primary text-primary-foreground font-semibold shadow-lg shadow-primary/20 hover:opacity-95"
            >
              Open Workspace Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 border-t border-border/60 bg-background text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} UniRoute DE. Made for international students worldwide. 🇩🇪</p>
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</Link>
            <Link href="/universities" className="hover:text-foreground transition-colors">Universities</Link>
            <Link href="/visa" className="hover:text-foreground transition-colors">Visa & APS</Link>
            <Link href="/login" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}