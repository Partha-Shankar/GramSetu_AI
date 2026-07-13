import { SwachhAuditReport } from '../types/types';

const STORAGE_KEY = 'gramsetu_swachh_audit_history';

// A selection of villages for mock data
const VILLAGES = ['Rajpur', 'Dhamori', 'Kalyanpur', 'Pipaldhar', 'Sonori', 'Malegaon'];

// Sample mock base64/placeholder images representing different scenarios
const MOCK_IMAGES = {
  STREET_LITTER: 'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600',
  OPEN_DRAINAGE: 'https://images.unsplash.com/photo-1508873696983-2df519f0397e?auto=format&fit=crop&q=80&w=600',
  GARBAGE_DUMP: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=600',
  CLEAN_STREET: 'https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=600',
};

const DEFAULT_REPORTS: SwachhAuditReport[] = [
  {
    id: 'report-1',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 3).toISOString(), // 3 days ago
    imageSrc: MOCK_IMAGES.GARBAGE_DUMP,
    villageName: 'Rajpur',
    cleanlinessScore: 32,
    severity: 'critical',
    objectCount: 6,
    notes: 'Large accumulation of mixed solid waste near the community well. High risk of water contamination.',
    detections: [
      { id: 'det-1-1', label: 'Plastic Bottle', confidence: 0.94, category: 'dry', bbox: { x: 10, y: 15, width: 25, height: 40 } },
      { id: 'det-1-2', label: 'Plastic Bag', confidence: 0.88, category: 'dry', bbox: { x: 35, y: 40, width: 30, height: 35 } },
      { id: 'det-1-3', label: 'Food Waste', confidence: 0.82, category: 'wet', bbox: { x: 60, y: 20, width: 20, height: 25 } },
      { id: 'det-1-4', label: 'Organic Waste', confidence: 0.79, category: 'wet', bbox: { x: 15, y: 65, width: 45, height: 30 } },
      { id: 'det-1-5', label: 'Electronic Waste', confidence: 0.85, category: 'hazardous', bbox: { x: 70, y: 60, width: 20, height: 25 } },
      { id: 'det-1-6', label: 'Cardboard', confidence: 0.76, category: 'dry', bbox: { x: 5, y: 45, width: 25, height: 15 } },
    ],
  },
  {
    id: 'report-2',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1.5).toISOString(), // 1.5 days ago
    imageSrc: MOCK_IMAGES.OPEN_DRAINAGE,
    villageName: 'Dhamori',
    cleanlinessScore: 48,
    severity: 'high',
    objectCount: 4,
    notes: 'Blocked drainage channel causing stagnant sewage water on the main street corridor.',
    detections: [
      { id: 'det-2-1', label: 'Sewage', confidence: 0.92, category: 'sanitation', bbox: { x: 10, y: 30, width: 80, height: 40 } },
      { id: 'det-2-2', label: 'Stagnant Water', confidence: 0.89, category: 'sanitation', bbox: { x: 20, y: 50, width: 60, height: 35 } },
      { id: 'det-2-3', label: 'Plastic Bottle', confidence: 0.71, category: 'dry', bbox: { x: 5, y: 75, width: 15, height: 15 } },
      { id: 'det-2-4', label: 'Paper', confidence: 0.65, category: 'dry', bbox: { x: 75, y: 80, width: 10, height: 10 } },
    ],
  },
  {
    id: 'report-3',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
    imageSrc: MOCK_IMAGES.STREET_LITTER,
    villageName: 'Kalyanpur',
    cleanlinessScore: 68,
    severity: 'medium',
    objectCount: 3,
    notes: 'Scattered dry waste near the primary school entrance. Needs local clearing.',
    detections: [
      { id: 'det-3-1', label: 'Plastic Wrapper', confidence: 0.86, category: 'dry', bbox: { x: 20, y: 55, width: 15, height: 10 } },
      { id: 'det-3-2', label: 'Paper', confidence: 0.81, category: 'dry', bbox: { x: 45, y: 60, width: 25, height: 20 } },
      { id: 'det-3-3', label: 'Glass Bottle', confidence: 0.77, category: 'dry', bbox: { x: 75, y: 40, width: 10, height: 30 } },
    ],
  },
  {
    id: 'report-4',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    imageSrc: MOCK_IMAGES.CLEAN_STREET,
    villageName: 'Sonori',
    cleanlinessScore: 92,
    severity: 'low',
    objectCount: 0,
    notes: 'Highly clean public path near Panchayat office. No visible waste elements.',
    detections: [],
  },
];

