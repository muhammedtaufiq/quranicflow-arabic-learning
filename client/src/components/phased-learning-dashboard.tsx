import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Target, Clock, Award, Bell, Brain, TrendingUp } from "lucide-react";
import { useState } from "react";

interface AnalyticsData {
  totalWordsLearned?: number;
  strugglingWordsCount?: number;
  reviewQueueSize?: number;
  learningPattern?: {
    averageSessionLength?: number;
    bestTimeOfDay?: string;
  };
}

// Using authenticated user data

interface LearningPhase {
  id: number;
  name: string;
  description: string;
  minWordsToUnlock: number;
  maxDailyWords: number;
  focusAreas: string[];
}

interface StreakStats {
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

interface Notification {
  userId: number;
  message: string;
  type: 'warning' | 'celebration' | 'milestone';
  scheduledTime: Date;
}

export function PhasedLearningDashboard() {
  const [selectedPhase, setSelectedPhase] = useState<number>(1);
  const queryClient = useQueryClient();

  // Fetch learning phases
  const { data: phasesData } = useQuery({
    queryKey: ["/api/learning-phases"],
  });

  // Fetch current phase
  const { data: currentPhaseData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/current-phase`],
  });

  // Fetch streak statistics
  const { data: streakStats } = useQuery<StreakStats>({
    queryKey: [`/api/user/${MOCK_USER_ID}/streak-stats`],
  });

  // Fetch notifications
  const { data: notificationsData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/notifications`],
  });

  // Fetch learning analytics
  const { data: analyticsData } = useQuery({
    queryKey: [`/api/user/${user?.id}/learning-analytics`],
    enabled: !!user?.id,
  });

  // Fetch daily lesson
  const { data: dailyLessonData } = useQuery({
    queryKey: [`/api/user/${user?.id}/daily-lesson`, selectedPhase],
    queryFn: () => fetch(`/api/user/${user?.id}/daily-lesson?phase=${selectedPhase}`).then(res => res.json()),
    enabled: !!user?.id,
  });

  // Clear notifications mutation
  const clearNotificationsMutation = useMutation({
    mutationFn: () => fetch(`/api/user/${user?.id}/clear-notifications`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${user?.id}/notifications`] });
    },
  });

  const phases: LearningPhase[] = (phasesData as any)?.phases || [];
  const currentPhase: LearningPhase = (currentPhaseData as any)?.currentPhase || phases[0];
  const notifications: Notification[] = (notificationsData as any)?.notifications || [];
  const dailyLesson: any[] = (dailyLessonData as any)?.lesson || [];

  const getPhaseProgress = (phase: LearningPhase): number => {
    if (!phase || !phase.minWordsToUnlock) return 0;
    const totalWords: number = (analyticsData as AnalyticsData)?.totalWordsLearned || 0;
    return Math.min(100, (totalWords / phase.minWordsToUnlock) * 100);
  };

  const handleStartLesson = (phaseId: number) => {
    // Navigate to learning session with specific phase
    window.location.href = `/learn?phase=${phaseId}&mode=daily`;
  };

  // Phase celebration detection
  useEffect(() => {
    const lastPhase = localStorage.getItem('lastPhase');
    const currentPhaseId = (currentPhaseData as any)?.currentPhase?.id;
    
    if (lastPhase && currentPhaseId && parseInt(lastPhase) < currentPhaseId) {
      setShowCelebration(true);
    }
    
    if (currentPhaseId) {
      localStorage.setItem('lastPhase', currentPhaseId.toString());
    }
  }, [currentPhaseData]);

  useEffect(() => {
    if (showCelebration) {
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 6000); // Birthday hat celebration duration
      return () => clearTimeout(timer);
    }
  }, [showCelebration]);

  return (
    <div className="space-y-6">
      {/* Birthday Hat Celebration */}
      {showCelebration && (
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
            <div className="celebration-text">Phase Unlocked!</div>
          </div>
        </div>
      )}

      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                {(notifications || []).map((notification: any, index: number) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Bell className="h-4 w-4 text-orange-600" />
                    <span className={`text-sm ${
                      notification.type === 'celebration' ? 'text-green-700' :
                      notification.type === 'warning' ? 'text-orange-700' :
                      'text-blue-700'
                    }`}>
                      {notification.message}
                    </span>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearNotificationsMutation.mutate()}
                className="text-orange-700 border-orange-300"
              >
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Streak Dashboard */}
      <Card className="card-tranquil addictive-glow">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5 text-emerald-600" />
            <span>Learning Streak</span>
            {streakStats?.currentStreak && streakStats.currentStreak > 0 && (
              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                {streakStats.currentStreak} days
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600">
                {streakStats?.currentStreak || 0}
              </div>
              <div className="text-xs text-slate-600">Current Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {streakStats?.longestStreak || 0}
              </div>
              <div className="text-xs text-slate-600">Longest Streak</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {streakStats?.totalActiveDays || 0}
              </div>
              <div className="text-xs text-slate-600">Total Days</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {streakStats?.daysUntilNextReward || '∞'}
              </div>
              <div className="text-xs text-slate-600">Until Reward</div>
            </div>
          </div>
          
          {streakStats?.nextReward && (
            <div className="mt-4 p-3 bg-slate-50 rounded-lg">
              <div className="text-sm font-medium text-slate-800">Next Reward</div>
              <div className="text-xs text-slate-600">{streakStats.nextReward.title}</div>
              <div className="text-xs text-emerald-600">+{streakStats.nextReward.xpBonus} XP</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="card-tranquil border-l-4 border-l-teal-500">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-teal-600" />
              <span>Active Learning Phase</span>
            </div>
            <Badge className="bg-teal-500 text-white">
              Phase {currentPhase?.id}: {currentPhase?.name}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-teal-50 p-3 rounded-lg mb-4">
            <p className="text-sm text-teal-800 font-medium mb-1">You are currently in: {currentPhase?.name || 'Foundation'}</p>
            <p className="text-xs text-teal-700">{currentPhase?.description}</p>
          </div>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Phase Progress</span>
                <span className="font-medium text-teal-600">{Math.round(getPhaseProgress(currentPhase))}% Complete</span>
              </div>
              <Progress value={getPhaseProgress(currentPhase)} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-slate-600 block mb-1">Daily Word Limit:</span>
                <span className="text-lg font-bold text-slate-800">{currentPhase?.maxDailyWords} words</span>
              </div>
              <div className="bg-slate-50 p-3 rounded-lg">
                <span className="text-slate-600 block mb-1">Focus Areas:</span>
                <div className="flex flex-wrap gap-1">
                  {(currentPhase?.focusAreas || []).slice(0, 3).map((area: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              className="btn-peaceful w-full mt-4"
              onClick={() => handleStartLesson(currentPhase?.id)}
              disabled={!dailyLesson || dailyLesson.length === 0}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Start Today's Lesson ({dailyLesson?.length || 0} words)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Learning Phases */}
      <Card className="card-tranquil">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="h-5 w-5 text-blue-600" />
            <span>Learning Phases</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {phases.map((phase) => {
              const progress = getPhaseProgress(phase);
              const isUnlocked = progress >= 100 || phase.id <= (currentPhase?.id || 1);
              const isCurrent = phase.id === currentPhase?.id;
              
              return (
                <div 
                  key={phase.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    isCurrent ? 'bg-teal-50 border-teal-200' :
                    isUnlocked ? 'bg-white border-slate-200 hover:border-teal-200' :
                    'bg-slate-50 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-slate-800">{phase.name}</h4>
                      <p className="text-xs text-slate-600">{phase.description}</p>
                    </div>
                    <div className="text-right">
                      {isCurrent && (
                        <Badge className="bg-teal-600">Current</Badge>
                      )}
                      {!isCurrent && isUnlocked && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedPhase(phase.id)}
                          className="text-teal-700 border-teal-300"
                        >
                          Select
                        </Button>
                      )}
                      {!isUnlocked && (
                        <Badge variant="secondary">Locked</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>Max {phase.maxDailyWords} words/day</span>
                    <span>Unlock: {phase.minWordsToUnlock} words</span>
                  </div>

                  {isUnlocked && (
                    <div className="mt-2">
                      <Progress value={progress} className="h-1" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Learning Analytics */}
      {analyticsData && (
        <Card className="card-tranquil">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <span>Learning Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-semibold text-green-600">
                  {(analyticsData as any)?.totalWordsLearned || 0}
                </div>
                <div className="text-xs text-slate-600">Words Mastered</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">
                  {(analyticsData as any)?.strugglingWordsCount || 0}
                </div>
                <div className="text-xs text-slate-600">Need Review</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {(analyticsData as any)?.reviewQueueSize || 0}
                </div>
                <div className="text-xs text-slate-600">In Queue</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {(analyticsData as any)?.learningPattern?.averageSessionLength || 0}m
                </div>
                <div className="text-xs text-slate-600">Avg Session</div>
              </div>
            </div>

            {(analyticsData as any)?.learningPattern?.bestTimeOfDay && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-800">
                  Optimal Learning Time: {(analyticsData as any).learningPattern.bestTimeOfDay}
                </div>
                <div className="text-xs text-purple-600">
                  Based on your learning patterns
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}