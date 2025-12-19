
import React from 'react';
import { useAppContext } from '../AppContext';
import { PRODUCTS } from '../constants';

const ProductGrid: React.FC = () => {
  const { setActiveProduct } = useAppContext();

  return (
    <div className="flex-1">
      {/* Grid sản phẩm đối chứng */}
      <div className="grid grid-cols-3 gap-6">
        {PRODUCTS.map(product => (
          <div 
            key={product.id}
            onClick={() => setActiveProduct(product)}
            className="bg-white border border-slate-100 rounded-2xl hover:border-emerald-600 hover:shadow-xl transition-all cursor-pointer flex flex-col group h-full shadow-sm overflow-hidden"
          >
            <div className="relative aspect-square bg-slate-50 overflow-hidden">
              <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              
              {/* Thưởng Green Score */}
              {product.isGreen && (
                <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] px-3 py-1 font-black rounded-full shadow-lg z-10">
                   +{product.greenPoints} GS
                </div>
              )}

              {/* Shop Type Tag */}
              <div className="absolute bottom-4 left-4 z-10">
                {product.isGreenShop ? (
                   <span className="bg-emerald-600 text-white text-[9px] px-2 py-1 rounded-md font-black shadow-lg uppercase tracking-widest">
                     ☘️ Shop Xanh
                   </span>
                ) : (
                   <span className="bg-white/90 text-slate-500 text-[9px] px-2 py-1 rounded-md font-black shadow-lg uppercase tracking-widest border border-slate-100">
                     Shop Tiêu Chuẩn
                   </span>
                )}
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col space-y-4">
              <h3 className="text-sm leading-tight text-slate-800 font-bold group-hover:text-emerald-600 transition-colors h-10 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex flex-col mt-auto pt-4 border-t border-slate-50">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-800 text-xl font-black tracking-tighter">₫{product.price.toLocaleString()}</span>
                  <div className="text-[10px] text-slate-400 font-bold">⭐ {product.sellerRating}</div>
                </div>
                
                <div className="mt-3 flex items-center text-[9px] uppercase tracking-widest font-black text-slate-400">
                  <span>Vật liệu: </span>
                  <span className={`ml-2 ${product.isGreen ? 'text-emerald-600' : 'text-slate-600'}`}>
                    {product.material}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;
