'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChecklistTask, Campaign, WardScore, AchievementBadge, DashboardStats } from '../types';
import { storage } from '../services/storage';

export function useSwachhData() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [tasks, setTasks] = useState<ChecklistTask[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [wards, setWards] = useState<WardScore[]>([]);
  const [achievements, setAchievements] = useState<AchievementBadge[]>([]);
  const [wasteReportsCount, setWasteReportsCount] = useState(14);

  // 1. Initial Load from LocalStorage (Client Side)
  useEffect(() => {
    setTasks(storage.getChecklist());
    setCampaigns(storage.getCampaigns());
    setWards(storage.getWards());
    setAchievements(storage.getAchievements());
    setWasteReportsCount(storage.getWasteReportsCount());
    setIsLoaded(true);
  }, []);

  // 2. Derive Village Cleanliness Score from tasks
  const villageScore = useMemo(() => {
    if (tasks.length === 0) return 0;
    const totalImpact = tasks.reduce((sum, task) => sum + task.scoreImpact, 0);
    const completedImpact = tasks.reduce(
      (sum, task) => sum + (task.completed ? task.scoreImpact : 0),
      0
    );
    return totalImpact > 0 ? Math.round((completedImpact / totalImpact) * 100) : 0;
  }, [tasks]);

  // 3. Derive Statistics
  const stats = useMemo((): DashboardStats => {
    const campaignsCompleted = campaigns.filter(c => c.status === 'completed' || c.progress === 100).length;
    const volunteersParticipated = campaigns.reduce((sum, c) => sum + c.volunteersJoined, 0);
    
    // Average ward score
    const totalWardScore = wards.reduce((sum, w) => sum + w.score, 0);
    const averageVillageScore = wards.length > 0 ? Math.round(totalWardScore / wards.length) : 0;

    return {
      wasteReportsCount,
      campaignsCompleted,
      volunteersParticipated,
      averageVillageScore,
      totalChecklistTasks: tasks.length,
    };
  }, [campaigns, wards, tasks.length, wasteReportsCount]);

  // 4. Achievement Verification Engine
  const checkAchievements = useCallback(
    (currentTasks: ChecklistTask[], currentCampaigns: Campaign[], currentWards: WardScore[]) => {
      let changed = false;
      const todayStr = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });

      const updatedAchievements = achievements.map(badge => {
        if (badge.unlocked) return badge;

        let shouldUnlock = false;

        switch (badge.id) {
          case 'badge-1': // Plastic Free Champion
            // Joined Plastic Free Market (camp-2)
            shouldUnlock = currentCampaigns.some(c => c.id === 'camp-2' && c.userJoined);
            break;
          case 'badge-2': // Zero Litter Ward
            // At least one ward has score >= 90
            shouldUnlock = currentWards.some(w => w.score >= 90);
            break;
          case 'badge-3': // Community Hero
            // Joined >= 2 campaigns
            shouldUnlock = currentCampaigns.filter(c => c.userJoined).length >= 2;
            break;
          case 'badge-4': // Clean Water Champion
            // Joined Sunday Lake Cleanup (camp-1)
            shouldUnlock = currentCampaigns.some(c => c.id === 'camp-1' && c.userJoined);
            break;
          case 'badge-5': // Green Village Award
            // Complete all checklist tasks
            shouldUnlock = currentTasks.length > 0 && currentTasks.every(t => t.completed);
            break;
          default:
            break;
        }

        if (shouldUnlock) {
          changed = true;
          return {
            ...badge,
            unlocked: true,
            unlockedAt: todayStr,
          };
        }

        return badge;
      });

      if (changed) {
        setAchievements(updatedAchievements);
        storage.saveAchievements(updatedAchievements);
      }
    },
    [achievements]
  );

  // 5. Actions
  const toggleTask = useCallback(
    (id: string) => {
      const updatedTasks = tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      );
      setTasks(updatedTasks);
      storage.saveChecklist(updatedTasks);
      checkAchievements(updatedTasks, campaigns, wards);
    },
    [tasks, campaigns, wards, checkAchievements]
  );

  const addTask = useCallback(
    (title: string, category: string, scoreImpact = 15) => {
      const newTask: ChecklistTask = {
        id: `task-${Date.now()}`,
        title,
        completed: false,
        scoreImpact,
        category,
      };
      const updatedTasks = [...tasks, newTask];
      setTasks(updatedTasks);
      storage.saveChecklist(updatedTasks);
      checkAchievements(updatedTasks, campaigns, wards);
    },
    [tasks, campaigns, wards, checkAchievements]
  );

  const joinCampaign = useCallback(
    (id: string) => {
      const updatedCampaigns = campaigns.map(c => {
        if (c.id === id) {
          const newUserJoined = !c.userJoined;
          return {
            ...c,
            userJoined: newUserJoined,
            volunteersJoined: newUserJoined ? c.volunteersJoined + 1 : c.volunteersJoined - 1,
            // If they join, maybe progress increases slightly as well!
            progress: newUserJoined ? Math.min(c.progress + 5, 100) : Math.max(c.progress - 5, 0),
          };
        }
        return c;
      });
      setCampaigns(updatedCampaigns);
      storage.saveCampaigns(updatedCampaigns);
      checkAchievements(tasks, updatedCampaigns, wards);
    },
    [campaigns, tasks, wards, checkAchievements]
  );

  const reportWaste = useCallback(() => {
    const newCount = wasteReportsCount + 1;
    setWasteReportsCount(newCount);
    storage.saveWasteReportsCount(newCount);
  }, [wasteReportsCount]);

  return {
    isLoaded,
    tasks,
    campaigns,
    wards,
    achievements,
    villageScore,
    stats,
    toggleTask,
    addTask,
    joinCampaign,
    reportWaste,
  };
}
