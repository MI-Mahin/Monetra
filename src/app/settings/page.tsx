'use client';

import { useTheme } from '@/context/ThemeContext';
import { useApp } from '@/context/AppContext';
import { SunIcon, MoonIcon, MonitorIcon, SettingsIcon, TrashIcon } from '@/components';
import { Modal } from '@/components';
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
  const { resetAllData } = useApp();
  const [mounted, setMounted] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const PROJECT_NAME = 'Monetra';

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleReset = () => {
    if (confirmText === PROJECT_NAME) {
      resetAllData();
      setIsResetModalOpen(false);
      setConfirmText('');
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  const closeResetModal = () => {
    setIsResetModalOpen(false);
    setConfirmText('');
  };

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

      {/* Danger Zone */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-red-200 dark:border-red-900/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/20">
          <h2 className="text-lg font-semibold text-red-600 dark:text-red-400">
            Danger Zone
          </h2>
          <p className="text-sm text-red-500 dark:text-red-400/80 mt-1">
            Irreversible actions that affect your data
          </p>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Reset All Data</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Permanently delete all entries, transactions, and history
              </p>
            </div>
            <button
              onClick={() => setIsResetModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
            >
              <TrashIcon size={18} />
              Reset
            </button>
          </div>
          {resetSuccess && (
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm font-medium">
                All data has been successfully reset.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={isResetModalOpen}
        onClose={closeResetModal}
        title="Reset All Data"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-600 dark:text-red-400 text-sm">
              <strong>Warning:</strong> This action cannot be undone. All your entries, transactions, and history will be permanently deleted.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Type <span className="font-bold text-red-600">{PROJECT_NAME}</span> to confirm
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
              placeholder={PROJECT_NAME}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={closeResetModal}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleReset}
              disabled={confirmText !== PROJECT_NAME}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Reset Everything
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
