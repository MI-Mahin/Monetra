// Types for Monetra Personal Finance Tracker

export type SectionType = 'cash' | 'bank' | 'mobile' | 'lend';

export interface SubEntry {
  id: string;
  name: string;
  amount: number;
}

export interface Sections {
  cash: SubEntry[];
  bank: SubEntry[];
  mobile: SubEntry[];
  lend: SubEntry[];
}

export type TransactionType = 'add' | 'spend' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  fromSection: SectionType;
  fromSubEntry: string;
  toSection?: SectionType;
  toSubEntry?: string;
  amount: number;
  purpose: string;
  date: string;
}

export interface AppState {
  sections: Sections;
  transactions: Transaction[];
}

export const SECTION_LABELS: Record<SectionType, string> = {
  cash: 'Cash',
  bank: 'Bank',
  mobile: 'Mobile Banking',
  lend: 'Lend',
};
