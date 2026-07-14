
export interface BoundingBox {
  x: number;      // percentage 0-100
  y: number;      // percentage 0-100
  width: number;  // percentage 0-100
  height: number; // percentage 0-100
}

export interface ModelDetection {
  label: string;
  confidence: number;
  bbox: BoundingBox;
  category: 'dry' | 'wet' | 'hazardous' | 'sanitation';
}

export interface PreprocessedImage {
  tensor: Float32Array;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
}
