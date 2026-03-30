'use client';

import { useRef, useState, useCallback } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/animations/gsap';
import { eases, durations } from '@/lib/animations/gsap';

export interface SplitTextResult {
  chars: HTMLSpanElement[];
  words: HTMLSpanElement[];
  lines: HTMLSpanElement[];
}

export interface UseTextSplitOptions {
  type?: 'chars' | 'words' | 'lines' | 'chars,words' | 'words,lines' | 'chars,words,lines';
  autoPlay?: boolean;
  animationType?: 'fadeIn' | 'slideUp' | 'slideDown' | 'rotateIn' | 'scaleIn';
  stagger?: number;
  duration?: number;
  ease?: string;
  delay?: number;
  scrollTrigger?: boolean;
  scrollStart?: string;
  dependencies?: unknown[];
}

function splitText(element: HTMLElement, type: string): SplitTextResult {
  const result: SplitTextResult = {
    chars: [],
    words: [],
    lines: [],
  };

  const text = element.textContent || '';
  const types = type.split(',').map((t) => t.trim());
  element.innerHTML = '';

  const wordTexts = text.split(/\s+/).filter(Boolean);

  if (types.includes('lines')) {
    const lineWrapper = document.createElement('span');
    lineWrapper.className = 'gsap-split-line';
    lineWrapper.style.display = 'block';

    wordTexts.forEach((wordText, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'gsap-split-word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      if (types.includes('chars')) {
        wordText.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'gsap-split-char';
          charSpan.style.display = 'inline-block';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          result.chars.push(charSpan);
        });
      } else {
        wordSpan.textContent = wordText;
      }

      lineWrapper.appendChild(wordSpan);
      result.words.push(wordSpan);

      if (wordIndex < wordTexts.length - 1) {
        lineWrapper.appendChild(document.createTextNode(' '));
      }
    });

    element.appendChild(lineWrapper);
    result.lines.push(lineWrapper);
  } else {
    wordTexts.forEach((wordText, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'gsap-split-word';
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap';

      if (types.includes('chars')) {
        wordText.split('').forEach((char) => {
          const charSpan = document.createElement('span');
          charSpan.className = 'gsap-split-char';
          charSpan.style.display = 'inline-block';
          charSpan.textContent = char;
          wordSpan.appendChild(charSpan);
          result.chars.push(charSpan);
        });
      } else {
        wordSpan.textContent = wordText;
      }

      element.appendChild(wordSpan);
      result.words.push(wordSpan);

      if (wordIndex < wordTexts.length - 1) {
        element.appendChild(document.createTextNode(' '));
      }
    });
  }

  return result;
}

export function useTextSplit<T extends HTMLElement = HTMLElement>(
  options: UseTextSplitOptions = {}
) {
  const {
    type = 'chars',
    autoPlay = false,
    animationType = 'fadeIn',
    stagger = 0.03,
    duration = durations.fast,
    ease = eases.smooth,
    delay = 0,
    scrollTrigger = false,
    scrollStart = 'top 80%',
    dependencies = [],
  } = options;

  const elementRef = useRef<T>(null);
  const splitResultRef = useRef<SplitTextResult | null>(null);
  const originalTextRef = useRef<string>('');
  const [isSplit, setIsSplit] = useState(false);

  const split = useCallback(() => {
    if (!elementRef.current) return null;

    if (!originalTextRef.current) {
      originalTextRef.current = elementRef.current.textContent || '';
    }

    splitResultRef.current = splitText(elementRef.current, type);
    setIsSplit(true);
    return splitResultRef.current;
  }, [type]);

  const revert = useCallback(() => {
    if (!elementRef.current || !originalTextRef.current) return;

    elementRef.current.textContent = originalTextRef.current;
    splitResultRef.current = null;
    setIsSplit(false);
  }, []);

  const getAnimationFrom = useCallback((): gsap.TweenVars => {
    switch (animationType) {
      case 'slideUp':
        return { opacity: 0, y: '100%' };
      case 'slideDown':
        return { opacity: 0, y: '-100%' };
      case 'rotateIn':
        return { opacity: 0, rotateX: -90, transformOrigin: 'top center' };
      case 'scaleIn':
        return { opacity: 0, scale: 0 };
      case 'fadeIn':
      default:
        return { opacity: 0, y: 20 };
    }
  }, [animationType]);

  const animate = useCallback(() => {
    if (!splitResultRef.current) return null;

    const types = type.split(',').map((t) => t.trim());
    let targets: HTMLSpanElement[] = [];

    if (types.includes('chars') && splitResultRef.current.chars.length > 0) {
      targets = splitResultRef.current.chars;
    } else if (types.includes('words') && splitResultRef.current.words.length > 0) {
      targets = splitResultRef.current.words;
    } else if (types.includes('lines') && splitResultRef.current.lines.length > 0) {
      targets = splitResultRef.current.lines;
    }

    if (targets.length === 0) return null;

    const fromVars = getAnimationFrom();

    if (scrollTrigger && elementRef.current) {
      return gsap.from(targets, {
        ...fromVars,
        duration,
        stagger,
        ease,
        delay,
        scrollTrigger: {
          trigger: elementRef.current,
          start: scrollStart,
          toggleActions: 'play none none reverse',
        },
        clearProps: 'all',
      });
    }

    return gsap.from(targets, {
      ...fromVars,
      duration,
      stagger,
      ease,
      delay,
      clearProps: 'all',
    });
  }, [type, duration, stagger, ease, delay, scrollTrigger, scrollStart, getAnimationFrom]);

  useGSAP(
    () => {
      if (!elementRef.current || !autoPlay) return;

      split();

      gsap.delayedCall(0.01, () => {
        animate();
      });
    },
    { dependencies: [...dependencies, autoPlay], scope: elementRef }
  );

  return {
    ref: elementRef,
    split,
    revert,
    animate,
    splitResult: splitResultRef.current,
    isSplit,
  };
}

export function useScrollTextReveal<T extends HTMLElement = HTMLElement>(
  options: Omit<UseTextSplitOptions, 'scrollTrigger' | 'autoPlay'> = {}
) {
  return useTextSplit<T>({
    ...options,
    autoPlay: true,
    scrollTrigger: true,
  });
}

export function useMountTextReveal<T extends HTMLElement = HTMLElement>(
  options: Omit<UseTextSplitOptions, 'scrollTrigger' | 'autoPlay'> = {}
) {
  return useTextSplit<T>({
    ...options,
    autoPlay: true,
    scrollTrigger: false,
  });
}
