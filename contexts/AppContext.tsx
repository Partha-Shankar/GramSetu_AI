'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppContextType, AppState, UserPreferences } from '@/types';
import { APP_CONFIG } from '@/constants/app';

const defaultPreferences: UserPreferences = {
  theme: 'light',
  language: 'en',
  enableAudioFeedback: false,
  offlineSyncMode: 'wifi-only',
  fontSize: 'base',
};

const defaultState: AppState = {
  isOnline: true,
  syncQueueCount: 0,
  preferences: defaultPreferences,
  isSidebarCollapsed: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleOnline = () => setState((prev) => ({ ...prev, isOnline: true }));
      const handleOffline = () => setState((prev) => ({ ...prev, isOnline: false }));

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      // Load state on mount
      setTimeout(() => {
        try {
          const storedPrefs = localStorage.getItem(APP_CONFIG.LOCAL_STORAGE_KEYS.PREFERENCES);
          const storedSidebar = localStorage.getItem(APP_CONFIG.LOCAL_STORAGE_KEYS.SIDEBAR_COLLAPSED);
          
          setState((prev) => ({
            ...prev,
            isOnline: window.navigator.onLine,
            preferences: storedPrefs ? JSON.parse(storedPrefs) : defaultPreferences,
            isSidebarCollapsed: storedSidebar === 'true',
          }));
        } catch (err) {
          console.error('Error loading values from localStorage:', err);
        }
      }, 0);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
  }, []);

  const setOnlineStatus = (isOnline: boolean) => {
    setState((prev) => ({ ...prev, isOnline }));
  };

  const incrementSyncQueue = () => {
    setState((prev) => {
      const newCount = prev.syncQueueCount + 1;
      localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.SYNC_QUEUE, String(newCount));
      return { ...prev, syncQueueCount: newCount };
    });
  };

  const decrementSyncQueue = () => {
    setState((prev) => {
      const newCount = Math.max(0, prev.syncQueueCount - 1);
      localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.SYNC_QUEUE, String(newCount));
      return { ...prev, syncQueueCount: newCount };
    });
  };

  const updatePreferences = (prefs: Partial<UserPreferences>) => {
    setState((prev) => {
      const updatedPrefs = { ...prev.preferences, ...prefs };
      localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.PREFERENCES, JSON.stringify(updatedPrefs));
      return { ...prev, preferences: updatedPrefs };
    });
  };

  const toggleSidebar = () => {
    setState((prev) => {
      const nextCollapsed = !prev.isSidebarCollapsed;
      localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.SIDEBAR_COLLAPSED, String(nextCollapsed));
      return { ...prev, isSidebarCollapsed: nextCollapsed };
    });
  };

  const triggerManualSync = async () => {
    if (!state.isOnline) {
      console.warn('Sync requested but client is offline.');
      return;
    }
    console.log('Initiating manual database sync...');
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        setState((prev) => {
          localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEYS.SYNC_QUEUE, '0');
          return { ...prev, syncQueueCount: 0 };
        });
        console.log('Manual sync completed.');
        resolve();
      }, 1500);
    });
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setOnlineStatus,
        incrementSyncQueue,
        decrementSyncQueue,
        updatePreferences,
        toggleSidebar,
        triggerManualSync,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
