import { state } from './state.js';
import { escapeHtml } from './utils.js';

/** Fills a <select> with the given category list, optionally keeping the
 * previously-selected value if it's still present in the new list. */
export function populateCatSelect(selectEl, cats, keepValue){
  const prev = keepValue ? selectEl.value : null;
  selectEl.innerHTML = '';
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    selectEl.appendChild(opt);
  });
  if (prev && cats.includes(prev)) selectEl.value = prev;
}

/** Rebuilds the description <datalist> autocomplete options from history,
 * separately for income and expense entries. */
export function updateDescMemory(){
  const incList = document.getElementById('incDescList');
  const expList = document.getElementById('expDescList');
  const incDescs = Array.from(new Set(state.entries.filter(e => e.type === 'income' && e.desc).map(e => e.desc)));
  const expDescs = Array.from(new Set(state.entries.filter(e => e.type === 'expense' && e.desc).map(e => e.desc)));
  incList.innerHTML = incDescs.map(d => `<option value="${escapeHtml(d)}">`).join('');
  expList.innerHTML = expDescs.map(d => `<option value="${escapeHtml(d)}">`).join('');
}
