'use client';

import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Award, ShieldAlert, Sparkles } from 'lucide-react';
import { cn } from '@/utils/cn';

interface CleanlinessScoreCardProps {
  score: number;
}

export function CleanlinessScoreCard({ score }: CleanlinessScoreCardProps) {
  // Score ratings configs
  const getRating = (val: number) => {
    if (val >= 90) {
      return {
        label: 'Excellent',
        grade: 'A+',
        color: 'text-emerald-500',
        stroke: 'stroke-emerald-500',
        bg: 'bg-emerald-500/10',
        description: 'Outstanding sanitation levels. Surroundings are clean and well-maintained.',
        icon: Sparkles,
      };
    }
    if (val >= 75) {
      return {
        label: 'Good',
        grade: 'B',
        color: 'text-blue-500',
        stroke: 'stroke-blue-500',
        bg: 'bg-blue-500/10',
        description: 'Satisfactory sanitation levels. Minimal scattered litter detected.',
        icon: Award,
      };
    }
    if (val >= 60) {
      return {
        label: 'Fair',
        grade: 'C',
        color: 'text-amber-500',
        stroke: 'stroke-amber-500',
        bg: 'bg-amber-500/10',
        description: 'Moderate sanitation levels. Regular housekeeping and clearing recommended.',
        icon: Award,
      };
    }
    if (val >= 40) {
      return {
        label: 'Poor',
        grade: 'D',
        color: 'text-orange-500',
        stroke: 'stroke-orange-500',
        bg: 'bg-orange-500/10',
        description: 'Low sanitation levels. Substantial waste clusters requiring scheduled clearing.',
        icon: ShieldAlert,
      };
    }
    return {
      label: 'Critical',
      grade: 'F',
      color: 'text-red-500',
      stroke: 'stroke-red-500',
      bg: 'bg-red-500/10',
      description: 'Critical sanitation levels. High volume waste accumulation requiring immediate cleaning.',
      icon: ShieldAlert,
    };
  };

  const rating = getRating(score);

  // SVG circular properties
  const radius = 50;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <Card className="border-neutral-200 dark:border-neutral-800 shadow-md">
      <CardHeader className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 p-4">
        <CardTitle className="text-sm font-semibold flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
          <span>Cleanliness Metrics</span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-6 flex flex-col items-center text-center">
        {/* SVG Circle Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center mb-4">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-neutral-100 dark:stroke-neutral-850 fill-none"
              strokeWidth={strokeWidth}
            />
            {/* Animated Progress Circle */}
            <circle
              cx="72"
              cy="72"
              r={radius}
              className={cn('fill-none transition-all duration-1000 ease-out', rating.stroke)}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
            />
          </svg>

          {/* Internal Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-50 leading-none">
              {score}
            </span>
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mt-1">
              Score (0-100)
            </span>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-1.5 max-w-xs">
          <div className="flex items-center justify-center space-x-2">
            <span className={cn('px-2.5 py-0.5 rounded text-xs font-extrabold uppercase tracking-wide', rating.bg, rating.color)}>
              Rating: {rating.label}
            </span>
            <span className="text-neutral-300 dark:text-neutral-700">|</span>
            <span className="text-sm font-bold text-neutral-800 dark:text-neutral-200">
              Grade {rating.grade}
            </span>
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed px-2">
            {rating.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
