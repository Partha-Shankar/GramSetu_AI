import { TestPad, ParameterResult } from '../types/jaldrishti.types';

export interface ReferenceSwatch {
  level: string;
  rgb: { r: number; g: number; b: number };
  status: ParameterResult['status'];
}

// Mock reference values — per the module brief, these are placeholders
// and can be replaced with real strip-manufacturer color charts later.
export const REFERENCE_COLORS: Record<TestPad['parameter'], ReferenceSwatch[]> = {
  ph: [
    { level: '6.5 (Safe)', rgb: { r: 230, g: 200, b: 60 }, status: 'safe' },
    { level: '5.0 (Warning)', rgb: { r: 210, g: 140, b: 40 }, status: 'warning' },
    { level: '4.0 (Unsafe)', rgb: { r: 190, g: 80, b: 40 }, status: 'unsafe' },
  ],
  nitrate: [
    { level: 'Low (Safe)', rgb: { r: 250, g: 230, b: 235 }, status: 'safe' },
    { level: 'Moderate (Warning)', rgb: { r: 235, g: 120, b: 150 }, status: 'warning' },
    { level: 'High (Unsafe)', rgb: { r: 200, g: 40, b: 90 }, status: 'unsafe' },
  ],
  nitrite: [
    { level: 'Low (Safe)', rgb: { r: 220, g: 210, b: 240 }, status: 'safe' },
    { level: 'Moderate (Warning)', rgb: { r: 190, g: 150, b: 220 }, status: 'warning' },
    { level: 'High (Unsafe)', rgb: { r: 130, g: 60, b: 170 }, status: 'unsafe' },
  ],
  chlorine: [
    { level: 'Normal (Safe)', rgb: { r: 250, g: 235, b: 240 }, status: 'safe' },
    { level: 'Elevated (Warning)', rgb: { r: 240, g: 180, b: 200 }, status: 'warning' },
    { level: 'High (Unsafe)', rgb: { r: 220, g: 100, b: 140 }, status: 'unsafe' },
  ],
  hardness: [
    { level: 'Normal (Safe)', rgb: { r: 90, g: 110, b: 200 }, status: 'safe' },
    { level: 'Hard (Warning)', rgb: { r: 110, g: 90, b: 170 }, status: 'warning' },
    { level: 'Very Hard (Unsafe)', rgb: { r: 140, g: 60, b: 140 }, status: 'unsafe' },
  ],
};

export const PARAMETER_LABELS: Record<TestPad['parameter'], string> = {
  ph: 'pH',
  nitrate: 'Nitrate',
  nitrite: 'Nitrite',
  chlorine: 'Chlorine',
  hardness: 'Hardness',
};