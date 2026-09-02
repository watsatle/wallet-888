// Small floating "saved" confirmation shown after a successful add, without
// interrupting the current form (the income modal stays open on purpose so
// multiple entries can be logged quickly).

let hideTimer = null;

export function showToast(message){
  let el = document.getElementById('toastMsg');
  if (!el){
    el = document.createElement('div');
    el.id = 'toastMsg';
    el.className = 'toast';
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove('show');
  // Force reflow so re-triggering the animation works if a toast is already visible.
  void el.offsetWidth;
  el.classList.add('show');

  clearTimeout(hideTimer);
  hideTimer = setTimeout(() => { el.classList.remove('show'); }, 1800);
}
