// All Firebase/Firestore access lives in this one module so the rest of the
// app never touches the SDK directly.

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { state } from './state.js';
import { DEFAULT_INCOME_CATS, DEFAULT_EXPENSE_CATS, SUBTAG_DEFAULTS } from './constants.js';

const firebaseConfig = {
  apiKey: "AIzaSyAdnM7qUM0MxYAvoyn4Se5wS__veK1Kezw",
  authDomain: "billing-tracker-f495f.firebaseapp.com",
  projectId: "billing-tracker-f495f",
  storageBucket: "billing-tracker-f495f.firebasestorage.app",
  messagingSenderId: "530040846552",
  appId: "1:530040846552:web:7df79befd337fc65cbffad"
};

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);

// All devices share one fixed document (not per-uid) so desktop and mobile
// browsers see the same data. Anonymous sign-in just satisfies the Security
// Rule that requires request.auth != null.
function stateDocRef(){ return doc(db, 'app', 'billing'); }

export function ensureAuth(){
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => { if (user) resolve(user); });
    signInAnonymously(auth).catch(reject);
  });
}

/**
 * Loads state from Firestore into the shared `state` object.
 * Returns a status string: 'ok' | 'brand-new' | 'auth-failed' | 'fetch-failed'
 * so the caller can show an appropriate status message.
 *
 * IMPORTANT: this only ever writes an empty seed doc back to Firestore when
 * we've *confirmed* (via a successful read) that no document exists yet.
 * A failed/erroring read must never be treated as "brand new" — doing so
 * would overwrite real data with an empty state.
 */
export async function loadState(){
  try{ await ensureAuth(); }
  catch(e){ return { status: 'auth-failed', message: e.message }; }

  let data = null;
  let fetchFailed = false;
  try{
    const snap = await getDoc(stateDocRef());
    data = snap.exists() ? snap.data() : null;
  }catch(e){
    fetchFailed = true;
    data = null;
  }

  const isBrandNew = !data && !fetchFailed;
  data = data || {};

  state.entries = Array.isArray(data.entries) ? data.entries : [];
  state.incomeCats = (data.incomeCategories && data.incomeCategories.length) ? data.incomeCategories : [...DEFAULT_INCOME_CATS];
  state.expenseCats = (data.expenseCategories && data.expenseCategories.length) ? data.expenseCategories : [...DEFAULT_EXPENSE_CATS];
  state.startBalances = data.startBalances || {};
  state.dayRate = (typeof data.dayRate === 'number') ? data.dayRate : 1000;
  state.subtags = data.subtags || {};
  Object.keys(SUBTAG_DEFAULTS).forEach(c => { if (!state.subtags[c]) state.subtags[c] = [...SUBTAG_DEFAULTS[c]]; });
  state.visitedMonths = new Set(data.visitedMonths || []);

  if (isBrandNew){
    await saveState();
    return { status: 'brand-new' };
  }
  if (fetchFailed){
    return { status: 'fetch-failed' };
  }
  return { status: 'ok' };
}

export async function saveState(){
  const payload = JSON.parse(JSON.stringify({
    entries: state.entries,
    incomeCategories: state.incomeCats,
    expenseCategories: state.expenseCats,
    startBalances: state.startBalances,
    dayRate: state.dayRate,
    subtags: state.subtags,
    visitedMonths: Array.from(state.visitedMonths),
    updatedAt: new Date().toISOString()
  }));
  await setDoc(stateDocRef(), payload);
}
