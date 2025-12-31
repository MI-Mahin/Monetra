'use client';

import Link from 'next/link';
import { SectionType, SECTION_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';
import { SectionIcon, ChevronRightIcon } from './Icons';

interface SectionCardProps {
  section: SectionType;
}

const sectionColors: Record<SectionType, string> = {
  cash: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20',
  bank: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20',
  mobile: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20',
  lend: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20',
};

export default function SectionCard({ section }: SectionCardProps) {
  const { getSectionTotal, state } = useApp();
  const total = getSectionTotal(section);
  const subEntries = state.sections[section];

  return (
    <Link href={`/section/${section}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-lg ${sectionColors[section]}`}>
              <SectionIcon section={section} size={24} />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {SECTION_LABELS[section]}
            </h3>
          </div>
          <ChevronRightIcon size={20} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
        </div>
        <div className="space-y-2">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            ৳{total.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {subEntries.length} {subEntries.length === 1 ? 'entry' : 'entries'}
          </p>
        </div>
      </div>
    </Link>
  );
}
