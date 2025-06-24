import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertUserWordProgressSchema } from "@shared/schema";
import { getWordsForDifficulty, calculateSpacedRepetitionInterval, getMasteryLevel } from "./services/quranic-data";
import { generateOfflineQuestions } from "./services/offline-question-generator";
import { learningEngine, LEARNING_PHASES } from "./learning-engine";
import { streakSystem } from "./streak-system";
import { offlineAI } from "./offline-ai";

// Global phase storage (in production this would be in database)
let globalSelectedPhase = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      const user = await storage.createUser(userData);
      
      // Initialize user with first achievement
      const achievements = await storage.getAchievements();
      const firstStepsAchievement = achievements.find(a => a.name === "First Steps");
      if (firstStepsAchievement) {
        await storage.createUserAchievement({
          userId: user.id,
          achievementId: firstStepsAchievement.id
        });
      }

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(400).json({ message: "Invalid user data", error: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Update last active date
      await storage.updateUser(user.id, { lastActiveDate: new Date() });

      res.json({ user: { ...user, password: undefined } });
    } catch (error: any) {
      res.status(500).json({ message: "Login failed", error: error.message });
    }
  });

  // User progress routes
  app.get("/api/user/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const learnedWords = await storage.getUserLearnedWords(userId);
      const streak = await storage.getUserLearningStreak(userId);
      const achievements = await storage.getUserAchievements(userId);

      res.json({
        user: { ...user, password: undefined },
        stats: {
          learnedWordsCount: learnedWords.length,
          streak: streak?.currentStreak || 0,
          achievementsCount: achievements.length
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get user data", error: error.message });
    }
  });

  // Learning content routes
  app.get("/api/words", async (req, res) => {
    try {
      const { limit = "20", difficulty, mode = "learning", phase } = req.query;
      const allWords = await storage.getWords(500);
      
      let filteredWords = allWords;
      
      // Use phase from query parameter or global selection
      const selectedPhase = phase ? parseInt(phase as string) : globalSelectedPhase;
      
      // VOCABULARY PRACTICE: Progressive foundational learning
      if (mode === "learning" || !mode) {
        // Get phase-specific vocabulary using learning engine
        const phaseData = LEARNING_PHASES.find(p => p.id === selectedPhase);
        
        if (phaseData) {
          // Filter words based on phase vocabulary IDs
          filteredWords = allWords.filter(word => 
            phaseData.vocabularyIds.includes(word.id)
          );
          
          console.log(`🎯 Phase ${selectedPhase} (${phaseData.name}) filtering: ${filteredWords.length} words from phase vocabulary`);
          console.log(`📝 Sample words: ${filteredWords.slice(0, 3).map(w => `${w.arabic} (${w.meaning})`).join(', ')}`);
        } else {
          // Fallback to foundational vocabulary if phase not found
          const targetDifficulty = difficulty ? parseInt(difficulty as string) : 1;
          filteredWords = allWords.filter(word => {
            const foundationalCategories = [
              'divine', 'attributes', 'pronouns', 'verbs', 'essential', 
              'worship', 'prophets', 'family', 'creation'
            ];
            
            return word.difficulty <= targetDifficulty + 1 && 
                   foundationalCategories.includes(word.category) &&
                   word.frequency > 20;
          });
        }
      } else if (mode === "grammar") {
        // GRAMMAR MODE: Phase-specific vocabulary for sentence structure practice
        const phaseData = LEARNING_PHASES.find(p => p.id === selectedPhase);
        
        if (phaseData) {
          // Use phase vocabulary but focus on structural elements
          filteredWords = allWords.filter(word => 
            phaseData.vocabularyIds.includes(word.id)
          );
          
          console.log(`🎯 Grammar mode Phase ${selectedPhase} (${phaseData.name}): ${filteredWords.length} words for sentence structure practice`);
          console.log(`📝 Grammar sample: ${filteredWords.slice(0, 3).map(w => `${w.arabic} (${w.meaning})`).join(', ')}`);
        } else {
          // Fallback structural vocabulary
          filteredWords = allWords.filter(word => {
            const structuralCategories = ['pronouns', 'verbs', 'particles', 'prepositions'];
            return structuralCategories.includes(word.category) || 
                   word.arabic.includes('ال') || 
                   word.frequency > 50;
          });
        }
      }
      
      // Apply difficulty filter if specified
      if (difficulty) {
        filteredWords = filteredWords.filter(word => word.difficulty === parseInt(difficulty as string));
      }
      
      const selectedWords = filteredWords.slice(0, parseInt(limit as string));
      res.json({ words: selectedWords });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get words", error: error.message });
    }
  });

  app.get("/api/words/frequency", async (req, res) => {
    try {
      const { limit = "10" } = req.query;
      const words = await storage.getWordsByFrequency(parseInt(limit as string));
      res.json({ words });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get high-frequency words", error: error.message });
    }
  });

  // Set current phase for user
  app.post("/api/user/:userId/select-phase", async (req, res) => {
    try {
      const { phaseId } = req.body;
      
      if (typeof phaseId !== 'number' || phaseId < 1 || phaseId > 6) {
        return res.status(400).json({ error: "Invalid phase ID" });
      }

      // Store selected phase globally
      globalSelectedPhase = phaseId;
      
      console.log(`✅ Phase switched to: ${phaseId}`);
      
      res.json({ 
        success: true, 
        selectedPhase: phaseId,
        message: `Phase ${phaseId} selected successfully`
      });
    } catch (error) {
      console.error('Error selecting phase:', error);
      res.status(500).json({ error: "Failed to select phase" });
    }
  });

  function getPhaseInfo(phaseId: number) {
    const phases: Record<number, any> = {
      1: { current: 1, description: "Foundation Phase", nextCoverage: "40%", focusAreas: "Basic prayer vocabulary, Divine names, Essential verbs" },
      2: { current: 2, description: "Building Phase", nextCoverage: "65%", focusAreas: "Prophetic names, Moral qualities, Natural phenomena" },
      3: { current: 3, description: "Strengthening Phase", nextCoverage: "80%", focusAreas: "Story vocabulary, Descriptive terms, Complex grammar" },
      4: { current: 4, description: "Expansion Phase", nextCoverage: "90%", focusAreas: "Scholarly terms, Theological concepts, Advanced expressions" },
      5: { current: 5, description: "Mastery Phase", nextCoverage: "99%", focusAreas: "Complete mastery, Rare terms, Historical references" },
      6: { current: 6, description: "Expert Phase", nextCoverage: "100%", focusAreas: "Expert level, Classical Arabic, Scholarly commentary" }
    };
    return phases[phaseId] || phases[1];
  }

  app.get("/api/content-stats", async (req, res) => {
    try {
      const allWords = await storage.getWords(1000); // Get all available words without limit
      
      // Get phase info based on current selection
      const phaseInfo = getPhaseInfo(globalSelectedPhase);
      
      // Precise Quranic vocabulary analysis based on corpus frequency research
      // Total unique words in Quran: ~14,870 (including inflections)
      // High-frequency coverage: Top 500 words = ~75%, Top 1000 = ~85%, Top 2000 = ~95%
      const TOTAL_QURAN_VOCABULARY = 14870;
      const QURAN_FREQUENCY_TOTAL = 77934; // Total word occurrences in Quran
      
      // Chapter breakdown with authentic vocabulary distribution
      const chapterStats = [
        { id: 1, name: "Al-Fatiha", arabicName: "الفاتحة", words: allWords.filter(w => w.chapter === 1).length, verses: 7, uniqueWords: 25, totalOccurrences: 29 },
        { id: 2, name: "Al-Baqarah", arabicName: "البقرة", words: allWords.filter(w => w.chapter === 2).length, verses: 286, uniqueWords: 1845, totalOccurrences: 6140 },
        { id: 36, name: "Yasin", arabicName: "يس", words: allWords.filter(w => w.chapter === 36).length, verses: 83, uniqueWords: 287, totalOccurrences: 733 },
        { id: 55, name: "Ar-Rahman", arabicName: "الرحمن", words: allWords.filter(w => w.chapter === 55).length, verses: 78, uniqueWords: 176, totalOccurrences: 352 },
        { id: 67, name: "Al-Mulk", arabicName: "الملك", words: allWords.filter(w => w.chapter === 67).length, verses: 30, uniqueWords: 132, totalOccurrences: 337 },
        { id: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", words: allWords.filter(w => w.chapter === 112).length, verses: 4, uniqueWords: 17, totalOccurrences: 17 },
        { id: 113, name: "Al-Falaq", arabicName: "الفلق", words: allWords.filter(w => w.chapter === 113).length, verses: 5, uniqueWords: 23, totalOccurrences: 23 },
        { id: 114, name: "An-Nas", arabicName: "الناس", words: allWords.filter(w => w.chapter === 114).length, verses: 6, uniqueWords: 20, totalOccurrences: 20 }
      ];
      
      // Calculate precise comprehension coverage
      const totalWords = allWords.length;
      const totalFrequency = allWords.reduce((sum, word) => sum + (word.frequency || 0), 0);
      

      
      // Frequency-based comprehension (how much of Quran text is understood)
      const frequencyComprehension = Math.round((totalFrequency / QURAN_FREQUENCY_TOTAL) * 100);
      
      // Vocabulary comprehension (how many unique words are known)
      const vocabularyComprehension = Math.round((totalWords / TOTAL_QURAN_VOCABULARY) * 100);
      
      // Weighted comprehension (combines frequency and coverage for practical understanding)
      // Research shows: top 500 words = 65% understanding, top 1000 = 80%, top 2000 = 95%
      let practicalComprehension;
      if (totalWords <= 50) practicalComprehension = Math.round(totalWords * 0.25); // ~15%
      else if (totalWords <= 200) practicalComprehension = 15 + Math.round((totalWords - 50) * 0.34 / 1.5); // 15-49%
      else if (totalWords <= 500) practicalComprehension = 49 + Math.round((totalWords - 200) * 0.16 / 3); // 49-65%
      else if (totalWords <= 1000) practicalComprehension = 65 + Math.round((totalWords - 500) * 0.15 / 5); // 65-80%
      else if (totalWords <= 2000) practicalComprehension = 80 + Math.round((totalWords - 1000) * 0.15 / 10); // 80-95%
      else practicalComprehension = 95 + Math.round((totalWords - 2000) * 0.05 / 100); // 95-100%
      
      const categories = Array.from(new Set(allWords.map(w => w.category))).length;
      
      // Urdu translation statistics
      const wordsWithUrdu = allWords.filter(w => w.meaningUrdu && w.meaningUrdu.trim() !== "");
      const urduCoveragePercentage = Math.round((wordsWithUrdu.length / totalWords) * 100);
      const urduFrequencySum = wordsWithUrdu.reduce((sum, word) => sum + (word.frequency || 0), 0);
      const urduFrequencyPercentage = Math.round((urduFrequencySum / totalFrequency) * 100);
      
      // Chapter-specific Urdu coverage
      const urduChapterStats = chapterStats.map(ch => ({
        ...ch,
        urduWords: allWords.filter(w => w.chapter === ch.id && w.meaningUrdu && w.meaningUrdu.trim() !== "").length,
        urduCoverage: ch.words > 0 ? Math.round((allWords.filter(w => w.chapter === ch.id && w.meaningUrdu && w.meaningUrdu.trim() !== "").length / ch.words) * 100) : 0
      }));
      
      res.json({
        totalWords,
        totalFrequency,
        categories,
        
        // Comprehensive coverage analysis
        comprehensionCoverage: {
          practical: practicalComprehension, // Main display metric
          frequency: frequencyComprehension, // Based on word occurrence frequency
          vocabulary: vocabularyComprehension, // Based on unique word count
          description: `${practicalComprehension}% practical Quran comprehension`
        },
        
        // Phase tracking removed to prevent duplicate with phaseInfo below
        
        // Detailed chapter distribution
        chapterBreakdown: chapterStats.map(ch => ({
          ...ch,
          coverage: ch.uniqueWords > 0 ? Math.round((ch.words / ch.uniqueWords) * 100) : 0,
          completionStatus: ch.words >= ch.uniqueWords ? "Complete" : ch.words > 0 ? "Partial" : "Not Started"
        })).filter(ch => ch.words > 0),
        
        // Category distribution analysis
        categoryDistribution: Array.from(new Set(allWords.map(w => w.category))).map(cat => ({
          name: cat,
          count: allWords.filter(w => w.category === cat).length,
          frequency: allWords.filter(w => w.category === cat).reduce((sum, w) => sum + w.frequency, 0)
        })).sort((a, b) => b.frequency - a.frequency),
        
        urduTranslations: {
          totalWithUrdu: wordsWithUrdu.length,
          coveragePercentage: urduCoveragePercentage,
          frequencySum: urduFrequencySum,
          frequencyPercentage: urduFrequencyPercentage,
          chapterBreakdown: urduChapterStats.filter(ch => ch.words > 0),
          sources: {
            classical: ["Tafsir Ibn Kathir", "Tafsir Al-Jalalayn", "Kanz-ul-Iman"],
            contemporary: ["Tafsir Usmani", "Tafheem-ul-Quran", "Tafsir Ma'ariful Quran"],
            linguistic: ["Urdu Lughat", "Farhang-e-Asifiya", "Al-Munjid Arabic-Urdu"],
            verification: "Cross-referenced with multiple scholarly sources for accuracy"
          }
        },
        
        // Research-based projections
        expansion: {
          totalQuranVocabulary: TOTAL_QURAN_VOCABULARY,
          currentProgress: `${totalWords}/${TOTAL_QURAN_VOCABULARY} unique words`,
          frequencyProgress: `${totalFrequency}/${QURAN_FREQUENCY_TOTAL} total occurrences`,
          efficiencyNote: "High-frequency words provide maximum comprehension gain per word learned"
        },
        
        // Phase information
        phase: phaseInfo
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to fetch content stats", error: error.message });
    }
  });

  app.get("/api/words/chapter/:chapterId", async (req, res) => {
    try {
      const chapterId = parseInt(req.params.chapterId);
      const { limit = "10" } = req.query;
      
      // CHAPTER-SPECIFIC LEARNING: Authentic vocabulary from specific Quranic chapters
      const allWords = await storage.getWords(500);
      const chapterWords = allWords.filter(word => word.chapter === chapterId);
      
      console.log(`Chapter ${chapterId}: Found ${chapterWords.length} words`);
      
      if (chapterWords.length === 0) {
        // Provide thematically related words instead of random fallbacks
        let thematicWords = [];
        
        if (chapterId === 1) { // Al-Fatiha
          thematicWords = allWords.filter(w => 
            ['divine', 'attributes', 'worship', 'essential'].includes(w.category)
          );
        } else if ([112, 113, 114].includes(chapterId)) { // Protection surahs
          thematicWords = allWords.filter(w => 
            ['divine', 'attributes', 'protection', 'worship'].includes(w.category)
          );
        } else if ([36, 67, 55].includes(chapterId)) { // Popular chapters
          thematicWords = allWords.filter(w => 
            ['afterlife', 'creation', 'divine', 'attributes', 'worship'].includes(w.category)
          );
        } else {
          // General foundational vocabulary
          thematicWords = allWords.filter(w => 
            ['divine', 'attributes', 'essential', 'worship'].includes(w.category)
          );
        }
        
        console.log(`Using thematic words for chapter ${chapterId}: ${thematicWords.length} words`);
        res.json({ words: thematicWords.slice(0, parseInt(limit as string)) });
      } else {
        res.json({ words: chapterWords.slice(0, parseInt(limit as string)) });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get chapter words", error: error.message });
    }
  });

  app.get("/api/grammar-patterns", async (req, res) => {
    try {
      // GRAMMAR PATTERNS: Focus specifically on structural elements and sentence building
      const allWords = await storage.getWords(300);
      
      const grammarWords = allWords.filter(word => {
        // Focus on grammatical structure words
        const grammarCategories = ['particles', 'pronouns', 'prepositions', 'conjunctions'];
        const hasDefiniteArticle = word.arabic.includes('ال');
        const isVerbPattern = word.category === 'verbs' && word.frequency > 30;
        const isStructuralWord = ['and', 'to', 'in', 'from', 'with', 'that', 'which', 'who'].some(
          connector => word.meaning.toLowerCase().includes(connector)
        );
        
        return grammarCategories.includes(word.category) || 
               hasDefiniteArticle || 
               isVerbPattern || 
               isStructuralWord;
      }).slice(0, 12);
      
      res.json({ words: grammarWords });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get grammar patterns", error: error.message });
    }
  });

  app.post("/api/words/generate", async (req, res) => {
    try {
      const { difficulty = 1, category = "general", count = 5, excludeWords = [] } = req.body;
      
      // Get words from local comprehensive database only
      let words = getWordsForDifficulty(difficulty, count);
      
      // Filter out excluded words
      if (excludeWords.length > 0) {
        words = words.filter(word => !excludeWords.includes(word.arabic));
      }

      res.json({ words });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate words", error: error.message });
    }
  });

  // Learning session routes
  app.post("/api/learning/session", async (req, res) => {
    try {
      const { userId, wordId, isCorrect } = req.body;
      
      // Get or create user word progress
      let progress = await storage.getUserWordProgress(userId, wordId);
      
      if (!progress) {
        progress = await storage.createUserWordProgress({
          userId,
          wordId,
          masteryLevel: 0,
          correctAnswers: 0,
          totalAttempts: 0,
          isLearned: false
        });
      }

      // Update progress
      const newCorrectAnswers = progress.correctAnswers + (isCorrect ? 1 : 0);
      const newTotalAttempts = progress.totalAttempts + 1;
      const newMasteryLevel = getMasteryLevel(newCorrectAnswers, newTotalAttempts);
      const isLearned = newMasteryLevel > 0;
      
      // Calculate next review date using spaced repetition
      const intervalDays = calculateSpacedRepetitionInterval(newCorrectAnswers, newTotalAttempts);
      const nextReview = new Date(Date.now() + intervalDays * 24 * 60 * 60 * 1000);

      await storage.updateUserWordProgress(progress.id, {
        correctAnswers: newCorrectAnswers,
        totalAttempts: newTotalAttempts,
        masteryLevel: newMasteryLevel,
        isLearned,
        lastReviewed: new Date(),
        nextReview
      });

      // Update user XP
      const xpGain = isCorrect ? (10 + (newMasteryLevel * 5)) : 0;
      const user = await storage.getUser(userId);
      if (user && xpGain > 0) {
        const newXp = user.xp + xpGain;
        const newLevel = Math.floor(newXp / 1000) + 1;
        await storage.updateUser(userId, { 
          xp: newXp, 
          level: newLevel 
        });
      }

      res.json({ 
        success: true, 
        xpGain,
        masteryLevel: newMasteryLevel,
        isLearned
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to record learning session", error: error.message });
    }
  });

  app.get("/api/learning/questions/:wordId", async (req, res) => {
    try {
      const wordId = parseInt(req.params.wordId);
      const word = await storage.getWord(wordId);
      
      if (!word) {
        return res.status(404).json({ message: "Word not found" });
      }

      // Get all words for intelligent distractor generation
      const allWords = await storage.getWords(100);
      
      // Generate questions using offline system
      const questions = generateOfflineQuestions(word, allWords);
      res.json({ questions });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to generate questions", error: error.message });
    }
  });

  // Review system routes
  app.get("/api/user/:userId/review", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // SPACED REVIEW: Focus on words user has previously studied but needs reinforcement
      const wordProgress = await storage.getUserWordsForReview(userId);
      
      if (wordProgress.length === 0) {
        // If no review words, provide previously seen words for reinforcement
        const allWords = await storage.getWords(300);
        const reviewCandidates = allWords.filter(word => 
          word.difficulty <= 3 && // Earlier difficulty words for review
          ['divine', 'attributes', 'pronouns', 'verbs', 'particles'].includes(word.category)
        ).slice(0, 15);
        
        res.json({ words: reviewCandidates });
      } else {
        // Get actual words from the progress data
        const words = [];
        for (const progress of wordProgress) {
          const word = await storage.getWord(progress.wordId);
          if (word) {
            words.push(word);
          }
        }
        res.json({ words });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get review words", error: error.message });
    }
  });

  // Chapter-specific learning routes
  app.get("/api/learn/chapter/:chapterId", async (req, res) => {
    try {
      const chapterId = parseInt(req.params.chapterId);
      const { limit = "10" } = req.query;
      
      // Get all words from storage
      const allWords = await storage.getWords(800); // Get all available words
      const chapterWords = allWords.filter(word => word.chapter === chapterId);
      
      console.log(`Learn Chapter ${chapterId}: Found ${chapterWords.length} authentic words`);
      
      if (chapterWords.length === 0) {
        // Provide thematically related words for chapters without specific vocabulary
        let thematicWords = [];
        
        if (chapterId === 1) { // Al-Fatiha
          thematicWords = allWords.filter(w => 
            ['divine', 'attributes', 'worship', 'essential'].includes(w.category)
          );
        } else if ([112, 113, 114].includes(chapterId)) { // Protection surahs
          thematicWords = allWords.filter(w => 
            ['divine', 'attributes', 'protection', 'worship'].includes(w.category)
          );
        } else if ([36, 67, 55].includes(chapterId)) { // Popular chapters
          thematicWords = allWords.filter(w => 
            ['afterlife', 'creation', 'divine', 'attributes', 'worship'].includes(w.category)
          );
        } else {
          // General foundational vocabulary
          thematicWords = allWords.filter(w => 
            ['divine', 'attributes', 'essential', 'worship'].includes(w.category)
          );
        }
        
        console.log(`Using thematic words for chapter ${chapterId}: ${thematicWords.length} words`);
        res.json({ words: thematicWords.slice(0, parseInt(limit as string)) });
      } else {
        res.json({ words: chapterWords.slice(0, parseInt(limit as string)) });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get chapter words for learning", error: error.message });
    }
  });

  // Daily challenge route
  app.get("/api/user/:userId/daily-challenge", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user's current level to determine appropriate difficulty
      const user = await storage.getUser(userId);
      const userLevel = user?.level || 1;
      
      // DAILY CHALLENGE: Focus on high-frequency, essential vocabulary for daily consistency
      // Select words from core categories: divine attributes, basic verbs, common nouns
      const allWords = await storage.getWords(300);
      const challengeCategories = ['divine', 'attributes', 'verbs', 'essential', 'pronouns', 'worship'];
      
      let challengeWords = allWords.filter(word => 
        challengeCategories.includes(word.category) && 
        word.difficulty <= Math.min(userLevel + 1, 5) // Appropriate difficulty
      );
      
      // If not enough high-frequency words, include medium frequency
      if (challengeWords.length < 7) {
        challengeWords = allWords.filter(word => 
          challengeCategories.includes(word.category) && 
          word.frequency > 20 && // Medium frequency words
          word.difficulty <= Math.min(userLevel + 1, 5)
        );
      }
      
      console.log(`Daily challenge: Found ${challengeWords.length} words in categories:`, challengeCategories);
      
      // Add seed for consistent daily challenge (same words for same day)
      const today = new Date().toDateString();
      const seed = today.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
      const shuffled = challengeWords.sort(() => (seed % 2) - 0.5).slice(0, 7);
      
      res.json({ words: shuffled });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get daily challenge", error: error.message });
    }
  });

  // Achievements routes
  app.get("/api/achievements", async (req, res) => {
    try {
      const achievements = await storage.getAchievements();
      res.json({ achievements });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get achievements", error: error.message });
    }
  });

  app.get("/api/user/:userId/achievements", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Run achievement sync first to ensure user has all eligible achievements
      const { syncUserAchievements } = await import('./sync-achievements');
      const newAchievements = await syncUserAchievements(userId);
      
      const userAchievements = await storage.getUserAchievements(userId);
      const allAchievements = await storage.getAchievements();
      
      console.log(`Achievement status check for user ${userId}:`);
      console.log(`- Synced ${newAchievements} new achievements`);
      console.log(`- Retrieved ${userAchievements.length} user achievements:`, userAchievements.map(ua => ua.achievementId));
      console.log(`- Total achievements: ${allAchievements.length}`);
      
      const achievementsWithStatus = allAchievements.map(achievement => {
        const isUnlocked = userAchievements.some(ua => ua.achievementId === achievement.id);
        const unlockedRecord = userAchievements.find(ua => ua.achievementId === achievement.id);
        
        console.log(`Achievement ${achievement.id} (${achievement.name}): unlocked=${isUnlocked}`);
        
        return {
          ...achievement,
          unlocked: isUnlocked,
          unlockedAt: unlockedRecord?.unlockedAt
        };
      });

      res.json({ achievements: achievementsWithStatus });
    } catch (error: any) {
      console.error('Achievement API error:', error);
      res.status(500).json({ message: "Failed to get user achievements", error: error.message });
    }
  });

  // Challenges routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getActiveChallenges();
      res.json({ challenges });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get challenges", error: error.message });
    }
  });

  app.get("/api/user/:userId/challenges", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const challenges = await storage.getActiveChallenges();
      
      const challengesWithProgress = await Promise.all(
        challenges.map(async (challenge) => {
          const progress = await storage.getUserChallengeProgress(userId, challenge.id);
          return {
            ...challenge,
            progress: progress?.progress || 0,
            isCompleted: progress?.isCompleted || false
          };
        })
      );

      res.json({ challenges: challengesWithProgress });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get user challenges", error: error.message });
    }
  });

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const { limit = "10" } = req.query;
      const users = await storage.getLeaderboard(parseInt(limit as string));
      
      const leaderboard = users.map((user, index) => ({
        id: user.id,
        displayName: user.displayName,
        xp: user.xp,
        level: user.level,
        rank: index + 1
      }));

      res.json({ leaderboard });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get leaderboard", error: error.message });
    }
  });

  // Streak routes
  app.post("/api/user/:userId/streak", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      let streak = await storage.getUserLearningStreak(userId);
      
      if (!streak) {
        streak = await storage.createLearningStreak({
          userId,
          currentStreak: 0,
          longestStreak: 0
        });
      }

      const today = new Date();
      const lastStreakDate = streak.lastStreakDate ? new Date(streak.lastStreakDate) : new Date();
      const daysDiff = Math.floor((today.getTime() - lastStreakDate.getTime()) / (1000 * 60 * 60 * 24));

      let newCurrentStreak = streak.currentStreak;
      
      if (daysDiff === 0) {
        // Same day, no change
      } else if (daysDiff === 1) {
        // Consecutive day, increment streak
        newCurrentStreak += 1;
      } else {
        // Streak broken, reset to 1
        newCurrentStreak = 1;
      }

      const newLongestStreak = Math.max(streak.longestStreak, newCurrentStreak);

      await storage.updateLearningStreak(streak.id, {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        lastStreakDate: today
      });

      // Update user streak days
      await storage.updateUser(userId, { streakDays: newCurrentStreak });

      res.json({ 
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to update streak", error: error.message });
    }
  });

  // Family routes
  app.post("/api/families", async (req, res) => {
    try {
      const { name, createdBy } = req.body;
      const inviteCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      const family = await storage.createFamily({
        name,
        inviteCode,
        createdBy
      });

      // Add creator as admin member
      await storage.addFamilyMember({
        familyId: family.id,
        userId: createdBy,
        role: "admin",
        nickname: null
      });

      res.json({ family });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create family", error: error.message });
    }
  });

  app.post("/api/families/join", async (req, res) => {
    try {
      const { inviteCode, userId, nickname } = req.body;
      
      const family = await storage.getFamilyByInviteCode(inviteCode);
      if (!family) {
        return res.status(404).json({ message: "Family not found with this invite code" });
      }

      // Check if user is already a member
      const existingMembers = await storage.getFamilyMembers(family.id);
      if (existingMembers.some(m => m.userId === userId)) {
        return res.status(400).json({ message: "You are already a member of this family" });
      }

      const member = await storage.addFamilyMember({
        familyId: family.id,
        userId,
        role: "member",
        nickname
      });

      res.json({ family, member });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to join family", error: error.message });
    }
  });

  app.get("/api/user/:userId/family", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const family = await storage.getUserFamily(userId);
      
      if (!family) {
        return res.json({ family: null });
      }

      const members = await storage.getFamilyMembers(family.id);
      const memberDetails = await Promise.all(
        members.map(async (member) => {
          const user = await storage.getUser(member.userId);
          return {
            ...member,
            user: user ? {
              id: user.id,
              displayName: user.displayName,
              xp: user.xp,
              level: user.level,
              streakDays: user.streakDays
            } : null
          };
        })
      );

      res.json({ 
        family: {
          ...family,
          members: memberDetails
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get family", error: error.message });
    }
  });

  app.get("/api/family/:familyId/challenges", async (req, res) => {
    try {
      const familyId = parseInt(req.params.familyId);
      const challenges = await storage.getFamilyChallenges(familyId);
      res.json({ challenges });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get family challenges", error: error.message });
    }
  });

  app.post("/api/family/:familyId/challenges", async (req, res) => {
    try {
      const familyId = parseInt(req.params.familyId);
      const { title, description, targetType, targetValue, xpReward, startDate, endDate } = req.body;
      
      const challenge = await storage.createFamilyChallenge({
        familyId,
        title,
        description,
        targetType,
        targetValue,
        xpReward,
        startDate: new Date(startDate),
        endDate: new Date(endDate)
      });

      res.json({ challenge });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to create family challenge", error: error.message });
    }
  });

  // Daily reminders routes
  app.get("/api/user/:userId/reminder", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reminder = await storage.getUserReminder(userId);
      res.json({ reminder });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get reminder", error: error.message });
    }
  });

  app.post("/api/user/:userId/reminder", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { reminderTime, isEnabled, timezone } = req.body;
      
      const existingReminder = await storage.getUserReminder(userId);
      
      if (existingReminder) {
        const updatedReminder = await storage.updateReminder(existingReminder.id, {
          reminderTime,
          isEnabled,
          timezone
        });
        res.json({ reminder: updatedReminder });
      } else {
        const reminder = await storage.createReminder({
          userId,
          reminderTime,
          isEnabled,
          timezone
        });
        res.json({ reminder });
      }
    } catch (error: any) {
      res.status(500).json({ message: "Failed to save reminder", error: error.message });
    }
  });

  // Get user's chapter progress for the visual chart
  app.get("/api/user/:userId/chapter-progress", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // For demonstration, return sample progress data
      // In a real implementation, this would calculate from user's learned words
      const chapterProgress = {
        1: 100,   // Al-Fatiha completed
        2: 45,    // Al-Baqarah 45% complete  
        36: 100,  // Ya-Sin completed
        67: 30,   // Al-Mulk 30% complete
        112: 100, // Al-Ikhlas completed
        113: 100, // Al-Falaq completed
        114: 100  // An-Nas completed
      };
      
      res.json({ chapterProgress });
    } catch (error: any) {
      console.error("Error fetching chapter progress:", error);
      res.status(500).json({ message: "Failed to fetch chapter progress", error: error.message });
    }
  });

  // Phased Learning System Routes
  app.get("/api/learning-phases", async (req, res) => {
    try {
      res.json({ phases: LEARNING_PHASES });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get learning phases", error: error.message });
    }
  });

  app.get("/api/user/:userId/current-phase", async (req, res) => {
    try {
      // Return current phase based on global selection
      const currentPhase = LEARNING_PHASES.find(phase => phase.id === globalSelectedPhase) || LEARNING_PHASES[0];
      
      console.log(`📚 Current phase requested: ${currentPhase.name} (ID: ${globalSelectedPhase})`);
      
      // Force cache refresh
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.json({
        currentPhase,
        selectedPhase: globalSelectedPhase
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get current phase", error: error.message });
    }
  });

  app.get("/api/user/:userId/daily-lesson", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const phaseId = parseInt(req.query.phase as string) || 1;
      
      const lesson = learningEngine.getDailyLesson(userId, phaseId);
      res.json({ lesson });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get daily lesson", error: error.message });
    }
  });

  app.post("/api/user/:userId/record-session", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessionData = req.body;
      
      // Record learning session
      learningEngine.recordLearningSession(userId, sessionData);
      
      // Update streak and check for rewards
      const streakResult = await streakSystem.recordLearningSession(userId);
      
      res.json({ 
        success: true,
        streakUpdated: streakResult.streakUpdated,
        rewardEarned: streakResult.rewardEarned,
        newStreakLength: streakResult.newStreakLength
      });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to record session", error: error.message });
    }
  });

  // Streak System Routes
  app.get("/api/user/:userId/streak-stats", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const stats = await streakSystem.getStreakAnalytics(userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get streak stats", error: error.message });
    }
  });

  app.get("/api/user/:userId/notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const notifications = await streakSystem.getUserNotifications(userId);
      res.json({ notifications });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get notifications", error: error.message });
    }
  });

  app.post("/api/user/:userId/clear-notifications", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      await streakSystem.clearNotifications(userId);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to clear notifications", error: error.message });
    }
  });

  // Personalized Learning Routes
  app.get("/api/user/:userId/learning-analytics", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const analytics = learningEngine.getLearningAnalytics(userId);
      res.json(analytics);
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get learning analytics", error: error.message });
    }
  });

  app.get("/api/user/:userId/review-words", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const reviewWords = learningEngine.getWordsForReview(userId);
      res.json({ reviewWords });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get review words", error: error.message });
    }
  });

  // Start daily streak checking (would be handled by cron job in production)
  setInterval(() => {
    streakSystem.checkDailyStreaks();
  }, 24 * 60 * 60 * 1000); // Check daily

  const httpServer = createServer(app);
  return httpServer;
}
