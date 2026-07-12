import { ReactNode } from 'react';

export interface Module {
  id: string;
  name: string;
  description: string;
  path: string;
  iconName: string;
  developer: string;
  status: 'planning' | 'development' | 'testing' | 'completed';
}

export interface NavigationItem {
  title: string;
  href: string;
  iconName: string;
  description: string;
}

export type SidebarItem = NavigationItem;

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi' | 'mr' | 'ta'; // English, Hindi, Marathi, Tamil
  enableAudioFeedback: boolean;
  offlineSyncMode: 'wifi-only' | 'always' | 'manual';
  fontSize: 'sm' | 'base' | 'lg';
}

export interface DetectionReport {
  id: string;
  timestamp: string;
  location: {
    latitude: number;
    longitude: number;
    villageName: string;
  };
  imagePath?: string;
  detectedClasses: Array<{
    className: string;
    confidence: number;
    boundingBox?: [number, number, number, number];
  }>;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface HistoryItem {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  timestamp: string;
  synced: boolean;
}

export interface WaterAnalysis {
  id: string;
  timestamp: string;
  sourceType: 'well' | 'pond' | 'river' | 'handpump';
  sourceName: string;
  phValue?: number;
  turbidity?: 'clear' | 'turbid' | 'highly-turbid';
  contaminantsDetected: string[];
  potabilityConfidence: number; // 0 to 1
  status: 'safe' | 'warning' | 'unsafe';
}

export interface DocumentAnalysis {
  id: string;
  timestamp: string;
  fileName: string;
  documentType: 'land_record' | 'identity_card' | 'petition' | 'other';
  extractedText: string;
  translatedText?: string;
  keyFields: Record<string, string>;
  summary?: string;
}

export interface CommunityActivity {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  progressPercentage: number;
  assignedTo: string;
  status: 'not-started' | 'in-progress' | 'completed';
}

export interface AppState {
  isOnline: boolean;
  syncQueueCount: number;
  preferences: UserPreferences;
  isSidebarCollapsed: boolean;
}

export interface AppContextType {
  state: AppState;
  setOnlineStatus: (status: boolean) => void;
  incrementSyncQueue: () => void;
  decrementSyncQueue: () => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  toggleSidebar: () => void;
  triggerManualSync: () => Promise<void>;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

export interface ChildrenProps {
  children: ReactNode;
}
