
import React from 'react';
import { useAppContext } from '../AppContext';

const SimulationIntro: React.FC = () => {
  const { setCurrentStep } = useAppContext();

  return (
    <div className="min-h-screen bg-[#F0F4F8] py-12 px-4 flex flex-col items-center font-sans overflow-y-auto">
      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col animate-slideUp">
        {/* Header Section */}
        <div className="bg-emerald-600 p-8 md:p-12 text-center text-white relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-white/20"></div>
          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight mb-4">Giới thiệu</h1>
          <p className="text-lg md:text-xl font-medium opacity-90 max-w-2xl mx-auto italic">Hệ thống Trò chơi hóa mô phỏng ĐIỂM XANH</p>
        </div>

        {/* Content Section */}
        <div className="p-8 md:p-12 space-y-10">
          {/* Text Description */}
          <div className="space-y-6 text-base md:text-lg text-slate-700 leading-relaxed text-justify">
            <p>
              <strong>Điểm xanh</strong> là hệ thống trò chơi hóa mô phỏng do nhóm nghiên cứu thực hiện, khi khách hàng mua sắm sản phẩm thân thiện với môi trường, đóng gói bằng bao bì thân thiện với môi trường, giao hàng bằng xe điện,... Khách hàng sẽ nhận được điểm xanh tương ứng với mức độ đóng góp vào việc cải thiện môi trường.
            </p>
            <p>
              Điểm xanh này được tính toán dựa trên lượng giảm rác thải của sản phẩm và dấu chân carbon đều được sàn thương mại điện tử kiểm định. Ứng với mỗi số điểm xanh nhận được, quý khách hàng có thể sử dụng để đổi sản phẩm, dịch vụ miễn phí. Ngoài ra điểm xanh còn thể hiện sự tham gia về đóng góp môi trường của khách hàng.
            </p>
            <div className="bg-emerald-50 border-l-8 border-emerald-500 p-6 italic rounded-r-2xl shadow-inner text-emerald-900 font-medium">
              "Mọi thông tin cung cấp sẽ được bảo mật tuyệt đối, chỉ sử dụng cho mục đích nghiên cứu học thuật và không tiết lộ cho bất kỳ bên thứ ba nào."
            </div>
          </div>

          {/* Video Instructions Section */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3 border-b-2 border-slate-100 pb-3">
              <span className="text-3xl">🎥</span>
              <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-wider">Video hướng dẫn thao tác</h2>
            </div>
            
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl border-4 border-slate-100 relative group">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=0&rel=0" 
                title="Hướng dẫn trải nghiệm mô phỏng"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <p className="text-sm text-slate-500 text-center italic font-medium px-4">
              Lưu ý: Video minh họa các tính năng kỹ thuật của hệ thống, không mang tính định hướng sự lựa chọn của quý khách.
            </p>
          </div>

          {/* Action Button */}
          <div className="pt-8 flex justify-center">
            <button 
              onClick={() => setCurrentStep('shop')}
              className="group relative px-16 py-6 bg-emerald-600 text-white rounded-[2rem] font-black uppercase text-lg tracking-[0.2em] shadow-2xl hover:bg-emerald-700 active:scale-95 transition-all"
            >
              <span className="relative z-10 flex items-center">
                Bắt đầu trải nghiệm
                <span className="ml-3 group-hover:translate-x-2 transition-transform">→</span>
              </span>
              <div className="absolute inset-0 rounded-[2rem] bg-white opacity-0 group-hover:opacity-10 transition-opacity"></div>
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Đại học Tôn Đức Thắng (TDTU) - Nhóm Nghiên cứu</p>
        </div>
      </div>
    </div>
  );
};

export default SimulationIntro;
