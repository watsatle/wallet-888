import { state } from './state.js';
import { CATEGORY_COLOR_PALETTE } from './constants.js';
import { monthKey, daysInMonth, firstWeekday, pad2, fmtCompact, escapeHtml, todayDateStr } from './utils.js';
import { getMonthSelect } from './month-nav.js';
import { t } from './i18n.js';

export function categoryColor(cat){
  const idx = state.incomeCats.indexOf(cat);
  if (idx < 0) return '#8a8378';
  return CATEGORY_COLOR_PALETTE[idx % CATEGORY_COLOR_PALETTE.length];
}

function buildCalHead(container){
  t('weekdays').forEach(wd => {
    const el = document.createElement('div');
    el.className = 'cal-wd';
    el.textContent = wd;
    container.appendChild(el);
  });
}

function renderCalendarLegend(){
  const el = document.getElementById('calColorLegend');
  el.innerHTML = state.incomeCats
    .map(c => `<span class="legend-item"><span class="legend-dot" style="background:${categoryColor(c)};"></span>${escapeHtml(c)}</span>`)
    .join('');
}

/** Renders the income calendar for the currently-selected month.
 * `onDayClick(dateStr)` is called when a day cell is tapped. */
export function renderIncomeCalendar(onDayClick){
  const key = getMonthSelect().value;
  const todayStr = todayDateStr();
  const totalsByDay = {};
  const catsByDay = {};

  state.entries
    .filter(e => e.type === 'income' && monthKey(e.date) === key)
    .forEach(e => {
      totalsByDay[e.date] = (totalsByDay[e.date] || 0) + Number(e.amount);
      if (!catsByDay[e.date]) catsByDay[e.date] = new Set();
      catsByDay[e.date].add(e.category);
    });

  renderCalendarLegend();

  const cal = document.getElementById('incomeCal');
  cal.innerHTML = '';
  buildCalHead(cal);

  const offset = firstWeekday(key);
  for (let i = 0; i < offset; i++){
    const blank = document.createElement('div');
    blank.className = 'cal-cell blank';
    cal.appendChild(blank);
  }

  const nDays = daysInMonth(key);
  for (let d = 1; d <= nDays; d++){
    const dateStr = key + '-' + pad2(d);
    const amt = totalsByDay[dateStr] || 0;
    const cats = catsByDay[dateStr] ? Array.from(catsByDay[dateStr]) : [];

    const cell = document.createElement('div');
    cell.className = 'cal-cell' + (amt > 0 ? ' has-data' : '') + (dateStr === todayStr ? ' is-today' : '');
    const dotsHtml = cats.length
      ? `<span class="dots">${cats.map(c => `<span class="cal-dot" style="background:${categoryColor(c)};"></span>`).join('')}</span>`
      : '';
    cell.innerHTML = dotsHtml + `<span class="d">${d}</span>` + (amt > 0 ? `<span class="amt-tag">${fmtCompact(amt)}</span>` : '');
    cell.addEventListener('click', () => onDayClick(dateStr));
    cal.appendChild(cell);
  }
}
