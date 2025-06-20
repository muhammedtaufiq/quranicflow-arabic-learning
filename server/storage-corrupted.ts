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

    // AUTHENTIC QURANIC VOCABULARY - Verified from Authoritative Sources
    // Sources: Lane's Arabic-English Lexicon, Hans Wehr Dictionary, Lisan al-Arab
    // Al-Mufradat fi Gharib al-Quran by Raghib al-Isfahani
    // Cross-referenced: Sahih International, Pickthall, Yusuf Ali translations
    const sampleWords: Word[] = [
      // Al-Fatiha - Verified translations from classical lexicons
      { id: 1, arabic: "اللَّهُ", transliteration: "Allah", meaning: "Allah - The proper name of God in Arabic, derived from al-ilah (The God)", meaningUrdu: "اللہ - خدا کا اصل نام، العرف سے ماخوذ", frequency: 2697, difficulty: 1, category: "divine", chapter: 1, verse: 1, rootWord: "ا ل ه", examples: ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"] },
      { id: 2, arabic: "الْحَمْدُ", transliteration: "al-hamdu", meaning: "All praise and thanks - Complete acknowledgment of excellence (Lane's Lexicon)", meaningUrdu: "تمام تعریف اور شکر - کمال کی مکمل تسلیم", frequency: 100, difficulty: 1, category: "essential", chapter: 1, verse: 2, rootWord: "ح م د", examples: ["الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ"] },
      { id: 3, arabic: "رَبِّ", transliteration: "rabbi", meaning: "Lord and Sustainer - One who nourishes and maintains creation (Lisan al-Arab)", meaningUrdu: "رب اور پالنے والا - جو تخلیق کو پالتا اور سنبھالتا ہے", frequency: 967, difficulty: 1, category: "essential", chapter: 1, verse: 2, rootWord: "ر ب ب", examples: ["رَبِّ الْعَالَمِينَ"] },
      { id: 4, arabic: "الْعَالَمِينَ", transliteration: "al-'aalameen", meaning: "All the worlds/realms - Everything that exists besides Allah (Classical commentaries)", meaningUrdu: "تمام جہان - اللہ کے علاوہ جو کچھ موجود ہے", frequency: 73, difficulty: 2, category: "creation", chapter: 1, verse: 2, rootWord: "ع ل م", examples: ["رَبِّ الْعَالَمِينَ"] },
      { id: 5, arabic: "الرَّحْمَٰنِ", transliteration: "ar-Rahmaan", meaning: "The Most Gracious - Divine attribute emphasizing boundless mercy to all creation (Al-Mufradat)", meaningUrdu: "رحمٰن - تمام مخلوق پر بے حد رحم کرنے والا", frequency: 169, difficulty: 1, category: "attributes", chapter: 1, verse: 3, rootWord: "ر ح م", examples: ["الرَّحْمَٰنِ الرَّحِيمِ"] },
      { id: 6, arabic: "الرَّحِيمِ", transliteration: "ar-Raheem", meaning: "The Most Merciful - Divine attribute emphasizing specific mercy to believers (Al-Mufradat)", meaningUrdu: "رحیم - مومنوں پر خاص رحم کرنے والا", frequency: 113, difficulty: 1, category: "attributes", chapter: 1, verse: 3, rootWord: "ر ح م", examples: ["الرَّحْمَٰنِ الرَّحِيمِ"] },
      { id: 7, arabic: "مَالِكِ", transliteration: "maaliki", meaning: "Master and Sovereign - One who has absolute authority and ownership (Lane's Lexicon)", meaningUrdu: "مالک اور بادشاہ - مطلق اختیار رکھنے والا", frequency: 35, difficulty: 2, category: "authority", chapter: 1, verse: 4, rootWord: "م ل ك", examples: ["مَالِكِ يَوْمِ الدِّينِ"] },
      { id: 8, arabic: "يَوْمِ", transliteration: "yawmi", meaning: "Day - Period of time, specifically the Day of Judgment (Classical dictionaries)", meaningUrdu: "دن - وقت کا حصہ، خاص طور پر قیامت کا دن", frequency: 405, difficulty: 1, category: "time", chapter: 1, verse: 4, rootWord: "ي و م", examples: ["يَوْمِ الدِّينِ"] },
      { id: 9, arabic: "الدِّينِ", transliteration: "ad-deen", meaning: "Religion/Judgment - System of life and divine recompense (Al-Mufradat)", meaningUrdu: "دین/انصاف - زندگی کا نظام اور الہی بدلہ", frequency: 92, difficulty: 2, category: "concept", chapter: 1, verse: 4, rootWord: "د ي ن", examples: ["يَوْمِ الدِّينِ"] },
      { id: 10, arabic: "إِيَّاكَ", transliteration: "iyyaaka", meaning: "You alone - Emphatic pronoun showing exclusivity in worship (Arabic grammar)", meaningUrdu: "صرف آپ - عبادت میں انحصار ظاہر کرنے والا ضمیر", frequency: 5, difficulty: 3, category: "pronoun", chapter: 1, verse: 5, rootWord: "ا ي ي", examples: ["إِيَّاكَ نَعْبُدُ"] },
      
      // Ya-Sin (Chapter 36) - Popular chapter
      { id: 11, arabic: "يس", transliteration: "Ya-Sin", meaning: "Ya-Sin", meaningUrdu: null, frequency: 1, difficulty: 2, category: "letters", chapter: 36, verse: 1, rootWord: "ي س", examples: ["يس"] },
      { id: 12, arabic: "وَالْقُرْآنِ", transliteration: "wal-Quran", meaning: "and the Quran", meaningUrdu: null, frequency: 35, difficulty: 2, category: "scripture", chapter: 36, verse: 2, rootWord: "ق ر ا", examples: ["والقرآن الحكيم"] },
      { id: 13, arabic: "الْحَكِيمِ", transliteration: "al-hakeem", meaning: "the Wise", meaningUrdu: null, frequency: 97, difficulty: 2, category: "attributes", chapter: 36, verse: 2, rootWord: "ح ك م", examples: ["والقرآن الحكيم"] },
      
      // Al-Ikhlas (Chapter 112) - Verified from classical sources
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 332, difficulty: 1, category: "command", chapter: 112, verse: 1, rootWord: "ق و ل", examples: ["قُلْ هُوَ اللَّهُ أَحَدٌ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1508, difficulty: 1, category: "pronoun", chapter: 112, verse: 1, rootWord: "ه و", examples: ["هُوَ اللَّهُ أَحَدٌ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 25, difficulty: 2, category: "number", chapter: 112, verse: 1, rootWord: "ا ح د", examples: ["اللَّهُ أَحَدٌ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "attributes", chapter: 112, verse: 2, rootWord: "ص م د", examples: ["اللَّهُ الصَّمَدُ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 272, difficulty: 2, category: "particles", chapter: 112, verse: 3, rootWord: "ل م", examples: ["لَمْ يَلِدْ وَلَمْ يُولَدْ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 13, difficulty: 3, category: "verbs", chapter: 112, verse: 3, rootWord: "و ل د", examples: ["لَمْ يَلِدْ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 45, difficulty: 2, category: "particles", chapter: 112, verse: 3, rootWord: "و ل م", examples: ["وَلَمْ يُولَدْ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 3, category: "verbs", chapter: 112, verse: 3, rootWord: "و ل د", examples: ["وَلَمْ يُولَدْ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 280, difficulty: 2, category: "verbs", chapter: 112, verse: 4, rootWord: "ك و ن", examples: ["وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1290, difficulty: 1, category: "pronouns", chapter: 112, verse: 4, rootWord: "ل ه", examples: ["وَلَمْ يَكُن لَّهُ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 112, verse: 4, rootWord: "ك ف و", examples: ["كُفُوًا أَحَدٌ"] },

      // Al-Falaq (Chapter 113) - Verified from classical sources
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 3, category: "worship", chapter: 113, verse: 1, rootWord: "ع و ذ", examples: ["قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 24, difficulty: 2, category: "worship", chapter: 113, verse: 1, rootWord: "ب ر ب", examples: ["أَعُوذُ بِرَبِّ الْفَلَقِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "nature", chapter: 113, verse: 1, rootWord: "ف ل ق", examples: ["بِرَبِّ الْفَلَقِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1161, difficulty: 1, category: "prepositions", chapter: 113, verse: 2, rootWord: "م ن", examples: ["مِن شَرِّ مَا خَلَقَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 58, difficulty: 2, category: "concepts", chapter: 113, verse: 2, rootWord: "ش ر ر", examples: ["مِن شَرِّ مَا خَلَقَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2026, difficulty: 1, category: "pronouns", chapter: 113, verse: 2, rootWord: "م ا", examples: ["مَا خَلَقَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 150, difficulty: 2, category: "verbs", chapter: 113, verse: 2, rootWord: "خ ل ق", examples: ["مَا خَلَقَ"] },

      // An-Nas (Chapter 114) - Verified from classical sources
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 241, difficulty: 1, category: "people", chapter: 114, verse: 1, rootWord: "ن و س", examples: ["بِرَبِّ النَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 28, difficulty: 2, category: "authority", chapter: 114, verse: 2, rootWord: "م ل ك", examples: ["مَلِكِ النَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 143, difficulty: 2, category: "divine", chapter: 114, verse: 3, rootWord: "ا ل ه", examples: ["إِلَٰهِ النَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "evil", chapter: 114, verse: 4, rootWord: "و س و س", examples: ["الْوَسْوَاسِ الْخَنَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "evil", chapter: 114, verse: 4, rootWord: "خ ن س", examples: ["الْوَسْوَاسِ الْخَنَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "verbs", chapter: 114, verse: 5, rootWord: "و س و س", examples: ["الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1221, difficulty: 1, category: "prepositions", chapter: 114, verse: 5, rootWord: "ف ي", examples: ["فِي صُدُورِ النَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 45, difficulty: 2, category: "body", chapter: 114, verse: 5, rootWord: "ص د ر", examples: ["فِي صُدُورِ النَّاسِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 22, difficulty: 3, category: "beings", chapter: 114, verse: 6, rootWord: "ج ن ن", examples: ["مِنَ الْجِنَّةِ وَالنَّاسِ"] },
      
      // Al-Baqarah (Chapter 2) - Verified from classical sources
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 2, category: "letters", chapter: 2, verse: 1, rootWord: "ا ل م", examples: ["الم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 514, difficulty: 1, category: "pronouns", chapter: 2, verse: 2, rootWord: "ذ ل ك", examples: ["ذَٰلِكَ الْكِتَابُ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 230, difficulty: 1, category: "scripture", chapter: 2, verse: 2, rootWord: "ك ت ب", examples: ["ذَٰلِكَ الْكِتَابُ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 663, difficulty: 1, category: "particles", chapter: 2, verse: 2, rootWord: "ل ا", examples: ["لَا رَيْبَ فِيهِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 25, difficulty: 2, category: "concepts", chapter: 2, verse: 2, rootWord: "ر ي ب", examples: ["لَا رَيْبَ فِيهِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 289, difficulty: 2, category: "pronouns", chapter: 2, verse: 2, rootWord: "ف ي ه", examples: ["لَا رَيْبَ فِيهِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 79, difficulty: 2, category: "concepts", chapter: 2, verse: 2, rootWord: "ه د ي", examples: ["هُدًى لِّلْمُتَّقِينَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 63, difficulty: 3, category: "believers", chapter: 2, verse: 2, rootWord: "و ق ي", examples: ["هُدًى لِّلْمُتَّقِينَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1052, difficulty: 1, category: "pronouns", chapter: 2, verse: 3, rootWord: "ا ل ل", examples: ["الَّذِينَ يُؤْمِنُونَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 284, difficulty: 2, category: "verbs", chapter: 2, verse: 3, rootWord: "ا م ن", examples: ["يُؤْمِنُونَ بِالْغَيْبِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 60, difficulty: 3, category: "concepts", chapter: 2, verse: 3, rootWord: "غ ي ب", examples: ["يُؤْمِنُونَ بِالْغَيْبِ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 30, difficulty: 3, category: "verbs", chapter: 2, verse: 3, rootWord: "ق و م", examples: ["وَيُقِيمُونَ الصَّلَاةَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 99, difficulty: 2, category: "worship", chapter: 2, verse: 3, rootWord: "ص ل و", examples: ["يُقِيمُونَ الصَّلَاةَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 68, difficulty: 2, category: "prepositions", chapter: 2, verse: 3, rootWord: "و م ن", examples: ["وَمِمَّا رَزَقْنَاهُمْ يُنفِقُونَ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 20, difficulty: 3, category: "verbs", chapter: 2, verse: 3, rootWord: "ر ز ق", examples: ["مِمَّا رَزَقْنَاهُمْ"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 73, difficulty: 3, category: "verbs", chapter: 2, verse: 3, rootWord: "ن ف ق", examples: ["يُنفِقُونَ"] },
      
      // Al-Mulk (Chapter 67) - Popular chapter for memorization
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 10, difficulty: 3, category: "praise", chapter: 67, verse: 1, rootWord: "ب ر ك", examples: ["تبارك الذي"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1464, difficulty: 1, category: "pronouns", chapter: 67, verse: 1, rootWord: "ا ل ت", examples: ["الذي بيده الملك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 12, difficulty: 2, category: "possession", chapter: 67, verse: 1, rootWord: "ي د", examples: ["بيده الملك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 48, difficulty: 2, category: "authority", chapter: 67, verse: 1, rootWord: "م ل ك", examples: ["بيده الملك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 285, difficulty: 1, category: "pronouns", chapter: 67, verse: 1, rootWord: "و ه و", examples: ["وهو على كل شيء قدير"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 666, difficulty: 1, category: "prepositions", chapter: 67, verse: 1, rootWord: "ع ل ي", examples: ["على كل شيء"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 373, difficulty: 1, category: "quantifiers", chapter: 67, verse: 1, rootWord: "ك ل ل", examples: ["كل شيء"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 518, difficulty: 2, category: "nouns", chapter: 67, verse: 1, rootWord: "ش ي ا", examples: ["كل شيء"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 45, difficulty: 2, category: "attributes", chapter: 67, verse: 1, rootWord: "ق د ر", examples: ["قدير"] },
      
      // Al-Kahf (Chapter 18) - Popular chapter  
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 38, difficulty: 2, category: "praise", chapter: 18, verse: 1, rootWord: "ح م د", examples: ["الحمد لله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 88, difficulty: 2, category: "verbs", chapter: 18, verse: 1, rootWord: "ن ز ل", examples: ["الذي أنزل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 40, difficulty: 2, category: "relationship", chapter: 18, verse: 1, rootWord: "ع ب د", examples: ["على عبده"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 45, difficulty: 2, category: "particles", chapter: 18, verse: 1, rootWord: "و ل م", examples: ["ولم يجعل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 353, difficulty: 2, category: "verbs", chapter: 18, verse: 1, rootWord: "ج ع ل", examples: ["لم يجعل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 4, category: "attributes", chapter: 18, verse: 1, rootWord: "ع و ج", examples: ["له عوجا"] },
      
      // High-frequency words across multiple chapters
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1072, difficulty: 1, category: "particles", chapter: null, verse: null, rootWord: "ا ن ن", examples: ["إن الله غفور رحيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1358, difficulty: 1, category: "verbs", chapter: null, verse: null, rootWord: "ك و ن", examples: ["كان الله غفورا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 528, difficulty: 1, category: "verbs", chapter: null, verse: null, rootWord: "ق و ل", examples: ["قال موسى"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 671, difficulty: 1, category: "particles", chapter: null, verse: null, rootWord: "ا ل ل", examples: ["لا إله إلا الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 120, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ب ع د", examples: ["من بعد"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 83, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ق ب ل", examples: ["من قبل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 75, difficulty: 2, category: "prepositions", chapter: null, verse: null, rootWord: "ع ن د", examples: ["عند الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 91, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "غ ف ر", examples: ["الله غفور"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 114, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ر ح م", examples: ["غفور رحيم"] },
      
      // Ayat al-Kursi (Chapter 2, Verse 255) - Most famous verse
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 5, difficulty: 3, category: "attributes", chapter: 2, verse: 255, rootWord: "ح ي ي", examples: ["الله الحي القيوم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 4, category: "attributes", chapter: 2, verse: 255, rootWord: "ق و م", examples: ["الحي القيوم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "verbs", chapter: 2, verse: 255, rootWord: "ا خ ذ", examples: ["لا تأخذه سنة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "states", chapter: 2, verse: 255, rootWord: "س ن ه", examples: ["لا تأخذه سنة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 3, category: "states", chapter: 2, verse: 255, rootWord: "ن و م", examples: ["ولا نوم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 190, difficulty: 2, category: "creation", chapter: 2, verse: 255, rootWord: "س م و", examples: ["ما في السماوات"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 461, difficulty: 1, category: "creation", chapter: 2, verse: 255, rootWord: "ا ر ض", examples: ["وما في الأرض"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 4, difficulty: 4, category: "verbs", chapter: 2, verse: 255, rootWord: "ش ف ع", examples: ["من ذا الذي يشفع"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 11, difficulty: 3, category: "permission", chapter: 2, verse: 255, rootWord: "ا ذ ن", examples: ["إلا بإذنه"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 87, difficulty: 2, category: "verbs", chapter: 2, verse: 255, rootWord: "ع ل م", examples: ["يعلم ما بين أيديهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 25, difficulty: 2, category: "body", chapter: 2, verse: 255, rootWord: "ي د ي", examples: ["بين أيديهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 20, difficulty: 3, category: "directions", chapter: 2, verse: 255, rootWord: "خ ل ف", examples: ["وما خلفهم"] },
      
      // Al-Anfal (Chapter 8) - Important chapter
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 15, difficulty: 3, category: "verbs", chapter: 8, verse: 1, rootWord: "س ا ل", examples: ["يسألونك عن الأنفال"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 5, difficulty: 4, category: "concepts", chapter: 8, verse: 1, rootWord: "ن ف ل", examples: ["عن الأنفال"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 142, difficulty: 1, category: "essential", chapter: 8, verse: 1, rootWord: "ل ل ه", examples: ["الأنفال لله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 40, difficulty: 2, category: "messengers", chapter: 8, verse: 1, rootWord: "ر س ل", examples: ["لله والرسول"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 36, difficulty: 3, category: "verbs", chapter: 8, verse: 1, rootWord: "و ق ي", examples: ["فاتقوا الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 4, category: "verbs", chapter: 8, verse: 1, rootWord: "ص ل ح", examples: ["وأصلحوا ذات بينكم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 15, difficulty: 3, category: "pronouns", chapter: 8, verse: 1, rootWord: "ذ و ت", examples: ["ذات بينكم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 55, difficulty: 2, category: "relationships", chapter: 8, verse: 1, rootWord: "ب ي ن", examples: ["ذات بينكم"] },
      
      // Surah Ya-Sin (Chapter 36) - Heart of the Quran
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 13, difficulty: 3, category: "verbs", chapter: 36, verse: 6, rootWord: "ن ذ ر", examples: ["لتنذر قوما"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 383, difficulty: 1, category: "people", chapter: 36, verse: 6, rootWord: "ق و م", examples: ["قوما ما أنذر آباؤهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 22, difficulty: 2, category: "family", chapter: 36, verse: 6, rootWord: "ا ب و", examples: ["ما أنذر آباؤهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 17, difficulty: 3, category: "states", chapter: 36, verse: 6, rootWord: "غ ف ل", examples: ["فهم غافلون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 247, difficulty: 2, category: "verbs", chapter: 36, verse: 7, rootWord: "ح ق ق", examples: ["لقد حق القول"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 53, difficulty: 2, category: "speech", chapter: 36, verse: 7, rootWord: "ق و ل", examples: ["حق القول"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 55, difficulty: 2, category: "quantifiers", chapter: 36, verse: 7, rootWord: "ك ث ر", examples: ["على أكثرهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 284, difficulty: 2, category: "verbs", chapter: 36, verse: 7, rootWord: "ا م ن", examples: ["فهم لا يؤمنون"] },
      
      // Al-Waqiah (Chapter 56) - The Inevitable
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 342, difficulty: 1, category: "time", chapter: 56, verse: 1, rootWord: "ا ذ ا", examples: ["إذا وقعت الواقعة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 22, difficulty: 3, category: "verbs", chapter: 56, verse: 1, rootWord: "و ق ع", examples: ["وقعت الواقعة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 4, category: "eschatology", chapter: 56, verse: 1, rootWord: "و ق ع", examples: ["الواقعة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 97, difficulty: 2, category: "particles", chapter: 56, verse: 2, rootWord: "ل ي س", examples: ["ليس لوقعتها كاذبة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "events", chapter: 56, verse: 2, rootWord: "و ق ع", examples: ["ليس لوقعتها"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 3, category: "attributes", chapter: 56, verse: 2, rootWord: "ك ذ ب", examples: ["كاذبة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 56, verse: 3, rootWord: "خ ف ض", examples: ["خافضة رافعة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 56, verse: 3, rootWord: "ر ف ع", examples: ["خافضة رافعة"] },
      
      // Al-Rahman (Chapter 55) - The Most Merciful
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 41, difficulty: 2, category: "verbs", chapter: 55, verse: 2, rootWord: "ع ل م", examples: ["علم القرآن"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 70, difficulty: 1, category: "scripture", chapter: 55, verse: 2, rootWord: "ق ر ا", examples: ["علم القرآن"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 150, difficulty: 2, category: "verbs", chapter: 55, verse: 3, rootWord: "خ ل ق", examples: ["خلق الإنسان"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 65, difficulty: 2, category: "people", chapter: 55, verse: 3, rootWord: "ا ن س", examples: ["خلق الإنسان"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 3, category: "verbs", chapter: 55, verse: 4, rootWord: "ع ل م", examples: ["علمه البيان"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 26, difficulty: 3, category: "communication", chapter: 55, verse: 4, rootWord: "ب ي ن", examples: ["علمه البيان"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 33, difficulty: 2, category: "celestial", chapter: 55, verse: 5, rootWord: "ش م س", examples: ["الشمس والقمر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 27, difficulty: 2, category: "celestial", chapter: 55, verse: 5, rootWord: "ق م ر", examples: ["الشمس والقمر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "measurement", chapter: 55, verse: 5, rootWord: "ح س ب", examples: ["بحسبان"] },
      
      // Al-Mulk continued (Chapter 67)
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 150, difficulty: 2, category: "verbs", chapter: 67, verse: 2, rootWord: "خ ل ق", examples: ["الذي خلق الموت"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 164, difficulty: 2, category: "concepts", chapter: 67, verse: 2, rootWord: "م و ت", examples: ["خلق الموت والحياة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 71, difficulty: 2, category: "concepts", chapter: 67, verse: 2, rootWord: "ح ي و", examples: ["الموت والحياة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 4, category: "verbs", chapter: 67, verse: 2, rootWord: "ب ل و", examples: ["ليبلوكم أيكم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 12, difficulty: 3, category: "pronouns", chapter: 67, verse: 2, rootWord: "ا ي ي", examples: ["أيكم أحسن عملا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 66, difficulty: 2, category: "attributes", chapter: 67, verse: 2, rootWord: "ح س ن", examples: ["أحسن عملا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 109, difficulty: 2, category: "actions", chapter: 67, verse: 2, rootWord: "ع م ل", examples: ["أحسن عملا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 92, difficulty: 2, category: "attributes", chapter: 67, verse: 2, rootWord: "ع ز ز", examples: ["وهو العزيز"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 91, difficulty: 2, category: "attributes", chapter: 67, verse: 2, rootWord: "غ ف ر", examples: ["العزيز الغفور"] },
      
      // Common pronouns and particles (high frequency across all chapters)
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1161, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "م ن", examples: ["من الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1508, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ا ل ي", examples: ["إلى الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 104, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ع ن", examples: ["عن الصراط"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 76, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "م ع", examples: ["مع الصابرين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 131, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ا م", examples: ["أم يحسبون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 129, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ل ع ل", examples: ["لعلكم تتقون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 70, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ك ي", examples: ["كي لا تحزنوا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 176, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ل و", examples: ["لو شاء الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1572, difficulty: 1, category: "particles", chapter: null, verse: null, rootWord: "ا ن", examples: ["إن شاء الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 298, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ك و ن", examples: ["إن كنتم مؤمنين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 231, difficulty: 2, category: "believers", chapter: null, verse: null, rootWord: "ا م ن", examples: ["كنتم مؤمنين"] },
      
      // Al-Asr (Chapter 103) - Very important short chapter
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "time", chapter: 103, verse: 1, rootWord: "ع ص ر", examples: ["والعصر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 65, difficulty: 2, category: "people", chapter: 103, verse: 2, rootWord: "ا ن س", examples: ["إن الإنسان"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 89, difficulty: 2, category: "particles", chapter: 103, verse: 2, rootWord: "ل ف ي", examples: ["لفي خسر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 12, difficulty: 3, category: "concepts", chapter: 103, verse: 2, rootWord: "خ س ر", examples: ["لفي خسر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 262, difficulty: 2, category: "verbs", chapter: 103, verse: 3, rootWord: "ا م ن", examples: ["الذين آمنوا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 176, difficulty: 2, category: "verbs", chapter: 103, verse: 3, rootWord: "ع م ل", examples: ["وعملوا الصالحات"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 63, difficulty: 3, category: "actions", chapter: 103, verse: 3, rootWord: "ص ل ح", examples: ["الصالحات"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "verbs", chapter: 103, verse: 3, rootWord: "و ص ي", examples: ["وتواصوا بالحق"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 247, difficulty: 2, category: "concepts", chapter: 103, verse: 3, rootWord: "ح ق ق", examples: ["تواصوا بالحق"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "verbs", chapter: 103, verse: 3, rootWord: "و ص ي", examples: ["وتواصوا بالصبر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 102, difficulty: 2, category: "virtues", chapter: 103, verse: 3, rootWord: "ص ب ر", examples: ["تواصوا بالصبر"] },
      
      // At-Takathur (Chapter 102) - Competition in increase
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "verbs", chapter: 102, verse: 1, rootWord: "ل ه و", examples: ["ألهاكم التكاثر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "concepts", chapter: 102, verse: 1, rootWord: "ك ث ر", examples: ["ألهاكم التكاثر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 133, difficulty: 2, category: "particles", chapter: 102, verse: 2, rootWord: "ح ت ي", examples: ["حتى زرتم المقابر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 4, difficulty: 3, category: "verbs", chapter: 102, verse: 2, rootWord: "ز و ر", examples: ["زرتم المقابر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "places", chapter: 102, verse: 2, rootWord: "ق ب ر", examples: ["زرتم المقابر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 33, difficulty: 2, category: "particles", chapter: 102, verse: 3, rootWord: "ك ل ل", examples: ["كلا سوف تعلمون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 58, difficulty: 2, category: "time", chapter: 102, verse: 3, rootWord: "س و ف", examples: ["سوف تعلمون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 87, difficulty: 2, category: "verbs", chapter: 102, verse: 3, rootWord: "ع ل م", examples: ["سوف تعلمون"] },
      
      // Al-Qari'ah (Chapter 101) - The Striking Hour
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 4, category: "eschatology", chapter: 101, verse: 1, rootWord: "ق ر ع", examples: ["القارعة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 13, difficulty: 3, category: "verbs", chapter: 101, verse: 3, rootWord: "د ر ك", examples: ["وما أدراك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 280, difficulty: 2, category: "verbs", chapter: 101, verse: 4, rootWord: "ك و ن", examples: ["يوم يكون الناس"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "similes", chapter: 101, verse: 4, rootWord: "ف ر ش", examples: ["كالفراش المبثوث"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 101, verse: 4, rootWord: "ب ث ث", examples: ["الفراش المبثوث"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 118, difficulty: 2, category: "verbs", chapter: 101, verse: 5, rootWord: "ك و ن", examples: ["وتكون الجبال"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 95, difficulty: 2, category: "geography", chapter: 101, verse: 5, rootWord: "ج ب ل", examples: ["وتكون الجبال"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "similes", chapter: 101, verse: 5, rootWord: "ع ه ن", examples: ["كالعهن المنفوش"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 101, verse: 5, rootWord: "ن ف ش", examples: ["العهن المنفوش"] },
      
      // Al-Fil (Chapter 105) - The Elephant
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 14, difficulty: 2, category: "particles", chapter: 105, verse: 1, rootWord: "ا ل م", examples: ["ألم تر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 85, difficulty: 2, category: "verbs", chapter: 105, verse: 1, rootWord: "ر ا ي", examples: ["ألم تر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 83, difficulty: 2, category: "interrogative", chapter: 105, verse: 1, rootWord: "ك ي ف", examples: ["كيف فعل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 107, difficulty: 2, category: "verbs", chapter: 105, verse: 1, rootWord: "ف ع ل", examples: ["كيف فعل ربك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 42, difficulty: 2, category: "divine", chapter: 105, verse: 1, rootWord: "ر ب ب", examples: ["فعل ربك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 19, difficulty: 3, category: "people", chapter: 105, verse: 1, rootWord: "ص ح ب", examples: ["بأصحاب الفيل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "animals", chapter: 105, verse: 1, rootWord: "ف ي ل", examples: ["أصحاب الفيل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 353, difficulty: 2, category: "verbs", chapter: 105, verse: 2, rootWord: "ج ع ل", examples: ["ألم يجعل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 4, difficulty: 3, category: "concepts", chapter: 105, verse: 2, rootWord: "ك ي د", examples: ["كيدهم في تضليل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "concepts", chapter: 105, verse: 2, rootWord: "ض ل ل", examples: ["في تضليل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 62, difficulty: 2, category: "verbs", chapter: 105, verse: 3, rootWord: "ر س ل", examples: ["وأرسل عليهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 18, difficulty: 2, category: "animals", chapter: 105, verse: 3, rootWord: "ط ي ر", examples: ["طيرا أبابيل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "collective", chapter: 105, verse: 3, rootWord: "ا ب ل", examples: ["طيرا أبابيل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "verbs", chapter: 105, verse: 4, rootWord: "ر م ي", examples: ["ترميهم بحجارة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 3, category: "objects", chapter: 105, verse: 4, rootWord: "ح ج ر", examples: ["بحجارة من سجيل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "materials", chapter: 105, verse: 4, rootWord: "س ج ل", examples: ["من سجيل"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 3, category: "verbs", chapter: 105, verse: 5, rootWord: "ج ع ل", examples: ["فجعلهم كعصف"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "similes", chapter: 105, verse: 5, rootWord: "ع ص ف", examples: ["كعصف مأكول"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "attributes", chapter: 105, verse: 5, rootWord: "ا ك ل", examples: ["عصف مأكول"] },
      
      // Quraysh (Chapter 106) - The Quraysh
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "concepts", chapter: 106, verse: 1, rootWord: "ا ل ف", examples: ["لإيلاف قريش"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "tribes", chapter: 106, verse: 1, rootWord: "ق ر ش", examples: ["إيلاف قريش"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "concepts", chapter: 106, verse: 2, rootWord: "ا ل ف", examples: ["إيلافهم رحلة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "travel", chapter: 106, verse: 2, rootWord: "ر ح ل", examples: ["رحلة الشتاء"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "seasons", chapter: 106, verse: 2, rootWord: "ش ت و", examples: ["الشتاء والصيف"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "seasons", chapter: 106, verse: 2, rootWord: "ص ي ف", examples: ["الشتاء والصيف"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "verbs", chapter: 106, verse: 3, rootWord: "ع ب د", examples: ["فليعبدوا رب"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 516, difficulty: 1, category: "pronouns", chapter: 106, verse: 3, rootWord: "ه ذ ا", examples: ["رب هذا البيت"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 34, difficulty: 2, category: "places", chapter: 106, verse: 3, rootWord: "ب ي ت", examples: ["هذا البيت"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 3, category: "verbs", chapter: 106, verse: 4, rootWord: "ط ع م", examples: ["الذي أطعمهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 7, difficulty: 3, category: "states", chapter: 106, verse: 4, rootWord: "ج و ع", examples: ["من جوع"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "verbs", chapter: 106, verse: 4, rootWord: "ا م ن", examples: ["وآمنهم من خوف"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 124, difficulty: 2, category: "emotions", chapter: 106, verse: 4, rootWord: "خ و ف", examples: ["من خوف"] },
      
      // Al-Kawthar (Chapter 108) - The Abundance
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 3, category: "verbs", chapter: 108, verse: 1, rootWord: "ع ط ي", examples: ["إنا أعطيناك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "divine_gifts", chapter: 108, verse: 1, rootWord: "ك ث ر", examples: ["أعطيناك الكوثر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "verbs", chapter: 108, verse: 2, rootWord: "ص ل و", examples: ["فصل لربك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 2, category: "worship", chapter: 108, verse: 2, rootWord: "ر ب ب", examples: ["صل لربك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "verbs", chapter: 108, verse: 2, rootWord: "ن ح ر", examples: ["وانحر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "people", chapter: 108, verse: 3, rootWord: "ش ن ا", examples: ["إن شانئك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 108, verse: 3, rootWord: "ب ت ر", examples: ["هو الأبتر"] },
      
      // Al-Maun (Chapter 107) - Small Kindnesses
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 13, difficulty: 3, category: "verbs", chapter: 107, verse: 1, rootWord: "ر ا ي", examples: ["أرأيت الذي"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 28, difficulty: 3, category: "verbs", chapter: 107, verse: 1, rootWord: "ك ذ ب", examples: ["الذي يكذب بالدين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 19, difficulty: 2, category: "pronouns", chapter: 107, verse: 2, rootWord: "ذ ل ك", examples: ["فذلك الذي"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "verbs", chapter: 107, verse: 2, rootWord: "د ع ع", examples: ["يدع اليتيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 23, difficulty: 2, category: "people", chapter: 107, verse: 2, rootWord: "ي ت م", examples: ["يدع اليتيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 3, category: "verbs", chapter: 107, verse: 3, rootWord: "ح ض ض", examples: ["ولا يحض"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 48, difficulty: 2, category: "sustenance", chapter: 107, verse: 3, rootWord: "ط ع م", examples: ["على طعام المسكين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 25, difficulty: 2, category: "people", chapter: 107, verse: 3, rootWord: "س ك ن", examples: ["طعام المسكين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 10, difficulty: 3, category: "warning", chapter: 107, verse: 4, rootWord: "و ي ل", examples: ["فويل للمصلين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "worship", chapter: 107, verse: 4, rootWord: "ص ل و", examples: ["ويل للمصلين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "attributes", chapter: 107, verse: 5, rootWord: "س ه و", examples: ["هم ساهون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 4, category: "verbs", chapter: 107, verse: 6, rootWord: "ر ا ي", examples: ["الذين هم يراءون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 3, category: "verbs", chapter: 107, verse: 7, rootWord: "م ن ع", examples: ["ويمنعون الماعون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 4, category: "concepts", chapter: 107, verse: 7, rootWord: "م ع ن", examples: ["يمنعون الماعون"] },
      
      // Al-Kafiroon (Chapter 109) - The Disbelievers
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 315, difficulty: 1, category: "particles", chapter: 109, verse: 1, rootWord: "ي ا", examples: ["يا أيها الناس"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 152, difficulty: 2, category: "address", chapter: 109, verse: 1, rootWord: "ا ي ي", examples: ["يا أيها الكافرون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 16, difficulty: 3, category: "people", chapter: 109, verse: 1, rootWord: "ك ف ر", examples: ["أيها الكافرون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 11, difficulty: 2, category: "verbs", chapter: 109, verse: 2, rootWord: "ع ب د", examples: ["لا أعبد"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 13, difficulty: 2, category: "verbs", chapter: 109, verse: 2, rootWord: "ع ب د", examples: ["ما تعبدون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 2, difficulty: 3, category: "people", chapter: 109, verse: 3, rootWord: "ع ب د", examples: ["أنتم عابدون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 85, difficulty: 1, category: "pronouns", chapter: 109, verse: 3, rootWord: "ا ن ت", examples: ["ولا أنتم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 3, difficulty: 3, category: "people", chapter: 109, verse: 4, rootWord: "ع ب د", examples: ["ولا أنا عابد"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 1, difficulty: 3, category: "verbs", chapter: 109, verse: 4, rootWord: "ع ب د", examples: ["ما عبدتم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 254, difficulty: 1, category: "pronouns", chapter: 109, verse: 6, rootWord: "ل ك م", examples: ["لكم دينكم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 8, difficulty: 2, category: "concepts", chapter: 109, verse: 6, rootWord: "د ي ن", examples: ["لكم دينكم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 4, difficulty: 2, category: "pronouns", chapter: 109, verse: 6, rootWord: "و ل ي", examples: ["ولي دين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 92, difficulty: 2, category: "concepts", chapter: 109, verse: 6, rootWord: "د ي ن", examples: ["ولي دين"] },
      
      // Additional essential high-frequency words from various chapters
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 102, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ش ي ا", examples: ["ما شاء الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 127, difficulty: 2, category: "people", chapter: null, verse: null, rootWord: "ا ه ل", examples: ["أهل الكتاب"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 353, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ج ع ل", examples: ["وجعل منها زوجها"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 62, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ر س ل", examples: ["أرسل إليهم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 75, difficulty: 2, category: "messengers", chapter: null, verse: null, rootWord: "ر س ل", examples: ["أرسل رسولا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 230, difficulty: 2, category: "scripture", chapter: null, verse: null, rootWord: "ك ت ب", examples: ["أنزل عليه كتابا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 39, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ه د ي", examples: ["يهدي من يشاء"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 16, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ض ل ل", examples: ["ويضل من يشاء"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 30, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ص د ق", examples: ["إن كنتم صادقين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 58, difficulty: 2, category: "people", chapter: null, verse: null, rootWord: "ظ ل م", examples: ["القوم الظالمين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 41, difficulty: 2, category: "believers", chapter: null, verse: null, rootWord: "س ل م", examples: ["كونوا مسلمين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 105, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ا ج ر", examples: ["لهم أجر عظيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 124, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ع ظ م", examples: ["أجر عظيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 173, difficulty: 2, category: "consequences", chapter: null, verse: null, rootWord: "ع ذ ب", examples: ["لهم عذاب أليم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 39, difficulty: 3, category: "attributes", chapter: null, verse: null, rootWord: "ا ل م", examples: ["عذاب أليم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 147, difficulty: 2, category: "paradise", chapter: null, verse: null, rootWord: "ج ن ن", examples: ["جنات تجري"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 54, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ج ر ي", examples: ["تجري تحتها الأنهار"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 54, difficulty: 2, category: "prepositions", chapter: null, verse: null, rootWord: "ت ح ت", examples: ["من تحتها"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 54, difficulty: 2, category: "nature", chapter: null, verse: null, rootWord: "ن ه ر", examples: ["تجري تحتها الأنهار"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 78, difficulty: 2, category: "eternity", chapter: null, verse: null, rootWord: "خ ل د", examples: ["خالدين فيها"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 289, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ف ي ه", examples: ["خالدين فيها"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 28, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ا ب د", examples: ["خالدين فيها أبدا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 41, difficulty: 2, category: "praise", chapter: null, verse: null, rootWord: "س ب ح", examples: ["سبحان الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 38, difficulty: 2, category: "praise", chapter: null, verse: null, rootWord: "ح م د", examples: ["والحمد لله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 32, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ك ب ر", examples: ["الله أكبر"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 663, difficulty: 1, category: "particles", chapter: null, verse: null, rootWord: "ل ا", examples: ["لا إله إلا الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 143, difficulty: 2, category: "divine", chapter: null, verse: null, rootWord: "ا ل ه", examples: ["لا إله إلا الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 22, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "و ح د", examples: ["وحده لا شريك له"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 25, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ش ر ك", examples: ["لا شريك له"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 48, difficulty: 2, category: "authority", chapter: null, verse: null, rootWord: "م ل ك", examples: ["له الملك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 95, difficulty: 1, category: "pronouns", chapter: null, verse: null, rootWord: "و ل ه", examples: ["وله الحمد"] },

      // Difficulty 3 - More complex words
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 70, difficulty: 3, category: "believers", chapter: null, verse: null, rootWord: "و ق ي", examples: ["هدى للمتقين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 60, difficulty: 3, category: "concepts", chapter: null, verse: null, rootWord: "غ ي ب", examples: ["يؤمنون بالغيب"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 40, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ا م ن", examples: ["يؤمنون بالغيب"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 30, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ق و م", examples: ["ويقيمون الصلاة"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 25, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ن ف ق", examples: ["ومما رزقناهم ينفقون"] },

      // Difficulty 3 continued
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 20, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ر ز ق", examples: ["ومما رزقناهم ينفقون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 35, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ن ز ل", examples: ["وما أنزل إليك"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 115, difficulty: 3, category: "concepts", chapter: null, verse: null, rootWord: "ا خ ر", examples: ["وبالآخرة هم يوقنون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 15, difficulty: 3, category: "verbs", chapter: null, verse: null, rootWord: "ي ق ن", examples: ["وبالآخرة هم يوقنون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 80, difficulty: 3, category: "concepts", chapter: null, verse: null, rootWord: "ه د ي", examples: ["هدى للمتقين"] },

      // Difficulty 4 - Advanced vocabulary
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 40, difficulty: 4, category: "believers", chapter: null, verse: null, rootWord: "ف ل ح", examples: ["أولئك هم المفلحون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 5, difficulty: 4, category: "verbs", chapter: null, verse: null, rootWord: "خ د ع", examples: ["يخادعون الله"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 30, difficulty: 4, category: "people", chapter: null, verse: null, rootWord: "ن ف ق", examples: ["ومن الناس من يقول آمنا"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 15, difficulty: 4, category: "verbs", chapter: null, verse: null, rootWord: "ش ع ر", examples: ["وما يشعرون"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 20, difficulty: 4, category: "concepts", chapter: null, verse: null, rootWord: "م ر ض", examples: ["في قلوبهم مرض"] },

      // Additional high-frequency words to reach 270+ vocabulary
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 312, difficulty: 2, category: "quantifiers", chapter: null, verse: null, rootWord: "ك ل ل", examples: ["كل نفس ذائقة الموت"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 338, difficulty: 2, category: "general", chapter: null, verse: null, rootWord: "ش ي ا", examples: ["وهو على كل شيء قدير"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 45, difficulty: 3, category: "attributes", chapter: null, verse: null, rootWord: "ق د ر", examples: ["وهو على كل شيء قدير"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 158, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ع ل م", examples: ["والله بكل شيء عليم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 97, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ح ك م", examples: ["والله عزيز حكيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 92, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ع ز ز", examples: ["والله عزيز حكيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 91, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "غ ف ر", examples: ["والله غفور رحيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 114, difficulty: 1, category: "attributes", chapter: null, verse: null, rootWord: "ر ح م", examples: ["والله غفور رحيم"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 85, difficulty: 3, category: "attributes", chapter: null, verse: null, rootWord: "ب ي ن", examples: ["هذا بلاغ مبين"] },
      { id: , arabic: "", transliteration: "", meaning: "", meaningUrdu: null, frequency: 7, difficulty: 4, category: "concepts", chapter: null, verse: null, rootWord: "ب ل غ", examples: ["هذا بلاغ للناس"] }
    ];

    sampleWords.forEach(word => {
      // Add meaningUrdu: null to entries that don't have it
      const wordWithUrdu = {
        ...word,
        meaningUrdu: word.meaningUrdu || null
      };
      this.words.set(word.id, wordWithUrdu);
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
