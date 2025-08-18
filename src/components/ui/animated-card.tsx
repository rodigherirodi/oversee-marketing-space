
import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cardHover, getMotionProps } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface AnimatedCardProps extends Omit<HTMLMotionProps<'div'>, 'onDrag' | 'onDragStart' | 'onDragEnd'> {
  children: React.ReactNode;
  disableAnimation?: boolean;
  enableHover?: boolean;
  layoutId?: string;
}

export const AnimatedCard = React.forwardRef<
  HTMLDivElement,
  AnimatedCardProps
>(({ children, className, disableAnimation = false, enableHover = true, layoutId, ...props }, ref) => {
  if (disableAnimation) {
    // Filter out all motion-specific props for regular div
    const {
      initial,
      animate,
      exit,
      variants,
      transition,
      whileHover,
      whileTap,
      whileFocus,
      whileDrag,
      whileInView,
      viewport,
      style,
      // Motion-specific callbacks
      onUpdate,
      onAnimationStart,
      onAnimationComplete,
      onHoverStart,
      onHoverEnd,
      onTapStart,
      onTap,
      onTapCancel,
      onPan,
      onPanStart,
      onPanEnd,
      onDirectionLock,
      onDragTransitionEnd,
      onViewportEnter,
      onViewportLeave,
      onBeforeLayoutMeasure,
      onLayoutMeasure,
      ...divProps
    } = props;

    return (
      <div 
        ref={ref} 
        className={cn(
          "rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden",
          className
        )}
        style={style as React.CSSProperties}
        {...divProps}
      >
        {children}
      </div>
    );
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
