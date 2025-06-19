import { Clock } from "lucide-react";

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  timeAgo?: string;
  isRecent?: boolean;
  className?: string;
}

export function AchievementBadge({
  icon,
  name,
  description,
  timeAgo,
  isRecent = false,
  className = ""
}: AchievementBadgeProps) {
  const bgColor = isRecent ? "bg-accent/5" : "bg-primary/5";
  const iconBg = isRecent ? "bg-accent" : "bg-primary";

  return (
    <div className={`flex items-center space-x-3 p-3 ${bgColor} rounded-lg ${className}`}>
      <div className={`w-10 h-10 ${iconBg} rounded-full flex items-center justify-center text-white text-sm`}>
        <span className="text-lg">{icon.includes('fa-') ? '🏆' : icon}</span>
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{name}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
      {timeAgo && (
        <div className="flex items-center space-x-1 text-gray-500">
          <Clock className="w-3 h-3" />
          <span className="text-xs">{timeAgo}</span>
        </div>
      )}
    </div>
  );
}
