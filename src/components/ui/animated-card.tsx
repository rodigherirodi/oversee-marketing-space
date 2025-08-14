
import React from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { cardHover, getMotionProps } from '@/utils/animations';
import { cn } from '@/lib/utils';

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { 
    disableAnimation?: boolean;
    enableHover?: boolean;
    layoutId?: string;
  }
>(({ children, className, disableAnimation = false, enableHover = true, layoutId, ...props }, ref) => {
  if (disableAnimation) {
    return <Card ref={ref} className={className} {...props}>{children}</Card>;
  }

  return (
    <motion.div
      ref={ref}
      layoutId={layoutId}
      {...getMotionProps(enableHover ? cardHover : {})}
      initial="initial"
      whileHover={enableHover ? "hover" : undefined}
      style={{ willChange: 'transform' }}
      className={cn(
        "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
});

AnimatedCard.displayName = "AnimatedCard";
