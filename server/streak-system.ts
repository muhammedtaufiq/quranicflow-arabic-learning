import { storage } from './storage';

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  totalActiveDays: number;
  nextReward?: {
    streakLength: number;
    xpBonus: number;
    title: string;
    description: string;
  };
  daysUntilNextReward?: number;
}

export interface Notification {
  userId: number;
  message: string;
  type: 'warning' | 'celebration' | 'milestone';
  scheduledTime: Date;
}

export const STREAK_REWARDS = [
  { streakLength: 3, xpBonus: 50, title: "Learning Starter", description: "Keep the momentum going!" },
  { streakLength: 7, xpBonus: 100, title: "Week Warrior", description: "A full week of dedication!" },
  { streakLength: 14, xpBonus: 200, title: "Fortnight Fighter", description: "Two weeks of consistent learning!" },
  { streakLength: 30, xpBonus: 500, title: "Monthly Master", description: "A full month of Arabic mastery!" },
  { streakLength: 60, xpBonus: 1000, title: "Commitment Champion", description: "Two months of unwavering dedication!" },
  { streakLength: 100, xpBonus: 2000, title: "Century Scholar", description: "100 days of Quranic wisdom!" }
];

export class StreakSystem {
  private notifications: Map<number, Notification[]> = new Map();

  async updateStreak(userId: number): Promise<StreakStats> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = await storage.getUserLearningStreak(userId);
    
    if (!streak) {
      streak = await storage.createLearningStreak({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastStreakDate: today
      });
    } else {
      const lastDate = streak.lastStreakDate ? new Date(streak.lastStreakDate) : new Date(0);
      lastDate.setHours(0, 0, 0, 0);
      
      const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 0) {
        // Already studied today
        return this.getStreakStatsInternal(streak);
      } else if (daysDiff === 1) {
        // Continue streak
        const newStreak = streak.currentStreak + 1;
        streak = await storage.updateLearningStreak(streak.id, {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, streak.longestStreak),
          lastStreakDate: today
        }) || streak;
        
        // Check for rewards
        await this.checkStreakRewards(userId, newStreak);
      } else {
        // Streak broken, start new
        streak = await storage.updateLearningStreak(streak.id, {
          currentStreak: 1,
          lastStreakDate: today
        }) || streak;
        
        // Send notification about broken streak
        if (daysDiff > 1) {
          await this.scheduleNotification(userId, {
            message: `Your ${streak.currentStreak} day streak was broken. Start fresh today!`,
            type: 'warning',
            scheduledTime: new Date()
          });
        }
      }
    }
    
    return this.getStreakStatsInternal(streak);
  }

  private getStreakStatsInternal(streak: any): StreakStats {
    const nextReward = STREAK_REWARDS.find(r => r.streakLength > streak.currentStreak);
    
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      totalActiveDays: streak.currentStreak, // Simplified for now
      nextReward,
      daysUntilNextReward: nextReward ? nextReward.streakLength - streak.currentStreak : undefined
    };
  }

  private async checkStreakRewards(userId: number, streakLength: number): Promise<void> {
    const reward = STREAK_REWARDS.find(r => r.streakLength === streakLength);
    
    if (reward) {
      // Award XP
      const user = await storage.getUser(userId);
      if (user) {
        await storage.updateUser(userId, {
          xp: user.xp + reward.xpBonus
        });
      }
      
      // Create achievement
      await storage.createUserAchievement({
        userId,
        achievementId: streakLength // Using streak length as achievement ID for simplicity
      });
      
      // Schedule celebration notification
      await this.scheduleNotification(userId, {
        message: `🎉 ${reward.title}! You've earned ${reward.xpBonus} XP for your ${streakLength}-day streak!`,
        type: 'celebration',
        scheduledTime: new Date()
      });
    }
  }

  async scheduleNotification(userId: number, notification: Omit<Notification, 'userId'>): Promise<void> {
    const userNotifications = this.notifications.get(userId) || [];
    userNotifications.push({ userId, ...notification });
    this.notifications.set(userId, userNotifications);
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    return this.notifications.get(userId) || [];
  }

  async clearNotifications(userId: number): Promise<void> {
    this.notifications.delete(userId);
  }

  // Public method to get streak stats
  async getStreakStats(userId: number): Promise<StreakStats | null> {
    const streak = await storage.getUserLearningStreak(userId);
    if (!streak) return null;
    return this.getStreakStatsInternal(streak);
  }

  // Method for recording learning sessions with streak updates
  async recordLearningSession(userId: number): Promise<{streakUpdated: boolean, rewardEarned: boolean, newStreakLength: number}> {
    const stats = await this.updateStreak(userId);
    return {
      streakUpdated: true,
      rewardEarned: stats.nextReward ? stats.currentStreak === stats.nextReward.streakLength : false,
      newStreakLength: stats.currentStreak
    };
  }

  async checkDailyStreaks(): Promise<void> {
    // This would be called by a daily cron job
    const users = await storage.getLeaderboard(1000); // Get all users
    
    for (const user of users) {
      const streak = await storage.getUserLearningStreak(user.id);
      if (streak && streak.lastStreakDate) {
        const lastDate = new Date(streak.lastStreakDate);
        const today = new Date();
        const daysDiff = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (daysDiff >= 2) {
          // Streak is about to break or already broken
          await this.scheduleNotification(user.id, {
            message: `Don't lose your ${streak.currentStreak}-day streak! Complete a lesson today.`,
            type: 'warning',
            scheduledTime: today
          });
        }
      }
    }
  }

  async getStreakAnalytics(userId: number) {
    const streak = await storage.getUserLearningStreak(userId);
    if (!streak) return null;

    const stats = this.getStreakStatsInternal(streak);
    
    return {
      ...stats,
      weeklyProgress: this.calculateWeeklyProgress(userId),
      streakHistory: this.getStreakHistory(userId),
      motivationalMessage: this.getMotivationalMessage(stats.currentStreak)
    };
  }

  private calculateWeeklyProgress(userId: number): Array<{date: string, active: boolean}> {
    // Generate last 7 days of activity (simplified)
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date: date.toISOString().split('T')[0],
        active: i < 3 // Simulate some activity
      });
    }
    
    return days;
  }

  private getStreakHistory(userId: number): Array<{period: string, streak: number}> {
    // Simplified streak history
    return [
      { period: 'This Week', streak: 4 },
      { period: 'Last Week', streak: 7 },
      { period: 'This Month', streak: 15 }
    ];
  }

  private getMotivationalMessage(streak: number): string {
    if (streak === 0) return "Start your learning journey today!";
    if (streak < 3) return "You're building momentum!";
    if (streak < 7) return "Great consistency! Keep it up!";
    if (streak < 30) return "You're on fire! Amazing dedication!";
    return "Exceptional commitment to learning!";
  }
}

export const streakSystem = new StreakSystem();