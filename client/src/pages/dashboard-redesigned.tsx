import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { Star, BookOpen, Clock, Trophy, Heart, Flame, Target, Gift, Crown, Calendar, Zap, TreePine } from "lucide-react";
import { Link } from "wouter";
import { AdminSettings } from "@/components/admin-settings";

// Mock user data - in a real app this would come from authentication
const MOCK_USER_ID = 1;

export default function DashboardRedesigned() {
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}`],
  });

  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/challenges`],
  });

  const { data: contentStatsData } = useQuery({
    queryKey: ["/api/content-stats"],
  });

  const user = (userData as any)?.user;
  const challenges = (challengesData as any)?.challenges || [];
  const contentStats = (contentStatsData as any) || {};

  // Transform technical stats into user-friendly visuals
  const learningProgress = Math.min(100, ((user?.xp || 0) / 1000) * 100);
  const streakDays = user?.streak || 0;
  const totalLearningPaths = Math.ceil((contentStats.totalWords || 632) / 20); // 20 words per path
  const unlockedPaths = Math.min(totalLearningPaths, Math.floor((user?.xp || 0) / 50) + 1);

  if (userLoading || challengesLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
        <NavigationHeader />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <NavigationHeader />
      <main className="px-4 pt-20 pb-20 space-y-6">
        {/* Warm Welcome */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                As-salāmu ʿalaykum, {user?.displayName || 'Student'}
              </h1>
              <p className="text-slate-600">Continue your blessed journey of Quranic understanding</p>
            </div>
            <AdminSettings onPhaseSelect={(phaseId) => console.log('Selected phase:', phaseId)} />
          </div>
        </div>

        {/* Visual Journey Progress */}
        <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 rounded-3xl p-6 shadow-lg border border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Journey Visualization */}
              <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-xl">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                {streakDays > 0 && (
                  <div className="absolute -top-2 -right-2 bg-red-500 rounded-full p-2 shadow-lg">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white rounded-full px-3 py-1 shadow-md border-2 border-emerald-300">
                  <span className="text-xs font-bold text-emerald-600">Level {user?.level || 1}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-slate-800">Your Path of Knowledge</h3>
                
                {/* Visual Progress Indicators */}
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < Math.floor(learningProgress / 20) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium text-slate-700">Knowledge Stars</span>
                  </div>
                  
                  {streakDays > 0 && (
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        {[...Array(Math.min(7, streakDays))].map((_, i) => (
                          <div key={i} className="w-2 h-2 rounded-full bg-red-400"></div>
                        ))}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{streakDays} Day Journey</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Achievement Badge */}
            <div className="bg-white rounded-2xl p-4 shadow-lg border border-emerald-200">
              <div className="text-center">
                <TreePine className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-emerald-600">{unlockedPaths}</div>
                <div className="text-xs text-slate-600 font-medium">Learning<br/>Paths Open</div>
              </div>
            </div>
          </div>
        </div>

        {/* Simple Progress Visualization */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Today's Goal */}
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Today's Mission</h3>
              <p className="text-slate-600 text-sm mb-4">Learn 5 new words</p>
              <div className="w-full bg-blue-200 rounded-full h-3">
                <div className="bg-blue-500 h-3 rounded-full" style={{ width: '20%' }}></div>
              </div>
              <p className="text-xs text-slate-500 mt-2">1 of 5 complete</p>
            </CardContent>
          </Card>

          {/* This Week */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">This Week</h3>
              <p className="text-slate-600 text-sm mb-4">Study every day</p>
              <div className="flex justify-center space-x-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                  <div 
                    key={i} 
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i < streakDays ? 'bg-purple-500 text-white' : 'bg-purple-200 text-purple-400'
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              <p className="text-xs text-slate-500">{streakDays} days strong</p>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg">
            <CardContent className="p-6 text-center">
              <Gift className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Next Reward</h3>
              <p className="text-slate-600 text-sm mb-4">7-day streak badge</p>
              <div className="text-2xl font-bold text-emerald-600 mb-1">{Math.max(0, 7 - streakDays)}</div>
              <p className="text-xs text-slate-500">days to go</p>
            </CardContent>
          </Card>
        </div>

        {/* Learning Actions - Beautiful and Clear */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 text-center mb-6">Choose Your Path</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Start Learning */}
            <Link href="/learn">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Start Learning</h3>
                  <p className="text-slate-600 text-sm">Begin your daily lesson</p>
                </CardContent>
              </Card>
            </Link>

            {/* Review Words */}
            <Link href="/review">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Review Time</h3>
                  <p className="text-slate-600 text-sm">Practice what you've learned</p>
                </CardContent>
              </Card>
            </Link>

            {/* Chapter Learning */}
            <Link href="/chapters">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Sacred Chapters</h3>
                  <p className="text-slate-600 text-sm">Learn from specific Surahs</p>
                </CardContent>
              </Card>
            </Link>

            {/* Daily Challenge */}
            <Link href="/challenges">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 group">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2">Daily Challenge</h3>
                  <p className="text-slate-600 text-sm">Test your knowledge</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border border-emerald-200">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <p className="text-slate-700 font-medium">
              "And whoever relies upon Allah - then He is sufficient for him."
            </p>
            <p className="text-slate-500 text-sm mt-1">- Quran 65:3</p>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}