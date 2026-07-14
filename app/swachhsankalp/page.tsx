'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatsCards } from './components/StatsCards';
import { CleanlinessScore } from './components/CleanlinessScore';
import { ChecklistManager } from './components/ChecklistManager';
import { WardLeaderboard } from './components/WardLeaderboard';
import { CampaignTracker } from './components/CampaignTracker';
import { useSwachhData } from './hooks/useSwachhData';
import { Loader2, BarChart3 } from 'lucide-react';

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

      {/* Row 3: Upcoming Modules Preview (Day 3 Development) */}
      <div className="pt-2">
        {/* Progress Charts & Achievements Preview */}
        <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-bl-lg uppercase tracking-wider">
            Day 3 Release
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>SVG Progress Charts & Achievements</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Weekly progress charts, monthly trends, and village milestone awards
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1 opacity-45">
              <div className="text-xs">
                <span className="block text-neutral-400 font-medium">Plastic Free Champion</span>
                <span className="text-emerald-600 font-bold mt-0.5 block">Unlocked</span>
              </div>
              <div className="text-xs">
                <span className="block text-neutral-400 font-medium">Zero Litter Ward</span>
                <span className="text-emerald-600 font-bold mt-0.5 block">Unlocked</span>
              </div>
              <div className="text-xs">
                <span className="block text-neutral-400 font-medium">Community Hero</span>
                <span className="text-emerald-600 font-bold mt-0.5 block">Unlocked</span>
              </div>
              <div className="text-xs">
                <span className="block text-neutral-400 font-medium">Green Village Award</span>
                <span className="text-neutral-400 font-bold mt-0.5 block">Locked</span>
              </div>
            </div>
            <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md p-3 bg-neutral-50/50 dark:bg-neutral-900/30 md:max-w-xs text-center shrink-0">
              <span className="text-[11px] text-neutral-500 font-medium">
                Live interactive charts (weekly progress, ward comparisons) and the full achievements system will activate in the next commit.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

