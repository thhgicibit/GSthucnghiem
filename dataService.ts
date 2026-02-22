import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';
const GOOGLE_SHEET_WEBAPP_URL: string =
  'https://script.google.com/macros/s/AKfycbxxYJ6dvGjJxWrERrmksMzlvdi0AoYAm8UzVQcRNRJjVkPPOf6xpJzJEUzXI5PlxElt/exec';

// ─────────────────────────────────────────────────────────────────────────────
// Helper: gửi POST đến Google Apps Script (fire-and-forget, no-cors)
// ─────────────────────────────────────────────────────────────────────────────
const postToSheet = async (payload: object): Promise<void> => {
  if (!GOOGLE_SHEET_WEBAPP_URL) return;
  try {
    await fetch(GOOGLE_SHEET_WEBAPP_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error('[dataService] Lỗi gửi Google Sheet:', err);
  }
};

export const dataService = {
  // ───────────────────────────────────────────────────────────────────────────
  // 1. NGHIÊN CỨU 1 — ghi từng câu trả lời ngay khi người dùng chọn
  //    Sheet đích: "Nghiên cứu 1"
  //    Gọi từ: Survey.tsx → updateAnswer()
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey1: async (userEmail: string, questionId: string, value: string): Promise<void> => {
    console.log(`[NC1] ${questionId}: ${value}`);
    await postToSheet({
      type: 'nghien_cuu_1',
      userEmail,
      questionId,
      value,
      timestamp: new Date().toISOString(),
    });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 2. MÔ PHỎNG — ghi từng lần click chọn sản phẩm / bao bì / vận chuyển
  //    Sheet đích: "Mô phỏng"
  //    Gọi từ: ProductGrid, Packaging, Checkout khi người dùng click chọn
  // ───────────────────────────────────────────────────────────────────────────
  logSimulation: async (
    userEmail: string,
    actionType: 'product' | 'packaging' | 'logistics' | 'order',
    choiceId: string,
    choiceLabel: string,
    isGreen: boolean,
    pointsEarned?: number
  ): Promise<void> => {
    console.log(`[MPS] ${actionType} → ${choiceId} (${choiceLabel})`);
    await postToSheet({
      type: 'mo_phong',
      userEmail,
      actionType,   // product | packaging | logistics | order
      choiceId,     // ID sản phẩm hoặc 'green'/'standard'/'fast'
      choiceLabel,  // Tên hiển thị
      isGreen,
      pointsEarned: pointsEarned ?? 0,
      timestamp: new Date().toISOString(),
    });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 3. NGHIÊN CỨU 2 — ghi từng câu trả lời ngay khi người dùng chọn
  //    Sheet đích: "Nghiên cứu 2"
  //    Gọi từ: PostSurvey.tsx → handleSelect()
  // ───────────────────────────────────────────────────────────────────────────
  logSurvey2: async (userEmail: string, questionId: string, value: string): Promise<void> => {
    console.log(`[NC2] ${questionId}: ${value}`);
    await postToSheet({
      type: 'nghien_cuu_2',
      userEmail,
      questionId,
      value,
      timestamp: new Date().toISOString(),
    });
  },

  // ───────────────────────────────────────────────────────────────────────────
  // 4. saveChoice — vẫn giữ để lưu localStorage + cập nhật leaderboard
  //    Gọi khi nhấn "Đặt hàng" (Checkout.tsx)
  //    KHÔNG ghi thêm sheet vì logSimulation đã ghi realtime rồi
  // ───────────────────────────────────────────────────────────────────────────
  saveChoice: async (record: SurveyRecord, finalScore: number): Promise<void> => {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    existing.push({ ...record, timestamp: new Date().toISOString(), finalScore });
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));
    dataService.updateGlobalLeaderboard(record.userEmail, finalScore);
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Giữ nguyên các hàm leaderboard / exportData
  // ───────────────────────────────────────────────────────────────────────────
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
