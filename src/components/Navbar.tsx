'use client';

import { WalletIcon } from './Icons';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center h-14 px-4 md:px-6">
        {/* Logo and Name - Left Side */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <WalletIcon size={18} />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            Monetra
          </span>
        </div>
      </div>
    </header>
  );
}
