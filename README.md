# QuranicFlow - Interactive Arabic Learning Platform

[![Production Ready](https://img.shields.io/badge/Status-Production%20Ready-success)]()
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue)]()
[![React](https://img.shields.io/badge/React-18.x-61dafb)]()
[![Vocabulary](https://img.shields.io/badge/Vocabulary-1049%2B%20Words-green)]()
[![Coverage](https://img.shields.io/badge/Quranic%20Coverage-70%25%2B-brightgreen)]()

> An interactive web application designed to help users learn Quranic Arabic vocabulary through gamified learning sessions, progress tracking, and scholarly authenticity.

## 🌟 Features

### Core Learning System
- **1,049+ Authentic Vocabulary**: Scholarly verified from Lane's Lexicon, Ibn Kathir, and classical Islamic sources
- **6-Phase Progressive Learning**: From Foundation to Mastery with structured vocabulary building
- **Chapter-Specific Learning**: Authentic vocabulary from Al-Fatiha, Al-Ikhlas, Yasin, and other essential chapters
- **Offline AI Personalization**: Local pattern matching for personalized learning without external dependencies

### Gamification & Progress
- **XP & Level System**: Experience points and level progression for engagement
- **Achievement System**: Chapter-specific achievements with automatic unlocking
- **Daily Streaks**: Streak tracking with milestone rewards and notifications
- **Progress Celebrations**: Animated milestone celebrations and phase unlocking

### User Experience
- **Islamic-Inspired Design**: Peaceful, reverent aesthetic with calming teal/emerald colors
- **Mobile-Optimized**: Responsive design prioritizing core learning actions
- **Spaced Repetition**: Intelligent review scheduling based on memory science
- **Real-Time Analytics**: Comprehensive learning pattern analysis and progress tracking

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/quranicflow-arabic-learning.git
cd quranicflow-arabic-learning

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5000`

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express, TypeScript
- **State Management**: TanStack Query (React Query)
- **Database**: PostgreSQL-ready with in-memory development storage
- **Build Tool**: Vite with HMR for fast development

### Project Structure
```
quranicflow-arabic-learning/
├── client/                    # React frontend application
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Main application pages
│   │   └── lib/              # Utilities and configurations
├── server/                   # Express backend API
│   ├── routes.ts             # API endpoint definitions
│   ├── learning-engine.ts    # Offline AI and personalization
│   ├── authentic-vocabulary.ts # Complete vocabulary database
│   └── storage.ts            # Data storage interface
├── shared/                   # Shared types and schemas
└── docs/                     # Comprehensive documentation
```

## 📚 Learning System

### Phase Progression
1. **Foundation (Al-Asas)**: Basic divine vocabulary and prayer language
2. **Pillars (Al-Arkan)**: Worship and guidance terminology
3. **Stories (Al-Qasas)**: Pronouns and narrative elements
4. **Character (Al-Akhlaq)**: Social and moral vocabulary
5. **Wisdom (Al-Hikmah)**: Prophetic names and advanced concepts
6. **Mastery (Al-Itqan)**: Complete theological terminology

### Learning Modes
- **Vocabulary Learning**: Phase-specific progressive vocabulary building
- **Chapter Study**: Authentic words from specific Quranic chapters
- **Spaced Review**: Intelligent review of previously studied words
- **Grammar Patterns**: Sentence structure and grammatical elements
- **Daily Challenges**: Varied daily learning goals with streak tracking

## 📖 Documentation

- **[Project Documentation](PROJECT_DOCUMENTATION.md)**: Complete development overview
- **[Infrastructure Diagrams](INFRASTRUCTURE_DIAGRAM.md)**: System architecture and data flow
- **[Vocabulary Sources](VOCABULARY_SOURCES.md)**: Academic sources and verification
- **[Technical Architecture](TECHNICAL_ARCHITECTURE.md)**: Implementation details
- **[Quranic Coverage Analysis](QURANIC_COMPREHENSION_ANALYSIS.md)**: Research methodology

## 🎯 Academic Foundation

### Scholarly Sources
- **Lane's Arabic-English Lexicon**: Classical Arabic lexicography
- **Tafsir Ibn Kathir**: Authoritative Quranic commentary
- **Lisan al-Arab**: Comprehensive Arabic dictionary
- **Al-Mufradat fi Gharib al-Quran**: Quranic vocabulary reference
- **Hans Wehr Dictionary**: Modern Arabic lexicon

### Translation Accuracy
- Cross-referenced with Sahih International, Pickthall, and Yusuf Ali translations
- 100% bilingual coverage (English/Urdu) from authoritative Islamic sources
- Complete transparency in source documentation for community trust

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run type-check   # TypeScript compilation check
```

### API Endpoints
- `GET /api/words` - Phase-filtered vocabulary with fallback system
- `GET /api/learn/chapter/:id` - Chapter-specific vocabulary
- `GET /api/user/:id/progress` - Learning analytics and progress
- `POST /api/user/:id/answer` - Answer processing and XP rewards

## 🎮 Gamification Features

- **XP System**: 10 XP per correct answer, bonus XP for streaks
- **Level Progression**: Automatic level increases based on accumulated XP
- **Achievement Unlocking**: Chapter completion achievements with visual celebrations
- **Streak Rewards**: Milestone bonuses at 3, 7, 14, 30, 60, and 100 days
- **Progress Visualization**: Beautiful completion indicators and certificates

## 📱 Mobile Experience

- **Touch-Optimized**: Large touch targets for mobile interaction
- **Minimal Scrolling**: Core learning actions prioritized above informational content
- **Safe Area Handling**: Proper display on all mobile devices
- **Islamic Aesthetic**: Peaceful, reverent design appropriate for Quranic study

## 🔄 Production Deployment

### Environment Variables
```bash
DATABASE_URL=          # PostgreSQL connection string
OPENAI_API_KEY=       # Optional: For advanced content generation
NODE_ENV=production   # Production environment setting
```

### Deployment Ready
- Zero TypeScript compilation errors
- Comprehensive error handling with graceful fallbacks
- Production-optimized build configuration
- Mobile-responsive design with Islamic aesthetic

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Islamic scholars and lexicographers whose work forms the foundation of this application
- The global Muslim community working to preserve and teach Quranic Arabic
- Open source contributors who make educational technology accessible

## 📞 Support

For questions about the application, vocabulary sources, or technical implementation:
- Create an issue on GitHub
- Review the comprehensive documentation in the `/docs` folder
- Check the [Issue Tracking](ISSUE_TRACKING_COMPREHENSIVE.md) for known solutions

---

**Built with love for the Muslim community seeking to understand the Noble Quran** 🕌