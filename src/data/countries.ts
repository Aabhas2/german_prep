// Country-specific preparation data used across the app

export interface CountryConfig {
  flag: string
  visaAmount: string
  visaCurrency: string
  visaType: string
  mandatedExams: string[]
  stages: { phase: string; title: string; description: string }[]
}

export const countriesConfig: Record<string, CountryConfig> = {
  Germany: {
    flag: '🇩🇪',
    visaAmount: '11,904',
    visaCurrency: 'EUR',
    visaType: 'Blocked Account (Sperrkonto) — €992/month allowance',
    mandatedExams: ['TestDaF', 'DSH', 'IELTS', 'APS Certificate', 'dMAT (Engineering/Business Master\'s, Summer 2027+)'],
    stages: [
      { phase: 'Phase 1', title: 'Research Universities', description: 'Research and shortlist German universities — TU Munich, TU Berlin, KIT, Heidelberg, etc.' },
      { phase: 'Phase 1', title: 'APS Certificate — Start Early!', description: 'Mandatory for Indian students. Verifies your Class 10, 12 and degree. Takes 4-8 weeks. Start at least 4-6 months before your application deadline. Register at aps-india.de' },
      { phase: 'Phase 1', title: 'dMAT Test (If Applicable)', description: 'Required from Summer 2027+ for Engineering, Commerce, Business Master\'s applicants (Indian degrees). Administered by g.a.s.t. (same as TestDaF). Fee: €150. Register at g.a.s.t portal. Exempt if APS registered before 29 June 2026.' },
      { phase: 'Phase 2', title: 'Register for TestDaF / DSH', description: 'German language proficiency test — required for German-taught programs. TestDaF is available internationally; DSH is taken at the university.' },
      { phase: 'Phase 2', title: 'Register for IELTS / TOEFL', description: 'English proficiency test for English-taught programs. Most Master\'s programs require IELTS 6.5+ or TOEFL 90+.' },
      { phase: 'Phase 3', title: 'Prepare Motivation Letter (SOP)', description: 'Write a Statement of Purpose / Motivation Letter for each university. Typically 500-1000 words. Tailor it per program.' },
      { phase: 'Phase 3', title: 'Request Letters of Recommendation', description: 'Obtain 2-3 LORs from professors or employers. Give referees at least 4-6 weeks notice.' },
      { phase: 'Phase 3', title: 'Submit University Applications', description: 'Apply via uni-assist (deadline: 15 July for Winter, 15 January for Summer) or directly. Submit 8 weeks before deadline to allow document corrections.' },
      { phase: 'Phase 4', title: 'Open Blocked Account (Sperrkonto)', description: 'Deposit €11,904 (official requirement) in a German blocked account via Fintiba, Expatrio, or Coracle. You receive €992/month once activated in Germany. Obtain the confirmation letter for your visa.' },
      { phase: 'Phase 4', title: 'Apply for Student Visa (Type D)', description: 'Book appointment at German embassy/VFS Global 3-4 months before departure. Bring: APS cert, admission letter, blocked account confirmation, health insurance, passport photos.' },
      { phase: 'Phase 5', title: 'Arrange Accommodation', description: 'Apply for student Wohnheim (dorm) via Studierendenwerk. Also check WG-Gesucht and DAAD housing exchange. Housing in major cities (esp. Munich) is very competitive — apply early.' },
      { phase: 'Phase 5', title: 'Get Student Health Insurance', description: 'Mandatory. TK (Techniker Krankenkasse) student rate is ~€146/month (under 30). Sign up before you enroll at university.' },
      { phase: 'Phase 5', title: 'Book Flights & Plan Arrival', description: 'Arrive a few days before semester orientation. Semester typically starts October (Winter) or April (Summer).' },
      { phase: 'Phase 5', title: 'Anmeldung — Register at City Hall', description: 'Mandatory within 14 days of moving in. Bring passport, rental contract, and Wohnungsgeberbestätigung (landlord form). You cannot open a bank account or get your residence permit without the Meldebescheinigung.' },
    ],
  },
  Canada: {
    flag: '🇨🇦',
    visaAmount: '10,000',
    visaCurrency: 'CAD',
    visaType: 'GIC (Guaranteed Investment Certificate)',
    mandatedExams: ['IELTS', 'TOEFL', 'GRE', 'GMAT'],
    stages: [
      { phase: 'Phase 1', title: 'Research Universities', description: 'Research Canadian universities — UofT, UBC, McGill, Waterloo, etc.' },
      { phase: 'Phase 2', title: 'Take IELTS / TOEFL', description: 'English language proficiency test for Canadian universities' },
      { phase: 'Phase 2', title: 'Take GRE / GMAT', description: 'Standardized test if required by your program' },
      { phase: 'Phase 3', title: 'Prepare Application Documents', description: 'SOP, LOR, transcripts, CV for university applications' },
      { phase: 'Phase 3', title: 'Submit University Applications', description: 'Apply by Jan-Feb deadlines for Sept intake' },
      { phase: 'Phase 4', title: 'Apply for Study Permit', description: 'Submit Canadian Study Permit application after receiving acceptance' },
      { phase: 'Phase 5', title: 'Arrange Accommodation', description: 'Find on-campus or off-campus housing' },
    ],
  },
  Netherlands: {
    flag: '🇳🇱',
    visaAmount: '9,600',
    visaCurrency: 'EUR',
    visaType: 'Bank Guarantee',
    mandatedExams: ['IELTS', 'TOEFL'],
    stages: [
      { phase: 'Phase 1', title: 'Research Universities', description: 'Research Dutch universities — TU Delft, Wageningen, Utrecht, etc.' },
      { phase: 'Phase 2', title: 'Take IELTS / TOEFL', description: 'Most Dutch programs are in English — language test required' },
      { phase: 'Phase 3', title: 'Submit Studielink Applications', description: 'Apply via Studielink portal — most deadlines are April 1' },
      { phase: 'Phase 4', title: 'Apply for MVV / Residence Permit', description: 'Apply for Dutch MVV visa or residence permit' },
      { phase: 'Phase 5', title: 'Arrange Housing', description: 'Dutch housing is competitive — apply early via university portals' },
    ],
  },
  Switzerland: {
    flag: '🇨🇭',
    visaAmount: '21,000',
    visaCurrency: 'CHF',
    visaType: 'Bank Statement',
    mandatedExams: ['IELTS', 'TOEFL', 'TestDaF'],
    stages: [
      { phase: 'Phase 1', title: 'Research Swiss Universities', description: 'ETH Zurich, EPFL, University of Zurich, etc.' },
      { phase: 'Phase 2', title: 'Language Tests', description: 'English, German, French depending on program and university' },
      { phase: 'Phase 3', title: 'Submit Applications', description: 'Apply directly to universities — deadlines Jan-Feb' },
      { phase: 'Phase 4', title: 'Apply for Swiss Student Visa', description: 'Type D national visa for stays over 90 days' },
    ],
  },
  Austria: {
    flag: '🇦🇹',
    visaAmount: '11,000',
    visaCurrency: 'EUR',
    visaType: 'Bank Statement / Scholarship Letter',
    mandatedExams: ['TestDaF', 'DSH', 'ÖSD', 'IELTS'],
    stages: [
      { phase: 'Phase 1', title: 'Research Austrian Universities', description: 'TU Vienna, University of Vienna, Graz, etc.' },
      { phase: 'Phase 2', title: 'German Language Test', description: 'Most Austrian universities require German (TestDaF, DSH, or ÖSD)' },
      { phase: 'Phase 3', title: 'Apply via uni-assist or directly', description: 'Application portals vary by university — typical deadline June' },
      { phase: 'Phase 4', title: 'Apply for Austrian Student Visa', description: 'Apply at Austrian embassy with acceptance letter and financials' },
    ],
  },
}
