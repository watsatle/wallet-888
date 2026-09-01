import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import {
  DAY_RATE_CAT, JOB_FEE_TAGS, JOB_EXPENSE_TAGS, TAG_TABLE_CATS
} from './constants.js';
import {
  monthKey, thDateLabel, escapeHtml, newId, siteLabel, lastAmountForDesc
} from './utils.js';
import { populateMonthOptions, getMonthSelect } from './month-nav.js';

// DOM refs
const overlay = document.getElementById('dayModalOverlay');
const modalDateLabel = document.getElementById('modalDateLabel');
const modalDayList = document.getElementById('modalDayList');
const mCat = document.getElementById('mCat');
const mDesc = document.getElementById('mDesc');
const mAmount = document.getElementById('mAmount');
const mErr = document.getElementById('mErr');
const mFullDayBtn = document.getElementById('mFullDayBtn');
const mSubtagField = document.getElementById('mSubtagField');
const mSubtagChips = document.getElementById('mSubtagChips');
const mNewSubtag = document.getElementById('mNewSubtag');
const mAddSubtagBtn = document.getElementById('mAddSubtagBtn');
const mTagErr = document.getElementById('mTagErr');

let onChangeCallback = () => {};

function renderSubtagField(){
  const cat = mCat.value;
  const tags = state.subtags[cat];
  if (!tags){ mSubtagField.style.display = 'none'; return; }
  mSubtagField.style.display = 'block';
  mSubtagChips.innerHTML = '';
  tags.forEach(t => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chip' + (state.selectedSites.has(t) ? ' active' : '');
    b.textContent = t;
    b.addEventListener('click', () => {
      if (state.selectedSites.has(t)) state.selectedSites.delete(t); else state.selectedSites.add(t);
      renderSubtagField();
    });
    mSubtagChips.appendChild(b);
  });
}

function renderTagTable(){
  const cat = mCat.value;
  const isTagCat = TAG_TABLE_CATS.includes(cat);
  document.getElementById('mTagTable').style.display = isTagCat ? 'block' : 'none';
  document.getElementById('mGenericFields').style.display = isTagCat ? 'none' : 'block';
  if (!isTagCat) return;

  const feeRows = document.getElementById('mFeeRows');
  const expRows = document.getElementById('mExpenseRows');
  feeRows.innerHTML = '';
  expRows.innerHTML = '';

  const buildRow = (tag) => {
    const row = document.createElement('div');
    row.className = 'tag-row';
    row.innerHTML = `<span class="tag-name">${escapeHtml(tag)}</span><input type="number" step="0.01" min="0" placeholder="0.00" data-tag="${escapeHtml(tag)}" class="tag-amt">`;
    return row;
  };
  JOB_FEE_TAGS.forEach(tag => feeRows.appendChild(buildRow(tag)));
  JOB_EXPENSE_TAGS.forEach(tag => expRows.appendChild(buildRow(tag)));
}

function renderModalDayList(){
  const list = state.entries
    .filter(e => e.type === 'income' && e.date === state.modalDate)
    .sort((a, b) => (a.id || '').localeCompare(b.id || ''));

  modalDayList.innerHTML = '';
  if (list.length === 0){
    modalDayList.innerHTML = '<div class="modal-empty">ยังไม่มีรายการของวันนี้</div>';
    return;
  }
  list.forEach(e => {
    const site = siteLabel(e);
    const row = document.createElement('div');
    row.className = 'modal-day-row';
    row.innerHTML = `
      <div class="info">
        <span class="cat-tag">${escapeHtml(e.category)}${site ? ' · ' + escapeHtml(site) : ''}</span>
        <span class="desc">${escapeHtml(e.desc || '-')}</span>
      </div>
      <span class="amt">${e.amount.toLocaleString('th-TH', { minimumFractionDigits: 2 })}</span>
      <button class="del-btn" data-id="${e.id}" aria-label="ลบรายการ">&times;</button>
    `;
    modalDayList.appendChild(row);
  });
  modalDayList.querySelectorAll('.del-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      state.entries = state.entries.filter(e => e.id !== btn.getAttribute('data-id'));
      await saveState();
      updateDescMemory();
      renderModalDayList();
      onChangeCallback({ closeModal: false });
    });
  });
}

