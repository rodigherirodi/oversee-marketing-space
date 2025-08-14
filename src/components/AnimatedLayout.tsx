
import React from 'react';
import { LazyMotion, domAnimation, AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { pageVariants, getMotionProps } from '@/utils/animations';

interface AnimatedLayoutProps {
  children: React.ReactNode;
}

const AnimatedLayout: React.FC<AnimatedLayoutProps> = ({ children }) => {
  const location = useLocation();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={location.pathname}
          {...getMotionProps(pageVariants)}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ willChange: 'transform, opacity' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
};

export default AnimatedLayout;
