
import { MOCK_LEADERBOARD } from './constants';

export interface SurveyRecord {
  timestamp: string;
  userId: string;
  userEmail: string;
  productId: string;
  isGreenProduct: number; // 1 = Green, 0 = Standard
  packagingType: string;
  isGreenPackaging: number;
  logisticsType: string;
  isGreenLogistics: number; // 1 = Green, 0 = Standard
  finalGreenScore: number;
}

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';

const GOOGLE_SHEET_WEBAPP_URL: string = 'https://script.google.com/macros/s/AKfycbyq-gdUCw8TsxC8MBsv_Nc6A1mxsz-52lbMi44Y21ShtEAcar0sqQK6WHLr38DDRPvKWQ/exec'; 

export const dataService = {
  saveChoice: async (record: SurveyRecord) => {
    console.log("Saving record for analysis:", record);
    
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
    existing.push(record);
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));
    
    if (GOOGLE_SHEET_WEBAPP_URL && GOOGLE_SHEET_WEBAPP_URL !== 'DÁN_LINK_WEB_APP_CỦA_BẠN_VÀO_ĐÂY') {
      try {
        fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(record),
        });
      } catch (error) {
        console.error("Lỗi khi gửi dữ liệu:", error);
      }
    }

    dataService.updateGlobalLeaderboard(record.userEmail, record.finalGreenScore);
  },

  updateGlobalLeaderboard: (email: string, score: number) => {
    let leaderboard = JSON.parse(localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD));
    const userIdx = leaderboard.findIndex((u: any) => u.name === email);
    if (userIdx > -1) {
      if (score > leaderboard[userIdx].score) {
        leaderboard[userIdx].score = score;
      }
    } else {
      leaderboard.push({
        id: `user_${Date.now()}`,
        name: email,
        score: score,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=random`
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
