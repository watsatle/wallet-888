import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import { monthKey, fmt, escapeHtml, newId, todayDateStr } from './utils.js';
import { populateMonthOptions, getMonthSelect } from './month-nav.js';

const eDate = document.getElementById('eDate');
const eCat = document.getElementById('eCat');
const eDesc = document.getElementById('eDesc');
const eAmount = document.getElementById('eAmount');
const eErr = document.getElementById('eErr');
const eEntriesBody = document.getElementById('eEntriesBody');
const eEmptyMsg = document.getElementById('eEmptyMsg');
const eCatSummary = document.getElementById('eCatSummary');
const expBoardTotal = document.getElementById('expBoardTotal');

let onChangeCallback = () => {};

export function getExpenseDateInput(){ return eDate; }
export function getExpenseCatSelect(){ return eCat; }

/** Renders the expense board (category summary + full entries table) for
 * the currently-selected month, and returns the month's total expense. */
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

  eEntriesBody.innerHTML = '';
  if (list.length === 0){
    eEmptyMsg.style.display = 'block';
    eEmptyMsg.textContent = 'ยังไม่มีรายจ่ายในเดือนนี้';
  } else {
    eEmptyMsg.style.display = 'none';
    list.forEach(e => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${e.date}</td>
        <td><span class="cat-tag">${escapeHtml(e.category)}</span></td>
        <td>${escapeHtml(e.desc || '-')}</td>
        <td class="amt-out">-${fmt(e.amount)}</td>
        <td><button class="del-btn" data-ids="${e.id}" aria-label="ลบรายการ">&times;</button></td>
      `;
      eEntriesBody.appendChild(tr);
    });
  }

  eCatSummary.innerHTML = '';
  state.expenseCats.forEach(c => {
    const val = catTotals[c] || 0;
    const row = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `<span class="name">${escapeHtml(c)}</span><span class="amt">${fmt(val)}</span>`;
    eCatSummary.appendChild(row);
  });

  eEntriesBody.querySelectorAll('.del-btn').forEach(btn => {
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
      eErr.textContent = 'กรอกวันที่และจำนวนเงินให้ถูกต้อง (มากกว่า 0)';
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
