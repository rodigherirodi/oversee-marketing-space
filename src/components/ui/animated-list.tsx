
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, staggerItem, getMotionProps } from '@/utils/animations';

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  disableAnimation?: boolean;
}

export const AnimatedList: React.FC<AnimatedListProps> = ({ 
  children, 
  className, 
  staggerDelay = 0.1,
  disableAnimation = false 
}) => {
  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  const containerVariants = {
    ...staggerContainer,
    animate: {
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  return (
    <motion.div
      className={className}
      {...getMotionProps(containerVariants)}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

export const AnimatedListItem: React.FC<{
  children: React.ReactNode;
  className?: string;
  disableAnimation?: boolean;
}> = ({ children, className, disableAnimation = false }) => {
  if (disableAnimation) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      {...getMotionProps(staggerItem)}
    >
      {children}
    </motion.div>
  );
};
