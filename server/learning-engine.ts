import { AUTHENTIC_QURANIC_VOCABULARY } from './authentic-vocabulary';

// Learning phases for gradual progression
export interface LearningPhase {
  id: number;
  name: string;
  description: string;
  minWordsToUnlock: number;
  maxDailyWords: number;
  vocabularyIds: number[];
  focusAreas: string[];
}

// Personalized learning data tracking
export interface PersonalizedLearning {
  userId: number;
  strugglingWords: number[]; // Word IDs user consistently gets wrong
  masteredWords: number[]; // Words user has fully learned
  reviewQueue: Array<{
    wordId: number;
    nextReviewDate: Date;
    difficultyLevel: number; // 1-5, higher = more frequent review
    mistakeCount: number;
    lastMistakeTypes: string[]; // 'translation', 'pronunciation', 'context'
  }>;
  learningPattern: {
    bestTimeOfDay: string;
    averageSessionLength: number;
    preferredQuestionTypes: string[];
    commonMistakePatterns: string[];
  };
}

// Islamic historical context for words
export interface IslamicContext {
  wordId: number;
  historicalReferences: Array<{
    event: string;
    description: string;
    source: string;
    relevance: string;
  }>;
  propheticUsage: Array<{
    hadith: string;
    source: string;
    context: string;
  }>;
  quranOccurrences: Array<{
    surah: number;
    ayah: number;
    context: string;
    translation: string;
  }>;
}

// Define learning phases with authentic Quranic vocabulary
export const LEARNING_PHASES: LearningPhase[] = [
  {
    id: 1,
    name: "Foundation (Al-Asas)",
    description: "Essential words from Al-Fatiha and basic Islamic vocabulary",
    minWordsToUnlock: 0,
    maxDailyWords: 5,
    vocabularyIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], // Al-Fatiha + basics
    focusAreas: ["Divine Names", "Worship", "Guidance"]
  },
  {
    id: 2,
    name: "Pillars (Al-Arkan)",
    description: "Words related to the Five Pillars of Islam",
    minWordsToUnlock: 12,
    maxDailyWords: 7,
    vocabularyIds: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30],
    focusAreas: ["Prayer", "Charity", "Pilgrimage", "Fasting"]
  },
  {
    id: 3,
    name: "Stories (Al-Qasas)",
    description: "Vocabulary from stories of the Prophets",
    minWordsToUnlock: 25,
    maxDailyWords: 8,
    vocabularyIds: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45],
    focusAreas: ["Prophets", "Nations", "Miracles", "Lessons"]
  },
  {
    id: 4,
    name: "Character (Al-Akhlaq)",
    description: "Words describing moral qualities and character",
    minWordsToUnlock: 40,
    maxDailyWords: 10,
    vocabularyIds: [46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60],
    focusAreas: ["Virtues", "Character", "Behavior", "Ethics"]
  },
  {
    id: 5,
    name: "Wisdom (Al-Hikmah)",
    description: "Advanced vocabulary from wisdom literature",
    minWordsToUnlock: 60,
    maxDailyWords: 12,
    vocabularyIds: [61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75],
    focusAreas: ["Knowledge", "Wisdom", "Understanding", "Reflection"]
  },
  {
    id: 6,
    name: "Mastery (Al-Itqan)",
    description: "Complete vocabulary mastery with complex expressions",
    minWordsToUnlock: 80,
    maxDailyWords: 15,
    vocabularyIds: Array.from({length: 1085}, (_, i) => i + 76), // Remaining words to complete 1500 total
    focusAreas: ["Advanced Grammar", "Rhetoric", "Poetry", "Scholarly Terms"]
  }
];

