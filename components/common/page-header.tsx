import React from 'react';
import { Divider } from '../ui/divider';
import { cn } from '@/utils/cn';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('flex flex-col w-full mb-6', className)}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0 pb-4">
        <div className="space-y-1">
          <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 sm:text-2xl">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {description}
            </p>
          )}
        </div>
        {action && (
          <div className="flex items-center space-x-2 shrink-0">
            {action}
          </div>
        )}
      </div>
      <Divider className="my-0" />
    </div>
  );
}
