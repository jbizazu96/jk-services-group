// /hooks/useScrollPrevention.js
import { useEffect, useRef } from 'react';

export function useScrollPrevention(sectionIds = ['portfolio']) {
  const hasScrolled = useRef(false);

  useEffect(() => {
    // Block scrolling to specific sections on initial load
    const preventInitialScroll = () => {
      if (!hasScrolled.current) {
        const sections = sectionIds.map(id => document.getElementById(id));
        const isAtPreventedSection = sections.some(section => {
          if (!section) return false;
          const rect = section.getBoundingClientRect();
          return rect.top < 100 && rect.top > -100;
        });

        if (isAtPreventedSection) {
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      }
    };

    // Check immediately and after a short delay
    preventInitialScroll();
    const timer = setTimeout(preventInitialScroll, 50);
    const timer2 = setTimeout(preventInitialScroll, 150);

    // Mark that user has interacted
    const markUserScroll = () => {
      hasScrolled.current = true;
    };

    window.addEventListener('scroll', markUserScroll, { once: true });
    window.addEventListener('wheel', markUserScroll, { once: true });
    window.addEventListener('touchmove', markUserScroll, { once: true });

    return () => {
      clearTimeout(timer);
      clearTimeout(timer2);
      window.removeEventListener('scroll', markUserScroll);
      window.removeEventListener('wheel', markUserScroll);
      window.removeEventListener('touchmove', markUserScroll);
    };
  }, [sectionIds]);
}