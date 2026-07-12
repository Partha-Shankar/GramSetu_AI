'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

export function Breadcrumb() {
  const pathname = usePathname();
  
  if (pathname === '/') {
    return null;
  }

  const paths = pathname.split('/').filter(Boolean);

  return (
    <nav className="flex items-center space-x-1.5 text-xs text-neutral-500 dark:text-neutral-400 py-2 mb-4" aria-label="Breadcrumb">
      <Link
        href="/"
        className="flex items-center hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
      >
        <Home className="w-3.5 h-3.5 mr-1" />
        <span>Home</span>
      </Link>
      
      {paths.map((path, idx) => {
        const url = `/${paths.slice(0, idx + 1).join('/')}`;
        const isLast = idx === paths.length - 1;
        // Format display name
        const displayName = path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');

        return (
          <React.Fragment key={url}>
            <ChevronRight className="w-3.5 h-3.5 text-neutral-300 dark:text-neutral-700 shrink-0" />
            {isLast ? (
              <span className="font-medium text-neutral-800 dark:text-neutral-200 truncate" aria-current="page">
                {displayName}
              </span>
            ) : (
              <Link
                href={url}
                className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors truncate"
              >
                {displayName}
              </Link>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
