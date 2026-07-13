export interface DetectionResult {
  id: string;
  label: string;
  confidence: number;
  category: 'dry' | 'wet' | 'hazardous' | 'sanitation';
  bbox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

export interface SwachhAuditReport {
  id: string;
  timestamp: string;
  imageSrc: string; // Base64 representation or path of the image
  detections: DetectionResult[];
  cleanlinessScore: number; // calculated score out of 100
  severity: 'low' | 'medium' | 'high' | 'critical';
  villageName: string;
  objectCount: number;
  notes?: string;
}
