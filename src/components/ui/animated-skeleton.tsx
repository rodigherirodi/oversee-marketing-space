
import React from 'react';
import { motion } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import { shimmer, getMotionProps } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface AnimatedSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  disableAnimation?: boolean;
}

export const AnimatedSkeleton = React.forwardRef<
  HTMLDivElement,
  AnimatedSkeletonProps
>(({ className, disableAnimation = false, ...props }, ref) => {
  if (disableAnimation) {
    return <Skeleton ref={ref} className={className} {...props} />;
  }

  return (
    <div ref={ref} className={cn("relative overflow-hidden", className)} {...props}>
      <Skeleton className="w-full h-full" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        {...getMotionProps(shimmer)}
        initial="initial"
        animate="animate"
      />
    </div>
  );
});

AnimatedSkeleton.displayName = "AnimatedSkeleton";
