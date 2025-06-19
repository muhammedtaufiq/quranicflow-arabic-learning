import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface Word {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  difficulty: number;
  frequency: number;
  category: string;
  examples?: string[];
}

export interface Question {
  word: Word;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  type: "multiple_choice" | "translation" | "fill_blank";
}

export interface SessionStats {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  xpGained: number;
  wordsLearned: number;
  sessionDuration: number;
}

export function useLearningSession(userId: number, sessionType: string) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [sessionStats, setSessionStats] = useState<SessionStats>({
    totalQuestions: 0,
    correctAnswers: 0,
    incorrectAnswers: 0,
    xpGained: 0,
    wordsLearned: 0,
    sessionDuration: 0
  });
  const [sessionStartTime] = useState(Date.now());
  const [questions, setQuestions] = useState<Question[]>([]);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch words based on session type
  const { data: wordsData, isLoading: wordsLoading } = useQuery({
    queryKey: sessionType === 'review' 
      ? [`/api/user/${userId}/review`]
      : ["/api/words", { difficulty: 1, limit: 10 }],
    enabled: !!userId
  });

  // Generate questions when words are loaded
  useEffect(() => {
    if (!wordsData?.words || wordsData.words.length === 0) return;

    const words = wordsData.words;
    const generatedQuestions: Question[] = words.slice(0, 10).map((word: Word) => {
      // Create distractors from other words
      const distractors = words
        .filter((w: Word) => w.id !== word.id)
        .map((w: Word) => w.meaning)
        .slice(0, 3);
      
      const options = [word.meaning, ...distractors]
        .sort(() => Math.random() - 0.5);
      
      return {
        word,
        question: "What does this word mean?",
        options,
        correctAnswer: word.meaning,
        explanation: `${word.arabic} (${word.transliteration}) means "${word.meaning}"`,
        type: "multiple_choice" as const
      };
    });

    setQuestions(generatedQuestions);
    setSessionStats(prev => ({ ...prev, totalQuestions: generatedQuestions.length }));
  }, [wordsData]);

  // Record learning progress
  const recordProgressMutation = useMutation({
    mutationFn: async ({ wordId, isCorrect }: { wordId: number; isCorrect: boolean }) => {
      const response = await apiRequest("POST", "/api/learning/session", {
        userId,
        wordId,
        isCorrect
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSessionStats(prev => ({
        ...prev,
        xpGained: prev.xpGained + (data.xpGain || 0),
        wordsLearned: data.isLearned ? prev.wordsLearned + 1 : prev.wordsLearned
      }));
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/review`] });
    }
  });

  const handleAnswerSubmit = (answer: string) => {
    if (isAnswered || !questions[currentQuestionIndex]) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);

    // Update local stats
    setSessionStats(prev => ({
      ...prev,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      incorrectAnswers: isCorrect ? prev.incorrectAnswers : prev.incorrectAnswers + 1
    }));

    // Record progress
    recordProgressMutation.mutate({
      wordId: currentQuestion.word.id,
      isCorrect
    });

    // Show feedback
    toast({
      title: isCorrect ? "Correct! 🎉" : "Not quite right",
      description: currentQuestion.explanation,
      variant: isCorrect ? "default" : "destructive",
    });

    return isCorrect;
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  };

  const skipQuestion = () => {
    setSelectedAnswer(questions[currentQuestionIndex]?.correctAnswer || null);
    setIsAnswered(true);
    setSessionStats(prev => ({
      ...prev,
      incorrectAnswers: prev.incorrectAnswers + 1
    }));
  };

  const completeSession = () => {
    const sessionDuration = Math.round((Date.now() - sessionStartTime) / 1000);
    setSessionStats(prev => ({ ...prev, sessionDuration }));
    
    // Show completion toast
    toast({
      title: "Session Complete! 🎉",
      description: `You gained ${sessionStats.xpGained} XP and learned ${sessionStats.wordsLearned} words!`,
    });

    return {
      ...sessionStats,
      sessionDuration,
      accuracy: sessionStats.totalQuestions > 0 
        ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100)
        : 0
    };
  };

  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setSessionStats({
      totalQuestions: questions.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      xpGained: 0,
      wordsLearned: 0,
      sessionDuration: 0
    });
  };

  return {
    // Session state
    questions,
    currentQuestionIndex,
    currentQuestion: questions[currentQuestionIndex],
    selectedAnswer,
    isAnswered,
    sessionStats,
    
    // Session progress
    progress: questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0,
    isComplete: currentQuestionIndex >= questions.length - 1 && isAnswered,
    isLoading: wordsLoading || recordProgressMutation.isPending,
    
    // Actions
    handleAnswerSubmit,
    nextQuestion,
    skipQuestion,
    completeSession,
    resetSession,
    
    // Computed values
    accuracy: sessionStats.totalQuestions > 0 
      ? Math.round((sessionStats.correctAnswers / sessionStats.totalQuestions) * 100)
      : 0,
    timeElapsed: Math.round((Date.now() - sessionStartTime) / 1000)
  };
}

export function useWordGeneration() {
  const generateWordsMutation = useMutation({
    mutationFn: async (options: {
      difficulty?: number;
      category?: string;
      count?: number;
      excludeWords?: string[];
    }) => {
      const response = await apiRequest("POST", "/api/words/generate", options);
      return response.json();
    }
  });

  return {
    generateWords: generateWordsMutation.mutate,
    isGenerating: generateWordsMutation.isPending,
    generatedWords: generateWordsMutation.data?.words || []
  };
}

export function useSpacedRepetition(userId: number) {
  const { data: reviewData, refetch } = useQuery({
    queryKey: [`/api/user/${userId}/review`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const wordsForReview = reviewData?.words || [];
  const reviewCount = wordsForReview.length;

  return {
    wordsForReview,
    reviewCount,
    hasWordsToReview: reviewCount > 0,
    refetch
  };
}
