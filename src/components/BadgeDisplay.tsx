
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badges: string[];
  maxVisible?: number;
  className?: string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  maxVisible = 3, 
  className 
}) => {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {visibleBadges.map((badge, index) => (
        <span
          key={index}
          className="w-5 h-5 text-xs flex items-center justify-center bg-background/90 backdrop-blur-sm rounded-full border border-border hover:scale-110 transition-transform cursor-help shadow-sm"
          title={`Badge ${index + 1}`}
        >
          {badge}
        </span>
      ))}
      
      {remainingCount > 0 && (
        <span className="w-5 h-5 text-xs flex items-center justify-center bg-background/90 backdrop-blur-sm text-muted-foreground rounded-full border border-border shadow-sm">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default BadgeDisplay;
