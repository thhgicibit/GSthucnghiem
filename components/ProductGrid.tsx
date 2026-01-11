
import React from 'react';
import { useAppContext } from '../AppContext';
import { PRODUCTS } from '../constants';

const ProductGrid: React.FC = () => {
  const { setActiveProduct } = useAppContext();

  // Group products by category to show pairs
  const categories = Array.from(new Set(PRODUCTS.map(p => p.category)));

  return (
    <div className="flex-1 space-y-12">
      {categories.map(category => (
        <section key={category} className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="h-px flex-1 bg-slate-100"></div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 px-4 whitespace-nowrap">Danh mục: {category}</h2>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-10 max-w-4xl mx-auto">
            {PRODUCTS.filter(p => p.category === category).map(product => (
              <div 
                key={product.id}
                onClick={() => setActiveProduct(product)}
                className={`bg-white border-2 rounded-3xl hover:shadow-2xl transition-all cursor-pointer flex flex-col group h-full overflow-hidden relative ${product.isGreen ? 'border-emerald-100 hover:border-emerald-500' : 'border-slate-50 hover:border-slate-300'}`}
              >
                <div className="relative aspect-square bg-slate-50 overflow-hidden">
                  <img src={product.image} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                  
                  {/* Badge Phân Biệt - Bỏ nhấp nháy, thêm icon recycle */}
                  {product.isGreen ? (
                    <div className="absolute top-4 right-4 bg-emerald-600 text-white text-[10px] px-3 py-1.5 font-black rounded-full shadow-lg z-10 flex items-center space-x-1">
                       <span>♻️ ECO CHOICE</span>
                       <span>+{product.greenPoints} 💧</span>
                    </div>
                  ) : (
                    <div className="absolute top-4 right-4 bg-slate-800 text-white text-[10px] px-3 py-1.5 font-black rounded-full shadow-lg z-10">
                       SẢN PHẨM THƯỜNG
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <h3 className="text-sm md:text-base leading-tight text-slate-800 font-bold group-hover:text-emerald-600 transition-colors h-10 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <div className="flex flex-col mt-auto pt-4 border-t border-slate-50">
                    <div className="flex justify-between items-baseline">
                      <span className="text-slate-800 text-xl font-black tracking-tighter">₫{product.price.toLocaleString()}</span>
                      <div className="text-[10px] text-slate-400 font-bold">⭐ {product.sellerRating}</div>
                    </div>
                    
                    <div className="mt-3 flex items-center text-[9px] uppercase tracking-widest font-black text-slate-400">
                      <span>Phân loại: </span>
                      <span className={`ml-2 truncate ${product.isGreen ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {product.material}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default ProductGrid;
