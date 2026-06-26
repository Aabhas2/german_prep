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
    visaAmount: '11,208',
    visaCurrency: 'EUR',
    visaType: 'Blocked Account (Sperrkonto)',
    mandatedExams: ['TestDaF', 'DSH', 'IELTS', 'APS'],
    stages: [
      { phase: 'Phase 1', title: 'Research Universities', description: 'Research and shortlist German universities — TU Munich, TU Berlin, KIT, etc.' },
      { phase: 'Phase 1', title: 'Check APS Requirements', description: 'Verify if APS certificate is required for your country of education' },
      { phase: 'Phase 2', title: 'Register for TestDaF / DSH', description: 'Register for German language proficiency test (if required)' },
      { phase: 'Phase 2', title: 'Register for IELTS / TOEFL', description: 'Take English language test if applying to English-taught programs' },
      { phase: 'Phase 3', title: 'Prepare SOP / Motivation Letter', description: 'Write Statement of Purpose for each university application' },
      { phase: 'Phase 3', title: 'Request LOR from Professors', description: 'Obtain 2-3 Letters of Recommendation' },
      { phase: 'Phase 3', title: 'Submit University Applications', description: 'Apply via uni-assist or directly — deadlines vary Jan-Jul' },
      { phase: 'Phase 4', title: 'Open Blocked Account (Sperrkonto)', description: 'Open blocked account with €11,208 as proof of financial resources for visa' },
      { phase: 'Phase 4', title: 'Apply for Student Visa', description: 'Submit German Student Visa application at German embassy/consulate' },
      { phase: 'Phase 5', title: 'Arrange Accommodation', description: 'Apply for student dorm or find private housing in Germany' },
      { phase: 'Phase 5', title: 'Book Flights', description: 'Book flights and plan arrival before semester start' },
      { phase: 'Phase 5', title: 'Register at City Hall (Anmeldung)', description: 'Register your address within 14 days of arrival in Germany' },
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
