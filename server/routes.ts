import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertUserSchema, insertUserWordProgressSchema } from "@shared/schema";
import { getWordsForDifficulty, calculateSpacedRepetitionInterval, getMasteryLevel } from "./services/quranic-data";
import { generateOfflineQuestions } from "./services/offline-question-generator";

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
      const { limit = "20", difficulty } = req.query;
      const words = await storage.getWords(
        parseInt(limit as string), 
        difficulty ? parseInt(difficulty as string) : undefined
      );
      res.json({ words });
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
      const wordsForReview = await storage.getUserWordsForReview(userId);
      res.json({ words: wordsForReview });
    } catch (error: any) {
      res.status(500).json({ message: "Failed to get review words", error: error.message });
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
      const userAchievements = await storage.getUserAchievements(userId);
      const allAchievements = await storage.getAchievements();
      
      const achievementsWithStatus = allAchievements.map(achievement => ({
        ...achievement,
        unlocked: userAchievements.some(ua => ua.achievementId === achievement.id),
        unlockedAt: userAchievements.find(ua => ua.achievementId === achievement.id)?.unlockedAt
      }));

      res.json({ achievements: achievementsWithStatus });
    } catch (error: any) {
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

  const httpServer = createServer(app);
  return httpServer;
}
