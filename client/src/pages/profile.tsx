import { NavigationHeader } from "@/components/navigation-header";
import { BottomNavigation } from "@/components/bottom-navigation";
import { ProgressCircle } from "@/components/progress-circle";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { 
  User, 
  Calendar, 
  Clock, 
  Brain, 
  Trophy, 
  Flame, 
  Star,
  Settings,
  BookOpen,
  Target,
  Users
} from "lucide-react";

const MOCK_USER_ID = 1;

export default function Profile() {
  const { data: userData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}`],
  });

  const { data: achievementsData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}/achievements`],
  });

  const { data: leaderboardData } = useQuery({
    queryKey: ["/api/leaderboard?limit=100"],
  });

  const user = userData?.user;
  const stats = userData?.stats;
  const achievements = achievementsData?.achievements || [];
  const leaderboard = leaderboardData?.leaderboard || [];
  
  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const userRank = leaderboard.findIndex(u => u.id === MOCK_USER_ID) + 1;
  
  const comprehensionPercentage = user?.comprehensionPercentage || 73;
  const levelProgress = ((user?.xp || 0) % 1000) / 1000 * 100;

  const profileStats = [
    {
      icon: <Brain className="w-5 h-5 text-primary" />,
      label: "Words Learned",
      value: stats?.learnedWordsCount || 0,
      color: "text-primary"
    },
    {
      icon: <Star className="w-5 h-5 text-accent" />,
      label: "Total XP",
      value: user?.xp || 0,
      color: "text-accent"
    },
    {
      icon: <Flame className="w-5 h-5 text-orange-500" />,
      label: "Current Streak",
      value: `${user?.streakDays || 0} days`,
      color: "text-orange-500"
    },
    {
      icon: <Trophy className="w-5 h-5 text-purple-600" />,
      label: "Achievements",
      value: unlockedAchievements.length,
      color: "text-purple-600"
    },
    {
      icon: <Target className="w-5 h-5 text-green-600" />,
      label: "Level",
      value: user?.level || 1,
      color: "text-green-600"
    },
    {
      icon: <BookOpen className="w-5 h-5 text-blue-600" />,
      label: "Comprehension",
      value: `${comprehensionPercentage}%`,
      color: "text-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 safe-area-pb md:pb-0">
      <NavigationHeader />
      
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-6 md:space-y-0 md:space-x-8">
              
              {/* Avatar */}
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                  {user?.displayName?.charAt(0) || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.level || 1}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {user?.displayName || 'Student'}
                </h1>
                <p className="text-gray-600 mb-4">@{user?.username || 'student'}</p>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  <Badge variant="secondary">Level {user?.level || 1}</Badge>
                  <Badge variant="outline">{comprehensionPercentage}% Comprehension</Badge>
                  {userRank > 0 && (
                    <Badge variant="outline">#{userRank} on Leaderboard</Badge>
                  )}
                </div>

                {/* Level Progress */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Level Progress</span>
                    <span className="text-sm font-medium text-gray-900">
                      {(user?.xp || 0) % 1000}/1000 XP
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${levelProgress}%` }}
                    ></div>
                  </div>
                </div>

                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              {/* Comprehension Circle */}
              <div className="flex flex-col items-center">
                <ProgressCircle percentage={comprehensionPercentage} size={80} />
                <p className="text-xs text-gray-600 mt-2 text-center">
                  Quranic<br/>Comprehension
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {profileStats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center mx-auto mb-2">
                  {stat.icon}
                </div>
                <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Journey</h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Joined QuranicFlow
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Last Active
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.lastActiveDate ? new Date(user.lastActiveDate).toLocaleDateString() : 'Today'}
                  </p>
                </div>
              </div>

              {unlockedAchievements.length > 0 && (
                <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Latest Achievement
                    </p>
                    <p className="text-xs text-gray-600">
                      {unlockedAchievements[unlockedAchievements.length - 1]?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Family Learning Section */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>Family Learning</span>
              </h2>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => window.location.href = '/family'}
              >
                Manage Family
              </Button>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    Learn Arabic Together
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Create or join a family group to track progress together, set group challenges, and motivate each other in your Quranic Arabic journey.
                  </p>
                </div>
                <Button 
                  size="sm"
                  onClick={() => window.location.href = '/family'}
                >
                  Get Started
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Learning Preferences */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Preferences</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Daily Goal</p>
                  <p className="text-xs text-gray-600">Learn 10 new words per day</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Difficulty Level</p>
                  <p className="text-xs text-gray-600">Adaptive based on performance</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Notifications</p>
                  <p className="text-xs text-gray-600">Daily reminders enabled</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      <BottomNavigation currentPage="profile" />
    </div>
  );
}
