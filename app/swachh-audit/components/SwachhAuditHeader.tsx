'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ClipboardCheck, Camera, Upload, History, LayoutDashboard, Cpu } from 'lucide-react';
import { cn } from '@/utils/cn';

export function SwachhAuditHeader() {
  const pathname = usePathname();

  const navItems = [
    { href: '/swachh-audit', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/swachh-audit/camera', label: 'Camera Scan', icon: Camera },
    { href: '/swachh-audit/upload', label: 'Upload Image', icon: Upload },
    { href: '/swachh-audit/history', label: 'Audit History', icon: History },
  ];

  return (
    <header className="w-full bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-4 mb-6 shadow-xs">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        {/* Module Title and Status */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
            <ClipboardCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-50 leading-tight">
                SwachhAudit
              </h1>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50">
                <Cpu className="w-3.5 h-3.5 mr-1 animate-pulse text-emerald-500" />
                On-Device AI Active
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              AI-driven waste classification & sanitation metrics
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center gap-1 bg-neutral-50 dark:bg-neutral-900 p-1 rounded-lg border border-neutral-100 dark:border-neutral-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer',
                  isActive
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-xs border border-neutral-200/50 dark:border-neutral-700/50'
                    : 'text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200'
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
