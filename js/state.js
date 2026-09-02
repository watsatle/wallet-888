// A single mutable state object shared by reference across modules.
// Other modules import { state } and read/write its properties directly
// (e.g. state.entries.push(...)); they must NOT reassign `state` itself.

import { DEFAULT_INCOME_CATS, DEFAULT_EXPENSE_CATS, DEFAULT_WALLETS, ALL_WALLETS } from './constants.js';

export const state = {
  entries: [],
  incomeCats: [...DEFAULT_INCOME_CATS],
  expenseCats: [...DEFAULT_EXPENSE_CATS],
  // startBalances[monthKey][walletName] = number. Starting balance is now
  // tracked per wallet, not globally — there is no single "ALL wallets"
  // starting balance stored; the combined view sums the per-wallet values.
  startBalances: {},
  dayRate: 1000,
  subtags: {},
  visitedMonths: new Set(),
  wallets: [...DEFAULT_WALLETS],
  activeWallet: ALL_WALLETS,
  language: 'th',

  // UI-only state
  modalDate: null,
  selectedSites: new Set(),
  activeTab: 'income',
  isFirstLoad: true
};
