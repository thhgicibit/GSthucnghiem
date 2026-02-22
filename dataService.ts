import { MOCK_LEADERBOARD } from './constants';
import { SurveyRecord } from './types';

const STORAGE_KEY_RECORDS = 'greenscore_survey_records';
const STORAGE_KEY_LEADERBOARD = 'greenscore_leaderboard';
const GOOGLE_SHEET_WEBAPP_URL: string = 'https://script.google.com/macros/s/AKfycbxnOXl0SmmkUQqgTVdC5eEy2pur2y5IEh4zHaALKIeGKcWXcP2sXhbelh0IMh8zIBaP/exec';

export const dataService = {
  saveChoice: async (record: SurveyRecord, finalScore: number) => {
    console.log("Đang gửi dữ liệu sang Google Sheet:", record);

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
            type: 'final_record',
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

  logRealtimeResponse: async (
    userEmail: string,
    questionId: string,
    value: string,
    surveyType: 'pre' | 'post' | 'simulation'
  ) => {
    console.log(`[Realtime Log] ${surveyType} - ${questionId}: ${value}`);

    if (GOOGLE_SHEET_WEBAPP_URL) {
      try {
        await fetch(GOOGLE_SHEET_WEBAPP_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'realtime_survey',
            userEmail,
            questionId,
            value,
            surveyType,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Lỗi khi log realtime:", error);
      }
    }
  },

  updateGlobalLeaderboard: (email: string, score: number) => {
    let leaderboard = JSON.parse(
      localStorage.getItem(STORAGE_KEY_LEADERBOARD) || JSON.stringify(MOCK_LEADERBOARD)
    );

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

  exportData: () => {
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) return null;
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `survey_data_${new Date().toISOString()}.json`;
    link.click();
  },
};
