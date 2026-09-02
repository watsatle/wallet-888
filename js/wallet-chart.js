import { state } from './state.js';
import { CATEGORY_COLOR_PALETTE } from './constants.js';
import { fmt } from './utils.js';
import { getStartBalance } from './month-nav.js';

function walletColor(name){
  const idx = state.wallets.indexOf(name);
  if (idx < 0) return '#8a8378';
  return CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length];
}

/** Renders a simple combined bar chart showing each wallet's entered
 * balance for the month, so you can see how the "all combined" total
 * breaks down across accounts at a glance. */
export function renderWalletChart(monthKeyValue){
  const el = document.getElementById('walletChart');
  if (!el) return;

  const rows = state.wallets.map(w => ({ name: w, value: getStartBalance(monthKeyValue, w) }));
  const max = Math.max(...rows.map(r => r.value), 1);

  el.innerHTML = rows.map(r => `
    <div class="mini-chart-row">
      <span class="mc-label" title="${r.name}">${r.name}</span>
      <div class="mc-track"><div class="mc-fill" style="width:${(r.value / max) * 100}%;background:${walletColor(r.name)};"></div></div>
      <span class="mc-val" style="color:${walletColor(r.name)};">${fmt(r.value)}</span>
    </div>`).join('');
}
