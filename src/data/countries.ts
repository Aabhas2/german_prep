export interface CountryConfig {
  id: string
  name: string
  currency: 'EUR' | 'CAD' | 'USD' | 'CHF' | 'SEK' | 'INR'
  visaType: 'BlockedAccount' | 'GIC' | 'ProofOfFunds'
  visaAmount: number // Required annual amount
  visaCurrency: string
  visaAppealRights: string
  mandatedExams: string[]
  mandatoryVPD: boolean
  housingAlert: string
  workRights: string
  stages: Array<{
    phase: string
    title: string
    description: string
    timeline: string
  }>
}

export const countriesConfig: Record<string, CountryConfig> = {
  Germany: {
    id: 'germany',
    name: 'Germany',
    currency: 'EUR',
    visaType: 'BlockedAccount',
    visaAmount: 11904,
    visaCurrency: 'EUR',
    visaAppealRights: 'Remonstration abolished (Appeal requires formal court suit in Berlin).',
    mandatedExams: ['APS Certificate', 'IELTS/TOEFL', 'Goethe German (A1/A2/B1/B2)'],
    mandatoryVPD: true,
    housingAlert: 'Critical housing crisis in Munich, Berlin, Hamburg. Start search at least 4-6 months before arrival.',
    workRights: '20 hours/week (up to 140 full days or 280 half days per year).',
    stages: [
      {
        phase: 'Phase 0: Build Foundation (May - Aug 2026)',
        title: 'German Language & Profile Audit',
        description: 'Start Goethe A1/A2 prep. Check Bachelor curriculum credit mapping in Mathematics and Theoretical CS.',
        timeline: 'June - Oct 2026'
      },
      {
        phase: 'Phase 1: Vetting & Exams (Sept - Dec 2026)',
        title: 'IELTS/GRE & APS Certificate',
        description: 'Take IELTS (target 7.5+). Apply for the APS Certificate immediately (4-6 weeks processing).',
        timeline: 'Nov - Dec 2026'
      },
      {
        phase: 'Phase 2: Finalize Documents (Jan - Apr 2027)',
        title: 'LOM, CV & Uni-Assist',
        description: 'Draft technical Statement of Purpose. Finalize university module matching. Submit early to Uni-Assist for VPD.',
        timeline: 'Jan - Mar 2027'
      },
      {
        phase: 'Phase 3: Portals Open (Apr - July 2027)',
        title: 'University Applications',
        description: 'Apply to 6-8 public universities. Mix ambitious and safe choices. Deadline is typically July 15.',
        timeline: 'Apr - July 2027'
      },
      {
        phase: 'Phase 4: Blocked A/C & Visa (July - Sept 2027)',
        title: 'Blocked Account & Consular Services Portal',
        description: 'Open a €11,904 blocked account (Expatrio/Fintiba). Submit digital visa pre-check. Book VFS biometrics.',
        timeline: 'July - Aug 2027'
      },
      {
        phase: 'Phase 5: Arrival & Survival (Oct 2027+)',
        title: 'City Registration & Work Search',
        description: 'Register address (Anmeldung) within 14 days. Find working student (Werkstudent) job, improve German.',
        timeline: 'Oct 2027 onwards'
      }
    ]
  },
  Canada: {
    id: 'canada',
    name: 'Canada',
    currency: 'CAD',
    visaType: 'GIC',
    visaAmount: 20635, // Current GIC requirement for living costs (updated)
    visaCurrency: 'CAD',
    visaAppealRights: 'Judicial Review in Federal Court if Study Permit is rejected.',
    mandatedExams: ['IELTS Academic (6.5 minimum) or PTE Academic'],
    mandatoryVPD: false,
    housingAlert: 'Extremely high rent prices and housing crisis in Toronto, Vancouver. Apply for student residences early.',
    workRights: '20 hours/week off-campus during academic term.',
    stages: [
      {
        phase: 'Phase 0: Research & Prep (May - Aug 2026)',
        title: 'Country Strategic Selection',
        description: 'Evaluate university programs and province-specific PR pathways (PNP). Check DLI status of target schools.',
        timeline: 'June - Oct 2026'
      },
      {
        phase: 'Phase 1: Test Phase (Sept - Dec 2026)',
        title: 'Language Exams (IELTS/PTE)',
        description: 'Clear IELTS Academic or PTE Academic. Aim for SDS eligibility (overall 6.5+, no band below 6.0).',
        timeline: 'Nov - Dec 2026'
      },
      {
        phase: 'Phase 2: College Admission (Jan - Mar 2027)',
        title: 'Submit College Applications',
        description: 'Prepare SOP, transcripts, and letter of references. Apply to designated learning institutions (DLI).',
        timeline: 'Jan - Mar 2027'
      },
      {
        phase: 'Phase 3: Attestation Letters (Apr - June 2027)',
        title: 'PAL Receipt & Fee Payment',
        description: 'Obtain Provincial Attestation Letter (PAL) if required. Pay first-semester/first-year tuition fees.',
        timeline: 'Apr - June 2027'
      },
      {
        phase: 'Phase 4: GIC & Study Permit (June - Aug 2027)',
        title: 'GIC Setup & Study Permit Application',
        description: 'Open a GIC account with a Canadian bank and deposit $20,635 CAD. Apply for Study Permit via SDS/non-SDS streams.',
        timeline: 'June - Aug 2027'
      },
      {
        phase: 'Phase 5: Arrival & Study (Sept 2027+)',
        title: 'Arrive, Study Permit Issuance & Housing',
        description: 'Receive Study Permit at port of entry. Set up SIN (Social Insurance Number) and locate accommodation.',
        timeline: 'Sept 2027 onwards'
      }
    ]
  },
  Netherlands: {
    id: 'netherlands',
    name: 'Netherlands',
    currency: 'EUR',
    visaType: 'ProofOfFunds',
    visaAmount: 14500, // Approximate annual living fee proof
    visaCurrency: 'EUR',
    visaAppealRights: 'Appeal (Bezwaar) can be submitted to IND (Immigration and Naturalisation Service).',
    mandatedExams: ['IELTS (6.5) or TOEFL (90)'],
    mandatoryVPD: false,
    housingAlert: 'Severe, critical housing shortage in Amsterdam, Utrecht, Rotterdam. Many universities advise not to travel if housing is not pre-secured.',
    workRights: 'Up to 16 hours/week (requires a work permit applied for by the employer).',
    stages: [
      {
        phase: 'Phase 0: Shortlisting (June - Oct 2026)',
        title: 'Program Vetting & Prerequisites',
        description: 'Research Research Universities (WO) vs. Universities of Applied Sciences (HBO). Check Studielink requirements.',
        timeline: 'June - Oct 2026'
      },
      {
        phase: 'Phase 1: Registration (Oct 2026 - Jan 2027)',
        title: 'Studielink & Numerus Fixus Deadlines',
        description: 'Create Studielink account. Apply early for Numerus Fixus (limited quota) programs (deadline usually Jan 15).',
        timeline: 'Oct - Jan 2027'
      },
      {
        phase: 'Phase 2: Standard Apps (Jan - Apr 2027)',
        title: 'Submit University Portals',
        description: 'Submit SOP, CV, secondary school grades, and references to university portals (Osiris/etc.).',
        timeline: 'Jan - Apr 2027'
      },
      {
        phase: 'Phase 3: Financial Deposit (May - June 2027)',
        title: 'Pay Living Expenses & Tuition Deposit',
        description: 'Transfer living cost proof (~€14,500) and tuition fee directly to the university trust account for IND visa vetting.',
        timeline: 'May - June 2027'
      },
      {
        phase: 'Phase 4: MVV Entry Visa (June - Aug 2027)',
        title: 'Visa Application Approval',
        description: 'University applies for your MVV/residence permit. Collect entry visa sticker at Dutch Embassy/Consulate.',
        timeline: 'June - Aug 2027'
      },
      {
        phase: 'Phase 5: Arrival & BSN (Sept 2027+)',
        title: 'BSN Registration & Housing Search',
        description: 'Register with local municipality to obtain BSN number. Open a Dutch bank account.',
        timeline: 'Sept 2027 onwards'
      }
    ]
  }
}
