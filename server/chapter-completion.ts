import { db } from "./db";
import { chapterCompletions, userWordProgress, users } from "../shared/schema";
import { eq, and, count } from "drizzle-orm";
import type { InsertChapterCompletion, ChapterCompletion } from "../shared/schema";

// Chapter name mapping for all 114 Quran chapters
export const CHAPTER_NAMES: Record<number, string> = {
  1: "Al-Fatiha", 2: "Al-Baqarah", 3: "Ali 'Imran", 4: "An-Nisa", 5: "Al-Ma'idah",
  6: "Al-An'am", 7: "Al-A'raf", 8: "Al-Anfal", 9: "At-Tawbah", 10: "Yunus",
  11: "Hud", 12: "Yusuf", 13: "Ar-Ra'd", 14: "Ibrahim", 15: "Al-Hijr",
  16: "An-Nahl", 17: "Al-Isra", 18: "Al-Kahf", 19: "Maryam", 20: "Taha",
  21: "Al-Anbiya", 22: "Al-Hajj", 23: "Al-Mu'minun", 24: "An-Nur", 25: "Al-Furqan",
  26: "Ash-Shu'ara", 27: "An-Naml", 28: "Al-Qasas", 29: "Al-'Ankabut", 30: "Ar-Rum",
  31: "Luqman", 32: "As-Sajdah", 33: "Al-Ahzab", 34: "Saba", 35: "Fatir",
  36: "Ya-Sin", 37: "As-Saffat", 38: "Sad", 39: "Az-Zumar", 40: "Ghafir",
  41: "Fussilat", 42: "Ash-Shura", 43: "Az-Zukhruf", 44: "Ad-Dukhan", 45: "Al-Jathiyah",
  46: "Al-Ahqaf", 47: "Muhammad", 48: "Al-Fath", 49: "Al-Hujurat", 50: "Qaf",
  51: "Adh-Dhariyat", 52: "At-Tur", 53: "An-Najm", 54: "Al-Qamar", 55: "Ar-Rahman",
  56: "Al-Waqi'ah", 57: "Al-Hadid", 58: "Al-Mujadila", 59: "Al-Hashr", 60: "Al-Mumtahanah",
  61: "As-Saff", 62: "Al-Jumu'ah", 63: "Al-Munafiqun", 64: "At-Taghabun", 65: "At-Talaq",
  66: "At-Tahrim", 67: "Al-Mulk", 68: "Al-Qalam", 69: "Al-Haqqah", 70: "Al-Ma'arij",
  71: "Nuh", 72: "Al-Jinn", 73: "Al-Muzzammil", 74: "Al-Muddaththir", 75: "Al-Qiyamah",
  76: "Al-Insan", 77: "Al-Mursalat", 78: "An-Naba", 79: "An-Nazi'at", 80: "Abasa",
  81: "At-Takwir", 82: "Al-Infitar", 83: "Al-Mutaffifin", 84: "Al-Inshiqaq", 85: "Al-Buruj",
  86: "At-Tariq", 87: "Al-A'la", 88: "Al-Ghashiyah", 89: "Al-Fajr", 90: "Al-Balad",
  91: "Ash-Shams", 92: "Al-Layl", 93: "Ad-Duha", 94: "Ash-Sharh", 95: "At-Tin",
  96: "Al-'Alaq", 97: "Al-Qadr", 98: "Al-Bayyinah", 99: "Az-Zalzalah", 100: "Al-'Adiyat",
  101: "Al-Qari'ah", 102: "At-Takathur", 103: "Al-'Asr", 104: "Al-Humazah", 105: "Al-Fil",
  106: "Quraysh", 107: "Al-Ma'un", 108: "Al-Kawthar", 109: "Al-Kafirun", 110: "An-Nasr",
  111: "Al-Masad", 112: "Al-Ikhlas", 113: "Al-Falaq", 114: "An-Nas"
};

export interface ChapterProgress {
  chapterId: number;
  chapterName: string;
  wordsLearned: number;
  totalWords: number;
  masteryPercentage: number;
  isCompleted: boolean;
  completion?: ChapterCompletion;
}

export class ChapterCompletionService {
  
