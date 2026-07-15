'use client';

import React from 'react';
import { Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon = <Clipboard className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 py-12 text-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-50/50 dark:bg-neutral-900/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-sm font-semibold text-neutral-800 dark:text-neutral-200 mb-1">
        {title}
      </h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <Button onClick={onAction} variant="outline" size="sm" className="text-xs cursor-pointer">
          {actionText}
        </Button>
      )}
    </div>
  );
}