// Islamic historical context for key vocabulary
export const ISLAMIC_CONTEXTS: Record<number, IslamicContext> = {
  1: { // Allah
    wordId: 1,
    historicalReferences: [
      {
        event: "First Revelation",
        description: "The word 'Allah' was the first divine name revealed to Prophet Muhammad (PBUH)",
        source: "Sahih Al-Bukhari",
        relevance: "Establishes the monotheistic foundation of Islam"
      }
    ],
    propheticUsage: [
      {
        hadith: "The best dhikr is La ilaha illa Allah",
        source: "Sunan At-Tirmidhi",
        context: "Emphasizing the supreme importance of Allah's name"
      }
    ],
    quranOccurrences: [
      {
        surah: 1,
        ayah: 2,
        context: "Al-Fatiha opening",
        translation: "All praise is due to Allah, Lord of the worlds"
      }
    ]
  },
  2: { // Rahman
    wordId: 2,
    historicalReferences: [
      {
        event: "Treaty of Hudaybiyyah",
        description: "The Meccan delegation objected to 'Bismillah Ar-Rahman Ar-Raheem' as they didn't recognize Ar-Rahman",
        source: "Sahih Al-Bukhari",
        relevance: "Shows the significance of this divine attribute in early Islamic history"
      }
    ],
    propheticUsage: [
      {
        hadith: "Allah is more merciful to His servants than a mother to her child",
        source: "Sahih Al-Bukhari",
        context: "Explaining the depth of Allah's mercy (Rahman)"
      }
    ],
    quranOccurrences: [
      {
        surah: 55,
        ayah: 1,
        context: "Surah Ar-Rahman opening",
        translation: "The Most Merciful"
      }
    ]
  }
};

// Local offline learning engine using pattern matching and statistics
export class PersonalizedLearningEngine {
  private personalizedData: Map<number, PersonalizedLearning> = new Map();

  // Initialize personalized learning for a user
  initializeUserLearning(userId: number): PersonalizedLearning {
    const data: PersonalizedLearning = {
      userId,
      strugglingWords: [],
      masteredWords: [],
      reviewQueue: [],
      learningPattern: {
        bestTimeOfDay: 'morning',
        averageSessionLength: 10,
        preferredQuestionTypes: ['multiple_choice'],
        commonMistakePatterns: []
      }
    };
    
    this.personalizedData.set(userId, data);
    return data;
  }

  // Record learning session results
  recordLearningSession(userId: number, sessionData: {
    wordId: number;
    isCorrect: boolean;
    mistakeType?: string;
    timeSpent: number;
    sessionTime: Date;
  }) {
    let userData = this.personalizedData.get(userId);
    if (!userData) {
      userData = this.initializeUserLearning(userId);
    }

    const { wordId, isCorrect, mistakeType, timeSpent, sessionTime } = sessionData;

    if (!isCorrect && mistakeType) {
      // Add to struggling words if not already there
      if (!userData.strugglingWords.includes(wordId)) {
        userData.strugglingWords.push(wordId);
      }

      // Update review queue with higher difficulty
      const existingReview = userData.reviewQueue.find(r => r.wordId === wordId);
      if (existingReview) {
        existingReview.mistakeCount++;
        existingReview.difficultyLevel = Math.min(5, existingReview.difficultyLevel + 1);
        existingReview.lastMistakeTypes.push(mistakeType);
        existingReview.nextReviewDate = this.calculateNextReviewDate(existingReview.difficultyLevel);
      } else {
        userData.reviewQueue.push({
          wordId,
          nextReviewDate: this.calculateNextReviewDate(2),
          difficultyLevel: 2,
          mistakeCount: 1,
          lastMistakeTypes: [mistakeType]
        });
      }

      // Update common mistake patterns
      if (!userData.learningPattern.commonMistakePatterns.includes(mistakeType)) {
        userData.learningPattern.commonMistakePatterns.push(mistakeType);
      }
    } else if (isCorrect) {
      // Remove from struggling words if consistently correct
      const existingReview = userData.reviewQueue.find(r => r.wordId === wordId);
      if (existingReview && existingReview.mistakeCount === 0) {
        userData.masteredWords.push(wordId);
        userData.reviewQueue = userData.reviewQueue.filter(r => r.wordId !== wordId);
        userData.strugglingWords = userData.strugglingWords.filter(id => id !== wordId);
      } else if (existingReview) {
        existingReview.difficultyLevel = Math.max(1, existingReview.difficultyLevel - 1);
        existingReview.nextReviewDate = this.calculateNextReviewDate(existingReview.difficultyLevel);
      }
    }

    // Update learning patterns
    const hour = sessionTime.getHours();
    if (hour < 12) userData.learningPattern.bestTimeOfDay = 'morning';
    else if (hour < 18) userData.learningPattern.bestTimeOfDay = 'afternoon';
    else userData.learningPattern.bestTimeOfDay = 'evening';

    userData.learningPattern.averageSessionLength = 
      (userData.learningPattern.averageSessionLength + timeSpent) / 2;

    this.personalizedData.set(userId, userData);
  }

