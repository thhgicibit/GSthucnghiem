
import React from 'react';

const ThankYou: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f0f4f8] py-12 px-4 flex flex-col items-center font-sans overflow-y-auto">
      <div className="w-full max-w-3xl">
        <div className="h-3 w-full bg-emerald-600 rounded-t-xl"></div>
        <div className="bg-white p-10 rounded-b-xl shadow-sm border-x border-b border-slate-200 animate-slideUp">
          <h1 className="text-2xl font-black text-slate-900 uppercase mb-8 border-b border-slate-100 pb-4">
            LỜI CẢM ƠN
          </h1>
          
          <div className="space-y-8 text-slate-800 text-base md:text-lg leading-relaxed">
            <p className="font-black text-emerald-600 text-xl md:text-2xl mb-6">
              Cảm ơn sự đóng góp của quý Anh/Chị!
            </p>
            
            <p>
              Sự tham gia của Anh/Chị vào khảo sát này là vô cùng quý báu và có ý nghĩa lớn đối với thành công của bài nghiên cứu.
            </p>
            
            <div className="h-px w-full bg-slate-200 my-8"></div>
            
            <p>
              Nhóm xin cam kết các thông tin này sẽ được bảo mật và chỉ phục vụ cho mục đích nghiên cứu. Mọi thắc mắc, đóng góp về bài khảo sát xin vui lòng liên hệ:
            </p>
            
            <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-2">
              <p className="font-bold flex items-center">
                <span className="mr-3">📞</span> SĐT: 0868027268 (Thanh Hằng)
              </p>
              <p className="font-bold flex items-center">
                <span className="mr-3">✉️</span> Email: <a href="mailto:nguyenvuthanhhang.2204@gmail.com" className="text-emerald-600 hover:underline">nguyenvuthanhhang.2204@gmail.com</a>
              </p>
            </div>
            
            <p className="pt-8 font-medium">
              Trân trọng.
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-8 text-slate-400 text-xs font-bold uppercase tracking-widest text-center">
        Đại học Tôn Đức Thắng (TDTU) - Nhóm Nghiên cứu
      </div>
    </div>
  );
};

export default ThankYou;
