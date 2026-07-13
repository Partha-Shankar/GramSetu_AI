'use client';

import React from 'react';

interface LoadingStateProps {
  variant?: 'card' | 'list' | 'spinner';
  count?: number;
}

export function LoadingState({ variant = 'card', count = 3 }: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, idx) => (
          <div
            key={idx}
            className="flex items-center space-x-3 p-3 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg animate-pulse"
          >
            <div className="w-10 h-10 rounded-md bg-neutral-200 dark:bg-neutral-800 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-xs w-1/4" />
              <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-xs w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="border border-neutral-250 dark:border-neutral-800 rounded-lg p-4 space-y-3 animate-pulse bg-white dark:bg-neutral-950"
        >
          <div className="flex justify-between items-center">
            <div className="h-3.5 bg-neutral-200 dark:bg-neutral-800 rounded-xs w-1/3" />
            <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-full w-16" />
          </div>
          <div className="h-16 bg-neutral-100 dark:bg-neutral-900 rounded-md" />
          <div className="flex justify-between items-center pt-2">
            <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-xs w-12" />
            <div className="h-7 bg-neutral-200 dark:bg-neutral-800 rounded-md w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}
