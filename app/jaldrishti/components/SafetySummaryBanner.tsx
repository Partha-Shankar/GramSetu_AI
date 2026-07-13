import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/utils/cn';
import { ParameterResult } from '../types/jaldrishti.types';

interface SafetySummaryBannerProps {
  results: ParameterResult[];
}

export function SafetySummaryBanner({ results }: SafetySummaryBannerProps) {
  const hasUnsafe = results.some((r) => r.status === 'unsafe');
  const hasWarning = results.some((r) => r.status === 'warning');

  const overall = hasUnsafe ? 'unsafe' : hasWarning ? 'warning' : 'safe';

  const config = {
    safe: {
      icon: CheckCircle2,
      title: 'Water appears safe',
      bg: 'bg-green-50 border-green-200',
      iconColor: 'text-green-600',
      textColor: 'text-green-800',
    },
    warning: {
      icon: AlertTriangle,
      title: 'Some parameters need attention',
      bg: 'bg-amber-50 border-amber-200',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-800',
    },
    unsafe: {
      icon: XCircle,
      title: 'Water may be unsafe',
      bg: 'bg-red-50 border-red-200',
      iconColor: 'text-red-600',
      textColor: 'text-red-800',
    },
  }[overall];

  const Icon = config.icon;
  const safeCount = results.filter((r) => r.status === 'safe').length;

  return (
    <Card className={cn('flex items-center gap-3 p-4', config.bg)}>
      <Icon className={cn('w-8 h-8 shrink-0', config.iconColor)} />
      <div>
        <p className={cn('text-sm font-semibold', config.textColor)}>{config.title}</p>
        <p className="text-xs text-neutral-500">
          {safeCount} of {results.length} parameters within safe range
        </p>
      </div>
    </Card>
  );
}