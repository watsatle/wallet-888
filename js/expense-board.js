import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import { monthKey, fmt, escapeHtml, newId, todayDateStr, ICON_X } from './utils.js';
import { populateMonthOptions, getMonthSelect } from './month-nav.js';
import { showToast } from './toast.js';
import { t } from './i18n.js';

const eDate = document.getElementById('eDate');
const eCat = document.getElementById('eCat');
const eDesc = document.getElementById('eDesc');
const eAmount = document.getElementById('eAmount');
const eErr = document.getElementById('eErr');
const eCatSummary = document.getElementById('eCatSummary');
const expBoardTotal = document.getElementById('expBoardTotal');

let onChangeCallback = () => {};

export function getExpenseDateInput(){ return eDate; }
export function getExpenseCatSelect(){ return eCat; }

/** Renders the expense board as a category-summary accordion (same pattern
 * as the income board) for the currently-selected month — always the full
 * combined total across all wallets, wallets no longer filter transactions.
 * Returns the month's total expense. */
export function renderExpenseBoard(monthKeyValue){
  const key = monthKeyValue;
  const list = state.entries
    .filter(e => e.type === 'expense' && monthKey(e.date) === key)
    .sort((a, b) => a.date.localeCompare(b.date));

  const catTotals = {};
  let total = 0;
  list.forEach(e => {
    const amt = Number(e.amount);
    total += amt;
    catTotals[e.category] = (catTotals[e.category] || 0) + amt;
  });
  expBoardTotal.textContent = fmt(total);

  const openCats = new Set(Array.from(eCatSummary.querySelectorAll('details[open]')).map(d => d.dataset.cat));

  eCatSummary.innerHTML = '';
  state.expenseCats.forEach(c => {
    const val = catTotals[c] || 0;
    const rows = list.filter(e => e.category === c);

    const det = document.createElement('details');
    det.className = 'cat-details';
    det.dataset.cat = c;
    if (openCats.has(c)) det.open = true;

    const rowsHtml = rows.length === 0
      ? `<div class="cat-details-empty">${t('income.emptyMonth')}</div>`
      : `<div class="table-scroll"><table><thead><tr><th>วันที่</th><th>รายละเอียด</th><th style="text-align:right;">จำนวนเงิน</th><th></th></tr></thead><tbody>` +
        rows.map(e => `
          <tr>
            <td>${e.date}</td>
            <td>${escapeHtml(e.desc || '-')}</td>
            <td class="amt-out">-${fmt(e.amount)}</td>
            <td><button class="del-btn" data-ids="${e.id}" aria-label="ลบรายการ">${ICON_X}</button></td>
          </tr>`).join('') +
        `</tbody></table></div>`;

    det.innerHTML = `<summary class="cat-row"><span class="name">${escapeHtml(c)}</span><span class="amt">${fmt(val)}</span></summary><div class="cat-details-body">${rowsHtml}</div>`;
    eCatSummary.appendChild(det);
  });

  eCatSummary.querySelectorAll('.del-btn').forEach(btn => {
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

export function initExpenseBoard(onChange){
  onChangeCallback = onChange;
  if (!eDate.value) eDate.value = todayDateStr();

  document.getElementById('eAddBtn').addEventListener('click', async () => {
    eErr.style.display = 'none';
    const date = eDate.value;
    const category = eCat.value;
    const desc = eDesc.value.trim();
    const amount = parseFloat(eAmount.value);
    if (!date || !category || isNaN(amount) || amount <= 0){
      eErr.textContent = t('expense.errRequired');
      eErr.style.display = 'block';
      return;
    }
    state.entries.push({ id: newId(), date, category, desc, type: 'expense', amount });
    await saveState();
    updateDescMemory();
    eDesc.value = '';
    eAmount.value = '';
    populateMonthOptions();
    getMonthSelect().value = monthKey(date);
    showToast(t('expense.toastSaved'));
    onChangeCallback();
  });

  document.getElementById('eAddCatBtn').addEventListener('click', async () => {
    const input = document.getElementById('eNewCat');
    const val = input.value.trim();
    if (!val || state.expenseCats.includes(val)){ input.value = ''; return; }
    state.expenseCats.push(val);
    await saveState();
    populateCatSelect(eCat, state.expenseCats);
    eCat.value = val;
    input.value = '';
    onChangeCallback();
  });
}
