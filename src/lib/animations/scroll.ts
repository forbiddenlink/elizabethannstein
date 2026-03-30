'use client';

import { gsap, ScrollTrigger } from './gsap';
import { eases, durations } from './gsap';
import type { AnimationDirection } from './presets';

export interface ScrollAnimationOptions {
  trigger: string | Element;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  pin?: boolean;
  anticipatePin?: number;
  onEnter?: () => void;
  onLeave?: () => void;
  onEnterBack?: () => void;
  onLeaveBack?: () => void;
}

export interface ScrollFadeOptions extends ScrollAnimationOptions {
  direction?: AnimationDirection;
  distance?: number;
  duration?: number;
  ease?: string;
}

// Create a scroll-triggered fade in animation
export function scrollFadeIn(
  element: gsap.TweenTarget,
  options: ScrollFadeOptions
): gsap.core.Tween {
  const {
    trigger,
    direction = 'up',
    distance = 50,
    duration = durations.slow,
    ease = eases.smooth,
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    toggleActions = 'play none none reverse',
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  const from: gsap.TweenVars = { opacity: 0 };

  switch (direction) {
    case 'up':
      from.y = distance;
      break;
    case 'down':
      from.y = -distance;
      break;
    case 'left':
      from.x = distance;
      break;
    case 'right':
      from.x = -distance;
      break;
  }

  return gsap.from(element, {
    ...from,
    duration,
    ease,
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      markers,
      toggleActions,
      onEnter,
      onLeave,
      onEnterBack,
      onLeaveBack,
    },
    clearProps: scrub ? undefined : 'all',
  });
}

// Create a scroll-triggered stagger animation
export function scrollStagger(
  elements: gsap.TweenTarget,
  options: ScrollFadeOptions & { stagger?: number }
): gsap.core.Tween {
  const {
    trigger,
    direction = 'up',
    distance = 30,
    duration = durations.normal,
    ease = eases.smooth,
    stagger = 0.1,
    start = 'top 80%',
    markers = false,
    toggleActions = 'play none none reverse',
  } = options;

  const from: gsap.TweenVars = { opacity: 0 };

  switch (direction) {
    case 'up':
      from.y = distance;
      break;
    case 'down':
      from.y = -distance;
      break;
    case 'left':
      from.x = distance;
      break;
    case 'right':
      from.x = -distance;
      break;
  }

  return gsap.from(elements, {
    ...from,
    duration,
    ease,
    stagger,
    scrollTrigger: {
      trigger,
      start,
      markers,
      toggleActions,
    },
    clearProps: 'all',
  });
}

// Create a parallax effect
export function scrollParallax(
  element: gsap.TweenTarget,
  options: ScrollAnimationOptions & {
    yPercent?: number;
    xPercent?: number;
    scale?: number;
    rotation?: number;
  }
): gsap.core.Tween {
  const {
    trigger,
    yPercent = 0,
    xPercent = 0,
    scale,
    rotation,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    markers = false,
  } = options;

  const to: gsap.TweenVars = {};

  if (yPercent !== 0) to.yPercent = yPercent;
  if (xPercent !== 0) to.xPercent = xPercent;
  if (scale !== undefined) to.scale = scale;
  if (rotation !== undefined) to.rotation = rotation;

  return gsap.to(element, {
    ...to,
    ease: 'none',
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      markers,
    },
  });
}

// Pin an element while scrolling
export function scrollPin(
  element: string | Element,
  options: Omit<ScrollAnimationOptions, 'trigger' | 'pin'> & {
    pinSpacing?: boolean;
    pinnedContainer?: Element;
  } = {}
): ScrollTrigger {
  const {
    start = 'top top',
    end = '+=100%',
    scrub = false,
    markers = false,
    pinSpacing = true,
    pinnedContainer,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  } = options;

  return ScrollTrigger.create({
    trigger: element,
    pin: true,
    pinSpacing,
    pinnedContainer,
    start,
    end,
    scrub,
    markers,
    onEnter,
    onLeave,
    onEnterBack,
    onLeaveBack,
  });
}

// Progress-based animation
export function scrollProgress(
  trigger: string | Element,
  onProgress: (progress: number) => void,
  options: Partial<ScrollAnimationOptions> = {}
): ScrollTrigger {
  const {
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    markers = false,
  } = options;

  return ScrollTrigger.create({
    trigger,
    start,
    end,
    scrub,
    markers,
    onUpdate: (self) => {
      onProgress(self.progress);
    },
  });
}

// Refresh all scroll triggers (useful after dynamic content changes)
export function refreshScrollTriggers(): void {
  ScrollTrigger.refresh();
}

// Kill all scroll triggers
export function killAllScrollTriggers(): void {
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
}

// Get all scroll triggers
export function getAllScrollTriggers(): ScrollTrigger[] {
  return ScrollTrigger.getAll();
}

export { ScrollTrigger };
