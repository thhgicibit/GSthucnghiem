import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS     = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';
const STORAGE_KEY_QUEUE       = 'greenscore_send_queue';
const GOOGLE_SHEET_WEBAPP_URL =
  'https://script.google.com/macros/s/AKfycby6Revuk7dQjKcWYC4qlYMBMJu-hhBunFuMcGEo-rt0p65iGrqYGMEwyl35gHvwJ9c/exec';

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE ENGINE — offline-first, persist qua localStorage
//
// 1. enqueue()  → lưu vào localStorage ngay (không cần mạng)
// 2. Worker chạy ngầm, gửi tuần tự từng item
// 3. Thành công → xóa khỏi queue
// 4. Thất bại   → retry tối đa 5 lần, backoff 2/4/8/16/32s
// 5. Tắt tab rồi mở lại → queue vẫn còn, worker tự chạy tiếp
// 6. Dedup: cùng type+email+questionId → ghi đè item cũ (giữ giá trị mới nhất)
// ─────────────────────────────────────────────────────────────────────────────
interface QueueItem { id: string; payload: object; retries: number; }

const FLUSH_TIMEOUT = 15000;
const MAX_RETRIES   = 5;
let _workerRunning  = false;

function loadQueue(): QueueItem[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_QUEUE) || '[]'); }
  catch { return []; }
}
function saveQueue(q: QueueItem[]) {
  localStorage.setItem(STORAGE_KEY_QUEUE, JSON.stringify(q));
}
function _payloadKey(p: any): string {
  return [p.type, p.userEmail, p.questionId ?? 'batch'].join('|');
}
function enqueue(payload: object) {
  const q   = loadQueue();
  const key = _payloadKey(payload as any);
  const idx = q.findIndex(item => item.id === key);
  const newItem: QueueItem = { id: key, payload, retries: 0 };
  if (idx >= 0) q[idx] = newItem; else q.push(newItem);
  saveQueue(q);
  _startWorker();
}

async function _sendOne(item: QueueItem): Promise<boolean> {
  try {
    const url = GOOGLE_SHEET_WEBAPP_URL + '?data=' +
      encodeURIComponent(JSON.stringify(item.payload));
    await fetch(url, { method: 'GET', mode: 'no-cors' });
    return true;
  } catch { return false; }
}

function _startWorker() {
  if (_workerRunning) return;
  _workerRunning = true;
  _runWorker().finally(() => { _workerRunning = false; });
}

async function _runWorker() {
  while (true) {
    const q = loadQueue();
    if (q.length === 0) break;
    const item = q[0];
    const ok   = await _sendOne(item);
    const fresh = loadQueue();
    fresh.shift();
    if (ok) {
      saveQueue(fresh);
    } else {
      item.retries += 1;
      if (item.retries <= MAX_RETRIES) {
        await new Promise(r => setTimeout(r, Math.pow(2, item.retries) * 1000));
        fresh.push(item);
      } else {
        console.error('[queue] Bỏ qua sau', MAX_RETRIES, 'lần:', item.payload);
      }
      saveQueue(fresh);
    }
  }
}

// Chờ queue drain — gọi trước khi chuyển trang
export async function flushQueue(timeoutMs = FLUSH_TIMEOUT): Promise<void> {
  _startWorker();
  const deadline = Date.now() + timeoutMs;
  while (loadQueue().length > 0 && Date.now() < deadline) {
    await new Promise(r => setTimeout(r, 200));
  }
}

// Flush queue tồn đọng từ session trước ngay khi app load
_startWorker();

// ─────────────────────────────────────────────────────────────────────────────
export const markSurveyStart = (key: string) =>
  localStorage.setItem(key, new Date().toISOString());

export const getSurveyStart = (key: string): string | null =>
  localStorage.getItem(key);

