import React from 'react';
import { Button } from '../ui/button';
import { HelpCircle } from 'lucide-react';
import { cn } from '@/utils/cn';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionText,
  onAction,
  icon = <HelpCircle className="w-10 h-10 text-neutral-400" />,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 text-center border border-dashed border-neutral-200 rounded-lg bg-neutral-50/30 dark:border-neutral-800 dark:bg-neutral-900/10',
        className
      )}
    >
      <div className="mb-3">{icon}</div>
      <h3 className="text-sm font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{title}</h3>
      <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mb-4">{description}</p>
      {actionText && onAction && (
        <Button variant="outline" size="sm" onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
}
