// A single mutable state object shared by reference across modules.
// Other modules import { state } and read/write its properties directly
// (e.g. state.entries.push(...)); they must NOT reassign `state` itself.

import { DEFAULT_INCOME_CATS, DEFAULT_EXPENSE_CATS } from './constants.js';

export const state = {
  entries: [],
  incomeCats: [...DEFAULT_INCOME_CATS],
  expenseCats: [...DEFAULT_EXPENSE_CATS],
  startBalances: {},
  dayRate: 1000,
  subtags: {},
  visitedMonths: new Set(),

  // UI-only state
  modalDate: null,
  selectedSites: new Set(),
  activeTab: 'income',
  isFirstLoad: true
};
