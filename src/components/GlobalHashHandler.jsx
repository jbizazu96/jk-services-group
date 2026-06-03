'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function GlobalHashHandler() {
  const pathname = usePathname();

  useEffect(() => {
    // Function to handle hash scrolling
    const handleHashChange = () => {
      const hash = window.location.hash;
      
      if (hash === '#portfolio') {
        // Prevent scrolling to portfolio
        window.location.hash = '';
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'instant' });
        return false;
      }
      
      if (hash && hash !== '#portfolio') {
        // Let other hashes work normally
        const element = document.getElementById(hash.substring(1));
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }
      }
    };

    // Handle initial load
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [pathname]);

  return null;
}