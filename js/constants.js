// Fixed configuration values used throughout the app.

export const DEFAULT_INCOME_CATS = [
  "20fotoWedding", "Good for All", "Laongsri", "Wedding", "Event",
  "Work Rutine", "Pre-Wedding", "Graduations", "Etc"
];

export const DEFAULT_EXPENSE_CATS = [
  "FoodDrink", "Car/Motocycle/Oil/Transport", "House+Goods", "Camera", "Phone",
  "Travel, Entertainment", "Education, Insurance, Invesmemt, Med", "Work", "Fix Course"
];

// 20fotoWedding day-entries split into two groups so the month-end
// "collect from studio" summary can separate wage vs reimbursable spend.
export const JOB_FEE_TAGS = ["Ast", "Shoot", "VDO", "ClipBH"];
export const JOB_EXPENSE_TAGS = ["Oil", "EzPass", "7-11/Cafe/Icream", "OOO", "Location", "Meal", "Flower"];

// Categories that use the fee/expense tag-table entry form instead of the
// generic description+amount field.
export const TAG_TABLE_CATS = ["20fotoWedding"];

// Categories that support multi-select "site" tags (job location).
export const SUBTAG_DEFAULTS = {
  "20fotoWedding": ["Wild", "Sea", "Indoor", "Rayong", "Kapi", "Bkk"],
  "Laongsri": ["Indoor", "B/C"]
};

// The category that uses the flat daily-rate "worked a full day" shortcut.
export const DAY_RATE_CAT = "Good for All";

// Deterministic color assigned to each income category (by index in the
// category list) for the calendar dots and legend.
export const CATEGORY_COLOR_PALETTE = [
  '#c9932f', '#5f9bd9', '#c9698f', '#7fa876', '#a889d9',
  '#d99a52', '#5fb8ad', '#c96b5a', '#8fae4a', '#4aa6c9'
];

export const THAI_MONTH_NAMES = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

export const THAI_WEEKDAYS = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
