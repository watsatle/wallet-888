import { state } from './state.js';
import { loadState, saveState } from './firebase-service.js';
import { fmt, todayMonthKey, todayDateStr } from './utils.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import { initTheme } from './theme.js';
import { initTabs, switchTab } from './tabs.js';
import { populateMonthOptions, getMonthSelect, initMonthNav, getStartBalance, commitStartBalance, renderMonthStrip } from './month-nav.js';
import { renderIncomeCalendar } from './calendar.js';
import { openDayModal, initModal } from './modal.js';
import { renderIncomeBoard, initIncomeBoard } from './income-board.js';
import { renderExpenseBoard, initExpenseBoard, getExpenseDateInput, getExpenseCatSelect } from './expense-board.js';
import { renderCollectSummary, renderSubtagSummary, updateDetailSummaryVisibility, renderGfaRatePanel, initGfaRate } from './summary.js';
import { renderDashboardDonuts } from './mini-chart.js';
import { renderWalletChart } from './wallet-chart.js';
import { initReport } from './report.js';
import { initWalletSelector, renderWalletSelector } from './wallets.js';
import { initSettingsMenu } from './settings.js';
import { ALL_WALLETS } from './constants.js';
import { t, initLanguage, applyStaticTranslations, setLanguage } from './i18n.js';

const statusLine = document.getElementById('statusLine');
const fStartBal = document.getElementById('fStartBal');
const startBalWrap = document.getElementById('startBalWrap');

function render(){
  const key = getMonthSelect().value;

  renderWalletSelector();
  renderGfaRatePanel();

  const isAll = state.activeWallet === ALL_WALLETS;
  const startBal = getStartBalance(key, state.activeWallet);
  startBalWrap.style.display = isAll ? 'none' : 'flex';
  if (!isAll){
    fStartBal.value = startBal;
    document.getElementById('startBalWalletLabel').textContent = state.activeWallet;
  }

  const income = renderIncomeBoard(key);
  const expense = renderExpenseBoard(key);

  document.getElementById('sumStart').textContent = fmt(startBal);
  document.getElementById('sumIncome').textContent = fmt(income);
  document.getElementById('sumExpense').textContent = fmt(expense);
  document.getElementById('sumNet').textContent = fmt(startBal + income - expense);
  renderDashboardDonuts(key);
  renderWalletChart(key);

  renderIncomeCalendar(openDayModal);
  renderSubtagSummary(key);
  renderCollectSummary(key);
  updateDetailSummaryVisibility();
}

async function loadData(){
  statusLine.textContent = t('app.loggingIn');
  const result = await loadState();

  if (result.status === 'auth-failed'){
    statusLine.textContent = t('app.authFailed') + ' ' + result.message;
    return;
  }
  if (result.status === 'fetch-failed'){
    statusLine.textContent = t('app.fetchFailed');
  }

  populateCatSelect(getExpenseCatSelect(), state.expenseCats);

  const prevMonth = getMonthSelect().value;
  populateMonthOptions();
  const currentMonthKey = todayMonthKey();
  if (state.isFirstLoad){
    if (Array.from(getMonthSelect().options).some(o => o.value === currentMonthKey)) getMonthSelect().value = currentMonthKey;
    state.isFirstLoad = false;
    renderMonthStrip();
  } else if (prevMonth && Array.from(getMonthSelect().options).some(o => o.value === prevMonth)){
    getMonthSelect().value = prevMonth;
    renderMonthStrip();
  }

  if (!getExpenseDateInput().value) getExpenseDateInput().value = todayDateStr();
  updateDescMemory();

  if (result.status === 'ok' || result.status === 'brand-new'){
    statusLine.textContent = t('app.synced');
  }
  render();
}

// ---- Wire everything up ----
initLanguage();
applyStaticTranslations();
initTheme();
initTabs();
initMonthNav(render);
initModal(render);
initIncomeBoard(render);
initExpenseBoard(render);
initGfaRate(render);
initReport(statusLine, render);
initWalletSelector(render);
initSettingsMenu();

function updateLangButtons(){
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.getAttribute('data-lang') === state.language);
  });
}
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', async () => {
    await setLanguage(btn.getAttribute('data-lang'), render);
    updateLangButtons();
  });
});
updateLangButtons();

let saveDebounce = null;
function commitFromInput(){
  if (state.activeWallet === ALL_WALLETS) return;
  const key = getMonthSelect().value;
  const val = parseFloat(fStartBal.value);
  // Synchronous — always correct immediately, regardless of what happens next.
  commitStartBalance(key, state.activeWallet, val);
}

fStartBal.addEventListener('input', () => {
  commitFromInput();
  const liveVal = parseFloat(fStartBal.value) || 0;
  const income = Number(document.getElementById('incBoardTotal').textContent.replace(/,/g, '')) || 0;
  const expense = Number(document.getElementById('expBoardTotal').textContent.replace(/,/g, '')) || 0;
  document.getElementById('sumStart').textContent = fmt(liveVal);
  document.getElementById('sumNet').textContent = fmt(liveVal + income - expense);
  clearTimeout(saveDebounce);
  // State is already correct at this point (commitFromInput above) — this
  // debounce only delays the network write, so it's safe even if the user
  // switches wallet/month/tab before it fires.
  saveDebounce = setTimeout(() => { saveState(); }, 400);
});
fStartBal.addEventListener('change', () => {
  clearTimeout(saveDebounce);
  commitFromInput();
  saveState();
  render();
});
fStartBal.addEventListener('blur', () => {
  clearTimeout(saveDebounce);
  commitFromInput();
  saveState();
  render();
});

// Mobile browsers throttle or fully pause setTimeout in a backgrounded tab,
// so a debounced network write can get silently dropped when the user
// switches away (another app, another tab, locking the screen). The value
// itself is always already safe in memory (commitFromInput runs
// synchronously on every keystroke), so on hide we just need to flush the
// pending write immediately instead of waiting on the timer.
document.addEventListener('visibilitychange', async () => {
  if (document.hidden){
    clearTimeout(saveDebounce);
    await saveState();
  } else {
    await loadData();
  }
});
window.addEventListener('pagehide', () => {
  if (startBalPendingSave){
    clearTimeout(startBalDebounce);
    // Fire-and-forget: the page may be gone before this resolves, but this
    // still gives the browser a chance to flush the request.
    saveStartBalFromInput();
  }
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  statusLine.textContent = t('app.loadingLatest');
  await loadData();
});

switchTab('income');
loadData();
