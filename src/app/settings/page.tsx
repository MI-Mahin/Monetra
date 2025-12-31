'use client';

import { useTheme } from '@/context/ThemeContext';
import { SunIcon, MoonIcon, MonitorIcon, SettingsIcon } from '@/components';
import { useEffect, useState } from 'react';

type ThemeOption = 'light' | 'dark' | 'system';

const themeOptions: { value: ThemeOption; label: string; description: string; Icon: typeof SunIcon }[] = [
  {
    value: 'light',
    label: 'Light',
    description: 'Always use light theme',
    Icon: SunIcon,
  },
  {
    value: 'dark',
    label: 'Dark',
    description: 'Always use dark theme',
    Icon: MoonIcon,
  },
  {
    value: 'system',
    label: 'System',
    description: 'Follow system preference',
    Icon: MonitorIcon,
  },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-3">
          <SettingsIcon size={32} className="text-gray-600 dark:text-gray-400" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Settings
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Customize your experience
            </p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <SettingsIcon size={32} className="text-gray-600 dark:text-gray-400" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Settings
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Customize your experience
          </p>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Appearance
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Choose how Monetra looks to you
          </p>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themeOptions.map((option) => {
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`p-4 rounded-xl border-2 transition-all text-left ${
                    isActive
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div
                      className={`p-2 rounded-lg ${
                        isActive
                          ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <option.Icon size={20} />
                    </div>
                    <span
                      className={`font-medium ${
                        isActive
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {option.label}
                    </span>
                    {isActive && (
                      <div className="ml-auto">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {option.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            About
          </h2>
        </div>
        <div className="p-6 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">App Name</span>
            <span className="font-medium text-gray-900 dark:text-white">Monetra</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Version</span>
            <span className="font-medium text-gray-900 dark:text-white">1.0.0</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-400">Storage</span>
            <span className="font-medium text-gray-900 dark:text-white">Local Storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
