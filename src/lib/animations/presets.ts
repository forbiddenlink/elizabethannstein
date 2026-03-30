'use client';

import { gsap } from './gsap';
import { eases, durations, staggers } from './gsap';

export type AnimationDirection = 'up' | 'down' | 'left' | 'right';

export interface FadeInOptions {
  direction?: AnimationDirection;
  distance?: number;
  duration?: number;
  ease?: string;
  delay?: number;
}

export interface StaggerOptions extends FadeInOptions {
  stagger?: number;
}

// Fade in animation preset
export function fadeIn(
  element: gsap.TweenTarget,
  options: FadeInOptions = {}
): gsap.core.Tween {
  const {
    direction,
    distance = 30,
    duration = durations.normal,
    ease = eases.smooth,
    delay = 0,
  } = options;

  const from: gsap.TweenVars = { opacity: 0 };

  if (direction) {
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
  }

  return gsap.from(element, {
    ...from,
    duration,
    ease,
    delay,
    clearProps: 'all',
  });
}

// Fade out animation preset
export function fadeOut(
  element: gsap.TweenTarget,
  options: Omit<FadeInOptions, 'direction'> & { direction?: AnimationDirection } = {}
): gsap.core.Tween {
  const {
    direction,
    distance = 30,
    duration = durations.normal,
    ease = eases.smooth,
    delay = 0,
  } = options;

  const to: gsap.TweenVars = { opacity: 0 };

  if (direction) {
    switch (direction) {
      case 'up':
        to.y = -distance;
        break;
      case 'down':
        to.y = distance;
        break;
      case 'left':
        to.x = -distance;
        break;
      case 'right':
        to.x = distance;
        break;
    }
  }

  return gsap.to(element, {
    ...to,
    duration,
    ease,
    delay,
  });
}

// Stagger entrance animation
export function staggerFadeIn(
  elements: gsap.TweenTarget,
  options: StaggerOptions = {}
): gsap.core.Tween {
  const {
    direction = 'up',
    distance = 30,
    duration = durations.normal,
    ease = eases.smooth,
    delay = 0,
    stagger = staggers.normal,
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
    delay,
    stagger,
    clearProps: 'all',
  });
}

// Scale in animation
export function scaleIn(
  element: gsap.TweenTarget,
  options: Omit<FadeInOptions, 'direction' | 'distance'> & { scale?: number } = {}
): gsap.core.Tween {
  const {
    scale = 0.8,
    duration = durations.normal,
    ease = eases.back,
    delay = 0,
  } = options;

  return gsap.from(element, {
    opacity: 0,
    scale,
    duration,
    ease,
    delay,
    clearProps: 'all',
  });
}

// Slide in animation
export function slideIn(
  element: gsap.TweenTarget,
  direction: AnimationDirection = 'left',
  options: Omit<FadeInOptions, 'direction'> = {}
): gsap.core.Tween {
  const {
    distance = 100,
    duration = durations.slow,
    ease = eases.expo,
    delay = 0,
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
    delay,
    clearProps: 'all',
  });
}

// Text reveal animation (character by character)
export function textReveal(
  element: gsap.TweenTarget,
  options: { duration?: number; stagger?: number; ease?: string } = {}
): gsap.core.Tween {
  const {
    duration = durations.fast,
    stagger = 0.03,
    ease = eases.smooth,
  } = options;

  return gsap.from(element, {
    opacity: 0,
    y: 20,
    rotateX: -90,
    duration,
    stagger,
    ease,
    clearProps: 'all',
  });
}

// Hover scale animation
export function hoverScale(
  element: gsap.TweenTarget,
  scale: number = 1.05
): { enter: () => void; leave: () => void } {
  return {
    enter: () => {
      gsap.to(element, {
        scale,
        duration: durations.fast,
        ease: eases.smooth,
      });
    },
    leave: () => {
      gsap.to(element, {
        scale: 1,
        duration: durations.fast,
        ease: eases.smooth,
      });
    },
  };
}

// Parallax transform
export function parallaxTransform(
  element: gsap.TweenTarget,
  yPercent: number = 20
): gsap.core.Tween {
  return gsap.to(element, {
    yPercent,
    ease: 'none',
  });
}
