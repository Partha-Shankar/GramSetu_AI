import { TestPad } from '../types/jaldrishti.types';

// Defines where each test pad sits *within the cropped strip image*
// (as percentages of the strip's own width/height, not the full camera frame).
// These are placeholder positions for a 5-pad strip evenly spaced left to right —
// adjust the percentages once you test with a real strip photo and see where
// the pads actually land.
export interface PadRegionConfig {
  parameter: TestPad['parameter'];
  label: string;
  xPct: number;
  yPct: number;
  widthPct: number;
  heightPct: number;
}

export const PAD_REGIONS: PadRegionConfig[] = [
  { parameter: 'ph', label: 'pH', xPct: 2, yPct: 15, widthPct: 16, heightPct: 70 },
  { parameter: 'nitrate', label: 'Nitrate', xPct: 21, yPct: 15, widthPct: 16, heightPct: 70 },
  { parameter: 'nitrite', label: 'Nitrite', xPct: 40, yPct: 15, widthPct: 16, heightPct: 70 },
  { parameter: 'chlorine', label: 'Chlorine', xPct: 59, yPct: 15, widthPct: 16, heightPct: 70 },
  { parameter: 'hardness', label: 'Hardness', xPct: 78, yPct: 15, widthPct: 16, heightPct: 70 },
];