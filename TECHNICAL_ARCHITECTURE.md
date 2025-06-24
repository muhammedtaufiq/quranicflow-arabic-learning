# QuranicFlow - Technical Architecture Documentation

## System Overview

QuranicFlow is a full-stack web application built with modern JavaScript/TypeScript technologies, designed for scalable Arabic vocabulary learning with offline-first capabilities. The architecture prioritizes performance, maintainability, and user experience while handling complex educational workflows.

## Frontend Architecture

### Technology Stack
```
React 18.2.0 + TypeScript 5.2.2
├── Build System: Vite 5.0.0
├── Routing: Wouter 3.0.0  
├── State Management: TanStack Query v5
├── UI Framework: Radix UI + shadcn/ui
├── Styling: Tailwind CSS 3.4.0
├── Forms: React Hook Form + Zod validation
└── Icons: Lucide React + React Icons
```

### Component Architecture

#### Core Components Structure
```
client/src/
├── components/
│   ├── ui/                          # Base UI components (shadcn/ui)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── form.tsx
│   │   └── [25+ other base components]
│   ├── learning-session.tsx         # Main learning interface
│   ├── phased-learning-dashboard.tsx # Admin/teacher dashboard
│   ├── progress-tracking.tsx        # User progress visualization
│   └── family-learning.tsx          # Family group functionality
├── pages/
│   ├── dashboard-redesigned.tsx     # Main user dashboard
│   ├── learn.tsx                    # Learning session container
│   ├── chapters.tsx                 # Chapter-specific learning
│   ├── review.tsx                   # Spaced repetition interface
│   ├── family.tsx                   # Family management
│   └── admin.tsx                    # Administrative interface
├── lib/
│   ├── queryClient.ts               # TanStack Query configuration
│   ├── utils.ts                     # Utility functions
│   └── types.ts                     # Shared TypeScript types
└── hooks/
    ├── use-toast.tsx                # Toast notification system
    ├── use-local-storage.tsx        # Browser storage utilities
    └── use-learning-session.tsx     # Learning session state management
```

#### Component Design Patterns

##### 1. Compound Components Pattern
```typescript
// Learning session with multiple sub-components
<LearningSession>
  <LearningSession.Header />
  <LearningSession.Question />
  <LearningSession.Options />
  <LearningSession.Progress />
  <LearningSession.Actions />
</LearningSession>
```

##### 2. Render Props Pattern
```typescript
// Progress tracking with flexible rendering
<ProgressTracker>
  {({ progress, streak, level }) => (
    <CustomProgressDisplay 
      progress={progress}
      streak={streak}
      level={level}
    />
  )}
</ProgressTracker>
```

##### 3. Custom Hooks Pattern
```typescript
// Reusable learning session logic
const useLearningSession = (userId: number, mode: LearningMode) => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress>({});
  // ... complex learning logic
  return { currentWord, sessionProgress, nextWord, submitAnswer };
};
```

### State Management Strategy

#### TanStack Query Implementation
```typescript
// Centralized API client configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: 2
    },
    mutations: {
      retry: 1,
      onError: (error) => {
        toast.error(`Operation failed: ${error.message}`);
      }
    }
  }
});

// Query patterns for different data types
const useUserData = (userId: number) => 
  useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetch(`/api/user/${userId}`).then(res => res.json())
  });

const useVocabulary = (filters: VocabularyFilters) =>
  useQuery({
    queryKey: ['vocabulary', filters],
    queryFn: () => fetch(`/api/vocabulary?${new URLSearchParams(filters)}`).then(res => res.json())
  });
```

#### Local State Management
```typescript
// Learning session state management
interface LearningSessionState {
  currentWordIndex: number;
  sessionWords: Word[];
  userAnswers: UserAnswer[];
  sessionStats: SessionStats;
  timeStarted: Date;
  isSessionActive: boolean;
}

const LearningSessionReducer = (state: LearningSessionState, action: LearningAction) => {
  switch (action.type) {
    case 'START_SESSION':
      return { ...state, isSessionActive: true, timeStarted: new Date() };
    case 'SUBMIT_ANSWER':
      return { 
        ...state, 
        userAnswers: [...state.userAnswers, action.answer],
        currentWordIndex: state.currentWordIndex + 1
      };
    case 'END_SESSION':
      return { ...state, isSessionActive: false };
    default:
      return state;
  }
};
```

