'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LoadingSpinner } from '@/components';
import { SectionType, SECTION_LABELS, SECTION_ICONS } from '@/types';

export default function TransferPage() {
  const router = useRouter();
  const { state, isLoading, transferMoney } = useApp();

  const [fromSection, setFromSection] = useState<SectionType>('bank');
  const [fromSubEntryId, setFromSubEntryId] = useState<string>('');
  const [toSection, setToSection] = useState<SectionType>('cash');
  const [toSubEntryId, setToSubEntryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
  const fromSubEntries = state.sections[fromSection];
  const toSubEntries = state.sections[toSection];
  const fromSelectedEntry = fromSubEntries.find((e) => e.id === fromSubEntryId);
  const toSelectedEntry = toSubEntries.find((e) => e.id === toSubEntryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!fromSubEntryId || !toSubEntryId) {
      setError('Please select both source and destination entries');
      return;
    }

    if (fromSubEntryId === toSubEntryId && fromSection === toSection) {
      setError('Cannot transfer to the same entry');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    const result = transferMoney(
      fromSection,
      fromSubEntryId,
      toSection,
      toSubEntryId,
      amountValue,
      purpose.trim() || 'Transfer'
    );

    if (!result) {
      setError('Insufficient balance in source entry');
      return;
    }

    setSuccess(
      `Successfully transferred ৳${amountValue.toLocaleString()} from ${fromSelectedEntry?.name} to ${toSelectedEntry?.name}`
    );

    // Reset form
    setAmount('');
    setPurpose('');
  };

  const hasNoEntries = Object.values(state.sections).every((entries) => entries.length === 0);
  const totalEntries = Object.values(state.sections).reduce((sum, entries) => sum + entries.length, 0);

  if (hasNoEntries || totalEntries < 2) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Transfer Money
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You need at least two entries to transfer money between them.
          </p>
          <button
            onClick={() => router.push('/section/cash')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create Entries
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Transfer Money
      </h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 space-y-6">
        {/* From Section */}
        <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
          <h3 className="font-medium text-red-700 dark:text-red-400 mb-3">
            From (Source)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setFromSection(s);
                  setFromSubEntryId('');
                }}
                className={`p-2 rounded-lg border-2 transition-all text-center ${
                  fromSection === s
                    ? 'border-red-500 bg-white dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:border-red-300'
                }`}
              >
                <span className="text-lg block">{SECTION_ICONS[s]}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {SECTION_LABELS[s]}
                </span>
              </button>
            ))}
          </div>
          {fromSubEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No entries in {SECTION_LABELS[fromSection]}
            </p>
          ) : (
            <select
              value={fromSubEntryId}
              onChange={(e) => setFromSubEntryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="">Select source entry...</option>
              {fromSubEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name} - ৳{entry.amount.toLocaleString()}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-3">
            <span className="text-2xl">↓</span>
          </div>
        </div>

        {/* To Section */}
        <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg border border-green-100 dark:border-green-900/30">
          <h3 className="font-medium text-green-700 dark:text-green-400 mb-3">
            To (Destination)
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setToSection(s);
                  setToSubEntryId('');
                }}
                className={`p-2 rounded-lg border-2 transition-all text-center ${
                  toSection === s
                    ? 'border-green-500 bg-white dark:bg-gray-700'
                    : 'border-gray-200 dark:border-gray-600 hover:border-green-300'
                }`}
              >
                <span className="text-lg block">{SECTION_ICONS[s]}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                  {SECTION_LABELS[s]}
                </span>
              </button>
            ))}
          </div>
          {toSubEntries.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No entries in {SECTION_LABELS[toSection]}
            </p>
          ) : (
            <select
              value={toSubEntryId}
              onChange={(e) => setToSubEntryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="">Select destination entry...</option>
              {toSubEntries.map((entry) => (
                <option key={entry.id} value={entry.id}>
                  {entry.name} - ৳{entry.amount.toLocaleString()}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Amount (৳)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xl font-bold"
            placeholder="0"
            min="0"
            step="0.01"
          />
          {fromSelectedEntry && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Available: ৳{fromSelectedEntry.amount.toLocaleString()}
            </p>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Purpose / Note (Optional)
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., Withdraw, Deposit, Emergency"
          />
        </div>

        {/* Error/Success Messages */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          🔄 Transfer Money
        </button>
      </form>
    </div>
  );
}
