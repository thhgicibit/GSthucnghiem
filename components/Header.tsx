
import React from 'react';
import { useAppContext } from '../AppContext';

const Header: React.FC = () => {
  const { resetFlow } = useAppContext();

  return (
    <header className="bg-white w-full border-b border-slate-200">
      {/* Main Header Row - Simplified */}
      <div className="container-custom flex items-center justify-between py-5">
        {/* Brand Logo */}
        <div 
          onClick={resetFlow}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-all"
        >
          <div className="flex items-center">
             <span className="text-3xl mr-2">🌿</span>
             <span className="text-2xl font-black tracking-tighter text-emerald-600">GreenScore</span>
          </div>
        </div>

        {/* Simplified Search Bar */}
        <div className="flex-1 max-w-2xl px-10">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center">
            <input 
              type="text" 
              placeholder="Tìm kiếm sản phẩm thân thiện môi trường..." 
              className="flex-1 px-4 py-2 bg-transparent outline-none text-sm text-slate-600"
              defaultValue="combo sổ bút thân thiện môi trường"
            />
            <button className="bg-emerald-600 px-6 py-2 text-white rounded-md hover:bg-emerald-700 transition-colors">
              🔍
            </button>
          </div>
        </div>

        {/* Essential Actions Only */}
        <div className="flex items-center space-x-8">
          <div className="relative cursor-pointer group">
            <span className="text-slate-400 text-2xl transition-colors group-hover:text-emerald-600">🛒</span>
            <span className="absolute -top-1 -right-2 bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">3</span>
          </div>
          <div className="h-8 w-8 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;
