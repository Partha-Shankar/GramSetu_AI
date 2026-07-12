import React from 'react';
import { cn } from '@/utils/cn';

interface DividerProps {
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Divider({ className, orientation = 'horizontal' }: DividerProps) {
  return (
    <div
      className={cn(
        'bg-neutral-200 dark:bg-neutral-800 shrink-0',
        orientation === 'horizontal' ? 'h-[1px] w-full my-4' : 'h-full w-[1px] mx-4',
        className
      )}
    />
  );
}
