
import React, { useState } from 'react';
import { AppProvider, useAppContext } from './AppContext';
import Header from './components/Header';
import SidebarProfile from './components/SidebarProfile';
import ProductGrid from './components/ProductGrid';
import Checkout from './components/Checkout';
import Leaderboard from './components/Leaderboard';
import Badges from './components/Badges';
import Chat from './components/Chat';
import RedeemStore from './components/RedeemStore';
import { dataService } from './dataService';

const MainContent: React.FC = () => {
  const { 
    currentStep, 
    showPointToast, 
    activeProduct, 
    setActiveProduct, 
    setCurrentStep, 
    selectedLogistics,
    selectedPackaging,
    setSelectedPackaging,
    resetFlow,
    userEmail
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

    if (currentStep === 'redeem') {
      return <RedeemStore />;
    }

    if (currentStep === 'packaging') {
      return (
        <div className="bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-slate-100 animate-slideUp">
          <button onClick={() => setCurrentStep('shop')} className="mb-6 text-emerald-600 text-sm font-bold flex items-center hover:translate-x-[-4px] transition-all">
            ← Trở lại sản phẩm
          </button>
          
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Chọn Hình Thức Đóng Gói</h2>
            <p className="text-sm text-slate-400 mt-2">Góp phần bảo vệ môi trường từ bước đóng gói</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Eco Packaging */}
            <div 
              onClick={() => setSelectedPackaging('green')}
              className={`p-6 border-2 rounded-3xl cursor-pointer transition-all flex flex-col items-center text-center space-y-4 ${selectedPackaging === 'green' ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}
            >
              <div className="text-5xl">📦🍃</div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Bao bì xanh</h3>
                <span className="inline-block bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase mt-2 shadow-sm">+10 💧</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">Sử dụng hộp giấy tái chế và băng keo sinh học. Hạn chế tối đa rác thải nhựa.</p>
            </div>

            {/* Standard Packaging */}
            <div 
              onClick={() => setSelectedPackaging('standard')}
              className={`p-6 border-2 rounded-3xl cursor-pointer transition-all flex flex-col items-center text-center space-y-4 ${selectedPackaging === 'standard' ? 'border-slate-800 bg-slate-50 shadow-lg scale-105' : 'border-slate-100 hover:border-slate-200 bg-white'}`}
            >
              <div className="text-5xl">📦</div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Đóng gói tiêu chuẩn</h3>
                <span className="inline-block bg-slate-200 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase mt-2">0 💧</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">Đóng gói theo quy trình thông thường bằng hộp carton và màng bọc plastic.</p>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <button 
              onClick={() => setCurrentStep('checkout')}
              disabled={!selectedPackaging}
              className={`px-16 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all ${selectedPackaging ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}
            >
              Tiếp tục thanh toán
            </button>
          </div>
        </div>
      );
    }

    if (currentStep === 'success') {
      const plasticSaved = (activeProduct?.isGreen ? 0.5 : 0) + (selectedLogistics === 'green' ? 0.2 : 0) + (selectedPackaging === 'green' ? 0.1 : 0);
      const totalEarned = (activeProduct?.isGreen ? activeProduct.greenPoints : 0) + (selectedLogistics === 'green' ? 25 : 0) + (selectedPackaging === 'green' ? 10 : 0);

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
            <div className="flex flex-row justify-around py-4 flex-wrap gap-4">
              <div className="text-center">
                <p className="text-xl md:text-2xl font-black text-emerald-600">+{activeProduct?.isGreen ? activeProduct.greenPoints : 0} 💧</p>
                <p className="text-[9px] text-emerald-700 uppercase font-black tracking-widest mt-1">Sản phẩm</p>
              </div>
              <div className="text-center border-l border-emerald-200 pl-4">
                <p className="text-xl md:text-2xl font-black text-emerald-600">+{selectedPackaging === 'green' ? 10 : 0} 💧</p>
                <p className="text-[9px] text-emerald-700 uppercase font-black tracking-widest mt-1">Đóng gói</p>
              </div>
              <div className="text-center border-l border-emerald-200 pl-4">
                <p className="text-xl md:text-2xl font-black text-emerald-600">+{selectedLogistics === 'green' ? 25 : 0} 💧</p>
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
                        onClick={() => setCurrentStep('packaging')}
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
          title="Xem Bảng xếp hạng"
        >
          🏆
        </button>
      </div>

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
  const [localEmail, setLocalEmail] = useState('');

  const handleStart = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localEmail)) {
      alert('Vui lòng nhập một địa chỉ email hợp lệ để bắt đầu.');
      return;
    }
    context.setUserEmail(localEmail);
    context.setCurrentStep('shop');
  };

  const handleAnonymousStart = () => {
    // Tạo ID ngẫu nhiên định dạng email để thỏa mãn các hệ thống cũ
    const randomId = `participant_${Math.floor(Math.random() * 9000) + 1000}@survey.internal`;
    context.setUserEmail(randomId);
    context.setCurrentStep('shop');
  };

  if (context.currentStep === 'login') {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-4 md:p-6 text-center text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-80 h-80 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-white rounded-full blur-3xl"></div>
        </div>
        
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-slideUp relative z-10 flex flex-col">
          <div className="text-5xl mb-4">🌿</div>
          <h1 className="text-3xl md:text-4xl font-black text-emerald-600 mb-8 tracking-tighter uppercase">ĐIỂM XANH</h1>
          
          <div className="space-y-6 text-left mb-10">
            <div className="bg-emerald-50 p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-inner">
              <h3 className="text-emerald-800 font-black text-sm md:text-base uppercase tracking-widest mb-4 flex items-center">
                <span className="mr-2">💡</span> Giới thiệu về hệ thống
              </h3>
              <p className="text-emerald-900 text-[13px] md:text-sm leading-relaxed font-medium">
                Điểm xanh là hệ thống trò chơi hóa mô phỏng do nhóm nghiên cứu thực hiện. Khi khách hàng mua sắm sản phẩm thân thiện với môi trường, sử dụng bao bì tái chế, giao hàng bằng xe điện... sẽ nhận được điểm tương ứng.
                <br/><br/>
                Hệ thống giúp đo lường mức độ đóng góp của bạn vào việc giảm thiểu rác