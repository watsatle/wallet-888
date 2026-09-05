import { state } from './state.js';
import { CATEGORY_COLOR_PALETTE } from './constants.js';
import { monthKey, fmt, escapeHtml } from './utils.js';
import { getStartBalance } from './month-nav.js';
import { t } from './i18n.js';

function walletColor(name){
  const idx = state.wallets.indexOf(name);
  if (idx < 0) return '#8a8378';
  return CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length];
}

/** Computes a full monthly breakdown for one wallet. */
function walletStats(monthKeyValue, wallet){
  const start = getStartBalance(monthKeyValue, wallet);
  let income = 0, expense = 0, transferIn = 0, transferOut = 0;
  state.entries.forEach(e => {
    if (monthKey(e.date) !== monthKeyValue) return;
    if (e.type === 'transfer'){
      if (e.fromWallet === wallet) transferOut += Number(e.amount);
      if (e.toWallet === wallet) transferIn += Number(e.amount);
      return;
    }
    if (e.wallet !== wallet) return;
    if (e.type === 'income') income += Number(e.amount);
    else if (e.type === 'expense') expense += Number(e.amount);
  });

  const ending = start + income + transferIn - expense - transferOut;
  const netChange = ending - start;

  // "Available" = everything that came into the wallet this month (starting
  // balance + income + transfers in). % used = money out / available.
  const available = start + income + transferIn;
  const totalOut = expense + transferOut;
  const pctUsed = available > 0 ? (totalOut / available) * 100 : 0;

  return { start, income, expense, transferIn, transferOut, ending, netChange, available, totalOut, pctUsed };
}

/** Renders a per-wallet monthly summary: starting balance, money in/out,
 * net change (+/- with color), ending balance, and % of available spent.
 * Real-time — re-runs on every render, no button needed. */
export function renderWalletSummary(monthKeyValue){
  const el = document.getElementById('walletSummary');
  if (!el) return;

  el.innerHTML = state.wallets.map(w => {
    const s = walletStats(monthKeyValue, w);
    const col = walletColor(w);
    const netColor = s.netChange >= 0 ? 'var(--green-soft)' : 'var(--red-soft)';
    const netSign = s.netChange >= 0 ? '+' : '';
    const pctClamped = Math.min(100, Math.max(0, s.pctUsed));
    const pctColor = s.pctUsed > 90 ? 'var(--red-soft)' : (s.pctUsed > 70 ? 'var(--gold-soft)' : 'var(--green-soft)');

    return `
      <details class="cat-details wallet-summary-item">
        <summary class="cat-row">
          <span class="name"><span class="ws-dot" style="background:${col};"></span>${escapeHtml(w)}</span>
          <span class="amt" style="color:${netColor};">${netSign}${fmt(s.netChange)}</span>
        </summary>
        <div class="cat-details-body">
          <div class="ws-grid">
            <div class="ws-cell"><span class="ws-label">${t('ws.start')}</span><span class="ws-val">${fmt(s.start)}</span></div>
            <div class="ws-cell"><span class="ws-label">${t('ws.in')}</span><span class="ws-val" style="color:var(--green-soft);">+${fmt(s.income + s.transferIn)}</span></div>
            <div class="ws-cell"><span class="ws-label">${t('ws.out')}</span><span class="ws-val" style="color:var(--red-soft);">-${fmt(s.totalOut)}</span></div>
            <div class="ws-cell"><span class="ws-label">${t('ws.ending')}</span><span class="ws-val" style="font-weight:700;">${fmt(s.ending)}</span></div>
          </div>
          <div class="ws-bar-label"><span>${t('ws.pctUsed')}</span><span style="color:${pctColor};font-weight:700;">${s.pctUsed.toFixed(0)}%</span></div>
          <div class="ws-bar-track"><div class="ws-bar-fill" style="width:${pctClamped}%;background:${pctColor};"></div></div>
        </div>
      </details>`;
  }).join('');
}
