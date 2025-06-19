import { Home, BookOpen, Trophy, Users, User } from "lucide-react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  currentPage: "home" | "learn" | "achievements" | "social" | "profile";
}

export function BottomNavigation({ currentPage }: BottomNavigationProps) {
  const [location] = useLocation();

  const navItems = [
    {
      id: "home",
      label: "Home",
      icon: Home,
      href: "/",
      isActive: currentPage === "home" || location === "/"
    },
    {
      id: "learn",
      label: "Learn",
      icon: BookOpen,
      href: "/learn",
      isActive: currentPage === "learn" || location.startsWith("/learn")
    },
    {
      id: "achievements",
      label: "Achieve",
      icon: Trophy,
      href: "/achievements",
      isActive: currentPage === "achievements" || location.startsWith("/achievements")
    },
    {
      id: "social",
      label: "Social",
      icon: Users,
      href: "/leaderboard",
      isActive: currentPage === "social" || location.startsWith("/leaderboard")
    },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      href: "/profile",
      isActive: currentPage === "profile" || location.startsWith("/profile")
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.id} href={item.href}>
              <button
                className={cn(
                  "flex flex-col items-center justify-center space-y-1 w-full h-full transition-colors",
                  item.isActive
                    ? "text-primary"
                    : "text-gray-600 hover:text-gray-800"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
