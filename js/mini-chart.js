import { state } from './state.js';
import { ALL_WALLETS } from './constants.js';
import { monthKey, fmt } from './utils.js';
import { t } from './i18n.js';

function totalsFor(monthKeyValue, wallet){
  const inc = state.entries
    .filter(e => e.type === 'income' && monthKey(e.date) === monthKeyValue)
    .filter(e => wallet === ALL_WALLETS || e.wallet === wallet)
    .reduce((s, e) => s + Number(e.amount), 0);
  const exp = state.entries
    .filter(e => e.type === 'expense' && monthKey(e.date) === monthKeyValue)
    .filter(e => wallet === ALL_WALLETS || e.wallet === wallet)
    .reduce((s, e) => s + Number(e.amount), 0);
  return { income: inc, expense: exp };
}

function donutHtml(label, income, expense){
  const total = income + expense;
  const incomePct = total > 0 ? (income / total) * 100 : 0;
  const gradient = total > 0
    ? `conic-gradient(var(--green-soft) 0% ${incomePct}%, var(--red-soft) ${incomePct}% 100%)`
    : `var(--line-soft)`;
  return `
    <div class="donut-block">
      <div class="donut" style="background:${gradient};">
        <div class="donut-hole">
          <span class="donut-net">${fmt(income - expense)}</span>
        </div>
      </div>
      <div class="donut-label">${label}</div>
      <div class="donut-legend">
        <span style="color:var(--green-soft);">+${fmt(income)}</span>
        <span style="color:var(--red-soft);">-${fmt(expense)}</span>
      </div>
    </div>`;
}

/** Renders two small donut charts side by side: totals combined across all
 * wallets, and totals for the wallet currently selected in the wallet
 * strip (which may be the same as "combined" if ALL is selected). */
export function renderDashboardDonuts(monthKeyValue){
  const combined = totalsFor(monthKeyValue, ALL_WALLETS);
  const selectedLabel = state.activeWallet === ALL_WALLETS ? t('wallet.all') : state.activeWallet;
  const selected = totalsFor(monthKeyValue, state.activeWallet);

  document.getElementById('miniChart').innerHTML = `
    <div class="donut-row">
      ${donutHtml(t('wallet.all'), combined.income, combined.expense)}
      ${donutHtml(selectedLabel, selected.income, selected.expense)}
    </div>`;
}
