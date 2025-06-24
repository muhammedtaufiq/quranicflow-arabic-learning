// Utility to sync user achievements based on actual progress
import { storage } from "./storage";

export async function syncUserAchievements(userId: number) {
  console.log(`Syncing achievements for user ${userId}...`);
  
  // Get user data
  const user = await storage.getUser(userId);
  if (!user) {
    console.log(`User ${userId} not found`);
    return;
  }
  
  console.log(`User data: Level ${user.level}, XP ${user.xp}, Streak ${user.streakDays}`);
  
  // Get all achievements
  const achievements = await storage.getAchievements();
  console.log(`Found ${achievements.length} total achievements`);
  
  // Get current user achievements
  const userAchievements = await storage.getUserAchievements(userId);
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
  console.log(`User currently has ${userAchievements.length} achievements unlocked`);
  
  let newAchievements = 0;
  
  // Check each achievement for eligibility
  for (const achievement of achievements) {
    if (unlockedIds.has(achievement.id)) {
      continue; // Already unlocked
    }
    
    let shouldUnlock = false;
    
    // Check based on achievement type
    switch (achievement.type) {
      case 'xp':
        shouldUnlock = user.xp >= achievement.requirement;
        break;
      case 'level':
        shouldUnlock = user.level >= achievement.requirement;
        break;
      case 'streak':
        shouldUnlock = user.streakDays >= achievement.requirement;
        break;
      case 'chapter':
        // For chapter achievements, we need to check completion
        const chapterCompletions = await storage.getUserLearnedWords(userId);
        const wordsLearned = chapterCompletions.filter(w => w.masteryLevel === 'gold').length;
        shouldUnlock = wordsLearned >= achievement.requirement;
        break;
    }
    
    if (shouldUnlock) {
      console.log(`Unlocking achievement: ${achievement.name} (${achievement.type}: ${achievement.requirement})`);
      await storage.createUserAchievement({
        userId,
        achievementId: achievement.id
      });
      newAchievements++;
    }
  }
  
  console.log(`Synced ${newAchievements} new achievements for user ${userId}`);
  return newAchievements;
}

// Run sync for user 1 if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith('sync-achievements.ts')) {
  syncUserAchievements(1).then(count => {
    console.log(`Sync completed: ${count} achievements added`);
    process.exit(0);
  }).catch(err => {
    console.error('Sync failed:', err);
    process.exit(1);
  });
}