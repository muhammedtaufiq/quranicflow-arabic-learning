# QuranicFlow Application Infrastructure

## Complete System Architecture

This document provides a comprehensive view of the QuranicFlow application infrastructure, showing how all components connect and interact.

## Main Infrastructure Diagram

```mermaid
graph TB
    subgraph "Client Layer (React + TypeScript)"
        A[Dashboard Component] --> B[Phase Manager]
        A --> C[Learning Session]
        A --> D[Chapter Selection]
        A --> E[Progress Display]
        A --> F[Achievement System]
        
        B --> G[Phase Selector UI]
        C --> H[Question Generator]
        C --> I[Answer Validator]
        D --> J[Chapter Interface]
        E --> K[Analytics Dashboard]
        F --> L[Celebration Animations]
    end
    
    subgraph "API Gateway (Express.js)"
        M["/api/words"] --> N[Phase Filter Logic]
        O["/api/learn/chapter/:id"] --> P[Chapter Vocabulary Service]
        Q["/api/user/:id/current-phase"] --> R[Phase State Manager]
        S["/api/user/:id/progress"] --> T[Learning Analytics Service]
        U["/api/achievements"] --> V[Achievement Engine]
        W["/api/user/:id/select-phase"] --> X[Phase Switcher]
        
        N --> Y[Vocabulary Router]
        P --> Y
        R --> Z[User State Controller]
        T --> AA[Progress Calculator]
        V --> BB[Achievement Processor]
        X --> Z
    end
    
    subgraph "Learning Intelligence (Offline AI)"
        CC[Pattern Matcher] --> DD[Mistake Categorizer]
        CC --> EE[Difficulty Predictor]
        CC --> FF[Review Scheduler]
        
        DD --> GG[Learning Analytics Engine]
        EE --> HH[Adaptive Content Engine]
        FF --> II[Spaced Repetition Engine]
    end
    
    subgraph "Data Storage Layer"
        JJ[(Vocabulary Database<br/>1,049+ Words)]
        KK[(User Progress<br/>Word Mastery)]
        LL[(Chapter Completions<br/>Certificates)]
        MM[(Achievements<br/>Milestone Tracking)]
        NN[(Learning Patterns<br/>AI Analytics)]
        OO[(Phase State<br/>User Context)]
    end
    
    subgraph "Authentication & Session Management"
        PP[Session Controller]
        QQ[User Context Manager]
        RR[Phase Synchronization]
    end
    
    %% Frontend to API connections
    G --> Q
    G --> W
    H --> M
    J --> O
    K --> S
    L --> U
    
    %% API to Storage connections
    Y --> JJ
    Z --> OO
    AA --> KK
    AA --> LL
    BB --> MM
    
    %% Learning Engine connections
    I --> CC
    GG --> NN
    HH --> Y
    II --> S
    
    %% Authentication connections
    QQ --> PP
    RR --> Q
    
    %% Styling
    classDef frontend fill:#e1f5fe,stroke:#01579b
    classDef api fill:#f3e5f5,stroke:#4a148c
    classDef engine fill:#e8f5e8,stroke:#1b5e20
    classDef storage fill:#fff3e0,stroke:#e65100
    classDef auth fill:#fce4ec,stroke:#880e4f
    
    class A,B,C,D,E,F,G,H,I,J,K,L frontend
    class M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,AA,BB api
    class CC,DD,EE,FF,GG,HH,II engine
    class JJ,KK,LL,MM,NN,OO storage
    class PP,QQ,RR auth
```

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant API
    participant LearningEngine
    participant VocabDB
    participant ProgressDB
    participant AchievementSystem
    
    Note over User,AchievementSystem: Complete Learning Session Flow
    
    User->>Frontend: Navigate to Dashboard
    Frontend->>API: GET /api/user/1/current-phase
    API->>ProgressDB: Fetch User Phase State
    ProgressDB-->>API: Current Phase: 2 (Pillars)
    API-->>Frontend: Phase Data
    
    User->>Frontend: Select "Vocabulary Learning"
    Frontend->>API: GET /api/words?phase=2&mode=learning&limit=12
    API->>LearningEngine: Apply Phase Filter
    LearningEngine->>VocabDB: Query Phase 2 Vocabulary
    VocabDB-->>LearningEngine: Worship-related Words
    LearningEngine->>ProgressDB: Check User Patterns
    ProgressDB-->>LearningEngine: Learning History
    LearningEngine-->>API: Personalized Word Set
    API-->>Frontend: 12 Filtered Vocabulary Words
    
    Frontend->>User: Display Learning Session
    Note over User,Frontend: User answers questions
    
    User->>Frontend: Submit Answer: "الصَّلَاةَ = Prayer"
    Frontend->>API: POST /api/user/1/answer
    API->>LearningEngine: Process Answer
    LearningEngine->>ProgressDB: Update Word Mastery
    LearningEngine->>AchievementSystem: Check Milestones
    
    alt Achievement Unlocked
        AchievementSystem->>ProgressDB: Create Achievement Record
        AchievementSystem-->>API: Achievement Data
        API-->>Frontend: XP Reward + Achievement
        Frontend->>User: Celebration Animation
    else Normal Progress
        ProgressDB-->>API: Updated Progress
        API-->>Frontend: XP Reward
        Frontend->>User: Progress Update
    end
