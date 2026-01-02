
import React, { useState } from 'react';
import { useAppContext } from '../AppContext';
import { PRODUCTS } from '../constants';

const ShoppingScenario: React.FC = () => {
  const { addPoints, setCurrentStep } = useAppContext();
  const [stage, setStage] = useState<'browse' | 'product' | 'checkout' | 'success'>('browse');
  const [tempProduct, setTempProduct] = useState<any>(null);

  const handleSelectProduct = (product: any) => {
    setTempProduct(product);
    setStage('product');
  };

  const handleBuy = () => {
    if (tempProduct.isGreen) {
      addPoints(tempProduct.greenPoints);
    }
    setStage('checkout');
  };

  const handleLogistics = (isGreen: boolean) => {
    if (isGreen) {
      addPoints(25);
    }
    setStage('success');
  };

  if (stage === 'browse') {
    return (
      <div className="px-4 space-y-4">
        <div className="flex justify-between items-center mt-2">
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">GỢI Ý HÔM NAY</h3>
          <div className="h-0.5 flex-1 bg-slate-200 mx-4"></div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {PRODUCTS.map(product => (
            <div 
              key={product.id} 
              onClick={() => handleSelectProduct(product)}
              className="bg-white rounded-sm shadow-sm overflow-hidden flex flex-col border border-transparent hover:border-shopee-orange transition-all cursor-pointer"
            >
              <div className="relative aspect-square">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                {product.isGreen && (
                  <div className="absolute top-0 left-0 bg-green-500 text-white text-[9px] font-bold px-1 py-0.5 rounded-br-sm">
                    ECO CHOICE
                  </div>
                )}
              </div>
              <div className="p-2 flex-1 flex flex-col">
                <h4 className="text-[12px] text-slate-800 line-clamp-2 leading-tight h-8">{product.name}</h4>
                <div className="mt-auto pt-2">
                  <div className="flex items-center space-x-1">
                    <span className="text-shopee-orange font-medium text-sm">₫</span>
                    <span className="text-shopee-orange font-bold text-base">{product.price.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px] text-slate-400">Đã bán 1.2k</span>
                    {product.isGreen && (
                      <span className="text-green-600 text-[9px] font-bold bg-green-50 px-1 rounded border border-green-200">
                        +{product.greenPoints} GS
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (stage === 'product') {
    return (
      <div className="bg-white min-h-[80vh] animate-slideUp">
        <div className="relative">
          <button onClick={() => setStage('browse')} className="absolute top-4 left-4 z-10 bg-black/30 text-white w-8 h-8 rounded-full flex items-center justify-center">←</button>
          <img src={tempProduct.image} className="w-full aspect-square object-cover" />
        </div>
        <div className="p-4 space-y-3">
          <div className="flex items-baseline space-x-1">
            <span className="text-shopee-orange text-lg">₫</span>
            <span className="text-shopee-orange text-3xl font-bold">{tempProduct.price.toLocaleString()}</span>
          </div>
          <h2 className="text-lg font-medium text-slate-800">{tempProduct.name}</h2>
          <div className="flex items-center space-x-3 text-xs text-slate-400">
            <span>⭐ 4.9/5</span>
            <span>|</span>
            <span>Đã bán 2.5k</span>
          </div>
          <div className="py-3 border-t border-slate-100 mt-4">
            <div className="flex items-center space-x-2 mb-2">
              <span className="text-green-600">🍃</span>
              <span className="font-bold text-sm">Cam kết Eco-Shop</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">{tempProduct.description}</p>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 p-3 flex space-x-2 z-50">
          <button className="flex-1 border border-shopee-orange text-shopee-orange py-3 rounded-sm font-medium text-sm">Thêm vào giỏ</button>
          <button onClick={handleBuy} className="flex-1 bg-shopee-orange text-white py-3 rounded-sm font-bold text-sm">Mua ngay</button>
        </div>
      </div>
    );
  }

  if (stage === 'checkout') {
    return (
      <div className="bg-slate-50 min-h-screen pb-20 animate-slideUp">
        <div className="bg-white p-4 border-b border-slate-100 flex items-center">
          <button onClick={() => setStage('product')} className="text-shopee-orange mr-4">←</button>
          <h2 className="font-medium">Thanh toán</h2>
        </div>
        
        <div className="mt-2 bg-white p-4 space-y-4">
          <div className="flex items-center space-x-2 text-shopee-orange">
            <span>📍</span>
            <div className="text-sm">
              <p className="font-bold text-slate-800">Địa chỉ nhận hàng</p>
            </div>
          </div>
        </div>

        <div className="mt-2 bg-white p-4">
          <h3 className="text-sm font-medium border-b border-slate-50 pb-2 mb-3">Phương thức vận chuyển</h3>
          <div className="space-y-3">
            <div 
              onClick={() => handleLogistics(true)}
              className="border border-green-500 rounded p-4 bg-green-50/50 cursor-pointer relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm text-green-700">Hỏa Tốc Xanh (Giảm 70% khí thải)</p>
                  <p className="text-[10px] text-green-600">Nhận hàng trong 2h bằng xe điện</p>
                  <span className="mt-2 inline-block bg-green-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">TẶNG +25 GREEN SCORE</span>
                </div>
                <span className="text-green-700 font-bold text-sm">₫25.000</span>
              </div>
              <div className="absolute top-0 right-0 bg-green-500 text-white text-[8px] px-1">Eco-Logistics</div>
            </div>

            <div 
              onClick={() => handleLogistics(false)}
              className="border border-slate-200 rounded p-4 bg-white cursor-pointer"
            >
              <div className="flex justify-between items-start opacity-60">
                <div>
                  <p className="font-bold text-sm text-slate-700">Giao hàng Tiết Kiệm</p>
                  <p className="text-[10px] text-slate-500">Nhận hàng trong 2-3 ngày</p>
                </div>
                <span className="text-slate-700 font-bold text-sm">₫15.000</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (stage === 'success') {
    return (
      <div className="fixed inset-0 bg-white z-[100] flex flex-col items-center justify-center p-8 text-center animate-scaleIn">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <span className="text-4xl text-green-600">✓</span>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Đặt hàng thành công!</h2>
        <p className="text-sm text-slate-500 mt-2">Cảm ơn bạn đã lựa chọn tiêu dùng xanh. Green Score của bạn đã được cộng!</p>
        <button 
          onClick={() => setCurrentStep('social')}
          className="mt-8 w-full bg-shopee-orange text-white font-bold py-3 rounded-sm shadow-lg shadow-orange-100"
        >
          Xem thứ hạng của bạn
        </button>
      </div>
    );
  }

  return null;
};

export default ShoppingScenario;
