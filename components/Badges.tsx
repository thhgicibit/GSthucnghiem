import React from 'react';
import { useAppContext } from '../AppContext';
import { BADGES } from '../constants';

const Badges: React.FC = () => {
  const { greenScore } = useAppContext();

  return (
    <section className="space-y-4">
      <h3 className="font-black text-slate-800 text-lg flex items-center px-1">
        <span className="mr-2">🏷️</span> Danh hiệu Green Identity
      </h3>
      <div className="flex space-x-3 overflow-x-auto pb-4 px-1 scrollbar-hide">
        {BADGES.map(badge => {
          const isEarned = greenScore >= badge.requirement;
          const pointsNeeded = badge.requirement - greenScore;

          return (
            <div 
              key={badge.id} 
              className={`flex-shrink-0 w-32 p-4 rounded-3xl border transition-all duration-500 relative ${isEarned ? 'bg-green-600 border-green-600 text-white shadow-xl scale-100' : 'bg-white border-slate-100 text-slate-400'}`}
            >
              <div className="text-2xl mb-2">{badge.icon}</div>
              <p className="font-black text-[11px] uppercase tracking-tight line-clamp-1">{badge.label}</p>
              
              {isEarned ? (
                <p className="text-[8px] mt-1 leading-tight text-green-100">
                  {badge.description}
                </p>
              ) : (
                <div className="mt-2 pt-2 border-t border-slate-50">
                  <p className="text-[8px] font-black text-emerald-600 uppercase">
                    Cần thêm {pointsNeeded} 💧
                  </p>
                  <p className="text-[7px] text-slate-400 mt-1 italic">
                    Mua hàng xanh để thăng hạng
                  </p>
                </div>
              )}

              {isEarned && (
                <div className="absolute top-3 right-3 text-[10px]">✅</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Badges;