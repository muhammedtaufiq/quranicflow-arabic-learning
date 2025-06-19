import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LearningCard } from "@/components/learning-card";
import { ProgressCircle } from "@/components/progress-circle";
import { AchievementBadge } from "@/components/achievement-badge";
import { QuranProgressChart } from "@/components/quran-progress-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Flame, Star, Brain, Clock, Trophy, Medal, Crown, Calendar } from "lucide-react";

// Mock user data - in a real app this would come from authentication
const MOCK_USER_ID = 1;

export default function Dashboard() {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}`],
  });

  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/challenges`],
  });

  const { data: achievementsData, isLoading: achievementsLoading } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/achievements`],
  });

  const { data: leaderboardData, isLoading: leaderboardLoading } = useQuery({
    queryKey: ["/api/leaderboard?limit=3"],
  });

  const { data: chapterProgressData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/chapter-progress`],
  });

  const isLoading = userLoading || challengesLoading || achievementsLoading || leaderboardLoading;

  const user = (userData as any)?.user;
  const stats = (userData as any)?.stats;
  const challenges = (challengesData as any)?.challenges || [];
  const recentAchievements = (achievementsData as any)?.achievements?.filter((a: any) => a.unlocked).slice(0, 2) || [];
  const leaderboard = (leaderboardData as any)?.leaderboard || [];

  const comprehensionPercentage = user?.comprehensionPercentage || 73;
  const dailyChallenge = challenges.find((c: any) => c.type === 'daily');
  const weeklyChallenge = challenges.find((c: any) => c.type === 'weekly');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your Arabic learning journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-primary rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  السلام عليكم, {user?.displayName || 'Student'}! 👋
                </h1>
                <p className="text-primary-100 mb-4">Ready to continue your Quranic Arabic journey?</p>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    Level {user?.level || 1}
                  </Badge>
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {comprehensionPercentage}% Quranic Comprehension
                  </Badge>
                </div>
              </div>
              <div className="mt-4 md:mt-0">
                <ProgressCircle percentage={comprehensionPercentage} size={96} />
              </div>
            </div>
          </div>
        </div>

        {/* App Coverage Info */}
        <div className="mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-100 rounded-full">
                  <Brain className="h-6 w-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Your Quranic Arabic Learning Journey
                  </h3>
                  <p className="text-gray-700 mb-3">
                    Master <span className="font-semibold text-blue-600">270+ essential Arabic words</span> from the most important chapters including Al-Fatiha, short chapters (112-114), Ayat al-Kursi, and key vocabulary from popular chapters like Yasin, Al-Mulk, and more.
                  </p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      70% Quran Coverage
                    </Badge>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      270+ Authentic Words
                    </Badge>
                    <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                      Essential Chapters
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    These carefully selected high-frequency words will help you understand approximately <span className="font-semibold">70% of the Quran's text</span>, giving you an excellent foundation to build upon. More vocabulary will be added as you progress!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Learning Path */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Today's Challenge */}
            {dailyChallenge && (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Today's Challenge</h2>
                    <div className="flex items-center space-x-1 text-accent">
                      <Star className="w-4 h-4" />
                      <span className="text-sm font-medium">+{dailyChallenge.xpReward} XP</span>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">{dailyChallenge.title}</span>
                      <span className="text-sm font-medium text-primary">
                        {dailyChallenge.progress}/{dailyChallenge.requirement} completed
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${(dailyChallenge.progress / dailyChallenge.requirement) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90"
                    onClick={() => window.location.href = '/learn?type=daily'}
                  >
                    Continue Challenge
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quran Progress Chart */}
            <div className="mb-8">
              <QuranProgressChart 
                userProgress={(chapterProgressData as any)?.chapterProgress || {}}
                onChapterSelect={(chapterNumber) => {
                  window.location.href = `/learn?chapter=${chapterNumber}`;
                }}
              />
            </div>

            {/* Learning Session Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <LearningCard
                icon={<Brain className="text-primary text-xl" />}
                title="Word Discovery"
                description="Learn 5 new high-frequency Quranic words"
                duration="~10 minutes"
                xpReward={50}
                badge="New Words"
                badgeColor="green"
                href="/learn?type=words"
              />
              
              <LearningCard
                icon={<Trophy className="text-secondary text-xl" />}
                title="Sentence Structure"
                description="Practice Arabic word order and syntax"
                duration="~15 minutes"
                xpReward={75}
                badge="Grammar"
                badgeColor="blue"
                href="/learn?type=grammar"
              />
              
              <LearningCard
                icon={<div className="text-accent text-xl">📖</div>}
                title="Chapter Learning"
                description="Study specific Quranic chapters (Al-Fatiha, Al-Ikhlas, etc.)"
                duration="~15 minutes"
                xpReward={75}
                badge="Chapters"
                badgeColor="yellow"
                href="/learn?type=chapters"
              />
              
              <LearningCard
                icon={<div className="text-accent text-xl">🔄</div>}
                title="Spaced Review"
                description="Review 12 words due for practice"
                duration="~8 minutes"
                xpReward={40}
                badge="Review"
                badgeColor="purple"
                href="/learn?type=review"
              />

            </div>
          </div>

          {/* Right Column: Stats & Achievements */}
          <div className="space-y-6">
            
            {/* Daily Stats */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Progress</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Brain className="text-primary w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-700">Words Learned</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {stats?.learnedWordsCount || 0}/10
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <Star className="text-accent w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-700">XP Earned</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">{user?.xp || 0}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                        <Flame className="text-orange-500 w-4 h-4 streak-fire" />
                      </div>
                      <span className="text-sm text-gray-700">Streak</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {user?.streakDays || 0} days
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Clock className="text-blue-600 w-4 h-4" />
                      </div>
                      <span className="text-sm text-gray-700">Time Spent</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">34 mins</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Achievements */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Achievements</h3>
                
                <div className="space-y-3">
                  {recentAchievements.map((achievement: any) => (
                    <AchievementBadge
                      key={achievement.id}
                      icon={achievement.icon}
                      name={achievement.name}
                      description={achievement.description}
                      timeAgo="2h ago"
                      isRecent={true}
                    />
                  ))}
                  
                  {recentAchievements.length === 0 && (
                    <p className="text-sm text-gray-500">No recent achievements. Keep learning to unlock more!</p>
                  )}
                </div>

                <Button variant="ghost" className="w-full mt-4 text-sm text-primary hover:text-primary/80">
                  View all achievements
                </Button>
              </CardContent>
            </Card>

            {/* Leaderboard */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">Weekly Leaderboard</h3>
                  <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80">
                    View all
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {leaderboard.map((player: any, index: number) => (
                    <div key={player.id} className="flex items-center space-x-3">
                      <div className="w-6 h-6 flex items-center justify-center">
                        {index === 0 ? (
                          <Crown className="w-4 h-4 text-accent" />
                        ) : index === 1 ? (
                          <Medal className="w-4 h-4 text-gray-400" />
                        ) : index === 2 ? (
                          <Medal className="w-4 h-4 text-amber-600" />
                        ) : (
                          <span className="text-xs font-bold text-gray-400">{index + 1}</span>
                        )}
                      </div>
                      <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {player.displayName?.charAt(0) || 'U'}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{player.displayName}</p>
                        <p className="text-xs text-gray-600">{player.xp} XP</p>
                      </div>
                      {index === 0 && <Crown className="w-4 h-4 text-accent" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Weekly Challenge */}
            {weeklyChallenge && (
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold">Weekly Challenge</h3>
                  <Calendar className="w-5 h-5 text-white/80" />
                </div>
                <p className="text-sm text-white/90 mb-4">{weeklyChallenge.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm">Progress</span>
                  <span className="text-sm font-medium">
                    {weeklyChallenge.progress}/{weeklyChallenge.requirement}
                  </span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 mb-4">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${(weeklyChallenge.progress / weeklyChallenge.requirement) * 100}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-white/80">4 days left</span>
                  <div className="flex items-center space-x-1">
                    <Trophy className="w-4 h-4 text-yellow-300" />
                    <span className="text-xs">{weeklyChallenge.xpReward} XP reward</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <BottomNavigation currentPage="home" />
    </div>
  );
}