### Routing Architecture

#### Wouter Configuration
```typescript
// Main application routing
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={DashboardRedesigned} />
        <Route path="/learn" component={Learn} />
        <Route path="/learn/:mode" component={Learn} />
        <Route path="/chapters/:chapterId" component={ChapterLearning} />
        <Route path="/review" component={Review} />
        <Route path="/family" component={Family} />
        <Route path="/admin" component={Admin} />
        <Route path="/progress" component={Progress} />
        <Route component={NotFound} />
      </Router>
    </QueryClientProvider>
  );
};

// Dynamic routing with parameters
const Learn = () => {
  const [params] = useRoute('/learn/:mode?');
  const mode = params?.mode || 'normal';
  
  return <LearningSession mode={mode} />;
};
```

## Backend Architecture

### Technology Stack
```
Node.js 20.x + TypeScript 5.2.2
├── Framework: Express.js 4.18.0
├── Database: In-Memory Storage (MemStorage)
├── Session Management: express-session + connect-pg-simple
├── Validation: Zod 3.22.0
├── Build System: esbuild + tsx for development
└── HTTP Client: Built-in fetch API
```

### Server Structure
```
server/
├── index.ts                    # Express server configuration
├── routes.ts                   # API route definitions
├── storage.ts                  # Data persistence layer
├── authentic-vocabulary.ts     # Vocabulary database (749+ words)
├── learning-engine.ts          # Personalized learning algorithms
├── offline-ai.ts              # Local AI for pattern recognition
├── streak-system.ts           # Daily streak management
└── types.ts                   # Shared TypeScript interfaces
```

### API Design

#### RESTful Endpoint Architecture
```typescript
// User management endpoints
GET    /api/user/:id                    # Get user profile
PATCH  /api/user/:id                    # Update user profile
GET    /api/user/:id/progress           # Get learning progress
POST   /api/user/:id/session            # Record learning session

// Vocabulary endpoints  
GET    /api/vocabulary                  # Get vocabulary list (with filters)
GET    /api/vocabulary/:id              # Get specific word
GET    /api/words/review/:userId        # Get words due for review
POST   /api/words/review/:userId        # Submit review session

// Learning system endpoints
GET    /api/learning/lesson/:userId     # Get personalized lesson
POST   /api/learning/session           # Submit learning session
GET    /api/learning/analytics/:userId  # Get learning analytics

// Challenge and streak endpoints
GET    /api/user/:id/challenges         # Get active challenges
POST   /api/user/:id/challenges/:challengeId/complete # Complete challenge
GET    /api/user/:id/streak             # Get streak information
POST   /api/user/:id/streak             # Update streak

// Family learning endpoints
GET    /api/family/:familyId            # Get family information
POST   /api/family                     # Create family
GET    /api/family/:familyId/members    # Get family members
POST   /api/family/:familyId/challenges # Create family challenge
```

#### Request/Response Patterns
```typescript
// Standardized API response format
interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    pagination?: PaginationInfo;
    timestamp: string;
    version: string;
  };
}

// Example endpoint implementation
app.get('/api/vocabulary', async (req, res) => {
  try {
    const filters = vocabularyFiltersSchema.parse(req.query);
    const vocabulary = await storage.getWords(filters.limit, filters.difficulty);
    
    res.json({
      success: true,
      data: vocabulary,
      meta: {
        timestamp: new Date().toISOString(),
        version: '1.0',
        pagination: {
          total: vocabulary.length,
          limit: filters.limit,
          offset: filters.offset || 0
        }
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: error.message
      }
    });
  }
});
```

### Data Storage Architecture

