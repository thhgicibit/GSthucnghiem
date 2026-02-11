
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { BADGES } from '../constants';

const SidebarProfile: React.FC = () => {
  const { greenScore, userEmail, setCurrentStep } = useAppContext();

  return (
    <div className="w-full md:w-[280px] flex-shrink-0 space-y-4 relative">
      {/* 1. Hồ sơ & Điểm số */}
      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-center">
          <div className="relative inline-block mb-3">
            <img 
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || 'User')}&background=ffffff&color=059669&bold=true`} 
              className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg mx-auto" 
            />
          </div>
          <h3 className="font-bold text-white tracking-tight truncate px-2 text-sm">{userEmail || 'Người tham gia'}</h3>
          <div className="mt-3 text-center">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Điểm Xanh Hiện Có</p>
            <h1 className="text-5xl font-black text-white tracking-tighter">{greenScore} 💧</h1>
          </div>
        </div>

        {/* 2. HỆ THỐNG CẤP ĐỘ & DANH HIỆU */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="mb-5 px-1">
            <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center">
              <span className="mr-2">🏆</span> Lộ trình thăng cấp
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tight">Tích lũy điểm để đạt danh hiệu mới</p>
          </div>
          
          <div className="grid grid-cols-4 gap-2">
            {BADGES.map((badge, index) => {
              const isEarned = greenScore >= badge.requirement;
              const isCurrent = isEarned && (index === BADGES.length - 1 || greenScore < BADGES[index + 1].requirement);
              
              return (
                <div 
                  key={badge.id} 
                  className={`flex flex-col items-center justify-center rounded-2xl p-2 transition-all border ${
                    isCurrent 
                      ? 'bg-white border-emerald-500 text-emerald-600 shadow-md scale-110 z-10' 
                      : isEarned 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600' 
                        : 'bg-slate-100 border-transparent opacity-30 grayscale'
                  }`}
                  title={badge.description}
                >
                  <span className="text-[8px] font-black mb-1 opacity-60 uppercase">LV.{index + 1}</span>
                  <span className="text-xl md:text-2xl mb-1">{badge.icon}</span>
                  <span className="text-[7px] font-black text-center leading-tight">{badge.label}</span>
                </div>
              );
            })}
          </div>
          
          {/* Progress Bar Mini */}
          <div className="mt-6 px-1">
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-1.5">
               <span>Tiến độ thăng hạng</span>
               <span className="text-emerald-600">{greenScore} 💧</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
               <div 
                 className="h-full bg-emerald-500 transition-all duration-1000"
                 style={{ width: `${Math.min((greenScore / 200) * 100, 100)}%` }}
               ></div>
            </div>
          </div>
        </div>
        
        {/* 3. MENU NHANH */}
        <div className="p-4 bg-white">
          <button 
            onClick={() => setCurrentStep('redeem')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
          >
            <span>🎁</span>
            <span>Đổi quà & Quyên góp</span>
          </button>
        </div>
      </div>

      {/* 4. BẢNG XẾP HẠNG */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 px-1">Bảng xếp hạng tuần</h4>
        <div className="space-y-4">
          {[
            { name: 'Minh Tuấn', score: 450 },
            { name: 'Thanh Hà', score: 320 },
            { name: userEmail || 'Bạn', score: greenScore, isMe: true }
          ].sort((a,b) => b.score - a.score).map((user, idx) => (
            <div key={user.name} className={`flex justify-between items-center text-[10px] ${user.isMe ? 'bg-emerald-50 -mx-4 px-4 py-2 rounded-xl text-emerald-700 font-bold' : 'text-slate-600'}`}>
              <div className="flex items-center space-x-3">
                <span className={`w-4 font-black text-[10px] ${idx === 0 ? 'text-emerald-600' : 'text-slate-300'}`}>0{idx + 1}</span>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </div>
              <span className="font-black tracking-tighter">{user.score} 💧</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
