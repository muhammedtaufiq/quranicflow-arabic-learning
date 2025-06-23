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
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="w-16 h-16 rounded-xl flex items-center justify-center soft-glow" style={{background: 'linear-gradient(135deg, hsl(195, 65%, 45%) 0%, hsl(195, 70%, 35%) 100%)'}}>
              <div className="text-white text-2xl">
                {icon}
              </div>
            </div>
            <Badge className={`${badgeStyles[badgeColor]} px-3 py-1 rounded-lg`}>
              {badge}
            </Badge>
          </div>
          
          <h3 className="font-medium text-slate-700 text-lg mb-3">{title}</h3>
          <p className="text-sm text-slate-600 mb-4 leading-relaxed">{description}</p>
          
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
