
import React from 'react';
import { cn } from '@/lib/utils';

interface BorderPatternProps {
  pattern: 'solid' | 'stripes' | 'dots' | 'gradient';
  color: string;
  className?: string;
}

const BorderPattern: React.FC<BorderPatternProps> = ({ pattern, color, className }) => {
  const getPatternStyles = () => {
    const baseClasses = "h-2 w-full rounded-t-lg";
    
    switch (pattern) {
      case 'solid':
        return {
          className: cn(baseClasses, className),
          style: { backgroundColor: color }
        };
      
      case 'stripes':
        return {
          className: cn(baseClasses, className),
          style: {
            background: `repeating-linear-gradient(
              45deg,
              ${color},
              ${color} 4px,
              transparent 4px,
              transparent 8px
            )`
          }
        };
      
      case 'dots':
        return {
          className: cn(baseClasses, className),
          style: {
            background: `radial-gradient(circle, ${color} 2px, transparent 2px)`,
            backgroundSize: '8px 8px'
          }
        };
      
      case 'gradient':
        return {
          className: cn(baseClasses, className),
          style: {
            background: `linear-gradient(90deg, ${color}, hsl(from ${color} h calc(s * 0.8) calc(l * 1.2)))`
          }
        };
      
      default:
        return {
          className: cn(baseClasses, className),
          style: { backgroundColor: color }
        };
    }
  };

  const { className: patternClassName, style } = getPatternStyles();

  return <div className={patternClassName} style={style} />;
};

export default BorderPattern;
