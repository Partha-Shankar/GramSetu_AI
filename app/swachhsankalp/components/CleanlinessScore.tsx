import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ShieldCheck, TrendingUp, AlertCircle } from 'lucide-react';

interface CleanlinessScoreProps {
  score: number;
}

export function CleanlinessScore({ score }: CleanlinessScoreProps) {
  // SVG Circle Calculations
  const radius = 60;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Status mapping
  let statusText = 'Needs Work';
  let statusColor = 'text-rose-600 bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900';
  let statusIcon = AlertCircle;
  let summary = 'Immediate intervention needed to clean community common areas.';

  if (score >= 90) {
    statusText = 'Excellent';
    statusColor = 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900';
    statusIcon = ShieldCheck;
    summary = 'Outstanding local efforts! Maintain this standard across all wards.';
  } else if (score >= 75) {
    statusText = 'Good';
    statusColor = 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900';
    statusIcon = ShieldCheck;
    summary = 'Great community participation. Toggling pending checklists will push the index higher.';
  } else if (score >= 50) {
    statusText = 'Fair';
    statusColor = 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900';
    statusIcon = TrendingUp;
    summary = 'Moderate conditions. Campaigns and active volunteering are required.';
  }

  const StatusIcon = statusIcon;

  return (
    <Card className="border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-neutral-900 dark:text-neutral-50">
          Village Cleanliness Score
        </CardTitle>
        <CardDescription className="text-xs">
          Live index derived from developmental checklist
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center pt-2 pb-6">
        <div className="relative flex items-center justify-center w-40 h-40">
          {/* Circular SVG Gauge */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
              className="text-neutral-100 dark:text-neutral-800"
              strokeWidth={strokeWidth}
              stroke="currentColor"
              fill="transparent"
              r={normalizedRadius}
              cx="60"
              cy="60"
            />
            {/* Glow/Gradient Definitions */}
            <defs>
              <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#2563eb" />
              </linearGradient>
            </defs>
            {/* Foreground Circle */}
            <circle
              className="transition-all duration-500 ease-out"
              strokeWidth={strokeWidth}
              strokeDasharray={circumference + ' ' + circumference}
              style={{ strokeDashoffset }}
              strokeLinecap="round"
              stroke="url(#blueGradient)"
              fill="transparent"
              r={normalizedRadius}
              cx="60"
              cy="60"
            />
          </svg>
          {/* Inner Text Display */}
          <div className="absolute flex flex-col items-center">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 tracking-tight">
              {score}%
            </span>
            <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mt-0.5">
              Cleanliness
            </span>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        <div className={`mt-4 px-3 py-1 rounded-full border text-xs font-semibold flex items-center space-x-1.5 ${statusColor}`}>
          <StatusIcon className="w-3.5 h-3.5" />
          <span>Status: {statusText}</span>
        </div>

        <p className="mt-4 text-xs text-center text-neutral-500 dark:text-neutral-400 max-w-[240px] leading-relaxed">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
