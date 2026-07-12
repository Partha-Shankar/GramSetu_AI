'use client';

import React from 'react';
import { Database, Menu } from 'lucide-react';

interface TopNavbarProps {
  onMenuClick?: () => void;
}

export function TopNavbar({ onMenuClick }: TopNavbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 shrink-0">
      <div className="flex items-center space-x-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="md:hidden p-1.5 rounded-md text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
            aria-label="Toggle Navigation Drawer"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span className="font-bold text-sm text-neutral-900 tracking-tight">
            GramSetu AI
          </span>
        </div>
      </div>
    </header>
  );
}
