import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';
const GOOGLE_SHEET_WEBAPP_URL: string =
  'https://script.google.com/macros/s/AKfycby6Revuk7dQjKcWYC4qlYMBMJu-hhBunFuMcGEo-rt0p65iGrqYGMEwyl35gHvwJ9c/exec';

// ─────────────────────────────────────────────────────────────────────────────
// QUEUE TUẦN TỰ với RETRY
//
// Fix lỗi 1 — miss dữ liệu khi click nhanh:
//   Trước đây nhiều fetch bay song song → Apps Script LockService drop bớt.
//   Giờ mỗi request xếp hàng, chờ request trước xong hoàn toàn mới gửi.
//   Nếu request thất bại → tự retry tối đa 3 lần trước khi bỏ qua.
// ─────────────────────────────────────────────────────────────────────────────
let _sendQueue: Promise<void> = Promise.resolve();

const postToSheet = (payload: object): void => {
  _sendQueue = _sendQueue.then(async () => {
    if (!GOOGLE_SHEET_WEBAPP_URL) return;
    const url = GOOGLE_SHEET_WEBAPP_URL + '?data=' + encodeURIComponent(JSON.stringify(payload));
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        await fetch(url, { method: 'GET', mode: 'no-cors' });
        return; // thành công → thoát
      } catch (err) {
        console.warn(`[dataService] Lần ${attempt} thất bại:`, err);
        if (attempt < MAX_RETRIES) {
          // chờ trước khi retry: 500ms, 1000ms, 2000ms
          await new Promise(r => setTimeout(r, 500 * attempt));
        } else {
          console.error('[dataService] Bỏ qua sau 3 lần thất bại:', payload);
        }
      }
    }
  });
};

// ─────────────────────────────────────────────────────────────────────────────
// DEBOUNCE FACTORY
//
// Fix lỗi A7 (text input dài bị mất / cắt chữ):
//   Câu A7 dùng <input onChange> → mỗi ký tự gõ gọi postToSheet 1 lần.
//   Chuỗi dài gây hàng chục request liên tiếp → queue tràn, URL quá dài.
//   Debounce 600ms: chỉ gửi sau khi người dùng ngừng gõ 600ms.
// ─────────────────────────────────────────────────────────────────────────────
export const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number): T => {
  let timer: ReturnType<typeof setTimeout>;
  return ((...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }) as T;
};

// ─────────────────────────────────────────────────────────────────────────────
// Thời gian bắt đầu làm từng phần
// ─────────────────────────────────────────────────────────────────────────────
export const markSurveyStart = (key: string) => {
  localStorage.setItem(key, new Date().toISOString());
};

export const getSurveyStart = (key: string): string | null => {
  return localStorage.getItem(key);
};

export const dataService = {

  // ───────────────────────────────────────────────────────────────────────────
  // NGHIÊN CỨU 1 — ghi TỪNG CÂU ngay khi click
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey1End: async (userEmail: string): Promise<void> => {
    const startTime = localStorage.getItem('tn_nc1_start') || undefined;
    const endTime = new Date().toISOString();
    postToSheet({
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

  logSurvey1Response: (
    userEmail: string,
    questionId: string,
    value: string,
    isLast = false
  ): void => {
    const startTime = localStorage.getItem('tn_nc1_start') || undefined;
    const endTime   = isLast ? new Date().toISOString() : undefined;
    postToSheet({
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
  // MÔ PHỎNG — ghi khi nhấn "Đặt hàng"
  // ───────────────────────────────────────────────────────────────────────────
  logSimulationOrder: (
    userEmail: string,
    productId: string,
    productName: string,
    isGreenProduct: number,
    logisticsType: string,
    isGreenLogistics: number,
    packagingType: string,
    isGreenPackaging: number
  ): void => {
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

    postToSheet({
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
  // NGHIÊN CỨU 2 — ghi TỪNG CÂU ngay khi click
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey2Response: (
    userEmail: string,
    questionId: string,
    value: string,
    isLast = false
  ): void => {
    const startTime = localStorage.getItem('tn_nc2_start') || undefined;
    const endTime   = isLast ? new Date().toISOString() : undefined;
    postToSheet({
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
  // localStorage helpers
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
