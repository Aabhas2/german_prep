'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  GraduationCap, ShieldCheck, DollarSign,
  Home, BookOpen, CheckCircle, ArrowRight, Zap, Cloud,
  Sparkles, UserCheck, Award, ChevronDown, Check, Building2,
  TrendingUp, Clock, FileText, Lock
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'

export default function LandingPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20">
      
      {/* ── Top Navigation Bar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/85 border-b border-border/60 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group pl-1" onClick={() => router.push('/')}>
            <Image 
              src="/uni_transparentbg.png" 
              alt="UniRoute DE" 
              width={500} 
              height={170} 
              className="h-20 sm:h-22 w-auto object-contain shrink-0 scale-[1.85] origin-left group-hover:scale-[1.9] transition-transform duration-200 dark:drop-shadow-[0_1px_1px_rgba(255,255,255,0.35)] ml-1" 
              priority
            />
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={() => router.push('/dashboard')} variant="primary" className="shadow-lg shadow-primary/25 font-semibold">
                Go to Dashboard <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button onClick={() => router.push('/login')} variant="ghost" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                  Cloud Sign In
                </Button>
                <Button onClick={() => router.push('/dashboard')} variant="primary" className="shadow-lg shadow-primary/25 font-semibold">
                  Launch Workspace <ArrowRight className="ml-1.5 h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24">
        {/* Glowing Background Radial Accents */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[450px] bg-gradient-to-tr from-primary/15 via-accent/15 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-7">
          
          {/* Minimal Status Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/25 text-accent text-xs font-semibold tracking-wide uppercase shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>German Study Abroad Suite 2026 • 100% Free</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-foreground leading-[1.12]">
            Master Your German <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-danger">
              Study Abroad Journey
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl mx-auto text-base sm:text-xl text-muted-foreground leading-relaxed font-normal">
            The complete management suite for international students heading to Germany. Track <strong className="text-foreground font-semibold">Universities</strong>, <strong className="text-foreground font-semibold">SOPs</strong>, <strong className="text-foreground font-semibold">Sperrkonto (Blocked Account)</strong>, <strong className="text-foreground font-semibold">APS & dMAT</strong>, <strong className="text-foreground font-semibold">WG Housing</strong> & <strong className="text-foreground font-semibold">DAAD Scholarships</strong> directly in your browser.
          </p>

          {/* CTA Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-xl shadow-primary/25 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] hover:bg-right text-white font-bold transition-all duration-300 hover:scale-[1.02]"
            >
              <Zap className="mr-2 h-5 w-5 fill-current" />
              Launch Free Workspace (No Sign-up Needed)
            </Button>

            <Button
              onClick={() => router.push('/login')}
              variant="outline"
              size="lg"
              className="w-full sm:w-auto text-base px-6 py-6 rounded-xl border-border/80 hover:bg-muted/50 font-semibold"
            >
              <Cloud className="mr-2 h-5 w-5 text-primary" />
              Sign In for Cloud Sync
            </Button>
          </div>

          {/* Trust Highlights */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-muted-foreground border-t border-border/40 max-w-2xl mx-auto pt-6">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-success" /> Works 100% Offline in Browser
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-success" /> 0 Credit Card or Mandatory Sign-up
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-success" /> Your Data Stays Completely Private
            </span>
          </div>

        </div>

        {/* ── Interactive Workspace Live Mockup Showcase ─────────────────────── */}
        <div className="max-w-5xl mx-auto px-4 mt-12 sm:mt-16">
          <div className="relative rounded-2xl border border-border/80 bg-card/90 shadow-2xl p-4 sm:p-6 backdrop-blur-md overflow-hidden group hover:border-primary/40 transition-colors">
            {/* Header Mock bar */}
            <div className="flex items-center justify-between pb-4 border-b border-border/60 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-danger/80" />
                <div className="w-3 h-3 rounded-full bg-warning/80" />
                <div className="w-3 h-3 rounded-full bg-success/80" />
                <span className="text-xs font-semibold text-muted-foreground ml-2">UniRoute DE Live Workspace</span>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-success/15 text-success font-medium flex items-center gap-1">
                <Check className="h-3 w-3" /> Ready for Winter Semester 2026
              </span>
            </div>

            {/* Mock Dashboard Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Universities Applied</span>
                  <Building2 className="h-4 w-4 text-info" />
                </div>
                <p className="text-2xl font-extrabold text-foreground">4 / 6</p>
                <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                  <div className="bg-info h-full w-2/3 rounded-full" />
                </div>
                <p className="text-[11px] text-muted-foreground">TUM, RWTH Aachen, Stuttgart</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Sperrkonto (Blocked Acc)</span>
                  <DollarSign className="h-4 w-4 text-accent" />
                </div>
                <p className="text-2xl font-extrabold text-foreground">€11,904 <span className="text-xs font-normal text-muted-foreground">/ year</span></p>
                <p className="text-[11px] text-accent font-semibold">₹13,08,012 INR • Updated Live</p>
              </div>

              <div className="p-4 rounded-xl bg-muted/40 border border-border/50 space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>APS & Visa Readiness</span>
                  <ShieldCheck className="h-4 w-4 text-success" />
                </div>
                <p className="text-2xl font-extrabold text-success">Verified</p>
                <p className="text-[11px] text-muted-foreground">APS Certificate & Courier Done</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Showcase Grid ───────────────────────────────────────── */}
      <section className="py-20 bg-muted/30 border-y border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-accent">Built for German Admissions</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Everything You Need for German Higher Education
            </h2>
            <p className="text-muted-foreground text-base">
              Tailored around Uni-Assist processes, German embassy visa requirements, and university deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: GraduationCap,
                color: 'text-info',
                bg: 'bg-info/10',
                badge: 'Uni-Assist Compatible',
                title: 'University & SOP Tracker',
                desc: 'Organize applications across German universities, track Uni-Assist status, SOP revisions (Draft to Final), LOR requests, and transcripts.'
              },
              {
                icon: DollarSign,
                color: 'text-accent',
                bg: 'bg-accent/10',
                badge: '2026 Visa Standard',
                title: 'Sperrkonto & Finance Calculator',
                desc: 'Pre-calculated €11,904/year Blocked Account requirement. Live multi-currency conversion between EUR (€), INR (₹), and USD ($).'
              },
              {
                icon: ShieldCheck,
                color: 'text-primary',
                bg: 'bg-primary/10',
                badge: 'APS Certificate',
                title: 'APS & dMAT Milestones',
                desc: 'Track APS India verification steps, document courier submission, verification progress, and dMAT entrance test preparations.'
              },
              {
                icon: Home,
                color: 'text-warning',
                bg: 'bg-warning/10',
                badge: 'WG-Gesucht & Dorms',
                title: 'German Housing & WG Manager',
                desc: 'Manage applications for Studentenwerk dormitories, private WG rooms, and viewing interviews across Munich, Berlin, Aachen, etc.'
              },
              {
                icon: BookOpen,
                color: 'text-success',
                bg: 'bg-success/10',
                badge: 'Goethe / TestDaF',
                title: 'Language Proficiency Grid',
                desc: 'Track your CEFR German level progress (A1 to C1) for Goethe-Zertifikat or TestDaF, plus English IELTS/TOEFL score requirements.'
              },
              {
                icon: Award,
                color: 'text-purple-500',
                bg: 'bg-purple-500/10',
                badge: 'DAAD Directory',
                title: 'Scholarship Database',
                desc: 'Explore DAAD, Deutschlandstipendium, and Heinrich Böll scholarships with deadlines and save them directly to your personal tracker.'
              }
            ].map(({ icon: Icon, color, bg, badge, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className={`h-6 w-6 ${color}`} />
                    </div>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-muted text-muted-foreground border border-border/60">
                      {badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ Section (Smooth Accordion Animation) ──────────────────────── */}
      <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">Got Questions?</span>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground text-sm">Clear answers for international applicants</p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'Do I need to sign up to use UniRoute DE?',
              a: 'No! You can use 100% of all features instantly without an account. All your data is saved safely in your browser storage. Signing up with Google or Email is completely optional and only needed if you want cloud sync across multiple devices.'
            },
            {
              q: 'What is the required Blocked Account (Sperrkonto) amount for Germany in 2026?',
              a: 'The current official German student visa standard is €11,904 per year (€992 per month). The Finance tab in UniRoute DE calculates this requirement live in EUR, INR, and USD.'
            },
            {
              q: 'What is the APS Certificate requirement?',
              a: 'Students applying from India require an APS Certificate (Academic Evaluation Centre) to authenticate their educational documents before applying for a German student visa. Our Visa & APS module tracks every document step.'
            },
            {
              q: 'Is UniRoute DE completely free to use?',
              a: 'Yes, UniRoute DE is 100% free with no subscription fees, premium paywalls, or hidden charges.'
            }
          ].map(({ q, a }, index) => {
            const isOpen = openFaq === index
            return (
              <div 
                key={q} 
                className="rounded-xl border border-border bg-card overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                >
                  <span className="text-base sm:text-lg">{q}</span>
                  <div className={`w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-primary/10 text-primary' : 'text-muted-foreground'}`}>
                    <ChevronDown className="h-5 w-5" />
                  </div>
                </button>
                <div 
                  className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden">
                    <div className="px-5 pb-5 text-sm sm:text-base text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {a}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── Bottom Call to Action ────────────────────────────────────────── */}
      <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/15 to-primary/10 border-t border-border/60">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Ready to Begin Your German Study Journey?
          </h2>
          <p className="text-muted-foreground text-base max-w-xl mx-auto">
            Start organizing your deadlines, universities, and documents right now. Free forever, no mandatory sign-up.
          </p>
          <div className="pt-2 flex justify-center">
            <Button
              onClick={() => router.push('/dashboard')}
              size="lg"
              className="text-base px-9 py-6 rounded-xl bg-gradient-to-r from-primary to-accent hover:opacity-95 text-white font-bold shadow-xl shadow-primary/25 hover:scale-[1.02] transition-all"
            >
              Open Workspace Now <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────── */}
      <footer className="mt-auto py-8 border-t border-border/60 bg-background text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} UniRoute DE. Built for international students pursuing higher education in Germany. 🇩🇪</p>
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