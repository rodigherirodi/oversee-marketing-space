
import React from 'react';
import { motion } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { buttonPress, getMotionProps } from '@/utils/animations';

export const AnimatedButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { disableAnimation?: boolean }
>(({ children, disableAnimation = false, ...props }, ref) => {
  if (disableAnimation) {
    return <Button ref={ref} {...props}>{children}</Button>;
  }

  return (
    <Button asChild ref={ref} {...props}>
      <motion.button
        {...getMotionProps(buttonPress)}
        initial="initial"
        whileHover="hover"
        whileTap="tap"
      >
        {children}
      </motion.button>
    </Button>
  );
});

AnimatedButton.displayName = "AnimatedButton";
