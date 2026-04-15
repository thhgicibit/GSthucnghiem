import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS     = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';
const STORAGE_KEY_PENDING     = 'greenscore_pending_queue'; // [FIX 2] queue bền vững
const GOOGLE_SHEET_WEBAPP_URL: string =
  'https://script.google.com/macros/s/AKfycbyoFngpKQnTCMAm8GFeh1oF_J3Qu52ZJcZV1pIKiIXSwWsX7Po9CCOsjgX4WqnQKEM8/exec';

// ─────────────────────────────────────────────────────────────────────────────
// [FIX 2] Pending queue bền vững — lưu vào localStorage trước khi gửi,
// xóa sau khi gửi thành công. Khi trang load lại, flush lại phần còn tồn đọng.
// ─────────────────────────────────────────────────────────────────────────────
function getPendingQueue(): { id: string; payload: object }[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY_PENDING) || '[]'); } catch { return []; }
}
function savePendingQueue(q: { id: string; payload: object }[]) {
  localStorage.setItem(STORAGE_KEY_PENDING, JSON.stringify(q));
}
function addPending(id: string, payload: object) {
  const q = getPendingQueue();
  q.push({ id, payload });
  savePendingQueue(q);
}
function removePending(id: string) {
  savePendingQueue(getPendingQueue().filter(item => item.id !== id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Queue tuần tự in-memory — đảm bảo mỗi request chờ request trước hoàn thành.
// ─────────────────────────────────────────────────────────────────────────────
let _sendQueue: Promise<void> = Promise.resolve();

// [FIX 1] Chuyển sang mode: 'cors' để có thể đọc response và phát hiện lỗi.
// [FIX 1] Thêm retry tối đa 3 lần với backoff khi thất bại.
const sendWithRetry = async (url: string, retries = 3): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, { method: 'GET', mode: 'cors' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (json.status !== 'ok') throw new Error(json.message || 'status not ok');
      return; // thành công
    } catch (err) {
      console.warn(`[dataService] Lần thử ${attempt}/${retries} thất bại:`, err);
      if (attempt < retries) {
        await new Promise(r => setTimeout(r, 500 * attempt)); // backoff 0.5s, 1s, 1.5s
      } else {
        throw err; // đã hết retry, ném lỗi để caller xử lý
      }
    }
  }
};

const postToSheet = (payload: object): Promise<void> => {
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
  addPending(id, payload); // [FIX 2] lưu trước khi gửi

  _sendQueue = _sendQueue.then(async () => {
    if (!GOOGLE_SHEET_WEBAPP_URL) { removePending(id); return; }
    const url = GOOGLE_SHEET_WEBAPP_URL + '?data=' + encodeURIComponent(JSON.stringify(payload));
    try {
      await sendWithRetry(url);
      removePending(id); // [FIX 2] xóa sau khi gửi thành công
    } catch (err) {
      console.error('[dataService] Gửi thất bại sau tất cả retry, giữ lại trong pending:', err);
      // payload vẫn còn trong localStorage để flush khi load lại trang
    }
  });
  return _sendQueue;
};

// ─────────────────────────────────────────────────────────────────────────────
// [FIX 2] Flush pending queue khi trang được load lại
// Gọi hàm này một lần khi app khởi động (trong index.tsx hoặc App.tsx)
// ─────────────────────────────────────────────────────────────────────────────
export const flushPendingQueue = (): void => {
  const pending = getPendingQueue();
  if (pending.length === 0) return;
  console.log(`[dataService] Phát hiện ${pending.length} request tồn đọng, đang gửi lại...`);
  for (const item of pending) {
    postToSheet(item.payload); // postToSheet sẽ add lại vào pending rồi tự xóa khi thành công
    removePending(item.id);    // xóa bản ghi cũ (postToSheet tạo id mới)
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// [FIX 3] Debounce helper — dùng cho trường text (knownGame)
// ─────────────────────────────────────────────────────────────────────────────
export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number): T {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
}

// ─── Ghi nhận thời điểm bắt đầu làm từng phần ───────────────────────────────
export const markSurveyStart = (key: string) => {
  localStorage.setItem(key, new Date().toISOString());
};

export const getSurveyStart = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const dataService = {

  // ───────────────────────────────────────────────────────────────────────────
  // NGHIÊN CỨU 1
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey1End: async (userEmail: string): Promise<void> => {
    const startTime = localStorage.getItem('tn_nc1_start') || undefined;
    const endTime = new Date().toISOString();
    console.log('[NC1] Kết thúc sớm — ghi thời gian làm');
    await postToSheet({
      type: 'nghien_cuu_1',
      timestamp: endTime,
      userEmail,
      questionId: 'nc1_duration_marker',
      value: '',
      ...(startTime && { nc1_startTime: startTime }),
      nc1_endTime: endTime,
    });
    localStorage.removeItem('tn_nc1_start');
  },

  logSurvey1Response: async (
    userEmail: string,
    questionId: string,
    value: string,
    isLast = false
  ): Promise<void> => {
    // [FIX 4] Chỉ đính kèm startTime/endTime ở request cuối cùng
    const startTime = isLast ? (localStorage.getItem('tn_nc1_start') || undefined) : undefined;
    const endTime   = isLast ? new Date().toISOString() : undefined;
    console.log(`[NC1] ${questionId}: ${value}`);
    await postToSheet({
      type:      'nghien_cuu_1',
      timestamp: new Date().toISOString(),
      userEmail,
      questionId,
      value,
      ...(startTime && { nc1_startTime: startTime }),
      ...(endTime   && { nc1_endTime:   endTime   }),
    });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // MÔ PHỎNG
  // ───────────────────────────────────────────────────────────────────────────
  logSimulationOrder: async (
    userEmail: string,
    productId: string,
    productName: string,
    isGreenProduct: number,
    logisticsType: string,
    isGreenLogistics: number,
    packagingType: string,
    isGreenPackaging: number
  ): Promise<void> => {
    const productGroup: Record<string, string> = {
      '1a': '1: Bình nước - a: Xanh',
      '1b': '1: Bình nước - b: Thường',
      '2a': '2: Sổ tay - a: Xanh',
      '2b': '2: Sổ tay - b: Thường',
      '3a': '3: Túi - a: Xanh',
      '3b': '3: Túi - b: Thường',
    };
    const logisticsLabel: Record<string, string> = {
      green: 'Vận chuyển xanh',
      standard: 'Giao hàng tiêu chuẩn',
      fast: 'Giao hàng hỏa tốc',
    };
    const packagingLabel: Record<string, string> = {
      green: 'Bao bì xanh',
      standard: 'Đóng gói tiêu chuẩn',
    };

    console.log(`[MPS] Đặt hàng: ${productId} | ${logisticsType} | ${packagingType}`);
    await postToSheet({
      type: 'mo_phong',
      timestamp: new Date().toISOString(),
      userEmail,
      productName,
      productGroup: productGroup[productId] ?? productId,
      isGreenProduct,
      logisticsLabel: logisticsLabel[logisticsType] ?? logisticsType,
      isGreenLogistics,
      packagingLabel: packagingLabel[packagingType] ?? packagingType,
      isGreenPackaging,
    });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // NGHIÊN CỨU 2
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey2Response: async (
    userEmail: string,
    questionId: string,
    value: string,
    isLast = false
  ): Promise<void> => {
    // [FIX 4] Chỉ đính kèm startTime/endTime ở request cuối cùng
    const startTime = isLast ? (localStorage.getItem('tn_nc2_start') || undefined) : undefined;
    const endTime   = isLast ? new Date().toISOString() : undefined;
    console.log(`[NC2] ${questionId}: ${value}`);
    await postToSheet({
      type:      'nghien_cuu_2',
      timestamp: new Date().toISOString(),
      userEmail,
      questionId,
      value,
      ...(startTime && { nc2_startTime: startTime }),
      ...(endTime   && { nc2_endTime:   endTime   }),
    });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Lưu trữ local
  // ───────────────────────────────────────────────────────────────────────────
  saveChoice: async (record: SurveyRecord, finalScore: number): Promise<void> => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    existing.push({ ...record, timestamp: new Date().toISOString(), finalScore });
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));
    dataService.updateGlobalLeaderboard(record.userEmail, finalScore);
  },

  updateGlobalLeaderboard: (email: string, score: number): void => {
    let leaderboard = JSON.parse(
      localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD)
    );
    const idx = leaderboard.findIndex((u: any) => u.name === email);
    if (idx > -1) {
      if (score > leaderboard[idx].score) leaderboard[idx].score = score;
    } else {
      leaderboard.push({
        id: `user_${Date.now()}`,
        name: email,
        score,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`,
      });
    }
    leaderboard.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(leaderboard));
  },

  getLeaderboard: () => {
    return JSON.parse(
      localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD)
    );
  },

  exportData: (): void => {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) return;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey_data_${new Date().toISOString()}.json`;
    link.click();
  },
};
