import { useState } from "react";
import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { LearningSession } from "@/components/learning-session";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain, Trophy, BookOpen, RotateCcw } from "lucide-react";
import { useLocation } from "wouter";

const MOCK_USER_ID = 1;

export default function Learn() {
  const [location, navigate] = useLocation();
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [isLearning, setIsLearning] = useState(false);

  // Parse query parameters
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const typeFromUrl = urlParams.get('type');

  const { data: wordsData } = useQuery({
    queryKey: ["/api/words?limit=10&difficulty=1"],
    enabled: selectedType === 'words' || typeFromUrl === 'words'
  });

  const { data: reviewData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/review`],
    enabled: selectedType === 'review' || typeFromUrl === 'review'
  });

  const learningTypes = [
    {
      id: 'words',
      title: 'Word Discovery',
      description: 'Learn new high-frequency Quranic words',
      icon: <Brain className="w-6 h-6 text-primary" />,
      badge: 'New Words',
      badgeColor: 'bg-green-100 text-green-800',
      xpReward: 50,
      duration: '~10 minutes'
    },
    {
      id: 'grammar',
      title: 'Grammar Practice',
      description: 'Master Arabic sentence structure and syntax',
      icon: <Trophy className="w-6 h-6 text-secondary" />,
      badge: 'Grammar',
      badgeColor: 'bg-blue-100 text-blue-800',
      xpReward: 75,
      duration: '~15 minutes'
    },
    {
      id: 'verses',
      title: 'Quranic Verses',
      description: 'Understand verses word by word',
      icon: <BookOpen className="w-6 h-6 text-accent" />,
      badge: 'Verses',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      xpReward: 100,
      duration: '~20 minutes'
    },
    {
      id: 'review',
      title: 'Spaced Review',
      description: 'Review words due for practice',
      icon: <RotateCcw className="w-6 h-6 text-purple-600" />,
      badge: 'Review',
      badgeColor: 'bg-purple-100 text-purple-800',
      xpReward: 40,
      duration: '~8 minutes'
    }
  ];

  const handleStartLearning = (type: string) => {
    setSelectedType(type);
    setIsLearning(true);
  };

  const handleBackToSelection = () => {
    setIsLearning(false);
    setSelectedType(null);
    navigate('/learn');
  };

  // Auto-start if type is specified in URL
  if (typeFromUrl && !selectedType && !isLearning) {
    setSelectedType(typeFromUrl);
    setIsLearning(true);
  }

  if (isLearning && selectedType) {
    const words = selectedType === 'review' ? reviewData?.words : wordsData?.words;
    
    return (
      <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
        <NavigationHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={handleBackToSelection}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Types
            </Button>
          </div>

          <LearningSession
            words={words || []}
            type={selectedType}
            onComplete={handleBackToSelection}
            userId={MOCK_USER_ID}
          />
        </main>

        <BottomNavigation currentPage="learn" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h1>
          <p className="text-gray-600">Select a learning activity to continue your Quranic Arabic journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {learningTypes.map((type) => (
            <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
                    {type.icon}
                  </div>
                  <Badge className={type.badgeColor}>
                    {type.badge}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-2">{type.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{type.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500">{type.duration}</span>
                  <div className="flex items-center space-x-1 text-accent">
                    <span className="text-xs">+{type.xpReward} XP</span>
                  </div>
                </div>

                <Button
                  onClick={() => handleStartLearning(type.id)}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Start Learning
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <BottomNavigation currentPage="learn" />
    </div>
  );
}
