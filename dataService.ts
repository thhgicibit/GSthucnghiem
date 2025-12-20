
import { MOCK_LEADERBOARD } from './constants';

export interface SurveyRecord {
  timestamp: string;
  userId: string;
  userName: string;
  productId: string;
  isGreenProduct: number; // 1 = Green, 0 = Standard
  logisticsType: string;
  isGreenLogistics: number; // 1 = Green, 0 = Standard
  finalGreenScore: number;
}

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';

/**
 * QUAN TRỌNG: 
 * Sau khi bạn làm bước "Advanced" -> "Go to... (unsafe)" và nhấn "Allow", 
 * Google Apps Script sẽ hiện ra một cửa sổ có chứa "Web App URL".
 * Hãy copy cái link đó và dán thay thế vào dòng dưới đây:
 */
// Added explicit string type to prevent TS comparison error with literal
const GOOGLE_SHEET_WEBAPP_URL: string = 'https://script.google.com/macros/s/AKfycbyq-gdUCw8TsxC8MBsv_Nc6A1mxsz-52lbMi44Y21ShtEAcar0sqQK6WHLr38DDRPvKWQ/exec'; 

export const dataService = {
  saveChoice: async (record: SurveyRecord) => {
    console.log("Saving record for analysis:", record);
    
    // 1. Lưu backup tại máy (LocalStorage)
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    existing.push(record);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));
    
    // 2. Gửi sang Google Sheet
    if (GOOGLE_SHEET_WEBAPP_URL && GOOGLE_SHEET_WEBAPP_URL !== 'DÁN_LINK_WEB_APP_CỦA_BẠN_VÀO_ĐÂY') {
      try {
        // Gửi data ngầm
        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(record),
        });
        console.log("Dữ liệu đã được gửi tới Google Sheet thành công.");
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
      }
    }

    dataService.updateGlobalLeaderboard(record.userName, record.finalGreenScore);
  },

  updateGlobalLeaderboard: (name: string, score: number) => {
    let leaderboard = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD));
    const userIdx = leaderboard.findIndex((u: any) => u.name === name);
    if (userIdx > -1) {
      if (score > leaderboard[userIdx].score) {
        leaderboard[userIdx].score = score;
      }
    } else {
      leaderboard.push({
        id: `user_${Date.now()}`,
        name: name,
        score: score,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
      });
    }
    leaderboard.sort((a: any, b: any) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY_LEADERBOARD, JSON.stringify(leaderboard));
  },

  getLeaderboard: () => {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD));
  },

  exportData: () => {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) return null;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey_data_${new Date().toISOString()}.json`;
    link.click();
  }
};
