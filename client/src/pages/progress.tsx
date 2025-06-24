import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ChapterCompletionList } from "@/components/chapter-completion-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Trophy, BookOpen, Clock, Award, TrendingUp } from "lucide-react";

// Mock user data - in a real app this would come from authentication
const MOCK_USER_ID = 1;

export default function Progress() {
  const { data: userData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}`],
  });

  const { data: completionsData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/completions`],
  });

  const { data: chapterProgressData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/chapter-progress`],
  });

  const user = (userData as any)?.user;
  const completions = (completionsData as any)?.completions || [];
  const chapterProgress = (chapterProgressData as any)?.progressList || [];
  
  const completedChapters = chapterProgress.filter((p: any) => p.isCompleted).length;
  const totalStudyTime = completions.reduce((sum: number, c: any) => sum + (c.studyTimeMinutes || 0), 0);
  const totalStudyHours = Math.round(totalStudyTime / 60 * 10) / 10;
  const totalWordsLearned = completions.reduce((sum: number, c: any) => sum + c.wordsLearned, 0);
  
  const averageMastery = chapterProgress.length > 0 
    ? Math.round(chapterProgress.reduce((sum: number, p: any) => sum + p.masteryPercentage, 0) / chapterProgress.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <NavigationHeader />
      
      <main className="px-4 pt-20 pb-20 space-y-6">
        {/* Page Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-900 mb-2">Learning Progress</h1>
          <p className="text-emerald-700">Track your Quranic Arabic mastery journey</p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardContent className="p-4 text-center">
              <Trophy className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-emerald-900">{completedChapters}</div>
              <div className="text-sm text-emerald-700">Chapters Completed</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-teal-200">
            <CardContent className="p-4 text-center">
              <BookOpen className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-teal-900">{totalWordsLearned}</div>
              <div className="text-sm text-teal-700">Words Mastered</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-cyan-200">
            <CardContent className="p-4 text-center">
              <Clock className="h-8 w-8 text-cyan-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-cyan-900">{totalStudyHours}h</div>
              <div className="text-sm text-cyan-700">Study Time</div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-slate-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-slate-900">{averageMastery}%</div>
              <div className="text-sm text-slate-700">Avg Mastery</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievement Summary */}
        {completions.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-emerald-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-emerald-900">
                <Award className="h-5 w-5" />
                Achievement Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-lg font-semibold text-emerald-900">
                    {completions.filter((c: any) => c.certificateIssued).length}
                  </div>
                  <div className="text-sm text-emerald-700">Certificates Earned</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-teal-900">
                    {completions.length > 0 ? 
                      Math.round(completions.reduce((sum: number, c: any) => sum + c.masteryPercentage, 0) / completions.length) : 0}%
                  </div>
                  <div className="text-sm text-teal-700">Avg Completion Score</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-cyan-900">
                    {completions.length > 0 ? 
                      Math.round(completions.reduce((sum: number, c: any) => sum + c.studyTimeMinutes, 0) / completions.length / 60 * 10) / 10 : 0}h
                  </div>
                  <div className="text-sm text-cyan-700">Avg Study per Chapter</div>
                </div>
                
                <div className="text-center">
                  <div className="text-lg font-semibold text-slate-900">
                    {user?.level || 1}
                  </div>
                  <div className="text-sm text-slate-700">Current Level</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Chapter Progress List */}
        <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-slate-900">
              <BookOpen className="h-5 w-5" />
              Chapter Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChapterCompletionList userId={MOCK_USER_ID} />
          </CardContent>
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
}