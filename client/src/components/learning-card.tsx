import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { Link } from "wouter";

interface LearningCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  duration: string;
  xpReward: number;
  badge: string;
  badgeColor: "green" | "blue" | "yellow" | "purple";
  href: string;
}

const badgeStyles = {
  green: "bg-green-100 text-green-800",
  blue: "bg-blue-100 text-blue-800", 
  yellow: "bg-yellow-100 text-yellow-800",
  purple: "bg-purple-100 text-purple-800"
};

export function LearningCard({
  icon,
  title,
  description,
  duration,
  xpReward,
  badge,
  badgeColor,
  href
}: LearningCardProps) {
  return (
    <Link href={href}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center">
              {icon}
            </div>
            <Badge className={badgeStyles[badgeColor]}>
              {badge}
            </Badge>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-600 mb-4">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{duration}</span>
            <div className="flex items-center space-x-1 text-accent">
              <Star className="w-3 h-3" />
              <span className="text-xs">+{xpReward} XP</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
