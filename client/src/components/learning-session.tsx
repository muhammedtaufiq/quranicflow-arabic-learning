import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Heart, Lightbulb, Star, CheckCircle, XCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Word {
  id: number;
  arabic: string;
  transliteration: string;
  meaning: string;
  meaningUrdu?: string | null;
  difficulty: number;
  examples?: string[];
}

interface LearningSessionProps {
  words: Word[];
  type: string;
  onComplete: () => void;
  userId: number;
}

interface Question {
  word: Word;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export function LearningSession({ words, type, onComplete, userId }: LearningSessionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [lives, setLives] = useState(5);
  const [xpGained, setXpGained] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [showUrduTranslations, setShowUrduTranslations] = useState(() => {
    const stored = localStorage.getItem('showUrduTranslations');
    return stored !== null ? stored === 'true' : true; // Default to true for deployment testing
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Generate questions from words
  useEffect(() => {
    if (words.length === 0) return;

    const generatedQuestions: Question[] = words.slice(0, 10).map((word) => {
      // Create wrong answers by shuffling other word meanings
      const wrongAnswers = words
        .filter(w => w.id !== word.id)
        .map(w => w.meaning)
        .slice(0, 3);
      
      const options = [word.meaning, ...wrongAnswers].sort(() => Math.random() - 0.5);
      
      return {
        word,
        question: `What does this word mean?`,
        options,
        correctAnswer: word.meaning,
        explanation: `${word.arabic} (${word.transliteration}) means "${word.meaning}"`
      };
    });

    setQuestions(generatedQuestions);
  }, [words]);

  const recordSessionMutation = useMutation({
    mutationFn: async (data: { userId: number; wordId: number; isCorrect: boolean }) => {
      return await apiRequest("POST", "/api/learning/session", data);
    },
    onSuccess: (response) => {
      if (response && typeof response === 'object' && 'xpGain' in response) {
        setXpGained(prev => prev + ((response as any).xpGain || 0));
      }
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}`] });
    }
  });

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    const correct = answer === currentQuestion.correctAnswer;
    setIsCorrect(correct);
    setIsAnswered(true);

    // Record the session
    recordSessionMutation.mutate({
      userId,
      wordId: currentQuestion.word.id,
      isCorrect: correct
    });

    if (!correct) {
      setLives(prev => Math.max(0, prev - 1));
    }

    // Show feedback
    toast({
      title: correct ? "Correct! 🎉" : "Incorrect 😔",
      description: currentQuestion.explanation,
      variant: correct ? "default" : "destructive",
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsCorrect(false);
    } else {
      // Session complete
      toast({
        title: "Session Complete! 🎉",
        description: `You gained ${xpGained} XP!`,
      });
      onComplete();
    }
  };

  const handleSkip = () => {
    setSelectedAnswer(currentQuestion.correctAnswer);
    setIsAnswered(true);
    setIsCorrect(false);
    setLives(prev => Math.max(0, prev - 1));
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <p className="text-gray-600">Loading learning session...</p>
        </CardContent>
      </Card>
    );
  }

  if (lives === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Over</h2>
          <p className="text-gray-600 mb-4">You've run out of lives, but don't give up!</p>
          <p className="text-sm text-gray-500 mb-6">XP Gained: {xpGained}</p>
          <Button onClick={onComplete} className="bg-primary hover:bg-primary/90">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      
      {/* Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            {Array.from({ length: 5 }, (_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 ${
                  i < lives ? "text-red-500 fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
        
        <Progress value={progress} className="w-full" />
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardContent className="p-8">
          
          {/* Question */}
          <div className="text-center mb-8">
            <p className="text-xl font-bold text-primary mb-6">{currentQuestion.question}</p>
            <motion.div
              className="rounded-xl p-8 mb-6 soft-glow"
              style={{background: 'linear-gradient(135deg, hsl(195, 65%, 45%) 0%, hsl(195, 70%, 35%) 100%)'}}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span 
                className="text-5xl text-white block mb-3 peaceful-breath" 
                style={{ 
                  fontFamily: "'Amiri', 'Arabic Typesetting', 'Traditional Arabic', 'Times New Roman', serif",
                  fontFeatureSettings: "'liga' 1, 'dlig' 1",
                  textRendering: "optimizeLegibility",
                  unicodeBidi: "bidi-override"
                }}
                dir="rtl"
              >
                {currentQuestion.word.arabic || "اللَّهُ"}
              </span>
              <span className="text-xl text-white/90 italic block mb-3 font-medium">
                {currentQuestion.word.transliteration || "Loading..."}
              </span>
              <span className="text-lg text-white/85 block mb-2 font-medium">
                {currentQuestion.word.meaning || "Loading translation..."}
              </span>
              {showUrduTranslations && currentQuestion.word.meaningUrdu && (
                <span className="text-base text-white/80 font-medium block" dir="rtl">
                  {currentQuestion.word.meaningUrdu}
                </span>
              )}
            </motion.div>
          </div>

          {/* Answer Options */}
          <div className="space-y-3 mb-6">
            <AnimatePresence>
              {currentQuestion.options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant="outline"
                    className={`w-full p-4 text-left border-0 rounded-xl transition-all duration-300 ${
                      selectedAnswer === option
                        ? isCorrect
                          ? "bg-emerald-600 text-white shadow-md"
                          : "bg-red-400 text-white shadow-md"
                        : isAnswered && option === currentQuestion.correctAnswer
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-white border-2 border-gray-200 hover:border-teal-400 hover:shadow-md hover:translate-y-[-1px]"
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                    disabled={isAnswered}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm sm:text-base leading-relaxed break-words whitespace-normal text-left font-medium">{option}</span>
                      {isAnswered && selectedAnswer === option && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </motion.div>
                      )}
                      {isAnswered && option === currentQuestion.correctAnswer && selectedAnswer !== option && (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            {!isAnswered ? (
              <>
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-primary hover:bg-primary/10 rounded-xl">
                  <Lightbulb className="w-4 h-4 mr-2" />
                  💡 Hint
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSkip} className="text-muted-foreground hover:bg-gray-100 rounded-xl">
                  ⏭️ Skip
                </Button>
              </>
            ) : (
              <Button onClick={handleNext} className="btn-candy text-lg font-bold px-8 py-3">
                {currentQuestionIndex < questions.length - 1 ? "🚀 Next Question" : "🎉 Complete Session"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* XP Display */}
      <AnimatePresence>
        {xpGained > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-20 right-4 bg-accent text-white px-4 py-2 rounded-full font-medium shadow-lg xp-gain"
          >
            <Star className="w-4 h-4 inline mr-1" />
            +{xpGained} XP
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
