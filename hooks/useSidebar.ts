'use client';

import { useApp } from '@/contexts/AppContext';

export function useSidebar() {
  const { state, toggleSidebar } = useApp();
  
  return {
    isCollapsed: state.isSidebarCollapsed,
    toggle: toggleSidebar,
  };
}
