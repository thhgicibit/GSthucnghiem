import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';
const GOOGLE_SHEET_WEBAPP_URL: string =
  'https://script.google.com/macros/s/AKfycby6Revuk7dQjKcWYC4qlYMBMJu-hhBunFuMcGEo-rt0p65iGrqYGMEwyl35gHvwJ9c/exec';

// ─────────────────────────────────────────────────────────────────────────────
// Queue tuần tự — đảm bảo mỗi request chờ request trước hoàn thành mới gửi.
// Fix lỗi: click nhanh → nhiều request song song → Apps Script LockService
// drop bớt → miss dữ liệu.
// ─────────────────────────────────────────────────────────────────────────────
let _sendQueue: Promise<void> = Promise.resolve();

const postToSheet = (payload: object): Promise<void> => {
  _sendQueue = _sendQueue.then(async () => {
    if (!GOOGLE_SHEET_WEBAPP_URL) return;
    try {
      const url = GOOGLE_SHEET_WEBAPP_URL + '?data=' + encodeURIComponent(JSON.stringify(payload));
      await fetch(url, { method: 'GET', mode: 'no-cors' });
    } catch (err) {
      console.error('[dataService] Lỗi gửi Google Sheet:', err);
    }
  });
  return _sendQueue;
};

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
  // Cột: Thời gian | Email | A1 | A2 | A3 | A4 | A5 | A6 | A7 |
  //       sent_q1 | sent_q2 | sent_q3 | sent_q5 | sent_q6 |
  //       know_q1 | know_q2 | know_q3 | know_q4 | know_q5
  //
  // Ghi TỪNG CÂU ngay khi người dùng click — gọi từ Survey.tsx → updateAnswer()
  // ───────────────────────────────────────────────────────────────────────────
  // Ghi nc1_endTime khi dừng sớm (chọn "Chưa từng" ở A6)
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
    isLast = false   // true khi gửi câu cuối cùng của NC1
  ): Promise<void> => {
    const startTime = localStorage.getItem('tn_nc1_start') || undefined;
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
  // Ghi MỘT DÒNG DUY NHẤT khi người dùng nhấn "Đặt hàng"
  //
  // Cột: Thời gian | Email |
  //      Tên sản phẩm | Nhóm sản phẩm | Quy đổi sản phẩm (1/0) |
  //      Phương thức vận chuyển | Quy đổi vận chuyển (1/0) |
  //      Bao bì | Quy đổi bao bì (1/0)
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
  // Cột: Thời gian | Email |
  //      GLI1 | GLI2 | GLI3 | GCI1..GCI7 |
  //      PE1..PE3 | PU1..PU3 | PEOU1..PEOU3 |
  //      INT1..INT3 | SEE1..SEE3 | ACH1..ACH3 | COM1..COM3
  //
  // Ghi TỪNG CÂU ngay khi người dùng click — gọi từ PostSurvey.tsx → handleSelect()
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey2Response: async (
    userEmail: string,
    questionId: string,
    value: string,
    isLast = false   // true khi gửi câu cuối cùng của NC2
  ): Promise<void> => {
    const startTime = localStorage.getItem('tn_nc2_start') || undefined;
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
  // saveChoice — lưu localStorage + leaderboard
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
