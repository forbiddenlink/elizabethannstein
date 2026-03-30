'use client';

import { useRef, useEffect, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/animations/gsap';
import { fadeIn, fadeOut, scaleIn, slideIn, staggerFadeIn } from '@/lib/animations/presets';
import type { AnimationDirection, FadeInOptions, StaggerOptions } from '@/lib/animations/presets';

export interface UseGsapAnimationOptions {
  autoPlay?: boolean;
  dependencies?: unknown[];
}

export function useGsapAnimation<T extends HTMLElement = HTMLElement>(
  options: UseGsapAnimationOptions = {}
) {
  const { autoPlay = false, dependencies = [] } = options;
  const elementRef = useRef<T>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  useGSAP(
    () => {
      if (!elementRef.current) return;

      contextRef.current = gsap.context(() => {
        if (autoPlay) {
          gsap.from(elementRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.4,
            ease: 'power2.out',
          });
        }
      }, elementRef);

      return () => {
        contextRef.current?.revert();
      };
    },
    { dependencies: [...dependencies, autoPlay], scope: elementRef }
  );

  const animate = useCallback(
    (
      type: 'fadeIn' | 'fadeOut' | 'scaleIn' | 'slideIn',
      animOptions?: FadeInOptions & { direction?: AnimationDirection }
    ) => {
      if (!elementRef.current) return;

      switch (type) {
        case 'fadeIn':
          return fadeIn(elementRef.current, animOptions);
        case 'fadeOut':
          return fadeOut(elementRef.current, animOptions);
        case 'scaleIn':
          return scaleIn(elementRef.current, animOptions);
        case 'slideIn':
          return slideIn(
            elementRef.current,
            animOptions?.direction || 'left',
            animOptions
          );
      }
    },
    []
  );

  const animateTo = useCallback((vars: gsap.TweenVars) => {
    if (!elementRef.current) return;
    return gsap.to(elementRef.current, vars);
  }, []);

  const animateFrom = useCallback((vars: gsap.TweenVars) => {
    if (!elementRef.current) return;
    return gsap.from(elementRef.current, vars);
  }, []);

  const animateFromTo = useCallback(
    (fromVars: gsap.TweenVars, toVars: gsap.TweenVars) => {
      if (!elementRef.current) return;
      return gsap.fromTo(elementRef.current, fromVars, toVars);
    },
    []
  );

  return {
    ref: elementRef,
    animate,
    animateTo,
    animateFrom,
    animateFromTo,
    gsap,
  };
}

export function useStaggerAnimation<T extends HTMLElement = HTMLElement>(
  options: UseGsapAnimationOptions & StaggerOptions = {}
) {
  const {
    autoPlay = false,
    dependencies = [],
    direction = 'up',
    distance = 30,
    duration = 0.4,
    stagger = 0.1,
    ease = 'power2.out',
    delay = 0,
  } = options;

  const containerRef = useRef<T>(null);
  const contextRef = useRef<gsap.Context | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      contextRef.current = gsap.context(() => {
        if (autoPlay) {
          const children = containerRef.current?.children;
          if (children && children.length > 0) {
            staggerFadeIn(children, {
              direction,
              distance,
              duration,
              stagger,
              ease,
              delay,
            });
          }
        }
      }, containerRef);

      return () => {
        contextRef.current?.revert();
      };
    },
    { dependencies: [...dependencies, autoPlay], scope: containerRef }
  );

  const animateChildren = useCallback(
    (staggerOptions?: StaggerOptions) => {
      if (!containerRef.current) return;

      const children = containerRef.current.children;
      if (children && children.length > 0) {
        return staggerFadeIn(children, {
          direction,
          distance,
          duration,
          stagger,
          ease,
          delay,
          ...staggerOptions,
        });
      }
    },
    [direction, distance, duration, stagger, ease, delay]
  );

  return {
    ref: containerRef,
    animateChildren,
    gsap,
  };
}

export function useTimeline(options: gsap.TimelineVars = {}) {
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    timelineRef.current = gsap.timeline(options);

    return () => {
      timelineRef.current?.kill();
    };
  }, []);

  const getTimeline = useCallback(() => timelineRef.current, []);

  const play = useCallback(() => timelineRef.current?.play(), []);
  const pause = useCallback(() => timelineRef.current?.pause(), []);
  const reverse = useCallback(() => timelineRef.current?.reverse(), []);
  const restart = useCallback(() => timelineRef.current?.restart(), []);
  const seek = useCallback((time: number) => timelineRef.current?.seek(time), []);

  return {
    timeline: timelineRef,
    getTimeline,
    play,
    pause,
    reverse,
    restart,
    seek,
  };
}