#### In-Memory Storage Implementation
```typescript
// MemStorage class for high-performance data access
export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private words: Map<number, Word> = new Map();
  private userWordProgress: Map<number, UserWordProgress> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private challenges: Map<number, Challenge> = new Map();
  private learningStreaks: Map<number, LearningStreak> = new Map();
  private families: Map<number, Family> = new Map();

  // Efficient data retrieval methods
  async getWords(limit = 50, difficulty?: number): Promise<Word[]> {
    let words = Array.from(this.words.values());
    
    if (difficulty !== undefined) {
      words = words.filter(word => word.difficulty === difficulty);
    }
    
    return words
      .sort((a, b) => b.frequency - a.frequency) // Sort by frequency
      .slice(0, limit);
  }

  // Complex query operations
  async getUserWordsForReview(userId: number): Promise<UserWordProgress[]> {
    const now = new Date();
    return Array.from(this.userWordProgress.values())
      .filter(progress => 
        progress.userId === userId && 
        progress.nextReview <= now &&
        progress.masteryLevel !== 'gold'
      )
      .sort((a, b) => a.nextReview.getTime() - b.nextReview.getTime());
  }
}
```

#### Data Relationships
```typescript
// Comprehensive type system for data relationships
interface User {
  id: number;
  username: string;
  email: string;
  level: number;
  xp: number;
  joinedAt: Date;
  lastActiveAt: Date;
}

interface Word {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningUrdu: string;
  frequency: number;        // Quranic frequency count
  difficulty: number;       // 1-5 difficulty rating
  category: string;         // Semantic category
  chapter: number;          // Quranic chapter (surah)
  verse: number;           // Verse number (ayah)
  rootWord: string;        // Arabic root
  examples: string[];      // Usage examples
  source: string;          // Academic source reference
}

interface UserWordProgress {
  id: number;
  userId: number;
  wordId: number;
  masteryLevel: 'bronze' | 'silver' | 'gold';
  correctAnswers: number;
  totalAttempts: number;
  lastReviewed: Date;
  nextReview: Date;
  difficultyAdjustment: number; // -2 to +2 for personalization
}
```

## Learning System Architecture

### Personalized Learning Engine

#### Core Algorithm Implementation
```typescript
export class PersonalizedLearningEngine {
  private personalizedData: Map<number, PersonalizedLearning> = new Map();

  // Generate daily lesson based on user patterns
  getDailyLesson(userId: number, currentPhase: number): Array<{
    word: any;
    questionType: string;
    difficulty: number;
    context?: IslamicContext;
  }> {
    const userData = this.getUserLearningData(userId);
    const phaseWords = this.getPhaseVocabulary(currentPhase);
    
    // Mix of new words and review words
    const newWords = this.selectNewWords(phaseWords, userData, 5);
    const reviewWords = this.selectReviewWords(userData, 10);
    
    // Personalize difficulty and question types
    const lesson = [...newWords, ...reviewWords].map(word => ({
      word,
      questionType: this.selectQuestionType(word, userData),
      difficulty: this.calculatePersonalizedDifficulty(word, userData),
      context: ISLAMIC_CONTEXTS[word.id]
    }));

    return this.shuffleArray(lesson);
  }

  // Record learning session and update patterns
  recordLearningSession(userId: number, sessionData: {
    wordsStudied: number[];
    correctAnswers: number[];
    mistakeTypes: string[];
    sessionTime: Date;
    totalTime: number;
  }): void {
    const userData = this.getUserLearningData(userId);
    
    // Update struggling and mastered words
    sessionData.correctAnswers.forEach(wordId => {
      if (this.isConsistentlyCorrect(wordId, userData)) {
        this.moveToMastered(wordId, userData);
      }
    });

    // Update mistake patterns
    userData.learningPattern.commonMistakePatterns = 
      this.analyzeCommonMistakes(sessionData.mistakeTypes, userData);

    // Update optimal study time
    userData.learningPattern.bestTimeOfDay = 
      this.analyzeBestStudyTime(sessionData.sessionTime, userData);

    this.personalizedData.set(userId, userData);
  }
}
```

### Offline AI System

