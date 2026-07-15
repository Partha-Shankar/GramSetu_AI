export type ScanStage = 'camera' | 'preview' | 'analyzing' | 'results';

export interface GuideRect {
  xPct: number; // left offset as % of video width
  yPct: number; // top offset as % of video height
  widthPct: number;
  heightPct: number;
}

export interface CapturedImage {
  dataUrl: string;
  width: number;
  height: number;
}

export interface TestPad {
  id: string;
  parameter: 'ph' | 'nitrate' | 'nitrite' | 'chlorine' | 'hardness';
  avgColor: { r: number; g: number; b: number };
}

export interface ParameterResult {
  parameter: TestPad['parameter'];
  label: string;
  level: string;
  status: 'safe' | 'warning' | 'unsafe';
}
export interface SavedReport {
  id: string;
  timestamp: number;
  results: ParameterResult[];
  overallStatus: 'safe' | 'warning' | 'unsafe';
}