import {
  users, words, userWordProgress, achievements, userAchievements,
  challenges, userChallengeProgress, learningStreak,
  families, familyMembers, familyChallenges, familyChallengeProgress, dailyReminders,
  type User, type InsertUser, type Word, type InsertWord,
  type UserWordProgress, type InsertUserWordProgress,
  type Achievement, type InsertAchievement,
  type UserAchievement, type InsertUserAchievement,
  type Challenge, type InsertChallenge,
  type UserChallengeProgress, type InsertUserChallengeProgress,
  type LearningStreak, type InsertLearningStreak,
  type Family, type InsertFamily,
  type FamilyMember, type InsertFamilyMember,
  type FamilyChallenge, type InsertFamilyChallenge,
  type FamilyChallengeProgress, type InsertFamilyChallengeProgress,
  type DailyReminder, type InsertDailyReminder
} from "@shared/schema";
import { AUTHENTIC_QURANIC_VOCABULARY } from "./authentic-vocabulary";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User | undefined>;
  
  // Word operations
  getWords(limit?: number, difficulty?: number): Promise<Word[]>;
  getWord(id: number): Promise<Word | undefined>;
  createWord(word: InsertWord): Promise<Word>;
  getWordsByFrequency(limit: number): Promise<Word[]>;
  
  // User word progress
  getUserWordProgress(userId: number, wordId: number): Promise<UserWordProgress | undefined>;
  createUserWordProgress(progress: InsertUserWordProgress): Promise<UserWordProgress>;
  updateUserWordProgress(id: number, updates: Partial<UserWordProgress>): Promise<UserWordProgress | undefined>;
  getUserLearnedWords(userId: number): Promise<UserWordProgress[]>;
  getUserWordsForReview(userId: number): Promise<UserWordProgress[]>;
  
  // Achievements
  getAchievements(): Promise<Achievement[]>;
  getUserAchievements(userId: number): Promise<UserAchievement[]>;
  createUserAchievement(userAchievement: InsertUserAchievement): Promise<UserAchievement>;
  
  // Challenges
  getActiveChallenges(): Promise<Challenge[]>;
  getUserChallengeProgress(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined>;
  createUserChallengeProgress(progress: InsertUserChallengeProgress): Promise<UserChallengeProgress>;
  updateUserChallengeProgress(id: number, updates: Partial<UserChallengeProgress>): Promise<UserChallengeProgress | undefined>;
  
  // Learning streak
  getUserLearningStreak(userId: number): Promise<LearningStreak | undefined>;
  createLearningStreak(streak: InsertLearningStreak): Promise<LearningStreak>;
  updateLearningStreak(id: number, updates: Partial<LearningStreak>): Promise<LearningStreak | undefined>;
  
  // Leaderboard
  getLeaderboard(limit: number): Promise<User[]>;
  
  // Family operations
  createFamily(family: InsertFamily): Promise<Family>;
  getFamily(id: number): Promise<Family | undefined>;
  getFamilyByInviteCode(inviteCode: string): Promise<Family | undefined>;
  getFamilyMembers(familyId: number): Promise<FamilyMember[]>;
  addFamilyMember(member: InsertFamilyMember): Promise<FamilyMember>;
  updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined>;
  getUserFamily(userId: number): Promise<Family | undefined>;
  
  // Family challenges
  createFamilyChallenge(challenge: InsertFamilyChallenge): Promise<FamilyChallenge>;
  getFamilyChallenges(familyId: number): Promise<FamilyChallenge[]>;
  getFamilyChallengeProgress(challengeId: number, userId: number): Promise<FamilyChallengeProgress | undefined>;
  createFamilyChallengeProgress(progress: InsertFamilyChallengeProgress): Promise<FamilyChallengeProgress>;
  updateFamilyChallengeProgress(id: number, updates: Partial<FamilyChallengeProgress>): Promise<FamilyChallengeProgress | undefined>;
  
  // Daily reminders
  getUserReminder(userId: number): Promise<DailyReminder | undefined>;
  createReminder(reminder: InsertDailyReminder): Promise<DailyReminder>;
  updateReminder(id: number, updates: Partial<DailyReminder>): Promise<DailyReminder | undefined>;
  getRemindersToSend(): Promise<DailyReminder[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private words: Map<number, Word> = new Map();
  private userWordProgress: Map<number, UserWordProgress> = new Map();
  private achievements: Map<number, Achievement> = new Map();
  private userAchievements: Map<number, UserAchievement> = new Map();
  private challenges: Map<number, Challenge> = new Map();
  private userChallengeProgress: Map<number, UserChallengeProgress> = new Map();
  private learningStreaks: Map<number, LearningStreak> = new Map();
  private families: Map<number, Family> = new Map();
  private familyMembers: Map<number, FamilyMember> = new Map();
  private familyChallenges: Map<number, FamilyChallenge> = new Map();
  private familyChallengeProgress: Map<number, FamilyChallengeProgress> = new Map();
  private dailyReminders: Map<number, DailyReminder> = new Map();
  
  private currentUserId = 1;
  private currentWordId = 1;
  private currentProgressId = 1;
  private currentAchievementId = 1;
  private currentUserAchievementId = 1;
  private currentChallengeId = 1;
  private currentChallengeProgressId = 1;
  private currentStreakId = 1;
  private currentFamilyId = 1;
  private currentFamilyMemberId = 1;
  private currentFamilyChallengeId = 1;
  private currentFamilyChallengeProgressId = 1;
  private currentReminderId = 1;

  constructor() {
    this.initializeData();
  }

  private initializeData() {
    // Create a default demo user
    const demoUser: User = {
      id: 1,
      username: "demo_student",
      email: "demo@quranicflow.com", 
      password: "demo123",
      displayName: "Demo Student",
      level: 2,
      xp: 450,
      streakDays: 3,
      lastActiveDate: new Date(),
      comprehensionPercentage: 73,
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
    };
    this.users.set(1, demoUser);

    // Initialize comprehensive word progress for demo user (words due for review)
    const sampleProgress = [
      // Recently learned words (due for review)
      { wordId: 1, masteryLevel: 1, correctAnswers: 3, totalAttempts: 5, nextReview: new Date(Date.now() - 1000 * 60 * 60) },
      { wordId: 2, masteryLevel: 2, correctAnswers: 5, totalAttempts: 7, nextReview: new Date(Date.now() - 1000 * 60 * 30) },
      { wordId: 3, masteryLevel: 1, correctAnswers: 2, totalAttempts: 4, nextReview: new Date(Date.now() - 1000 * 60 * 60 * 2) },
      { wordId: 4, masteryLevel: 2, correctAnswers: 4, totalAttempts: 6, nextReview: new Date(Date.now() - 1000 * 60 * 45) },
      { wordId: 5, masteryLevel: 1, correctAnswers: 1, totalAttempts: 3, nextReview: new Date(Date.now() - 1000 * 60 * 60 * 3) },
      { wordId: 6, masteryLevel: 2, correctAnswers: 6, totalAttempts: 8, nextReview: new Date(Date.now() - 1000 * 60 * 20) },
      { wordId: 7, masteryLevel: 1, correctAnswers: 2, totalAttempts: 5, nextReview: new Date(Date.now() - 1000 * 60 * 90) },
      { wordId: 8, masteryLevel: 2, correctAnswers: 7, totalAttempts: 9, nextReview: new Date(Date.now() - 1000 * 60 * 15) },
      { wordId: 9, masteryLevel: 1, correctAnswers: 3, totalAttempts: 6, nextReview: new Date(Date.now() - 1000 * 60 * 120) },
      { wordId: 10, masteryLevel: 2, correctAnswers: 5, totalAttempts: 7, nextReview: new Date(Date.now() - 1000 * 60 * 40) },
      // Additional words for comprehensive review
      { wordId: 11, masteryLevel: 1, correctAnswers: 4, totalAttempts: 7, nextReview: new Date(Date.now() - 1000 * 60 * 80) },
      { wordId: 15, masteryLevel: 2, correctAnswers: 8, totalAttempts: 10, nextReview: new Date(Date.now() - 1000 * 60 * 25) },
      { wordId: 18, masteryLevel: 1, correctAnswers: 2, totalAttempts: 4, nextReview: new Date(Date.now() - 1000 * 60 * 150) },
      { wordId: 22, masteryLevel: 2, correctAnswers: 6, totalAttempts: 8, nextReview: new Date(Date.now() - 1000 * 60 * 35) },
      { wordId: 25, masteryLevel: 1, correctAnswers: 3, totalAttempts: 5, nextReview: new Date(Date.now() - 1000 * 60 * 100) }
    ];

    sampleProgress.forEach((progress, index) => {
      const id = this.currentProgressId++;
      const wordProgress: UserWordProgress = {
        id,
        userId: 1,
        wordId: progress.wordId,
        masteryLevel: progress.masteryLevel,
        correctAnswers: progress.correctAnswers,
        totalAttempts: progress.totalAttempts,
        isLearned: progress.masteryLevel > 0,
        lastReviewed: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
        nextReview: progress.nextReview,
      };
      this.userWordProgress.set(id, wordProgress);
    });

    // Initialize default achievements
    const defaultAchievements: Achievement[] = [
      { id: 1, name: "First Steps", description: "Complete your first lesson", icon: "fas fa-baby", xpReward: 50, type: "words", requirement: 1 },
      { id: 2, name: "Word Master", description: "Learn 100 words", icon: "fas fa-trophy", xpReward: 200, type: "words", requirement: 100 },
      { id: 3, name: "Week Warrior", description: "Maintain a 7-day streak", icon: "fas fa-fire", xpReward: 150, type: "streak", requirement: 7 },
      { id: 4, name: "Scholar", description: "Reach 1000 XP", icon: "fas fa-graduation-cap", xpReward: 100, type: "xp", requirement: 1000 },
      { id: 5, name: "Dedicated Learner", description: "Complete 10 daily challenges", icon: "fas fa-medal", xpReward: 300, type: "challenge", requirement: 10 },
    ];

    defaultAchievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
      this.currentAchievementId = Math.max(this.currentAchievementId, achievement.id + 1);
    });

    // Initialize sample challenges
    const defaultChallenges: Challenge[] = [
      { id: 1, title: "Daily Word Challenge", description: "Learn 10 new words today", type: "daily", xpReward: 150, requirement: 10, startDate: new Date(), endDate: null, isActive: true },
      { id: 2, title: "Weekly Master", description: "Learn 50 new words this week", type: "weekly", xpReward: 500, requirement: 50, startDate: new Date(), endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), isActive: true },
    ];

    defaultChallenges.forEach(challenge => {
      this.challenges.set(challenge.id, challenge);
      this.currentChallengeId = Math.max(this.currentChallengeId, challenge.id + 1);
    });

    // Initialize comprehensive authentic Quranic vocabulary from verified sources
    const authenticWords: Word[] = AUTHENTIC_QURANIC_VOCABULARY.map((vocabWord, index) => ({
      id: index + 1,
      arabic: vocabWord.arabic,
      transliteration: vocabWord.transliteration,
      meaning: vocabWord.meaning,
      meaningUrdu: vocabWord.meaningUrdu || null,
      frequency: vocabWord.frequency,
      difficulty: vocabWord.difficulty,
      category: vocabWord.category,
      chapter: vocabWord.chapter || 0,
      verse: vocabWord.verse || null,
      rootWord: vocabWord.rootWord || null,
      examples: vocabWord.examples || []
    }));

    authenticWords.forEach(word => {
      this.words.set(word.id, word);
      this.currentWordId = Math.max(this.currentWordId, word.id + 1);
    });

    // Initialize demo user progress for some words
    if (demoUser) {
      // Add some sample progress for the demo user
      const progressEntries = [
        { userId: 1, wordId: 1, masteryLevel: 2, correctAnswers: 8, totalAttempts: 10, lastReviewed: new Date(), nextReview: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), isLearned: true },
        { userId: 1, wordId: 2, masteryLevel: 1, correctAnswers: 3, totalAttempts: 5, lastReviewed: new Date(), nextReview: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), isLearned: false },
        { userId: 1, wordId: 3, masteryLevel: 0, correctAnswers: 1, totalAttempts: 3, lastReviewed: new Date(), nextReview: new Date(), isLearned: false },
      ];

      progressEntries.forEach(progress => {
        const wordProgress: UserWordProgress = {
          id: this.currentProgressId++,
          ...progress,
        };
        this.userWordProgress.set(wordProgress.id, wordProgress);
      });
    }
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = {
      id,
      username: insertUser.username,
      email: insertUser.email,
      password: insertUser.password,
      displayName: insertUser.displayName,
      level: insertUser.level || 1,
      xp: insertUser.xp || 0,
      streakDays: insertUser.streakDays || 0,
      lastActiveDate: insertUser.lastActiveDate || new Date(),
      comprehensionPercentage: insertUser.comprehensionPercentage || 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Word operations
  async getWords(limit = 50, difficulty?: number): Promise<Word[]> {
    let words = Array.from(this.words.values());
    if (difficulty) {
      words = words.filter(word => word.difficulty === difficulty);
    }
    // Return all words if limit is high enough (for content stats)
    if (limit >= 1000) {
      return words;
    }
    return words.slice(0, limit);
  }

  async getWord(id: number): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const id = this.currentWordId++;
    const word: Word = {
      id,
      arabic: insertWord.arabic,
      transliteration: insertWord.transliteration,
      meaning: insertWord.meaning,
      meaningUrdu: insertWord.meaningUrdu || null,
      frequency: insertWord.frequency || 1,
      difficulty: insertWord.difficulty || 1,
      category: insertWord.category || "general",
      chapter: insertWord.chapter || null,
      verse: insertWord.verse || null,
      rootWord: insertWord.rootWord || null,
      examples: Array.isArray(insertWord.examples) ? insertWord.examples as string[] : null,
    };
    this.words.set(id, word);
    return word;
  }

  async getWordsByFrequency(limit: number): Promise<Word[]> {
    return Array.from(this.words.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  // User word progress
  async getUserWordProgress(userId: number, wordId: number): Promise<UserWordProgress | undefined> {
    return Array.from(this.userWordProgress.values())
      .find(progress => progress.userId === userId && progress.wordId === wordId);
  }

  async createUserWordProgress(insertProgress: InsertUserWordProgress): Promise<UserWordProgress> {
    const id = this.currentProgressId++;
    const progress: UserWordProgress = {
      id,
      userId: insertProgress.userId,
      wordId: insertProgress.wordId,
      masteryLevel: insertProgress.masteryLevel || 0,
      correctAnswers: insertProgress.correctAnswers || 0,
      totalAttempts: insertProgress.totalAttempts || 0,
      lastReviewed: new Date(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000), // Next day
      isLearned: insertProgress.isLearned || false,
    };
    this.userWordProgress.set(id, progress);
    return progress;
  }

  async updateUserWordProgress(id: number, updates: Partial<UserWordProgress>): Promise<UserWordProgress | undefined> {
    const progress = this.userWordProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.userWordProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getUserLearnedWords(userId: number): Promise<UserWordProgress[]> {
    return Array.from(this.userWordProgress.values())
      .filter(progress => progress.userId === userId && progress.isLearned);
  }

  async getUserWordsForReview(userId: number): Promise<UserWordProgress[]> {
    const now = new Date();
    return Array.from(this.userWordProgress.values())
      .filter(progress => progress.userId === userId && progress.nextReview && progress.nextReview <= now);
  }

  // Achievements
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const id = this.currentUserAchievementId++;
    const userAchievement: UserAchievement = {
      ...insertUserAchievement,
      id,
      unlockedAt: new Date(),
    };
    this.userAchievements.set(id, userAchievement);
    return userAchievement;
  }

  // Challenges
  async getActiveChallenges(): Promise<Challenge[]> {
    return Array.from(this.challenges.values()).filter(c => c.isActive);
  }

  async getUserChallengeProgress(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    return Array.from(this.userChallengeProgress.values())
      .find(progress => progress.userId === userId && progress.challengeId === challengeId);
  }

  async createUserChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const id = this.currentChallengeProgressId++;
    const progress: UserChallengeProgress = {
      id,
      userId: insertProgress.userId,
      challengeId: insertProgress.challengeId,
      progress: insertProgress.progress || 0,
      isCompleted: insertProgress.isCompleted || false,
      completedAt: insertProgress.completedAt || null,
    };
    this.userChallengeProgress.set(id, progress);
    return progress;
  }

  async updateUserChallengeProgress(id: number, updates: Partial<UserChallengeProgress>): Promise<UserChallengeProgress | undefined> {
    const progress = this.userChallengeProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.userChallengeProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Learning streak
  async getUserLearningStreak(userId: number): Promise<LearningStreak | undefined> {
    return Array.from(this.learningStreaks.values())
      .find(streak => streak.userId === userId);
  }

  async createLearningStreak(insertStreak: InsertLearningStreak): Promise<LearningStreak> {
    const id = this.currentStreakId++;
    const streak: LearningStreak = {
      id,
      userId: insertStreak.userId,
      currentStreak: insertStreak.currentStreak || 0,
      longestStreak: insertStreak.longestStreak || 0,
      lastStreakDate: new Date(),
    };
    this.learningStreaks.set(id, streak);
    return streak;
  }

  async updateLearningStreak(id: number, updates: Partial<LearningStreak>): Promise<LearningStreak | undefined> {
    const streak = this.learningStreaks.get(id);
    if (!streak) return undefined;
    
    const updatedStreak = { ...streak, ...updates };
    this.learningStreaks.set(id, updatedStreak);
    return updatedStreak;
  }

  // Leaderboard
  async getLeaderboard(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  // Family operations
  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const family: Family = {
      id: this.currentFamilyId++,
      name: insertFamily.name,
      inviteCode: insertFamily.inviteCode,
      createdBy: insertFamily.createdBy,
      createdAt: new Date(),
    };
    this.families.set(family.id, family);
    return family;
  }

  async getFamily(id: number): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async getFamilyByInviteCode(inviteCode: string): Promise<Family | undefined> {
    return Array.from(this.families.values())
      .find(family => family.inviteCode === inviteCode);
  }

  async getFamilyMembers(familyId: number): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values())
      .filter(member => member.familyId === familyId);
  }

  async addFamilyMember(insertMember: InsertFamilyMember): Promise<FamilyMember> {
    const member: FamilyMember = {
      id: this.currentFamilyMemberId++,
      familyId: insertMember.familyId,
      userId: insertMember.userId,
      role: insertMember.role || "member",
      nickname: insertMember.nickname || null,
      joinedAt: new Date(),
    };
    this.familyMembers.set(member.id, member);
    return member;
  }

  async updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const member = this.familyMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates };
    this.familyMembers.set(id, updatedMember);
    return updatedMember;
  }

  async getUserFamily(userId: number): Promise<Family | undefined> {
    const membership = Array.from(this.familyMembers.values())
      .find(member => member.userId === userId);
    
    if (!membership) return undefined;
    return this.families.get(membership.familyId);
  }

  // Family challenges
  async createFamilyChallenge(insertChallenge: InsertFamilyChallenge): Promise<FamilyChallenge> {
    const challenge: FamilyChallenge = {
      id: this.currentFamilyChallengeId++,
      familyId: insertChallenge.familyId,
      title: insertChallenge.title,
      description: insertChallenge.description,
      targetProgress: insertChallenge.targetProgress,
      currentProgress: insertChallenge.currentProgress || 0,
      startDate: insertChallenge.startDate || new Date(),
      endDate: insertChallenge.endDate,
      isActive: insertChallenge.isActive !== false,
    };
    this.familyChallenges.set(challenge.id, challenge);
    return challenge;
  }

  async getFamilyChallenges(familyId: number): Promise<FamilyChallenge[]> {
    return Array.from(this.familyChallenges.values())
      .filter(challenge => challenge.familyId === familyId);
  }

  async getFamilyChallengeProgress(challengeId: number, userId: number): Promise<FamilyChallengeProgress | undefined> {
    return Array.from(this.familyChallengeProgress.values())
      .find(progress => progress.challengeId === challengeId && progress.userId === userId);
  }

  async createFamilyChallengeProgress(insertProgress: InsertFamilyChallengeProgress): Promise<FamilyChallengeProgress> {
    const progress: FamilyChallengeProgress = {
      id: this.currentFamilyChallengeProgressId++,
      challengeId: insertProgress.challengeId,
      userId: insertProgress.userId,
      progress: insertProgress.progress || 0,
      completedAt: insertProgress.completedAt || null,
    };
    this.familyChallengeProgress.set(progress.id, progress);
    return progress;
  }

  async updateFamilyChallengeProgress(id: number, updates: Partial<FamilyChallengeProgress>): Promise<FamilyChallengeProgress | undefined> {
    const progress = this.familyChallengeProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    this.familyChallengeProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Daily reminders
  async getUserReminder(userId: number): Promise<DailyReminder | undefined> {
    return Array.from(this.dailyReminders.values())
      .find(reminder => reminder.userId === userId);
  }

  async createReminder(insertReminder: InsertDailyReminder): Promise<DailyReminder> {
    const reminder: DailyReminder = {
      id: this.currentReminderId++,
      userId: insertReminder.userId,
      time: insertReminder.time,
      isActive: insertReminder.isActive !== false,
      message: insertReminder.message || null,
    };
    this.dailyReminders.set(reminder.id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updates: Partial<DailyReminder>): Promise<DailyReminder | undefined> {
    const reminder = this.dailyReminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...updates };
    this.dailyReminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async getRemindersToSend(): Promise<DailyReminder[]> {
    return Array.from(this.dailyReminders.values())
      .filter(reminder => reminder.isActive);
  }
}

export const storage = new MemStorage();
