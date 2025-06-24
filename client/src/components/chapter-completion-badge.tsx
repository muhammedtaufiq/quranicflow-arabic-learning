import { CheckCircle, Award, Clock, BookOpen } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

interface ChapterProgress {
  chapterId: number;
  chapterName: string;
  wordsLearned: number;
  totalWords: number;
  masteryPercentage: number;
  isCompleted: boolean;
  completion?: {
    id: number;
    completedAt: string;
    certificateIssued: boolean;
    studyTimeMinutes: number;
  };
}

interface ChapterCompletionBadgeProps {
  progress: ChapterProgress;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

export function ChapterCompletionBadge({ 
  progress, 
  size = 'md', 
  showDetails = true 
}: ChapterCompletionBadgeProps) {
  const { chapterName, masteryPercentage, isCompleted, completion, wordsLearned, totalWords } = progress;
  
  const sizeClasses = {
    sm: "p-2",
    md: "p-4", 
    lg: "p-6"
  };
  
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  if (isCompleted && completion) {
    const completedDate = new Date(completion.completedAt).toLocaleDateString();
    const studyHours = Math.round(completion.studyTimeMinutes / 60 * 10) / 10;
    
    return (
      <Card className="border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 shadow-md hover:shadow-lg transition-all duration-300">
        <CardContent className={sizeClasses[size]}>
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <CheckCircle className={`${iconSizes[size]} text-emerald-600`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-emerald-900 text-sm truncate">
                  {chapterName}
                </h3>
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 border-emerald-200">
                  <Award className="h-3 w-3 mr-1" />
                  Completed
                </Badge>
              </div>
              
              {showDetails && (
                <div className="space-y-2">
                  <div className="flex items-center gap-4 text-xs text-emerald-700">
                    <div className="flex items-center gap-1">
                      <BookOpen className="h-3 w-3" />
                      <span>{wordsLearned}/{totalWords} words</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{studyHours}h study</span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-emerald-600">
                    Completed on {completedDate}
                  </div>
                  
                  {completion.certificateIssued && (
                    <Badge variant="outline" className="text-xs border-emerald-300 text-emerald-700">
                      🏆 Certificate Earned
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // In progress chapter
  const progressColor = masteryPercentage >= 60 ? 'from-amber-50 to-orange-50' : 'from-slate-50 to-gray-50';
  const borderColor = masteryPercentage >= 60 ? 'border-amber-200' : 'border-slate-200';
  const textColor = masteryPercentage >= 60 ? 'text-amber-900' : 'text-slate-900';
  
  return (
    <Card className={`border-2 ${borderColor} bg-gradient-to-r ${progressColor} shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardContent className={sizeClasses[size]}>
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <BookOpen className={`${iconSizes[size]} ${masteryPercentage >= 60 ? 'text-amber-600' : 'text-slate-600'}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className={`font-semibold ${textColor} text-sm truncate`}>
                {chapterName}
              </h3>
              <Badge variant="outline" className="text-xs">
                {masteryPercentage}%
              </Badge>
            </div>
            
            {showDetails && (
              <div className="space-y-2">
                <Progress 
                  value={masteryPercentage} 
                  className="h-2"
                />
                
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>{wordsLearned}/{totalWords} words learned</span>
                  <span className="font-medium">
                    {masteryPercentage >= 80 ? 'Ready to complete!' : `${80 - masteryPercentage}% to completion`}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChapterCompletionListProps {
  userId: number;
}

export function ChapterCompletionList({ userId }: ChapterCompletionListProps) {
  const { data: progressData, isLoading } = useQuery({
    queryKey: [`/api/user/${userId}/chapter-progress`],
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  const progressList = (progressData as any)?.progressList || [];
  const completed = progressList.filter((p: ChapterProgress) => p.isCompleted);
  const inProgress = progressList.filter((p: ChapterProgress) => !p.isCompleted && p.masteryPercentage > 0);
  
  return (
    <div className="space-y-6">
      {completed.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-emerald-900 mb-3 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Completed Chapters ({completed.length})
          </h3>
          <div className="grid gap-3">
            {completed.map((progress: ChapterProgress) => (
              <ChapterCompletionBadge 
                key={progress.chapterId} 
                progress={progress} 
                size="md"
                showDetails={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {inProgress.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            In Progress ({inProgress.length})
          </h3>
          <div className="grid gap-3">
            {inProgress.map((progress: ChapterProgress) => (
              <ChapterCompletionBadge 
                key={progress.chapterId} 
                progress={progress} 
                size="md"
                showDetails={true}
              />
            ))}
          </div>
        </div>
      )}
      
      {completed.length === 0 && inProgress.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
          <p>Start learning to track your chapter progress!</p>
        </div>
      )}
    </div>
  );
}