```

## Component Integration Map

### Frontend Components → Backend Services

| Frontend Component | API Endpoint | Data Source | Purpose |
|-------------------|--------------|-------------|---------|
| **Dashboard** | `/api/user/1` | User Storage | Profile, XP, Level |
| **Dashboard** | `/api/content-stats` | Vocabulary DB | Word counts, coverage |
| **Phase Manager** | `/api/user/1/current-phase` | Phase State | Current learning phase |
| **Phase Manager** | `/api/user/1/select-phase` | Phase State | Phase switching |
| **Learning Session** | `/api/words?phase=X` | Vocabulary DB + Learning Engine | Phase-filtered vocabulary |
| **Chapter Learning** | `/api/learn/chapter/:id` | Vocabulary DB | Chapter-specific words |
| **Progress Tracking** | `/api/user/1/chapter-progress` | Progress DB | Chapter completion status |
| **Achievement Display** | `/api/user/1/achievements` | Achievement DB | Unlocked achievements |
| **Grammar Mode** | `/api/words?mode=grammar` | Vocabulary DB + Learning Engine | Structural vocabulary |
| **Spaced Review** | `/api/user/1/review` | Progress DB + Learning Engine | Due review words |

### Learning Engine Connections

| Engine Component | Input Source | Output Target | Function |
|-----------------|--------------|---------------|----------|
| **Pattern Matcher** | User Answer Data | Learning Analytics | Identifies learning patterns |
| **Mistake Categorizer** | Answer Validation | Progress Database | Categorizes error types |
| **Difficulty Predictor** | User Performance | Vocabulary Router | Predicts word difficulty |
| **Review Scheduler** | Mastery Levels | Spaced Review API | Calculates optimal review timing |
| **Adaptive Content** | Learning Patterns | Word Selection | Personalizes vocabulary delivery |

### Data Storage Relationships

```mermaid
erDiagram
    USERS ||--o{ USER_PROGRESS : tracks
    USERS ||--o{ ACHIEVEMENTS : unlocks
    USERS ||--o{ CHAPTER_COMPLETIONS : completes
    USERS ||--o{ LEARNING_PATTERNS : generates
    
    VOCABULARY ||--o{ USER_PROGRESS : studies
    VOCABULARY ||--o{ CHAPTER_WORDS : belongs_to
    
    CHAPTERS ||--o{ CHAPTER_WORDS : contains
    CHAPTERS ||--o{ CHAPTER_COMPLETIONS : completed_by
    
    LEARNING_PHASES ||--o{ PHASE_VOCABULARY : includes
    VOCABULARY ||--o{ PHASE_VOCABULARY : assigned_to
    
    USERS {
        int id PK
        string username
        int xp
        int level
        int streakDays
        int currentPhase FK
    }
    
    VOCABULARY {
        int id PK
        string arabic
        string meaning
        string category
        int frequency
        int difficulty
    }
    
    USER_PROGRESS {
        int userId FK
        int wordId FK
        string masteryLevel
        int reviewCount
        date nextReview
    }
    
    CHAPTER_COMPLETIONS {
        int userId FK
        int chapterId FK
        float masteryPercentage
        date completedAt
    }
    
    ACHIEVEMENTS {
        int userId FK
        string achievementType
        string title
        int xpReward
        date unlockedAt
    }
```

## API Endpoint Architecture

### Core Learning APIs
- **GET /api/words** - Phase-filtered vocabulary with fallback system
- **GET /api/learn/chapter/:id** - Chapter-specific authentic vocabulary
- **GET /api/user/:id/current-phase** - Current learning phase state
- **POST /api/user/:id/select-phase** - Phase switching with validation

### Progress & Analytics APIs
- **GET /api/user/:id/progress** - Comprehensive learning analytics
- **GET /api/user/:id/chapter-progress** - Chapter completion tracking
- **GET /api/user/:id/review** - Spaced repetition due words
- **POST /api/user/:id/answer** - Answer processing and progress updates

### Achievement & Gamification APIs
- **GET /api/user/:id/achievements** - Unlocked achievements
- **GET /api/user/:id/challenges** - Daily and weekly challenges
- **GET /api/content-stats** - Vocabulary statistics and coverage

## Performance & Reliability Features

### Caching Strategy
- **Frontend**: TanStack Query with 10-second stale time for phase data
- **API**: Response caching with 304 Not Modified for static content
- **Vocabulary**: In-memory caching with efficient filtering algorithms

### Error Handling
- **Frontend**: Comprehensive error boundaries and loading states
- **API**: Graceful degradation with fallback vocabulary selection
- **Storage**: Transaction safety and data integrity validation

### Scalability Design
- **Modular Architecture**: Easy component replacement and extension
- **Database Ready**: PostgreSQL schema prepared for production scaling
- **API Versioning**: RESTful design supporting future API versions
- **Mobile Optimization**: Responsive design with progressive enhancement

This infrastructure supports the complete QuranicFlow learning experience, from vocabulary acquisition through achievement celebration, with robust error handling and scalability for future growth.