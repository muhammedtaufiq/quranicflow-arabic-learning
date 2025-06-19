import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface UserProgress {
  user: {
    id: number;
    displayName: string;
    username: string;
    level: number;
    xp: number;
    streakDays: number;
    comprehensionPercentage: number;
    lastActiveDate: string;
  };
  stats: {
    learnedWordsCount: number;
    streak: number;
    achievementsCount: number;
  };
}

export function useUserProgress(userId: number) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const userQuery = useQuery<UserProgress>({
    queryKey: [`/api/user/${userId}`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const achievementsQuery = useQuery({
    queryKey: [`/api/user/${userId}/achievements`],
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  const challengesQuery = useQuery({
    queryKey: [`/api/user/${userId}/challenges`],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const updateStreakMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/user/${userId}/streak`, {});
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}`] });
      
      if (data.currentStreak > (userQuery.data?.user.streakDays || 0)) {
        toast({
          title: "Streak Extended! 🔥",
          description: `You're on a ${data.currentStreak}-day streak!`,
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Failed to update streak",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  });

  const updateUserXP = useMutation({
    mutationFn: async (xpGain: number) => {
      const currentUser = userQuery.data?.user;
      if (!currentUser) throw new Error("User not found");

      const newXp = currentUser.xp + xpGain;
      const newLevel = Math.floor(newXp / 1000) + 1;
      
      const response = await apiRequest("PATCH", `/api/user/${userId}`, {
        xp: newXp,
        level: newLevel
      });
      return response.json();
    },
    onSuccess: (data, xpGain) => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}`] });
      
      // Check for level up
      const currentLevel = userQuery.data?.user.level || 1;
      if (data.level > currentLevel) {
        toast({
          title: "Level Up! 🎉",
          description: `You reached level ${data.level}!`,
        });
      }
    }
  });

  const markDailyActivity = () => {
    updateStreakMutation.mutate();
  };

  return {
    user: userQuery.data?.user,
    stats: userQuery.data?.stats,
    achievements: achievementsQuery.data?.achievements || [],
    challenges: challengesQuery.data?.challenges || [],
    isLoading: userQuery.isLoading,
    isError: userQuery.isError,
    markDailyActivity,
    updateUserXP: updateUserXP.mutate,
    refetch: () => {
      userQuery.refetch();
      achievementsQuery.refetch();
      challengesQuery.refetch();
    }
  };
}

export function useLeaderboard(limit: number = 10) {
  return useQuery({
    queryKey: [`/api/leaderboard?limit=${limit}`],
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useUserAchievements(userId: number) {
  const queryClient = useQueryClient();
  
  const achievementsQuery = useQuery({
    queryKey: [`/api/user/${userId}/achievements`],
    staleTime: 10 * 60 * 1000,
  });

  const unlockAchievement = useMutation({
    mutationFn: async (achievementId: number) => {
      const response = await apiRequest("POST", "/api/user/achievements", {
        userId,
        achievementId
      });
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}/achievements`] });
      queryClient.invalidateQueries({ queryKey: [`/api/user/${userId}`] });
    }
  });

  return {
    achievements: achievementsQuery.data?.achievements || [],
    unlockedAchievements: achievementsQuery.data?.achievements?.filter((a: any) => a.unlocked) || [],
    lockedAchievements: achievementsQuery.data?.achievements?.filter((a: any) => !a.unlocked) || [],
    isLoading: achievementsQuery.isLoading,
    unlockAchievement: unlockAchievement.mutate
  };
}
