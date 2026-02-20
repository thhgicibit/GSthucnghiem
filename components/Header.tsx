import React from 'react';
import { useAppContext } from '../AppContext';

const Header: React.FC = () => {
  const { resetFlow, currentStep, setCurrentStep, setLastSimulationStep } = useAppContext();

  const isSimulationStep = ['shop', 'packaging', 'checkout', 'success', 'social', 'redeem'].includes(currentStep);

  const handleShowInstructions = () => {
    setLastSimulationStep(currentStep as any);
    setCurrentStep('instruction');
  };

  return (
    <header className="bg-white w-full border-b border-slate-200 sticky top-0 z-50">
      <div className="container-custom flex flex-col md:flex-row items-center justify-between py-3 md:py-5 gap-4">
        <div className="flex items-center space-x-4">
          <div 
            onClick={resetFlow}
            className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all self-start md:self-auto"
          >
            <div className="flex items-center">
               <span className="text-2xl md:text-3xl mr-2">🌿</span>
               <span className="text-xl md:text-2xl font-black tracking-tighter text-emerald-600">ĐIỂM XANH</span>
            </div>
          </div>
          
          {isSimulationStep && (
            <button 
              onClick={handleShowInstructions}
              className="bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all flex items-center space-x-1"
            >
              <span>🎥</span>
              <span>Xem hướng dẫn</span>
            </button>
          )}
        </div>
        <div className="flex-1 w-full max-w-2xl md:px-10 order-3 md:order-none">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm..." 
              className="flex-1 px-4 py-2 bg-transparent outline-none text-xs md:text-sm text-slate-600 min-w-0"
              defaultValue="combo sổ bút thân thiện môi trường"
            />
            <button className="bg-emerald-600 px-4 md:px-6 py-2 text-white rounded-md hover:bg-emerald-700 transition-colors">
              🔍
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-6 md:space-x-8 self-end md:self-auto">
          <div className="relative cursor-pointer group">
            <span className="text-slate-400 text-xl md:text-2xl transition-colors group-hover:text-emerald-600">🛒</span>
            <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">3</span>
          </div>
          <div className="h-7 w-7 md:h-8 md:w-8 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;