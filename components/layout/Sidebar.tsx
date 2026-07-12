'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_ITEMS, SETTINGS_ITEM } from '@/constants/navigation';
import * as LucideIcons from 'lucide-react';
import { cn } from '@/utils/cn';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'hidden md:flex flex-col w-60 border-r border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 shrink-0 h-[calc(100vh-56px)] justify-between p-4',
        className
      )}
    >
      <div className="flex flex-col space-y-6">
        <nav className="flex flex-col space-y-1.5" aria-label="Sidebar Navigation">
          {SIDEBAR_ITEMS.map((item) => {
            const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[item.iconName] || LucideIcons.HelpCircle;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
                    : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200'
                )}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
        <Link
          href={SETTINGS_ITEM.href}
          className={cn(
            'flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-md transition-colors',
            pathname === SETTINGS_ITEM.href
              ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400'
              : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200'
          )}
        >
          {(() => {
            const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[SETTINGS_ITEM.iconName] || LucideIcons.Settings;
            return <IconComponent className="w-4 h-4 shrink-0" />;
          })()}
          <span>{SETTINGS_ITEM.title}</span>
        </Link>
      </div>
    </aside>
  );
}
