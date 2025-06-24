import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Crown, Trophy, Medal, Star, Flame, TrendingUp } from "lucide-react";

export default function Leaderboard() {
  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: ["/api/leaderboard?limit=50"],
  });

  const leaderboard = (leaderboardData as any)?.leaderboard || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Trophy className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Medal className="w-6 h-6 text-amber-600" />;
      default:
        return (
          <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-600">{rank}</span>
          </div>
        );
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-amber-500 to-amber-600 text-white";
      case 2:
        return "bg-gradient-to-r from-slate-400 to-slate-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-400 to-amber-500 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/20 safe-area-pb">
      <NavigationHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8 gentle-reveal">
          <h1 className="text-3xl font-medium text-slate-800 mb-2">
            Learning Community
          </h1>
          <p className="text-slate-600">
            Join fellow students on the journey of Quranic understanding
          </p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="mb-8">
            <div className="flex items-end justify-center space-x-4 mb-6">
              {/* Second Place */}
              <div className="text-center">
                <div className="w-20 h-16 bg-gradient-to-r from-slate-400 to-slate-500 rounded-t-lg flex items-center justify-center mb-2">
                  <span className="text-white font-medium text-lg">2</span>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md border-2 border-slate-300 card-tranquil shimmer-card hover-lift">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-gray-600">
                      {leaderboard[1]?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mobile-text-visible">
                    {leaderboard[1]?.displayName}
                  </p>
                  <p className="text-xs text-gray-600 mobile-text-visible">{leaderboard[1]?.xp} XP</p>
                </div>
              </div>

              {/* First Place */}
              <div className="text-center">
                <div className="w-24 h-20 bg-gradient-to-r from-amber-500 to-amber-600 rounded-t-lg flex items-center justify-center mb-2">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-amber-400 card-tranquil shimmer-card hover-lift">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-xl font-bold text-yellow-600">
                      {leaderboard[0]?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900 mobile-text-visible">
                    {leaderboard[0]?.displayName}
                  </p>
                  <p className="text-xs text-gray-600 mobile-text-visible">{leaderboard[0]?.xp} XP</p>
                  <Badge className="mt-2 bg-yellow-500 text-white">
                    Champion
                  </Badge>
                </div>
              </div>

              {/* Third Place */}
              <div className="text-center">
                <div className="w-20 h-14 bg-gradient-to-r from-amber-400 to-amber-600 rounded-t-lg flex items-center justify-center mb-2">
                  <span className="text-white font-bold text-lg">3</span>
                </div>
                <div className="bg-white rounded-lg p-4 shadow-md border-2 border-amber-400">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-lg font-bold text-amber-600">
                      {leaderboard[2]?.displayName?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">
                    {leaderboard[2]?.displayName}
                  </p>
                  <p className="text-xs text-gray-600">{leaderboard[2]?.xp} XP</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Full Rankings
              </h2>
              <Badge variant="outline" className="flex items-center space-x-1">
                <TrendingUp className="w-4 h-4" />
                <span>Live Updates</span>
              </Badge>
            </div>

            <div className="space-y-3">
              {leaderboard.map((player: any, index: number) => (
                <div
                  key={player.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-colors ${
                    index < 3
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {getRankIcon(player.rank)}
                  </div>

                  {/* Player Info */}
                  <div className="flex-1 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-primary">
                        {player.displayName?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {player.displayName}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-gray-600">
                          Level {player.level}
                        </span>
                        {player.streakDays > 0 && (
                          <div className="flex items-center space-x-1">
                            <Flame className="w-3 h-3 text-orange-500" />
                            <span className="text-xs text-orange-600">
                              {player.streakDays} day streak
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* XP and Badge */}
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">
                      {player.xp?.toLocaleString()} XP
                    </p>
                    <Badge 
                      className={`text-xs ${getRankBadgeColor(player.rank)}`}
                    >
                      #{player.rank}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {leaderboard.length === 0 && (
              <div className="text-center py-8">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No learners on the leaderboard yet.</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start learning to be the first!
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Motivational Section */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-6">
            <Trophy className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Keep Learning!
            </h3>
            <p className="text-sm text-gray-600">
              Complete daily challenges and learning sessions to climb the leaderboard.
              Every word you learn brings you closer to Quranic fluency!
            </p>
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="social" />
    </div>
  );
}