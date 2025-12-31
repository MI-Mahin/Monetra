'use client';

import { ReactNode } from 'react';
import { useSidebar } from '@/context/SidebarContext';
import { PanelLeftCloseIcon, PanelLeftOpenIcon } from './Icons';

export default function Sidebar({ children }: { children: ReactNode }) {
  const { isCollapsed, toggleSidebar } = useSidebar();

  return (
    <aside
      className={`hidden md:flex md:flex-col md:flex-shrink-0 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transition-all duration-300 ${isCollapsed ? 'md:w-16' : 'md:w-56'}`}
    >
      {/* Navigation */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
      
      {/* Toggle Button at Bottom */}
      <div className="border-t border-gray-200 dark:border-gray-800 p-2">
        <button
          onClick={toggleSidebar}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <PanelLeftOpenIcon size={18} />
          ) : (
            <>
              <PanelLeftCloseIcon size={18} />
              <span className="text-sm">Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
