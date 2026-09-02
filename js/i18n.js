import { state } from './state.js';

export const LANGS = ['th', 'en', 'ja'];

const DICT = {
  th: {
    'app.title': 'กระเป๋าเงินของฉัน',
    'app.loading': 'กำลังโหลดข้อมูล…',
    'app.loggingIn': 'กำลังเข้าสู่ระบบ...',
    'app.loadingData': 'กำลังโหลดข้อมูล...',
    'app.loadingLatest': 'กำลังโหลดข้อมูลล่าสุด…',
    'app.authFailed': 'เข้าสู่ระบบไม่สำเร็จ:',
    'app.fetchFailed': 'โหลดข้อมูลไม่สำเร็จ — ข้อมูลเดิมยังปลอดภัย ลองกดรีเฟรชอีกครั้ง',
    'app.synced': 'ซิงก์กับ Firebase อัตโนมัติ เปิดจากอุปกรณ์ไหนก็เห็นข้อมูลเดิม',
    'app.saveFailed': 'บันทึกไม่สำเร็จ:',

    'action.refresh': 'รีเฟรชข้อมูลล่าสุด',
    'action.theme': 'สลับธีม',
    'action.settings': 'ตั้งค่า',
    'action.language': 'ภาษา',
    'menu.printReport': 'พิมพ์ / บันทึก PDF รายงานเดือนนี้',
    'menu.exportBackup': 'ดาวน์โหลดข้อมูลสำรอง (JSON)',
    'menu.importBackup': 'นำเข้าข้อมูลเก่า (Import)',

    'nav.prevMonth': 'เดือนก่อนหน้า',
    'nav.nextMonth': 'เดือนถัดไป',

    'wallet.all': 'รวมทั้งหมด',
    'wallet.addNew': 'เพิ่มกระเป๋าเงินใหม่',
    'wallet.startBalance': 'ยอดยกมาต้นเดือน —',
    'wallet.promptNewName': 'ชื่อกระเป๋าเงินใหม่ (เช่น ชื่อธนาคาร หรือบัญชี)',
    'wallet.chartTitle': 'ยอดแต่ละบัญชี',

    'stat.startBalance': 'ยอดยกมา',
    'stat.income': 'รายรับ',
    'stat.expense': 'รายจ่าย',
    'stat.net': 'คงเหลือสิ้นเดือน',

    'tab.income': 'กระดานรายรับ',
    'tab.expense': 'กระดานรายจ่าย',

    'calendar.title': 'ปฏิทินรายรับ — แตะวันที่เพื่อกรอก',
    'calendar.legend': 'จุดสีบนแต่ละวันคือเจ้า/หมวดหมู่ที่มีรายการวันนั้น ตัวเลขคือยอดรวมทุกหมวดของวันนั้น แตะวันไหนก็ได้เพื่อเปิดหน้าต่างกรอก/แก้ไขรายการของวันนั้น',

    'income.addCatPlaceholder': 'เพิ่มเจ้า/หมวดรายรับใหม่',
    'action.addCategory': '+ เพิ่มหมวดหมู่',

    'settings.sectionLabel': 'ข้อมูล',
    'gfa.rateLabel': 'ค่าแรงต่อวัน — Good for All (บาท/วัน)',
    'gfa.legend': 'ใช้ตอนกดปุ่ม "ทำงานเต็มวัน" ในหน้าต่างกรอกของแต่ละวัน จะได้ไม่ต้องพิมพ์จำนวนเงินซ้ำทุกครั้ง',

    'income.catSummaryTitle': 'สรุปรายรับตามเจ้า / หมวดหมู่',
    'income.emptyMonth': 'ยังไม่มีรายการในหมวดนี้เดือนนี้',

    'detail.summaryToggle': 'สรุปไซต์งาน / เรียกเก็บเงิน 20foto (กดดูรายละเอียด)',
    'detail.collectLegend': 'ค่าจ้างคือค่างานที่ได้รับ ส่วนค่าใช้จ่ายสำรองจ่ายคือเงินที่ออกไปก่อนแล้วรอร้านเคลียร์คืน ยอดรวมคือจำนวนที่ต้องเรียกเก็บจากร้านตอนสิ้นเดือน',
    'collect.fee': 'ค่าจ้าง / ค่างาน',
    'collect.expense': 'ค่าใช้จ่ายสำรองจ่าย (รอเบิกคืน)',
    'collect.other': 'อื่นๆ',
    'collect.total': 'ยอดรวมเรียกเก็บสิ้นเดือน',

    'expense.addTitle': 'เพิ่มรายจ่าย',
    'expense.descPlaceholder': 'เช่น ค่าน้ำมันรถ',
    'expense.addCatPlaceholder': 'เพิ่มหมวดรายจ่ายใหม่',
    'expense.catSummaryTitle': 'สรุปรายจ่ายตามหมวดหมู่',
    'expense.errRequired': 'กรอกวันที่และจำนวนเงินให้ถูกต้อง (มากกว่า 0)',
    'expense.toastSaved': 'บันทึกรายจ่ายสำเร็จ',

    'field.date': 'วันที่',
    'field.category': 'หมวดหมู่',
    'field.wallet': 'กระเป๋าเงิน',
    'field.desc': 'รายละเอียด',
    'field.amount': 'จำนวนเงิน',
    'field.catOrOwner': 'เจ้า / หมวดหมู่',
    'action.add': '+ เพิ่ม',
    'action.addThis': '+ เพิ่มรายการนี้',

    'modal.close': 'ปิด',
    'modal.emptyDay': 'ยังไม่มีรายการของวันนี้',
    'modal.siteLabel': 'ไซต์งาน / สถานที่ (เลือกได้มากกว่า 1)',
    'modal.addSitePlaceholder': 'เพิ่มไซต์งานใหม่',
    'modal.feeGroup': 'ค่าจ้าง / ค่างาน',
    'modal.expenseGroup': 'ค่าใช้จ่ายที่สำรองจ่ายไปก่อน (รอเบิกคืน)',
    'modal.tagLegend': 'กรอกเฉพาะช่องที่มีจริงในวันนี้ ที่ว่างไว้จะไม่ถูกบันทึก',
    'modal.saveToday': '+ บันทึกรายการวันนี้',
    'modal.descPlaceholder': 'เช่น ค่ามัดจำ',
    'modal.chipLabel': 'แตะเพื่อใส่รายการย่อย',
    'modal.fullDay': '+ ทำงานเต็มวัน (ใส่ค่าแรง/วันให้อัตโนมัติ)',
    'modal.errRequired': 'เลือกหมวดหมู่และกรอกจำนวนเงินให้ถูกต้อง (มากกว่า 0)',
    'modal.errTagRequired': 'กรอกจำนวนเงินอย่างน้อย 1 ช่อง',
    'modal.toastSaved': 'บันทึกรายการสำเร็จ',
    'modal.toastSavedMulti': 'บันทึก {n} รายการสำเร็จ',

    'import.confirm': 'นำเข้าไฟล์นี้จะเขียนทับข้อมูลปัจจุบันทั้งหมดในระบบนี้ ยืนยันหรือไม่?',
    'import.success': 'นำเข้าข้อมูลสำเร็จ ({n} รายการ)',
    'import.failed': 'นำเข้าไฟล์ไม่สำเร็จ: ไฟล์อาจเสียหายหรือไม่ใช่ไฟล์สำรองที่ถูกต้อง',
    'export.success': 'ดาวน์โหลดไฟล์สำรองแล้ว ({n} รายการ)',

    'months': ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'],
    'weekdays': ['อา','จ','อ','พ','พฤ','ศ','ส']
  },

  en: {
    'app.title': 'My Wallets',
    'app.loading': 'Loading data…',
    'app.loggingIn': 'Signing in...',
    'app.loadingData': 'Loading data...',
    'app.loadingLatest': 'Loading latest data…',
    'app.authFailed': 'Sign-in failed:',
    'app.fetchFailed': 'Failed to load data — your data is still safe, try refreshing again',
    'app.synced': 'Auto-synced with Firebase. Open from any device to see the same data',
    'app.saveFailed': 'Save failed:',

    'action.refresh': 'Refresh latest data',
    'action.theme': 'Toggle theme',
    'action.settings': 'Settings',
    'action.language': 'Language',
    'menu.printReport': 'Print / Save this month as PDF',
    'menu.exportBackup': 'Download backup (JSON)',
    'menu.importBackup': 'Import old data',

    'nav.prevMonth': 'Previous month',
    'nav.nextMonth': 'Next month',

    'wallet.all': 'All combined',
    'wallet.addNew': 'Add a new wallet',
    'wallet.startBalance': 'Starting balance —',
    'wallet.promptNewName': 'New wallet name (e.g. bank name or account)',
    'wallet.chartTitle': 'Balance by wallet',

    'stat.startBalance': 'Starting balance',
    'stat.income': 'Income',
    'stat.expense': 'Expense',
    'stat.net': 'Ending balance',

    'tab.income': 'Income board',
    'tab.expense': 'Expense board',

    'calendar.title': 'Income calendar — tap a date to enter',
    'calendar.legend': 'Colored dots show which owner/category had entries that day. The number is the day\'s combined total. Tap any day to add or edit entries for it.',

    'income.addCatPlaceholder': 'Add a new owner/income category',
    'action.addCategory': '+ Add category',

    'settings.sectionLabel': 'Settings',
    'gfa.rateLabel': 'Daily rate — Good for All (THB/day)',
    'gfa.legend': 'Used by the "Worked a full day" button in the daily entry popup, so you don\'t have to retype the amount every time.',

    'income.catSummaryTitle': 'Income summary by owner / category',
    'income.emptyMonth': 'No entries in this category this month',

    'detail.summaryToggle': 'Site summary / 20foto collection summary (tap for details)',
    'detail.collectLegend': 'Wage is what you earned for the job. Reimbursable expense is what you paid up front and are waiting to be reimbursed for. The total is what you should collect from the studio at month end.',
    'collect.fee': 'Wage / job pay',
    'collect.expense': 'Reimbursable expense (pending)',
    'collect.other': 'Other',
    'collect.total': 'Total to collect this month',

    'expense.addTitle': 'Add expense',
    'expense.descPlaceholder': 'e.g. Gas for the car',
    'expense.addCatPlaceholder': 'Add a new expense category',
    'expense.catSummaryTitle': 'Expense summary by category',
    'expense.errRequired': 'Enter a valid date and amount (greater than 0)',
    'expense.toastSaved': 'Expense saved',

    'field.date': 'Date',
    'field.category': 'Category',
    'field.wallet': 'Wallet',
    'field.desc': 'Description',
    'field.amount': 'Amount',
    'field.catOrOwner': 'Owner / Category',
    'action.add': '+ Add',
    'action.addThis': '+ Add this entry',

    'modal.close': 'Close',
    'modal.emptyDay': 'No entries for this day yet',
    'modal.siteLabel': 'Site / location (multi-select)',
    'modal.addSitePlaceholder': 'Add a new site',
    'modal.feeGroup': 'Wage / job pay',
    'modal.expenseGroup': 'Reimbursable expense paid up front (pending)',
    'modal.tagLegend': 'Only fill in the fields that actually apply today — blank ones won\'t be saved.',
    'modal.saveToday': '+ Save today\'s entries',
    'modal.descPlaceholder': 'e.g. Deposit',
    'modal.chipLabel': 'Tap to insert a line item',
    'modal.fullDay': '+ Worked a full day (auto-fills the daily rate)',
    'modal.errRequired': 'Choose a category and enter a valid amount (greater than 0)',
    'modal.errTagRequired': 'Fill in at least one amount field',
    'modal.toastSaved': 'Entry saved',
    'modal.toastSavedMulti': '{n} entries saved',

    'import.confirm': 'Importing this file will overwrite all current data in this system. Continue?',
    'import.success': 'Import successful ({n} entries)',
    'import.failed': 'Import failed: the file may be corrupted or not a valid backup file',
    'export.success': 'Backup downloaded ({n} entries)',

    'months': ['January','February','March','April','May','June','July','August','September','October','November','December'],
    'weekdays': ['Su','Mo','Tu','We','Th','Fr','Sa']
  },

  ja: {
    'app.title': 'マイウォレット',
    'app.loading': 'データを読み込み中…',
    'app.loggingIn': 'サインイン中...',
    'app.loadingData': 'データを読み込み中...',
    'app.loadingLatest': '最新データを読み込み中…',
    'app.authFailed': 'サインインに失敗しました:',
    'app.fetchFailed': 'データの読み込みに失敗しました — データは安全です。もう一度更新してください',
    'app.synced': 'Firebaseと自動同期。どの端末からでも同じデータが見られます',
    'app.saveFailed': '保存に失敗しました:',

    'action.refresh': '最新データを更新',
    'action.theme': 'テーマ切替',
    'action.settings': '設定',
    'action.language': '言語',
    'menu.printReport': '今月のレポートを印刷・PDF保存',
    'menu.exportBackup': 'バックアップをダウンロード (JSON)',
    'menu.importBackup': '古いデータをインポート',

    'nav.prevMonth': '前月',
    'nav.nextMonth': '翌月',

    'wallet.all': 'すべて合算',
    'wallet.addNew': '新しいウォレットを追加',
    'wallet.startBalance': '繰越残高 —',
    'wallet.promptNewName': '新しいウォレット名（銀行名や口座名など）',
    'wallet.chartTitle': '口座別残高',

    'stat.startBalance': '繰越残高',
    'stat.income': '収入',
    'stat.expense': '支出',
    'stat.net': '月末残高',

    'tab.income': '収入ボード',
    'tab.expense': '支出ボード',

    'calendar.title': '収入カレンダー — 日付をタップして入力',
    'calendar.legend': '色のついた点はその日に記録がある取引先・カテゴリーを示します。数字はその日の全カテゴリー合計です。日付をタップすると入力・編集できます。',

    'income.addCatPlaceholder': '新しい取引先・収入カテゴリーを追加',
    'action.addCategory': '+ カテゴリーを追加',

    'settings.sectionLabel': '情報',
    'gfa.rateLabel': '日給 — Good for All（バーツ/日）',
    'gfa.legend': '日次入力ポップアップの「フル出勤」ボタンで使用します。毎回金額を入力する必要がなくなります。',

    'income.catSummaryTitle': '取引先・カテゴリー別収入サマリー',
    'income.emptyMonth': '今月このカテゴリーの記録はまだありません',

    'detail.summaryToggle': '現場サマリー / 20foto 請求サマリー（タップで詳細）',
    'detail.collectLegend': '給与は仕事で得た報酬、立替経費は先に支払って店からの返金待ちの分です。合計は月末に店へ請求すべき金額です。',
    'collect.fee': '給与 / 仕事代',
    'collect.expense': '立替経費（返金待ち）',
    'collect.other': 'その他',
    'collect.total': '今月の請求合計',

    'expense.addTitle': '支出を追加',
    'expense.descPlaceholder': '例：ガソリン代',
    'expense.addCatPlaceholder': '新しい支出カテゴリーを追加',
    'expense.catSummaryTitle': 'カテゴリー別支出サマリー',
    'expense.errRequired': '正しい日付と金額（0より大きい）を入力してください',
    'expense.toastSaved': '支出を保存しました',

    'field.date': '日付',
    'field.category': 'カテゴリー',
    'field.wallet': 'ウォレット',
    'field.desc': '詳細',
    'field.amount': '金額',
    'field.catOrOwner': '取引先 / カテゴリー',
    'action.add': '+ 追加',
    'action.addThis': '+ この項目を追加',

    'modal.close': '閉じる',
    'modal.emptyDay': 'この日の記録はまだありません',
    'modal.siteLabel': '現場 / 場所（複数選択可）',
    'modal.addSitePlaceholder': '新しい現場を追加',
    'modal.feeGroup': '給与 / 仕事代',
    'modal.expenseGroup': '立替経費（返金待ち）',
    'modal.tagLegend': '今日実際にあった項目のみ入力してください。空欄は保存されません。',
    'modal.saveToday': '+ 今日の記録を保存',
    'modal.descPlaceholder': '例：内金',
    'modal.chipLabel': 'タップして項目を追加',
    'modal.fullDay': '+ フル出勤（日給を自動入力）',
    'modal.errRequired': 'カテゴリーを選択し、正しい金額（0より大きい）を入力してください',
    'modal.errTagRequired': '少なくとも1つの金額欄を入力してください',
    'modal.toastSaved': '記録を保存しました',
    'modal.toastSavedMulti': '{n}件の記録を保存しました',

    'import.confirm': 'このファイルをインポートすると、現在のすべてのデータが上書きされます。続けますか？',
    'import.success': 'インポートが完了しました（{n}件）',
    'import.failed': 'インポートに失敗しました：ファイルが破損しているか、正しいバックアップファイルではない可能性があります',
    'export.success': 'バックアップをダウンロードしました（{n}件）',

    'months': ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    'weekdays': ['日','月','火','水','木','金','土']
  }
};

export function t(key, vars){
  const lang = DICT[state.language] ? state.language : 'th';
  let str = DICT[lang][key];
  if (str === undefined) str = DICT.th[key] !== undefined ? DICT.th[key] : key;
  if (vars && typeof str === 'string'){
    Object.keys(vars).forEach(k => { str = str.replace(`{${k}}`, vars[k]); });
  }
  return str;
}

/** Applies translations to every element with a data-i18n / data-i18n-placeholder
 * / data-i18n-aria attribute in the document. Call after any language change. */
export function applyStaticTranslations(){
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
    el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    const val = t(el.getAttribute('data-i18n-aria'));
    el.setAttribute('aria-label', val);
    if (el.hasAttribute('title')) el.setAttribute('title', val);
  });
}

export async function setLanguage(lang, onChange){
  if (!LANGS.includes(lang)) return;
  state.language = lang;
  try{ localStorage.setItem('billing-lang', lang); }catch(e){ /* ignore */ }
  applyStaticTranslations();
  if (onChange) onChange();
}

export function initLanguage(){
  let saved = 'th';
  try{ saved = localStorage.getItem('billing-lang') || 'th'; }catch(e){ /* ignore */ }
  state.language = LANGS.includes(saved) ? saved : 'th';
}