  // Calculate next review date based on spaced repetition
  private calculateNextReviewDate(difficultyLevel: number): Date {
    const now = new Date();
    const daysToAdd = [1, 3, 7, 14, 30][difficultyLevel - 1] || 1;
    now.setDate(now.getDate() + daysToAdd);
    return now;
  }

  // Get personalized daily lesson
  getDailyLesson(userId: number, currentPhase: number): Array<{
    word: any;
    context?: IslamicContext;
    reviewPriority: number;
  }> {
    const userData = this.personalizedData.get(userId);
    const phase = LEARNING_PHASES.find(p => p.id === currentPhase);
    
    if (!phase) return [];

    const lesson: any[] = [];
    
    // Add struggling words for review (high priority)
    if (userData) {
      userData.strugglingWords.slice(0, 3).forEach(wordId => {
        const word = AUTHENTIC_QURANIC_VOCABULARY[wordId];
        if (word) {
          lesson.push({
            word,
            context: ISLAMIC_CONTEXTS[wordId],
            reviewPriority: 1
          });
        }
      });
    }

    // Add new words from current phase
    const newWordsNeeded = phase.maxDailyWords - lesson.length;
    const masteredIds = userData?.masteredWords || [];
    
    phase.vocabularyIds
      .filter(id => !masteredIds.includes(id))
      .slice(0, newWordsNeeded)
      .forEach(wordId => {
        const word = AUTHENTIC_QURANIC_VOCABULARY[wordId];
        if (word) {
          lesson.push({
            word,
            context: ISLAMIC_CONTEXTS[wordId],
            reviewPriority: 0
          });
        }
      });

    return lesson;
  }

  // Get words due for review today
  getWordsForReview(userId: number): Array<{
    word: any;
    context?: IslamicContext;
    reviewData: any;
  }> {
    const userData = this.personalizedData.get(userId);
    if (!userData) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return userData.reviewQueue
      .filter(review => review.nextReviewDate <= today)
      .map(review => {
        const word = AUTHENTIC_QURANIC_VOCABULARY[review.wordId];
        return {
          word,
          context: ISLAMIC_CONTEXTS[review.wordId],
          reviewData: review
        };
      })
      .filter(item => item.word);
  }

  // Get user's learning analytics
  getLearningAnalytics(userId: number) {
    const userData = this.personalizedData.get(userId);
    if (!userData) return null;

    return {
      totalWordsLearned: userData.masteredWords.length,
      strugglingWordsCount: userData.strugglingWords.length,
      reviewQueueSize: userData.reviewQueue.length,
      learningPattern: userData.learningPattern,
      recommendedPhase: this.getRecommendedPhase(userData.masteredWords.length),
      weeklyProgress: this.calculateWeeklyProgress(userId)
    };
  }

  private getRecommendedPhase(masteredWords: number): number {
    return LEARNING_PHASES.find(phase => masteredWords < phase.minWordsToUnlock)?.id || 6;
  }

  private calculateWeeklyProgress(userId: number): Array<{date: string, wordsLearned: number}> {
    // This would calculate progress over the last 7 days
    // For now, return mock data structure
    return [];
  }

  getUserLearningData(userId: number): PersonalizedLearning | undefined {
    return this.personalizedData.get(userId);
  }
}

// Singleton instance
export const learningEngine = new PersonalizedLearningEngine();