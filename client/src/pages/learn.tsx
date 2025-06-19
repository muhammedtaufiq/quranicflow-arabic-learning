import { useState, useEffect } from "react";
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
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);

  // Parse query parameters directly from location
  const urlParams = new URLSearchParams(location.split('?')[1] || '');
  const typeFromUrl = urlParams.get('type');
  const chapterFromUrl = urlParams.get('chapter');

  const { data: wordsData } = useQuery({
    queryKey: ["/api/words?limit=10&difficulty=1"],
    enabled: selectedType === 'words' || typeFromUrl === 'words'
  });

  const { data: reviewData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/review`],
    enabled: selectedType === 'review' || typeFromUrl === 'review'
  });

  const { data: dailyChallengeData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/daily-challenge`],
    enabled: selectedType === 'daily' || typeFromUrl === 'daily'
  });

  // Get chapter from URL if chapter-specific learning
  const { data: chapterWordsData, isLoading: chapterWordsLoading } = useQuery({
    queryKey: [`/api/words/chapter/${chapterFromUrl || selectedChapterId}`],
    enabled: (selectedType === 'chapters' || typeFromUrl === 'chapters') && !!(chapterFromUrl || selectedChapterId)
  });



  const { data: grammarData } = useQuery({
    queryKey: ["/api/grammar-patterns"],
    enabled: selectedType === 'grammar' || typeFromUrl === 'grammar'
  });

  const learningTypes = [
    {
      id: 'daily',
      title: 'Daily Word Challenge',
      description: 'Automated daily learning path - no chapter selection needed',
      icon: <Trophy className="w-6 h-6 text-orange-600" />,
      badge: 'Daily Challenge',
      badgeColor: 'bg-orange-100 text-orange-800',
      xpReward: 60,
      duration: '~12 minutes',
      recommended: true
    },
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
      id: 'chapters',
      title: 'Chapter-Specific Learning',
      description: 'Choose specific Quranic chapters to study (Al-Fatiha, short chapters, etc.)',
      icon: <BookOpen className="w-6 h-6 text-accent" />,
      badge: 'Chapters',
      badgeColor: 'bg-blue-100 text-blue-800',
      xpReward: 75,
      duration: '~15 minutes'
    },
    {
      id: 'grammar',
      title: 'Sentence Structure',
      description: 'Learn Arabic word order and grammar patterns from Quranic examples',
      icon: <Trophy className="w-6 h-6 text-secondary" />,
      badge: 'Grammar',
      badgeColor: 'bg-orange-100 text-orange-800',
      xpReward: 75,
      duration: '~15 minutes'
    },
    {
      id: 'review',
      title: 'Spaced Review',
      description: 'Review words you learned before at scientifically optimal intervals to move them into long-term memory',
      icon: <RotateCcw className="w-6 h-6 text-purple-600" />,
      badge: 'Memory Science',
      badgeColor: 'bg-purple-100 text-purple-800',
      xpReward: 40,
      duration: '~8 minutes'
    }
  ];

  const handleStartLearning = (type: string) => {
    if (type === 'chapters') {
      // Show chapter selection interface instead of immediately starting
      setSelectedType(type);
      setIsLearning(false);
    } else {
      setSelectedType(type);
      setIsLearning(true);
    }
  };

  const handleBackToSelection = () => {
    setIsLearning(false);
    setSelectedType(null);
    navigate('/learn');
  };

  // Chapter selection data
  const availableChapters = [
    { id: 1, name: "Al-Fatiha", arabicName: "الفاتحة", verses: 7, difficulty: 1, description: "The Opening - Foundation of prayer" },
    { id: 2, name: "Al-Baqarah", arabicName: "البقرة", verses: 286, difficulty: 5, description: "The Cow - Includes Ayat al-Kursi" },
    { id: 112, name: "Al-Ikhlas", arabicName: "الإخلاص", verses: 4, difficulty: 1, description: "The Sincerity - Pure monotheism" },
    { id: 113, name: "Al-Falaq", arabicName: "الفلق", verses: 5, difficulty: 1, description: "The Daybreak - Protection prayer" },
    { id: 114, name: "An-Nas", arabicName: "الناس", verses: 6, difficulty: 1, description: "Mankind - Protection prayer" },
    { id: 36, name: "Yasin", arabicName: "يس", verses: 83, difficulty: 4, description: "Heart of the Quran" },
    { id: 67, name: "Al-Mulk", arabicName: "الملك", verses: 30, difficulty: 3, description: "The Sovereignty" },
    { id: 55, name: "Ar-Rahman", arabicName: "الرحمن", verses: 78, difficulty: 3, description: "The Beneficent" }
  ];

  const handleChapterSelect = (chapterId: number) => {
    // Set state directly to trigger the data query
    setSelectedType('chapters');
    setSelectedChapterId(chapterId);
    setIsLearning(true);
    // Update URL for proper routing
    navigate(`/learn?type=chapters&chapter=${chapterId}`);
  };

  // Handle URL parameter changes with useEffect
  useEffect(() => {
    if (typeFromUrl && typeFromUrl !== selectedType) {
      setSelectedType(typeFromUrl);
      if (typeFromUrl !== 'chapters') {
        setIsLearning(true);
      } else if (typeFromUrl === 'chapters' && chapterFromUrl) {
        // If chapter is also specified in URL, start learning immediately
        setIsLearning(true);
      }
    }
  }, [typeFromUrl, chapterFromUrl, selectedType]);

  // Show chapter selection interface
  if (selectedType === 'chapters' && !isLearning) {
    return (
      <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0">
        <NavigationHeader />
        
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button
              onClick={() => setSelectedType(null)}
              variant="ghost"
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Learning Options
            </Button>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose a Quranic Chapter</h1>
            <p className="text-gray-600">Select a specific chapter to focus your learning on its vocabulary and verses</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableChapters.map((chapter) => (
              <Card key={chapter.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-primary">
                      {chapter.id}
                    </div>
                    <Badge className={`
                      ${chapter.difficulty <= 2 ? 'bg-green-100 text-green-800' : ''}
                      ${chapter.difficulty === 3 ? 'bg-yellow-100 text-yellow-800' : ''}
                      ${chapter.difficulty >= 4 ? 'bg-red-100 text-red-800' : ''}
                    `}>
                      Level {chapter.difficulty}
                    </Badge>
                  </div>
                  
                  <h3 className="font-semibold text-gray-900 mb-1">{chapter.name}</h3>
                  <h4 className="text-lg text-gray-700 mb-2" dir="rtl">{chapter.arabicName}</h4>
                  <p className="text-sm text-gray-600 mb-3">{chapter.description}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-gray-500">{chapter.verses} verses</span>
                    <div className="flex items-center space-x-1 text-accent">
                      <BookOpen className="w-3 h-3" />
                      <span className="text-xs">Chapter Study</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleChapterSelect(chapter.id)}
                    className="w-full bg-primary hover:bg-primary/90"
                  >
                    Study This Chapter
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

  if (isLearning && selectedType) {
    let words;
    let isDataLoading = false;
    
    if (selectedType === 'review') {
      words = (reviewData as any)?.words;
      isDataLoading = !reviewData && (selectedType === 'review' || typeFromUrl === 'review');
    } else if (selectedType === 'daily') {
      words = (dailyChallengeData as any)?.words;
      isDataLoading = !dailyChallengeData && (selectedType === 'daily' || typeFromUrl === 'daily');
    } else if (selectedType === 'chapters') {
      // For chapters, use words from specific chapter
      words = (chapterWordsData as any)?.words;
      isDataLoading = !chapterWordsData && selectedType === 'chapters' && !!chapterFromUrl;
      

    } else if (selectedType === 'grammar') {
      // For grammar, use grammar pattern words
      words = (grammarData as any)?.words;
      isDataLoading = !grammarData && (selectedType === 'grammar' || typeFromUrl === 'grammar');
    } else {
      words = (wordsData as any)?.words;
      isDataLoading = !wordsData && (selectedType === 'words' || typeFromUrl === 'words');
    }
    
    // Show loading state while data is being fetched
    if (isDataLoading) {
      return (
        <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-600">Loading learning session...</p>
          </div>
        </div>
      );
    }
    
    // If no words available, show empty state
    if (!words || words.length === 0) {
      return (
        <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No Words Available</h2>
            <p className="text-gray-600 mb-4">
              {selectedType === 'review' 
                ? "You don't have any words to review right now. Try learning some new words first!"
                : "No words available for this learning session."
              }
            </p>
            <Button onClick={handleBackToSelection} className="bg-primary hover:bg-primary/90">
              Back to Learning Options
            </Button>
          </div>
        </div>
      );
    }
    
    return (
      <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0">
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
    <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0">
      <NavigationHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Learning Path</h1>
          <p className="text-gray-600">Select a learning activity to continue your Quranic Arabic journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">

          {learningTypes.map((type) => (
            <Card key={type.id} className={`hover:shadow-lg transition-shadow cursor-pointer ${
              type.recommended ? 'border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-yellow-50' : ''
            }`}>
              <CardContent className="p-6">
                {type.recommended && (
                  <div className="mb-3">
                    <Badge className="bg-orange-500 text-white">
                      ⭐ Recommended
                    </Badge>
                  </div>
                )}
                
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    type.recommended ? 'bg-orange-100' : 'bg-gray-50'
                  }`}>
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
                  className={`w-full ${
                    type.recommended 
                      ? 'bg-orange-600 hover:bg-orange-700 text-white' 
                      : 'bg-primary hover:bg-primary/90'
                  }`}
                >
                  {type.recommended ? 'Start Daily Challenge' : 'Start Learning'}
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
