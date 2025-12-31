'use client';

import { useApp } from '@/context/AppContext';
import { LoadingSpinner, SectionIcon, TrendingUpIcon, TrendingDownIcon, LendIcon } from '@/components';
import { SectionType, SECTION_LABELS } from '@/types';

export default function ReportPage() {
  const {
    state,
    isLoading,
    getTotalMoney,
    getAvailableMoney,
    getSectionTotal,
    getTotalEarned,
    getTotalSpent,
  } = useApp();

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
  const totalMoney = getTotalMoney();
  const availableMoney = getAvailableMoney();
  const totalEarned = getTotalEarned();
  const totalSpent = getTotalSpent();
  const netChange = totalEarned - totalSpent;
  const lendAmount = getSectionTotal('lend');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Financial Report
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Summary of your finances
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Money</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            ৳{totalMoney.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">
            ৳{availableMoney.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Earned</p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">
            ৳{totalEarned.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Spent</p>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">
            ৳{totalSpent.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Net Change */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Net Change (Earned - Spent)</p>
            <p className={`text-3xl font-bold mt-1 ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {netChange >= 0 ? '+' : ''}৳{netChange.toLocaleString()}
            </p>
          </div>
          <div className={`${netChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {netChange >= 0 ? <TrendingUpIcon size={48} /> : <TrendingDownIcon size={48} />}
          </div>
        </div>
      </div>

      {/* Section-wise Breakdown */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Section-wise Breakdown
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Section
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Entries
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  Total
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                  % of Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
              {sections.map((section) => {
                const sectionTotal = getSectionTotal(section);
                const percentage = totalMoney > 0 ? ((sectionTotal / totalMoney) * 100).toFixed(1) : '0';
                return (
                  <tr key={section} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <SectionIcon section={section} size={24} />
                        <span className="font-medium text-gray-900 dark:text-white">
                          {SECTION_LABELS[section]}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">
                      {state.sections[section].length}
                    </td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-900 dark:text-white">
                      ৳{sectionTotal.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-right text-gray-600 dark:text-gray-300">
                      {percentage}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50 dark:bg-gray-700/50">
                <td className="px-6 py-3 font-semibold text-gray-900 dark:text-white">
                  Total
                </td>
                <td className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">
                  {Object.values(state.sections).reduce((sum, entries) => sum + entries.length, 0)}
                </td>
                <td className="px-6 py-3 text-right font-bold text-gray-900 dark:text-white">
                  ৳{totalMoney.toLocaleString()}
                </td>
                <td className="px-6 py-3 text-right font-semibold text-gray-900 dark:text-white">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Sub-entry Details */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          All Entries
        </h2>
        <div className="grid gap-4">
          {sections.map((section) => {
            const entries = state.sections[section];
            if (entries.length === 0) return null;
            
            return (
              <div key={section} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex items-center gap-2">
                  <SectionIcon section={section} size={24} />
                  <span className="font-medium text-gray-900 dark:text-white">
                    {SECTION_LABELS[section]}
                  </span>
                </div>
                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                  {entries.map((entry) => (
                    <div key={entry.id} className="px-6 py-3 flex items-center justify-between">
                      <span className="text-gray-700 dark:text-gray-300">{entry.name}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        ৳{entry.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
          {Object.values(state.sections).every((entries) => entries.length === 0) && (
            <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400">
                No entries yet. Create some entries to see your report!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Lend Summary */}
      {lendAmount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-6 border border-amber-200 dark:border-amber-900/30">
          <div className="flex items-start gap-4">
            <div className="text-amber-600 dark:text-amber-400">
              <LendIcon size={36} />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800 dark:text-amber-300">
                Money Lent Out
              </h3>
              <p className="text-amber-700 dark:text-amber-400 mt-1">
                You have ৳{lendAmount.toLocaleString()} lent to others across {state.sections.lend.length} entries.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
