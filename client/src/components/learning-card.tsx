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
  green: "bg-emerald-600 text-white font-medium shadow-md",
  blue: "bg-teal-600 text-white font-medium shadow-md", 
  yellow: "bg-amber-600 text-white font-medium shadow-md",
  purple: "bg-slate-600 text-white font-medium shadow-md"
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
      <Card className="card-tranquil gentle-reveal">
        <CardContent className="p-3 md:p-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl flex items-center justify-center soft-glow" style={{background: 'linear-gradient(135deg, hsl(195, 65%, 45%) 0%, hsl(195, 70%, 35%) 100%)'}}>
              <div className="text-white text-lg md:text-2xl">
                {icon}
              </div>
            </div>
            <Badge className={`${badgeStyles[badgeColor]} px-2 md:px-3 py-1 rounded-lg text-xs md:text-sm`}>
              {badge}
            </Badge>
          </div>
          
          <h3 className="font-medium text-slate-700 text-sm md:text-lg mb-2 md:mb-3">{title}</h3>
          <p className="text-xs md:text-sm text-slate-600 mb-3 md:mb-4 leading-relaxed line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs md:text-sm font-medium text-muted-foreground">{duration}</span>
            <div className="xp-display text-xs md:text-sm">
              <Star className="w-3 h-3 md:w-4 md:h-4 inline mr-1" />
              +{xpReward} XP
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
