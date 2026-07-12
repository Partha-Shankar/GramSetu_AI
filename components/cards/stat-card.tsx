import React from 'react';
import { Card, CardContent } from '../ui/card';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/utils/cn';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  iconName?: string;
  trend?: {
    value: string;
    type: 'up' | 'down' | 'neutral';
  };
  className?: string;
}

export function StatCard({ title, value, description, iconName, trend, className }: StatCardProps) {
  // Resolve icon dynamically if passed
  const IconComponent = iconName ? (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[iconName] : null;

  return (
    <Card className={cn('border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 truncate">{title}</p>
          {IconComponent && (
            <div className="p-1.5 bg-neutral-50 text-neutral-600 rounded-md dark:bg-neutral-900 dark:text-neutral-400">
              <IconComponent className="w-4 h-4" />
            </div>
          )}
        </div>
        <div className="flex items-baseline space-x-2">
          <p className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">{value}</p>
          {trend && (
            <span
              className={cn('text-xs font-semibold px-1.5 py-0.5 rounded', {
                'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950/20': trend.type === 'up',
                'text-red-700 bg-red-50 dark:text-red-400 dark:bg-red-950/20': trend.type === 'down',
                'text-neutral-500 bg-neutral-50 dark:text-neutral-400 dark:bg-neutral-900': trend.type === 'neutral',
              })}
            >
              {trend.value}
            </span>
          )}
        </div>
        {description && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}
