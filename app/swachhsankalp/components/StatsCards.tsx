import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Calendar, ClipboardCheck, Users, PlusCircle, Award } from 'lucide-react';
import { DashboardStats } from '../types';

interface StatsCardsProps {
  stats: DashboardStats;
  villageScore: number;
  onReportWaste: () => void;
}

export function StatsCards({ stats, villageScore, onReportWaste }: StatsCardsProps) {
  const cards = [
    {
      title: 'Village Cleanliness',
      value: `${villageScore}%`,
      description: 'Calculated from completed tasks',
      icon: Award,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Total Waste Reports',
      value: stats.wasteReportsCount.toString(),
      description: 'Active reports in the system',
      icon: Trash2,
      color: 'text-rose-600 dark:text-rose-400',
      bgColor: 'bg-rose-50 dark:bg-rose-950/40',
      action: (
        <Button
          size="sm"
          variant="outline"
          onClick={onReportWaste}
          className="mt-2 text-xs border-rose-200 text-rose-700 hover:bg-rose-50 dark:border-rose-900 dark:text-rose-400 dark:hover:bg-rose-950/30 flex items-center space-x-1"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Report Waste</span>
        </Button>
      ),
    },
    {
      title: 'Active Campaigns',
      value: '3',
      description: 'Ongoing cleanup projects',
      icon: Calendar,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Checklist Tasks',
      value: `${stats.totalChecklistTasks} Tasks`,
      description: 'Cleanliness checklist activities',
      icon: ClipboardCheck,
      color: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      title: 'Volunteers Joined',
      value: stats.volunteersParticipated.toString(),
      description: 'Total community support',
      icon: Users,
      color: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50 dark:bg-indigo-950/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Card
            key={idx}
            className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-250 flex flex-col justify-between"
          >
            <CardContent className="p-5 flex flex-col justify-between h-full">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {card.title}
                  </p>
                  <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-50 mt-1">
                    {card.value}
                  </h3>
                </div>
                <div className={`p-2 rounded-lg ${card.bgColor} ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-normal">
                  {card.description}
                </p>
                {card.action && card.action}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
