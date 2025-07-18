
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeDisplayProps {
  badges: string[];
  maxVisible?: number;
  className?: string;
}

const BadgeDisplay: React.FC<BadgeDisplayProps> = ({ 
  badges, 
  maxVisible = 4, 
  className 
}) => {
  const visibleBadges = badges.slice(0, maxVisible);
  const remainingCount = badges.length - maxVisible;

  return (
    <div className={cn("flex items-center gap-1 flex-wrap", className)}>
      {visibleBadges.map((badge, index) => (
        <span
          key={index}
          className="w-6 h-6 text-sm flex items-center justify-center bg-muted rounded-full hover:scale-110 transition-transform cursor-help"
          title={`Badge ${index + 1}`}
        >
          {badge}
        </span>
      ))}
      
      {remainingCount > 0 && (
        <span className="w-6 h-6 text-xs flex items-center justify-center bg-muted text-muted-foreground rounded-full">
          +{remainingCount}
        </span>
      )}
    </div>
  );
};

export default BadgeDisplay;
