import { fmt } from './utils.js';

export function renderMiniChart(income, expense){
  const denom = Math.max(income, expense, 1);
  const incPct = Math.min(100, (income / denom) * 100);
  const expPct = Math.min(100, (expense / denom) * 100);

  document.getElementById('miniChart').innerHTML = `
    <div class="mini-chart-row">
      <span class="mc-label">รายรับ</span>
      <div class="mc-track"><div class="mc-fill" style="width:${incPct}%;background:var(--green-soft);"></div></div>
      <span class="mc-val" style="color:var(--green-soft);">${fmt(income)}</span>
    </div>
    <div class="mini-chart-row">
      <span class="mc-label">รายจ่าย</span>
      <div class="mc-track"><div class="mc-fill" style="width:${expPct}%;background:var(--red-soft);"></div></div>
      <span class="mc-val" style="color:var(--red-soft);">${fmt(expense)}</span>
    </div>
  `;
}