  async checkChapterCompletion(userId: number, chapterId: number): Promise<ChapterProgress> {
    const chapterName = CHAPTER_NAMES[chapterId] || `Chapter ${chapterId}`;
    
    // Get all words for this chapter from storage
    const { storage } = await import("./storage");
    const allWords = await storage.getWords(800);
    const chapterWords = allWords.filter(word => word.chapter === chapterId);
    const totalWords = chapterWords.length;
    
    if (totalWords === 0) {
      return {
        chapterId,
        chapterName,
        wordsLearned: 0,
        totalWords: 0,
        masteryPercentage: 0,
        isCompleted: false
      };
    }
    
    // Count learned words (mastery level >= 2 = Silver or Gold)
    const learnedWords = await db
      .select({ count: count() })
      .from(userWordProgress)
      .where(
        and(
          eq(userWordProgress.userId, userId),
          eq(userWordProgress.masteryLevel, 2) // Silver level or higher
        )
      );
    
    const wordsLearned = learnedWords[0]?.count || 0;
    const masteryPercentage = Math.round((wordsLearned / totalWords) * 100);
    const isCompleted = masteryPercentage >= 80; // 80% mastery for completion
    
    // Check existing completion record
    const existingCompletion = await db
      .select()
      .from(chapterCompletions)
      .where(
        and(
          eq(chapterCompletions.userId, userId),
          eq(chapterCompletions.chapterId, chapterId)
        )
      )
      .limit(1);
    
    return {
      chapterId,
      chapterName,
      wordsLearned,
      totalWords,
      masteryPercentage,
      isCompleted,
      completion: existingCompletion[0]
    };
  }
  
  async recordChapterCompletion(
    userId: number, 
    chapterId: number, 
    studyTimeMinutes: number = 0
  ): Promise<ChapterCompletion> {
    const progress = await this.checkChapterCompletion(userId, chapterId);
    
    if (!progress.isCompleted) {
      throw new Error(`Chapter ${progress.chapterName} is not yet completed (${progress.masteryPercentage}% mastery)`);
    }
    
    // Check if already recorded
    if (progress.completion) {
      return progress.completion;
    }
    
    const completionData: InsertChapterCompletion = {
      userId,
      chapterId,
      chapterName: progress.chapterName,
      wordsLearned: progress.wordsLearned,
      totalWords: progress.totalWords,
      masteryPercentage: progress.masteryPercentage,
      studyTimeMinutes,
      certificateIssued: true
    };
    
    const [completion] = await db
      .insert(chapterCompletions)
      .values(completionData)
      .returning();
    
    // Award bonus XP for chapter completion
    await db
      .update(users)
      .set({ 
        xp: db.raw('xp + ?', [progress.totalWords * 50]) // 50 XP per word in chapter
      })
      .where(eq(users.id, userId));
    
    console.log(`Chapter completion recorded: ${progress.chapterName} for user ${userId}`);
    return completion;
  }
  
  async getUserChapterCompletions(userId: number): Promise<ChapterCompletion[]> {
    return await db
      .select()
      .from(chapterCompletions)
      .where(eq(chapterCompletions.userId, userId))
      .orderBy(chapterCompletions.completedAt);
  }
  
  async getChapterProgressList(userId: number): Promise<ChapterProgress[]> {
    const { storage } = await import("./storage");
    const allWords = await storage.getWords(800);
    
    // Group words by chapter
    const chapterWordCounts: Record<number, number> = {};
    allWords.forEach(word => {
      if (word.chapter) {
        chapterWordCounts[word.chapter] = (chapterWordCounts[word.chapter] || 0) + 1;
      }
    });
    
    // Get all completion records for user
    const completions = await this.getUserChapterCompletions(userId);
    const completionMap = new Map(completions.map(c => [c.chapterId, c]));
    
    const progressList: ChapterProgress[] = [];
    
    // Process chapters with vocabulary
    for (const [chapterId, totalWords] of Object.entries(chapterWordCounts)) {
      const id = parseInt(chapterId);
      const progress = await this.checkChapterCompletion(userId, id);
      progressList.push(progress);
    }
    
    return progressList.sort((a, b) => a.chapterId - b.chapterId);
  }
  
  async updateChapterProgress(userId: number, chapterId: number): Promise<ChapterProgress> {
    const progress = await this.checkChapterCompletion(userId, chapterId);
    
    // Auto-record completion if criteria met and not already recorded
    if (progress.isCompleted && !progress.completion) {
      await this.recordChapterCompletion(userId, chapterId);
      return await this.checkChapterCompletion(userId, chapterId);
    }
    
    return progress;
  }
}

export const chapterCompletionService = new ChapterCompletionService();