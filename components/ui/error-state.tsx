import React from 'react';
import { Button } from './button';
import { AlertOctagon } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorState({ title = 'Something went wrong', message, onRetry, className }: ErrorStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-6 border border-red-100 rounded-lg bg-red-50/50 text-center dark:border-red-950/20 dark:bg-red-950/5',
        className
      )}
    >
      <AlertOctagon className="w-10 h-10 text-red-600 mb-3" />
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-50 mb-1">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mb-4">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/20">
          Retry Action
        </Button>
      )}
    </div>
  );
}
