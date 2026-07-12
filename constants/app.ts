export const APP_CONFIG = {
  NAME: 'GramSetu AI',
  VERSION: '0.1.0',
  OFFLINE_DB_NAME: 'gramsetu_offline_store',
  OFFLINE_DB_VERSION: 1,
  SYNC_INTERVAL_MS: 300000, // 5 minutes sync loop
  LOCAL_STORAGE_KEYS: {
    THEME: 'gramsetu-ui-theme',
    PREFERENCES: 'gramsetu-user-preferences',
    SYNC_QUEUE: 'gramsetu-pending-sync',
    SIDEBAR_COLLAPSED: 'gramsetu-sidebar-collapsed',
  },
  MAX_OFFLINE_STORAGE_MB: 50,
} as const;
