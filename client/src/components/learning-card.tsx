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
  green: "bg-green-500 text-white font-bold shadow-lg",
  blue: "bg-blue-500 text-white font-bold shadow-lg", 
  yellow: "bg-yellow-500 text-white font-bold shadow-lg",
  purple: "bg-purple-500 text-white font-bold shadow-lg"
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
      <Card className="word-card bounce-in">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center pulse-glow" style={{background: 'var(--gradient-primary)'}}>
              <div className="text-white text-2xl">
                {icon}
              </div>
            </div>
            <Badge className={`${badgeStyles[badgeColor]} px-3 py-1 rounded-full`}>
              {badge}
            </Badge>
          </div>
          
          <h3 className="font-bold text-primary text-lg mb-3">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">{duration}</span>
            <div className="xp-display">
              <Star className="w-4 h-4 inline mr-1" />
              +{xpReward} XP
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
