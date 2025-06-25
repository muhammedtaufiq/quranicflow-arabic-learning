import { pgTable, text, varchar, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  displayName: text("display_name").notNull(),
  level: integer("level").notNull().default(1),
  xp: integer("xp").notNull().default(0),
  streakDays: integer("streak_days").notNull().default(0),
  lastActiveDate: timestamp("last_active_date").defaultNow(),
  comprehensionPercentage: integer("comprehension_percentage").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  arabic: text("arabic").notNull(),
  transliteration: text("transliteration").notNull(),
  meaning: text("meaning").notNull(),
  meaningUrdu: text("meaning_urdu"),
  frequency: integer("frequency").notNull().default(1),
  difficulty: integer("difficulty").notNull().default(1), // 1-5
  category: text("category").notNull().default("general"),
  chapter: integer("chapter"), // Quran chapter (surah) number 1-114
  verse: integer("verse"), // Verse number within the chapter
  rootWord: text("root_word"),
  examples: jsonb("examples").$type<string[]>().default([]),
});

export const userWordProgress = pgTable("user_word_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  wordId: integer("word_id").notNull().references(() => words.id),
  masteryLevel: integer("mastery_level").notNull().default(0), // 0-3 (Bronze, Silver, Gold)
  correctAnswers: integer("correct_answers").notNull().default(0),
  totalAttempts: integer("total_attempts").notNull().default(0),
  lastReviewed: timestamp("last_reviewed").defaultNow(),
  nextReview: timestamp("next_review").defaultNow(),
  isLearned: boolean("is_learned").notNull().default(false),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  xpReward: integer("xp_reward").notNull().default(0),
  type: text("type").notNull(), // streak, words, xp, challenge
  requirement: integer("requirement").notNull(),
});

export const userAchievements = pgTable("user_achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  achievementId: integer("achievement_id").notNull().references(() => achievements.id),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const challenges = pgTable("challenges", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // daily, weekly, special
  xpReward: integer("xp_reward").notNull().default(0),
  requirement: integer("requirement").notNull(),
  startDate: timestamp("start_date").defaultNow(),
  endDate: timestamp("end_date"),
  isActive: boolean("is_active").notNull().default(true),
});

export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  challengeId: integer("challenge_id").notNull().references(() => challenges.id),
  progress: integer("progress").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
});

export const learningStreak = pgTable("learning_streak", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currentStreak: integer("current_streak").notNull().default(0),
  longestStreak: integer("longest_streak").notNull().default(0),
  lastStreakDate: timestamp("last_streak_date").defaultNow(),
});

export const families = pgTable("families", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  inviteCode: text("invite_code").unique().notNull(),
  createdBy: integer("created_by").notNull().references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const familyMembers = pgTable("family_members", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id").notNull().references(() => families.id),
  userId: integer("user_id").notNull().references(() => users.id),
  role: text("role").default("member"), // admin, member
  nickname: text("nickname"),
  joinedAt: timestamp("joined_at").defaultNow(),
});

export const familyChallenges = pgTable("family_challenges", {
  id: serial("id").primaryKey(),
  familyId: integer("family_id").notNull().references(() => families.id),
  title: text("title").notNull(),
  description: text("description"),
  targetType: text("target_type").notNull(), // words_learned, xp_gained, streak_days
  targetValue: integer("target_value").notNull(),
  xpReward: integer("xp_reward").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const familyChallengeProgress = pgTable("family_challenge_progress", {
  id: serial("id").primaryKey(),
  challengeId: integer("challenge_id").notNull().references(() => familyChallenges.id),
  userId: integer("user_id").notNull().references(() => users.id),
  currentProgress: integer("current_progress").default(0),
  isCompleted: boolean("is_completed").default(false),
  completedAt: timestamp("completed_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyReminders = pgTable("daily_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  reminderTime: text("reminder_time").notNull(), // HH:MM format
  isEnabled: boolean("is_enabled").default(true),
  timezone: text("timezone").default("UTC"),
  lastSentAt: timestamp("last_sent_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const chapterCompletions = pgTable("chapter_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  chapterId: integer("chapter_id").notNull(), // 1-114 for Quran chapters
  chapterName: text("chapter_name").notNull(), // Al-Fatiha, Al-Baqarah, etc.
  wordsLearned: integer("words_learned").notNull().default(0),
  totalWords: integer("total_words").notNull().default(0),
  masteryPercentage: integer("mastery_percentage").notNull().default(0), // 0-100
  completedAt: timestamp("completed_at").defaultNow(),
  certificateIssued: boolean("certificate_issued").default(false),
  studyTimeMinutes: integer("study_time_minutes").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Type exports
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertWordSchema = createInsertSchema(words).omit({
  id: true,
});

export const insertUserWordProgressSchema = createInsertSchema(userWordProgress).omit({
  id: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
});

export const insertUserAchievementSchema = createInsertSchema(userAchievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).omit({
  id: true,
  startDate: true,
});

export const insertUserChallengeProgressSchema = createInsertSchema(userChallengeProgress).omit({
  id: true,
  completedAt: true,
});

export const insertLearningStreakSchema = createInsertSchema(learningStreak).omit({
  id: true,
  lastStreakDate: true,
});

export const insertFamilySchema = createInsertSchema(families).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertFamilyMemberSchema = createInsertSchema(familyMembers).omit({
  id: true,
  joinedAt: true,
});

export const insertFamilyChallengeSchema = createInsertSchema(familyChallenges).omit({
  id: true,
  createdAt: true,
});

export const insertFamilyChallengeProgressSchema = createInsertSchema(familyChallengeProgress).omit({
  id: true,
  completedAt: true,
  updatedAt: true,
});

export const insertDailyReminderSchema = createInsertSchema(dailyReminders).omit({
  id: true,
  lastSentAt: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Word = typeof words.$inferSelect;
export type InsertWord = z.infer<typeof insertWordSchema>;

export type UserWordProgress = typeof userWordProgress.$inferSelect;
export type InsertUserWordProgress = z.infer<typeof insertUserWordProgressSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type UserAchievement = typeof userAchievements.$inferSelect;
export type InsertUserAchievement = z.infer<typeof insertUserAchievementSchema>;

export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;

export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type InsertUserChallengeProgress = z.infer<typeof insertUserChallengeProgressSchema>;

export type LearningStreak = typeof learningStreak.$inferSelect;
export type InsertLearningStreak = z.infer<typeof insertLearningStreakSchema>;

export type Family = typeof families.$inferSelect;
export type InsertFamily = z.infer<typeof insertFamilySchema>;

export type FamilyMember = typeof familyMembers.$inferSelect;
export type InsertFamilyMember = z.infer<typeof insertFamilyMemberSchema>;

export type FamilyChallenge = typeof familyChallenges.$inferSelect;
export type InsertFamilyChallenge = z.infer<typeof insertFamilyChallengeSchema>;

export type FamilyChallengeProgress = typeof familyChallengeProgress.$inferSelect;
export type InsertFamilyChallengeProgress = z.infer<typeof insertFamilyChallengeProgressSchema>;

export type DailyReminder = typeof dailyReminders.$inferSelect;
export type InsertDailyReminder = z.infer<typeof insertDailyReminderSchema>;
