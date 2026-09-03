import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { DEFAULT_INCOME_CATS, DEFAULT_EXPENSE_CATS, SUBTAG_DEFAULTS, JOB_FEE_TAGS, JOB_EXPENSE_TAGS } from './constants.js';
import { monthKey, fmt, escapeHtml, thMonthLabel, siteLabel } from './utils.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import { t } from './i18n.js';
import { populateMonthOptions, getMonthSelect } from './month-nav.js';
import { getExpenseCatSelect } from './expense-board.js';

function buildPrintReport(){
  const key = getMonthSelect().value;
  const startBal = state.startBalances[key] || 0;
  const incList = state.entries.filter(e => e.type === 'income' && monthKey(e.date) === key).sort((a, b) => a.date.localeCompare(b.date));
  const expList = state.entries.filter(e => e.type === 'expense' && monthKey(e.date) === key).sort((a, b) => a.date.localeCompare(b.date));
  const incTotal = incList.reduce((s, e) => s + Number(e.amount), 0);
  const expTotal = expList.reduce((s, e) => s + Number(e.amount), 0);

  const incByCat = {};
  incList.forEach(e => { incByCat[e.category] = (incByCat[e.category] || 0) + Number(e.amount); });
  const expByCat = {};
  expList.forEach(e => { expByCat[e.category] = (expByCat[e.category] || 0) + Number(e.amount); });

  let html = `<h1>รายงานรายรับ-รายจ่าย — ${thMonthLabel(key)}</h1>`;
  html += `<div class="sub">ยอดยกมาต้นเดือน ${fmt(startBal)} บาท · รายรับรวม ${fmt(incTotal)} · รายจ่ายรวม ${fmt(expTotal)} · คงเหลือสิ้นเดือน ${fmt(startBal + incTotal - expTotal)} บาท</div>`;

  html += `<h2>สรุปรายรับตามหมวดหมู่</h2><table><tr><th>หมวดหมู่</th><th class="r">ยอดรวม</th></tr>`;
  state.incomeCats.forEach(c => { html += `<tr><td>${escapeHtml(c)}</td><td class="r">${fmt(incByCat[c] || 0)}</td></tr>`; });
  html += `<tr class="totalrow"><td>รวมรายรับ</td><td class="r">${fmt(incTotal)}</td></tr></table>`;

  if (state.incomeCats.includes('20fotoWedding')){
    const monthEntries = incList.filter(e => e.category === '20fotoWedding');
    let feeTotal = 0, expTotal20 = 0, otherTotal = 0;
    monthEntries.forEach(e => {
      const amt = Number(e.amount);
      if (JOB_FEE_TAGS.includes(e.desc)) feeTotal += amt;
      else if (JOB_EXPENSE_TAGS.includes(e.desc)) expTotal20 += amt;
      else otherTotal += amt;
    });
    html += `<h2>สรุปเรียกเก็บเงิน 20foto</h2><table><tr><th>รายการ</th><th class="r">ยอด</th></tr>
      <tr><td>ค่าจ้าง / ค่างาน</td><td class="r">${fmt(feeTotal)}</td></tr>
      <tr><td>ค่าใช้จ่ายสำรองจ่าย (รอเบิกคืน)</td><td class="r">${fmt(expTotal20)}</td></tr>
      ${otherTotal > 0 ? `<tr><td>อื่นๆ</td><td class="r">${fmt(otherTotal)}</td></tr>` : ''}
      <tr class="totalrow"><td>ยอดรวมเรียกเก็บ</td><td class="r">${fmt(feeTotal + expTotal20 + otherTotal)}</td></tr></table>`;
  }

  html += `<h2>รายการรายรับทั้งหมด</h2><table><tr><th>วันที่</th><th>เจ้า/หมวด</th><th>กระเป๋า</th><th>ไซต์</th><th>รายละเอียด</th><th class="r">จำนวนเงิน</th></tr>`;
  incList.forEach(e => {
    html += `<tr><td>${e.date}</td><td>${escapeHtml(e.category)}</td><td>${escapeHtml(e.wallet || '-')}</td><td>${escapeHtml(siteLabel(e))}</td><td>${escapeHtml(e.desc || '-')}</td><td class="r">${fmt(e.amount)}</td></tr>`;
  });
  html += `</table>`;

  html += `<h2>สรุปรายจ่ายตามหมวดหมู่</h2><table><tr><th>หมวดหมู่</th><th class="r">ยอดรวม</th></tr>`;
  state.expenseCats.forEach(c => { html += `<tr><td>${escapeHtml(c)}</td><td class="r">${fmt(expByCat[c] || 0)}</td></tr>`; });
  html += `<tr class="totalrow"><td>รวมรายจ่าย</td><td class="r">${fmt(expTotal)}</td></tr></table>`;

  html += `<h2>รายการรายจ่ายทั้งหมด</h2><table><tr><th>วันที่</th><th>หมวด</th><th>กระเป๋า</th><th>รายละเอียด</th><th class="r">จำนวนเงิน</th></tr>`;
  expList.forEach(e => {
    html += `<tr><td>${e.date}</td><td>${escapeHtml(e.category)}</td><td>${escapeHtml(e.wallet || '-')}</td><td>${escapeHtml(e.desc || '-')}</td><td class="r">${fmt(e.amount)}</td></tr>`;
  });
  html += `</table>`;

  const trList = state.entries.filter(e => e.type === 'transfer' && monthKey(e.date) === key).sort((a, b) => a.date.localeCompare(b.date));
  if (trList.length){
    html += `<h2>${t('transfer.title')}</h2><table><tr><th>${t('field.date')}</th><th>${t('transfer.from')}</th><th>${t('transfer.to')}</th><th>${t('field.desc')}</th><th class="r">${t('field.amount')}</th></tr>`;
    trList.forEach(e => {
      html += `<tr><td>${e.date}</td><td>${escapeHtml(e.fromWallet || '-')}</td><td>${escapeHtml(e.toWallet || '-')}</td><td>${escapeHtml(e.desc || '-')}</td><td class="r">${fmt(e.amount)}</td></tr>`;
    });
    html += `</table>`;
  }

  document.getElementById('printReport').innerHTML = html;
}

