import { state } from './state.js';
import { CATEGORY_COLOR_PALETTE } from './constants.js';
import { monthKey, fmt } from './utils.js';
import { getStartBalance } from './month-nav.js';

function walletColor(name){
  const idx = state.wallets.indexOf(name);
  if (idx < 0) return '#8a8378';
  return CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length];
}

/** Real running balance for a wallet in a month:
 *   starting balance + income tagged to it − expenses tagged to it. */
function walletBalance(monthKeyValue, wallet){
  const start = getStartBalance(monthKeyValue, wallet);
  let bal = start;
  state.entries.forEach(e => {
    if (monthKey(e.date) !== monthKeyValue) return;
    if (e.type === 'transfer'){
      if (e.fromWallet === wallet) bal -= Number(e.amount);
      if (e.toWallet === wallet) bal += Number(e.amount);
      return;
    }
    if (e.wallet !== wallet) return;
    if (e.type === 'income') bal += Number(e.amount);
    else if (e.type === 'expense') bal -= Number(e.amount);
  });
  return bal;
}

/** Renders a bar chart of each wallet's running balance for the month, so
 * you can see how income/expense have moved each account. The bar length is
 * scaled by absolute value; negative balances are shown in red. */
export function renderWalletChart(monthKeyValue){
  const el = document.getElementById('walletChart');
  if (!el) return;

  const rows = state.wallets.map(w => ({ name: w, value: walletBalance(monthKeyValue, w) }));
  const max = Math.max(...rows.map(r => Math.abs(r.value)), 1);

  el.innerHTML = rows.map(r => {
    const isNeg = r.value < 0;
    const barColor = isNeg ? 'var(--red-soft)' : walletColor(r.name);
    const valColor = isNeg ? 'var(--red-soft)' : walletColor(r.name);
    return `
    <div class="mini-chart-row">
      <span class="mc-label" title="${r.name}">${r.name}</span>
      <div class="mc-track"><div class="mc-fill" style="width:${(Math.abs(r.value) / max) * 100}%;background:${barColor};"></div></div>
      <span class="mc-val" style="color:${valColor};">${fmt(r.value)}</span>
    </div>`;
  }).join('');
}
