import { state } from './state.js';
import { loadState } from './firebase-service.js';
import { fmt, todayMonthKey, todayDateStr } from './utils.js';
import { populateCatSelect, updateDescMemory } from './categories.js';
import { initTheme } from './theme.js';
import { initTabs, switchTab } from './tabs.js';
import { populateMonthOptions, getMonthSelect, initMonthNav, getStartBalance, setStartBalance, renderMonthStrip } from './month-nav.js';
import { renderIncomeCalendar } from './calendar.js';
import { openDayModal, initModal } from './modal.js';
import { renderIncomeBoard, initIncomeBoard } from './income-board.js';
import { renderExpenseBoard, initExpenseBoard, getExpenseDateInput, getExpenseCatSelect } from './expense-board.js';
import { renderCollectSummary, renderSubtagSummary, updateDetailSummaryVisibility, renderGfaRatePanel, initGfaRate } from './summary.js';
import { renderDashboardDonuts } from './mini-chart.js';
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

async function saveStartBalFromInput(){
  if (state.activeWallet === ALL_WALLETS) return;
  const key = getMonthSelect().value;
  const val = parseFloat(fStartBal.value);
  await setStartBalance(key, state.activeWallet, val);
}

let startBalDebounce = null;
fStartBal.addEventListener('input', () => {
  clearTimeout(startBalDebounce);
  const liveVal = parseFloat(fStartBal.value) || 0;
  const income = Number(document.getElementById('incBoardTotal').textContent.replace(/,/g, '')) || 0;
  const expense = Number(document.getElementById('expBoardTotal').textContent.replace(/,/g, '')) || 0;
  document.getElementById('sumStart').textContent = fmt(liveVal);
  document.getElementById('sumNet').textContent = fmt(liveVal + income - expense);
  startBalDebounce = setTimeout(async () => {
    await saveStartBalFromInput();
    // Don't call full render() here — it would fight with the cursor while typing.
  }, 700);
});
fStartBal.addEventListener('change', async () => {
  clearTimeout(startBalDebounce);
  await saveStartBalFromInput();
  render();
});
fStartBal.addEventListener('blur', async () => {
  clearTimeout(startBalDebounce);
  await saveStartBalFromInput();
  render();
});

document.getElementById('refreshBtn').addEventListener('click', async () => {
  statusLine.textContent = t('app.loadingLatest');
  await loadData();
});

switchTab('income');
loadData();
