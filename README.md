# UniRoute DE 🇩🇪 — Study Abroad Suite for Germany

A comprehensive, production-grade web application designed for international students planning and managing their higher education journey to Germany. Built with Next.js 16, TypeScript, Tailwind CSS, and Firebase.

![UniRoute DE](https://img.shields.io/badge/UniRoute-DE_v1.0-8B2340?style=for-the-badge)
![Next.js 16](https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=for-the-badge&logo=typescript)
![Firebase](https://img.shields.io/badge/Firebase-Auth_%26_Firestore-FFCA28?style=for-the-badge&logo=firebase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)

---

## 🎯 Purpose

**UniRoute DE** is an all-in-one preparation and application management workspace tailored specifically for students applying to German universities (TUM, RWTH Aachen, Stuttgart, LMU, etc.). It organizes every phase of your journey—from APS certification and university selection to Blocked Account (Sperrkonto) budget tracking, visa appointments, and WG student housing.

---

## ✨ Core Features & Modules

### 🎓 1. University Application Tracker
- Track applications across German universities (`Interested`, `Applied`, `Accepted`, `Rejected`).
- Monitor deadlines, course names, instruction language, and campus locations.
- Track document checklists per application (SOPs, LORs, Academic Transcripts).

### 💳 2. Sperrkonto (Blocked Account) & Finance Planner
- **Visa Sperrkonto Requirement Tracker**: Official €11,904 / €992/month requirement pre-calculated.
- **Multi-Currency Support**: Real-time conversions between **EUR (€)**, **INR (₹)**, and **USD ($)**.
- **Live Exchange Rate API**: Auto-updates exchange rates with stale-cache self-healing guards.
- Expense breakdown by category (Application fees, Semester fee, Travel, Rent deposit).
- Custom Savings Goals tracker for your Study Abroad fund.

### 📝 3. Exam & APS Certification Tracker
- Manage standardized exams required for German admissions (**IELTS Academic**, **TestAS**, **APS Certificate**, **dMAT**).
- Track registration links, fees, exam dates, scores, and preparation resources.

### 📜 4. Visa & Document Workflow
- Step-by-step German Student Visa milestone tracker.
- Document checklists for embassy appointments, health insurance (TK / Barmer), and blocked account proof.

### 🏡 5. WG & Housing Manager
- Track student dormitories (Studentenwerk) and private WG (WG-Gesucht) viewing appointments and rent costs.

### 🎓 6. DAAD & Deutschlandstipendium Database
- Searchable directory of German scholarship opportunities with eligibility criteria and deadlines.

### 🔒 7. Cloud Sync & Local Guest Mode
- **Instant Guest Mode**: Fully operational directly in the browser using `localStorage` without registration.
- **Firebase Cloud Auth & Firestore**: Optional sign-in via Google or Email to sync data across all your devices seamlessly.
- **Clean New-User Initialization**: Signed-in accounts start with a pristine 100% empty workspace.

### ⚙️ 8. Customization & Data Management
- **Appearance & Color Schemes**: Dark/Light mode theme system with multiple curated color palettes.
- **GitHub-style Reset Modal**: Destructive typed confirmation reset (`type RESET`) for total privacy control.
- Data export options (JSON / CSV).

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18.0 or later
- npm or yarn

### Installation & Local Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/Aabhas2/uniroute-de.git
   cd uniroute-de
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🏗️ Technology Stack

- **Framework**: Next.js 16 (App Router + Turbopack)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom HSL Design Tokens
- **Icons**: Lucide React
- **Backend / Auth**: Firebase (Authentication + Cloud Firestore)
- **State Management**: React Hooks + LocalStorage + Event Bus Sync
- **Deployment**: Vercel

---

## 🛠️ Environment Variables (Optional for Cloud Sync)

Create a `.env.local` file in the root directory if you wish to connect your own Firebase project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🚢 Deployment on Vercel

This repository is optimized for one-click deployment on Vercel:

1. Push code to your GitHub repository.
2. Import the project into your **Vercel Dashboard**.
3. Deploy! Next.js 16 will automatically build all 17 static pages.

---

## 📝 License

This project is open-source under the [MIT License](LICENSE).

---

**Made with ❤️ for international students pursuing their studies in Germany 🇩🇪**
 