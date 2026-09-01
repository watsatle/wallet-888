import { THAI_MONTH_NAMES } from './constants.js';

export const ICON_X = '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

export function fmt(n){
  return Number(n).toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** Compact form for tight spaces (calendar cells, mini chart labels). */
export function fmtCompact(n){
  const v = Number(n);
  if (Math.abs(v) >= 100000) return (v / 1000).toFixed(0) + 'k';
  if (Math.abs(v) >= 10000) return (v / 1000).toFixed(1) + 'k';
  return v.toLocaleString('th-TH', { maximumFractionDigits: 0 });
}

export function monthKey(dateStr){ return dateStr.slice(0, 7); }

export function escapeHtml(s){
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

export function newId(){
  return Date.now().toString() + Math.random().toString(36).slice(2, 6);
}

export function thMonthLabel(key){
  const [y, m] = key.split('-').map(Number);
  return THAI_MONTH_NAMES[m - 1] + ' ' + (y + 543);
}

export function thDateLabel(dateStr){
  const [y, m, d] = dateStr.split('-').map(Number);
  return d + ' ' + THAI_MONTH_NAMES[m - 1] + ' ' + (y + 543);
}

export function daysInMonth(key){
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m, 0).getDate();
}

export function firstWeekday(key){
  const [y, m] = key.split('-').map(Number);
  return new Date(y, m - 1, 1).getDay();
}

export function pad2(n){ return String(n).padStart(2, '0'); }

export function todayMonthKey(){ return new Date().toISOString().slice(0, 7); }
export function todayDateStr(){ return new Date().toISOString().slice(0, 10); }

/** Human-readable site label for an entry (handles both the current
 * multi-site array format and the older single-string format). */
export function siteLabel(e){
  if (e.sites && e.sites.length) return e.sites.join(', ');
  if (e.subtag) return e.subtag;
  return '';
}

/** Groups a list of income entries by date+category+site, combining their
 * descriptions and summing amounts — used to display one row per "job"
 * instead of one row per tag. */
export function groupIncomeEntries(list){
  const map = new Map();
  list.forEach(e => {
    const site = siteLabel(e);
    const key = e.date + '|' + e.category + '|' + site;
    if (!map.has(key)) map.set(key, { date: e.date, category: e.category, site, descs: [], amount: 0, ids: [] });
    const g = map.get(key);
    if (e.desc) g.descs.push(e.desc);
    g.amount += Number(e.amount);
    g.ids.push(e.id);
  });
  return Array.from(map.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export function lastAmountForDesc(entries, type, desc){
  const matches = entries
    .filter(e => e.type === type && e.desc === desc)
    .sort((a, b) => (a.id || '').localeCompare(b.id || ''));
  return matches.length ? matches[matches.length - 1].amount : null;
}
