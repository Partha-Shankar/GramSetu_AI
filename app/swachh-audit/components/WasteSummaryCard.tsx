'use client';

import React from 'react';
import { DetectionResult } from '../types/types';
import { Trash2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { cn } from '@/utils/cn';

interface WasteSummaryCardProps {
  detections: DetectionResult[];
  highlightedId?: string | null;
  onHoverDetection?: (id: string | null) => void;
}

const CATEGORY_STYLES = {
  dry: {
    badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/30',
    indicator: 'bg-blue-500',
  },
  wet: {
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    indicator: 'bg-emerald-500',
  },
  hazardous: {
    badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    indicator: 'bg-amber-500',
  },
  sanitation: {
    badge: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900/30',
    indicator: 'bg-purple-500',
  },
};

export function WasteSummaryCard({
  detections,
  highlightedId,
  onHoverDetection,
}: WasteSummaryCardProps) {
  // Compute tallies
  const counts = detections.reduce(
    (acc, cur) => {
      acc[cur.category] = (acc[cur.category] || 0) + 1;
      return acc;
    },
    { dry: 0, wet: 0, hazardous: 0, sanitation: 0 }
  );

  const getRecommendation = () => {
    if (detections.length === 0) {
      return {
        text: 'The area is clean! Maintain standard housekeeping. No immediate action required.',
        icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
        bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100 dark:border-emerald-900/30',
      };
    }

    const hasSanitation = counts.sanitation > 0;
    const hasHazardous = counts.hazardous > 0;

    if (hasSanitation && hasHazardous) {
      return {
        text: 'CRITICAL ACTION REQUIRED: Exposure to sewage/stagnant water and toxic waste. Clear blockages, spray larvicide, and segregate batteries/e-waste immediately to protect groundwater.',
        icon: <AlertTriangle className="w-5 h-5 text-red-500" />,
        bgColor: 'bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30',
      };
    } else if (hasSanitation) {
      return {
        text: 'HIGH PRIORITY: Stagnant liquid waste detected. Water-logging creates mosquito vector breeding risks. Arrange drainage clearing and apply bleach powder.',
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        bgColor: 'bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30',
      };
    } else if (hasHazardous) {
      return {
        text: 'WARNING: Hazardous waste detected. Toxic materials need specialized containment. Direct sanitation staff to collect separately.',
        icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
        bgColor: 'bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30',
      };
    }

    return {
      text: 'SOLID WASTE ACTION: Dry and wet litter present. Schedule a cleanup drive. Ensure local community bins are emptied into composting pits.',
      icon: <Trash2 className="w-5 h-5 text-blue-500" />,
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-900/30',
    };
  };

  const recommendation = getRecommendation();

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-md">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 p-4">
        <CardTitle className="text-sm font-semibold flex items-center space-x-1.5">
          <Trash2 className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <span>Waste Summary & Diagnostics</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {/* Category Tallies */}
        <div className="grid grid-cols-4 gap-2 text-center">
          {(['dry', 'wet', 'hazardous', 'sanitation'] as const).map((cat) => {
            const style = CATEGORY_STYLES[cat];
            return (
              <div
                key={cat}
                className="bg-neutral-50 dark:bg-neutral-900 p-2.5 rounded-lg border border-neutral-150 dark:border-neutral-800 flex flex-col justify-between"
              >
                <div className="flex items-center justify-center space-x-1.5 mb-1">
                  <span className={cn('w-2 h-2 rounded-full', style.indicator)} />
                  <span className="text-[10px] font-semibold uppercase text-neutral-400 tracking-wider">
                    {cat}
                  </span>
                </div>
                <span className="text-lg font-bold text-neutral-800 dark:text-neutral-100 leading-none">
                  {counts[cat]}
                </span>
              </div>
            );
          })}
        </div>

        {/* Detailed Recommendations */}
        <div className={cn('p-3 rounded-lg flex items-start space-x-2.5', recommendation.bgColor)}>
          <div className="shrink-0 mt-0.5">{recommendation.icon}</div>
          <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
            {recommendation.text}
          </p>
        </div>

        {/* Object list */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
            Detected Objects ({detections.length})
          </h4>

          {detections.length === 0 ? (
            <div className="text-center py-4 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg">
              <span className="text-xs text-neutral-400">No objects detected. Site is clear.</span>
            </div>
          ) : (
            <div className="max-h-[160px] overflow-y-auto space-y-1.5 pr-1 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
              {detections.map((det) => {
                const style = CATEGORY_STYLES[det.category] || CATEGORY_STYLES.dry;
                const isHighlighted = highlightedId === det.id;

                return (
                  <div
                    key={det.id}
                    className={cn(
                      'flex items-center justify-between p-2 rounded-md border text-xs transition-all duration-150 cursor-default',
                      isHighlighted
                        ? 'bg-blue-50/50 border-blue-300 shadow-xs dark:bg-blue-950/20 dark:border-blue-800'
                        : 'bg-white dark:bg-neutral-950 border-neutral-100 dark:border-neutral-900 hover:border-neutral-250 dark:hover:border-neutral-850'
                    )}
                    onMouseEnter={() => onHoverDetection && onHoverDetection(det.id)}
                    onMouseLeave={() => onHoverDetection && onHoverDetection(null)}
                  >
                    <span className="font-semibold text-neutral-850 dark:text-neutral-205">
                      {det.label}
                    </span>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono text-neutral-400">
                        Conf: {Math.round(det.confidence * 100)}%
                      </span>
                      <span className={cn('px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase', style.badge)}>
                        {det.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
