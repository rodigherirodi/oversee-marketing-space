
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
    <Card asChild className={cn("overflow-hidden", className)} {...props}>
      <motion.div
        ref={ref}
        layoutId={layoutId}
        {...getMotionProps(enableHover ? cardHover : {})}
        initial="initial"
        whileHover={enableHover ? "hover" : undefined}
        style={{ willChange: 'transform' }}
      >
        {children}
      </motion.div>
    </Card>
  );
});

AnimatedCard.displayName = "AnimatedCard";
