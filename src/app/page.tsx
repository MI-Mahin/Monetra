'use client';

import { useApp } from '@/context/AppContext';
import { SectionCard, TransactionItem, LoadingSpinner } from '@/components';
import { SectionType } from '@/types';

const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];

export default function Dashboard() {
  const { isLoading, getTotalMoney, getAvailableMoney, getSectionTotal, getRecentTransactions } = useApp();

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const recentTransactions = getRecentTransactions(5);
  const totalMoney = getTotalMoney();
  const availableMoney = getAvailableMoney();
  const lendAmount = getSectionTotal('lend');

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Overview of your finances
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-blue-100 text-sm font-medium">Total Money</p>
          <p className="text-3xl font-bold mt-2">৳{totalMoney.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-green-100 text-sm font-medium">Available</p>
          <p className="text-3xl font-bold mt-2">৳{availableMoney.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl p-6 text-white shadow-lg">
          <p className="text-amber-100 text-sm font-medium">Lent Out</p>
          <p className="text-3xl font-bold mt-2">৳{lendAmount.toLocaleString()}</p>
        </div>
      </div>

      {/* Section Cards */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Money Sections
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((section) => (
            <SectionCard key={section} section={section} />
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Recent Transactions
          </h2>
          {recentTransactions.length > 0 && (
            <a
              href="/history"
              className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:underline"
            >
              View All →
            </a>
          )}
        </div>
        {recentTransactions.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
            <p className="text-gray-500 dark:text-gray-400">
              No transactions yet. Start by adding money to your accounts!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