#### Pattern Recognition Implementation
```typescript
export class OfflineAI {
  private userPatterns: Map<number, LearningPattern> = new Map();
  private wordDifficulties: Map<number, WordDifficulty> = new Map();

  // Analyze user learning patterns
  analyzeUserPattern(userId: number, sessionData: Array<{
    wordId: number;
    correct: boolean;
    timeSpent: number;
    mistakeType?: string;
  }>): LearningPattern {
    const existingPattern = this.userPatterns.get(userId) || {
      mistakeTypes: [],
      difficultyAreas: [],
      timePatterns: [],
      successRates: {}
    };

    // Analyze mistake patterns
    const mistakeTypes = sessionData
      .filter(item => !item.correct && item.mistakeType)
      .map(item => item.mistakeType!);

    // Update success rates by category
    const categoryPerformance = this.calculateCategoryPerformance(sessionData);
    
    // Identify difficulty areas
    const difficultyAreas = Object.entries(categoryPerformance)
      .filter(([_, rate]) => rate < 0.7)
      .map(([category, _]) => category);

    return {
      mistakeTypes: [...existingPattern.mistakeTypes, ...mistakeTypes],
      difficultyAreas,
      timePatterns: [...existingPattern.timePatterns, Date.now()],
      successRates: { ...existingPattern.successRates, ...categoryPerformance }
    };
  }

  // Predict word difficulty for user
  predictDifficultWords(userId: number, newWords: any[]): Array<{
    word: any;
    predictedDifficulty: number;
    reasons: string[];
  }> {
    const pattern = this.userPatterns.get(userId);
    if (!pattern) return newWords.map(word => ({ word, predictedDifficulty: word.difficulty, reasons: [] }));

    return newWords.map(word => ({
      word,
      predictedDifficulty: this.calculatePredictedDifficulty(word, pattern),
      reasons: this.generateDifficultyReasons(word, pattern)
    }));
  }
}
```

### Spaced Repetition System

#### Implementation Details
```typescript
// Spaced repetition intervals based on performance
const calculateNextReviewDate = (
  currentInterval: number,
  quality: number, // 0-5 scale (0 = complete blackout, 5 = perfect)
  easeFactor: number = 2.5
): { nextInterval: number; newEaseFactor: number } => {
  let newEaseFactor = easeFactor;
  let nextInterval: number;

  if (quality < 3) {
    // Reset interval for poor performance
    nextInterval = 1;
  } else {
    if (currentInterval === 1) {
      nextInterval = 6;
    } else if (currentInterval === 6) {
      nextInterval = Math.round(currentInterval * newEaseFactor);
    } else {
      nextInterval = Math.round(currentInterval * newEaseFactor);
    }

    // Adjust ease factor
    newEaseFactor = newEaseFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(1.3, newEaseFactor); // Minimum ease factor
  }

  return { nextInterval, newEaseFactor };
};

// Review queue management
const generateReviewSchedule = (userId: number, strugglingWords: number[]): Array<{
  wordId: number;
  reviewDate: Date;
  priority: number;
}> => {
  const now = new Date();
  
  return strugglingWords.map(wordId => {
    const baseInterval = this.calculateBaseInterval(this.getWordDifficulty(wordId));
    const userPattern = this.userPatterns.get(userId);
    const adjustedInterval = this.adjustIntervalForUser(baseInterval, userPattern);
    
    return {
      wordId,
      reviewDate: new Date(now.getTime() + adjustedInterval * 24 * 60 * 60 * 1000),
      priority: this.calculatePriority(wordId, userPattern)
    };
  }).sort((a, b) => b.priority - a.priority);
};
```

## Performance Optimization

### Frontend Performance

#### Code Splitting Strategy
```typescript
// Route-based code splitting
const DashboardRedesigned = lazy(() => import('./pages/dashboard-redesigned'));
const Learn = lazy(() => import('./pages/learn'));
const Review = lazy(() => import('./pages/review'));

// Component-level splitting for heavy components
const LearningSession = lazy(() => import('./components/learning-session'));
const ProgressAnalytics = lazy(() => import('./components/progress-analytics'));

// Preloading strategy
const preloadLearningSession = () => import('./components/learning-session');

// Usage with Suspense
const App = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <Router>
      <Route path="/" component={DashboardRedesigned} />
      <Route path="/learn" component={Learn} />
    </Router>
  </Suspense>
);
```

