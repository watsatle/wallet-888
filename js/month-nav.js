import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { monthKey, thMonthLabel, pad2, todayMonthKey } from './utils.js';
import { ALL_WALLETS } from './constants.js';

const monthSelect = document.getElementById('monthSelect');
const monthStrip = document.getElementById('monthStrip');

export function getMonthSelect(){ return monthSelect; }

/** Rebuilds the month dropdown from: months with entries, months with a
 * starting balance set, months the user has manually navigated to
 * (visitedMonths), and the current real-world month. Preserves the
 * currently-selected value if it still exists in the new option list. */
export function populateMonthOptions(){
  const keys = new Set(state.entries.map(e => monthKey(e.date)));
  Object.keys(state.startBalances).forEach(k => keys.add(k));
  state.visitedMonths.forEach(k => keys.add(k));
  keys.add(todayMonthKey());

  const sorted = Array.from(keys).sort().reverse();
  const prevValue = monthSelect.value;
  monthSelect.innerHTML = '';
  sorted.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = thMonthLabel(k);
    monthSelect.appendChild(opt);
  });
  if (sorted.includes(prevValue)) monthSelect.value = prevValue;
  renderMonthStrip();
}

/** Renders the full-width scrollable month strip that mirrors the hidden
 * <select>. Clicking a pill updates the select's value and fires a native
 * 'change' event so every existing listener keeps working untouched. */
export function renderMonthStrip(){
  monthStrip.innerHTML = '';
  Array.from(monthSelect.options).forEach(opt => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'month-pill' + (opt.value === monthSelect.value ? ' active' : '');
    pill.textContent = opt.textContent;
    pill.addEventListener('click', () => {
      monthSelect.value = opt.value;
      monthSelect.dispatchEvent(new Event('change'));
    });
    monthStrip.appendChild(pill);
  });
  const activeEl = monthStrip.querySelector('.month-pill.active');
  if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

/** Moves the selected month forward/back by `delta` months, adding the
 * target month to visitedMonths so it stays selectable even before it has
 * any data of its own. */
export async function shiftMonth(delta, onChange){
  const [y, m] = monthSelect.value.split('-').map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  const target = d.getFullYear() + '-' + pad2(d.getMonth() + 1);
  state.visitedMonths.add(target);
  populateMonthOptions();
  monthSelect.value = target;
  await saveState();
  onChange();
}

/** Starting balance is tracked per wallet. Reading it for ALL_WALLETS sums
 * every wallet's starting balance for that month (informational only). */
export function getStartBalance(monthKeyValue, wallet){
  const monthData = state.startBalances[monthKeyValue] || {};
  if (wallet === ALL_WALLETS){
    return Object.values(monthData).reduce((s, v) => s + (Number(v) || 0), 0);
  }
  return Number(monthData[wallet]) || 0;
}

export async function setStartBalance(monthKeyValue, wallet, amount){
  if (!state.startBalances[monthKeyValue]) state.startBalances[monthKeyValue] = {};
  state.startBalances[monthKeyValue][wallet] = isNaN(amount) ? 0 : amount;
  await saveState();
}

export function initMonthNav(onChange){
  document.getElementById('prevMonthBtn').addEventListener('click', () => shiftMonth(-1, onChange));
  document.getElementById('nextMonthBtn').addEventListener('click', () => shiftMonth(1, onChange));
  monthSelect.addEventListener('change', () => { renderMonthStrip(); onChange(); });
}
