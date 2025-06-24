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
        <CardContent className="p-2 md:p-6">
          <div className="flex items-center justify-between mb-2 md:mb-4">
            <div className="w-10 h-10 md:w-16 md:h-16 rounded-xl flex items-center justify-center soft-glow" style={{background: 'linear-gradient(135deg, hsl(195, 65%, 45%) 0%, hsl(195, 70%, 35%) 100%)'}}>
              <div className="text-white text-base md:text-2xl">
                {icon}
              </div>
            </div>
            <Badge className={`${badgeStyles[badgeColor]} px-1 md:px-3 py-0.5 md:py-1 rounded text-xs`}>
              {badge}
            </Badge>
          </div>
          
          <h3 className="font-medium text-slate-700 text-xs md:text-lg mb-1 md:mb-3">{title}</h3>
          <p className="text-xs md:text-sm text-slate-600 mb-2 md:mb-4 leading-relaxed line-clamp-1 md:line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">{duration}</span>
            <div className="xp-display text-xs">
              <Star className="w-3 h-3 inline mr-1" />
              +{xpReward}
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
