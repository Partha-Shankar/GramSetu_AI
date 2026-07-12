import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/card';
import { cn } from '@/utils/cn';

interface SectionCardProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SectionCard({ title, description, action, children, className }: SectionCardProps) {
  return (
    <Card className={cn('overflow-hidden border-neutral-200 dark:border-neutral-800', className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-base font-semibold">{title}</CardTitle>
          {description && <CardDescription className="text-xs">{description}</CardDescription>}
        </div>
        {action && <div className="flex items-center space-x-2">{action}</div>}
      </CardHeader>
      <CardContent className="pt-6">{children}</CardContent>
    </Card>
  );
}
