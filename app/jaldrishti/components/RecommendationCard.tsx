import React from 'react';
import { Lightbulb } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { Recommendation } from '../services/recommendationEngine';

interface RecommendationCardProps {
  recommendation: Recommendation;
}

export function RecommendationCard({ recommendation }: RecommendationCardProps) {
  const styles = {
    safe: { bg: 'bg-blue-50 border-blue-200', icon: 'text-blue-600', text: 'text-blue-900' },
    warning: { bg: 'bg-amber-50 border-amber-200', icon: 'text-amber-600', text: 'text-amber-900' },
    unsafe: { bg: 'bg-red-50 border-red-200', icon: 'text-red-600', text: 'text-red-900' },
  }[recommendation.severity];

  return (
    <Card className={cn('p-4 flex gap-3', styles.bg)}>
      <Lightbulb className={cn('w-5 h-5 shrink-0 mt-0.5', styles.icon)} />
      <div>
        <p className={cn('text-sm font-semibold', styles.text)}>{recommendation.headline}</p>
        <p className="text-xs text-neutral-600 mt-1">{recommendation.detail}</p>
      </div>
    </Card>
  );
}