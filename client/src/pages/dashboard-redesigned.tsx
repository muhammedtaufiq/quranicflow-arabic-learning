import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { Star, BookOpen, Clock, Trophy, Heart, Flame, Target, Gift, Crown, Calendar, Zap, TreePine, Award, Info, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { AdminSettings } from "@/components/admin-settings";
import { ChapterCompletionBadge } from "@/components/chapter-completion-badge";
import { useState, useEffect } from "react";

export default function DashboardRedesigned() {
  const [showPhaseUnlockAnimation, setShowPhaseUnlockAnimation] = useState(false);
  const [unlockedPhase, setUnlockedPhase] = useState<number | null>(null);
  const [lastKnownPhase, setLastKnownPhase] = useState<number | null>(null);
  const { user } = useAuth();

  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [`/api/user/${user?.id}`],
    enabled: !!user?.id,
  });

  const { data: challengesData, isLoading: challengesLoading } = useQuery({
    queryKey: [`/api/user/${user?.id}/challenges`],
    enabled: !!user?.id,
  });

  const { data: contentStatsData } = useQuery({
    queryKey: ["/api/content-stats"],
  });

  // Get current phase from backend or default to 1
  const currentPhase = contentStatsData?.phase?.current || 1;
  const phaseDescription = contentStatsData?.phase?.description || 'Foundation Phase';
  const phaseTarget = contentStatsData?.phase?.nextCoverage || '65%';
  
  // Get focus areas for current phase
  const phaseFocusAreas = getPhaseFocusAreas(currentPhase);

  // Phase unlock detection and animation trigger
  useEffect(() => {
    if (currentPhase && lastKnownPhase && currentPhase > lastKnownPhase) {
      // New phase unlocked! Trigger celebration
      setUnlockedPhase(currentPhase);
      setShowPhaseUnlockAnimation(true);
      
      // Hide animation after 8 seconds
      setTimeout(() => {
        setShowPhaseUnlockAnimation(false);
        setUnlockedPhase(null);
      }, 8000);
    }
    
    if (currentPhase && currentPhase !== lastKnownPhase) {
      setLastKnownPhase(currentPhase);
    }
  }, [currentPhase, lastKnownPhase]);
  
  function getPhaseFocusAreas(phaseId: number): string {
    const phaseMap: Record<number, string> = {
      1: "Basic prayer vocabulary, Divine names, Essential verbs",
      2: "Prophetic names, Moral qualities, Natural phenomena", 
      3: "Story vocabulary, Descriptive terms, Complex grammar",
      4: "Scholarly terms, Theological concepts, Advanced expressions",
      5: "Complete mastery, Rare terms, Historical references",
      6: "Expert level, Classical Arabic, Scholarly commentary"
    };
    return phaseMap[phaseId] || "Foundation vocabulary";
  }

  const { data: chapterProgressData } = useQuery({
    queryKey: [`/api/user/${user?.id}/chapter-progress`],
    enabled: !!user?.id,
  });

  const currentUser = (userData as any)?.user;
  const challenges = (challengesData as any)?.challenges || [];
  const contentStats = (contentStatsData as any) || {};
  const chapterProgress = (chapterProgressData as any)?.progressList || [];
  const chapterStats = (chapterProgressData as any)?.chapterProgress || {};

  // Transform technical stats into user-friendly visuals  
  const displayUser = currentUser || user;
  const learningProgress = Math.min(100, ((displayUser?.xp || 0) / 1000) * 100);
  const streakDays = displayUser?.streakDays || 0;
  const totalLearningPaths = Math.ceil((contentStats.totalWords || 1611) / 20); // 20 words per path
  const unlockedPaths = Math.min(totalLearningPaths, Math.floor((displayUser?.xp || 0) / 50) + 1);
  
  // Chapter completion stats
  const completedChapters = Object.values(chapterStats).filter((progress: any) => progress === 100).length;
  const inProgressChapters = Object.values(chapterStats).filter((progress: any) => progress > 0 && progress < 100).length;
  const totalChaptersStudied = Object.keys(chapterStats).length;

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
      
      {/* Birthday Hat Celebration */}
      {showPhaseUnlockAnimation && unlockedPhase && (
        <div className="fixed inset-0 z-50 pointer-events-none">
          <div className="candy-crush-celebration">
            <div className="birthday-hat birthday-hat-1"></div>
            <div className="birthday-hat birthday-hat-2"></div>
            <div className="birthday-hat birthday-hat-3"></div>
            <div className="birthday-hat birthday-hat-4"></div>
            <div className="birthday-hat birthday-hat-5"></div>
            <div className="birthday-hat birthday-hat-6"></div>
            <div className="confetti-piece confetti-1"></div>
            <div className="confetti-piece confetti-2"></div>
            <div className="confetti-piece confetti-3"></div>
            <div className="confetti-piece confetti-4"></div>
            <div className="confetti-piece confetti-5"></div>
            <div className="confetti-piece confetti-6"></div>
            <div className="confetti-piece confetti-7"></div>
            <div className="confetti-piece confetti-8"></div>
            <div className="celebration-text">Phase {unlockedPhase} Unlocked!</div>
          </div>
        </div>
      )}

      
      <main className="px-4 pt-20 pb-20 space-y-6 mobile-compact">
        {/* Warm Welcome */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-slate-800 mb-2">
                As-salāmu ʿalaykum, {user?.displayName || 'Student'}
              </h1>
              <p className="text-slate-600">Continue your blessed journey of Quranic understanding</p>
              
              {/* Always visible phase indicator */}
              <div className="flex items-center justify-center space-x-2 mt-3">
                <Badge className="bg-teal-500 text-white text-sm px-3 py-1">
                  Active: Phase {currentPhase}
                </Badge>
                <span className="text-sm text-slate-700 font-medium">
                  {phaseDescription}
                </span>
              </div>
            </div>
            <AdminSettings onPhaseSelect={(phaseId) => console.log('Selected phase:', phaseId)} />
          </div>
        </div>

        {/* PROMINENT PHASE STATUS CARD - Always Visible */}
        <Card className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-5 h-5 bg-white rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-xl font-bold">Currently Active: Phase {currentPhase}</h3>
                  <p className="text-emerald-100">{phaseDescription}</p>
                  <p className="text-emerald-200 text-sm">Focus: {phaseFocusAreas} • Target: {phaseTarget} coverage</p>
                </div>
              </div>
              <Badge className="bg-white text-teal-700 font-bold px-4 py-2 text-lg">
                PHASE {currentPhase}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Quick Progress Overview - Simplified */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="bg-teal-50 rounded-lg p-3 border border-teal-100 text-center">
            <div className="text-lg font-bold text-teal-700">{contentStats.totalWords || 1049}</div>
            <div className="text-xs text-slate-600">Words Available</div>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-100 text-center">
            <div className="text-lg font-bold text-emerald-700">{user?.level || 2}</div>
            <div className="text-xs text-slate-600">Your Level</div>
          </div>
          <div className="bg-orange-50 rounded-lg p-3 border border-orange-100 text-center">
            <div className="text-lg font-bold text-orange-700">{streakDays}</div>
            <div className="text-xs text-slate-600">Day Streak</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3 border border-purple-100 text-center">
            <div className="text-lg font-bold text-purple-700">{completedChapters}</div>
            <div className="text-xs text-slate-600">Chapters Done</div>
          </div>
        </div>

        {/* Visual Journey Progress */}
        <div className="bg-gradient-to-r from-emerald-100 via-teal-100 to-cyan-100 rounded-3xl p-6 shadow-lg border border-emerald-200 shimmer-card hover-lift">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Journey Visualization */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 via-teal-400 to-cyan-400 flex items-center justify-center shadow-xl border-4 border-white animate-pulse">
                  <BookOpen className="w-10 h-10 text-white" />
                </div>
                {streakDays > 0 && (
                  <div className="absolute -top-2 -left-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-full p-2 shadow-lg animate-bounce">
                    <Flame className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full px-3 py-1 shadow-lg border-2 border-white">
                  <div className="flex items-center space-x-1">
                    <Crown className="w-3 h-3 text-yellow-300" />
                    <span className="text-xs font-bold text-white">{displayUser?.level || 1}</span>
                  </div>
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
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 shadow-lg shimmer-card hover-lift">
            <CardContent className="p-6 text-center">
              <Target className="w-12 h-12 text-blue-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Today's Mission</h3>
              {challenges.length > 0 ? (
                <>
                  <p className="text-slate-600 text-sm mb-4">{challenges[0].description}</p>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full transition-all duration-300" 
                      style={{ width: `${Math.min(100, (challenges[0].progress / challenges[0].requirement) * 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">
                    {challenges[0].progress} of {challenges[0].requirement} complete
                  </p>
                </>
              ) : (
                <>
                  <p className="text-slate-600 text-sm mb-4">Start learning today</p>
                  <div className="w-full bg-blue-200 rounded-full h-3">
                    <div className="bg-blue-500 h-3 rounded-full" style={{ width: '0%' }}></div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2">No active challenge</p>
                </>
              )}
            </CardContent>
          </Card>

          {/* This Week */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg shimmer-card hover-lift">
            <CardContent className="p-6 text-center">
              <Calendar className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">This Week</h3>
              <p className="text-slate-600 text-sm mb-4">Current streak: {streakDays} days</p>
              <div className="flex justify-center space-x-1 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => {
                  const dayOfWeek = new Date().getDay();
                  const isToday = i === dayOfWeek;
                  const isCompleted = i < dayOfWeek && streakDays > 0;
                  const isCurrent = i === dayOfWeek && streakDays > 0;
                  
                  return (
                    <div 
                      key={i} 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted || isCurrent ? 'bg-purple-500 text-white' : 
                        isToday ? 'bg-purple-300 text-purple-700 ring-2 ring-purple-500' : 
                        'bg-purple-200 text-purple-400'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-slate-500">
                {streakDays > 0 ? `${streakDays} day streak` : 'Start your streak today'}
              </p>
            </CardContent>
          </Card>

          {/* Rewards */}
          <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200 shadow-lg shimmer-card hover-lift">
            <CardContent className="p-6 text-center">
              <Gift className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
              <h3 className="font-bold text-slate-800 mb-2">Next Reward</h3>
              {(() => {
                const nextLevel = (user?.level || 1) + 1;
                const xpNeeded = (nextLevel * 1000) - (user?.xp || 0);
                const nextAchievement = user?.xp < 1000 ? 'Scholar Badge' : 'Word Master';
                const xpForNext = user?.xp < 1000 ? 1000 - (user?.xp || 0) : 5000 - (user?.xp || 0);
                
                return (
                  <>
                    <p className="text-slate-600 text-sm mb-4">{nextAchievement}</p>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-medium">{xpForNext} XP needed</span>
                    </div>
                    <div className="w-full bg-emerald-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-500 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${Math.min(100, ((user?.xp || 0) % 1000) / 10)}%` }}
                      ></div>
                    </div>
                  </>
                );
              })()}
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
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-emerald-100 to-teal-100 border-emerald-300 group shimmer-card hover-lift">
                <CardContent className="p-8 text-center mobile-compact">
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 mobile-text-visible">Start Learning</h3>
                  <p className="text-slate-600 text-sm mobile-text-visible">Begin your daily lesson</p>
                </CardContent>
              </Card>
            </Link>

            {/* Review Words */}
            <Link href="/learn?type=review">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-cyan-100 border-blue-300 group shimmer-card hover-lift">
                <CardContent className="p-8 text-center mobile-compact">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 mobile-text-visible">Review Time</h3>
                  <p className="text-slate-600 text-sm mobile-text-visible">Practice what you've learned</p>
                </CardContent>
              </Card>
            </Link>

            {/* Chapter Learning */}
            <Link href="/learn?type=chapter">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-100 to-indigo-100 border-blue-300 group shimmer-card hover-lift">
                <CardContent className="p-8 text-center mobile-compact">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 mobile-text-visible">Sacred Chapters</h3>
                  <p className="text-slate-600 text-sm mobile-text-visible">Learn from specific Surahs</p>
                </CardContent>
              </Card>
            </Link>

            {/* Daily Challenge */}
            <Link href="/learn?type=daily">
              <Card className="cursor-pointer hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-purple-100 to-pink-100 border-purple-300 group shimmer-card hover-lift">
                <CardContent className="p-8 text-center mobile-compact">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Trophy className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800 mb-2 mobile-text-visible">Daily Challenge</h3>
                  <p className="text-slate-600 text-sm mobile-text-visible">Test your knowledge</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>

        {/* Chapter Progress Overview */}
        {totalChaptersStudied > 0 && (
          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                Chapter Progress
              </h2>
              <Link href="/progress">
                <Button variant="ghost" size="sm" className="text-teal-600 hover:text-teal-700">
                  View Details
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-emerald-600">{completedChapters}</div>
                  <div className="text-sm text-emerald-700">Completed</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-amber-600">{inProgressChapters}</div>
                  <div className="text-sm text-amber-700">In Progress</div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-br from-slate-50 to-gray-50 border-slate-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-slate-600">{totalChaptersStudied}</div>
                  <div className="text-sm text-slate-700">Total Studied</div>
                </CardContent>
              </Card>
            </div>

            {/* Show completed chapters */}
            {completedChapters > 0 && (
              <div className="text-center p-4 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg border border-emerald-200">
                <div className="flex items-center justify-center gap-2 text-emerald-800 mb-2">
                  <Trophy className="w-5 h-5" />
                  <span className="font-semibold">Mastery Achieved!</span>
                </div>
                <div className="text-sm text-emerald-700">
                  You have completed {completedChapters} chapter{completedChapters > 1 ? 's' : ''} with 100% mastery
                </div>
                <div className="text-xs text-emerald-600 mt-1">
                  Chapters: {Object.entries(chapterStats)
                    .filter(([_, progress]) => progress === 100)
                    .map(([chapterId]) => {
                      const chapterNames: Record<string, string> = {
                        '1': 'Al-Fatiha',
                        '36': 'Ya-Sin', 
                        '112': 'Al-Ikhlas',
                        '113': 'Al-Falaq',
                        '114': 'An-Nas'
                      };
                      return chapterNames[chapterId] || `Chapter ${chapterId}`;
                    })
                    .join(', ')
                  }
                </div>
              </div>
            )}
          </div>
        )}

        {/* Motivational Message */}
        <div className="text-center py-8">
          <div className="bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl p-6 border border-emerald-200 shimmer-card hover-lift">
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