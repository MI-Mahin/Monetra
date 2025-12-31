'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LoadingSpinner, SectionIcon, PlusIcon, MinusIcon } from '@/components';
import { SectionType, SECTION_LABELS } from '@/types';

type ActionType = 'add' | 'spend';

export default function AddSpendPage() {
  const router = useRouter();
  const { state, isLoading, addMoney, spendMoney } = useApp();

  const [actionType, setActionType] = useState<ActionType>('add');
  const [section, setSection] = useState<SectionType>('cash');
  const [subEntryId, setSubEntryId] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [purpose, setPurpose] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const sections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
  const subEntries = state.sections[section];
  const selectedEntry = subEntries.find((e) => e.id === subEntryId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!subEntryId) {
      setError('Please select a sub-entry');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!purpose.trim()) {
      setError('Please enter a purpose');
      return;
    }

    if (actionType === 'add') {
      addMoney(section, subEntryId, amountValue, purpose.trim());
      setSuccess(`Successfully added ৳${amountValue.toLocaleString()} to ${selectedEntry?.name}`);
    } else {
      const result = spendMoney(section, subEntryId, amountValue, purpose.trim());
      if (!result) {
        setError('Insufficient balance');
        return;
      }
      setSuccess(`Successfully spent ৳${amountValue.toLocaleString()} from ${selectedEntry?.name}`);
    }

    // Reset form
    setAmount('');
    setPurpose('');
  };

  const hasNoEntries = Object.values(state.sections).every((entries) => entries.length === 0);

  if (hasNoEntries) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Add / Spend Money
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You need to create at least one entry in a section before you can add or spend money.
          </p>
          <button
            onClick={() => router.push('/section/cash')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Create an Entry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Add / Spend Money
      </h1>

      {/* Action Type Toggle */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700 inline-flex">
        <button
          onClick={() => {
            setActionType('add');
            setError('');
            setSuccess('');
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            actionType === 'add'
              ? 'bg-green-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <PlusIcon size={18} /> Add Money
        </button>
        <button
          onClick={() => {
            setActionType('spend');
            setError('');
            setSuccess('');
          }}
          className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
            actionType === 'spend'
              ? 'bg-red-600 text-white'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <MinusIcon size={18} /> Spend Money
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 space-y-6">
        {/* Section Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Section
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {sections.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setSection(s);
                  setSubEntryId('');
                }}
                className={`p-4 rounded-lg border-2 transition-all flex flex-col items-center ${
                  section === s
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
                }`}
              >
                <SectionIcon section={s} size={28} className="mb-1" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {SECTION_LABELS[s]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Sub-entry Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Entry
          </label>
          {subEntries.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              No entries in {SECTION_LABELS[section]}.{' '}
              <button
                type="button"
                onClick={() => router.push(`/section/${section}`)}
                className="text-blue-600 hover:underline"
              >
                Create one
              </button>
            </div>
          ) : (
            <select
              value={subEntryId}
              onChange={(e) => setSubEntryId(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose an entry...</option>
              {subEntries.map((entry) => (
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
          {actionType === 'spend' && selectedEntry && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Available: ৳{selectedEntry.amount.toLocaleString()}
            </p>
          )}
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Purpose / Description
          </label>
          <input
            type="text"
            value={purpose}
            onChange={(e) => setPurpose(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder={actionType === 'add' ? 'e.g., Salary, Gift, Refund' : 'e.g., Grocery, Rent, Transport'}
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
          className={`w-full py-3 rounded-lg font-medium text-white transition-colors ${
            actionType === 'add'
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          {actionType === 'add' ? '+ Add Money' : '- Spend Money'}
        </button>
      </form>
    </div>
  );
}
