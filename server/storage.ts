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
      { id: 80, arabic: "خَمْسَةٌ", transliteration: "khamsa", meaning: "Five - Cardinal number", meaningUrdu: "پانچ - تعداد", frequency: 4, difficulty: 2, category: "numbers", chapter: null, verse: null, rootWord: "خ م س", examples: ["خَمْسَةُ أَصْحَابٍ"] }
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