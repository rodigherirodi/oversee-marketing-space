
import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { tabUnderlineVariants, slideUp, getMotionProps } from '@/utils/animations';
import { cn } from '@/lib/utils';

export const AnimatedTabs = Tabs;

export const AnimatedTabsList = React.forwardRef<
  React.ElementRef<typeof TabsList>,
  React.ComponentPropsWithoutRef<typeof TabsList>
>(({ className, ...props }, ref) => (
  <TabsList ref={ref} className={cn("relative", className)} {...props} />
));
AnimatedTabsList.displayName = "AnimatedTabsList";

export const AnimatedTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsTrigger>,
  React.ComponentPropsWithoutRef<typeof TabsTrigger> & { layoutId?: string }
>(({ children, className, value, layoutId, ...props }, ref) => (
  <TabsTrigger 
    ref={ref} 
    value={value} 
    className={cn("relative", className)} 
    {...props}
  >
    {children}
    <motion.div
      layoutId={layoutId || `tab-underline-${value}`}
      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
      {...getMotionProps(tabUnderlineVariants)}
    />
  </TabsTrigger>
));
AnimatedTabsTrigger.displayName = "AnimatedTabsTrigger";

export const AnimatedTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsContent>,
  React.ComponentPropsWithoutRef<typeof TabsContent>
>(({ children, className, ...props }, ref) => (
  <TabsContent asChild ref={ref} className={className} {...props}>
    <motion.div
      {...getMotionProps(slideUp)}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {children}
    </motion.div>
  </TabsContent>
));
AnimatedTabsContent.displayName = "AnimatedTabsContent";
