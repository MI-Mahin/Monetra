'use client';

import { Transaction, SECTION_LABELS } from '@/types';
import { useApp } from '@/context/AppContext';

interface TransactionItemProps {
  transaction: Transaction;
}

export default function TransactionItem({ transaction }: TransactionItemProps) {
  const { state } = useApp();
  
  const getSubEntryName = (section: string, subEntryId: string): string => {
    const sectionData = state.sections[section as keyof typeof state.sections];
    const entry = sectionData?.find(e => e.id === subEntryId);
    return entry?.name || 'Unknown';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeStyles = () => {
    switch (transaction.type) {
      case 'add':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-600 dark:text-green-400',
          icon: '↑',
          label: 'Added',
        };
      case 'spend':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          icon: '↓',
          label: 'Spent',
        };
      case 'transfer':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          icon: '↔',
          label: 'Transfer',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`${styles.bg} rounded-lg p-4 border border-gray-100 dark:border-gray-700`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <span className={`${styles.text} text-xl font-bold`}>{styles.icon}</span>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {transaction.purpose || 'No description'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {transaction.type === 'transfer' ? (
                <>
                  {getSubEntryName(transaction.fromSection, transaction.fromSubEntry)} ({SECTION_LABELS[transaction.fromSection]})
                  {' → '}
                  {transaction.toSubEntry && transaction.toSection && 
                    `${getSubEntryName(transaction.toSection, transaction.toSubEntry)} (${SECTION_LABELS[transaction.toSection]})`
                  }
                </>
              ) : (
                <>
                  {getSubEntryName(transaction.fromSection, transaction.fromSubEntry)} ({SECTION_LABELS[transaction.fromSection]})
                </>
              )}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              {formatDate(transaction.date)}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className={`font-bold ${styles.text}`}>
            {transaction.type === 'spend' ? '-' : transaction.type === 'add' ? '+' : ''}
            ৳{transaction.amount.toLocaleString()}
          </p>
          <span className={`text-xs ${styles.text} font-medium`}>
            {styles.label}
          </span>
        </div>
      </div>
    </div>
  );
}
