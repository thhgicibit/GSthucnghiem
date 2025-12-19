
import React from 'react';
import { useAppContext } from '../AppContext';
import { MOCK_LEADERBOARD } from '../constants';

const Leaderboard: React.FC = () => {
  const { greenScore, userName } = useAppContext();
  
  const leaderboardData = [
    ...MOCK_LEADERBOARD,
    { id: 'me', name: userName || 'Bạn (Người tham gia)', score: greenScore, avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=ee4d2d&color=fff&bold=true` }
  ].sort((a, b) => b.score - a.score);

  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">XẾP HẠNG ECO REWARDS CỘNG ĐỒNG</h3>
      </div>
      
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-slate-100">
        {leaderboardData.map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-0 ${user.id === 'me' ? 'bg-orange-50/50' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <span className={`w-5 text-center font-bold text-sm ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                {index + 1}
              </span>
              <div className="relative">
                <img src={user.avatar} className="w-9 h-9 rounded-full border border-slate-100 object-cover" />
                {index === 0 && <span className="absolute -top-2 -right-1 text-[10px]">👑</span>}
              </div>
              <span className={`text-xs font-medium truncate max-w-[150px] ${user.id === 'me' ? 'text-shopee-orange font-bold' : 'text-slate-700'}`}>
                {user.name}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 text-sm">{user.score}</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Green Score</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leaderboard;
