import { state } from './state.js';
import { saveState } from './firebase-service.js';
import { ALL_WALLETS } from './constants.js';
import { escapeHtml } from './utils.js';
import { t } from './i18n.js';

const walletStrip = document.getElementById('walletStrip');

let onChangeCallback = () => {};

export function renderWalletSelector(){
  walletStrip.innerHTML = '';

  const allPill = document.createElement('button');
  allPill.type = 'button';
  allPill.className = 'wallet-pill' + (state.activeWallet === ALL_WALLETS ? ' active' : '');
  allPill.textContent = t('wallet.all');
  allPill.addEventListener('click', () => selectWallet(ALL_WALLETS));
  walletStrip.appendChild(allPill);

  state.wallets.forEach(w => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'wallet-pill' + (state.activeWallet === w ? ' active' : '');
    pill.textContent = w;
    pill.addEventListener('click', () => selectWallet(w));
    walletStrip.appendChild(pill);
  });

  const addPill = document.createElement('button');
  addPill.type = 'button';
  addPill.className = 'wallet-pill wallet-pill-add';
  addPill.setAttribute('aria-label', t('wallet.addNew'));
  addPill.innerHTML = '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
  addPill.addEventListener('click', addWallet);
  walletStrip.appendChild(addPill);

  // Scroll the active pill into view (helps when there are many wallets).
  const activeEl = walletStrip.querySelector('.wallet-pill.active');
  if (activeEl) activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
}

function selectWallet(w){
  state.activeWallet = w;
  renderWalletSelector();
  onChangeCallback();
}

async function addWallet(){
  const name = prompt(t('wallet.promptNewName'));
  const val = (name || '').trim();
  if (!val || state.wallets.includes(val)) return;
  state.wallets.push(val);
  await saveState();
  renderWalletSelector();
  onChangeCallback();
}

export function initWalletSelector(onChange){
  onChangeCallback = onChange;
  renderWalletSelector();
}
