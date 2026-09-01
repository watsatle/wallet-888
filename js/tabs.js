import { state } from './state.js';

export function switchTab(tab){
  state.activeTab = tab;
  document.getElementById('incomeBoardWrap').style.display = tab === 'income' ? 'block' : 'none';
  document.getElementById('expenseBoardWrap').style.display = tab === 'expense' ? 'block' : 'none';
  document.getElementById('tabIncomeBtn').classList.toggle('active', tab === 'income');
  document.getElementById('tabExpenseBtn').classList.toggle('active', tab === 'expense');
}

export function initTabs(){
  document.getElementById('tabIncomeBtn').addEventListener('click', () => switchTab('income'));
  document.getElementById('tabExpenseBtn').addEventListener('click', () => switchTab('expense'));
}
