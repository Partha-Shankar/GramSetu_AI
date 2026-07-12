'use client';

import { useState, useEffect } from 'react';

export function useMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const media = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    
    // Set initial state asynchronously to avoid warnings about synchronous setState in effect body
    setTimeout(() => {
      setIsMobile(media.matches);
    }, 0);

    const listener = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [breakpoint]);

  return isMobile;
}
