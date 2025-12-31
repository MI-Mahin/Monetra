'use client';

import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { LoadingSpinner, TransactionItem, DownloadIcon } from '@/components';
import { SectionType, TransactionType, SECTION_LABELS } from '@/types';
import { jsPDF } from 'jspdf';

export default function HistoryPage() {
  const { state, isLoading, getFilteredTransactions } = useApp();

  const [sectionFilter, setSectionFilter] = useState<SectionType | ''>('');
  const [typeFilter, setTypeFilter] = useState<TransactionType | ''>('');
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const transactions = getFilteredTransactions(
    sectionFilter || undefined,
    typeFilter || undefined
  );

  const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
  const types: TransactionType[] = ['add', 'spend', 'transfer'];

  // Get monthly transactions for download
  const getMonthlyTransactions = () => {
    const [year, month] = selectedMonth.split('-').map(Number);
    return state.transactions.filter(t => {
      const txDate = new Date(t.date);
      return txDate.getFullYear() === year && txDate.getMonth() + 1 === month;
    });
  };

  const downloadMonthlyPDF = () => {
    const monthlyTransactions = getMonthlyTransactions();
    const [year, month] = selectedMonth.split('-').map(Number);
    const monthName = new Date(year, month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    let y = 20;
    const lineHeight = 8;
    
    // Title
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(31, 41, 55);
    doc.text('Monthly Transactions', 20, y);
    y += 8;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    doc.text(monthName, 20, y);
    y += 15;
    
    // Summary line
    const totalAdded = monthlyTransactions.filter(t => t.type === 'add').reduce((sum, t) => sum + t.amount, 0);
    const totalSpent = monthlyTransactions.filter(t => t.type === 'spend').reduce((sum, t) => sum + t.amount, 0);
    
    doc.setFontSize(10);
    doc.setTextColor(34, 197, 94);
    doc.text(`Added: BDT ${totalAdded.toLocaleString()}`, 20, y);
    doc.setTextColor(239, 68, 68);
    doc.text(`Spent: BDT ${totalSpent.toLocaleString()}`, 85, y);
    doc.setTextColor(107, 114, 128);
    doc.text(`${monthlyTransactions.length} transactions`, 150, y);
    
    y += 12;
    doc.setDrawColor(229, 231, 235);
    doc.line(20, y, pageWidth - 20, y);
    y += 10;
    
    if (monthlyTransactions.length === 0) {
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text('No transactions found for this month.', 20, y);
    } else {
      // Sort transactions by date (newest first)
      const sortedTransactions = [...monthlyTransactions].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      sortedTransactions.forEach((t) => {
        if (y > 280) {
          doc.addPage();
          y = 20;
        }
        
        const date = new Date(t.date).toLocaleDateString();
        const typeColors: { [key: string]: [number, number, number] } = {
          add: [34, 197, 94],
          spend: [239, 68, 68],
          transfer: [59, 130, 246],
        };
        
        // Date and type
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(107, 114, 128);
        doc.text(date, 20, y);
        
        doc.setTextColor(...typeColors[t.type]);
        doc.setFont('helvetica', 'bold');
        doc.text(t.type.toUpperCase(), 45, y);
        
        // Purpose
        doc.setTextColor(31, 41, 55);
        doc.setFont('helvetica', 'normal');
        const truncatedPurpose = t.purpose.length > 35 ? t.purpose.substring(0, 32) + '...' : t.purpose;
        doc.text(truncatedPurpose, 75, y);
        
        // Amount
        const amountPrefix = t.type === 'add' ? '+' : t.type === 'spend' ? '-' : '';
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...typeColors[t.type]);
        doc.text(`${amountPrefix}BDT ${t.amount.toLocaleString()}`, pageWidth - 20, y, { align: 'right' });
        
        y += lineHeight;
      });
    }
    
    doc.save(`monetra-transactions-${selectedMonth}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transaction History
        </h1>
      </div>

      {/* Download Monthly Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
        <h2 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
          Download Monthly Transactions
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
              Select Month
            </label>
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
          <button
            onClick={downloadMonthlyPDF}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors text-sm"
          >
            <DownloadIcon size={18} />
            Download PDF
          </button>
        </div>
      </div>

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