export const auditService = {
  getHistory(): SwachhAuditReport[] {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        // Initialize with default reports
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_REPORTS));
        return DEFAULT_REPORTS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse SwachhAudit history:', e);
      return [];
    }
  },

  getReport(id: string): SwachhAuditReport | undefined {
    const history = this.getHistory();
    return history.find((r) => r.id === id);
  },

  saveReport(report: SwachhAuditReport): void {
    if (typeof window === 'undefined') return;
    try {
      const history = this.getHistory();
      // Remove duplicates if editing
      const filtered = history.filter((r) => r.id !== report.id);
      const updated = [report, ...filtered];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save SwachhAudit report:', e);
    }
  },

  deleteReport(id: string): void {
    if (typeof window === 'undefined') return;
    try {
      const history = this.getHistory();
      const updated = history.filter((r) => r.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete SwachhAudit report:', e);
    }
  },

  runMockDetection(imageSrc: string, villageName: string): Promise<SwachhAuditReport> {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Select random mock scenario to make it fun and diverse!
        const scenarios = [
          {
            cleanlinessScore: 35,
            severity: 'critical' as const,
            notes: 'High concentration of organic decay and sewage run-off, creating mosquito breeding grounds.',
            detections: [
              { id: 'det-m-1', label: 'Sewage', confidence: 0.91, category: 'sanitation' as const, bbox: { x: 5, y: 40, width: 85, height: 45 } },
              { id: 'det-m-2', label: 'Stagnant Water', confidence: 0.88, category: 'sanitation' as const, bbox: { x: 20, y: 55, width: 60, height: 30 } },
              { id: 'det-m-3', label: 'Organic Waste', confidence: 0.82, category: 'wet' as const, bbox: { x: 65, y: 15, width: 25, height: 25 } },
              { id: 'det-m-4', label: 'Food Waste', confidence: 0.74, category: 'wet' as const, bbox: { x: 45, y: 20, width: 15, height: 15 } },
              { id: 'det-m-5', label: 'Plastic Bottle', confidence: 0.79, category: 'dry' as const, bbox: { x: 10, y: 25, width: 12, height: 18 } },
            ],
          },
          {
            cleanlinessScore: 58,
            severity: 'high' as const,
            notes: 'Solid dry litter and discarded metal parts obstructing the village pathway.',
            detections: [
              { id: 'det-m-1', label: 'Metal Can', confidence: 0.89, category: 'dry' as const, bbox: { x: 15, y: 50, width: 20, height: 20 } },
              { id: 'det-m-2', label: 'Plastic Wrapper', confidence: 0.84, category: 'dry' as const, bbox: { x: 40, y: 65, width: 15, height: 10 } },
              { id: 'det-m-3', label: 'Paper', confidence: 0.78, category: 'dry' as const, bbox: { x: 60, y: 45, width: 25, height: 20 } },
              { id: 'det-m-4', label: 'Glass Shard', confidence: 0.71, category: 'dry' as const, bbox: { x: 5, y: 70, width: 10, height: 12 } },
              { id: 'det-m-5', label: 'Electronic Waste', confidence: 0.83, category: 'hazardous' as const, bbox: { x: 75, y: 60, width: 18, height: 22 } },
            ],
          },
          {
            cleanlinessScore: 74,
            severity: 'medium' as const,
            notes: 'Minor dry litter scattered near the garbage bin. General sanitation is acceptable.',
            detections: [
              { id: 'det-m-1', label: 'Cardboard Box', confidence: 0.92, category: 'dry' as const, bbox: { x: 30, y: 30, width: 40, height: 40 } },
              { id: 'det-m-2', label: 'Plastic Bottle', confidence: 0.87, category: 'dry' as const, bbox: { x: 15, y: 70, width: 12, height: 20 } },
              { id: 'det-m-3', label: 'Paper Bag', confidence: 0.76, category: 'dry' as const, bbox: { x: 70, y: 65, width: 18, height: 22 } },
            ],
          },
          {
            cleanlinessScore: 94,
            severity: 'low' as const,
            notes: 'Area is very clean. Only a tiny paper scrap detected, which does not pose a concern.',
            detections: [
              { id: 'det-m-1', label: 'Paper Scrap', confidence: 0.62, category: 'dry' as const, bbox: { x: 50, y: 80, width: 8, height: 6 } },
            ],
          },
        ];

        // Choose a random scenario
        const scenarioIndex = Math.floor(Math.random() * scenarios.length);
        const selected = scenarios[scenarioIndex];

        const report: SwachhAuditReport = {
          id: `report-${Date.now()}`,
          timestamp: new Date().toISOString(),
          imageSrc,
          villageName: villageName || VILLAGES[Math.floor(Math.random() * VILLAGES.length)],
          cleanlinessScore: selected.cleanlinessScore,
          severity: selected.severity,
          objectCount: selected.detections.length,
          notes: selected.notes,
          detections: selected.detections,
        };

        // Save immediately to history
        this.saveReport(report);
        resolve(report);
      }, 2000);
    });
  },
};
