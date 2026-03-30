'use client';

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Default GSAP configuration
gsap.config({
  autoSleep: 60,
  force3D: true,
  nullTargetWarn: false,
});

// Default ease presets
export const eases = {
  // Smooth, natural feeling
  smooth: 'power2.out',
  smoothInOut: 'power2.inOut',

  // Bouncy, playful
  bounce: 'bounce.out',
  elastic: 'elastic.out(1, 0.3)',

  // Sharp, snappy
  snap: 'power3.out',
  snapInOut: 'power3.inOut',

  // Subtle, elegant
  subtle: 'power1.out',
  subtleInOut: 'power1.inOut',

  // Expo for dramatic reveals
  expo: 'expo.out',
  expoInOut: 'expo.inOut',

  // Back for overshoot effects
  back: 'back.out(1.7)',
  backInOut: 'back.inOut(1.7)',

  // Custom cubic bezier approximations
  spring: 'power3.out',
  swift: 'power4.out',
} as const;

// Duration presets in seconds
export const durations = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  slow: 0.6,
  dramatic: 0.8,
  epic: 1.2,
} as const;

// Stagger presets
export const staggers = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  dramatic: 0.2,
} as const;

export { gsap, ScrollTrigger };
