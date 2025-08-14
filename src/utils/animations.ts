
import { Variants, Transition } from 'framer-motion';

// Animation tokens - durations and easings
export const animationTokens = {
  durations: {
    fast: 0.15,
    medium: 0.25,
    slow: 0.3,
  },
  easings: {
    easeOut: [0.0, 0.0, 0.2, 1],
    easeIn: [0.4, 0.0, 1, 1],
    easeInOut: [0.4, 0.0, 0.2, 1],
    spring: { type: 'spring', stiffness: 300, damping: 30 },
    smooth: { type: 'spring', stiffness: 400, damping: 40 },
  },
} as const;

// Common animation variants
export const fadeInOut: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const slideUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

export const slideDown: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
};

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

export const slideRight: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
};

export const scaleInOut: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export const cardHover: Variants = {
  initial: { y: 0, boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' },
  hover: { 
    y: -2, 
    boxShadow: '0 10px 25px -3px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05)',
    transition: animationTokens.easings.smooth,
  },
};

export const buttonPress: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 },
};

export const shimmer: Variants = {
  initial: { x: '-100%' },
  animate: { 
    x: '100%',
    transition: {
      repeat: Infinity,
      duration: 1.5,
      ease: 'linear',
    },
  },
};

// Transitions
export const defaultTransition: Transition = {
  duration: animationTokens.durations.medium,
  ease: animationTokens.easings.easeOut,
};

export const fastTransition: Transition = {
  duration: animationTokens.durations.fast,
  ease: animationTokens.easings.easeOut,
};

export const springTransition: Transition = animationTokens.easings.spring;

// Page transitions for routing
export const pageVariants: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { 
    opacity: 1, 
    x: 0,
    transition: {
      duration: animationTokens.durations.medium,
      ease: animationTokens.easings.easeOut,
    },
  },
  exit: { 
    opacity: 0, 
    x: -20,
    transition: {
      duration: animationTokens.durations.fast,
      ease: animationTokens.easings.easeIn,
    },
  },
};

// Tab underline animation
export const tabUnderlineVariants: Variants = {
  initial: { scaleX: 0 },
  animate: { scaleX: 1 },
  exit: { scaleX: 0 },
};

// Stagger children animation
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export const staggerItem: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: defaultTransition,
  },
};

// Utility function to check for reduced motion preference
export const shouldReduceMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Motion props that respect accessibility
export const getMotionProps = (variants: Variants, transition?: Transition) => ({
  variants: shouldReduceMotion() ? {} : variants,
  transition: shouldReduceMotion() ? { duration: 0 } : transition,
  viewport: { once: true, margin: '-10px' },
});
