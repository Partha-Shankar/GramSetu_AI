'use client';

import React from 'react';
import { AlertOctagon, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SeverityBadgeProps {
  severity: 'low' | 'medium' | 'high' | 'critical';
  className?: string;
}

export function SeverityBadge({ severity, className }: SeverityBadgeProps) {
  const configs = {
    low: {
      text: 'Low Severity',
      icon: ShieldCheck,
      style: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/50',
    },
    medium: {
      text: 'Moderate Severity',
      icon: Info,
      style: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900/50',
    },
    high: {
      text: 'High Severity',
      icon: AlertTriangle,
      style: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/50',
    },
    critical: {
      text: 'Critical Severity',
      icon: AlertOctagon,
      style: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900/50 animate-pulse',
    },
  };

  const config = configs[severity] || configs.low;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border space-x-1.5 shadow-2xs',
        config.style,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.text}</span>
    </span>
  );
}
