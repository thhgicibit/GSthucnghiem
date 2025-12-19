
import React from 'react';
import { useAppContext } from '../AppContext';
import { MEDALS } from '../constants';

const Achievements: React.FC = () => {
  const { greenScore } = useAppContext();

  return (
    <section className="space-y-4">
      <h3 className="font-black text-slate-800 text-lg flex items-center px-1">
        <span className="mr-2">🥇</span> Huy chương thành tích
      </h3>
      <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 grid grid-cols-3 gap-2">
        {MEDALS.map(medal => {
          const isAchieved = greenScore >= medal.requirement;
          return (
            <div key={medal.id} className="flex flex-col items-center space-y-2 group">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-500 shadow-inner ${isAchieved ? 'bg-white shadow-lg scale-105 opacity-100' : 'bg-slate-50 grayscale opacity-40'}`}>
                {medal.icon}
              </div>
              <p className={`text-[10px] font-black text-center uppercase tracking-tighter ${isAchieved ? 'text-slate-800' : 'text-slate-300'}`}>
                {medal.label}
              </p>
              {!isAchieved && (
                <span className="text-[8px] font-bold bg-slate-100 px-1.5 py-0.5 rounded-full text-slate-400">
                  {medal.requirement} GS
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Achievements;
