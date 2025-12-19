
import React from 'react';
import { useAppContext } from '../AppContext';

const Checkout: React.FC = () => {
  const { activeProduct, selectedLogistics, setSelectedLogistics, addPoints, setCurrentStep, setActiveProduct } = useAppContext();

  const handlePlaceOrder = () => {
    let totalEarned = 0;
    if (activeProduct?.isGreen) totalEarned += activeProduct.greenPoints;
    if (selectedLogistics === 'green') totalEarned += 25;
    
    addPoints(totalEarned);
    setCurrentStep('success');
  };

  const getShippingFee = () => {
    if (selectedLogistics === 'green') return 15000;
    if (selectedLogistics === 'standard') return 22000;
    if (selectedLogistics === 'fast') return 35000;
    return 0;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 animate-slideUp overflow-hidden">
      {/* Address Section - Simplified for Research */}
      <div className="p-8 border-b border-dashed border-slate-200 bg-slate-50/50">
        <div className="flex items-center text-emerald-600 mb-4">
          <span className="text-xl mr-2">📍</span>
          <h2 className="text-sm font-black uppercase tracking-widest">Địa Chỉ Nhận Hàng</h2>
        </div>
        <div className="flex font-bold text-slate-800 space-x-6 items-baseline">
          <span className="text-slate-500 font-medium text-sm leading-relaxed">
            Thông tin người nhận và địa chỉ đã được mặc định theo kịch bản khảo sát.
          </span>
          <span className="text-emerald-600 font-bold text-xs cursor-not-allowed ml-auto opacity-40 uppercase tracking-widest">Thay Đổi</span>
        </div>
      </div>

      {/* Product Summary */}
      <div className="p-8">
        <div className="grid grid-cols-12 gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 border-b pb-3">
          <div className="col-span-6">Sản phẩm của bạn</div>
          <div className="col-span-2 text-center">Đơn giá</div>
          <div className="col-span-2 text-center">Số lượng</div>
          <div className="col-span-2 text-right">Thành tiền</div>
        </div>
        <div className="grid grid-cols-12 gap-4 items-center">
          <div className="col-span-6 flex items-center space-x-5">
            <img src={activeProduct?.image} className="w-20 h-20 border border-slate-100 rounded-xl object-cover shadow-sm" />
            <div>
              <p className="text-slate-800 font-bold leading-tight mb-2">{activeProduct?.name}</p>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-black uppercase tracking-tighter text-slate-400">Phân loại:</span>
                <span className="text-[8px] font-black uppercase tracking-tighter text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">{activeProduct?.material}</span>
              </div>
            </div>
          </div>
          <div className="col-span-2 text-center font-bold text-slate-700">₫{activeProduct?.price.toLocaleString()}</div>
          <div className="col-span-2 text-center font-bold text-slate-700">1</div>
          <div className="col-span-2 text-right font-black text-slate-800 text-lg">₫{activeProduct?.price.toLocaleString()}</div>
        </div>
      </div>

      {/* Logistics Selection */}
      <div className="bg-[#fafdff] p-8 border-y border-slate-100">
        <div className="flex justify-between items-start">
          <h3 className="font-black text-[10px] uppercase tracking-widest text-slate-400 mt-2">Đơn vị vận chuyển</h3>
          <div className="flex-1 max-w-xl space-y-4">
            {/* Green Logistics */}
            <div 
              onClick={() => setSelectedLogistics('green')}
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'green' ? 'border-emerald-500 bg-emerald-50/50 shadow-md' : 'border-slate-100 bg-white hover:border-emerald-200'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">🚲</span>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="font-black text-slate-800 text-sm">Vận Chuyển Xanh</p>
                      <span className="bg-emerald-600 text-white text-[8px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">+25 GS</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">Sử dụng phương tiện điện, bao bì giảm thiểu nhựa. Nhận sau 2-3 ngày.</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="font-black text-emerald-600">₫15.000</p>
                   <p className="text-[8px] text-emerald-500 font-bold uppercase line-through opacity-50">₫22.000</p>
                </div>
              </div>
            </div>

            {/* Fast Logistics - NEW */}
            <div 
              onClick={() => setSelectedLogistics('fast')}
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all ${selectedLogistics === 'fast' ? 'border-amber-500 bg-amber-50/30 shadow-md' : 'border-slate-100 bg-white hover:border-amber-200'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <p className="font-black text-slate-800 text-sm mb-1">Giao Hàng Nhanh (Hỏa Tốc)</p>
                    <p className="text-xs text-slate-500 leading-snug">Giao hàng siêu tốc trong vòng 24h bằng xe máy.</p>
                  </div>
                </div>
                <span className="font-black text-slate-800">₫35.000</span>
              </div>
            </div>

            {/* Standard Logistics */}
            <div 
              onClick={() => setSelectedLogistics('standard')}
              className={`p-5 border-2 rounded-2xl cursor-pointer transition-all opacity-60 ${selectedLogistics === 'standard' ? 'border-slate-800 bg-slate-50' : 'border-slate-100 bg-white hover:border-slate-200'}`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">🚚</span>
                  <div>
                    <p className="font-black text-slate-800 text-sm mb-1">Giao Hàng Tiêu Chuẩn</p>
                    <p className="text-xs text-slate-500 leading-snug">Vận chuyển theo quy trình truyền thống. Nhận sau 1-2 ngày.</p>
                  </div>
                </div>
                <span className="font-black text-slate-800">₫22.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Footer */}
      <div className="p-10 bg-white border-t border-slate-50 flex flex-col items-end space-y-6">
        <div className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-right">
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Tổng hàng:</span>
          <span className="text-slate-800 font-bold text-base">₫{activeProduct?.price.toLocaleString()}</span>
          
          <span className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Vận chuyển:</span>
          <span className="text-slate-800 font-bold text-base">₫{getShippingFee().toLocaleString()}</span>
          
          {selectedLogistics === 'green' && (
            <>
              <span className="text-emerald-600 font-black uppercase text-[10px] tracking-widest italic">Ưu đãi Xanh:</span>
              <span className="text-emerald-600 font-black text-base">-₫7.000</span>
            </>
          )}

          <div className="col-span-2 border-t border-slate-100 my-2"></div>
          
          <span className="text-slate-800 font-black text-lg uppercase tracking-tighter">Tổng thanh toán:</span>
          <span className="text-3xl text-emerald-600 font-black tracking-tighter">
            ₫{(activeProduct?.price + getShippingFee() - (selectedLogistics === 'green' ? 7000 : 0)).toLocaleString()}
          </span>
        </div>
        
        <div className="flex space-x-4 w-full justify-end">
          <button 
            onClick={() => { setActiveProduct(null); setCurrentStep('shop'); }}
            className="px-8 py-4 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:text-slate-600 transition-colors"
          >
            Hủy đơn hàng
          </button>
          <button 
            onClick={handlePlaceOrder}
            disabled={!selectedLogistics}
            className={`px-16 py-4 rounded-2xl font-black uppercase text-xs tracking-[0.2em] text-white shadow-xl transition-all ${selectedLogistics ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 active:scale-95' : 'bg-slate-200 cursor-not-allowed'}`}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
