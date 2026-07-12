import { ROUTES } from './routes';

export interface ModuleMetadata {
  id: string;
  name: string;
  description: string;
  path: string;
  iconName: string;
  developer: string;
  status: 'planning' | 'development' | 'testing' | 'completed';
}

export const MODULES_METADATA: ModuleMetadata[] = [
  {
    id: 'swachhaudit',
    name: 'SwachhAudit',
    description: 'Offline-first sanitation and waste management audits using on-device computer vision.',
    path: ROUTES.SWACHH_AUDIT,
    iconName: 'ClipboardCheck',
    developer: 'Developer 2',
    status: 'planning',
  },
  {
    id: 'jaldrishti',
    name: 'JalDrishti',
    description: 'On-device water resource contamination visual monitoring and predictions.',
    path: ROUTES.JAL_DRISHTI,
    iconName: 'Droplet',
    developer: 'Developer 2',
    status: 'planning',
  },
  {
    id: 'gramlipi',
    name: 'GramLipi',
    description: 'OCR processing, local translation, and summary generation for local records.',
    path: ROUTES.GRAM_LIPI,
    iconName: 'FileText',
    developer: 'Developer 3',
    status: 'planning',
  },
  {
    id: 'swachhsankalp',
    name: 'SwachhSankalp',
    description: 'Community roadmap tracker for local governance goals and village improvement targets.',
    path: ROUTES.SWACHH_SANKALP,
    iconName: 'Goal',
    developer: 'Developer 4',
    status: 'planning',
  },
];
