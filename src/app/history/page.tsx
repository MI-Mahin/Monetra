'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LoadingSpinner, TransactionItem } from '@/components';
import { SectionType, TransactionType, SECTION_LABELS } from '@/types';

export default function HistoryPage() {
  const { isLoading, getFilteredTransactions } = useApp();

  const [sectionFilter, setSectionFilter] = useState<SectionType | ''>('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const transactions = getFilteredTransactions(
    sectionFilter || undefined,
    typeFilter || undefined
  );

  const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
  const types: TransactionType[] = ['add', 'spend', 'transfer'];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Transaction History
      </h1>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex flex-wrap gap-4">
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Section
          </label>
          <select
            value={sectionFilter}
            onChange={(e) => setSectionFilter(e.target.value as SectionType | '')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Sections</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {SECTION_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1 min-w-[150px]">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Type
          </label>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TransactionType | '')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          >
            <option value="">All Types</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>
        {(sectionFilter || typeFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setSectionFilter('');
                setTypeFilter('');
              }}
              className="px-4 py-2 text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Transaction Count */}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Showing {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
      </p>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            {sectionFilter || typeFilter
              ? 'No transactions match your filters.'
              : 'No transactions yet. Start by adding or spending money!'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )}
    </div>
  );
}
