'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  setCollapsed: (collapsed: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

const SIDEBAR_STORAGE_KEY = 'monetra-sidebar-collapsed';

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
    if (saved !== null) {
      setIsCollapsed(saved === 'true');
    }
  }, []);

  const toggleSidebar = () => {
    const newValue = !isCollapsed;
    setIsCollapsed(newValue);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(newValue));
  };

  const setCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem(SIDEBAR_STORAGE_KEY, String(collapsed));
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error('useSidebar must be used within a SidebarProvider');
  }
  return context;
}
