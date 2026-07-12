'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeContextType } from '@/types';
import { APP_CONFIG } from '@/constants/app';

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setTimeout(() => {
        const savedTheme = localStorage.getItem(APP_CONFIG.LOCAL_STORAGE_KEYS.THEME) as 'light' | 'dark' | null;
        
        const selectTheme = () => {
          if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme;
          }
          // Fallback to system preference
          const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
          return prefersDark ? 'dark' : 'light';
        };

        const activeTheme = selectTheme();
        setThemeState(activeTheme);
        
        if (activeTheme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }, 0);
    }
  }, []);

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.THEME, newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
