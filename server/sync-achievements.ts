// Utility to sync user achievements based on actual progress
import { storage } from "./storage";

export async function syncUserAchievements(userId: number) {
  console.log(`=== Syncing achievements for user ${userId} ===`);
  
  // Get user data
  const user = await storage.getUser(userId);
  if (!user) {
    console.log(`User ${userId} not found`);
    return 0;
  }
  
  // Get learned words data
  const learnedWords = await storage.getUserLearnedWords(userId);
  const masteredWords = learnedWords.filter(w => w.masteryLevel === 'gold');
  
  console.log(`User stats: Level ${user.level}, XP ${user.xp}, Streak ${user.streakDays}`);
  console.log(`Words: ${learnedWords.length} learned, ${masteredWords.length} mastered`);
  
  // Get all achievements
  const achievements = await storage.getAchievements();
  
  // Get current user achievements
  const userAchievements = await storage.getUserAchievements(userId);
  const unlockedIds = new Set(userAchievements.map(ua => ua.achievementId));
  
  console.log(`Current achievements: ${userAchievements.length}, unlocked IDs: [${Array.from(unlockedIds).join(', ')}]`);
  
  let newAchievements = 0;
  
  // Check each achievement for eligibility
  for (const achievement of achievements) {
    console.log(`\n--- Checking "${achievement.name}" (ID: ${achievement.id}) ---`);
    console.log(`Type: ${achievement.type}, Requirement: ${achievement.requirement}`);
    
    if (unlockedIds.has(achievement.id)) {
      console.log(`✓ Already unlocked`);
      continue;
    }
    
    let shouldUnlock = false;
    
    // Check based on achievement type
    switch (achievement.type) {
      case 'xp':
        shouldUnlock = user.xp >= achievement.requirement;
        console.log(`XP check: ${user.xp} >= ${achievement.requirement} = ${shouldUnlock}`);
        break;
      case 'level':
        shouldUnlock = user.level >= achievement.requirement;
        console.log(`Level check: ${user.level} >= ${achievement.requirement} = ${shouldUnlock}`);
        break;
      case 'streak':
        shouldUnlock = user.streakDays >= achievement.requirement;
        console.log(`Streak check: ${user.streakDays} >= ${achievement.requirement} = ${shouldUnlock}`);
        break;
      case 'words':
        // For "First Steps" (requirement 1), use any learned words
        // For higher requirements, use mastered words
        const wordsToCheck = achievement.requirement === 1 ? learnedWords.length : masteredWords.length;
        shouldUnlock = wordsToCheck >= achievement.requirement;
        console.log(`Words check: ${wordsToCheck} >= ${achievement.requirement} = ${shouldUnlock}`);
        break;
      case 'challenge':
        // Rough proxy based on XP
        shouldUnlock = user.xp >= (achievement.requirement * 30);
        console.log(`Challenge check: ${user.xp} >= ${achievement.requirement * 30} = ${shouldUnlock}`);
        break;
      default:
        console.log(`Unknown achievement type: ${achievement.type}`);
        break;
    }
    
    if (shouldUnlock) {
      console.log(`🎉 UNLOCKING: ${achievement.name}`);
      try {
        const newUserAchievement = await storage.createUserAchievement({
          userId,
          achievementId: achievement.id
        });
        console.log(`✓ Created UserAchievement record:`, newUserAchievement);
        newAchievements++;
      } catch (error) {
        console.error(`❌ Failed to create UserAchievement:`, error);
      }
    } else {
      console.log(`❌ Not eligible yet`);
    }
  }
  
  console.log(`\n=== Sync complete: ${newAchievements} new achievements unlocked ===`);
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