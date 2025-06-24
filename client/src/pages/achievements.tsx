import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { AchievementBadge } from "@/components/achievement-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, Star, Clock, Target } from "lucide-react";

const MOCK_USER_ID = 1;

export default function Achievements() {
  const { data: achievementsData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/achievements`],
  });

  const achievements = (achievementsData as any)?.achievements || [];
  const unlockedAchievements = achievements.filter((a: any) => a.unlocked);
  const lockedAchievements = achievements.filter((a: any) => !a.unlocked);

  const getAchievementIcon = (type: string, icon: string) => {
    switch (type) {
      case 'streak':
        return '🔥';
      case 'words':
        return '📚';
      case 'xp':
        return '⭐';
      case 'challenge':
        return '🏆';
      default:
        return icon;
    }
  };

  const stats = {
    totalAchievements: achievements.length,
    unlockedCount: unlockedAchievements.length,
    totalXpFromAchievements: unlockedAchievements.reduce((sum: number, a: any) => sum + a.xpReward, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 safe-area-pb md:pb-0">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8 gentle-reveal">
          <h1 className="text-3xl font-medium text-slate-800 mb-4">Learning Milestones</h1>
          <p className="text-slate-600">Track your spiritual journey and unlock rewards</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="card-tranquil gentle-reveal shimmer-card hover-lift">
            <CardContent className="p-6 text-center mobile-compact">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-teal-600" />
              </div>
              <div className="text-2xl font-medium text-slate-800">{stats.unlockedCount}</div>
              <div className="text-sm text-slate-600 mobile-text-visible">Milestones Achieved</div>
            </CardContent>
          </Card>
          
          <Card className="card-tranquil gentle-reveal shimmer-card hover-lift">
            <CardContent className="p-6 text-center mobile-compact">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="text-2xl font-medium text-slate-800">{stats.totalXpFromAchievements}</div>
              <div className="text-sm text-slate-600 mobile-text-visible">Points Earned</div>
            </CardContent>
          </Card>
          
          <Card className="card-tranquil gentle-reveal shimmer-card hover-lift">
            <CardContent className="p-6 text-center mobile-compact">
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-amber-600" />
              </div>
              <div className="text-2xl font-medium text-slate-800">
                {Math.round((stats.unlockedCount / stats.totalAchievements) * 100)}%
              </div>
              <div className="text-sm text-slate-600 mobile-text-visible">Progress Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Unlocked Achievements */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Unlocked Achievements ({unlockedAchievements.length})
          </h2>
          
          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement: any) => (
                <Card key={achievement.id} className="border-2 border-accent/20 bg-gradient-to-br from-accent/5 to-accent/10 shimmer-card hover-lift">
                  <CardContent className="p-6 mobile-compact">
                    <div className="flex items-start justify-between mb-3">
                      <div className="text-3xl">{getAchievementIcon(achievement.type, achievement.icon)}</div>
                      <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                        +{achievement.xpReward} XP
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{achievement.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {achievement.type}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {achievement.unlockedAt ? new Date(achievement.unlockedAt).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements yet</h3>
                <p className="text-gray-600">Start learning to unlock your first achievement!</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Locked Achievements */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Available Achievements ({lockedAchievements.length})
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement: any) => (
              <Card key={achievement.id} className="opacity-60 border-dashed">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl grayscale">{getAchievementIcon(achievement.type, achievement.icon)}</div>
                    <Badge variant="outline" className="text-xs">
                      +{achievement.xpReward} XP
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-700 mb-1">{achievement.name}</h3>
                  <p className="text-sm text-gray-500 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs opacity-50">
                      {achievement.type}
                    </Badge>
                    <span className="text-xs text-gray-400">
                      Required: {achievement.requirement}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="achievements" />
    </div>
  );
}
