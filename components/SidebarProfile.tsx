import React from 'react';
import { useAppContext } from '../AppContext';
import { BADGES } from '../constants';

const SidebarProfile: React.FC = () => {
  const { greenScore, userName, wateringCount } = useAppContext();
  
  const totalCommunityWater = 12450 + wateringCount;
  const communityMemberCount = 245;

  return (
    <div className="w-full md:w-[280px] flex-shrink-0 space-y-4">
      {/* 1. Hồ sơ & Điểm số */}
      <div className="bg-white rounded-3xl shadow-sm overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-6 text-center">
          <div className="relative inline-block mb-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userName || 'User')}&background=ffffff&color=059669&bold=true`} 
              className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg mx-auto" 
            />
          </div>
          <h3 className="font-bold text-white tracking-tight truncate px-2">{userName || 'Người tham gia'}</h3>
          <div className="mt-2 text-center">
            <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">Điểm Green Score</p>
            <h1 className="text-4xl font-black text-white tracking-tighter">{greenScore}</h1>
          </div>
        </div>

        {/* 2. BẢNG HUY HIỆU VỚI TIẾN ĐỘ */}
        <div className="p-4 border-b border-slate-50 bg-slate-50/30">
          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1 text-center md:text-left">Cấp bậc danh hiệu</p>
          <div className="flex gap-2 justify-between">
            {BADGES.map(badge => {
              const isEarned = greenScore >= badge.requirement;
              const pointsNeeded = badge.requirement - greenScore;
              
              return (
                <div 
                  key={badge.id} 
                  className={`flex-1 flex flex-col items-center justify-center rounded-xl p-1 transition-all border ${isEarned ? 'bg-white border-emerald-200 text-emerald-600 shadow-sm scale-105' : 'bg-slate-100/50 border-transparent opacity-40 grayscale'}`}
                >
                  <span className="text-lg md:text-xl">{badge.icon}</span>
                  <span className="text-[7px] md:text-[8px] font-black mt-0.5 text-center leading-tight">{badge.label}</span>
                  {!isEarned && (
                    <span className="text-[6px] font-bold text-slate-500 mt-1">+{pointsNeeded} GS</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 md:p-6 bg-white space-y-4">
          {/* 3. DỰ ÁN CỘNG ĐỒNG */}
          <div className="bg-emerald-50 p-4 md:p-5 rounded-2xl space-y-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl md:text-3xl animate-community">🌳</span>
              <div className="flex-1">
                <p className="text-[10px] font-black text-emerald-800 uppercase tracking-tight leading-none">Cây Cộng Đồng</p>
                <p className="text-[9px] md:text-[10px] text-emerald-600 mt-1 font-medium italic">Bạn và {communityMemberCount} người khác đang nuôi dưỡng cây xanh</p>
              </div>
            </div>
            
            <div className="space-y-2">
               <div className="h-1.5 w-full bg-emerald-200/50 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-1000"
                    style={{ width: `${(totalCommunityWater % 1000)/10}%` }}
                  ></div>
               </div>
               <div className="flex justify-between text-[8px] font-black text-emerald-700 uppercase">
                  <span>Tiến độ</span>
                  <span>{((totalCommunityWater % 1000)/10).toFixed(1)}%</span>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BẢNG XẾP HẠNG MINI */}
      <div className="bg-white p-4 md:p-6 rounded-3xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-5">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">BXH Cộng Đồng</h4>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Minh Tuấn', score: 450, rank: 1 },
            { name: 'Thanh Hà', score: 320, rank: 2 },
            { name: userName || 'Bạn', score: greenScore, rank: 3, isMe: true }
          ].sort((a,b) => b.score - a.score).map((user, idx) => (
            <div key={user.name} className={`flex justify-between items-center text-xs ${user.isMe ? 'bg-emerald-50 -mx-3 px-3 py-2 rounded-xl text-emerald-700 font-bold' : 'text-slate-600'}`}>
              <div className="flex items-center space-x-3">
                <span className={`w-4 font-black text-[10px] ${idx === 0 ? 'text-emerald-600' : 'text-slate-300'}`}>
                  0{idx + 1}
                </span>
                <span className="max-w-[110px] truncate">{user.name}</span>
              </div>
              <span className="font-black tracking-tighter whitespace-nowrap">{user.score} GS</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;