#### Memoization and Optimization
```typescript
// Heavy computation memoization
const VocabularyList = memo(({ words, filters }: VocabularyListProps) => {
  const filteredWords = useMemo(() => {
    return words.filter(word => 
      (!filters.difficulty || word.difficulty === filters.difficulty) &&
      (!filters.category || word.category === filters.category) &&
      (!filters.search || word.arabic.includes(filters.search) || 
       word.meaning.toLowerCase().includes(filters.search.toLowerCase()))
    );
  }, [words, filters]);

  return (
    <div className="vocabulary-grid">
      {filteredWords.map(word => (
        <WordCard key={word.id} word={word} />
      ))}
    </div>
  );
});

// Callback optimization
const LearningSession = () => {
  const [currentWord, setCurrentWord] = useState<Word | null>(null);
  
  const handleAnswerSubmit = useCallback((answer: string) => {
    // Process answer logic
    submitAnswer(currentWord?.id, answer);
  }, [currentWord?.id]);

  return (
    <AnswerForm onSubmit={handleAnswerSubmit} />
  );
};
```

### Backend Performance

#### Caching Strategy
```typescript
// In-memory caching for frequently accessed data
class CacheManager {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  private readonly DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() > cached.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
}

// Usage in API endpoints
app.get('/api/vocabulary', async (req, res) => {
  const cacheKey = `vocabulary:${JSON.stringify(req.query)}`;
  let vocabulary = cacheManager.get(cacheKey);
  
  if (!vocabulary) {
    vocabulary = await storage.getWords(req.query.limit, req.query.difficulty);
    cacheManager.set(cacheKey, vocabulary);
  }
  
  res.json({ success: true, data: vocabulary });
});
```

#### Database Query Optimization
```typescript
// Optimized queries with indexing
class MemStorage {
  // Pre-computed indexes for common queries
  private userWordIndex: Map<number, Set<number>> = new Map();
  private categoryIndex: Map<string, number[]> = new Map();
  private difficultyIndex: Map<number, number[]> = new Map();

  // Initialize indexes on startup
  private buildIndexes(): void {
    this.words.forEach((word, wordId) => {
      // Category index
      if (!this.categoryIndex.has(word.category)) {
        this.categoryIndex.set(word.category, []);
      }
      this.categoryIndex.get(word.category)!.push(wordId);

      // Difficulty index
      if (!this.difficultyIndex.has(word.difficulty)) {
        this.difficultyIndex.set(word.difficulty, []);
      }
      this.difficultyIndex.get(word.difficulty)!.push(wordId);
    });
  }

  // Fast filtered queries using indexes
  async getWordsByCategory(category: string): Promise<Word[]> {
    const wordIds = this.categoryIndex.get(category) || [];
    return wordIds.map(id => this.words.get(id)!);
  }
}
```

## Security Architecture

### Input Validation
```typescript
// Comprehensive Zod schemas for API validation
const vocabularyQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  difficulty: z.coerce.number().min(1).max(5).optional(),
  category: z.string().optional(),
  search: z.string().max(100).optional()
});

const learningSessionSchema = z.object({
  userId: z.number().min(1),
  wordId: z.number().min(1),
  answer: z.string().min(1).max(500),
  timeSpent: z.number().min(0).max(300000), // Max 5 minutes per question
  sessionId: z.string().uuid()
});

// Middleware for request validation
const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request data',
          details: error.errors
        }
      });
    }
  };
};
```

### Session Management
```typescript
// Secure session configuration
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    conString: process.env.DATABASE_URL,
    tableName: 'user_sessions'
  }),
  secret: process.env.SESSION_SECRET!,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Authentication middleware
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.session?.userId) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication required' }
    });
  }
  next();
};
```

## Testing Architecture

### Unit Testing Strategy
```typescript
// Component testing with React Testing Library
describe('LearningSession', () => {
  const mockWord = {
    id: 1,
    arabic: 'الله',
    transliteration: 'Allah',
    meaning: 'God',
    meaningUrdu: 'اللہ'
  };

  it('displays word correctly', () => {
    render(<LearningSession word={mockWord} />);
    expect(screen.getByText('الله')).toBeInTheDocument();
    expect(screen.getByText('Allah')).toBeInTheDocument();
  });

  it('handles answer submission', async () => {
    const mockSubmit = jest.fn();
    render(<LearningSession word={mockWord} onSubmit={mockSubmit} />);
    
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'God' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
    
    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith('God');
    });
  });
});

// API endpoint testing
describe('GET /api/vocabulary', () => {
  it('returns vocabulary list', async () => {
    const response = await request(app)
      .get('/api/vocabulary')
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it('filters by difficulty', async () => {
    const response = await request(app)
      .get('/api/vocabulary?difficulty=1')
      .expect(200);

    response.body.data.forEach((word: any) => {
      expect(word.difficulty).toBe(1);
    });
  });
});
```

