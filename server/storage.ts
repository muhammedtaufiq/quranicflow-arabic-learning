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

    // Initialize comprehensive Arabic vocabulary database
    const sampleWords: Word[] = [
      // Difficulty 1 - Most Essential Words
      { id: 1, arabic: "اللَّهُ", transliteration: "Allah", meaning: "Allah (God)", frequency: 2697, difficulty: 1, category: "divine", rootWord: "ا ل ه", examples: ["قل هو الله أحد"] },
      { id: 2, arabic: "الْحَمْدُ", transliteration: "al-hamdu", meaning: "praise, thanks", frequency: 100, difficulty: 1, category: "essential", rootWord: "ح م د", examples: ["الحمد لله رب العالمين"] },
      { id: 3, arabic: "لِلَّهِ", transliteration: "lillahi", meaning: "to Allah", frequency: 95, difficulty: 1, category: "essential", rootWord: "ا ل ه", examples: ["الحمد لله"] },
      { id: 4, arabic: "رَبِّ", transliteration: "rabbi", meaning: "Lord, Master", frequency: 90, difficulty: 1, category: "essential", rootWord: "ر ب ب", examples: ["رب العالمين"] },
      { id: 5, arabic: "الرَّحْمَٰنِ", transliteration: "ar-rahman", meaning: "the Most Gracious", frequency: 80, difficulty: 1, category: "attributes", rootWord: "ر ح م", examples: ["بسم الله الرحمن الرحيم"] },
      { id: 6, arabic: "الرَّحِيمِ", transliteration: "ar-raheem", meaning: "the Most Merciful", frequency: 79, difficulty: 1, category: "attributes", rootWord: "ر ح م", examples: ["بسم الله الرحمن الرحيم"] },
      { id: 7, arabic: "فِي", transliteration: "fi", meaning: "in, on", frequency: 1221, difficulty: 1, category: "prepositions", rootWord: "ف ي ي", examples: ["في الأرض"] },
      { id: 8, arabic: "مِن", transliteration: "min", meaning: "from, of", frequency: 1161, difficulty: 1, category: "prepositions", rootWord: "م ن ن", examples: ["من رب العالمين"] },
      { id: 9, arabic: "إِلَىٰ", transliteration: "ila", meaning: "to, towards", frequency: 746, difficulty: 1, category: "prepositions", rootWord: "ا ل ي", examples: ["إلى الله"] },
      { id: 10, arabic: "عَلَىٰ", transliteration: "ala", meaning: "on, upon", frequency: 666, difficulty: 1, category: "prepositions", rootWord: "ع ل ي", examples: ["على كل شيء قدير"] },
      
      // Difficulty 1 continued - Basic particles and pronouns
      { id: 11, arabic: "لَا", transliteration: "la", meaning: "no, not", frequency: 663, difficulty: 1, category: "particles", rootWord: "ل ا ا", examples: ["لا إله إلا الله"] },
      { id: 12, arabic: "مَا", transliteration: "ma", meaning: "what, that which", frequency: 550, difficulty: 1, category: "pronouns", rootWord: "م ا ا", examples: ["ما في السماوات"] },
      { id: 13, arabic: "هُوَ", transliteration: "huwa", meaning: "he, it", frequency: 520, difficulty: 1, category: "pronouns", rootWord: "ه و و", examples: ["قل هو الله أحد"] },
      { id: 14, arabic: "الَّذِي", transliteration: "alladhi", meaning: "who, which", frequency: 450, difficulty: 1, category: "pronouns", rootWord: "ا ل ل", examples: ["الذي خلق"] },
      { id: 15, arabic: "بِسْمِ", transliteration: "bismi", meaning: "in the name of", frequency: 114, difficulty: 1, category: "essential", rootWord: "س م و", examples: ["بسم الله الرحمن الرحيم"] },

      // Difficulty 2 - Common verbs and nouns
      { id: 16, arabic: "كَانَ", transliteration: "kana", meaning: "was, were", frequency: 496, difficulty: 2, category: "verbs", rootWord: "ك و ن", examples: ["وكان الله غفوراً رحيماً"] },
      { id: 17, arabic: "قَالَ", transliteration: "qala", meaning: "said, spoke", frequency: 432, difficulty: 2, category: "verbs", rootWord: "ق و ل", examples: ["قال رب اغفر لي"] },
      { id: 18, arabic: "النَّاسِ", transliteration: "an-nas", meaning: "the people", frequency: 368, difficulty: 2, category: "nouns", rootWord: "ن و س", examples: ["رب الناس"] },
      { id: 19, arabic: "الْعَالَمِينَ", transliteration: "al-alameen", meaning: "the worlds", frequency: 85, difficulty: 2, category: "essential", rootWord: "ع ل م", examples: ["رب العالمين"] },
      { id: 20, arabic: "يَوْمِ", transliteration: "yawmi", meaning: "day", frequency: 320, difficulty: 2, category: "time", rootWord: "ي و م", examples: ["يوم الدين"] },
      
      // Difficulty 2 continued - Important concepts
      { id: 21, arabic: "خَلَقَ", transliteration: "khalaqa", meaning: "created", frequency: 150, difficulty: 2, category: "verbs", rootWord: "خ ل ق", examples: ["الذي خلق الإنسان"] },
      { id: 22, arabic: "الْكِتَابِ", transliteration: "al-kitab", meaning: "the book", frequency: 260, difficulty: 2, category: "nouns", rootWord: "ك ت ب", examples: ["أهل الكتاب"] },
      { id: 23, arabic: "آمَنُوا", transliteration: "amanu", meaning: "believed", frequency: 280, difficulty: 2, category: "verbs", rootWord: "ا م ن", examples: ["الذين آمنوا"] },
      { id: 24, arabic: "الصَّلَاةَ", transliteration: "as-salat", meaning: "the prayer", frequency: 99, difficulty: 2, category: "worship", rootWord: "ص ل و", examples: ["أقيموا الصلاة"] },
      { id: 25, arabic: "الزَّكَاةَ", transliteration: "az-zakat", meaning: "the charity", frequency: 30, difficulty: 2, category: "worship", rootWord: "ز ك و", examples: ["وآتوا الزكاة"] },

      // Difficulty 3 - More complex words
      { id: 26, arabic: "الْمُتَّقِينَ", transliteration: "al-muttaqeen", meaning: "the God-fearing", frequency: 70, difficulty: 3, category: "believers", rootWord: "و ق ي", examples: ["هدى للمتقين"] },
      { id: 27, arabic: "الْغَيْبِ", transliteration: "al-ghayb", meaning: "the unseen", frequency: 60, difficulty: 3, category: "concepts", rootWord: "غ ي ب", examples: ["يؤمنون بالغيب"] },
      { id: 28, arabic: "يُؤْمِنُونَ", transliteration: "yu'minun", meaning: "they believe", frequency: 40, difficulty: 3, category: "verbs", rootWord: "ا م ن", examples: ["يؤمنون بالغيب"] },
      { id: 29, arabic: "يُقِيمُونَ", transliteration: "yuqeemun", meaning: "they establish", frequency: 30, difficulty: 3, category: "verbs", rootWord: "ق و م", examples: ["ويقيمون الصلاة"] },
      { id: 30, arabic: "يُنفِقُونَ", transliteration: "yunfiqun", meaning: "they spend", frequency: 25, difficulty: 3, category: "verbs", rootWord: "ن ف ق", examples: ["ومما رزقناهم ينفقون"] },

      // Difficulty 3 continued
      { id: 31, arabic: "رَزَقْنَاهُمْ", transliteration: "razaqnahum", meaning: "We provided them", frequency: 20, difficulty: 3, category: "verbs", rootWord: "ر ز ق", examples: ["ومما رزقناهم ينفقون"] },
      { id: 32, arabic: "أُنزِلَ", transliteration: "unzila", meaning: "was revealed", frequency: 35, difficulty: 3, category: "verbs", rootWord: "ن ز ل", examples: ["وما أنزل إليك"] },
      { id: 33, arabic: "الْآخِرَةِ", transliteration: "al-akhirah", meaning: "the hereafter", frequency: 115, difficulty: 3, category: "concepts", rootWord: "ا خ ر", examples: ["وبالآخرة هم يوقنون"] },
      { id: 34, arabic: "يُوقِنُونَ", transliteration: "yuqinun", meaning: "they are certain", frequency: 15, difficulty: 3, category: "verbs", rootWord: "ي ق ن", examples: ["وبالآخرة هم يوقنون"] },
      { id: 35, arabic: "هُدًى", transliteration: "hudan", meaning: "guidance", frequency: 80, difficulty: 3, category: "concepts", rootWord: "ه د ي", examples: ["هدى للمتقين"] },

      // Difficulty 4 - Advanced vocabulary
      { id: 36, arabic: "الْمُفْلِحُونَ", transliteration: "al-muflihun", meaning: "the successful", frequency: 40, difficulty: 4, category: "believers", rootWord: "ف ل ح", examples: ["أولئك هم المفلحون"] },
      { id: 37, arabic: "يُخَادِعُونَ", transliteration: "yukhadiun", meaning: "they deceive", frequency: 5, difficulty: 4, category: "verbs", rootWord: "خ د ع", examples: ["يخادعون الله"] },
      { id: 38, arabic: "الْمُنَافِقِينَ", transliteration: "al-munafiqeen", meaning: "the hypocrites", frequency: 30, difficulty: 4, category: "people", rootWord: "ن ف ق", examples: ["ومن الناس من يقول آمنا"] },
      { id: 39, arabic: "يَشْعُرُونَ", transliteration: "yash'urun", meaning: "they perceive", frequency: 15, difficulty: 4, category: "verbs", rootWord: "ش ع ر", examples: ["وما يشعرون"] },
      { id: 40, arabic: "مَرَضٌ", transliteration: "maradun", meaning: "disease", frequency: 20, difficulty: 4, category: "concepts", rootWord: "م ر ض", examples: ["في قلوبهم مرض"] },

      // Difficulty 5 - Most advanced
      { id: 41, arabic: "يَسْتَهْزِئُونَ", transliteration: "yastahziun", meaning: "they mock", frequency: 8, difficulty: 5, category: "verbs", rootWord: "ه ز ا", examples: ["الله يستهزئ بهم"] },
      { id: 42, arabic: "طُغْيَانِهِمْ", transliteration: "tughyanihim", meaning: "their transgression", frequency: 10, difficulty: 5, category: "concepts", rootWord: "ط غ ي", examples: ["في طغيانهم يعمهون"] },
      { id: 43, arabic: "يَعْمَهُونَ", transliteration: "ya'mahun", meaning: "they wander blindly", frequency: 6, difficulty: 5, category: "verbs", rootWord: "ع م ه", examples: ["في طغيانهم يعمهون"] },
      { id: 44, arabic: "اشْتَرَوُا", transliteration: "ishtaraw", meaning: "they bought", frequency: 12, difficulty: 5, category: "verbs", rootWord: "ش ر ي", examples: ["اشتروا الضلالة بالهدى"] },
      { id: 45, arabic: "الضَّلَالَةَ", transliteration: "ad-dalalah", meaning: "misguidance", frequency: 25, difficulty: 5, category: "concepts", rootWord: "ض ل ل", examples: ["اشتروا الضلالة بالهدى"] }
    ];

    sampleWords.forEach(word => {
      this.words.set(word.id, word);
      this.currentWordId = Math.max(this.currentWordId, word.id + 1);
    });
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
      lastActiveDate: new Date(),
      comprehensionPercentage: insertUser.comprehensionPercentage || 0,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    
    // Initialize learning streak
    await this.createLearningStreak({ userId: id, currentStreak: 0, longestStreak: 0 });
    
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
      frequency: insertWord.frequency || 1,
      difficulty: insertWord.difficulty || 1,
      category: insertWord.category || "general",
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
    return Array.from(this.challenges.values()).filter(challenge => challenge.isActive);
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
      completedAt: null,
    };
    this.userChallengeProgress.set(id, progress);
    return progress;
  }

  async updateUserChallengeProgress(id: number, updates: Partial<UserChallengeProgress>): Promise<UserChallengeProgress | undefined> {
    const progress = this.userChallengeProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates };
    if (updates.isCompleted && !progress.isCompleted) {
      updatedProgress.completedAt = new Date();
    }
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
      ...insertFamily,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.families.set(family.id, family);
    return family;
  }

  async getFamily(id: number): Promise<Family | undefined> {
    return this.families.get(id);
  }

  async getFamilyByInviteCode(inviteCode: string): Promise<Family | undefined> {
    return Array.from(this.families.values()).find(f => f.inviteCode === inviteCode);
  }

  async getFamilyMembers(familyId: number): Promise<FamilyMember[]> {
    return Array.from(this.familyMembers.values()).filter(m => m.familyId === familyId);
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
    const membership = Array.from(this.familyMembers.values()).find(m => m.userId === userId);
    if (!membership) return undefined;
    return this.families.get(membership.familyId);
  }

  // Family challenges
  async createFamilyChallenge(insertChallenge: InsertFamilyChallenge): Promise<FamilyChallenge> {
    const challenge: FamilyChallenge = {
      id: this.currentFamilyChallengeId++,
      familyId: insertChallenge.familyId,
      title: insertChallenge.title,
      description: insertChallenge.description || null,
      targetType: insertChallenge.targetType,
      targetValue: insertChallenge.targetValue,
      xpReward: insertChallenge.xpReward || 0,
      startDate: insertChallenge.startDate,
      endDate: insertChallenge.endDate,
      isActive: insertChallenge.isActive ?? true,
      createdAt: new Date(),
    };
    this.familyChallenges.set(challenge.id, challenge);
    return challenge;
  }

  async getFamilyChallenges(familyId: number): Promise<FamilyChallenge[]> {
    return Array.from(this.familyChallenges.values()).filter(c => c.familyId === familyId);
  }

  async getFamilyChallengeProgress(challengeId: number, userId: number): Promise<FamilyChallengeProgress | undefined> {
    return Array.from(this.familyChallengeProgress.values())
      .find(p => p.challengeId === challengeId && p.userId === userId);
  }

  async createFamilyChallengeProgress(insertProgress: InsertFamilyChallengeProgress): Promise<FamilyChallengeProgress> {
    const progress: FamilyChallengeProgress = {
      id: this.currentFamilyChallengeProgressId++,
      challengeId: insertProgress.challengeId,
      userId: insertProgress.userId,
      currentProgress: insertProgress.currentProgress || 0,
      isCompleted: insertProgress.isCompleted || false,
      completedAt: null,
      updatedAt: new Date(),
    };
    this.familyChallengeProgress.set(progress.id, progress);
    return progress;
  }

  async updateFamilyChallengeProgress(id: number, updates: Partial<FamilyChallengeProgress>): Promise<FamilyChallengeProgress | undefined> {
    const progress = this.familyChallengeProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { 
      ...progress, 
      ...updates,
      updatedAt: new Date(),
      ...(updates.isCompleted && { completedAt: new Date() })
    };
    this.familyChallengeProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Daily reminders
  async getUserReminder(userId: number): Promise<DailyReminder | undefined> {
    return Array.from(this.dailyReminders.values()).find(r => r.userId === userId);
  }

  async createReminder(insertReminder: InsertDailyReminder): Promise<DailyReminder> {
    const reminder: DailyReminder = {
      id: this.currentReminderId++,
      userId: insertReminder.userId,
      reminderTime: insertReminder.reminderTime,
      isEnabled: insertReminder.isEnabled ?? true,
      timezone: insertReminder.timezone || "UTC",
      lastSentAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.dailyReminders.set(reminder.id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updates: Partial<DailyReminder>): Promise<DailyReminder | undefined> {
    const reminder = this.dailyReminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { 
      ...reminder, 
      ...updates,
      updatedAt: new Date(),
    };
    this.dailyReminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async getRemindersToSend(): Promise<DailyReminder[]> {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    return Array.from(this.dailyReminders.values())
      .filter(r => r.isEnabled && r.reminderTime === currentTime && 
        (!r.lastSentAt || r.lastSentAt.toDateString() !== now.toDateString()));
  }
}

export const storage = new MemStorage();
