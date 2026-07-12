import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/utils/cn';
import { ModuleMetadata } from '@/constants/modules';

interface ModuleCardProps {
  module: ModuleMetadata;
  className?: string;
}

export function ModuleCard({ module, className }: ModuleCardProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[module.iconName] || LucideIcons.HelpCircle;

  return (
    <Card className={cn('flex flex-col h-full hover:border-blue-500 transition-colors', className)}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-md dark:bg-blue-950/20 dark:text-blue-400">
            <IconComponent className="w-5 h-5" />
          </div>
          <CardTitle className="text-base font-semibold">{module.name}</CardTitle>
        </div>
      </CardHeader>
      
      <div className="px-6 flex-1 pt-2">
        <CardDescription className="text-sm line-clamp-3 mb-4">
          {module.description}
        </CardDescription>
      </div>

      <CardFooter className="pt-3">
        <Link href={module.path} className="w-full">
          <Button variant="outline" size="sm" className="w-full justify-between">
            <span>Get Started</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
