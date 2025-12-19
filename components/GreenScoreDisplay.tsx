
import React from 'react';
import { useAppContext } from '../AppContext';

const GreenScoreDisplay: React.FC = () => {
  const { greenScore } = useAppContext();
  const nextLevelScore = (Math.floor(greenScore / 100) + 1) * 100;
  const progress = (greenScore % 100);
  const tier = greenScore >= 500 ? 'Kim Cương Xanh' : greenScore >= 250 ? 'Vàng Xanh' : 'Thành Viên Xanh';

  return (
    <div className="mx-4 mt-4 bg-white rounded-lg shadow-sm overflow-hidden border border-slate-100">
      <div className="green-gradient p-4 text-white flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Eco Rewards</span>
            <span className="text-xs font-medium">{tier}</span>
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <h1 className="text-3xl font-black">{greenScore}</h1>
            <span className="text-xs opacity-80">Điểm Green Score</span>
          </div>
        </div>
        <div className="text-right">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl backdrop-blur-sm">🌱</div>
        </div>
      </div>
      <div className="px-4 py-3 bg-white">
        <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase mb-1">
          <span>Tiến trình cấp bậc</span>
          <span className="text-green-600">{greenScore} / {nextLevelScore} GS</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
        <p className="mt-2 text-[10px] text-slate-400 text-center">Tích thêm {nextLevelScore - greenScore} điểm để thăng hạng!</p>
      </div>
    </div>
  );
};

export default GreenScoreDisplay;
