export interface ChecklistTask {
  id: string;
  title: string;
  completed: boolean;
  scoreImpact: number; // weight contribution
  category: string;
}

export interface Campaign {
  id: string;
  title: string;
  status: 'ongoing' | 'upcoming' | 'completed';
  progress: number; // 0-100
  volunteersJoined: number;
  targetVolunteers: number;
  userJoined: boolean;
  date: string;
}

export interface WardScore {
  id: string;
  name: string;
  score: number; // 0-100
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface DashboardStats {
  wasteReportsCount: number;
  campaignsCompleted: number;
  volunteersParticipated: number;
  averageVillageScore: number;
  totalChecklistTasks: number;
}
