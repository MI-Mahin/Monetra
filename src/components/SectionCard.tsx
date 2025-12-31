'use client';

import Link from 'next/link';
import { SectionType, SECTION_LABELS, SECTION_ICONS } from '@/types';
import { useApp } from '@/context/AppContext';

interface SectionCardProps {
  section: SectionType;
}

export default function SectionCard({ section }: SectionCardProps) {
  const { getSectionTotal, state } = useApp();
  const total = getSectionTotal(section);
  const subEntries = state.sections[section];

  return (
    <Link href={`/section/${section}`}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 p-6 border border-gray-100 dark:border-gray-700 cursor-pointer group">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{SECTION_ICONS[section]}</span>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {SECTION_LABELS[section]}
            </h3>
          </div>
          <span className="text-gray-400 group-hover:text-blue-500 transition-colors">
            →
          </span>
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
