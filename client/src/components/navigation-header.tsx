import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BookOpen, Flame, Star, User } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const MOCK_USER_ID = 1;

export function NavigationHeader() {
  const { data: userData } = useQuery({
    queryKey: [`/api/user/${MOCK_USER_ID}`],
  });

  const user = userData?.user;
  const stats = userData?.stats;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="text-secondary text-2xl" />
              <span className="text-xl font-bold text-gray-900">QuranicFlow</span>
            </div>
          </div>
          
          {/* Stats - Hidden on mobile */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-2 bg-gray-100 px-3 py-1 rounded-full">
              <Flame className="text-orange-500 w-4 h-4 streak-fire" />
              <span className="text-sm font-medium">{user?.streakDays || 0}</span>
            </div>
            <div className="flex items-center space-x-2 bg-accent/10 px-3 py-1 rounded-full">
              <Star className="text-accent w-4 h-4" />
              <span className="text-sm font-medium">{user?.xp || 0}</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5 text-gray-600" />
            </Button>
            
            {/* Profile Avatar */}
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
