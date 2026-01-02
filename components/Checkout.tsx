
import React from 'react';
import { useAppContext } from '../AppContext';
import { dataService, SurveyRecord } from '../dataService';

const Checkout: React.FC = () => {
  const { 
    userEmail,
    activeProduct, 
    selectedLogistics, 
    setSelectedLogistics,
    selectedPackaging,
    addPoints, 
    setCurrentStep, 
    setActiveProduct,
    greenScore,
    refreshLeaderboard
  } = useAppContext();

  const handlePlaceOrder = async () => {
    // 1. Tính toán điểm để hiển thị trên UI thành công
    const prodPoints = activeProduct?.isGreen ? activeProduct.greenPoints : 0;
    const packPoints = selectedPackaging === 'green' ? 10 : 0;
    const logiPoints = selectedLogistics === 'green' ? 25 : 0;
    const totalEarned = prodPoints + packPoints + logiPoints;
    const finalScore = greenScore + totalEarned;

    // 2. Tạo record tối giản quy đổi 0/1 cho Google Sheet
    const record: SurveyRecord = {
      userEmail: userEmail,
      productId: activeProduct?.id || 'unknown',
      isGreenProduct: activeProduct?.isGreen ? 1 : 0,
      logisticsType: selectedLogistics || 'standard',
      isGreenLogistics: selectedLogistics === 'green' ? 1 : 0,
      packagingType: selectedPackaging || 'standard',
      isGreenPackaging: selectedPackaging === 'green' ? 1 : 0
    };

    // 3. Gửi dữ liệu đi
    await dataService.saveChoice(record, finalScore);
    
    // 4. Chuyển sang màn hình thành công
    addPoints(totalEarned);
    refreshLeaderboard();
    setCurrentStep('success');
  };

  const getShippingFee = () => {
    if (selectedLogistics === 'green') return 25000;
    if (selectedLogistics === 'standard') return 22000;
    if (selectedLogistics === 'fast') return 35000;
    return 0;
  };

  const formatPrice = (amount: number) => {
    return (
      <>
        <span className="underline decoration-1 underline-offset-2 decoration-current">₫</span>
        {amount.toLocaleString('vi-VN')}
      </>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 animate-slideUp overflow-hidden">
      <div className="p-4 md:p-8 border-b border-dashed border-slate-200 bg-slate-50/50">
        <div className="flex items-center text-emerald-600 mb-3 md:mb-4">
          <span className="text-xl mr-2">📍</span>
          <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest">Địa Chỉ Nhận Hàng</h2>
        </div>
        <div className="flex flex-col md:flex-row font-bold text-slate-800 gap-2 items-start md:items-baseline">
          <span className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">
            Mặc định theo hệ thống
          </span>
          <span className="text-emerald-600 font-bold text-[10px] md:text-xs cursor-not-allowed md:ml-auto opacity-40 uppercase tracking-widest">Thay Đổi</span>
        </div>
      </div>

      <div className="p-4 md:p-8">
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center">
          <div className="w-full md:col-span-6 flex items-center space-x-4 md:space-x-5">
            <img src={activeProduct?.image} className="w-16 h-16 md:w-20 md:h-20 border border-slate-100 rounded-xl object-cover shadow-sm flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-800 font-bold text-xs md:text-sm leading-tight mb-2 truncate">{activeProduct?.name}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{activeProduct?.material}</span>
                <span className={`text-[8px] font-black uppercase tracking-tighter px-2 py-0.5 rounded border ${selectedPackaging === 'green' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-slate-400 bg-slate-50 border-slate-100'}`}>
                  Đóng gói: {selectedPackaging === 'green' ? 'Eco (+10💧)' : 'Tiêu chuẩn'}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex w-full md:col-span-6 justify-between items-center md:contents">
            <div className="md:hidden text-[10px] font-black uppercase text-slate-400">Giá:</div>
            <div className="md:col-span-2 md:text-center font-bold text-slate-700 text-sm">{formatPrice(activeProduct?.price || 0)}</div>
            <div className="md:hidden text-[10px] font-black uppercase text-slate-400 ml-auto md:ml-0 mr-2">SL:</div>
            <div className="md:col-span-2 md:text-center font-bold text-slate-700 text-sm">1</div>
            <div className="md:col-span-2 text-right font-black text-slate-800 text-base md:text-lg">{formatPrice(activeProduct?.price || 0)}</div>
          </div>
        </div>
      </div>

      <div className="bg-[#fafdff] p-4 md:p-8 border-y border-slate-100">
        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4">Hình thức vận chuyển</h3>
        <div className="space-y-4">
          <div onClick={() => setSelectedLogistics('green')} className={`p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'green' ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-2xl md:text-3xl">🚲</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-black text-slate-800 text-xs md:text-sm">Vận chuyển xanh</p>
                    <span className="bg-emerald-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">+25 💧</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-snug">Sử dụng phương tiện chạy điện. Thời gian: 3-5 ngày.</p>
                </div>
              </div>
              <p className="font-black text-emerald-600 text-base md:text-lg ml-2">{formatPrice(25000)}</p>
            </div>
          </div>

          <div onClick={() => setSelectedLogistics('standard')} className={`p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'standard' ? 'border-slate-800 bg-slate-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-2xl md:text-3xl">🚚</span>
                <div>
                  <p className="font-black text-slate-800 text-xs md:text-sm mb-1">Giao hàng Tiêu chuẩn</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Dịch vụ giao hàng truyền thống. Thời gian: 2-3 ngày.</p>
                </div>
              </div>
              <span className="font-black text-slate-800 text-base md:text-lg">{formatPrice(22000)}</span>
            </div>
          </div>

          <div onClick={() => setSelectedLogistics('fast')} className={`p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'fast' ? 'border-amber-500 bg-amber-50/30 shadow-md' : 'border-slate-100 bg-white hover:border-amber-200'}`}>
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-2xl md:text-3xl">⚡</span>
                <div>
                  <p className="font-black text-slate-800 text-xs md:text-sm mb-1">Giao hàng Hỏa tốc</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Dịch vụ giao ngay trong ngày. Thời gian: 2-4 giờ.</p>
                </div>
              </div>
              <span className="font-black text-slate-800 text-base md:text-lg">{formatPrice(35000)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-10 bg-white border-t border-slate-50 flex flex-col items-center md:items-end space-y-6">
        <div className="w-full md:w-auto grid grid-cols-2 gap-x-4 md:gap-x-12 gap-y-2 md:gap-y-3 text-xs md:text-sm text-right">
          <span className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest self-center">Tiền hàng:</span>
          <span className="text-slate-800 font-bold">{formatPrice(activeProduct?.price || 0)}</span>
          <span className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest self-center">Phí ship:</span>
          <span className="text-slate-800 font-bold">{formatPrice(getShippingFee())}</span>
          <div className="col-span-2 border-t border-slate-100 my-1 md:my-2"></div>
          <span className="text-slate-800 font-black text-base md:text-lg uppercase tracking-tighter self-center">Tổng:</span>
          <span className="text-2xl md:text-3xl text-emerald-600 font-black tracking-tighter">{formatPrice((activeProduct?.price || 0) + getShippingFee())}</span>
        </div>
        
        <div className="flex flex-row space-x-4 w-full justify-center md:justify-end">
          <button onClick={() => { setActiveProduct(null); setCurrentStep('shop'); }} className="px-4 md:px-8 py-4 text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:text-slate-600">Hủy</button>
          <button onClick={handlePlaceOrder} disabled={!selectedLogistics} className={`flex-1 md:flex-none px-8 md:px-16 py-4 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] text-white shadow-xl transition-all ${selectedLogistics ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95' : 'bg-slate-200 cursor-not-allowed'}`}>Đặt hàng</button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
