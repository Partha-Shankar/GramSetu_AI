import React from 'react';
import { FlaskConical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { cn } from '@/utils/cn';
import { ParameterResult } from '../types/jaldrishti.types';
import { toBadgeStatus, toBadgeLabel } from '../utils/statusMap';

interface WaterReportCardProps {
  result: ParameterResult;
}

export function WaterReportCard({ result }: WaterReportCardProps) {
  const borderColor = {
    safe: 'border-l-green-500',
    warning: 'border-l-amber-500',
    unsafe: 'border-l-red-500',
  }[result.status];

  const iconColor = {
    safe: 'text-green-600',
    warning: 'text-amber-600',
    unsafe: 'text-red-600',
  }[result.status];

  return (
    <Card className={cn('border-l-4 flex items-center justify-between p-4', borderColor)}>
      <div className="flex items-center gap-3">
        <div className={cn('p-2 rounded-full bg-neutral-50', iconColor)}>
          <FlaskConical className="w-5 h-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-900">{result.label}</p>
          <p className="text-xs text-neutral-500">{result.level}</p>
        </div>
      </div>
      <StatusBadge status={toBadgeStatus(result.status)}>
        {toBadgeLabel(result.status)}
      </StatusBadge>
    </Card>
  );
}