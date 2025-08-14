
import React from 'react';
import { motion } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import { scaleInOut, getMotionProps } from '@/utils/animations';

export const AnimatedDialog = Dialog;

export const AnimatedDialogContent = React.forwardRef<
  React.ElementRef<typeof DialogContent>,
  React.ComponentPropsWithoutRef<typeof DialogContent>
>(({ children, ...props }, ref) => (
  <DialogContent asChild {...props}>
    <motion.div
      ref={ref}
      {...getMotionProps(scaleInOut)}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  </DialogContent>
));
AnimatedDialogContent.displayName = "AnimatedDialogContent";

export const AnimatedDialogHeader = DialogHeader;
export const AnimatedDialogTitle = DialogTitle;
export const AnimatedDialogDescription = DialogDescription;
export const AnimatedDialogFooter = DialogFooter;
