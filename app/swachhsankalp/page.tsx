'use client';

import React from 'react';
import { PageHeader } from '@/components/common/page-header';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { StatsCards } from './components/StatsCards';
import { CleanlinessScore } from './components/CleanlinessScore';
import { ChecklistManager } from './components/ChecklistManager';
import { useSwachhData } from './hooks/useSwachhData';
import { Loader2, Trophy, Users, BarChart3, ShieldAlert } from 'lucide-react';

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
        {/* Left 2 Columns on desktop: Checklist */}
        <div className="lg:col-span-2">
          <ChecklistManager
            tasks={tasks}
            onToggle={toggleTask}
            onAddTask={addTask}
          />
        </div>

        {/* Right Column on desktop: Score Gauge */}
        <div className="lg:col-span-1">
          <CleanlinessScore score={villageScore} />
        </div>
      </div>

      {/* Row 3: Upcoming Modules Preview (Days 2 & 3 Development) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
        {/* Ward Leaderboard Preview */}
        <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-bl-lg uppercase tracking-wider">
            Day 2 Release
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>Ward Leaderboard</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Check ranking of different village wards
            </CardDescription>
          </CardHeader>
          <CardContent className="h-44 flex flex-col justify-between pt-4">
            <div className="space-y-3 opacity-40">
              <div className="flex justify-between items-center text-xs">
                <span>Rank 1: Ward 2 (Shanti Nagar)</span>
                <span className="font-semibold text-emerald-600">95%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full" />
              
              <div className="flex justify-between items-center text-xs">
                <span>Rank 2: Ward 1 (Kalyanpur)</span>
                <span className="font-semibold text-blue-600">88%</span>
              </div>
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full" />
            </div>
            <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md p-2 bg-neutral-50/50 dark:bg-neutral-900/30 text-center">
              <span className="text-[11px] text-neutral-500 font-medium">
                Live leaderboards and interactive ward badges will activate in Commit 2.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Campaign Tracker Preview */}
        <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-bl-lg uppercase tracking-wider">
            Day 2 Release
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
              <Users className="w-4 h-4 text-indigo-500" />
              <span>Village Campaign Tracker</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Monitor active cleanups & volunteer groups
            </CardDescription>
          </CardHeader>
          <CardContent className="h-44 flex flex-col justify-between pt-4">
            <div className="space-y-3 opacity-40">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate">Sunday Lake Cleanup</span>
                <span className="text-neutral-400">24 Joined</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium truncate">Plastic-Free Market</span>
                <span className="text-neutral-400">18 Joined</span>
              </div>
            </div>
            <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md p-2 bg-neutral-50/50 dark:bg-neutral-900/30 text-center">
              <span className="text-[11px] text-neutral-500 font-medium">
                Interactive volunteer joining & event progress bars will activate in Commit 2.
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Progress Charts & Achievements Preview */}
        <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-[10px] font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 rounded-bl-lg uppercase tracking-wider">
            Day 3 Release
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-emerald-500" />
              <span>Charts & Badges</span>
            </CardTitle>
            <CardDescription className="text-xs">
              Weekly progress, comparisons, and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="h-44 flex flex-col justify-between pt-4">
            <div className="space-y-3 opacity-40">
              <div className="flex justify-between items-center text-xs">
                <span>Plastic Free Champion</span>
                <span className="text-emerald-500 font-semibold">Unlocked</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span>Green Village Award</span>
                <span className="text-neutral-400 font-semibold">Locked</span>
              </div>
            </div>
            <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-md p-2 bg-neutral-50/50 dark:bg-neutral-900/30 text-center">
              <span className="text-[11px] text-neutral-500 font-medium">
                SVG weekly/monthly charts & custom badge logic will activate in Commit 3.
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
