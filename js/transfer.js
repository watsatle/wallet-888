import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { populateCatSelect } from './categories.js';
import { monthKey, newId, todayDateStr } from './utils.js';
import { populateMonthOptions, getMonthSelect } from './month-nav.js';
import { showToast } from './toast.js';
import { t } from './i18n.js';

const overlay = document.getElementById('transferModalOverlay');
const trDate = document.getElementById('trDate');
const trFrom = document.getElementById('trFrom');
const trTo = document.getElementById('trTo');
const trAmount = document.getElementById('trAmount');
const trDesc = document.getElementById('trDesc');
const trErr = document.getElementById('trErr');

let onChangeCallback = () => {};

function openTransferModal(){
  populateCatSelect(trFrom, state.wallets);
  populateCatSelect(trTo, state.wallets);
  // Default "to" to the second wallet so from/to aren't identical out of the box.
  if (state.wallets.length > 1) trTo.value = state.wallets[1];
  if (!trDate.value) trDate.value = todayDateStr();
  trAmount.value = '';
  trDesc.value = '';
  trErr.style.display = 'none';
  overlay.classList.add('open');
}

function closeTransferModal(){
  overlay.classList.remove('open');
}

export function initTransfer(onChange){
  onChangeCallback = onChange;

  document.getElementById('transferBtn').addEventListener('click', openTransferModal);
  document.getElementById('transferCloseBtn').addEventListener('click', closeTransferModal);
  overlay.addEventListener('click', (ev) => { if (ev.target === overlay) closeTransferModal(); });

  document.getElementById('trSaveBtn').addEventListener('click', async () => {
    trErr.style.display = 'none';
    const date = trDate.value;
    const fromWallet = trFrom.value;
    const toWallet = trTo.value;
    const amount = parseFloat(trAmount.value);
    const desc = trDesc.value.trim();

    if (isNaN(amount) || amount <= 0){
      trErr.textContent = t('transfer.errAmount');
      trErr.style.display = 'block';
      return;
    }
    if (fromWallet === toWallet){
      trErr.textContent = t('transfer.errSame');
      trErr.style.display = 'block';
      return;
    }

    state.entries.push({
      id: newId(), date, type: 'transfer', fromWallet, toWallet, amount, desc
    });
    await saveState();
    populateMonthOptions();
    getMonthSelect().value = monthKey(date);
    showToast(t('transfer.saved', { from: fromWallet, to: toWallet }));
    closeTransferModal();
    onChangeCallback();
  });
}
