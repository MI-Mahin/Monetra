'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/add-spend', label: 'Add/Spend', icon: '💰' },
  { href: '/transfer', label: 'Transfer', icon: '🔄' },
  { href: '/history', label: 'History', icon: '📋' },
  { href: '/report', label: 'Report', icon: '📊' },
  { href: '/visualization', label: 'Charts', icon: '📈' },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 md:static md:border-t-0 md:border-r z-50">
      <div className="flex justify-around md:flex-col md:justify-start md:h-full md:py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col md:flex-row items-center gap-1 md:gap-3 px-3 py-2 md:px-6 md:py-3 text-xs md:text-sm transition-colors ${
                isActive
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 md:border-r-2 md:border-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
              }`}
            >
              <span className="text-lg md:text-xl">{item.icon}</span>
              <span className="hidden sm:inline">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