function exportBackup(statusLine){
  const backup = {
    exportedAt: new Date().toISOString(),
    entries: state.entries,
    incomeCategories: state.incomeCats,
    expenseCategories: state.expenseCats,
    startBalances: state.startBalances,
    dayRate: state.dayRate,
    subtags: state.subtags,
    visitedMonths: Array.from(state.visitedMonths)
  };
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `billing-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  statusLine.textContent = t('export.success', { n: state.entries.length });
}

async function importBackup(file, statusLine, onChange){
  const ok = confirm(t('import.confirm'));
  if (!ok) return;
  try{
    const text = await file.text();
    const data = JSON.parse(text);
    state.entries = Array.isArray(data.entries) ? data.entries : [];
    state.incomeCats = (data.incomeCategories && data.incomeCategories.length) ? data.incomeCategories : [...DEFAULT_INCOME_CATS];
    state.expenseCats = (data.expenseCategories && data.expenseCategories.length) ? data.expenseCategories : [...DEFAULT_EXPENSE_CATS];
    state.startBalances = data.startBalances || {};
    state.dayRate = (typeof data.dayRate === 'number') ? data.dayRate : 1000;
    state.subtags = data.subtags || {};
    Object.keys(SUBTAG_DEFAULTS).forEach(c => { if (!state.subtags[c]) state.subtags[c] = [...SUBTAG_DEFAULTS[c]]; });
    state.visitedMonths = new Set(data.visitedMonths || []);

    await saveState();
    populateCatSelect(getExpenseCatSelect(), state.expenseCats);
    populateMonthOptions();
    updateDescMemory();
    statusLine.textContent = t('import.success', { n: state.entries.length });
    onChange();
  }catch(e){
    statusLine.textContent = t('import.failed');
  }
}

export function initReport(statusLine, onChange){
  document.getElementById('printReportBtn').addEventListener('click', () => {
    buildPrintReport();
    setTimeout(() => window.print(), 50);
  });

  document.getElementById('exportBackupBtn').addEventListener('click', () => exportBackup(statusLine));

  document.getElementById('importBackupBtn').addEventListener('click', () => {
    document.getElementById('importFileInput').click();
  });
  document.getElementById('importFileInput').addEventListener('change', async (ev) => {
    const file = ev.target.files[0];
    ev.target.value = '';
    if (!file) return;
    await importBackup(file, statusLine, onChange);
  });
}
