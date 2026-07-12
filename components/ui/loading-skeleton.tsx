import React from 'react';
import { cn } from '@/utils/cn';

interface LoadingSkeletonProps {
  className?: string;
  count?: number;
}

export function LoadingSkeleton({ className, count = 1 }: LoadingSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className={cn(
            'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800 h-4 w-full',
            className
          )}
        />
      ))}
    </>
  );
}
