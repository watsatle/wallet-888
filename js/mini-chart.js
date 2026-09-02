import { state } from './state.js';
import { monthKey, fmt } from './utils.js';
import { t } from './i18n.js';

function totalsFor(monthKeyValue){
  const inc = state.entries
    .filter(e => e.type === 'income' && monthKey(e.date) === monthKeyValue)
    .reduce((s, e) => s + Number(e.amount), 0);
  const exp = state.entries
    .filter(e => e.type === 'expense' && monthKey(e.date) === monthKeyValue)
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

/** Renders a single donut chart with the month's combined income vs
 * expense — always the true total across every wallet, since wallets no
 * longer filter transactions. */
export function renderDashboardDonuts(monthKeyValue){
  const combined = totalsFor(monthKeyValue);
  document.getElementById('miniChart').innerHTML = `
    <div class="donut-row">
      ${donutHtml(t('wallet.all'), combined.income, combined.expense)}
    </div>`;
}
