
import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';

const GOOGLE_SHEET_WEBAPP_URL: string = 'https://script.google.com/macros/s/AKfycbw24pxzmEvcfeKDL7VRbzQJ1eNlnU_-bzWsc6FpUdmhtlsKQKaosS6Yc0p8OHE1aPL-/exec'; 

export const dataService = {
  saveChoice: async (record: SurveyRecord, finalScore: number) => {
  const existing = JSON.parse(localStorage.getItem(STORAGE_KEY_RECORDS) || '[]');
  existing.push({ ...record, timestamp: new Date().toISOString(), finalScore });
  localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(existing));

  if (GOOGLE_SHEET_WEBAPP_URL) {
    try {
      await fetch(GOOGLE_SHEET_WEBAPP_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'final_record', // ✅ Thêm type để script nhận biết
          ...record,
          finalScore,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Lỗi khi kết nối Google Sheet:", error);
    }
  }
  dataService.updateGlobalLeaderboard(record.userEmail, finalScore);
},
