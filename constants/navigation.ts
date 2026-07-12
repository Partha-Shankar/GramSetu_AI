import { ROUTES } from './routes';

export interface NavigationItem {
  title: string;
  href: string;
  iconName: string; // Used to dynamically render Lucide React icons
  description: string;
}

export const SIDEBAR_ITEMS: NavigationItem[] = [
  {
    title: 'Dashboard',
    href: ROUTES.DASHBOARD,
    iconName: 'LayoutDashboard',
    description: 'Central overview of rural resource indicators.',
  },
  {
    title: 'SwachhAudit',
    href: ROUTES.SWACHH_AUDIT,
    iconName: 'ClipboardCheck',
    description: 'Offline sanitation monitoring and reporting.',
  },
  {
    title: 'JalDrishti',
    href: ROUTES.JAL_DRISHTI,
    iconName: 'Droplet',
    description: 'Water body analysis and tracking.',
  },
  {
    title: 'GramLipi',
    href: ROUTES.GRAM_LIPI,
    iconName: 'FileText',
    description: 'On-device OCR and document translation.',
  },
  {
    title: 'SwachhSankalp',
    href: ROUTES.SWACHH_SANKALP,
    iconName: 'Goal',
    description: 'Community developmental planning and targets.',
  },
];

export const SETTINGS_ITEM: NavigationItem = {
  title: 'Settings',
  href: ROUTES.SETTINGS,
  iconName: 'Settings',
  description: 'Device preferences and database sync configurations.',
};
