import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { monthKey, thMonthLabel, pad2, todayMonthKey } from './utils.js';

const monthSelect = document.getElementById('monthSelect');

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

export function initMonthNav(onChange){
  document.getElementById('prevMonthBtn').addEventListener('click', () => shiftMonth(-1, onChange));
  document.getElementById('nextMonthBtn').addEventListener('click', () => shiftMonth(1, onChange));
  monthSelect.addEventListener('change', onChange);
}
