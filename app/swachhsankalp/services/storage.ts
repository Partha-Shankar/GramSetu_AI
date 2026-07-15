import { ChecklistTask, Campaign, WardScore, AchievementBadge } from '../types';

const STORAGE_KEYS = {
  CHECKLIST: 'swachh_sankalp_checklist',
  CAMPAIGNS: 'swachh_sankalp_campaigns',
  WARDS: 'swachh_sankalp_wards',
  ACHIEVEMENTS: 'swachh_sankalp_achievements',
  WASTE_REPORTS: 'swachh_sankalp_waste_reports',
};

// Default Checklist Tasks
const DEFAULT_CHECKLIST: ChecklistTask[] = [
  { id: 'task-1', title: 'Clean Temple Area', completed: true, scoreImpact: 15, category: 'Community' },
  { id: 'task-2', title: 'Remove Plastic Waste from Main Road', completed: true, scoreImpact: 20, category: 'Waste Management' },
  { id: 'task-3', title: 'Clean Main Drainage Channel', completed: false, scoreImpact: 20, category: 'Sanitation' },
  { id: 'task-4', title: 'Plant 50 Saplings in Ward 2', completed: true, scoreImpact: 15, category: 'Environment' },
  { id: 'task-5', title: 'Conduct Cleanliness Awareness Program', completed: true, scoreImpact: 15, category: 'Awareness' },
  { id: 'task-6', title: 'Set up Wet & Dry Segregation Bins', completed: true, scoreImpact: 15, category: 'Waste Management' },
];

// Default Campaigns
const DEFAULT_CAMPAIGNS: Campaign[] = [
  {
    id: 'camp-1',
    title: 'Sunday Lake Cleanup Drive',
    status: 'ongoing',
    progress: 65,
    volunteersJoined: 24,
    targetVolunteers: 40,
    userJoined: false,
    date: 'Next Sunday, 8:00 AM',
  },
  {
    id: 'camp-2',
    title: 'Plastic-Free Market Campaign',
    status: 'ongoing',
    progress: 40,
    volunteersJoined: 18,
    targetVolunteers: 30,
    userJoined: true,
    date: 'Every Saturday, 10:00 AM',
  },
  {
    id: 'camp-3',
    title: 'Primary Drain De-clogging',
    status: 'completed',
    progress: 100,
    volunteersJoined: 15,
    targetVolunteers: 15,
    userJoined: true,
    date: 'Last Friday',
  },
  {
    id: 'camp-4',
    title: 'School Campus Tree Plantation',
    status: 'upcoming',
    progress: 0,
    volunteersJoined: 8,
    targetVolunteers: 25,
    userJoined: false,
    date: 'July 25, 9:00 AM',
  },
];

// Default Ward Cleanliness Scores
const DEFAULT_WARDS: WardScore[] = [
  { id: 'ward-2', name: 'Ward 2 (Shanti Nagar)', score: 95 },
  { id: 'ward-1', name: 'Ward 1 (Kalyanpur)', score: 88 },
  { id: 'ward-3', name: 'Ward 3 (Hanuman Basti)', score: 82 },
  { id: 'ward-4', name: 'Ward 4 (Subhash Nagar)', score: 74 },
  { id: 'ward-5', name: 'Ward 5 (Patel Chowk)', score: 65 },
];

// Default Achievements
const DEFAULT_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'badge-1',
    title: 'Plastic Free Champion',
    description: 'Volunteer in the Plastic-Free Market campaign to stop litter.',
    iconName: 'Sparkles',
    unlocked: true,
    unlockedAt: '2026-07-10',
    requirement: 'Join Plastic-Free Market campaign',
  },
  {
    id: 'badge-2',
    title: 'Zero Litter Ward',
    description: 'Ensure at least one ward attains a score above 90%.',
    iconName: 'Trash2',
    unlocked: true,
    unlockedAt: '2026-07-12',
    requirement: 'Have a ward with score >= 90%',
  },
  {
    id: 'badge-3',
    title: 'Community Hero',
    description: 'Join two or more active campaigns as a volunteer.',
    iconName: 'Heart',
    unlocked: true,
    unlockedAt: '2026-07-12',
    requirement: 'Volunteer in at least 2 campaigns',
  },
  {
    id: 'badge-4',
    title: 'Clean Water Champion',
    description: 'Volunteer in the Sunday Lake Cleanup Drive.',
    iconName: 'Droplet',
    unlocked: false,
    requirement: 'Join Sunday Lake Cleanup campaign',
  },
  {
    id: 'badge-5',
    title: 'Green Village Award',
    description: 'Complete 100% of tasks in the developmental checklist.',
    iconName: 'Award',
    unlocked: false,
    requirement: 'Complete all checklist activities',
  },
];

// Helper check for browser window
const isClient = () => typeof window !== 'undefined';

export const storage = {
  getChecklist: (): ChecklistTask[] => {
    if (!isClient()) return DEFAULT_CHECKLIST;
    const stored = localStorage.getItem(STORAGE_KEYS.CHECKLIST);
    return stored ? JSON.parse(stored) : DEFAULT_CHECKLIST;
  },
  saveChecklist: (tasks: ChecklistTask[]) => {
    if (isClient()) localStorage.setItem(STORAGE_KEYS.CHECKLIST, JSON.stringify(tasks));
  },

  getCampaigns: (): Campaign[] => {
    if (!isClient()) return DEFAULT_CAMPAIGNS;
    const stored = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return stored ? JSON.parse(stored) : DEFAULT_CAMPAIGNS;
  },
  saveCampaigns: (campaigns: Campaign[]) => {
    if (isClient()) localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  },

  getWards: (): WardScore[] => {
    if (!isClient()) return DEFAULT_WARDS;
    const stored = localStorage.getItem(STORAGE_KEYS.WARDS);
    return stored ? JSON.parse(stored) : DEFAULT_WARDS;
  },
  saveWards: (wards: WardScore[]) => {
    if (isClient()) localStorage.setItem(STORAGE_KEYS.WARDS, JSON.stringify(wards));
  },

  getAchievements: (): AchievementBadge[] => {
    if (!isClient()) return DEFAULT_ACHIEVEMENTS;
    const stored = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
    return stored ? JSON.parse(stored) : DEFAULT_ACHIEVEMENTS;
  },
  saveAchievements: (achievements: AchievementBadge[]) => {
    if (isClient()) localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
  },

  getWasteReportsCount: (): number => {
    if (!isClient()) return 14;
    const stored = localStorage.getItem(STORAGE_KEYS.WASTE_REPORTS);
    return stored ? parseInt(stored, 10) : 14;
  },
  saveWasteReportsCount: (count: number) => {
    if (isClient()) localStorage.setItem(STORAGE_KEYS.WASTE_REPORTS, count.toString());
  },
};
