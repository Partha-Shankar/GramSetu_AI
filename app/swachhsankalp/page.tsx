'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { StatsCards } from './components/StatsCards';
import { CleanlinessScore } from './components/CleanlinessScore';
import { ChecklistManager } from './components/ChecklistManager';
import { WardLeaderboard } from './components/WardLeaderboard';
import { CampaignTracker } from './components/CampaignTracker';
import { ProgressCharts } from './components/ProgressCharts';
import { AchievementSystem } from './components/AchievementSystem';
import { useSwachhData } from './hooks/useSwachhData';
import { Loader2 } from 'lucide-react';

export default function SwachhSankalpPage() {
  const {
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
  } = useSwachhData();

  if (!isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">Loading SwachhSankalp dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-6 py-4">
      {/* Page Header */}
      <PageHeader
        title="SwachhSankalp Dashboard"
        description="Community cleanliness monitoring, planning checklists, active campaigns, and ward achievements."
      />

      {/* Stats Summary Cards */}
      <StatsCards
        stats={stats}
        villageScore={villageScore}
        onReportWaste={reportWaste}
      />

      {/* Main Interactive Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns on desktop: Checklist & Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <ChecklistManager
            tasks={tasks}
            onToggle={toggleTask}
            onAddTask={addTask}
          />
          
          <CampaignTracker
            campaigns={campaigns}
            onJoin={joinCampaign}
          />
        </div>

        {/* Right Column on desktop: Score Gauge & Leaderboard */}
        <div className="lg:col-span-1 space-y-6">
          <CleanlinessScore score={villageScore} />
          
          <WardLeaderboard wards={wards} />
        </div>
      </div>

      {/* Row 3: Progress Charts & Achievements */}
      <div className="space-y-6">
        <ProgressCharts
          wards={wards}
          campaigns={campaigns}
          villageScore={villageScore}
        />
        
        <AchievementSystem achievements={achievements} />
      </div>
    </div>
  );
}
