# Germany Prep Hub 🇩🇪

A comprehensive, modern web application for managing your study abroad preparation journey to Germany. Built with Next.js, TypeScript, and Tailwind CSS.

![Germany Prep Hub](https://img.shields.io/badge/Next.js-15.1.0-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3+-38B2AC?style=flat-square&logo=tailwind-css)

## 🎯 Purpose

Germany Prep Hub is designed to be your personalized preparation hub that visually and functionally organizes all components of your study abroad journey. It's clean, professional-looking, and fully customizable, allowing you to add, edit, and remove sections or data over time.

## ✨ Features

### 🎯 Core Functionality
- **Universities Management**: Track applications, deadlines, and status for German universities
- **Task & Checklist Manager**: Kanban-style task board with priority management
- **Finance Planner**: Budget tracking with multi-currency support (USD, EUR, INR)
- **Exam Tracker**: Manage standardized tests (IELTS, TestAS, APS)
- **Scholarship Database**: Track opportunities and deadlines
- **Visa & Documents**: Step-by-step visa process tracking
- **Notes System**: Organized note-taking with tags and categories
- **Settings & Customization**: Extensive personalization options

### 🌟 Advanced Features
- **Multi-Currency Support**: Seamless conversion between USD, EUR, and INR with proper formatting
- **Real-time Data Persistence**: All data saved locally with automatic sync
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Error Boundaries**: Graceful error handling and recovery
- **Form Validation**: Comprehensive input validation and error prevention
- **Progress Tracking**: Visual progress bars and completion statistics
- **Quick Actions**: Fast access to common tasks from dashboard

### 🎨 Customization Options
- **Currency Settings**: Primary currency selection with custom exchange rates
- **Dashboard Layout**: Toggle components, adjust refresh intervals
- **Task Management**: Default priorities, sorting options, completion settings
- **Appearance**: Color schemes, font sizes, compact mode, animations
- **Data Management**: Auto-save, backup frequency, export formats

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd germany-prep-hub
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🏗️ Build and Deployment

### Production Build
```bash
npm run build
npm start
```

### Static Export (Optional)
For static hosting platforms:
```bash
npm run build
npm run export
```

### Deployment Platforms

#### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically with zero configuration

#### Netlify
1. Build the project: `npm run build`
2. Deploy the `.next` folder to Netlify

#### Other Platforms
The application can be deployed to any platform that supports Node.js applications.

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── exams/             # Exam management page
│   ├── finance/           # Finance planning page
│   ├── notes/             # Notes management page
│   ├── scholarships/      # Scholarship tracking page
│   ├── settings/          # Settings and preferences
│   ├── tasks/             # Task management page
│   ├── universities/      # University applications page
│   ├── visa/              # Visa process tracking
│   └── page.tsx           # Dashboard (home page)
├── components/            # Reusable UI components
│   ├── forms/             # Form components
│   ├── layout/            # Layout components
│   └── ui/                # Base UI components
├── data/                  # Mock data and constants
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
└── types/                 # TypeScript type definitions
```

## 🛠️ Technology Stack

- **Framework**: Next.js 15.1.0 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Hooks + LocalStorage
- **Data Persistence**: Browser LocalStorage
- **Build Tool**: Next.js built-in bundler

## 🔧 Configuration

### Environment Variables
No environment variables are required for basic functionality. The app uses browser LocalStorage for data persistence.

### Customization
All settings can be configured through the Settings page in the application:
- Personal details
- Currency preferences
- Dashboard layout
- Task management options
- Appearance settings
- Data export/import options

## 📊 Data Management

### Data Storage
- All data is stored locally in the browser's LocalStorage
- No external database required
- Data persists across browser sessions
- Export/import functionality available

### Data Export
- JSON format for complete data backup
- CSV format for spreadsheet compatibility
- Accessible through Settings page

### Data Import
Currently supports manual data entry. Bulk import features can be added as needed.

## 🐛 Troubleshooting

### Common Issues

1. **Settings page not loading**
   - Clear browser cache and localStorage
   - Refresh the page
   - Check browser console for errors

2. **Currency conversion not working**
   - Verify exchange rates in Settings
   - Check internet connection for live rates
   - Reset to default exchange rates if needed

3. **Data not persisting**
   - Ensure LocalStorage is enabled in browser
   - Check available storage space
   - Try incognito mode to test

### Error Recovery
The application includes comprehensive error boundaries that will:
- Display user-friendly error messages
- Provide recovery options
- Maintain data integrity
- Allow graceful fallbacks

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

### Upcoming Features
- [ ] Cloud synchronization
- [ ] Collaborative planning
- [ ] Mobile app (React Native)
- [ ] Advanced analytics
- [ ] Integration with university APIs
- [ ] Automated deadline reminders
- [ ] Document scanning and storage
- [ ] Language learning progress tracking

### Improvements
- [ ] Enhanced data visualization
- [ ] Better mobile experience
- [ ] Offline functionality
- [ ] Performance optimizations
- [ ] Accessibility improvements

## 📞 Support

For support, questions, or feature requests:
- Create an issue on GitHub
- Check the troubleshooting section
- Review the documentation

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- UI components inspired by modern design systems
- Built with the amazing Next.js framework
- Styled with Tailwind CSS utility-first framework

---

**Made with ❤️ for students pursuing their dreams in Germany** 