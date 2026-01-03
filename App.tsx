
import React, { useState, useEffect, useRef } from 'react';
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

const GOOGLE_CLIENT_ID = "755280134148-069vea3i8un2a33neau4gu67dnbrkpln.apps.googleusercontent.com";
const RECENT_EMAILS_KEY = 'eco_recent_emails';

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
    resetFlow
  } = useAppContext();

  const renderContent = () => {
    if (currentStep === 'social') {
      return (
        <div className="space-y-6 animate-slideUp">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-4 gap-2">
            <h1 className="text-xl font-bold text-slate-800">Cộng Đồng ĐIỂM XANH</h1>
            <button onClick={() => setCurrentStep('shop')} className="text-emerald-600 font-bold text-sm hover:underline">Quay lại mua sắm →</button>
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
          <button onClick={() => setCurrentStep('shop')} className="mb-6 text-emerald-600 text-sm font-bold flex items-center hover:translate-x-[-4px] transition-all">← Trở lại sản phẩm</button>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter">Chọn Hình Thức Đóng Gói</h2>
            <p className="text-sm text-slate-400 mt-2">Góp phần bảo vệ môi trường từ bước đóng gói</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div onClick={() => setSelectedPackaging('green')} className={`p-6 border-2 rounded-3xl cursor-pointer transition-all flex flex-col items-center text-center space-y-4 ${selectedPackaging === 'green' ? 'border-emerald-500 bg-emerald-50 shadow-lg scale-105' : 'border-slate-100 hover:border-emerald-200 bg-white'}`}>
              <div className="text-5xl">📦🍃</div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Bao bì xanh</h3>
                <span className="inline-block bg-emerald-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase mt-2 shadow-sm">+10 💧</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">Sử dụng hộp giấy tái chế và băng keo sinh học. Hạn chế tối đa rác thải nhựa.</p>
            </div>
            <div onClick={() => setSelectedPackaging('standard')} className={`p-6 border-2 rounded-3xl cursor-pointer transition-all flex flex-col items-center text-center space-y-4 ${selectedPackaging === 'standard' ? 'border-slate-800 bg-slate-50 shadow-lg scale-105' : 'border-slate-100 hover:border-slate-200 bg-white'}`}>
              <div className="text-5xl">📦</div>
              <div>
                <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest">Đóng gói tiêu chuẩn</h3>
                <span className="inline-block bg-slate-200 text-slate-500 text-[9px] font-black px-3 py-1 rounded-full uppercase mt-2">0 💧</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">Đóng gói theo quy trình thông thường bằng hộp carton và màng bọc plastic.</p>
            </div>
          </div>
          <div className="mt-12 flex justify-center">
            <button onClick={() => setCurrentStep('checkout')} disabled={!selectedPackaging} className={`px-16 py-4 rounded-xl font-black uppercase text-xs tracking-[0.2em] shadow-xl transition-all ${selectedPackaging ? 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95' : 'bg-slate-100 text-slate-300 cursor-not-allowed'}`}>Tiếp tục thanh toán</button>
          </div>
        </div>
      );
    }

    if (currentStep === 'success') {
      const plasticSaved = (activeProduct?.isGreen ? 0.5 : 0) + (selectedLogistics === 'green' ? 0.2 : 0) + (selectedPackaging === 'green' ? 0.1 : 0);
      const prodPoints = activeProduct?.isGreen ? activeProduct.greenPoints : 0;
      const logiPoints = selectedLogistics === 'green' ? 25 : 0;
      const packPoints = selectedPackaging === 'green' ? 10 : 0;
      const totalEarned = prodPoints + logiPoints + packPoints;

      return (
        <div className="bg-white p-6 md:p-12 rounded-[3rem] text-center space-y-8 animate-slideUp max-w-2xl mx-auto mt-4">
          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <span className="text-5xl">💧</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Chúc mừng bạn!</h1>
            <p className="text-emerald-600 font-black text-xl px-4">Bạn đã góp phần giảm được {plasticSaved.toFixed(1)}kg rác thải nhựa!</p>
            <p className="text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">Hành động này đã mang về cho bạn <span className="font-black text-emerald-600">{totalEarned} giọt nước</span>. Hãy tiếp tục tích lũy để thăng hạng!</p>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-[2.5rem] p-8 md:p-10">
            <div className="grid grid-cols-3 gap-4">
              <div className="flex flex-col items-center space-y-2 border-r border-emerald-100/50">
                <p className="text-2xl font-black text-emerald-600">+{prodPoints} <span className="text-xl">💧</span></p>
                <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">SẢN PHẨM</p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-r border-emerald-100/50">
                <p className="text-2xl font-black text-emerald-600">+{packPoints} <span className="text-xl">💧</span></p>
                <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">ĐÓNG GÓI</p>
              </div>
              <div className="flex flex-col items-center space-y-2">
                <p className="text-2xl font-black text-emerald-600">+{logiPoints} <span className="text-xl">💧</span></p>
                <p className="text-[9px] font-black text-emerald-800 uppercase tracking-widest">LOGISTICS</p>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col md:flex-row items-center justify-center gap-4">
            <button onClick={resetFlow} className="w-full md:w-auto px-10 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-slate-50 active:scale-95 transition-all shadow-sm">Tiếp tục mua sắm</button>
            <button onClick={() => setCurrentStep('social')} className="w-full md:w-auto px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-emerald-700 active:scale-95 transition-all shadow-lg shadow-emerald-100">BXH & Cộng đồng</button>
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
           <button onClick={() => setActiveProduct(null)} className="mb-4 text-emerald-600 text-sm font-bold flex items-center hover:translate-x-[-4px] transition-transform">← Quay lại danh sách</button>
           <div className="bg-white p-4 md:p-8 rounded-xl shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row gap-6 md:gap-12">
                <div className="w-full md:w-1/2"><img src={activeProduct.image} className="w-full aspect-square object-cover rounded-xl shadow-inner border border-slate-100" /></div>
                <div className="w-full md:w-1/2 space-y-6">
                  <div className="flex items-center space-x-3"><span className="text-sm font-bold text-slate-400">{activeProduct.shopName}</span></div>
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
                    <div className="text-sm leading-relaxed text-slate-500">{activeProduct.isGreen ? 'Sản phẩm đáp ứng tiêu chuẩn bền vững, ưu tiên nguyên liệu tái chế và giảm thiểu rác thải.' : 'Sản phẩm sản xuất theo quy trình công nghiệp tiêu chuẩn.'}</div>
                    <div className="flex space-x-4 pt-6">
                      <button onClick={() => setCurrentStep('packaging')} className="flex-1 bg-emerald-600 text-white py-4 font-bold rounded-xl shadow-lg hover:bg-emerald-700 active:scale-95 transition-all uppercase text-xs tracking-widest">Mua Ngay</button>
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
        <button onClick={() => setCurrentStep('social')} className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl shadow-xl flex items-center justify-center text-xl md:text-2xl transition-all hover:scale-110 active:scale-90 ${currentStep === 'social' ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-white text-emerald-600 border border-slate-100'}`} title="Xem Bảng xếp hạng">🏆</button>
      </div>
      <footer className="py-2 px-4 md:px-8 text-[8px] text-slate-300 flex justify-end">
        <button onClick={() => dataService.exportData()} className="hover:text-slate-500 underline uppercase tracking-widest">Export Survey Data</button>
      </footer>
    </div>
  );
};

const AppWrapper: React.FC = () => {
  const context = useAppContext();
  const [localEmail, setLocalEmail] = useState('');
  const [recentEmails, setRecentEmails] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_EMAILS_KEY);
    if (saved) { try { setRecentEmails(JSON.parse(saved)); } catch (e) { console.error("Lỗi đọc email"); } }
    const handleClickOutside = (event: MouseEvent) => { if (suggestionRef.current && !suggestionRef.current.contains(event.target as Node)) { setShowSuggestions(false); } };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleCredentialResponse = (response: any) => {
      try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
        const profile = JSON.parse(jsonPayload);
        saveEmailToRecent(profile.email);
        context.setUserEmail(profile.email);
        context.setCurrentStep('shop');
      } catch (err) { console.error("Lỗi Google Sign-in:", err); }
    };
    if (typeof (window as any).google !== 'undefined') {
      (window as any).google.accounts.id.initialize({ client_id: GOOGLE_CLIENT_ID, callback: handleCredentialResponse });
      (window as any).google.accounts.id.prompt();
    }
  }, []);

  const saveEmailToRecent = (email: string) => {
    const saved = localStorage.getItem(RECENT_EMAILS_KEY);
    let list: string[] = saved ? JSON.parse(saved) : [];
    if (!list.includes(email)) { list = [email, ...list].slice(0, 5); localStorage.setItem(RECENT_EMAILS_KEY, JSON.stringify(list)); setRecentEmails(list); }
  };

  const handleStart = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(localEmail)) { alert('Vui lòng nhập đúng định dạng email.'); return; }
    saveEmailToRecent(localEmail);
    context.setUserEmail(localEmail);
    context.setCurrentStep('shop');
  };

  const filteredEmails = recentEmails.filter(e => e.toLowerCase().includes(localEmail.toLowerCase()));

  if (context.currentStep === 'login') {
    return (
      <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center p-4 md:p-6 text-center text-white relative overflow-hidden">
        <div className="bg-white p-6 md:p-10 rounded-[2rem] md:rounded-[2.5rem] shadow-2xl w-full max-w-2xl animate-slideUp relative z-10 flex flex-col">
          <div className="text-5xl mb-4">🌿</div>
          <h1 className="text-3xl md:text-4xl font-black text-emerald-600 mb-8 tracking-tighter uppercase">ĐIỂM XANH</h1>
          <div className="space-y-6 text-left mb-10">
            <div className="bg-emerald-50 p-6 md:p-8 rounded-3xl border border-emerald-100 shadow-inner">
              <h3 className="text-emerald-800 font-black text-sm md:text-base uppercase tracking-widest mb-4 flex items-center"><span>💡</span> Giới thiệu</h3>
              <div className="text-emerald-900 text-[13px] md:text-sm leading-relaxed font-medium space-y-4">
                <p>
                  Điểm xanh là hệ thống trò chơi hóa mô phỏng do nhóm nghiên cứu thực hiện, khi khách hàng mua sắm sản phẩm thân thiện với môi trường, đóng gói bằng bao bì thân thiện với môi trường, giao hàng bằng xe điện,... Khách hàng sẽ nhận được điểm xanh tương ứng với mức độ đóng góp vào việc cải thiện môi trường.
                </p>
                <p>
                  Điểm xanh này được tính toán dựa trên lượng giảm rác thải của sản phẩm và dấu chân carbon đều được sàn TMĐT kiểm định. Ứng với mỗi số điểm xanh nhận được, quý khách hàng có thể sử dụng để đổi sản phẩm, dịch vụ miễn phí. Ngoài ra điểm xanh còn thể hiện sự tham gia về đóng góp môi trường của khách hàng.
                </p>
                <p className="font-bold italic border-t border-emerald-100 pt-2">
                  Mọi thông tin cung cấp sẽ được bảo mật tuyệt đối, chỉ sử dụng cho mục đích nghiên cứu học thuật và không tiết lộ cho bất kỳ bên thứ ba nào.
                </p>
              </div>
            </div>
          </div>
          <div className="space-y-6 text-left max-w-md mx-auto w-full">
            <div className="flex justify-center mb-8"><div className="g_id_signin" data-type="standard"></div></div>
            <div className="flex items-center space-x-4 mb-6"><div className="h-px flex-1 bg-slate-100"></div><span className="text-[10px] text-slate-400 font-black uppercase whitespace-nowrap">NHẬP EMAIL CỦA BẠN ĐỂ BẮT ĐẦU</span><div className="h-px flex-1 bg-slate-100"></div></div>
            <div className="relative" ref={suggestionRef}>
              <input 
                type="email" 
                value={localEmail} 
                onFocus={() => setShowSuggestions(true)} 
                onChange={(e) => { setLocalEmail(e.target.value); setShowSuggestions(true); }} 
                placeholder="Vui lòng nhập email vào ô này" 
                className="w-full px-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-slate-800 outline-none focus:ring-4 focus:ring-emerald-50 transition-all text-center text-lg font-bold mb-4" 
              />
              {showSuggestions && filteredEmails.length > 0 && (
                <div className="absolute top-[85%] left-0 right-0 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden py-1">
                  {filteredEmails.map((email, idx) => ( 
                    <div 
                      key={idx} 
                      onClick={() => { setLocalEmail(email); setShowSuggestions(false); }} 
                      className="px-6 py-4 hover:bg-emerald-50 cursor-pointer text-slate-700 font-bold border-b border-slate-50 last:border-0"
                    >
                      {email}
                    </div> 
                  ))}
                </div>
              )}
            </div>
            <button onClick={handleStart} className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest">Bắt đầu trải nghiệm</button>
          </div>
        </div>
      </div>
    );
  }
  return <MainContent />;
};

const App: React.FC = () => { return ( <AppProvider> <AppWrapper /> </AppProvider> ); };
export default App;
