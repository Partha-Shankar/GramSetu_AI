import React from 'react';
import { cn } from '@/utils/cn';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'main' | 'footer' | 'header';
}

export function Container({ children, className, as: Component = 'div' }: ContainerProps) {
  return (
    <Component
      className={cn(
        'mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8',
        className
      )}
    >
      {children}
    </Component>
  );
}
