import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles, Trash2, Heart, Droplet, Award, Lock, CheckCircle2 } from 'lucide-react';
import { AchievementBadge } from '../types';

interface AchievementSystemProps {
  achievements: AchievementBadge[];
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Sparkles: Sparkles,
  Trash2: Trash2,
  Heart: Heart,
  Droplet: Droplet,
  Award: Award,
};

export function AchievementSystem({ achievements }: AchievementSystemProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const percentUnlocked = Math.round((unlockedCount / totalCount) * 100);

  return (
    <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <Award className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-50">
                Village Cleanliness Milestones
              </CardTitle>
            </div>
            <CardDescription className="text-xs mt-0.5">
              Gamified badges unlocked by local actions and checklist completions
            </CardDescription>
          </div>
          
          {/* Badge score tracker */}
          <div className="flex items-center space-x-3 bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/50 dark:border-neutral-800/80 rounded-lg px-3 py-1.5 shrink-0 self-start sm:self-center">
            <div className="text-right">
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Unlocked</p>
              <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">{unlockedCount} / {totalCount} Badges</p>
            </div>
            <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 flex items-center justify-center text-xs font-bold text-blue-600 dark:text-blue-400">
              {percentUnlocked}%
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {achievements.map(badge => {
            const Icon = ICON_MAP[badge.iconName] || Award;
            return (
              <div
                key={badge.id}
                className={`relative border rounded-xl p-5 flex flex-col items-center text-center justify-between transition-all duration-300 select-none ${
                  badge.unlocked
                    ? 'border-blue-200 bg-blue-50/20 shadow-xs hover:shadow-md hover:border-blue-300 dark:border-blue-900/40 dark:bg-blue-950/10'
                    : 'border-neutral-200 bg-neutral-50/30 opacity-50 dark:border-neutral-800 dark:bg-neutral-950/25'
                }`}
              >
                {/* Locked overlay key */}
                {!badge.unlocked && (
                  <div className="absolute top-3 right-3 text-neutral-400 dark:text-neutral-600">
                    <Lock className="w-3.5 h-3.5" />
                  </div>
                )}
                {badge.unlocked && (
                  <div className="absolute top-3 right-3 text-emerald-600 dark:text-emerald-500">
                    <CheckCircle2 className="w-4 h-4 fill-emerald-50 dark:fill-emerald-950/20" />
                  </div>
                )}

                {/* Badge Icon Circle */}
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xs transition-all duration-300 ${
                    badge.unlocked
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 text-white hover:scale-105'
                      : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                </div>

                {/* Details */}
                <div className="mt-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-150 tracking-tight leading-tight">
                      {badge.title}
                    </h4>
                    <p className="text-[10px] text-neutral-500 dark:text-neutral-450 leading-relaxed mt-1">
                      {badge.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-neutral-150/60 dark:border-neutral-800/80">
                    <p className="text-[9px] font-semibold text-neutral-450 dark:text-neutral-500 uppercase tracking-wider">
                      Requirement
                    </p>
                    <p className="text-[10px] font-medium text-neutral-700 dark:text-neutral-350 mt-0.5 leading-snug">
                      {badge.requirement}
                    </p>
                    {badge.unlocked && badge.unlockedAt && (
                      <span className="block mt-2 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                        Earned {badge.unlockedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
