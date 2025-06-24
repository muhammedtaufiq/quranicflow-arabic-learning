import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Target, Clock, Award, Bell, Brain, TrendingUp } from "lucide-react";
import { useState } from "react";

const MOCK_USER_ID = 1;

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
    queryKey: [`/api/user/${MOCK_USER_ID}/learning-analytics`],
  });

  // Fetch daily lesson
  const { data: dailyLessonData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/daily-lesson`, selectedPhase],
    queryFn: () => fetch(`/api/user/${MOCK_USER_ID}/daily-lesson?phase=${selectedPhase}`).then(res => res.json()),
  });

  // Clear notifications mutation
  const clearNotificationsMutation = useMutation({
    mutationFn: () => fetch(`/api/user/${MOCK_USER_ID}/clear-notifications`, { method: 'POST' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${MOCK_USER_ID}/notifications`] });
    },
  });

  const phases: LearningPhase[] = phasesData?.phases || [];
  const currentPhase: LearningPhase = currentPhaseData?.currentPhase || phases[0];
  const notifications: Notification[] = notificationsData?.notifications || [];
  const dailyLesson = dailyLessonData?.lesson || [];

  const getPhaseProgress = (phase: LearningPhase): number => {
    if (!phase || !phase.minWordsToUnlock) return 0;
    const totalWords = analyticsData?.totalWordsLearned || 0;
    return Math.min(100, (totalWords / phase.minWordsToUnlock) * 100);
  };

  const handleStartLesson = (phaseId: number) => {
    // Navigate to learning session with specific phase
    window.location.href = `/learn?phase=${phaseId}&mode=daily`;
  };

  return (
    <div className="space-y-6">
      {/* Notifications Banner */}
      {notifications.length > 0 && (
        <Card className="border-orange-200 bg-orange-50 dark:bg-orange-950/20">
          <CardContent className="pt-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                {notifications.map((notification: any, index: number) => (
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

      {/* Current Phase Overview */}
      <Card className="card-tranquil">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-teal-600" />
              <span>Current Phase: {currentPhase?.name}</span>
            </div>
            <Badge variant="outline" className="text-teal-700 border-teal-300">
              Phase {currentPhase?.id}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 mb-4">{currentPhase?.description}</p>
          
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{Math.round(getPhaseProgress(currentPhase))}%</span>
              </div>
              <Progress value={getPhaseProgress(currentPhase)} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-600">Daily Word Limit:</span>
                <span className="ml-2 font-medium">{currentPhase?.maxDailyWords}</span>
              </div>
              <div>
                <span className="text-slate-600">Focus Areas:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {currentPhase?.focusAreas?.slice(0, 3).map((area, index) => (
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
                  {analyticsData.totalWordsLearned || 0}
                </div>
                <div className="text-xs text-slate-600">Words Mastered</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-orange-600">
                  {analyticsData.strugglingWordsCount || 0}
                </div>
                <div className="text-xs text-slate-600">Need Review</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-blue-600">
                  {analyticsData.reviewQueueSize || 0}
                </div>
                <div className="text-xs text-slate-600">In Queue</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-purple-600">
                  {analyticsData.learningPattern?.averageSessionLength || 0}m
                </div>
                <div className="text-xs text-slate-600">Avg Session</div>
              </div>
            </div>

            {analyticsData.learningPattern?.bestTimeOfDay && (
              <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-800">
                  Optimal Learning Time: {analyticsData.learningPattern.bestTimeOfDay}
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