import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { updateDescMemory } from './categories.js';
import { monthKey, fmt, escapeHtml, groupIncomeEntries, ICON_X } from './utils.js';
import { populateMonthOptions } from './month-nav.js';
import { t } from './i18n.js';

const iCatSummary = document.getElementById('iCatSummary');
const incBoardTotal = document.getElementById('incBoardTotal');

let onChangeCallback = () => {};

/** Renders the income board's category-summary accordion for the currently
 * selected month (and active wallet filter), and returns the month's total income. */
export function renderIncomeBoard(monthKeyValue){
  const key = monthKeyValue;
  const list = state.entries
    .filter(e => e.type === 'income' && monthKey(e.date) === key)
    .sort((a, b) => a.date.localeCompare(b.date));

  const catTotals = {};
  let total = 0;
  list.forEach(e => {
    const amt = Number(e.amount);
    total += amt;
    catTotals[e.category] = (catTotals[e.category] || 0) + amt;
  });
  incBoardTotal.textContent = fmt(total);

  // Preserve which category rows the user currently has expanded across re-renders.
  const openCats = new Set(Array.from(iCatSummary.querySelectorAll('details[open]')).map(d => d.dataset.cat));

  iCatSummary.innerHTML = '';
  state.incomeCats.forEach(c => {
    const val = catTotals[c] || 0;
    const catEntries = list.filter(e => e.category === c);
    const groups = groupIncomeEntries(catEntries);

    const det = document.createElement('details');
    det.className = 'cat-details';
    det.dataset.cat = c;
    if (openCats.has(c)) det.open = true;

    const rowsHtml = groups.length === 0
      ? `<div class="cat-details-empty">${t('income.emptyMonth')}</div>`
      : `<div class="table-scroll"><table><thead><tr><th>วันที่</th><th>ไซต์</th><th>รายละเอียด</th><th style="text-align:right;">จำนวนเงิน</th><th></th></tr></thead><tbody>` +
        groups.map(g => `
          <tr>
            <td>${g.date}</td>
            <td>${g.site ? escapeHtml(g.site) : '-'}</td>
            <td>${escapeHtml(g.descs.join(', ') || '-')}</td>
            <td class="amt-in">+${fmt(g.amount)}</td>
            <td><button class="del-btn" data-ids="${g.ids.join(',')}" aria-label="ลบรายการ">${ICON_X}</button></td>
          </tr>`).join('') +
        `</tbody></table></div>`;

    det.innerHTML = `<summary class="cat-row"><span class="name">${escapeHtml(c)}</span><span class="amt">${fmt(val)}</span></summary><div class="cat-details-body">${rowsHtml}</div>`;
    iCatSummary.appendChild(det);
  });

  iCatSummary.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const ids = btn.getAttribute('data-ids').split(',');
      state.entries = state.entries.filter(e => !ids.includes(e.id));
      await saveState();
      updateDescMemory();
      populateMonthOptions();
      onChangeCallback();
    });
  });

  return total;
}

export function initIncomeBoard(onChange){
  onChangeCallback = onChange;

  document.getElementById('iAddCatBtn').addEventListener('click', async () => {
    const input = document.getElementById('iNewCat');
    const val = input.value.trim();
    if (!val || state.incomeCats.includes(val)){ input.value = ''; return; }
    state.incomeCats.push(val);
    await saveState();
    input.value = '';
    onChangeCallback();
  });
}