// ─────────────────────────────────────────────────────────────────────────────
export const dataService = {

  // NC1 — batch khi bấm "Tiếp theo" mỗi trang
  batchLogSurvey1: (
    userEmail: string,
    answers: Record<string, string>,
    isLastPage: boolean
  ): void => {
    const startTime = localStorage.getItem('tn_nc1_start') || undefined;
    const endTime   = isLastPage ? new Date().toISOString() : undefined;
    Object.entries(answers).forEach(([questionId, value]) => {
      if (!value) return;
      enqueue({
        type: 'nghien_cuu_1',
        timestamp: new Date().toISOString(),
        userEmail, questionId, value,
        ...(startTime && { nc1_startTime: startTime }),
        ...(endTime   && { nc1_endTime: endTime }),
      });
    });
    if (isLastPage) localStorage.removeItem('tn_nc1_start');
  },

  // NC1 — kết thúc sớm khi chọn "Chưa từng"
  logSurvey1End: (userEmail: string, answers: Record<string, string>): void => {
    const startTime = localStorage.getItem('tn_nc1_start') || undefined;
    const endTime   = new Date().toISOString();
    Object.entries(answers).forEach(([questionId, value]) => {
      if (!value) return;
      enqueue({
        type: 'nghien_cuu_1',
        timestamp: endTime,
        userEmail, questionId, value,
        ...(startTime && { nc1_startTime: startTime }),
        nc1_endTime: endTime,
      });
    });
    localStorage.removeItem('tn_nc1_start');
  },

  // Mô phỏng — 1 lần khi bấm "Đặt hàng"
  logSimulationOrder: (
    userEmail: string, productId: string, productName: string,
    isGreenProduct: number, logisticsType: string, isGreenLogistics: number,
    packagingType: string, isGreenPackaging: number
  ): void => {
    const productGroup: Record<string,string> = {
      '1a':'1: Bình nước - a: Xanh','1b':'1: Bình nước - b: Thường',
      '2a':'2: Sổ tay - a: Xanh',   '2b':'2: Sổ tay - b: Thường',
      '3a':'3: Túi - a: Xanh',       '3b':'3: Túi - b: Thường',
    };
    const logisticsLabel: Record<string,string> = {
      green:'Vận chuyển xanh', standard:'Giao hàng tiêu chuẩn', fast:'Giao hàng hỏa tốc',
    };
    const packagingLabel: Record<string,string> = {
      green:'Bao bì xanh', standard:'Đóng gói tiêu chuẩn',
    };
    enqueue({
      type: 'mo_phong',
      timestamp: new Date().toISOString(),
      userEmail, productName,
      productGroup:    productGroup[productId]       ?? productId,
      isGreenProduct,
      logisticsLabel:  logisticsLabel[logisticsType] ?? logisticsType,
      isGreenLogistics,
      packagingLabel:  packagingLabel[packagingType]  ?? packagingType,
      isGreenPackaging,
    });
  },

  // NC2 — batch khi bấm "Gửi"
  batchLogSurvey2: (
    userEmail: string,
    answers: Record<string, string>
  ): void => {
    const startTime = localStorage.getItem('tn_nc2_start') || undefined;
    const endTime   = new Date().toISOString();
    Object.entries(answers).forEach(([questionId, value]) => {
      if (!value) return;
      enqueue({
        type: 'nghien_cuu_2',
        timestamp: endTime,
        userEmail, questionId, value,
        ...(startTime && { nc2_startTime: startTime }),
        nc2_endTime: endTime,
      });
    });
    localStorage.removeItem('tn_nc2_start');
  },

  saveChoice: async (record: SurveyRecord, finalScore: number): Promise<void> => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    existing.push({ ...record, timestamp: new Date().toISOString(), finalScore });
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));
    dataService.updateGlobalLeaderboard(record.userEmail, finalScore);
  },

  updateGlobalLeaderboard: (email: string, score: number): void => {
    let lb = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD));
    const idx = lb.findIndex((u: any) => u.name === email);
    if (idx > -1) { if (score > lb[idx].score) lb[idx].score = score; }
    else lb.push({ id:`user_${Date.now()}`, name:email, score,
      avatar:`https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random` });
    lb.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(lb));
  },

  getLeaderboard: () =>
    JSON.parse(localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD)),

  exportData: (): void => {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = `survey_data_${new Date().toISOString()}.json`;
    link.click();
  },
};
