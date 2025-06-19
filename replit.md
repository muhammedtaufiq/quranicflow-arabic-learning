# QuranicFlow - Arabic Learning Platform

## Overview

QuranicFlow is a gamified web application designed to help users learn Quranic Arabic vocabulary through interactive learning sessions, progress tracking, and achievements. The application uses a modern full-stack architecture with React frontend, Express backend, and PostgreSQL database.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: Radix UI + shadcn/ui component library
- **Styling**: Tailwind CSS with custom design tokens
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM with PostgreSQL
- **Authentication**: Session-based authentication (planned)
- **External APIs**: OpenAI GPT-4o for content generation

### Database Architecture
- **Database**: PostgreSQL 16
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon Database serverless PostgreSQL

## Key Components

### Core Entities
1. **Users**: User profiles with XP, levels, streaks, and progress tracking
2. **Words**: Quranic Arabic vocabulary with transliteration, meanings, and difficulty levels
3. **User Progress**: Individual word mastery tracking with spaced repetition
4. **Achievements**: Gamification system with XP rewards and milestone tracking
5. **Challenges**: Daily and weekly learning challenges
6. **Learning Streaks**: Consecutive day tracking for engagement

### Learning System
- **Spaced Repetition**: Intelligent review scheduling based on mastery level
- **Difficulty Adaptation**: AI-powered content difficulty adjustment
- **Multiple Question Types**: Multiple choice, translation, and fill-in-the-blank
- **Progress Tracking**: Bronze, Silver, Gold mastery levels for each word

### Gamification Features
- **XP System**: Experience points for learning activities
- **Level Progression**: User levels based on accumulated XP
- **Streak Tracking**: Daily learning streak maintenance
- **Achievement System**: Unlockable badges and rewards
- **Leaderboards**: Social comparison and motivation

## Data Flow

1. **User Authentication**: Session-based login/registration flow
2. **Learning Sessions**: 
   - Fetch personalized word sets based on user level and progress
   - Generate questions using OpenAI API
   - Track answers and update progress with spaced repetition algorithm
3. **Progress Updates**: Real-time XP, streak, and mastery level updates
4. **Achievement Unlocking**: Automatic achievement checking and unlocking
5. **Content Generation**: AI-powered word and question generation for dynamic content

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI component primitives
- **openai**: GPT-4o integration for content generation

### Development Tools
- **TypeScript**: Type safety across the stack
- **Vite**: Fast development server and build tool
- **Tailwind CSS**: Utility-first styling framework
- **ESBuild**: Fast JavaScript bundling for production

### Authentication & Sessions
- **connect-pg-simple**: PostgreSQL session store (configured but not fully implemented)
- Session-based authentication system (backend routes prepared)

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20, Web, and PostgreSQL 16 modules
- **Development Server**: Vite dev server with HMR on port 5000
- **Database**: Neon Database serverless PostgreSQL

### Production Deployment
- **Build Process**: 
  1. Vite builds client-side React application
  2. ESBuild bundles server-side Express application
- **Deployment Target**: Replit Autoscale deployment
- **Port Configuration**: External port 80 maps to internal port 5000
- **Static Assets**: Client build output served from `/dist/public`

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **OPENAI_API_KEY**: OpenAI API access for content generation
- **NODE_ENV**: Environment detection for development/production behavior

## User Preferences

Preferred communication style: Simple, everyday language.

## Changelog

Changelog:
- June 19, 2025. Initial setup