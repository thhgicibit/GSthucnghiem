import React from 'react';
import { useAppContext } from '../AppContext';
import { dataService, SurveyRecord } from '../dataService';

const Checkout: React.FC = () => {
  const { 
    userName,
    activeProduct, 
    selectedLogistics, 
    setSelectedLogistics, 
    addPoints, 
    setCurrentStep, 
    setActiveProduct,
    greenScore,
    refreshLeaderboard
  } = useAppContext();

  const handlePlaceOrder = async () => {
    let totalEarned = 0;
    const isGreenProd = activeProduct?.isGreen ? 1 : 0;
    const isGreenLog = selectedLogistics === 'green' ? 1 : 0;

    if (activeProduct?.isGreen) totalEarned += activeProduct.greenPoints;
    if (selectedLogistics === 'green') totalEarned += 25;
    
    const finalScore = greenScore + totalEarned;

    const record: SurveyRecord = {
      timestamp: new Date().toISOString(),
      userId: userName,
      userName: userName,
      productId: activeProduct?.id || 'unknown',
      isGreenProduct: isGreenProd,
      logisticsType: selectedLogistics || 'unknown',
      isGreenLogistics: isGreenLog,
      finalGreenScore: finalScore
    };

    await dataService.saveChoice(record);
    
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

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 animate-slideUp overflow-hidden">
      {/* Address Section */}
      <div className="p-4 md:p-8 border-b border-dashed border-slate-200 bg-slate-50/50">
        <div className="flex items-center text-emerald-600 mb-3 md:mb-4">
          <span className="text-xl mr-2">📍</span>
          <h2 className="text-[10px] md:text-sm font-black uppercase tracking-widest">Địa Chỉ Nhận Hàng</h2>
        </div>
        <div className="flex flex-col md:flex-row font-bold text-slate-800 gap-2 items-start md:items-baseline">
          <span className="text-slate-500 font-medium text-xs md:text-sm leading-relaxed">
            Thông tin mặc định theo kịch bản khảo sát.
          </span>
          <span className="text-emerald-600 font-bold text-[10px] md:text-xs cursor-not-allowed md:ml-auto opacity-40 uppercase tracking-widest">Thay Đổi</span>
        </div>
      </div>

      {/* Product Summary */}
      <div className="p-4 md:p-8">
        {/* Desktop Header Hidden on Mobile */}
        <div className="hidden md:grid grid-cols-12 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b pb-3">
          <div className="col-span-6">Sản phẩm</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-right">Thành tiền</div>
        </div>
        
        <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-start md:items-center">
          <div className="w-full md:col-span-6 flex items-center space-x-4 md:space-x-5">
            <img src={activeProduct?.image} className="w-16 h-16 md:w-20 md:h-20 border border-slate-100 rounded-xl object-cover shadow-sm flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-slate-800 font-bold text-xs md:text-sm leading-tight mb-2 truncate">{activeProduct?.name}</p>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">Phân loại:</span>
                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 truncate">{activeProduct?.material}</span>
              </div>
            </div>
          </div>
          
          <div className="flex w-full md:col-span-6 justify-between items-center md:contents">
            <div className="md:hidden text-[10px] font-black uppercase text-slate-400">Giá:</div>
            <div className="md:col-span-2 md:text-center font-bold text-slate-700 text-sm">₫{activeProduct?.price.toLocaleString()}</div>
            
            <div className="md:hidden text-[10px] font-black uppercase text-slate-400 ml-auto md:ml-0 mr-2">SL:</div>
            <div className="md:col-span-2 md:text-center font-bold text-slate-700 text-sm">1</div>
            
            <div className="md:col-span-2 text-right font-black text-slate-800 text-base md:text-lg">₫{activeProduct?.price.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Logistics Selection */}
      <div className="bg-[#fafdff] p-4 md:p-8 border-y border-slate-100">
        <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mb-4">Đơn vị vận chuyển</h3>
        <div className="space-y-4">
          {/* Green Logistics */}
          <div 
            onClick={() => setSelectedLogistics('green')}
            className={`p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'green' ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-2xl md:text-3xl">🚲</span>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <p className="font-black text-slate-800 text-xs md:text-sm">Vận Chuyển Xanh</p>
                    <span className="bg-emerald-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">+25 GS</span>
                  </div>
                  <p className="text-[10px] md:text-xs text-slate-500 leading-snug">Xe điện & bao bì giấy. <span className="font-bold text-emerald-600">3-5 ngày</span>.</p>
                </div>
              </div>
              <p className="font-black text-emerald-600 text-base md:text-lg ml-2">₫25k</p>
            </div>
          </div>

          {/* Standard Logistics */}
          <div 
            onClick={() => setSelectedLogistics('standard')}
            className={`p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'standard' ? 'border-slate-800 bg-slate-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-2xl md:text-3xl">🚚</span>
                <div>
                  <p className="font-black text-slate-800 text-xs md:text-sm mb-1">Tiêu Chuẩn</p>
                  <p className="text-[10px] md:text-xs text-slate-500">1-2 ngày.</p>
                </div>
              </div>
              <span className="font-black text-slate-800 text-base md:text-lg">₫22k</span>
            </div>
          </div>

          {/* Fast Logistics */}
          <div 
            onClick={() => setSelectedLogistics('fast')}
            className={`p-4 md:p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'fast' ? 'border-amber-500 bg-amber-50/30 shadow-md' : 'border-slate-100 bg-white hover:border-amber-200'}`}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3 md:space-x-4">
                <span className="text-2xl md:text-3xl">⚡</span>
                <div>
                  <p className="font-black text-slate-800 text-xs md:text-sm mb-1">Hỏa Tốc</p>
                  <p className="text-[10px] md:text-xs text-slate-500">Giao nhanh trong 24h.</p>
                </div>
              </div>
              <span className="font-black text-slate-800 text-base md:text-lg">₫35k</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="p-6 md:p-10 bg-white border-t border-slate-50 flex flex-col items-center md:items-end space-y-6">
        <div className="w-full md:w-auto grid grid-cols-2 gap-x-4 md:gap-x-12 gap-y-2 md:gap-y-3 text-xs md:text-sm text-right">
          <span className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest self-center">Tiền hàng:</span>
          <span className="text-slate-800 font-bold">₫{activeProduct?.price.toLocaleString()}</span>
          
          <span className="text-slate-400 font-bold uppercase text-[9px] md:text-[10px] tracking-widest self-center">Phí ship:</span>
          <span className="text-slate-800 font-bold">₫{getShippingFee().toLocaleString()}</span>
          
          <div className="col-span-2 border-t border-slate-100 my-1 md:my-2"></div>
          
          <span className="text-slate-800 font-black text-base md:text-lg uppercase tracking-tighter self-center">Tổng:</span>
          <span className="text-2xl md:text-3xl text-emerald-600 font-black tracking-tighter">
            ₫{(activeProduct?.price + getShippingFee()).toLocaleString()}
          </span>
        </div>
        
        <div className="flex flex-row space-x-4 w-full justify-center md:justify-end">
          <button 
            onClick={() => { setActiveProduct(null); setCurrentStep('shop'); }}
            className="px-4 md:px-8 py-4 text-slate-400 font-black uppercase text-[9px] md:text-[10px] tracking-widest hover:text-slate-600"
          >
            Hủy
          </button>
          <button 
            onClick={handlePlaceOrder}
            disabled={!selectedLogistics}
            className={`flex-1 md:flex-none px-8 md:px-16 py-4 rounded-xl font-black uppercase text-[10px] md:text-xs tracking-[0.2em] text-white shadow-xl transition-all ${selectedLogistics ? 'bg-emerald-600 hover:bg-emerald-700 active:scale-95' : 'bg-slate-200 cursor-not-allowed'}`}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;