export function openDayModal(dateStr){
  state.modalDate = dateStr;
  modalDateLabel.textContent = thDateLabel(dateStr);
  populateCatSelect(mCat, state.incomeCats);
  state.selectedSites = new Set();
  renderSubtagField();
  renderTagTable();
  mFullDayBtn.style.display = (mCat.value === DAY_RATE_CAT) ? 'block' : 'none';
  mDesc.value = '';
  mAmount.value = '';
  mErr.style.display = 'none';
  mTagErr.style.display = 'none';
  renderModalDayList();
  overlay.classList.add('open');
}

function closeDayModal(){
  overlay.classList.remove('open');
  state.modalDate = null;
  onChangeCallback({ closeModal: true });
}

export function initModal(onChange){
  onChangeCallback = onChange;

  mCat.addEventListener('change', () => {
    state.selectedSites = new Set();
    renderSubtagField();
    renderTagTable();
    mFullDayBtn.style.display = (mCat.value === DAY_RATE_CAT) ? 'block' : 'none';
  });

  mAddSubtagBtn.addEventListener('click', async () => {
    const cat = mCat.value;
    const val = mNewSubtag.value.trim();
    if (!val) return;
    if (!state.subtags[cat]) state.subtags[cat] = [];
    if (!state.subtags[cat].includes(val)) state.subtags[cat].push(val);
    await saveState();
    state.selectedSites.add(val);
    renderSubtagField();
    mNewSubtag.value = '';
  });

  mDesc.addEventListener('change', () => {
    if (!mAmount.value){
      const last = lastAmountForDesc(state.entries, 'income', mDesc.value.trim());
      if (last !== null) mAmount.value = last;
    }
  });

  mFullDayBtn.addEventListener('click', () => {
    mDesc.value = mDesc.value.trim() ? mDesc.value : 'วันทำงาน';
    mAmount.value = state.dayRate;
  });

  document.getElementById('mAddBtn').addEventListener('click', async () => {
    mErr.style.display = 'none';
    const category = mCat.value;
    const desc = mDesc.value.trim();
    const amount = parseFloat(mAmount.value);
    if (!state.modalDate || !category || isNaN(amount) || amount <= 0){
      mErr.textContent = 'เลือกหมวดหมู่และกรอกจำนวนเงินให้ถูกต้อง (มากกว่า 0)';
      mErr.style.display = 'block';
      return;
    }
    const sites = Array.from(state.selectedSites);
    state.entries.push({
      id: newId(), date: state.modalDate, category, desc, type: 'income', amount,
      sites: sites.length ? sites : undefined
    });
    await saveState();
    updateDescMemory();
    mDesc.value = '';
    mAmount.value = '';
    populateMonthOptions();
    getMonthSelect().value = monthKey(state.modalDate);
    renderModalDayList();
    onChangeCallback({ closeModal: false });
  });

  document.getElementById('mTagAddBtn').addEventListener('click', async () => {
    mTagErr.style.display = 'none';
    const category = mCat.value;
    const sites = Array.from(state.selectedSites);
    const inputs = Array.from(document.querySelectorAll('.tag-amt'));
    const toAdd = [];
    for (const inp of inputs){
      const v = parseFloat(inp.value);
      if (!isNaN(v) && v > 0){
        toAdd.push({
          id: newId(), date: state.modalDate, category, desc: inp.getAttribute('data-tag'),
          type: 'income', amount: v, sites: sites.length ? sites : undefined
        });
      }
    }
    if (toAdd.length === 0){
      mTagErr.textContent = 'กรอกจำนวนเงินอย่างน้อย 1 ช่อง';
      mTagErr.style.display = 'block';
      return;
    }
    state.entries.push(...toAdd);
    await saveState();
    updateDescMemory();
    inputs.forEach(inp => inp.value = '');
    populateMonthOptions();
    getMonthSelect().value = monthKey(state.modalDate);
    renderModalDayList();
    onChangeCallback({ closeModal: false });
  });

  document.getElementById('modalCloseBtn').addEventListener('click', closeDayModal);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeDayModal(); });
}
