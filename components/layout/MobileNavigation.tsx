'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SIDEBAR_ITEMS, SETTINGS_ITEM } from '@/constants/navigation';
import * as LucideIcons from 'lucide-react';
import { X, Database } from 'lucide-react';
import { cn } from '@/utils/cn';

interface MobileNavigationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavigation({ isOpen, onClose }: MobileNavigationProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
      <div 
        className="fixed inset-0 bg-neutral-900/50 dark:bg-neutral-950/80 transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative flex w-full max-w-xs flex-col bg-white p-4 shadow-xl dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-900 mb-4">
          <div className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-blue-600 dark:text-blue-500" />
            <span className="font-bold text-sm text-neutral-900 dark:text-neutral-50">
              GramSetu AI
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-900"
            aria-label="Close menu drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 flex flex-col space-y-1.5" aria-label="Mobile Navigation Drawer">
          {SIDEBAR_ITEMS.map((item) => {
            const IconComponent = (LucideIcons as unknown as Record<string, LucideIcons.LucideIcon>)[item.iconName] || LucideIcons.HelpCircle;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
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

        <div className="pt-4 border-t border-neutral-100 dark:border-neutral-900">
          <Link
            href={SETTINGS_ITEM.href}
            className={cn(
              'flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors',
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
      </div>
    </div>
  );
}
