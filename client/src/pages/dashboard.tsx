import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LearningCard } from "@/components/learning-card";
import { ProgressCircle } from "@/components/progress-circle";
import { AchievementBadge } from "@/components/achievement-badge";
import { SurahCoverageChart } from "@/components/surah-coverage-chart";
import { PhasedLearningDashboard } from "@/components/phased-learning-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Star, Brain, Clock, Trophy, Crown, Calendar, BookOpen, Info, Target, BookOpen as BookIcon } from "lucide-react";
import { Link } from "wouter";

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

  const { data: contentStatsData } = useQuery({
    queryKey: ["/api/content-stats"],
  });

  const isLoading = userLoading || challengesLoading || achievementsLoading || leaderboardLoading;

  const user = (userData as any)?.user;
  const stats = (userData as any)?.stats;
  const challenges = (challengesData as any)?.challenges || [];
  const recentAchievements = (achievementsData as any)?.achievements?.filter((a: any) => a.unlocked).slice(0, 2) || [];
  const leaderboard = (leaderboardData as any)?.leaderboard || [];
  const contentStats = (contentStatsData as any) || {};

  const comprehensionPercentage = user?.comprehensionPercentage || 73;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <NavigationHeader />
        <main className="pb-20 pt-16">
          <div className="max-w-4xl mx-auto p-4">
            <div className="animate-pulse space-y-6">
              <div className="h-32 bg-slate-200 rounded-lg"></div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-40 bg-slate-200 rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <BottomNavigation currentPage="home" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <NavigationHeader />
      <main className="pb-20 pt-16">
        <div className="max-w-4xl mx-auto p-2 md:p-4 space-y-3 md:space-y-6">
          {/* Compact Mobile Header with Phase Info */}
          <div className="text-center mb-2 md:mb-6">
            <h1 className="text-lg md:text-2xl font-medium text-slate-800 mb-1 md:mb-2">
              Welcome back, {user?.displayName || 'Student'}
            </h1>
            <div className="flex items-center justify-center space-x-2 mb-1">
              <p className="text-xs md:text-base text-slate-600">Ready to learn Quranic Arabic today?</p>
              {contentStats?.phase && (
                <Badge variant="outline" className="text-xs">
                  Phase {contentStats.phase.current}: {contentStats.phase.description}
                </Badge>
              )}
            </div>
          </div>

          {/* Ultra Compact Progress Overview - Mobile Optimized */}
          <div className="card-tranquil mb-2 md:mb-6 p-2 md:p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 md:space-x-4">
                <div className="relative">
                  <ProgressCircle percentage={comprehensionPercentage} size={50} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xs md:text-lg font-medium text-slate-800">{comprehensionPercentage}%</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm md:text-lg font-medium text-slate-800">Level {user?.level || 1}</h3>
                  <p className="text-xs md:text-sm text-slate-600">{user?.xp || 1250} XP • {Math.floor((user?.xp || 1250) / 50)} day streak</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-base md:text-2xl font-medium text-slate-800">{contentStats.totalWords || 1500}</div>
                <div className="text-xs md:text-sm text-slate-600">100% Coverage</div>
              </div>
            </div>
          </div>

          {/* Compact Stats - Hidden on Mobile by Default */}
          <div className="hidden md:grid md:grid-cols-4 gap-4 mb-6">
            <Card className="card-tranquil">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium text-slate-800">{contentStats.totalWords || 1500}</div>
                <div className="text-sm text-slate-600">Words Available</div>
              </CardContent>
            </Card>
            <Card className="card-tranquil">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium text-slate-800">100%</div>
                <div className="text-sm text-slate-600">Coverage</div>
              </CardContent>
            </Card>
            <Card className="card-tranquil">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium text-slate-800">{user?.level || 1}</div>
                <div className="text-sm text-slate-600">Your Level</div>
              </CardContent>
            </Card>
            <Card className="card-tranquil">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-medium text-slate-800">{Math.floor((user?.xp || 1250) / 50)}</div>
                <div className="text-sm text-slate-600">Day Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Prioritized Learning Actions - Mobile First */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
            {/* Left Column: Learning Options - Priority Content */}
            <div className="lg:col-span-2 space-y-4 md:space-y-6">
              {/* Today's Challenge - Compact on Mobile */}
              {challenges.length > 0 && (
                <Card className="card-tranquil">
                  <CardContent className="p-3 md:p-6">
                    <div className="flex items-center justify-between mb-2 md:mb-4">
                      <h3 className="text-sm md:text-lg font-medium text-slate-800 flex items-center">
                        <Calendar className="h-4 w-4 md:h-5 md:w-5 mr-1 md:mr-2 text-teal-600" />
                        Today's Challenge
                      </h3>
                      <Badge className="bg-teal-100 text-teal-800 text-xs">
                        +{challenges[0]?.xpReward || 50} XP
                      </Badge>
                    </div>
                    <p className="text-xs md:text-base text-slate-700 mb-2 md:mb-4">{challenges[0]?.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1 md:space-x-2">
                        <div className="w-full bg-slate-200 rounded-full h-1.5 md:h-2 max-w-[100px] md:max-w-[200px]">
                          <div 
                            className="bg-teal-500 h-1.5 md:h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${(challenges[0]?.progress || 0) / (challenges[0]?.target || 1) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-slate-600">
                          {challenges[0]?.progress || 0}/{challenges[0]?.target || 1}
                        </span>
                      </div>
                      <Link to="/learn?type=daily">
                        <Button className="btn-peaceful text-xs md:text-base px-2 md:px-4 py-1 md:py-2">
                          Start Challenge
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Learning Options - Ultra Compact Mobile Grid */}
              <div className="grid grid-cols-2 md:grid-cols-2 gap-2 md:gap-4">
                <LearningCard
                  title="Vocabulary Practice"
                  description="Learn new Arabic words"
                  icon={<BookOpen className="h-5 w-5 md:h-6 md:w-6" />}
                  href="/learn?type=words"
                  duration="5-10 min"
                  xpReward={25}
                  badge="New"
                  badgeColor="green"
                />
                <LearningCard
                  title="Spaced Review"
                  description="Review words you've learned"
                  icon={<Clock className="h-5 w-5 md:h-6 md:w-6" />}
                  href="/learn?type=review"
                  duration="10-15 min"
                  xpReward={50}
                  badge="Review"
                  badgeColor="blue"
                />
                <LearningCard
                  title="Chapter Learning"
                  description="Study specific chapters"
                  icon={<Brain className="h-5 w-5 md:h-6 md:w-6" />}
                  href="/learn?type=chapters"
                  duration="15-20 min"
                  xpReward={75}
                  badge="Study"
                  badgeColor="purple"
                />
                <LearningCard
                  title="Grammar Structure"
                  description="Understand sentence patterns"
                  icon={<Star className="h-5 w-5 md:h-6 md:w-6" />}
                  href="/learn?type=grammar"
                  duration="10-15 min"
                  xpReward={60}
                  badge="Grammar"
                  badgeColor="purple"
                />
              </div>
            </div>

            {/* Right Column: Progress & Social - Collapsed on Mobile */}
            <div className="space-y-4 md:space-y-6">
              {/* Recent Achievements - Compact */}
              {recentAchievements.length > 0 && (
                <Card className="card-tranquil">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-medium text-slate-800 mb-3 md:mb-4 flex items-center">
                      <Trophy className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-600" />
                      Recent Achievements
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      {recentAchievements.slice(0, 2).map((achievement: any) => (
                        <AchievementBadge
                          key={achievement.id}
                          name={achievement.name}
                          description={achievement.description}
                          icon="trophy"
                        />
                      ))}
                    </div>
                    <Link to="/achievements">
                      <Button variant="outline" className="w-full mt-3 md:mt-4 btn-wisdom text-sm md:text-base">
                        View All Achievements
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Leaderboard - Compact */}
              {leaderboard.length > 0 && (
                <Card className="card-tranquil hidden lg:block">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-medium text-slate-800 mb-3 md:mb-4 flex items-center">
                      <Crown className="h-4 w-4 md:h-5 md:w-5 mr-2 text-teal-600" />
                      Top Learners
                    </h3>
                    <div className="space-y-2 md:space-y-3">
                      {leaderboard.slice(0, 3).map((learner: any, index: number) => (
                        <div key={learner.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 md:space-x-3">
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' :
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              'bg-orange-100 text-orange-800'
                            }`}>
                              {index + 1}
                            </div>
                            <span className="font-medium text-slate-800 text-sm md:text-base">{learner.displayName}</span>
                          </div>
                          <span className="text-xs md:text-sm text-slate-600">{learner.xp} XP</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/leaderboard">
                      <Button variant="outline" className="w-full mt-3 md:mt-4 btn-wisdom text-sm md:text-base">
                        View Full Leaderboard
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              )}

              {/* Family Learning - Hidden on Mobile */}
              <Card className="card-tranquil hidden lg:block">
                <CardContent className="p-4 md:p-6">
                  <h3 className="text-base md:text-lg font-medium text-slate-800 mb-3 md:mb-4">
                    Family Learning
                  </h3>
                  <p className="text-slate-600 text-xs md:text-sm mb-3 md:mb-4">
                    Learn together with your family and track group progress.
                  </p>
                  <Link to="/family">
                    <Button className="w-full btn-peaceful text-sm md:text-base">
                      Explore Family Features
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Advanced Features - Collapsed on Mobile */}
          <div className="hidden md:block mt-6 md:mt-8">
            <PhasedLearningDashboard />
          </div>

          <div className="hidden lg:block mt-6 md:mt-8">
            <SurahCoverageChart />
          </div>
        </div>
      </main>
      <BottomNavigation currentPage="home" />
    </div>
  );
}