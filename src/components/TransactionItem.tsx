'use client';

import { Transaction, SECTION_LABELS, SectionType } from '@/types';
import { useApp } from '@/context/AppContext';
import { ArrowUpIcon, ArrowDownIcon, TransferIcon, SectionIcon } from './Icons';

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
          iconBg: 'bg-green-100 dark:bg-green-900/40',
          Icon: ArrowUpIcon,
          label: 'Added',
        };
      case 'spend':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-600 dark:text-red-400',
          iconBg: 'bg-red-100 dark:bg-red-900/40',
          Icon: ArrowDownIcon,
          label: 'Spent',
        };
      case 'transfer':
        return {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          text: 'text-blue-600 dark:text-blue-400',
          iconBg: 'bg-blue-100 dark:bg-blue-900/40',
          Icon: TransferIcon,
          label: 'Transfer',
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <div className={`${styles.bg} rounded-lg p-4 border border-gray-100 dark:border-gray-700`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${styles.iconBg}`}>
            <styles.Icon size={18} className={styles.text} />
          </div>
          <div>
            <p className="font-medium text-gray-900 dark:text-white">
              {transaction.purpose || 'No description'}
            </p>
            <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 mt-1">
              <SectionIcon section={transaction.fromSection} size={14} className="opacity-70" />
              <span>{getSubEntryName(transaction.fromSection, transaction.fromSubEntry)}</span>
              {transaction.type === 'transfer' && transaction.toSubEntry && transaction.toSection && (
                <>
                  <span className="mx-1">→</span>
                  <SectionIcon section={transaction.toSection as SectionType} size={14} className="opacity-70" />
                  <span>{getSubEntryName(transaction.toSection, transaction.toSubEntry)}</span>
                </>
              )}
            </div>
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
