'use client';

import { useApp } from '@/context/AppContext';
import { LoadingSpinner, SectionIcon, TrendingUpIcon, TrendingDownIcon, LendIcon, DownloadIcon, FileTextIcon, FileSpreadsheetIcon } from '@/components';
import { SectionType, SECTION_LABELS } from '@/types';
import { useState, useRef, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';

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

  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const downloadMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (downloadMenuRef.current && !downloadMenuRef.current.contains(event.target as Node)) {
        setShowDownloadMenu(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateReportData = () => {
    const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
    const reportDate = new Date().toLocaleString();
    const totalMoney = getTotalMoney();
    const availableMoney = getAvailableMoney();
    const totalEarned = getTotalEarned();
    const totalSpent = getTotalSpent();
    const netChange = totalEarned - totalSpent;

    return { sections, reportDate, totalMoney, availableMoney, totalEarned, totalSpent, netChange };
  };

  const downloadAsPDF = () => {
    const { sections, totalMoney, availableMoney, totalEarned, totalSpent, netChange } = generateReportData();
    
    const doc = new jsPDF();
    let y = 20;
    const lineHeight = 7;
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MONETRA FINANCIAL REPORT', pageWidth / 2, y, { align: 'center' });
    y += lineHeight * 2;
    
    // Summary Section
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SUMMARY', 20, y);
    y += lineHeight;
    doc.setDrawColor(200);
    doc.line(20, y, pageWidth - 20, y);
    y += lineHeight;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const summaryData = [
      ['Total Money', `BDT ${totalMoney.toLocaleString()}`],
      ['Available Money', `BDT ${availableMoney.toLocaleString()}`],
      ['Total Earned', `BDT ${totalEarned.toLocaleString()}`],
      ['Total Spent', `BDT ${totalSpent.toLocaleString()}`],
      ['Net Change', `${netChange >= 0 ? '+' : ''}BDT ${netChange.toLocaleString()}`],
    ];
    
    summaryData.forEach(([label, value]) => {
      doc.text(label + ':', 25, y);
      doc.text(value, 100, y);
      y += lineHeight;
    });
    y += lineHeight;
    
    // Section Breakdown
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('SECTION-WISE BREAKDOWN', 20, y);
    y += lineHeight;
    doc.line(20, y, pageWidth - 20, y);
    y += lineHeight;
    
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    sections.forEach(section => {
      const sectionTotal = getSectionTotal(section);
      const percentage = totalMoney > 0 ? ((sectionTotal / totalMoney) * 100).toFixed(1) : '0';
      doc.setFont('helvetica', 'bold');
      doc.text(`${SECTION_LABELS[section]}: BDT ${sectionTotal.toLocaleString()} (${percentage}%)`, 25, y);
      y += lineHeight;
      doc.setFont('helvetica', 'normal');
      state.sections[section].forEach(entry => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(`  - ${entry.name}: BDT ${entry.amount.toLocaleString()}`, 30, y);
        y += lineHeight;
      });
      y += 3;
    });
    
    doc.save(`monetra-report-${new Date().toISOString().split('T')[0]}.pdf`);
    setShowDownloadMenu(false);
  };

  const downloadAsExcel = () => {
    const { sections, reportDate, totalMoney, availableMoney, totalEarned, totalSpent, netChange } = generateReportData();
    
    const workbook = XLSX.utils.book_new();
    
    // Summary Sheet
    const summaryData = [
      ['MONETRA FINANCIAL REPORT'],
      [`Generated: ${reportDate}`],
      [],
      ['SUMMARY'],
      ['Metric', 'Value'],
      ['Total Money', totalMoney],
      ['Available Money', availableMoney],
      ['Total Earned', totalEarned],
      ['Total Spent', totalSpent],
      ['Net Change', netChange],
    ];
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
    summarySheet['!cols'] = [{ wch: 20 }, { wch: 20 }];
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary');
    
    // Section Breakdown Sheet
    const breakdownData = [
      ['SECTION BREAKDOWN'],
      ['Section', 'Entries', 'Total', 'Percentage'],
      ...sections.map(section => {
        const sectionTotal = getSectionTotal(section);
        const percentage = totalMoney > 0 ? ((sectionTotal / totalMoney) * 100).toFixed(1) + '%' : '0%';
        return [SECTION_LABELS[section], state.sections[section].length, sectionTotal, percentage];
      }),
    ];
    const breakdownSheet = XLSX.utils.aoa_to_sheet(breakdownData);
    breakdownSheet['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 12 }];
    XLSX.utils.book_append_sheet(workbook, breakdownSheet, 'Breakdown');
    
    // All Entries Sheet
    const entriesData = [
      ['ALL ENTRIES'],
      ['Section', 'Name', 'Amount'],
    ];
    sections.forEach(section => {
      state.sections[section].forEach(entry => {
        entriesData.push([SECTION_LABELS[section], entry.name, entry.amount as unknown as string]);
      });
    });
    const entriesSheet = XLSX.utils.aoa_to_sheet(entriesData);
    entriesSheet['!cols'] = [{ wch: 20 }, { wch: 25 }, { wch: 15 }];
    XLSX.utils.book_append_sheet(workbook, entriesSheet, 'Entries');
    
    // Transactions Sheet
    const transactionsData = [
      ['TRANSACTIONS'],
      ['Date', 'Type', 'From Section', 'From Entry', 'To Section', 'To Entry', 'Amount', 'Purpose'],
      ...state.transactions.map(t => [
        new Date(t.date).toLocaleString(),
        t.type,
        SECTION_LABELS[t.fromSection],
        t.fromSubEntry,
        t.toSection ? SECTION_LABELS[t.toSection] : '-',
        t.toSubEntry || '-',
        t.amount,
        t.purpose,
      ]),
    ];
    const transactionsSheet = XLSX.utils.aoa_to_sheet(transactionsData);
    transactionsSheet['!cols'] = [{ wch: 20 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(workbook, transactionsSheet, 'Transactions');
    
    XLSX.writeFile(workbook, `monetra-report-${new Date().toISOString().split('T')[0]}.xlsx`);
    setShowDownloadMenu(false);
  };

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Financial Report
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Summary of your finances
          </p>
        </div>
        
        {/* Download Report Button */}
        <div className="relative" ref={downloadMenuRef}>
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <DownloadIcon size={20} />
            Download Report
          </button>
          
          {showDownloadMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-10">
              <button
                onClick={downloadAsPDF}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <FileTextIcon size={20} className="text-red-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Download as PDF</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Text format report</p>
                </div>
              </button>
              <button
                onClick={downloadAsExcel}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-t border-gray-100 dark:border-gray-700"
              >
                <FileSpreadsheetIcon size={20} className="text-green-500" />
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Download as Excel</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">CSV spreadsheet format</p>
                </div>
              </button>
            </div>
          )}
        </div>
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
