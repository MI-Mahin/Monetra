'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { LoadingSpinner, Modal } from '@/components';
import { SectionType, SECTION_LABELS, SECTION_ICONS, SubEntry } from '@/types';

interface PageProps {
  params: Promise<{ type: string }>;
}

export default function SectionPage({ params }: PageProps) {
  const { type } = use(params);
  const router = useRouter();
  const { state, isLoading, addSubEntry, editSubEntry, deleteSubEntry, getSectionTotal } = useApp();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<SubEntry | null>(null);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

  // Validate section type
  const validSections: SectionType[] = ['cash', 'bank', 'mobile', 'lend'];
  if (!validSections.includes(type as SectionType)) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">Invalid section type</p>
        <button
          onClick={() => router.push('/')}
          className="mt-4 text-blue-600 hover:underline"
        >
          Go back to Dashboard
        </button>
      </div>
    );
  }

  const section = type as SectionType;

  if (isLoading) {
    return <LoadingSpinner size="lg" />;
  }

  const subEntries = state.sections[section];
  const total = getSectionTotal(section);

  const handleAdd = () => {
    if (name.trim()) {
      addSubEntry(section, name.trim(), parseFloat(amount) || 0);
      setName('');
      setAmount('');
      setIsAddModalOpen(false);
    }
  };

  const handleEdit = () => {
    if (selectedEntry && name.trim()) {
      editSubEntry(section, selectedEntry.id, name.trim(), parseFloat(amount) || 0);
      setSelectedEntry(null);
      setName('');
      setAmount('');
      setIsEditModalOpen(false);
    }
  };

  const handleDelete = () => {
    if (selectedEntry) {
      deleteSubEntry(section, selectedEntry.id);
      setSelectedEntry(null);
      setIsDeleteModalOpen(false);
    }
  };

  const openEditModal = (entry: SubEntry) => {
    setSelectedEntry(entry);
    setName(entry.name);
    setAmount(entry.amount.toString());
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (entry: SubEntry) => {
    setSelectedEntry(entry);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          ← Back
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{SECTION_ICONS[section]}</span>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {SECTION_LABELS[section]}
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              Total: ৳{total.toLocaleString()}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            setName('');
            setAmount('');
            setIsAddModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          + Add Entry
        </button>
      </div>

      {/* Sub-entries List */}
      {subEntries.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center border border-gray-100 dark:border-gray-700">
          <p className="text-gray-500 dark:text-gray-400">
            No entries yet. Click &quot;Add Entry&quot; to create one.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {subEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700 flex items-center justify-between"
            >
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  {entry.name}
                </p>
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  ৳{entry.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEditModal(entry)}
                  className="text-gray-400 hover:text-blue-600 transition-colors p-2"
                  title="Edit"
                >
                  ✏️
                </button>
                <button
                  onClick={() => openDeleteModal(entry)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Entry"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., Brac Bank, bKash"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Initial Amount (Optional)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="0"
              min="0"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAdd}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Entry
            </button>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Entry"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Amount
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0"
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleEdit}
              disabled={!name.trim()}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Entry"
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-300">
            Are you sure you want to delete <strong>{selectedEntry?.name}</strong>? This action cannot be undone.
          </p>
          {selectedEntry && selectedEntry.amount > 0 && (
            <p className="text-amber-600 dark:text-amber-400 text-sm">
              ⚠️ This entry has ৳{selectedEntry.amount.toLocaleString()} in it.
            </p>
          )}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
