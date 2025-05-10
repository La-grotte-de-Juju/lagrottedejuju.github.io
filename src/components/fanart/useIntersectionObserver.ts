import { useState, useEffect, RefObject } from 'react';

// Un hook personnalisé qui utilise l'Intersection Observer API pour détecter
// quand un élément devient visible dans la fenêtre
export function useIntersectionObserver(
  elementRef: RefObject<Element>,
  options: {
    root?: null | Element;
    rootMargin?: string;
    threshold?: number;
  } = {
    root: null, // viewport par défaut
    rootMargin: '0px',
    threshold: 0.1, // 10% de l'élément doit être visible
  }
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef?.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [elementRef, options]);

  return isIntersecting;
}
