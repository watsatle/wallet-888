import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { DAY_RATE_CAT, JOB_FEE_TAGS, JOB_EXPENSE_TAGS } from './constants.js';
import { monthKey, fmt, escapeHtml } from './utils.js';
import { t } from './i18n.js';

export function renderCollectSummary(monthKeyValue){
  const key = monthKeyValue;
  const monthEntries = state.entries
    .filter(e => e.type === 'income' && e.category === '20fotoWedding' && monthKey(e.date) === key);
  const listEl = document.getElementById('collectSummaryList');
  const legend = document.getElementById('collectLegend');

  if (!state.incomeCats.includes('20fotoWedding')){
    listEl.innerHTML = '';
    legend.style.display = 'none';
    return;
  }

  let feeTotal = 0, expTotal = 0, otherTotal = 0;
  monthEntries.forEach(e => {
    const amt = Number(e.amount);
    if (JOB_FEE_TAGS.includes(e.desc)) feeTotal += amt;
    else if (JOB_EXPENSE_TAGS.includes(e.desc)) expTotal += amt;
    else otherTotal += amt;
  });

  const rows = [
    [t('collect.fee'), feeTotal],
    [t('collect.expense'), expTotal]
  ];
  if (otherTotal > 0) rows.push([t('collect.other'), otherTotal]);
  rows.push([t('collect.total'), feeTotal + expTotal + otherTotal]);

  legend.style.display = 'block';
  listEl.innerHTML = rows.map(([label, val], i) => {
    const isLast = i === rows.length - 1;
    return `<div class="cat-row"${isLast ? ' style="border-color:var(--gold);"' : ''}><span class="name">${escapeHtml(label)}</span><span class="amt"${isLast ? ' style="color:var(--gold-soft);"' : ''}>${fmt(val)}</span></div>`;
  }).join('');
}

export function renderSubtagSummary(monthKeyValue){
  const listEl = document.getElementById('subtagSummaryList');
  const key = monthKeyValue;
  const activeCats = Object.keys(state.subtags).filter(c => state.incomeCats.includes(c) && state.subtags[c] && state.subtags[c].length > 0);
  listEl.innerHTML = '';
  if (activeCats.length === 0) return;

  activeCats.forEach(cat => {
    const monthEntries = state.entries
      .filter(e => e.type === 'income' && e.category === cat && monthKey(e.date) === key);
    const totals = {};
    state.subtags[cat].forEach(t => totals[t] = 0);
    monthEntries.forEach(e => {
      const siteArr = (e.sites && e.sites.length) ? e.sites : (e.subtag ? [e.subtag] : []);
      siteArr.forEach(s => { totals[s] = (totals[s] || 0) + Number(e.amount); });
    });
    const rowsHtml = state.subtags[cat].map(t => `<div class="cat-row"><span class="name">${escapeHtml(t)}</span><span class="amt">${fmt(totals[t] || 0)}</span></div>`).join('');
    const group = document.createElement('div');
    group.className = 'subtag-group';
    group.innerHTML = `<div class="group-label">${escapeHtml(cat)}</div><div class="cat-summary">${rowsHtml}</div>`;
    listEl.appendChild(group);
  });
}

export function updateDetailSummaryVisibility(){
  const panel = document.getElementById('detailSummaryPanel');
  const activeSubtagCats = Object.keys(state.subtags).filter(c => state.incomeCats.includes(c) && state.subtags[c] && state.subtags[c].length > 0);
  const show = state.incomeCats.includes('20fotoWedding') || activeSubtagCats.length > 0;
  panel.style.display = show ? 'block' : 'none';
}

export function renderGfaRatePanel(){
  document.getElementById('gfaRatePanel').style.display = state.incomeCats.includes(DAY_RATE_CAT) ? 'block' : 'none';
  document.getElementById('gfaRate').value = state.dayRate;
}

export function initGfaRate(onChange){
  document.getElementById('gfaRate').addEventListener('change', async (ev) => {
    const val = parseFloat(ev.target.value);
    state.dayRate = isNaN(val) || val < 0 ? 0 : val;
    await saveState();
    onChange();
  });
}
