'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { HomeIcon, WalletIcon, TransferIcon, HistoryIcon, ReportIcon, ChartIcon, SettingsIcon } from './Icons';
import { useSidebar } from '@/context/SidebarContext';

const navItems = [
  { href: '/', label: 'Dashboard', Icon: HomeIcon },
  { href: '/add-spend', label: 'Add/Spend', Icon: WalletIcon },
  { href: '/transfer', label: 'Transfer', Icon: TransferIcon },
  { href: '/history', label: 'History', Icon: HistoryIcon },
  { href: '/report', label: 'Report', Icon: ReportIcon },
  { href: '/visualization', label: 'Charts', Icon: ChartIcon },
  { href: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export function DesktopNavigation() {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  return (
    <nav className="h-full">
      <div className="flex flex-col justify-start h-full py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              className={`flex items-center gap-3 py-3 text-sm transition-colors ${
                isCollapsed ? 'px-0 justify-center' : 'px-6'
              } ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 border-r-2 border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              <item.Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function MobileNavigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 z-50">
      <div className="flex justify-around">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 px-3 py-2 text-xs transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <item.Icon size={20} className={isActive ? 'text-blue-600 dark:text-blue-400' : ''} />
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

// Default export for backward compatibility
export default function Navigation() {
  return <DesktopNavigation />;
}
