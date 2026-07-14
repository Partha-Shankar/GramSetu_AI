import React, { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Trophy, Medal, Award, Star } from 'lucide-react';
import { WardScore } from '../types';

interface WardLeaderboardProps {
  wards: WardScore[];
}

export function WardLeaderboard({ wards }: WardLeaderboardProps) {
  // Sort wards dynamically by score descending
  const sortedWards = useMemo(() => {
    return [...wards].sort((a, b) => b.score - a.score);
  }, [wards]);

  // Rank badge styling helpers
  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400 font-bold border border-amber-200 dark:border-amber-900">
            <Trophy className="w-3.5 h-3.5" />
          </div>
        );
      case 2:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-bold border border-slate-200 dark:border-slate-700">
            <Medal className="w-3.5 h-3.5" />
          </div>
        );
      case 3:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/30 dark:text-orange-400 font-bold border border-orange-200 dark:border-orange-900">
            <Award className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-neutral-50 text-neutral-500 dark:bg-neutral-900 dark:text-neutral-500 text-xs font-semibold border border-neutral-100 dark:border-neutral-800">
            {rank}
          </div>
        );
    }
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-500 dark:bg-emerald-600';
    if (score >= 80) return 'bg-blue-500 dark:bg-blue-600';
    if (score >= 70) return 'bg-amber-500 dark:bg-amber-600';
    return 'bg-rose-500 dark:bg-rose-600';
  };

  const getScoreBadgeColor = (score: number) => {
    if (score >= 90) return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
    if (score >= 80) return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
    if (score >= 70) return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
    return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900';
  };

  return (
    <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs h-full">
      <CardHeader className="pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-50">
            Ward Cleanliness Leaderboard
          </CardTitle>
        </div>
        <CardDescription className="text-xs">
          Rankings and active cleanliness indices of village wards
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 dark:bg-neutral-900/10 border-b border-neutral-100 dark:border-neutral-900">
                <th className="py-3 px-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 w-16 text-center">
                  Rank
                </th>
                <th className="py-3 px-4 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  Ward Details
                </th>
                <th className="py-3 px-4 text-xs font-bold text-neutral-500 dark:text-neutral-400 w-44">
                  Cleanliness Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-900">
              {sortedWards.map((ward, index) => {
                const rank = index + 1;
                return (
                  <tr
                    key={ward.id}
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors"
                  >
                    <td className="py-4 px-4 align-middle text-center">
                      <div className="flex justify-center">{getRankBadge(rank)}</div>
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <span className="text-sm font-semibold text-neutral-800 dark:text-neutral-200">
                        {ward.name}
                      </span>
                      {rank === 1 && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400">
                          <Star className="w-2.5 h-2.5 fill-current mr-0.5" />
                          Top Performer
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 align-middle">
                      <div className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <div className={`px-2 py-0.5 rounded border font-bold text-[10px] ${getScoreBadgeColor(ward.score)}`}>
                            {ward.score}%
                          </div>
                        </div>
                        <div className="w-full bg-neutral-100 dark:bg-neutral-850 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${getProgressBarColor(ward.score)}`}
                            style={{ width: `${ward.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