### Integration Testing
```typescript
// End-to-end learning session test
describe('Learning Session Flow', () => {
  it('completes full learning session', async () => {
    // Start session
    const sessionResponse = await request(app)
      .post('/api/learning/session')
      .send({ userId: 1, mode: 'normal' })
      .expect(200);

    const { sessionId, words } = sessionResponse.body.data;

    // Answer questions
    for (const word of words) {
      await request(app)
        .post(`/api/learning/session/${sessionId}/answer`)
        .send({
          wordId: word.id,
          answer: word.meaning,
          timeSpent: 3000
        })
        .expect(200);
    }

    // Complete session
    const completionResponse = await request(app)
      .post(`/api/learning/session/${sessionId}/complete`)
      .expect(200);

    expect(completionResponse.body.data.xpGained).toBeGreaterThan(0);
  });
});
```

## Deployment Architecture

### Build Process
```typescript
// Vite configuration for optimized production builds
export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist/public',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-select'],
          'query-vendor': ['@tanstack/react-query']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query']
  }
});

// Server build configuration
{
  "scripts": {
    "build:client": "vite build",
    "build:server": "esbuild server/index.ts --bundle --platform=node --outdir=dist --format=cjs",
    "build": "npm run build:client && npm run build:server",
    "start": "node dist/index.js"
  }
}
```

### Environment Configuration
```typescript
// Environment-specific configurations
const config = {
  development: {
    port: 5000,
    cors: { origin: 'http://localhost:5173' },
    logging: 'dev',
    cache: { ttl: 60000 } // 1 minute
  },
  production: {
    port: process.env.PORT || 5000,
    cors: { origin: process.env.FRONTEND_URL },
    logging: 'combined',
    cache: { ttl: 300000 } // 5 minutes
  }
};

const currentConfig = config[process.env.NODE_ENV || 'development'];
```

## Monitoring and Analytics

### Performance Monitoring
```typescript
// Custom metrics collection
class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();

  recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }
}

// Usage in API endpoints
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    metricsCollector.recordMetric(`api.${req.method}.${req.route?.path || req.path}`, duration);
  });
  next();
});
```

### Learning Analytics
```typescript
// Detailed learning analytics tracking
interface LearningAnalytics {
  userId: number;
  sessionId: string;
  timestamp: Date;
  wordsStudied: number;
  correctAnswers: number;
  averageResponseTime: number;
  mistakePatterns: string[];
  difficultyDistribution: Record<number, number>;
  categoryPerformance: Record<string, number>;
}

const trackLearningSession = (sessionData: LearningAnalytics): void => {
  // Store analytics for user progress analysis
  analyticsStorage.recordSession(sessionData);
  
  // Update personalized learning recommendations
  learningEngine.updateUserModel(sessionData.userId, sessionData);
  
  // Trigger achievement checks
  achievementSystem.checkAchievements(sessionData.userId, sessionData);
};
```

## Conclusion

The QuranicFlow technical architecture demonstrates a comprehensive approach to modern web application development, balancing performance, scalability, and maintainability while serving the specific needs of Arabic vocabulary learning. The offline-first approach, combined with sophisticated learning algorithms and responsive design, creates a robust educational platform capable of serving diverse learning needs while maintaining high academic and technical standards.

The architecture's modular design allows for future enhancements and scalability while preserving the core mission of providing authentic, academically rigorous Quranic Arabic education through modern technology.

---

**Last Updated**: June 24, 2025  
**Architecture Version**: 2.0 (Phase 6 Complete)  
**Technology Stack**: React 18 + Node.js 20 + TypeScript 5.2  
**Performance**: Sub-second response times, 90%+ uptime target