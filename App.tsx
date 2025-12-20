
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Header from './components/Header';
import SidebarProfile from './components/SidebarProfile';
import ProductGrid from './components/ProductGrid';
import Checkout from './components/Checkout';
import Leaderboard from './components/Leaderboard';
import Badges from './components/Badges';
import Chat from './components/Chat';
import { dataService } from './dataService';

const MainContent: React.FC = () => {
  const { 
    currentStep, 
    showPointToast, 
    activeProduct, 
    setActiveProduct, 
    setCurrentStep, 
    selectedLogistics,
    resetFlow,
    userName
  } = useAppContext();

  const renderContent = () => {
    if (currentStep === 'social') {
      return (
        <div className="space-y-6 animate-slideUp">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <h1 className="text-xl font-bold text-slate-800">Cộng Đồng GreenScore</h1>
            <button 
              onClick={() => setCurrentStep('shop')}
              className="text-emerald-600 font-bold text-sm hover:underline"
            >
              Quay lại mua sắm →
            </button>
          </div>
          <Leaderboard />
          <div className="grid grid-cols-2 gap-6">
            <Badges />
            <Chat />
          </div>
        </div>
      );
    }

    if (currentStep === 'success') {
      return (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-slate-100 text-center space-y-6 animate-slideUp">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-community">
            <span className="text-4xl">💧</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Cảm ơn {userName}!</h1>
          <p className="text-slate-500 max-w-sm mx-auto text-sm">Hành động của bạn đã đóng góp giọt nước quý giá cho cây xanh cộng đồng.</p>
          
          <div className="max-w-md mx-auto bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
            <div className="flex justify-around py-4">
              <div className="text-center">
                <p className="text-3xl font-black text-emerald-600">+{activeProduct?.isGreen ? activeProduct.greenPoints : 0}</p>
                <p className="text-[10px] text-emerald-700 uppercase font-black tracking-widest mt-1">Từ sản phẩm</p>
              </div>
              <div className="text-center border-l border-emerald-200 pl-8">
                <p className="text-3xl font-black text-emerald-600">+{selectedLogistics === 'green' ? 25 : 0}</p>
                <p className="text-[10px] text-emerald-700 uppercase font-black tracking-widest mt-1">Từ Logistics</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center space-x-4 pt-6">
            <button 
              onClick={resetFlow}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Tiếp tục trải nghiệm
            </button>
            <button 
              onClick={() => setCurrentStep('social')}
              className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-lg shadow-lg hover:bg-emerald-700 active:scale-95 transition-all text-sm"
            >
              BXH & Cộng đồng
            </button>
          </div>
        </div>
      );
    }

    if (activeProduct && currentStep === 'checkout') {
      return <Checkout />;
    }

    if (activeProduct) {
      return (
        <div className="animate-slideUp">
           <button onClick={() => setActiveProduct(null)} className="mb-4 text-emerald-600 text-sm font-bold flex items-center hover:translate-x-[-4px] transition-transform">
            ← Quay lại danh sách
           </button>
           <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex space-x-12">
                <div className="w-1/2">
                  <img src={activeProduct.image} className="w-full aspect-square object-cover rounded-xl shadow-inner border border-slate-100" />
                </div>
                <div className="w-1/2 space-y-6">
                  <div className="flex items-center space-x-3">
                    {activeProduct.isGreenShop ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">☘️ Shop Xanh</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">Shop Tiêu Chuẩn</span>
                    )}
                    <span className="text-sm font-bold text-slate-400">{activeProduct.shopName}</span>
                  </div>

                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">{activeProduct.name}</h1>
                  
                  <div className="bg-slate-50 p-6 rounded-xl flex items-center justify-between">
                     <span className="text-slate-800 text-3xl font-black">₫{activeProduct.price.toLocaleString()}</span>
                     {activeProduct.isGreen && (
                        <div className="text-right">
                           <p className="text-emerald-600 font-black text-xl">+{activeProduct.greenPoints} GS</p>
                           <p className="text-[9px] text-emerald-700 uppercase font-black tracking-tighter">Thưởng lựa chọn xanh</p>
                        </div>
                     )}
                  </div>
                  
                  <div className="space-y-4 pt-4">
                    <div className="flex justify-between items-center text-sm pb-4 border-b border-slate-50">
                      <span className="text-slate-400">Chất liệu cấu tạo</span>
                      <span className={`font-bold ${activeProduct.isGreen ? 'text-emerald-600' : 'text-slate-700'}`}>{activeProduct.material}</span>
                    </div>
                    <div className="text-sm leading-relaxed text-slate-500">
                      {activeProduct.isGreen ? 'Sản phẩm đáp ứng tiêu chuẩn bền vững, ưu tiên nguyên liệu tái chế và giảm thiểu rác thải.' : 'Sản phẩm sản xuất theo quy trình công nghiệp tiêu chuẩn.'}
                    </div>

                    <div className="flex space-x-4 pt-6">
                      <button 
                        onClick={() => setCurrentStep('checkout')}
                        className="flex-1 bg-emerald-600 text-white py-4 font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all uppercase text-xs tracking-widest"
                      >
                        Mua Ngay
                      </button>
                    </div>
                  </div>
                </div>
              </div>
           </div>
        </div>
      );
    }

    return <ProductGrid />;
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <Header />
      
      <div className="container-custom py-10 flex space-x-8 flex-1">
        <SidebarProfile />
        <div className="flex-1 min-h-[600px]">
          {showPointToast && (
            <div className="fixed top-24 right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-bounce border-2 border-white/20">
               <div className="flex items-center space-x-4">
                 <span className="text-2xl">💧</span>
                 <div>
                   <p className="font-black text-sm">+{showPointToast} Green Score!</p>
                   <p className="text-[9px] opacity-80 uppercase font-black">Bạn đã đóng đóng góp 1 giọt nước</p>
                 </div>
               </div>
            </div>
          )}
          {renderContent()}
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setCurrentStep('social')}
          className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-90 ${currentStep === 'social' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-white text-emerald-600 border border-slate-100'}`}
          title="Xem BXH & Cộng đồng"
        >
          🏆
        </button>
      </div>

      {/* Researcher Footer - Hidden link to export data */}
      <footer className="py-2 px-8 text-[8px] text-slate-300 flex justify-end">
        <button onClick={() => dataService.exportData()} className="hover:text-slate-500 underline uppercase tracking-widest">
          Export Survey Data (Researcher Only)
        </button>
      </footer>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  const context = useAppContext();
  const [localName, setLocalName] = useState('');

  const handleStart = () => {
    if (localName.trim().length < 2) {
      alert('Vui lòng nhập định danh để bắt đầu.');
      return;
    }
    context.setUserName(localName);
    context.setCurrentStep('shop');
  };

  if (context.currentStep === 'login') {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl w-full max-w-md animate-slideUp relative z-10">
          <div className="text-5xl mb-6">🌿</div>
          <h1 className="text-4xl font-black text-emerald-600 mb-2 tracking-tighter">GreenScore</h1>
          <p className="text-slate-400 mb-10 text-sm leading-relaxed font-medium">
            Nghiên cứu khoa học về tác động của Game hóa lên tiêu dùng.
          </p>
          
          <div className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] block mb-3 ml-1">Định danh người tham gia</label>
              <input 
                type="text" 
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Nhập mã số của bạn..." 
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-emerald-50 transition-all text-center text-xl font-bold"
              />
            </div>
            <button 
              onClick={handleStart}
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all text-xs tracking-[0.3em] uppercase mt-2"
            >
              Bắt đầu tham gia
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <MainContent />;
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppWrapper />
    </AppProvider>
  );
};

export default App;
