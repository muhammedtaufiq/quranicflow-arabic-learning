import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, BookOpen, Target, Brain, Star, Crown, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Phase {
  id: number;
  name: string;
  description: string;
  minWordsToUnlock: number;
  maxDailyWords: number;
  vocabularyIds: number[];
  focusAreas: string[];
}

const LEARNING_PHASES: Phase[] = [
  {
    id: 1,
    name: "Foundation (Al-Asas)",
    description: "Master the fundamental words from Al-Fatiha and essential daily prayers",
    minWordsToUnlock: 0,
    maxDailyWords: 10,
    vocabularyIds: [1, 2, 3, 4, 5],
    focusAreas: ["Basic prayer vocabulary", "Divine names", "Essential verbs"]
  },
  {
    id: 2,
    name: "Building (Al-Bina)",
    description: "Expand with high-frequency Quranic terms and common expressions",
    minWordsToUnlock: 50,
    maxDailyWords: 15,
    vocabularyIds: [6, 7, 8, 9, 10],
    focusAreas: ["Prophetic names", "Moral qualities", "Natural phenomena"]
  },
  {
    id: 3,
    name: "Strengthening (At-Taqwiya)",
    description: "Deepen understanding with narrative and descriptive vocabulary",
    minWordsToUnlock: 120,
    maxDailyWords: 20,
    vocabularyIds: [11, 12, 13, 14, 15],
    focusAreas: ["Story vocabulary", "Descriptive terms", "Complex grammar"]
  },
  {
    id: 4,
    name: "Expansion (At-Tawsi)",
    description: "Broaden knowledge with scholarly and theological terms",
    minWordsToUnlock: 200,
    maxDailyWords: 25,
    vocabularyIds: [16, 17, 18, 19, 20],
    focusAreas: ["Theological concepts", "Legal terms", "Abstract meanings"]
  },
  {
    id: 5,
    name: "Refinement (At-Tahdhib)",
    description: "Perfect understanding with advanced linguistic nuances",
    minWordsToUnlock: 300,
    maxDailyWords: 30,
    vocabularyIds: [21, 22, 23, 24, 25],
    focusAreas: ["Literary devices", "Subtle meanings", "Classical expressions"]
  },
  {
    id: 6,
    name: "Mastery (Al-Itqan)",
    description: "Achieve comprehensive Quranic vocabulary mastery",
    minWordsToUnlock: 450,
    maxDailyWords: 35,
    vocabularyIds: [26, 27, 28, 29, 30],
    focusAreas: ["Complete comprehension", "Contextual mastery", "Scholarly level"]
  }
];

interface AdminSettingsProps {
  onPhaseSelect: (phaseId: number) => void;
}

export function AdminSettings({ onPhaseSelect }: AdminSettingsProps) {
  const queryClient = useQueryClient();
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);

  // Get current phase from API
  const { data: currentPhaseData } = useQuery({
    queryKey: ["/api/content-stats"],
  });

  const currentPhase = currentPhaseData?.phase?.current || 1;

  // Phase selection mutation
  const phaseSelectMutation = useMutation({
    mutationFn: async (phaseId: number) => {
      return apiRequest(`/api/user/1/select-phase`, {
        method: 'POST',
        body: { phaseId }
      });
    },
    onSuccess: () => {
      // Invalidate all queries that depend on phase data
      queryClient.invalidateQueries({ queryKey: ["/api/content-stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
    }
  });

  const handlePhaseSelect = async (phaseId: number) => {
    setSelectedPhase(phaseId);
    onPhaseSelect(phaseId);
    await phaseSelectMutation.mutateAsync(phaseId);
  };

  const getPhaseIcon = (phaseId: number) => {
    const icons = [BookOpen, Target, Brain, Star, Crown, Sparkles];
    const IconComponent = icons[phaseId - 1] || BookOpen;
    return <IconComponent className="h-5 w-5" />;
  };

  const getPhaseColor = (phaseId: number) => {
    const colors = [
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
      "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200", 
      "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
      "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    ];
    return colors[phaseId - 1] || colors[0];
  };

  const handlePhaseAccess = async (phase: Phase) => {
    await handlePhaseSelect(phase.id);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Settings className="h-4 w-4" />
          Phase Manager
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Learning Phase Manager
          </DialogTitle>
          <DialogDescription>
            Access and manage all learning phases. Currently available for testing purposes.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {LEARNING_PHASES.map((phase) => (
              <Card 
                key={phase.id} 
                className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
                  selectedPhase === phase.id ? 'ring-2 ring-emerald-500' : ''
                }`}
                onClick={() => handlePhaseAccess(phase)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getPhaseIcon(phase.id)}
                      <CardTitle className="text-lg">{phase.name}</CardTitle>
                    </div>
                    <Badge className={getPhaseColor(phase.id)}>
                      Phase {phase.id}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {phase.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Unlock Requirement:</span>
                    <span className="font-medium">
                      {phase.minWordsToUnlock === 0 ? 'Available' : `${phase.minWordsToUnlock} words mastered`}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Daily Word Limit:</span>
                    <span className="font-medium">{phase.maxDailyWords} words</span>
                  </div>

                  <Separator />
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Focus Areas:</p>
                    <div className="flex flex-wrap gap-1">
                      {phase.focusAreas.map((area, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button 
                    className="w-full mt-3" 
                    variant={selectedPhase === phase.id ? "default" : "outline"}
                    size="sm"
                  >
                    {selectedPhase === phase.id ? "Selected" : "Access Phase"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedPhase && (
            <Card className="bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-emerald-800 dark:text-emerald-200 font-medium">
                    Phase {selectedPhase} has been selected for learning
                  </p>
                  <p className="text-sm text-emerald-700 dark:text-emerald-300 mt-1">
                    Return to the dashboard to begin your studies
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}