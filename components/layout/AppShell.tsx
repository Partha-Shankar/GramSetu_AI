'use client';

import React, { useState } from 'react';
import { TopNavbar } from './TopNavbar';
import { Sidebar } from './Sidebar';
import { MobileNavigation } from './MobileNavigation';
import { Footer } from './Footer';
import { Breadcrumb } from './Breadcrumb';
import { Container } from '../common/container';
import { useToast } from '@/hooks/useToast';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toasts, dismiss } = useToast();

  return (
    <div className="flex flex-col min-h-screen bg-neutral-50/50 dark:bg-neutral-900/10">
      <TopNavbar onMenuClick={() => setIsMobileMenuOpen(true)} />

      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />

      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-y-auto">
          <main className="flex-1 py-6">
            <Container>
              <Breadcrumb />
              {children}
            </Container>
          </main>
          
          <Footer />
        </div>
      </div>

      <div 
        className="fixed bottom-4 right-4 z-50 flex flex-col space-y-2 w-full max-w-sm"
        aria-live="assertive"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              'flex items-start justify-between p-4 rounded-md shadow-lg border text-sm animate-in fade-in slide-in-from-bottom-4 duration-200 bg-white dark:bg-neutral-950',
              {
                'border-neutral-200 text-neutral-900 dark:border-neutral-800 dark:text-neutral-50': !t.variant || t.variant === 'default',
                'border-green-200 bg-green-50 text-green-800 dark:border-green-900/50 dark:bg-green-950/20 dark:text-green-300': t.variant === 'success',
                'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/20 dark:text-amber-300': t.variant === 'warning',
                'border-red-200 bg-red-50 text-red-800 dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-300': t.variant === 'destructive',
              }
            )}
          >
            <div className="flex-1 pr-3">
              <p className="font-semibold text-xs leading-none mb-1">{t.title}</p>
              {t.description && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  {t.description}
                </p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              className="text-neutral-400 hover:text-neutral-950 dark:hover:text-neutral-50 shrink-0"
              aria-label="Dismiss toast notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
