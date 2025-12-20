import React from 'react';
import { useAppContext } from '../AppContext';
import { PRODUCTS } from '../constants';

const ProductGrid: React.FC = () => {
  const { setActiveProduct } = useAppContext();

  return (
    <div className="flex-1">
      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
                <div className="absolute top-3 right-3 md:top-4 md:right-4 bg-emerald-600 text-white text-[9px] md:text-[10px] px-2 md:px-3 py-1 font-black rounded-full shadow-lg z-10">
                   +{product.greenPoints} GS
                </div>
              )}

              {/* Shop Type Tag */}
              <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 z-10">
                {product.isGreenShop ? (
                   <span className="bg-emerald-600 text-white text-[8px] md:text-[9px] px-2 py-1 rounded-md font-black shadow-lg uppercase tracking-widest">
                     ☘️ Shop Xanh
                   </span>
                ) : (
                   <span className="bg-white/90 text-slate-500 text-[8px] md:text-[9px] px-2 py-1 rounded-md font-black shadow-lg uppercase tracking-widest border border-slate-100">
                     Shop Tiêu Chuẩn
                   </span>
                )}
              </div>
            </div>

            <div className="p-4 md:p-5 flex-1 flex flex-col space-y-3 md:space-y-4">
              <h3 className="text-xs md:text-sm leading-tight text-slate-800 font-bold group-hover:text-emerald-600 transition-colors h-8 md:h-10 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex flex-col mt-auto pt-3 md:pt-4 border-t border-slate-50">
                <div className="flex justify-between items-baseline">
                  <span className="text-slate-800 text-lg md:text-xl font-black tracking-tighter">₫{product.price.toLocaleString()}</span>
                  <div className="text-[9px] md:text-[10px] text-slate-400 font-bold">⭐ {product.sellerRating}</div>
                </div>
                
                <div className="mt-2 md:mt-3 flex items-center text-[8px] md:text-[9px] uppercase tracking-widest font-black text-slate-400">
                  <span>Vật liệu: </span>
                  <span className={`ml-2 truncate ${product.isGreen ? 'text-emerald-600' : 'text-slate-600'}`}>
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