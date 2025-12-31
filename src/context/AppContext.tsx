'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  AppState,
  Sections,
  SectionType,
  SubEntry,
  Transaction,
  TransactionType,
} from '@/types';

const STORAGE_KEY = 'monetra-data';

const initialSections: Sections = {
  cash: [],
  bank: [],
  mobile: [],
  lend: [],
};

const initialState: AppState = {
  sections: initialSections,
  transactions: [],
};

interface AppContextType {
  state: AppState;
  isLoading: boolean;
  
  // Section operations
  addSubEntry: (section: SectionType, name: string, amount?: number) => void;
  editSubEntry: (section: SectionType, id: string, name: string, amount: number) => void;
  deleteSubEntry: (section: SectionType, id: string) => void;
  getSectionTotal: (section: SectionType) => number;
  getTotalMoney: () => number;
  getAvailableMoney: () => number;
  
  // Money operations
  addMoney: (section: SectionType, subEntryId: string, amount: number, purpose: string) => void;
  spendMoney: (section: SectionType, subEntryId: string, amount: number, purpose: string) => boolean;
  transferMoney: (
    fromSection: SectionType,
    fromSubEntryId: string,
    toSection: SectionType,
    toSubEntryId: string,
    amount: number,
    purpose: string
  ) => boolean;
  
  // Transaction helpers
  getRecentTransactions: (limit?: number) => Transaction[];
  getFilteredTransactions: (
    sectionFilter?: SectionType,
    typeFilter?: TransactionType
  ) => Transaction[];
  
  // Stats
  getTotalEarned: () => number;
  getTotalSpent: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as AppState;
        setState(parsed);
      } catch (e) {
        console.error('Failed to parse stored data', e);
      }
    }
    setIsLoading(false);
  }, []);

  // Save to localStorage on state change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, isLoading]);

  // Add a new sub-entry
  const addSubEntry = (section: SectionType, name: string, amount: number = 0) => {
    const newEntry: SubEntry = {
      id: uuidv4(),
      name,
      amount,
    };
    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: [...prev.sections[section], newEntry],
      },
    }));
  };

  // Edit an existing sub-entry
  const editSubEntry = (section: SectionType, id: string, name: string, amount: number) => {
    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: prev.sections[section].map((entry) =>
          entry.id === id ? { ...entry, name, amount } : entry
        ),
      },
    }));
  };

  // Delete a sub-entry
  const deleteSubEntry = (section: SectionType, id: string) => {
    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: prev.sections[section].filter((entry) => entry.id !== id),
      },
    }));
  };

  // Get total for a section
  const getSectionTotal = (section: SectionType): number => {
    return state.sections[section].reduce((sum, entry) => sum + entry.amount, 0);
  };

  // Get total money across all sections
  const getTotalMoney = (): number => {
    return (Object.keys(state.sections) as SectionType[]).reduce(
      (sum, section) => sum + getSectionTotal(section),
      0
    );
  };

  // Get available money (excluding lend)
  const getAvailableMoney = (): number => {
    return getSectionTotal('cash') + getSectionTotal('bank') + getSectionTotal('mobile');
  };

  // Add money to a sub-entry
  const addMoney = (section: SectionType, subEntryId: string, amount: number, purpose: string) => {
    const transaction: Transaction = {
      id: uuidv4(),
      type: 'add',
      fromSection: section,
      fromSubEntry: subEntryId,
      amount,
      purpose,
      date: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: prev.sections[section].map((entry) =>
          entry.id === subEntryId ? { ...entry, amount: entry.amount + amount } : entry
        ),
      },
      transactions: [transaction, ...prev.transactions],
    }));
  };

  // Spend money from a sub-entry
  const spendMoney = (
    section: SectionType,
    subEntryId: string,
    amount: number,
    purpose: string
  ): boolean => {
    const entry = state.sections[section].find((e) => e.id === subEntryId);
    if (!entry || entry.amount < amount) {
      return false; // Insufficient balance
    }

    const transaction: Transaction = {
      id: uuidv4(),
      type: 'spend',
      fromSection: section,
      fromSubEntry: subEntryId,
      amount,
      purpose,
      date: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [section]: prev.sections[section].map((entry) =>
          entry.id === subEntryId ? { ...entry, amount: entry.amount - amount } : entry
        ),
      },
      transactions: [transaction, ...prev.transactions],
    }));

    return true;
  };

  // Transfer money between sub-entries
  const transferMoney = (
    fromSection: SectionType,
    fromSubEntryId: string,
    toSection: SectionType,
    toSubEntryId: string,
    amount: number,
    purpose: string
  ): boolean => {
    const fromEntry = state.sections[fromSection].find((e) => e.id === fromSubEntryId);
    if (!fromEntry || fromEntry.amount < amount) {
      return false; // Insufficient balance
    }

    const transaction: Transaction = {
      id: uuidv4(),
      type: 'transfer',
      fromSection,
      fromSubEntry: fromSubEntryId,
      toSection,
      toSubEntry: toSubEntryId,
      amount,
      purpose,
      date: new Date().toISOString(),
    };

    setState((prev) => {
      const newSections = { ...prev.sections };

      // Deduct from source
      newSections[fromSection] = newSections[fromSection].map((entry) =>
        entry.id === fromSubEntryId ? { ...entry, amount: entry.amount - amount } : entry
      );

      // Add to destination
      newSections[toSection] = newSections[toSection].map((entry) =>
        entry.id === toSubEntryId ? { ...entry, amount: entry.amount + amount } : entry
      );

      return {
        ...prev,
        sections: newSections,
        transactions: [transaction, ...prev.transactions],
      };
    });

    return true;
  };

  // Get recent transactions
  const getRecentTransactions = (limit: number = 5): Transaction[] => {
    return state.transactions.slice(0, limit);
  };

  // Get filtered transactions
  const getFilteredTransactions = (
    sectionFilter?: SectionType,
    typeFilter?: TransactionType
  ): Transaction[] => {
    return state.transactions.filter((t) => {
      const matchesSection = !sectionFilter || t.fromSection === sectionFilter || t.toSection === sectionFilter;
      const matchesType = !typeFilter || t.type === typeFilter;
      return matchesSection && matchesType;
    });
  };

  // Get total earned
  const getTotalEarned = (): number => {
    return state.transactions
      .filter((t) => t.type === 'add')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  // Get total spent
  const getTotalSpent = (): number => {
    return state.transactions
      .filter((t) => t.type === 'spend')
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const value: AppContextType = {
    state,
    isLoading,
    addSubEntry,
    editSubEntry,
    deleteSubEntry,
    getSectionTotal,
    getTotalMoney,
    getAvailableMoney,
    addMoney,
    spendMoney,
    transferMoney,
    getRecentTransactions,
    getFilteredTransactions,
    getTotalEarned,
    getTotalSpent,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
