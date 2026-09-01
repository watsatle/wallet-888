import { state } from './state.js';
import { loadState, saveState } from './firebase-service.js';
import { fmt, todayMonthKey, todayDateStr } from './utils.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import { initTheme } from './theme.js';
import { initTabs, switchTab } from './tabs.js';
import { populateMonthOptions, getMonthSelect, initMonthNav } from './month-nav.js';
import { renderIncomeCalendar } from './calendar.js';
import { openDayModal, initModal } from './modal.js';
import { renderIncomeBoard, initIncomeBoard } from './income-board.js';
import { renderExpenseBoard, initExpenseBoard, getExpenseDateInput, getExpenseCatSelect } from './expense-board.js';
import { renderCollectSummary, renderSubtagSummary, updateDetailSummaryVisibility, renderGfaRatePanel, initGfaRate } from './summary.js';
import { renderMiniChart } from './mini-chart.js';
import { initReport } from './report.js';

const statusLine = document.getElementById('statusLine');
const fStartBal = document.getElementById('fStartBal');

function render(){
  const key = getMonthSelect().value;
  const startBal = state.startBalances[key] || 0;
  fStartBal.value = startBal;

  renderGfaRatePanel();

  const income = renderIncomeBoard(key);
  const expense = renderExpenseBoard(key);

  document.getElementById('sumStart').textContent = fmt(startBal);
  document.getElementById('sumIncome').textContent = fmt(income);
  document.getElementById('sumExpense').textContent = fmt(expense);
  document.getElementById('sumNet').textContent = fmt(startBal + income - expense);
  renderMiniChart(income, expense);

  renderIncomeCalendar(openDayModal);
  renderSubtagSummary(key);
  renderCollectSummary(key);
  updateDetailSummaryVisibility();
}

async function loadData(){
  statusLine.textContent = 'กำลังเข้าสู่ระบบ...';
  const result = await loadState();

  if (result.status === 'auth-failed'){
    statusLine.textContent = 'เข้าสู่ระบบไม่สำเร็จ: ' + result.message;
    return;
  }
  if (result.status === 'fetch-failed'){
    statusLine.textContent = 'โหลดข้อมูลไม่สำเร็จ — ข้อมูลเดิมยังปลอดภัย ลองกดรีเฟรชอีกครั้ง';
  }

  populateCatSelect(getExpenseCatSelect(), state.expenseCats);

  const prevMonth = getMonthSelect().value;
  populateMonthOptions();
  const currentMonthKey = todayMonthKey();
  if (state.isFirstLoad){
    if (Array.from(getMonthSelect().options).some(o => o.value === currentMonthKey)) getMonthSelect().value = currentMonthKey;
    state.isFirstLoad = false;
  } else if (prevMonth && Array.from(getMonthSelect().options).some(o => o.value === prevMonth)){
    getMonthSelect().value = prevMonth;
  }

  if (!getExpenseDateInput().value) getExpenseDateInput().value = todayDateStr();
  updateDescMemory();

  if (result.status === 'ok' || result.status === 'brand-new'){
    statusLine.textContent = 'ซิงก์กับ Firebase อัตโนมัติ เปิดจากอุปกรณ์ไหนก็เห็นข้อมูลเดิม';
  }
  render();
}

// ---- Wire everything up ----
initTheme();
initTabs();
initMonthNav(render);
initModal(render);
initIncomeBoard(render);
initExpenseBoard(render);
initGfaRate(render);
initReport(statusLine, render);

fStartBal.addEventListener('change', async () => {
  const key = getMonthSelect().value;
  const val = parseFloat(fStartBal.value);
  state.startBalances[key] = isNaN(val) ? 0 : val;
  await saveState();
  render();
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  statusLine.textContent = 'กำลังโหลดข้อมูลล่าสุด…';
  await loadData();
});

switchTab('income');
loadData();
