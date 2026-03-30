'use client';

import { useRef, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/animations/gsap';
import {
  scrollFadeIn,
  scrollStagger,
  scrollParallax,
  scrollPin,
  scrollProgress,
} from '@/lib/animations/scroll';
import type { AnimationDirection } from '@/lib/animations/presets';

export interface UseScrollAnimationOptions {
  direction?: AnimationDirection;
  distance?: number;
  duration?: number;
  ease?: string;
  start?: string;
  end?: string;
  scrub?: boolean | number;
  markers?: boolean;
  toggleActions?: string;
  autoPlay?: boolean;
  dependencies?: unknown[];
}

export function useScrollAnimation<T extends HTMLElement = HTMLElement>(
  options: UseScrollAnimationOptions = {}
) {
  const {
    direction = 'up',
    distance = 50,
    duration = 0.6,
    ease = 'power2.out',
    start = 'top 80%',
    end = 'bottom 20%',
    scrub = false,
    markers = false,
    toggleActions = 'play none none reverse',
    autoPlay = true,
    dependencies = [],
  } = options;

  const elementRef = useRef<T>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!elementRef.current || !autoPlay) return;

      const tween = scrollFadeIn(elementRef.current, {
        trigger: elementRef.current,
        direction,
        distance,
        duration,
        ease,
        start,
        end,
        scrub,
        markers,
        toggleActions,
      });

      triggerRef.current = tween.scrollTrigger as ScrollTrigger;

      return () => {
        triggerRef.current?.kill();
      };
    },
    { dependencies: [...dependencies, autoPlay], scope: elementRef }
  );

  const refresh = useCallback(() => {
    triggerRef.current?.refresh();
  }, []);

  const kill = useCallback(() => {
    triggerRef.current?.kill();
  }, []);

  return {
    ref: elementRef,
    trigger: triggerRef,
    refresh,
    kill,
  };
}

export function useScrollStagger<T extends HTMLElement = HTMLElement>(
  options: UseScrollAnimationOptions & { stagger?: number; selector?: string } = {}
) {
  const {
    selector,
    direction = 'up',
    distance = 30,
    duration = 0.4,
    ease = 'power2.out',
    stagger = 0.1,
    start = 'top 80%',
    markers = false,
    toggleActions = 'play none none reverse',
    autoPlay = true,
    dependencies = [],
  } = options;

  const containerRef = useRef<T>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !autoPlay) return;

      const elements = selector
        ? containerRef.current.querySelectorAll(selector)
        : containerRef.current.children;

      if (!elements || elements.length === 0) return;

      const tween = scrollStagger(elements, {
        trigger: containerRef.current,
        direction,
        distance,
        duration,
        ease,
        stagger,
        start,
        markers,
        toggleActions,
      });

      triggerRef.current = tween.scrollTrigger as ScrollTrigger;

      return () => {
        triggerRef.current?.kill();
      };
    },
    { dependencies: [...dependencies, autoPlay], scope: containerRef }
  );

  return {
    ref: containerRef,
    trigger: triggerRef,
  };
}

export function useParallax<T extends HTMLElement = HTMLElement>(
  options: {
    yPercent?: number;
    xPercent?: number;
    scale?: number;
    rotation?: number;
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    dependencies?: unknown[];
  } = {}
) {
  const {
    yPercent = -20,
    xPercent = 0,
    scale,
    rotation,
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    markers = false,
    dependencies = [],
  } = options;

  const elementRef = useRef<T>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;

      const tween = scrollParallax(elementRef.current, {
        trigger: elementRef.current,
        yPercent,
        xPercent,
        scale,
        rotation,
        start,
        end,
        scrub,
        markers,
      });

      triggerRef.current = tween.scrollTrigger as ScrollTrigger;

      return () => {
        triggerRef.current?.kill();
      };
    },
    { dependencies, scope: elementRef }
  );

  return {
    ref: elementRef,
    trigger: triggerRef,
  };
}

export function useScrollProgress<T extends HTMLElement = HTMLElement>(
  onProgress: (progress: number) => void,
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    dependencies?: unknown[];
  } = {}
) {
  const {
    start = 'top bottom',
    end = 'bottom top',
    scrub = true,
    markers = false,
    dependencies = [],
  } = options;

  const elementRef = useRef<T>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;

      triggerRef.current = scrollProgress(elementRef.current, onProgress, {
        trigger: elementRef.current,
        start,
        end,
        scrub,
        markers,
      });

      return () => {
        triggerRef.current?.kill();
      };
    },
    { dependencies: [...dependencies, onProgress], scope: elementRef }
  );

  return {
    ref: elementRef,
    trigger: triggerRef,
  };
}

export function useScrollPin<T extends HTMLElement = HTMLElement>(
  options: {
    start?: string;
    end?: string;
    scrub?: boolean | number;
    markers?: boolean;
    pinSpacing?: boolean;
    dependencies?: unknown[];
  } = {}
) {
  const {
    start = 'top top',
    end = '+=100%',
    scrub = false,
    markers = false,
    pinSpacing = true,
    dependencies = [],
  } = options;

  const elementRef = useRef<T>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;

      triggerRef.current = scrollPin(elementRef.current, {
        start,
        end,
        scrub,
        markers,
        pinSpacing,
      });

      return () => {
        triggerRef.current?.kill();
      };
    },
    { dependencies, scope: elementRef }
  );

  return {
    ref: elementRef,
    trigger: triggerRef,
  };
}
