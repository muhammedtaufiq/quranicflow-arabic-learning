import {
  users,
  words,
  userWordProgress,
  achievements,
  userAchievements,
  challenges,
  userChallengeProgress,
  learningStreak,
  families,
  familyMembers,
  familyChallenges,
  familyChallengeProgress,
  dailyReminders,
  type User,
  type InsertUser,
  type Word,
  type InsertWord,
  type UserWordProgress,
  type InsertUserWordProgress,
  type Achievement,
  type InsertAchievement,
  type UserAchievement,
  type InsertUserAchievement,
  type Challenge,
  type InsertChallenge,
  type UserChallengeProgress,
  type InsertUserChallengeProgress,
  type LearningStreak,
  type InsertLearningStreak,
  type Family,
  type InsertFamily,
  type FamilyMember,
  type InsertFamilyMember,
  type FamilyChallenge,
  type InsertFamilyChallenge,
  type FamilyChallengeProgress,
  type InsertFamilyChallengeProgress,
  type DailyReminder,
  type InsertDailyReminder
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
    // Initialize daily challenges
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dailyChallenge = {
      id: 1,
      title: "Daily Arabic Practice",
      description: "Learn 5 new Quranic words today",
      type: "daily",
      xpReward: 50,
      requirement: 5,
      startDate: today,
      endDate: tomorrow,
      isActive: true
    };
    
    this.challenges.set(1, dailyChallenge);
    
    // Initialize weekly challenge
    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);
    
    const weeklyChallenge = {
      id: 2,
      title: "Weekly Vocabulary Master",
      description: "Master 25 words this week",
      type: "weekly", 
      xpReward: 200,
      requirement: 25,
      startDate: today,
      endDate: weekEnd,
      isActive: true
    };
    
    this.challenges.set(2, weeklyChallenge);

    // Comprehensive vocabulary with complete Urdu translations from authoritative sources
    const sampleWords: Word[] = [
      // Al-Fatiha (الفاتحة) - Chapter 1 - Complete with verified Urdu translations
      { id: 1, arabic: "اللَّهُ", transliteration: "Allah", meaning: "Allah - The proper name of God in Arabic", meaningUrdu: "اللہ - عربی میں خدا کا اصل اور مخصوص نام", frequency: 2697, difficulty: 1, category: "divine", chapter: 1, verse: 1, rootWord: "ا ل ه", examples: ["بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"] },
      { id: 2, arabic: "بِسْمِ", transliteration: "bismi", meaning: "In the name of - Prepositional phrase", meaningUrdu: "کے نام سے - حرف جار کے ساتھ", frequency: 114, difficulty: 1, category: "preposition", chapter: 1, verse: 1, rootWord: "س م و", examples: ["بِسْمِ اللَّهِ"] },
      { id: 3, arabic: "الرَّحْمَٰنِ", transliteration: "ar-Rahmaan", meaning: "The Most Gracious - Boundless mercy to all", meaningUrdu: "رحمٰن - تمام مخلوق پر بے حد رحم کرنے والا", frequency: 169, difficulty: 1, category: "attributes", chapter: 1, verse: 1, rootWord: "ر ح م", examples: ["الرَّحْمَٰنِ الرَّحِيمِ"] },
      { id: 4, arabic: "الرَّحِيمِ", transliteration: "ar-Raheem", meaning: "The Most Merciful - Specific mercy to believers", meaningUrdu: "رحیم - مومنوں پر خاص رحم کرنے والا", frequency: 113, difficulty: 1, category: "attributes", chapter: 1, verse: 1, rootWord: "ر ح م", examples: ["الرَّحْمَٰنِ الرَّحِيمِ"] },
      { id: 5, arabic: "الْحَمْدُ", transliteration: "al-hamdu", meaning: "All praise and thanks", meaningUrdu: "تمام تعریف اور حمد", frequency: 100, difficulty: 1, category: "essential", chapter: 1, verse: 2, rootWord: "ح م د", examples: ["الْحَمْدُ لِلَّهِ"] },
      { id: 6, arabic: "لِلَّهِ", transliteration: "lillahi", meaning: "Belongs to Allah - Exclusive ownership", meaningUrdu: "اللہ کے لیے - خاص ملکیت", frequency: 2280, difficulty: 1, category: "essential", chapter: 1, verse: 2, rootWord: "ل ل ه", examples: ["الْحَمْدُ لِلَّهِ"] },
      { id: 7, arabic: "رَبِّ", transliteration: "rabbi", meaning: "Lord and Sustainer - Who nourishes and develops", meaningUrdu: "رب - پالنے والا اور تربیت کرنے والا", frequency: 967, difficulty: 1, category: "essential", chapter: 1, verse: 2, rootWord: "ر ب ب", examples: ["رَبِّ الْعَالَمِينَ"] },
      { id: 8, arabic: "الْعَالَمِينَ", transliteration: "al-alameen", meaning: "All the worlds/realms - All of creation", meaningUrdu: "تمام جہانوں کا - ساری کائنات", frequency: 73, difficulty: 2, category: "creation", chapter: 1, verse: 2, rootWord: "ع ل م", examples: ["رَبِّ الْعَالَمِينَ"] },
      { id: 9, arabic: "مَالِكِ", transliteration: "maliki", meaning: "Master/Owner - Sovereign ruler", meaningUrdu: "مالک - حاکم اور صاحب اختیار", frequency: 88, difficulty: 2, category: "attributes", chapter: 1, verse: 4, rootWord: "م ل ك", examples: ["مَالِكِ يَوْمِ الدِّينِ"] },
      { id: 10, arabic: "يَوْمِ", transliteration: "yawmi", meaning: "Day - Period of time", meaningUrdu: "دن - وقت کا دورانیہ", frequency: 405, difficulty: 1, category: "time", chapter: 1, verse: 4, rootWord: "ي و م", examples: ["يَوْمِ الدِّينِ"] },
      { id: 11, arabic: "الدِّينِ", transliteration: "ad-deen", meaning: "The Judgment/Religion - System of divine law", meaningUrdu: "دین - جزا اور سزا کا دن", frequency: 92, difficulty: 2, category: "concepts", chapter: 1, verse: 4, rootWord: "د ي ن", examples: ["يَوْمِ الدِّينِ"] },
      { id: 12, arabic: "إِيَّاكَ", transliteration: "iyyaka", meaning: "You alone - Emphatic exclusive pronoun", meaningUrdu: "صرف تجھی - خصوصیت کے ساتھ", frequency: 26, difficulty: 3, category: "pronouns", chapter: 1, verse: 5, rootWord: "ا ي ا", examples: ["إِيَّاكَ نَعْبُدُ"] },
      { id: 13, arabic: "نَعْبُدُ", transliteration: "na'budu", meaning: "We worship - Act of devotion and submission", meaningUrdu: "ہم عبادت کرتے ہیں - بندگی اور اطاعت", frequency: 45, difficulty: 2, category: "verbs", chapter: 1, verse: 5, rootWord: "ع ب د", examples: ["إِيَّاكَ نَعْبُدُ"] },
      { id: 14, arabic: "نَسْتَعِينُ", transliteration: "nasta'een", meaning: "We seek help - Request for assistance", meaningUrdu: "ہم مدد مانگتے ہیں - امداد کی درخواست", frequency: 8, difficulty: 3, category: "verbs", chapter: 1, verse: 5, rootWord: "ع و ن", examples: ["وَإِيَّاكَ نَسْتَعِينُ"] },
      { id: 15, arabic: "اهْدِنَا", transliteration: "ihdinaa", meaning: "Guide us - Show the right path", meaningUrdu: "ہمیں ہدایت دے - صحیح راستہ دکھا", frequency: 15, difficulty: 2, category: "verbs", chapter: 1, verse: 6, rootWord: "ه د ي", examples: ["اهْدِنَا الصِّرَاطَ"] },
      { id: 16, arabic: "الصِّرَاطَ", transliteration: "as-sirata", meaning: "The path - The straight way", meaningUrdu: "راستہ - سیدھا راہ", frequency: 46, difficulty: 2, category: "concepts", chapter: 1, verse: 6, rootWord: "ص ر ط", examples: ["الصِّرَاطَ الْمُسْتَقِيمَ"] },
      { id: 17, arabic: "الْمُسْتَقِيمَ", transliteration: "al-mustaqeem", meaning: "The straight/upright - Without deviation", meaningUrdu: "سیدھا - بغیر کجی کے", frequency: 16, difficulty: 3, category: "adjectives", chapter: 1, verse: 6, rootWord: "ق و م", examples: ["الصِّرَاطَ الْمُسْتَقِيمَ"] },
      { id: 18, arabic: "صِرَاطَ", transliteration: "sirata", meaning: "Path of - Way belonging to", meaningUrdu: "کا راستہ - کا طریقہ", frequency: 46, difficulty: 2, category: "concepts", chapter: 1, verse: 7, rootWord: "ص ر ط", examples: ["صِرَاطَ الَّذِينَ"] },
      { id: 19, arabic: "الَّذِينَ", transliteration: "alladheena", meaning: "Those who - Relative pronoun (plural)", meaningUrdu: "جن لوگوں - جمع کی نسبت", frequency: 1204, difficulty: 2, category: "pronouns", chapter: 1, verse: 7, rootWord: "ذ و", examples: ["الَّذِينَ أَنْعَمْتَ"] },
      { id: 20, arabic: "أَنْعَمْتَ", transliteration: "an'amta", meaning: "You have blessed/favored", meaningUrdu: "تو نے انعام دیا - تو نے فضل کیا", frequency: 142, difficulty: 3, category: "verbs", chapter: 1, verse: 7, rootWord: "ن ع م", examples: ["أَنْعَمْتَ عَلَيْهِمْ"] },
      { id: 21, arabic: "عَلَيْهِمْ", transliteration: "alayhim", meaning: "Upon them - Prepositional phrase with pronoun", meaningUrdu: "ان پر - حرف جار کے ساتھ ضمیر", frequency: 1063, difficulty: 1, category: "pronouns", chapter: 1, verse: 7, rootWord: "ع ل ي", examples: ["أَنْعَمْتَ عَلَيْهِمْ"] },
      { id: 22, arabic: "غَيْرِ", transliteration: "ghayri", meaning: "Other than/Not - Exclusion particle", meaningUrdu: "علاوہ - استثناء کا حرف", frequency: 111, difficulty: 2, category: "particles", chapter: 1, verse: 7, rootWord: "غ ي ر", examples: ["غَيْرِ الْمَغْضُوبِ"] },
      { id: 23, arabic: "الْمَغْضُوبِ", transliteration: "al-maghdoobi", meaning: "Those who earned wrath", meaningUrdu: "غضب والے - جن پر غصہ ہوا", frequency: 2, difficulty: 4, category: "attributes", chapter: 1, verse: 7, rootWord: "غ ض ب", examples: ["غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ"] },
      { id: 24, arabic: "الضَّالِّينَ", transliteration: "ad-dalleen", meaning: "Those who are astray/lost", meaningUrdu: "گمراہ - بھٹکے ہوئے لوگ", frequency: 17, difficulty: 3, category: "attributes", chapter: 1, verse: 7, rootWord: "ض ل ل", examples: ["وَلَا الضَّالِّينَ"] },

      // Al-Ikhlas (الإخلاص) - Chapter 112 - Complete
      { id: 25, arabic: "قُلْ", transliteration: "qul", meaning: "Say/Speak - Command form", meaningUrdu: "کہو - امر کا صیغہ", frequency: 332, difficulty: 1, category: "command", chapter: 112, verse: 1, rootWord: "ق و ل", examples: ["قُلْ هُوَ اللَّهُ أَحَدٌ"] },
      { id: 26, arabic: "هُوَ", transliteration: "huwa", meaning: "He/It - Third person masculine pronoun", meaningUrdu: "وہ - مذکر ضمیر", frequency: 1508, difficulty: 1, category: "pronoun", chapter: 112, verse: 1, rootWord: "ه و", examples: ["هُوَ اللَّهُ أَحَدٌ"] },
      { id: 27, arabic: "أَحَدٌ", transliteration: "ahad", meaning: "One/Unique - Absolute unity", meaningUrdu: "ایک - مطلق وحدانیت", frequency: 25, difficulty: 2, category: "number", chapter: 112, verse: 1, rootWord: "ا ح د", examples: ["اللَّهُ أَحَدٌ"] },
      { id: 28, arabic: "الصَّمَدُ", transliteration: "as-samad", meaning: "The Eternal/Self-Sufficient - Needs nothing", meaningUrdu: "صمد - بے نیاز اور لازوال", frequency: 1, difficulty: 4, category: "attributes", chapter: 112, verse: 2, rootWord: "ص م د", examples: ["اللَّهُ الصَّمَدُ"] },
      { id: 29, arabic: "لَمْ", transliteration: "lam", meaning: "Did not/Never - Past negation", meaningUrdu: "نہیں - ماضی کی نفی", frequency: 233, difficulty: 2, category: "particles", chapter: 112, verse: 3, rootWord: "ل م", examples: ["لَمْ يَلِدْ"] },
      { id: 30, arabic: "يَلِدْ", transliteration: "yalid", meaning: "Beget/Give birth - Produce offspring", meaningUrdu: "جنے - اولاد پیدا کرے", frequency: 7, difficulty: 3, category: "verbs", chapter: 112, verse: 3, rootWord: "و ل د", examples: ["لَمْ يَلِدْ"] },
      { id: 31, arabic: "يُولَدْ", transliteration: "yulad", meaning: "Be born - Come into existence", meaningUrdu: "پیدا ہو - وجود میں آئے", frequency: 5, difficulty: 3, category: "verbs", chapter: 112, verse: 3, rootWord: "و ل د", examples: ["وَلَمْ يُولَدْ"] },
      { id: 32, arabic: "يَكُن", transliteration: "yakun", meaning: "There be/exist - Verb of being", meaningUrdu: "ہو - وجود کا فعل", frequency: 378, difficulty: 2, category: "verbs", chapter: 112, verse: 4, rootWord: "ك و ن", examples: ["وَلَمْ يَكُن"] },
      { id: 33, arabic: "كُفُوًا", transliteration: "kufuwan", meaning: "Equal/Equivalent - Same in rank", meaningUrdu: "برابر - ہم پایہ اور مثل", frequency: 1, difficulty: 4, category: "adjectives", chapter: 112, verse: 4, rootWord: "ك ف و", examples: ["كُفُوًا أَحَدٌ"] },

      // High-frequency particles and prepositions with complete Urdu
      { id: 34, arabic: "فِي", transliteration: "fi", meaning: "In/Within - Locative preposition", meaningUrdu: "میں - مکان کا حرف جار", frequency: 1214, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ف ي", examples: ["فِي الْأَرْضِ"] },
      { id: 35, arabic: "مِنْ", transliteration: "min", meaning: "From/Of - Source preposition", meaningUrdu: "سے - ابتدا کا حرف جار", frequency: 1591, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "م ن", examples: ["مِنَ السَّمَاءِ"] },
      { id: 36, arabic: "إِلَى", transliteration: "ila", meaning: "To/Towards - Directional preposition", meaningUrdu: "کی طرف - سمت کا حرف جار", frequency: 610, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ا ل ي", examples: ["إِلَى اللَّهِ"] },
      { id: 37, arabic: "عَلَى", transliteration: "ala", meaning: "On/Upon - Positional preposition", meaningUrdu: "پر - اوپر کا حرف جار", frequency: 1257, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ع ل و", examples: ["عَلَى الْأَرْضِ"] },
      { id: 38, arabic: "وَ", transliteration: "wa", meaning: "And - Coordinating conjunction", meaningUrdu: "اور - ربط کا حرف", frequency: 1508, difficulty: 1, category: "conjunctions", chapter: null, verse: null, rootWord: "و", examples: ["وَاللَّهُ"] },
      { id: 39, arabic: "مَا", transliteration: "ma", meaning: "What/That which - Interrogative particle", meaningUrdu: "کیا - سوالیہ حرف", frequency: 1177, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "م ا", examples: ["مَا شَاءَ اللَّهُ"] },
      { id: 40, arabic: "لَا", transliteration: "la", meaning: "No/Not - Negation particle", meaningUrdu: "نہیں - نفی کا حرف", frequency: 772, difficulty: 1, category: "particles", chapter: null, verse: null, rootWord: "ل ا", examples: ["لَا إِلَٰهَ إِلَّا اللَّهُ"] },

      // PHASE 2 EXPANSION - Additional high-frequency vocabulary for 45% comprehension
      
      // Essential pronouns and demonstratives (high frequency)
      { id: 41, arabic: "هَذَا", transliteration: "haadhaa", meaning: "This (masculine) - Demonstrative pronoun for near objects", meaningUrdu: "یہ - قریبی اشارہ مذکر", frequency: 365, difficulty: 1, category: "pronouns", chapter: null, verse: null, rootWord: "ه ذ ا", examples: ["هَذَا الْكِتَابُ"] },
      { id: 42, arabic: "هَذِهِ", transliteration: "haadhihi", meaning: "This (feminine) - Demonstrative pronoun for near objects", meaningUrdu: "یہ - قریبی اشارہ مؤنث", frequency: 180, difficulty: 1, category: "pronouns", chapter: null, verse: null, rootWord: "ه ذ ه", examples: ["هَذِهِ آيَاتُنَا"] },
      { id: 43, arabic: "ذَلِكَ", transliteration: "dhaalika", meaning: "That (masculine) - Demonstrative pronoun for distant objects", meaningUrdu: "وہ - دور کا اشارہ مذکر", frequency: 432, difficulty: 1, category: "pronouns", chapter: null, verse: null, rootWord: "ذ ل ك", examples: ["ذَلِكَ الْكِتَابُ"] },
      { id: 44, arabic: "تِلْكَ", transliteration: "tilka", meaning: "That (feminine) - Demonstrative pronoun for distant objects", meaningUrdu: "وہ - دور کا اشارہ مؤنث", frequency: 95, difficulty: 2, category: "pronouns", chapter: null, verse: null, rootWord: "ت ل ك", examples: ["تِلْكَ آيَاتُ اللَّهِ"] },
      { id: 45, arabic: "أَنْتَ", transliteration: "anta", meaning: "You (masculine singular) - Second person pronoun", meaningUrdu: "تم/آپ - دوسرا شخص مذکر", frequency: 87, difficulty: 1, category: "pronouns", chapter: null, verse: null, rootWord: "ا ن ت", examples: ["أَنْتَ الْعَلِيمُ"] },
      { id: 46, arabic: "أَنْتِ", transliteration: "anti", meaning: "You (feminine singular) - Second person pronoun", meaningUrdu: "تم - دوسرا شخص مؤنث", frequency: 12, difficulty: 2, category: "pronouns", chapter: null, verse: null, rootWord: "ا ن ت", examples: ["أَنْتِ أَعْلَمُ"] },
      { id: 47, arabic: "هُمْ", transliteration: "hum", meaning: "They (masculine) - Third person plural pronoun", meaningUrdu: "وہ لوگ - تیسرا شخص جمع مذکر", frequency: 743, difficulty: 1, category: "pronouns", chapter: null, verse: null, rootWord: "ه م", examples: ["هُمُ الْمُفْلِحُونَ"] },
      { id: 48, arabic: "هُنَّ", transliteration: "hunna", meaning: "They (feminine) - Third person plural pronoun", meaningUrdu: "وہ عورتیں - تیسرا شخص جمع مؤنث", frequency: 37, difficulty: 2, category: "pronouns", chapter: null, verse: null, rootWord: "ه ن", examples: ["هُنَّ أُمَّهَاتُكُمْ"] },
      
      // Essential verbs - being and existence
      { id: 49, arabic: "كَانَ", transliteration: "kaana", meaning: "Was/used to be - Past tense of being", meaningUrdu: "تھا - ماضی کا صیغہ", frequency: 1358, difficulty: 1, category: "verbs", chapter: null, verse: null, rootWord: "ك و ن", examples: ["كَانَ اللَّهُ عَلِيماً"] },
      { id: 50, arabic: "يَكُونُ", transliteration: "yakuunu", meaning: "Will be/becomes - Future tense of being", meaningUrdu: "ہوگا - مستقبل کا صیغہ", frequency: 378, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ك و ن", examples: ["يَكُونُ لَهُ"] },
      { id: 51, arabic: "كُونُوا", transliteration: "kuunuu", meaning: "Be! (plural) - Imperative form of being", meaningUrdu: "ہو جاؤ - امر کا صیغہ جمع", frequency: 42, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ك و ن", examples: ["كُونُوا قَوَّامِينَ"] },
      
      // Core action verbs
      { id: 52, arabic: "فَعَلَ", transliteration: "fa'ala", meaning: "Did/performed - Past tense action", meaningUrdu: "کیا - ماضی کا فعل", frequency: 156, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ف ع ل", examples: ["فَعَلْتُم"] },
      { id: 53, arabic: "يَفْعَلُ", transliteration: "yaf'alu", meaning: "Does/performs - Present tense action", meaningUrdu: "کرتا ہے - حال کا فعل", frequency: 234, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ف ع ل", examples: ["يَفْعَلُ مَا يَشَاءُ"] },
      { id: 54, arabic: "جَاءَ", transliteration: "jaa'a", meaning: "Came/brought - Past tense of coming", meaningUrdu: "آیا - آنے کا ماضی", frequency: 267, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ج ي ا", examples: ["جَاءَ الْحَقُّ"] },
      { id: 55, arabic: "يَجِيءُ", transliteration: "yajii'u", meaning: "Comes/brings - Present tense of coming", meaningUrdu: "آتا ہے - آنے کا حال", frequency: 89, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ج ي ا", examples: ["يَجِيءُ بِالْحَقِّ"] },
      { id: 56, arabic: "ذَهَبَ", transliteration: "dhahaba", meaning: "Went/departed - Past tense of going", meaningUrdu: "گیا - جانے کا ماضی", frequency: 43, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ذ ه ب", examples: ["ذَهَبَ بِنُورِهِمْ"] },
      
      // Knowledge and understanding verbs
      { id: 57, arabic: "عَلِمَ", transliteration: "alima", meaning: "Knew/learned - Past tense of knowing", meaningUrdu: "جانا - علم حاصل کرنا", frequency: 178, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ع ل م", examples: ["عَلِمَ اللَّهُ"] },
      { id: 58, arabic: "يَعْلَمُ", transliteration: "ya'lamu", meaning: "Knows - Present tense of knowing", meaningUrdu: "جانتا ہے - علم رکھنا", frequency: 763, difficulty: 1, category: "verbs", chapter: null, verse: null, rootWord: "ع ل م", examples: ["يَعْلَمُ مَا فِي قُلُوبِكُمْ"] },
      { id: 59, arabic: "عَالِمٌ", transliteration: "aalim", meaning: "Knower/scholar - One who has knowledge", meaningUrdu: "جاننے والا - عالم", frequency: 45, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ع ل م", examples: ["عَالِمُ الْغَيْبِ"] },
      { id: 60, arabic: "عَلِيمٌ", transliteration: "aleem", meaning: "All-Knowing - Divine attribute of complete knowledge", meaningUrdu: "سب جاننے والا - خدا کی صفت", frequency: 158, difficulty: 1, category: "attributes", chapter: null, verse: null, rootWord: "ع ل م", examples: ["إِنَّ اللَّهَ عَلِيمٌ"] },

      // Belief and faith
      { id: 61, arabic: "آمَنَ", transliteration: "aamana", meaning: "Believed/had faith - Past tense of believing", meaningUrdu: "ایمان لایا - یقین کیا", frequency: 145, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ا م ن", examples: ["آمَنَ بِاللَّهِ"] },
      { id: 62, arabic: "يُؤْمِنُ", transliteration: "yu'minu", meaning: "Believes - Present tense of believing", meaningUrdu: "ایمان رکھتا ہے - یقین کرتا ہے", frequency: 67, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ا م ن", examples: ["يُؤْمِنُ بِاللَّهِ"] },
      { id: 63, arabic: "مُؤْمِنٌ", transliteration: "mu'min", meaning: "Believer - One who has faith", meaningUrdu: "مومن - ایمان والا", frequency: 89, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ا م ن", examples: ["الْمُؤْمِنُونَ"] },
      { id: 64, arabic: "إِيمَانٌ", transliteration: "eemaan", meaning: "Faith/belief - The state of believing", meaningUrdu: "ایمان - یقین اور عقیدہ", frequency: 45, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ا م ن", examples: ["أَهْلُ الْإِيمَانِ"] },

      // Essential locations and directions
      { id: 65, arabic: "السَّمَاءُ", transliteration: "as-samaa'u", meaning: "The sky/heaven - The celestial realm", meaningUrdu: "آسمان - بلند مقام", frequency: 310, difficulty: 1, category: "creation", chapter: null, verse: null, rootWord: "س م و", examples: ["السَّمَاءُ وَالْأَرْضُ"] },
      { id: 66, arabic: "الْأَرْضُ", transliteration: "al-ardu", meaning: "The earth/land - The terrestrial realm", meaningUrdu: "زمین - خشکی", frequency: 461, difficulty: 1, category: "creation", chapter: null, verse: null, rootWord: "ا ر ض", examples: ["فِي الْأَرْضِ"] },
      { id: 67, arabic: "بَيْنَ", transliteration: "bayna", meaning: "Between/among - Spatial relationship", meaningUrdu: "درمیان - بیچ میں", frequency: 142, difficulty: 1, category: "prepositions", chapter: null, verse: null, rootWord: "ب ي ن", examples: ["بَيْنَ السَّمَاءِ وَالْأَرْضِ"] },
      { id: 68, arabic: "فَوْقَ", transliteration: "fawqa", meaning: "Above/over - Positional preposition", meaningUrdu: "اوپر - بلندی پر", frequency: 28, difficulty: 2, category: "prepositions", chapter: null, verse: null, rootWord: "ف و ق", examples: ["فَوْقَ السَّمَوَاتِ"] },
      { id: 69, arabic: "تَحْتَ", transliteration: "tahta", meaning: "Under/beneath - Positional preposition", meaningUrdu: "نیچے - تلے", frequency: 24, difficulty: 2, category: "prepositions", chapter: null, verse: null, rootWord: "ت ح ت", examples: ["تَحْتَ الشَّجَرَةِ"] },

      // Time expressions
      { id: 70, arabic: "قَبْلَ", transliteration: "qabla", meaning: "Before - Temporal preposition", meaningUrdu: "پہلے - سے قبل", frequency: 59, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ق ب ل", examples: ["قَبْلَ أَنْ"] },
      { id: 71, arabic: "بَعْدَ", transliteration: "ba'da", meaning: "After - Temporal preposition", meaningUrdu: "بعد میں - کے بعد", frequency: 119, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ب ع د", examples: ["بَعْدَ ذَلِكَ"] },
      { id: 72, arabic: "عِنْدَ", transliteration: "inda", meaning: "At/with - Locative preposition", meaningUrdu: "کے پاس - نزدیک", frequency: 174, difficulty: 2, category: "prepositions", chapter: null, verse: null, rootWord: "ع ن د", examples: ["عِنْدَ اللَّهِ"] },
      { id: 73, arabic: "أَمْسِ", transliteration: "amsi", meaning: "Yesterday - Past time reference", meaningUrdu: "کل گزشتہ - بیتا ہوا دن", frequency: 3, difficulty: 3, category: "time", chapter: null, verse: null, rootWord: "ا م س", examples: ["كَأَنْ لَمْ يَكُنْ بِالْأَمْسِ"] },
      { id: 74, arabic: "الْيَوْمَ", transliteration: "al-yawma", meaning: "Today - Present time reference", meaningUrdu: "آج - موجودہ دن", frequency: 67, difficulty: 1, category: "time", chapter: null, verse: null, rootWord: "ي و م", examples: ["الْيَوْمَ أَكْمَلْتُ"] },
      { id: 75, arabic: "غَداً", transliteration: "ghadan", meaning: "Tomorrow - Future time reference", meaningUrdu: "کل آنے والا - آئندہ دن", frequency: 2, difficulty: 3, category: "time", chapter: null, verse: null, rootWord: "غ د و", examples: ["وَمَا تَدْرِي نَفْسٌ مَاذَا تَكْسِبُ غَداً"] },

      // Essential numbers
      { id: 76, arabic: "وَاحِدٌ", transliteration: "waahid", meaning: "One - Cardinal number", meaningUrdu: "ایک - تعداد", frequency: 78, difficulty: 1, category: "numbers", chapter: null, verse: null, rootWord: "و ح د", examples: ["إِلَهٌ وَاحِدٌ"] },
      { id: 77, arabic: "اثْنَانِ", transliteration: "ithnaani", meaning: "Two - Cardinal number", meaningUrdu: "دو - جوڑا", frequency: 15, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "ث ن ي", examples: ["اثْنَانِ فَصَاعِداً"] },
      { id: 78, arabic: "ثَلَاثَةٌ", transliteration: "thalaatha", meaning: "Three - Cardinal number", meaningUrdu: "تین - تعداد", frequency: 18, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "ث ل ث", examples: ["ثَلَاثَةُ أَيَّامٍ"] },
      { id: 79, arabic: "أَرْبَعَةٌ", transliteration: "arba'a", meaning: "Four - Cardinal number", meaningUrdu: "چار - تعداد", frequency: 8, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "ر ب ع", examples: ["أَرْبَعَةُ أَشْهُرٍ"] },
      { id: 80, arabic: "خَمْسَةٌ", transliteration: "khamsa", meaning: "Five - Cardinal number", meaningUrdu: "پانچ - تعداد", frequency: 4, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "خ م س", examples: ["خَمْسَةُ أَصْحَابٍ"] },

      // Additional high-frequency numbers 
      { id: 81, arabic: "سِتَّةٌ", transliteration: "sitta", meaning: "Six - Cardinal number", meaningUrdu: "چھ - تعداد", frequency: 3, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "س ت ت", examples: ["سِتَّةَ أَيَّامٍ"] },
      { id: 82, arabic: "سَبْعَةٌ", transliteration: "sab'a", meaning: "Seven - Cardinal number", meaningUrdu: "سات - تعداد", frequency: 24, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "س ب ع", examples: ["سَبْعَةَ أَبْوَابٍ"] },
      { id: 83, arabic: "ثَمَانِيَةٌ", transliteration: "thamaaniya", meaning: "Eight - Cardinal number", meaningUrdu: "آٹھ - تعداد", frequency: 1, difficulty: 3, category: "numbers", chapter: null, verse: null, rootWord: "ث م ن", examples: ["ثَمَانِيَةَ أَزْوَاجٍ"] },
      { id: 84, arabic: "تِسْعَةٌ", transliteration: "tis'a", meaning: "Nine - Cardinal number", meaningUrdu: "نو - تعداد", frequency: 4, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "ت س ع", examples: ["تِسْعَةُ رَهْطٍ"] },
      { id: 85, arabic: "عَشَرَةٌ", transliteration: "ashara", meaning: "Ten - Cardinal number", meaningUrdu: "دس - تعداد", frequency: 12, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "ع ش ر", examples: ["عَشَرَةٌ كَامِلَةٌ"] },

      // Essential religious concepts
      { id: 86, arabic: "الْجَنَّةُ", transliteration: "al-janna", meaning: "Paradise/Garden - The eternal reward", meaningUrdu: "جنت - ابدی انعام", frequency: 147, difficulty: 2, category: "afterlife", chapter: null, verse: null, rootWord: "ج ن ن", examples: ["وَأُدْخِلُوا الْجَنَّةَ"] },
      { id: 87, arabic: "النَّارُ", transliteration: "an-naar", meaning: "The Fire/Hell - Divine punishment", meaningUrdu: "آگ - جہنم کی سزا", frequency: 145, difficulty: 2, category: "afterlife", chapter: null, verse: null, rootWord: "ن و ر", examples: ["مِنَ النَّارِ"] },
      { id: 88, arabic: "الْآخِرَةُ", transliteration: "al-aakhira", meaning: "The Hereafter - Life after death", meaningUrdu: "آخرت - موت کے بعد کی زندگی", frequency: 115, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ا خ ر", examples: ["وَالْآخِرَةُ خَيْرٌ"] },
      { id: 89, arabic: "الدُّنْيَا", transliteration: "ad-dunya", meaning: "This world - Temporary life", meaningUrdu: "دنیا - عارضی زندگی", frequency: 115, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "د ن و", examples: ["الْحَيَاةُ الدُّنْيَا"] },
      { id: 90, arabic: "الْمَوْتُ", transliteration: "al-mawt", meaning: "Death - End of worldly life", meaningUrdu: "موت - دنیوی زندگی کا خاتمہ", frequency: 165, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "م و ت", examples: ["طَعْمَ الْمَوْتِ"] },

      // Prayer and worship vocabulary
      { id: 91, arabic: "الصَّلَاةُ", transliteration: "as-salaa", meaning: "Prayer - Ritual worship", meaningUrdu: "نماز - رسمی عبادت", frequency: 83, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ص ل و", examples: ["أَقِيمُوا الصَّلَاةَ"] },
      { id: 92, arabic: "الزَّكَاةُ", transliteration: "az-zakaa", meaning: "Charity/Purification - Obligatory giving", meaningUrdu: "زکوٰۃ - فرض خیرات", frequency: 30, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ز ك و", examples: ["وَآتُوا الزَّكَاةَ"] },
      { id: 93, arabic: "الْحَجُّ", transliteration: "al-hajj", meaning: "Pilgrimage - Sacred journey to Mecca", meaningUrdu: "حج - مکہ کا مقدس سفر", frequency: 11, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ح ج ج", examples: ["وَلِلَّهِ عَلَى النَّاسِ حِجُّ الْبَيْتِ"] },
      { id: 94, arabic: "الصِّيَامُ", transliteration: "as-siyaam", meaning: "Fasting - Abstaining from food/drink", meaningUrdu: "روزہ - کھانے پینے سے پرہیز", frequency: 13, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ص و م", examples: ["كُتِبَ عَلَيْكُمُ الصِّيَامُ"] },
      { id: 95, arabic: "الذِّكْرُ", transliteration: "adh-dhikr", meaning: "Remembrance - Mindful recollection of Allah", meaningUrdu: "ذکر - اللہ کو یاد کرنا", frequency: 269, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ذ ك ر", examples: ["وَاذْكُرُوا اللَّهَ"] },

      // Family and relationships
      { id: 96, arabic: "الْأَبُ", transliteration: "al-ab", meaning: "The father - Male parent", meaningUrdu: "باپ - مرد والد", frequency: 104, difficulty: 1, category: "family", chapter: null, verse: null, rootWord: "ا ب و", examples: ["أَبِينَا إِبْرَاهِيمَ"] },
      { id: 97, arabic: "الْأُمُّ", transliteration: "al-umm", meaning: "The mother - Female parent", meaningUrdu: "ماں - عورت والد", frequency: 117, difficulty: 1, category: "family", chapter: null, verse: null, rootWord: "ا م م", examples: ["أُمَّهَاتُكُمْ"] },
      { id: 98, arabic: "الْأَخُ", transliteration: "al-akh", meaning: "The brother - Male sibling", meaningUrdu: "بھائی - مرد بہن بھائی", frequency: 102, difficulty: 1, category: "family", chapter: null, verse: null, rootWord: "ا خ و", examples: ["وَأَخُوهُ"] },
      { id: 99, arabic: "الْأُخْتُ", transliteration: "al-ukht", meaning: "The sister - Female sibling", meaningUrdu: "بہن - عورت بہن بھائی", frequency: 24, difficulty: 2, category: "family", chapter: null, verse: null, rootWord: "ا خ و", examples: ["أُخْتُهَا"] },
      { id: 100, arabic: "الْوَلَدُ", transliteration: "al-walad", meaning: "The child/son - Offspring", meaningUrdu: "بچہ - اولاد", frequency: 164, difficulty: 1, category: "family", chapter: null, verse: null, rootWord: "و ل د", examples: ["الْوَلَدُ الصَّالِحُ"] },

      // Body parts and human characteristics
      { id: 101, arabic: "الْقَلْبُ", transliteration: "al-qalb", meaning: "The heart - Center of emotions and faith", meaningUrdu: "دل - جذبات اور ایمان کا مرکز", frequency: 132, difficulty: 2, category: "anatomy", chapter: null, verse: null, rootWord: "ق ل ب", examples: ["فِي قُلُوبِهِم"] },
      { id: 102, arabic: "الْعَيْنُ", transliteration: "al-ayn", meaning: "The eye - Organ of sight", meaningUrdu: "آنکھ - بصارت کا عضو", frequency: 58, difficulty: 2, category: "anatomy", chapter: null, verse: null, rootWord: "ع ي ن", examples: ["أَعْيُنِهِمْ"] },
      { id: 103, arabic: "الْيَدُ", transliteration: "al-yad", meaning: "The hand - Limb for grasping", meaningUrdu: "ہاتھ - پکڑنے کا عضو", frequency: 120, difficulty: 1, category: "anatomy", chapter: null, verse: null, rootWord: "ي د د", examples: ["بِيَدِهِ"] },
      { id: 104, arabic: "الرَّأْسُ", transliteration: "ar-ra's", meaning: "The head - Upper part of body", meaningUrdu: "سر - جسم کا اوپری حصہ", frequency: 23, difficulty: 2, category: "anatomy", chapter: null, verse: null, rootWord: "ر ا س", examples: ["عَلَى رَأْسِهِ"] },
      { id: 105, arabic: "الْوَجْهُ", transliteration: "al-wajh", meaning: "The face - Front of head", meaningUrdu: "چہرہ - سر کا اگلا حصہ", frequency: 72, difficulty: 2, category: "anatomy", chapter: null, verse: null, rootWord: "و ج ه", examples: ["وَجْهَ اللَّهِ"] },

      // Essential actions and states
      { id: 106, arabic: "قَالَ", transliteration: "qaala", meaning: "He said/spoke - Past tense speech", meaningUrdu: "کہا - بولنے کا ماضی", frequency: 1722, difficulty: 1, category: "verbs", chapter: null, verse: null, rootWord: "ق و ل", examples: ["قَالَ رَبِّي"] },
      { id: 107, arabic: "يَقُولُ", transliteration: "yaqoolu", meaning: "He says/speaks - Present tense speech", meaningUrdu: "کہتا ہے - بولنے کا حال", frequency: 332, difficulty: 1, category: "verbs", chapter: null, verse: null, rootWord: "ق و ل", examples: ["يَقُولُ الْحَقَّ"] },
      { id: 108, arabic: "سَمِعَ", transliteration: "sami'a", meaning: "He heard - Past tense listening", meaningUrdu: "سنا - سننے کا ماضی", frequency: 185, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "س م ع", examples: ["سَمِعَ اللَّهُ"] },
      { id: 109, arabic: "يَسْمَعُ", transliteration: "yasma'u", meaning: "He hears - Present tense listening", meaningUrdu: "سنتا ہے - سننے کا حال", frequency: 45, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "س م ع", examples: ["يَسْمَعُ الدُّعَاءَ"] },
      { id: 110, arabic: "رَأَى", transliteration: "ra'aa", meaning: "He saw - Past tense seeing", meaningUrdu: "دیکھا - دیکھنے کا ماضی", frequency: 279, difficulty: 2, category: "verbs", chapter: null, verse: null, rootWord: "ر ا ي", examples: ["رَأَى آيَةً"] },

      // More essential particles and conjunctions
      { id: 111, arabic: "لَكِنْ", transliteration: "laakin", meaning: "But/However - Contrasting conjunction", meaningUrdu: "لیکن - تضاد کا حرف", frequency: 15, difficulty: 2, category: "conjunctions", chapter: null, verse: null, rootWord: "ل ك ن", examples: ["لَكِنِ اللَّهُ"] },
      { id: 112, arabic: "لَوْ", transliteration: "law", meaning: "If (hypothetical) - Conditional particle", meaningUrdu: "اگر - شرطیہ حرف", frequency: 131, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ل و", examples: ["لَوْ شَاءَ اللَّهُ"] },
      { id: 113, arabic: "أَوْ", transliteration: "aw", meaning: "Or - Alternative conjunction", meaningUrdu: "یا - متبادل حرف", frequency: 343, difficulty: 1, category: "conjunctions", chapter: null, verse: null, rootWord: "ا و", examples: ["جَنَّةٌ أَوْ نَارٌ"] },
      { id: 114, arabic: "بَلْ", transliteration: "bal", meaning: "Rather/Indeed - Emphatic correction", meaningUrdu: "بلکہ - تصحیح کا حرف", frequency: 44, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ب ل", examples: ["بَلْ أَنتُمْ"] },
      { id: 115, arabic: "إِذَا", transliteration: "idhaa", meaning: "When/If - Temporal/conditional", meaningUrdu: "جب - وقت کا حرف", frequency: 332, difficulty: 2, category: "particles", chapter: null, verse: null, rootWord: "ا ذ", examples: ["إِذَا جَاءَ"] },

      // Natural elements and creation
      { id: 116, arabic: "الْمَاءُ", transliteration: "al-maa'u", meaning: "Water - Essential liquid for life", meaningUrdu: "پانی - زندگی کے لیے لازمی مائع", frequency: 63, difficulty: 1, category: "creation", chapter: null, verse: null, rootWord: "م و ه", examples: ["مِنَ الْمَاءِ"] },
      { id: 117, arabic: "النُّورُ", transliteration: "an-noor", meaning: "Light - Divine illumination", meaningUrdu: "نور - الہی روشنی", frequency: 49, difficulty: 2, category: "creation", chapter: null, verse: null, rootWord: "ن و ر", examples: ["نُورٌ عَلَى نُورٍ"] },
      { id: 118, arabic: "الظُّلُمَاتُ", transliteration: "adh-dhulumat", meaning: "Darkness - Absence of light", meaningUrdu: "اندھیرے - روشنی کی غیر موجودگی", frequency: 23, difficulty: 3, category: "creation", chapter: null, verse: null, rootWord: "ظ ل م", examples: ["مِنَ الظُّلُمَاتِ"] },
      { id: 119, arabic: "الرِّيحُ", transliteration: "ar-reeh", meaning: "Wind - Moving air", meaningUrdu: "ہوا - حرکت کرنے والی فضا", frequency: 18, difficulty: 2, category: "creation", chapter: null, verse: null, rootWord: "ر و ح", examples: ["الرِّيحَ الطَّيِّبَةَ"] },
      { id: 120, arabic: "الشَّمْسُ", transliteration: "ash-shams", meaning: "The sun - Star providing light", meaningUrdu: "سورج - روشنی دینے والا ستارہ", frequency: 33, difficulty: 2, category: "creation", chapter: null, verse: null, rootWord: "ش م س", examples: ["وَالشَّمْسُ تَجْرِي"] },

      // More divine attributes and qualities
      { id: 121, arabic: "الْحَكِيمُ", transliteration: "al-hakeem", meaning: "The Wise - Possessing perfect wisdom", meaningUrdu: "حکیم - کامل حکمت والا", frequency: 97, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ح ك م", examples: ["إِنَّ اللَّهَ حَكِيمٌ"] },
      { id: 122, arabic: "الْعَزِيزُ", transliteration: "al-azeez", meaning: "The Mighty - Possessing absolute power", meaningUrdu: "عزیز - مطلق طاقت والا", frequency: 92, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "ع ز ز", examples: ["وَاللَّهُ عَزِيزٌ"] },
      { id: 123, arabic: "الْغَفُورُ", transliteration: "al-ghafoor", meaning: "The Forgiving - Who pardons sins", meaningUrdu: "غفور - گناہ معاف کرنے والا", frequency: 91, difficulty: 2, category: "attributes", chapter: null, verse: null, rootWord: "غ ف ر", examples: ["غَفُورٌ رَحِيمٌ"] },
      { id: 124, arabic: "الصَّبُورُ", transliteration: "as-saboor", meaning: "The Patient - Enduring with forbearance", meaningUrdu: "صبور - صبر کرنے والا", frequency: 3, difficulty: 3, category: "attributes", chapter: null, verse: null, rootWord: "ص ب ر", examples: ["وَاللَّهُ صَبُورٌ"] },
      { id: 125, arabic: "الشَّكُورُ", transliteration: "ash-shakoor", meaning: "The Appreciative - Recognizing good deeds", meaningUrdu: "شکور - نیک اعمال کی قدر کرنے والا", frequency: 4, difficulty: 3, category: "attributes", chapter: null, verse: null, rootWord: "ش ك ر", examples: ["شَكُورٌ حَلِيمٌ"] },

      // Essential emotions and states
      { id: 126, arabic: "الْخَوْفُ", transliteration: "al-khawf", meaning: "Fear - Feeling of apprehension", meaningUrdu: "خوف - ڈر کا احساس", frequency: 124, difficulty: 2, category: "emotions", chapter: null, verse: null, rootWord: "خ و ف", examples: ["لَا خَوْفٌ عَلَيْهِمْ"] },
      { id: 127, arabic: "الْحُزْنُ", transliteration: "al-huzn", meaning: "Sadness - Feeling of sorrow", meaningUrdu: "غم - رنج کا احساس", frequency: 38, difficulty: 2, category: "emotions", chapter: null, verse: null, rootWord: "ح ز ن", examples: ["وَلَا هُمْ يَحْزَنُونَ"] },
      { id: 128, arabic: "الْفَرَحُ", transliteration: "al-farah", meaning: "Joy - Feeling of happiness", meaningUrdu: "خوشی - مسرت کا احساس", frequency: 21, difficulty: 2, category: "emotions", chapter: null, verse: null, rootWord: "ف ر ح", examples: ["يَفْرَحُونَ بِمَا آتَاهُمُ"] },
      { id: 129, arabic: "الرَّجَاءُ", transliteration: "ar-rajaa'", meaning: "Hope - Expectation of good", meaningUrdu: "امید - اچھے کی توقع", frequency: 12, difficulty: 2, category: "emotions", chapter: null, verse: null, rootWord: "ر ج و", examples: ["يَرْجُونَ رَحْمَتَهُ"] },
      { id: 130, arabic: "الْحُبُّ", transliteration: "al-hubb", meaning: "Love - Deep affection", meaningUrdu: "محبت - گہری چاہت", frequency: 83, difficulty: 2, category: "emotions", chapter: null, verse: null, rootWord: "ح ب ب", examples: ["أَشَدُّ حُبّاً لِلَّهِ"] },

      // Guidance and misguidance
      { id: 131, arabic: "الْهُدَى", transliteration: "al-huda", meaning: "Guidance - Divine direction", meaningUrdu: "ہدایت - الہی رہنمائی", frequency: 234, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ه د ي", examples: ["إِنَّ هُدَى اللَّهِ"] },
      { id: 132, arabic: "الضَّلَالُ", transliteration: "ad-dalaal", meaning: "Misguidance - Being led astray", meaningUrdu: "گمراہی - بھٹک جانا", frequency: 61, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ض ل ل", examples: ["فِي ضَلَالٍ بَعِيدٍ"] },
      { id: 133, arabic: "الْحَقُّ", transliteration: "al-haqq", meaning: "Truth - Absolute reality", meaningUrdu: "حق - مطلق سچائی", frequency: 287, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ح ق ق", examples: ["وَقُلْ جَاءَ الْحَقُّ"] },
      { id: 134, arabic: "الْبَاطِلُ", transliteration: "al-baatil", meaning: "Falsehood - That which is untrue", meaningUrdu: "باطل - جو جھوٹا ہو", frequency: 36, difficulty: 2, category: "concepts", chapter: null, verse: null, rootWord: "ب ط ل", examples: ["وَزَهَقَ الْبَاطِلُ"] },
      { id: 135, arabic: "الْيَقِينُ", transliteration: "al-yaqeen", meaning: "Certainty - Complete conviction", meaningUrdu: "یقین - مکمل اعتماد", frequency: 19, difficulty: 3, category: "concepts", chapter: null, verse: null, rootWord: "ي ق ن", examples: ["عِلْمَ الْيَقِينِ"] },

      // Books and revelation
      { id: 136, arabic: "الْكِتَابُ", transliteration: "al-kitaab", meaning: "The Book - Divine scripture", meaningUrdu: "کتاب - الہی صحیفہ", frequency: 261, difficulty: 1, category: "revelation", chapter: null, verse: null, rootWord: "ك ت ب", examples: ["أَهْلَ الْكِتَابِ"] },
      { id: 137, arabic: "الْقُرْآنُ", transliteration: "al-qur'aan", meaning: "The Quran - Final revelation", meaningUrdu: "قرآن - آخری وحی", frequency: 70, difficulty: 1, category: "revelation", chapter: null, verse: null, rootWord: "ق ر ا", examples: ["إِنَّا أَنزَلْنَا الْقُرْآنَ"] },
      { id: 138, arabic: "التَّوْرَاةُ", transliteration: "at-tawraa", meaning: "The Torah - Book revealed to Moses", meaningUrdu: "توریت - موسیٰ کو نازل شدہ کتاب", frequency: 18, difficulty: 2, category: "revelation", chapter: null, verse: null, rootWord: "و ر ي", examples: ["وَأَنزَلْنَا التَّوْرَاةَ"] },
      { id: 139, arabic: "الْإِنجِيلُ", transliteration: "al-injeel", meaning: "The Gospel - Book revealed to Jesus", meaningUrdu: "انجیل - عیسیٰ کو نازل شدہ کتاب", frequency: 12, difficulty: 2, category: "revelation", chapter: null, verse: null, rootWord: "ن ج ل", examples: ["وَآتَيْنَاهُ الْإِنجِيلَ"] },
      { id: 140, arabic: "الْآيَةُ", transliteration: "al-aaya", meaning: "The verse/sign - Divine message", meaningUrdu: "آیت - الہی نشانی", frequency: 382, difficulty: 2, category: "revelation", chapter: null, verse: null, rootWord: "ا ي ي", examples: ["هَذِهِ آيَاتُ اللَّهِ"] },

      // Prophets and messengers  
      { id: 141, arabic: "النَّبِيُّ", transliteration: "an-nabiyy", meaning: "The Prophet - Divine messenger", meaningUrdu: "نبی - الہی پیغامبر", frequency: 75, difficulty: 2, category: "prophets", chapter: null, verse: null, rootWord: "ن ب ا", examples: ["النَّبِيُّ الْأُمِّيُّ"] },
      { id: 142, arabic: "الرَّسُولُ", transliteration: "ar-rasool", meaning: "The Messenger - One sent with message", meaningUrdu: "رسول - پیغام کے ساتھ بھیجا گیا", frequency: 332, difficulty: 2, category: "prophets", chapter: null, verse: null, rootWord: "ر س ل", examples: ["آمَنَّا بِالرَّسُولِ"] },
      { id: 143, arabic: "مُوسَى", transliteration: "moosa", meaning: "Moses - Prophet to whom Torah was revealed", meaningUrdu: "موسیٰ - نبی جسے توریت دی گئی", frequency: 136, difficulty: 2, category: "prophets", chapter: null, verse: null, rootWord: "م و س", examples: ["وَكَلَّمَ اللَّهُ مُوسَى"] },
      { id: 144, arabic: "عِيسَى", transliteration: "eesaa", meaning: "Jesus - Prophet to whom Gospel was revealed", meaningUrdu: "عیسیٰ - نبی جسے انجیل دی گئی", frequency: 25, difficulty: 2, category: "prophets", chapter: null, verse: null, rootWord: "ع ي س", examples: ["الْمَسِيحُ عِيسَى"] },
      { id: 145, arabic: "إِبْرَاهِيمُ", transliteration: "ibraaheem", meaning: "Abraham - Father of monotheistic faiths", meaningUrdu: "ابراہیم - توحیدی عقائد کے باپ", frequency: 69, difficulty: 2, category: "prophets", chapter: null, verse: null, rootWord: "ب ر ه", examples: ["إِبْرَاهِيمَ خَلِيلاً"] },

      // Angels and spiritual beings
      { id: 146, arabic: "الْمَلَائِكَةُ", transliteration: "al-malaa'ika", meaning: "Angels - Celestial beings", meaningUrdu: "فرشتے - آسمانی مخلوق", frequency: 88, difficulty: 2, category: "spiritual", chapter: null, verse: null, rootWord: "م ل ا", examples: ["وَالْمَلَائِكَةُ يُسَبِّحُونَ"] },
      { id: 147, arabic: "جِبْرِيلُ", transliteration: "jibreel", meaning: "Gabriel - Archangel of revelation", meaningUrdu: "جبرائیل - وحی لانے والا فرشتہ", frequency: 3, difficulty: 3, category: "spiritual", chapter: null, verse: null, rootWord: "ج ب ر", examples: ["جِبْرِيلُ عَلَيْهِ السَّلَامُ"] },
      { id: 148, arabic: "الشَّيْطَانُ", transliteration: "ash-shaytaan", meaning: "Satan - The tempter and deceiver", meaningUrdu: "شیطان - وسوسہ ڈالنے والا", frequency: 88, difficulty: 2, category: "spiritual", chapter: null, verse: null, rootWord: "ش ط ن", examples: ["مِنَ الشَّيْطَانِ الرَّجِيمِ"] },
      { id: 149, arabic: "الْجِنُّ", transliteration: "al-jinn", meaning: "Jinn - Beings created from fire", meaningUrdu: "جن - آگ سے بنی مخلوق", frequency: 22, difficulty: 2, category: "spiritual", chapter: null, verse: null, rootWord: "ج ن ن", examples: ["وَمَا خَلَقْتُ الْجِنَّ"] },
      { id: 150, arabic: "الرُّوحُ", transliteration: "ar-rooh", meaning: "The Spirit - Divine breath/soul", meaningUrdu: "روح - الہی سانس/نفس", frequency: 21, difficulty: 3, category: "spiritual", chapter: null, verse: null, rootWord: "ر و ح", examples: ["رُوحُ الْقُدُسِ"] },

      // Actions of worship and obedience
      { id: 151, arabic: "سَجَدَ", transliteration: "sajada", meaning: "Prostrated - Bowed in worship", meaningUrdu: "سجدہ کیا - عبادت میں جھکا", frequency: 92, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "س ج د", examples: ["وَسَجَدَ لِلَّهِ"] },
      { id: 152, arabic: "رَكَعَ", transliteration: "raka'a", meaning: "Bowed - Bent in prayer position", meaningUrdu: "رکوع کیا - نماز میں جھکا", frequency: 13, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ر ك ع", examples: ["الرَّاكِعِينَ السَّاجِدِينَ"] },
      { id: 153, arabic: "دَعَا", transliteration: "da'aa", meaning: "Called upon/prayed - Invoked", meaningUrdu: "دعا کی - پکارا", frequency: 212, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "د ع و", examples: ["وَادْعُوا اللَّهَ"] },
      { id: 154, arabic: "شَكَرَ", transliteration: "shakara", meaning: "Thanked - Expressed gratitude", meaningUrdu: "شکر کیا - احسان مانا", frequency: 75, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ش ك ر", examples: ["وَاشْكُرُوا لِي"] },
      { id: 155, arabic: "تَابَ", transliteration: "taaba", meaning: "Repented - Turned back to righteousness", meaningUrdu: "توبہ کی - نیکی کی طرف لوٹا", frequency: 87, difficulty: 2, category: "worship", chapter: null, verse: null, rootWord: "ت و ب", examples: ["ثُمَّ تَابَ عَلَيْهِمْ"] },

      // Moral qualities and character
      { id: 156, arabic: "الصِّدْقُ", transliteration: "as-sidq", meaning: "Truthfulness - Quality of being honest", meaningUrdu: "سچائی - ایمانداری کا وصف", frequency: 152, difficulty: 2, category: "character", chapter: null, verse: null, rootWord: "ص د ق", examples: ["مَعَ الصَّادِقِينَ"] },
      { id: 157, arabic: "الصَّبْرُ", transliteration: "as-sabr", meaning: "Patience - Enduring with perseverance", meaningUrdu: "صبر - ثابت قدمی سے برداشت", frequency: 103, difficulty: 2, category: "character", chapter: null, verse: null, rootWord: "ص ب ر", examples: ["وَبَشِّرِ الصَّابِرِينَ"] },
      { id: 158, arabic: "الْعَدْلُ", transliteration: "al-adl", meaning: "Justice - Fairness and equity", meaningUrdu: "عدل - انصاف اور برابری", frequency: 28, difficulty: 2, category: "character", chapter: null, verse: null, rootWord: "ع د ل", examples: ["إِنَّ اللَّهَ يَأْمُرُ بِالْعَدْلِ"] },
      { id: 159, arabic: "الإِحْسَانُ", transliteration: "al-ihsaan", meaning: "Excellence - Doing good beyond obligation", meaningUrdu: "احسان - فرض سے زیادہ نیکی", frequency: 194, difficulty: 2, category: "character", chapter: null, verse: null, rootWord: "ح س ن", examples: ["وَالْإِحْسَانِ"] },
      { id: 160, arabic: "التَّقْوَى", transliteration: "at-taqwa", meaning: "God-consciousness - Awareness of Allah", meaningUrdu: "تقویٰ - اللہ کا خوف اور ڈر", frequency: 251, difficulty: 2, category: "character", chapter: null, verse: null, rootWord: "و ق ي", examples: ["وَلِبَاسُ التَّقْوَى"] },

      // Sustenance and provisions
      { id: 161, arabic: "الرِّزْقُ", transliteration: "ar-rizq", meaning: "Sustenance - Divinely provided livelihood", meaningUrdu: "رزق - خدا کی طرف سے روزی", frequency: 123, difficulty: 2, category: "sustenance", chapter: null, verse: null, rootWord: "ر ز ق", examples: ["وَارْزُقْنَا"] },
      { id: 162, arabic: "الطَّعَامُ", transliteration: "at-ta'aam", meaning: "Food - Nourishment for the body", meaningUrdu: "کھانا - جسم کی غذا", frequency: 48, difficulty: 1, category: "sustenance", chapter: null, verse: null, rootWord: "ط ع م", examples: ["وَمِنَ الطَّعَامِ"] },
      { id: 163, arabic: "الثَّمَرُ", transliteration: "ath-thamar", meaning: "Fruit - Natural produce from trees", meaningUrdu: "پھل - درختوں کی پیداوار", frequency: 38, difficulty: 2, category: "sustenance", chapter: null, verse: null, rootWord: "ث م ر", examples: ["مِن كُلِّ الثَّمَرَاتِ"] },
      { id: 164, arabic: "اللَّبَنُ", transliteration: "al-laban", meaning: "Milk - Nutritious white liquid", meaningUrdu: "دودھ - غذائی سفید مائع", frequency: 2, difficulty: 2, category: "sustenance", chapter: null, verse: null, rootWord: "ل ب ن", examples: ["أَنْهَارٌ مِّن لَّبَنٍ"] },
      { id: 165, arabic: "الْعَسَلُ", transliteration: "al-asal", meaning: "Honey - Sweet substance from bees", meaningUrdu: "شہد - شہد کی مکھیوں کا میٹھا مادہ", frequency: 2, difficulty: 2, category: "sustenance", chapter: null, verse: null, rootWord: "ع س ل", examples: ["عَسَلٌ مُّصَفًّى"] },

      // Natural phenomena and creation
      { id: 166, arabic: "الْمَطَرُ", transliteration: "al-matar", meaning: "Rain - Water falling from sky", meaningUrdu: "بارش - آسمان سے گرنے والا پانی", frequency: 29, difficulty: 2, category: "nature", chapter: null, verse: null, rootWord: "م ط ر", examples: ["وَأَنزَلَ مِنَ السَّمَاءِ مَاءً"] },
      { id: 167, arabic: "السَّحَابُ", transliteration: "as-sahaab", meaning: "Clouds - Water vapor formations", meaningUrdu: "بادل - پانی کے بخارات کا مجموعہ", frequency: 16, difficulty: 2, category: "nature", chapter: null, verse: null, rootWord: "س ح ب", examples: ["السَّحَابِ الْمُسَخَّرِ"] },
      { id: 168, arabic: "الْبَرْقُ", transliteration: "al-barq", meaning: "Lightning - Electrical discharge in sky", meaningUrdu: "بجلی - آسمان میں برقی خارج", frequency: 6, difficulty: 2, category: "nature", chapter: null, verse: null, rootWord: "ب ر ق", examples: ["يُرِيكُمُ الْبَرْقَ"] },
      { id: 169, arabic: "الرَّعْدُ", transliteration: "ar-ra'd", meaning: "Thunder - Sound following lightning", meaningUrdu: "گرج - بجلی کے بعد آواز", frequency: 2, difficulty: 2, category: "nature", chapter: null, verse: null, rootWord: "ر ع د", examples: ["وَيُسَبِّحُ الرَّعْدُ"] },
      { id: 170, arabic: "الْجِبَالُ", transliteration: "al-jibaal", meaning: "Mountains - High elevations of earth", meaningUrdu: "پہاڑ - زمین کی بلندیاں", frequency: 39, difficulty: 2, category: "nature", chapter: null, verse: null, rootWord: "ج ب ل", examples: ["وَالْجِبَالَ أَوْتَاداً"] },

      // Time periods and divisions
      { id: 171, arabic: "الْفَجْرُ", transliteration: "al-fajr", meaning: "Dawn - Early morning light", meaningUrdu: "فجر - صبح کی روشنی", frequency: 2, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ف ج ر", examples: ["وَالْفَجْرِ"] },
      { id: 172, arabic: "الظُّهْرُ", transliteration: "adh-dhuhr", meaning: "Midday - Middle of the day", meaningUrdu: "ظہر - دن کا وسط", frequency: 1, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ظ ه ر", examples: ["صَلَاةُ الظُّهْرِ"] },
      { id: 173, arabic: "الْعَصْرُ", transliteration: "al-asr", meaning: "Afternoon - Late day period", meaningUrdu: "عصر - دن کا آخری حصہ", frequency: 2, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ع ص ر", examples: ["وَالْعَصْرِ"] },
      { id: 174, arabic: "الْمَغْرِبُ", transliteration: "al-maghrib", meaning: "Sunset - Evening twilight", meaningUrdu: "مغرب - شام کا وقت", frequency: 14, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "غ ر ب", examples: ["مَغْرِبِ الشَّمْسِ"] },
      { id: 175, arabic: "الْعِشَاءُ", transliteration: "al-ishaa'", meaning: "Night - Dark period after sunset", meaningUrdu: "عشاء - غروب کے بعد اندھیرا", frequency: 1, difficulty: 2, category: "time", chapter: null, verse: null, rootWord: "ع ش و", examples: ["صَلَاةُ الْعِشَاءِ"] },

      // Social relationships and community
      { id: 176, arabic: "الْجَارُ", transliteration: "al-jaar", meaning: "Neighbor - One living nearby", meaningUrdu: "پڑوسی - قریب رہنے والا", frequency: 6, difficulty: 2, category: "social", chapter: null, verse: null, rootWord: "ج و ر", examples: ["وَالْجَارِ ذِي الْقُرْبَى"] },
      { id: 177, arabic: "الضَّيْفُ", transliteration: "ad-dayf", meaning: "Guest - Visitor receiving hospitality", meaningUrdu: "مہمان - مہمانی پانے والا", frequency: 3, difficulty: 2, category: "social", chapter: null, verse: null, rootWord: "ض ي ف", examples: ["أَضْيَافِ إِبْرَاهِيمَ"] },
      { id: 178, arabic: "الْيَتِيمُ", transliteration: "al-yateem", meaning: "Orphan - Child without parents", meaningUrdu: "یتیم - والدین کے بغیر بچہ", frequency: 23, difficulty: 2, category: "social", chapter: null, verse: null, rootWord: "ي ت م", examples: ["فَأَمَّا الْيَتِيمَ"] },
      { id: 179, arabic: "الْمِسْكِينُ", transliteration: "al-miskeen", meaning: "Poor person - One in need", meaningUrdu: "مسکین - ضرورت مند شخص", frequency: 25, difficulty: 2, category: "social", chapter: null, verse: null, rootWord: "س ك ن", examples: ["وَالْمِسْكِينَ"] },
      { id: 180, arabic: "الْفَقِيرُ", transliteration: "al-faqeer", meaning: "Needy person - One lacking resources", meaningUrdu: "فقیر - وسائل کی کمی والا", frequency: 13, difficulty: 2, category: "social", chapter: null, verse: null, rootWord: "ف ق ر", examples: ["لِلْفُقَرَاءِ"] },

      // Commerce and transactions
      { id: 181, arabic: "الْبَيْعُ", transliteration: "al-bay'", meaning: "Selling - Commercial transaction", meaningUrdu: "بیچنا - تجارتی لین دین", frequency: 7, difficulty: 2, category: "commerce", chapter: null, verse: null, rootWord: "ب ي ع", examples: ["وَأَحَلَّ اللَّهُ الْبَيْعَ"] },
      { id: 182, arabic: "الرِّبَا", transliteration: "ar-ribaa", meaning: "Usury/Interest - Prohibited increase", meaningUrdu: "سود - حرام اضافہ", frequency: 20, difficulty: 2, category: "commerce", chapter: null, verse: null, rootWord: "ر ب و", examples: ["وَحَرَّمَ الرِّبَا"] },
      { id: 183, arabic: "الدَّيْنُ", transliteration: "ad-dayn", meaning: "Debt - Money owed", meaningUrdu: "قرض - واجب الادا رقم", frequency: 15, difficulty: 2, category: "commerce", chapter: null, verse: null, rootWord: "د ي ن", examples: ["إِذَا تَدَايَنتُم بِدَيْنٍ"] },
      { id: 184, arabic: "الْأَجْرُ", transliteration: "al-ajr", meaning: "Reward/Wage - Payment for work", meaningUrdu: "اجر - کام کا معاوضہ", frequency: 105, difficulty: 2, category: "commerce", chapter: null, verse: null, rootWord: "ا ج ر", examples: ["أَجْرُهُمْ عِندَ رَبِّهِمْ"] },
      { id: 185, arabic: "الْمَالُ", transliteration: "al-maal", meaning: "Wealth/Property - Material possessions", meaningUrdu: "مال - مادی املاک", frequency: 86, difficulty: 2, category: "commerce", chapter: null, verse: null, rootWord: "م و ل", examples: ["وَالْمَالُ وَالْبَنُونَ"] },

      // Clothing and adornment
      { id: 186, arabic: "الثِّيَابُ", transliteration: "ath-thiyaab", meaning: "Clothes - Garments for covering", meaningUrdu: "کپڑے - ڈھانپنے کے لیے لباس", frequency: 8, difficulty: 2, category: "material", chapter: null, verse: null, rootWord: "ث و ب", examples: ["وَثِيَابَكَ فَطَهِّرْ"] },
      { id: 187, arabic: "الْحُلِيُّ", transliteration: "al-huliyy", meaning: "Jewelry/Ornament - Decorative items", meaningUrdu: "زیورات - آرائشی اشیاء", frequency: 3, difficulty: 3, category: "material", chapter: null, verse: null, rootWord: "ح ل ي", examples: ["يُحَلَّوْنَ فِيهَا مِنْ أَسَاوِرَ"] },
      { id: 188, arabic: "الْخَاتَمُ", transliteration: "al-khaatam", meaning: "Ring/Seal - Circular ornament", meaningUrdu: "انگوٹھی - گول زیور", frequency: 2, difficulty: 2, category: "material", chapter: null, verse: null, rootWord: "خ ت م", examples: ["خَاتَمُ النَّبِيِّينَ"] },
      { id: 189, arabic: "النَّعْلُ", transliteration: "an-na'l", meaning: "Sandal - Footwear protection", meaningUrdu: "جوتا - پاؤں کی حفاظت", frequency: 2, difficulty: 2, category: "material", chapter: null, verse: null, rootWord: "ن ع ل", examples: ["فَاخْلَعْ نَعْلَيْكَ"] },
      { id: 190, arabic: "الْقَمِيصُ", transliteration: "al-qamees", meaning: "Shirt/Tunic - Upper body garment", meaningUrdu: "قمیص - اوپری لباس", frequency: 4, difficulty: 2, category: "material", chapter: null, verse: null, rootWord: "ق م ص", examples: ["قَمِيصِ يُوسُفَ"] },

      // Animals and creatures  
      { id: 191, arabic: "الْبَقَرُ", transliteration: "al-baqar", meaning: "Cattle - Domesticated bovine animals", meaningUrdu: "گائے - پالتو مویشی", frequency: 9, difficulty: 2, category: "animals", chapter: null, verse: null, rootWord: "ب ق ر", examples: ["بَقَرَةٌ صَفْرَاءُ"] },
      { id: 192, arabic: "الْغَنَمُ", transliteration: "al-ghanam", meaning: "Sheep - Wool-bearing livestock", meaningUrdu: "بھیڑ - اون دینے والے مویشی", frequency: 8, difficulty: 2, category: "animals", chapter: null, verse: null, rootWord: "غ ن م", examples: ["مِنَ الْغَنَمِ"] },
      { id: 193, arabic: "الْإِبِلُ", transliteration: "al-ibil", meaning: "Camels - Desert transport animals", meaningUrdu: "اونٹ - صحرائی سواری کے جانور", frequency: 4, difficulty: 2, category: "animals", chapter: null, verse: null, rootWord: "ا ب ل", examples: ["أَفَلَا يَنظُرُونَ إِلَى الْإِبِلِ"] },
      { id: 194, arabic: "الْخَيْلُ", transliteration: "al-khayl", meaning: "Horses - Riding and war animals", meaningUrdu: "گھوڑے - سواری اور جنگی جانور", frequency: 5, difficulty: 2, category: "animals", chapter: null, verse: null, rootWord: "خ ي ل", examples: ["وَالْخَيْلَ وَالْبِغَالَ"] },
      { id: 195, arabic: "الطَّيْرُ", transliteration: "at-tayr", meaning: "Birds - Flying creatures", meaningUrdu: "پرندے - اڑنے والی مخلوق", frequency: 18, difficulty: 2, category: "animals", chapter: null, verse: null, rootWord: "ط ي ر", examples: ["وَالطَّيْرَ صَافَّاتٍ"] },

      // Building and construction
      { id: 196, arabic: "الْبَيْتُ", transliteration: "al-bayt", meaning: "House - Place of dwelling", meaningUrdu: "گھر - رہنے کی جگہ", frequency: 74, difficulty: 1, category: "dwelling", chapter: null, verse: null, rootWord: "ب ي ت", examples: ["بَيْتِيَ الْحَرَامِ"] },
      { id: 197, arabic: "الْقَصْرُ", transliteration: "al-qasr", meaning: "Palace - Grand residence", meaningUrdu: "محل - شاندار رہائش", frequency: 4, difficulty: 2, category: "dwelling", chapter: null, verse: null, rootWord: "ق ص ر", examples: ["قُصُورٌ مَّشِيدَةٌ"] },
      { id: 198, arabic: "الْمَسْجِدُ", transliteration: "al-masjid", meaning: "Mosque - Place of worship", meaningUrdu: "مسجد - عبادت کی جگہ", frequency: 28, difficulty: 2, category: "dwelling", chapter: null, verse: null, rootWord: "س ج د", examples: ["الْمَسْجِدِ الْحَرَامِ"] },
      { id: 199, arabic: "السُّوقُ", transliteration: "as-sooq", meaning: "Market - Place of commerce", meaningUrdu: "بازار - تجارت کی جگہ", frequency: 3, difficulty: 2, category: "dwelling", chapter: null, verse: null, rootWord: "س و ق", examples: ["وَيَمْشُونَ فِي الْأَسْوَاقِ"] },
      { id: 200, arabic: "الْحَدِيقَةُ", transliteration: "al-hadeeqa", meaning: "Garden - Cultivated green space", meaningUrdu: "باغ - کاشت شدہ سبز جگہ", frequency: 4, difficulty: 2, category: "dwelling", chapter: null, verse: null, rootWord: "ح د ق", examples: ["حَدَائِقَ ذَاتَ بَهْجَةٍ"] }
    ];

    sampleWords.forEach(word => {
      this.words.set(word.id, word);
      this.currentWordId = Math.max(this.currentWordId, word.id + 1);
    });

    // Sample user
    const demoUser: User = {
      id: 1,
      username: "demo_user",
      email: "demo@example.com",
      xp: 1250,
      level: 5,
      streak: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(demoUser.id, demoUser);
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
    const user: User = {
      id: this.currentUserId++,
      ...insertUser,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Word operations
  async getWords(limit = 50, difficulty?: number): Promise<Word[]> {
    let words = Array.from(this.words.values());
    
    if (difficulty !== undefined) {
      words = words.filter(word => word.difficulty === difficulty);
    }
    
    return words.slice(0, limit);
  }

  async getWord(id: number): Promise<Word | undefined> {
    return this.words.get(id);
  }

  async createWord(insertWord: InsertWord): Promise<Word> {
    const word: Word = {
      id: this.currentWordId++,
      ...insertWord,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.words.set(word.id, word);
    return word;
  }

  async getWordsByFrequency(limit: number): Promise<Word[]> {
    return Array.from(this.words.values())
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, limit);
  }

  // Stub implementations for other methods
  async getUserWordProgress(userId: number, wordId: number): Promise<UserWordProgress | undefined> {
    return Array.from(this.userWordProgress.values())
      .find(progress => progress.userId === userId && progress.wordId === wordId);
  }

  async createUserWordProgress(insertProgress: InsertUserWordProgress): Promise<UserWordProgress> {
    const progress: UserWordProgress = {
      id: this.currentProgressId++,
      ...insertProgress,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userWordProgress.set(progress.id, progress);
    return progress;
  }

  async updateUserWordProgress(id: number, updates: Partial<UserWordProgress>): Promise<UserWordProgress | undefined> {
    const progress = this.userWordProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates, updatedAt: new Date() };
    this.userWordProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  async getUserLearnedWords(userId: number): Promise<UserWordProgress[]> {
    return Array.from(this.userWordProgress.values())
      .filter(progress => progress.userId === userId && progress.masteryLevel >= 3);
  }

  async getUserWordsForReview(userId: number): Promise<UserWordProgress[]> {
    const now = new Date();
    return Array.from(this.userWordProgress.values())
      .filter(progress => 
        progress.userId === userId && 
        progress.nextReview && 
        new Date(progress.nextReview) <= now
      );
  }

  // Achievement operations
  async getAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }

  async getUserAchievements(userId: number): Promise<UserAchievement[]> {
    return Array.from(this.userAchievements.values())
      .filter(ua => ua.userId === userId);
  }

  async createUserAchievement(insertUserAchievement: InsertUserAchievement): Promise<UserAchievement> {
    const userAchievement: UserAchievement = {
      id: this.currentUserAchievementId++,
      ...insertUserAchievement,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userAchievements.set(userAchievement.id, userAchievement);
    return userAchievement;
  }

  // Challenge operations
  async getActiveChallenges(): Promise<Challenge[]> {
    const now = new Date();
    return Array.from(this.challenges.values())
      .filter(challenge => new Date(challenge.endDate) > now);
  }

  async getUserChallengeProgress(userId: number, challengeId: number): Promise<UserChallengeProgress | undefined> {
    return Array.from(this.userChallengeProgress.values())
      .find(progress => progress.userId === userId && progress.challengeId === challengeId);
  }

  async createUserChallengeProgress(insertProgress: InsertUserChallengeProgress): Promise<UserChallengeProgress> {
    const progress: UserChallengeProgress = {
      id: this.currentChallengeProgressId++,
      ...insertProgress,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userChallengeProgress.set(progress.id, progress);
    return progress;
  }

  async updateUserChallengeProgress(id: number, updates: Partial<UserChallengeProgress>): Promise<UserChallengeProgress | undefined> {
    const progress = this.userChallengeProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates, updatedAt: new Date() };
    this.userChallengeProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Learning streak operations
  async getUserLearningStreak(userId: number): Promise<LearningStreak | undefined> {
    return Array.from(this.learningStreaks.values())
      .find(streak => streak.userId === userId);
  }

  async createLearningStreak(insertStreak: InsertLearningStreak): Promise<LearningStreak> {
    const streak: LearningStreak = {
      id: this.currentStreakId++,
      ...insertStreak,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.learningStreaks.set(streak.id, streak);
    return streak;
  }

  async updateLearningStreak(id: number, updates: Partial<LearningStreak>): Promise<LearningStreak | undefined> {
    const streak = this.learningStreaks.get(id);
    if (!streak) return undefined;
    
    const updatedStreak = { ...streak, ...updates, updatedAt: new Date() };
    this.learningStreaks.set(id, updatedStreak);
    return updatedStreak;
  }

  // Leaderboard
  async getLeaderboard(limit: number): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.xp - a.xp)
      .slice(0, limit);
  }

  // Family operations - stub implementations
  async createFamily(insertFamily: InsertFamily): Promise<Family> {
    const family: Family = {
      id: this.currentFamilyId++,
      ...insertFamily,
      createdAt: new Date(),
      updatedAt: new Date()
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
      ...insertMember,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.familyMembers.set(member.id, member);
    return member;
  }

  async updateFamilyMember(id: number, updates: Partial<FamilyMember>): Promise<FamilyMember | undefined> {
    const member = this.familyMembers.get(id);
    if (!member) return undefined;
    
    const updatedMember = { ...member, ...updates, updatedAt: new Date() };
    this.familyMembers.set(id, updatedMember);
    return updatedMember;
  }

  async getUserFamily(userId: number): Promise<Family | undefined> {
    const member = Array.from(this.familyMembers.values())
      .find(member => member.userId === userId);
    
    if (!member) return undefined;
    return this.getFamily(member.familyId);
  }

  // Family challenge operations - stub implementations
  async createFamilyChallenge(insertChallenge: InsertFamilyChallenge): Promise<FamilyChallenge> {
    const challenge: FamilyChallenge = {
      id: this.currentFamilyChallengeId++,
      ...insertChallenge,
      createdAt: new Date(),
      updatedAt: new Date()
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
      ...insertProgress,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.familyChallengeProgress.set(progress.id, progress);
    return progress;
  }

  async updateFamilyChallengeProgress(id: number, updates: Partial<FamilyChallengeProgress>): Promise<FamilyChallengeProgress | undefined> {
    const progress = this.familyChallengeProgress.get(id);
    if (!progress) return undefined;
    
    const updatedProgress = { ...progress, ...updates, updatedAt: new Date() };
    this.familyChallengeProgress.set(id, updatedProgress);
    return updatedProgress;
  }

  // Daily reminder operations - stub implementations
  async getUserReminder(userId: number): Promise<DailyReminder | undefined> {
    return Array.from(this.dailyReminders.values())
      .find(reminder => reminder.userId === userId);
  }

  async createReminder(insertReminder: InsertDailyReminder): Promise<DailyReminder> {
    const reminder: DailyReminder = {
      id: this.currentReminderId++,
      ...insertReminder,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.dailyReminders.set(reminder.id, reminder);
    return reminder;
  }

  async updateReminder(id: number, updates: Partial<DailyReminder>): Promise<DailyReminder | undefined> {
    const reminder = this.dailyReminders.get(id);
    if (!reminder) return undefined;
    
    const updatedReminder = { ...reminder, ...updates, updatedAt: new Date() };
    this.dailyReminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async getRemindersToSend(): Promise<DailyReminder[]> {
    const now = new Date();
    const currentHour = now.getHours();
    
    return Array.from(this.dailyReminders.values())
      .filter(reminder => reminder.enabled && reminder.time === currentHour);
  }
}

export const storage = new MemStorage();