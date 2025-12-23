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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-2">
            <h1 className="text-xl font-bold text-slate-800">Cộng Đồng ĐIỂM XANH</h1>
            <button 
              onClick={() => setCurrentStep('shop')}
              className="text-emerald-600 font-bold text-sm hover:underline"
            >
              Quay lại mua sắm →
            </button>
          </div>
          <Leaderboard />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Badges />
            <Chat />
          </div>
        </div>
      );
    }

    if (currentStep === 'success') {
      const plasticSaved = (activeProduct?.isGreen ? 0.5 : 0) + (selectedLogistics === 'green' ? 0.2 : 0);
      const totalEarned = (activeProduct?.isGreen ? activeProduct.greenPoints : 0) + (selectedLogistics === 'green' ? 25 : 0);

      return (
        <div className="bg-white p-6 md:p-12 rounded-xl shadow-sm border border-slate-100 text-center space-y-6 animate-slideUp">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-community">
            <span className="text-4xl">💧</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Chúc mừng bạn!</h1>
          <div className="space-y-2">
            <p className="text-emerald-600 font-black text-lg">
              Bạn đã góp phần giảm được {plasticSaved.toFixed(1)}kg rác thải nhựa!
            </p>
            <p className="text-slate-500 max-w-sm mx-auto text-sm leading-relaxed">
              Hành động này đã mang về cho bạn <span className="font-bold text-emerald-600">{totalEarned} giọt nước</span>. 
              Hãy tiếp tục tích lũy để thăng hạng và đóng góp cho cộng đồng!
            </p>
          </div>
          
          <div className="max-w-md mx-auto bg-emerald-50 p-4 md:p-6 rounded-2xl border border-emerald-100">
            <div className="flex flex-row justify-around py-4">
              <div className="text-center">
                <p className="text-2xl md:text-3xl font-black text-emerald-600">+{activeProduct?.isGreen ? activeProduct.greenPoints : 0} 💧</p>
                <p className="text-[9px] text-emerald-700 uppercase font-black tracking-widest mt-1">Sản phẩm</p>
              </div>
              <div className="text-center border-l border-emerald-200 pl-4 md:pl-8">
                <p className="text-2xl md:text-3xl font-black text-emerald-600">+{selectedLogistics === 'green' ? 25 : 0} 💧</p>
                <p className="text-[9px] text-emerald-700 uppercase font-black tracking-widest mt-1">Logistics</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
            <button 
              onClick={resetFlow}
              className="px-8 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-lg hover:bg-slate-50 transition-colors text-sm"
            >
              Tiếp tục mua sắm
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
           <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="w-full md:w-1/2">
                  <img src={activeProduct.image} className="w-full aspect-square object-cover rounded-xl shadow-inner border border-slate-100" />
                </div>
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="flex items-center space-x-3">
                    {activeProduct.isGreenShop ? (
                      <span className="bg-emerald-100 text-emerald-700 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">☘️ Shop Xanh</span>
                    ) : (
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-1 rounded uppercase tracking-widest">Shop Tiêu Chuẩn</span>
                    )}
                    <span className="text-sm font-bold text-slate-400">{activeProduct.shopName}</span>
                  </div>

                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">{activeProduct.name}</h1>
                  
                  <div className="bg-slate-50 p-4 md:p-6 rounded-xl flex items-center justify-between">
                     <span className="text-slate-800 text-2xl md:text-3xl font-black">₫{activeProduct.price.toLocaleString('vi-VN')}</span>
                     {activeProduct.isGreen && (
                        <div className="text-right">
                           <p className="text-emerald-600 font-black text-xl">+{activeProduct.greenPoints} 💧</p>
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
      
      <div className="container-custom py-4 md:py-10 flex flex-col md:flex-row md:space-x-8 flex-1">
        <SidebarProfile />
        <div className="flex-1 min-h-[400px] mt-8 md:mt-0">
          {showPointToast && (
            <div className="fixed top-24 right-4 md:right-10 bg-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl z-[100] animate-bounce border-2 border-white/20">
               <div className="flex items-center space-x-4">
                 <span className="text-2xl">💧</span>
                 <div>
                   <p className="font-black text-sm">+{showPointToast} 💧!</p>
                   <p className="text-[9px] opacity-80 uppercase font-black">Bạn đã đóng góp 1 giọt nước</p>
                 </div>
               </div>
            </div>
          )}
          {renderContent()}
        </div>
      </div>

      <div className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-50">
        <button 
          onClick={() => setCurrentStep('social')}
          className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-xl flex items-center justify-center text-xl md:text-2xl transition-all hover:scale-110 active:scale-90 ${currentStep === 'social' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-white text-emerald-600 border border-slate-100'}`}
          title="Xem BXH & Cộng đồng"
        >
          🏆
        </button>
      </div>

      {/* Researcher Footer */}
      <footer className="py-2 px-4 md:px-8 text-[8px] text-slate-300 flex justify-end">
        <button onClick={() => dataService.exportData()} className="hover:text-slate-500 underline uppercase tracking-widest">
          Export Survey Data
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
      alert('Vui lòng nhập tên người dùng để bắt đầu.');
      return;
    }
    context.setUserName(localName);
    context.setCurrentStep('shop');
  };

  if (context.currentStep === 'login') {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-4 md:p-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-xl animate-slideUp relative z-10 flex flex-col">
          <div className="text-5xl mb-4">🌿</div>
          <h1 className="text-3xl md:text-4xl font-black text-emerald-600 mb-2 tracking-tighter uppercase">ĐIỂM XANH</h1>
          
          {/* Lời chào mô phỏng (Neutral Onboarding Header) */}
          <div className="bg-emerald-50 p-4 md:p-6 rounded-2xl mb-8 border border-emerald-100">
            <p className="text-emerald-800 text-sm md:text-base leading-relaxed font-bold italic">
              "Chào mừng bạn đến với mô phỏng hệ thống Điểm Xanh. Hệ thống cung cấp thông tin chi tiết về đặc tính sản phẩm và các tùy chọn vận chuyển. Sau khi hoàn tất chọn mặt hàng, hãy tiến hành xác nhận đặt hàng để kết thúc trải nghiệm. Hãy mua sắm như cách bạn vẫn thực hiện trên các sàn thương mại điện tử thông thường."
            </p>
          </div>

          {/* Hướng dẫn quy trình 3 bước (Shopping Process Guide) */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 mb-10 text-left">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black text-xs shadow-sm">01</div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Chọn sản phẩm</p>
              <p className="text-[8px] text-slate-400 leading-tight">Tìm kiếm và xem chi tiết đặc tính các món hàng</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2 border-x border-slate-100 px-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black text-xs shadow-sm">02</div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Vận chuyển</p>
              <p className="text-[8px] text-slate-400 leading-tight">Lựa chọn đơn vị vận chuyển phù hợp với nhu cầu</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-black text-xs shadow-sm">03</div>
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-tighter">Thanh toán</p>
              <p className="text-[8px] text-slate-400 leading-tight">Xác nhận đơn hàng để hoàn tất quy trình mua sắm</p>
            </div>
          </div>
          
          <div className="space-y-6 text-left">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] block mb-3 ml-1 text-center md:text-left">Tên hoặc Nickname của bạn</label>
              <input 
                type="text" 
                value={localName}
                onChange={(e) => setLocalName(e.target.value)}
                placeholder="Ví dụ: Green99..." 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-emerald-50 transition-all text-center text-xl md:text-2xl font-bold"
              />
            </div>
            <div className="flex flex-col space-y-4">
              <button 
                onClick={handleStart}
                className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all text-[12px] md:text-sm tracking-[0.3em] uppercase"
              >
                Bắt đầu mua sắm
              </button>
              {/* Chú thích nhẹ nhàng về hệ thống điểm thưởng để không gây spoil */}
              <p className="text-center text-[9px] md:text-[10px] text-slate-400 font-medium leading-relaxed">
                Hệ thống ghi nhận các lựa chọn có trách nhiệm bằng <span className="text-emerald-600 font-bold">'Giọt nước' (💧)</span> để vinh danh những nỗ lực vì cộng đồng trên bảng xếp hạng chung.
              </p>
            </div>
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