import React, { useEffect, useState } from 'react';

const ThankYou: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Hiệu ứng xuất hiện
    const t = setTimeout(() => setShow(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-emerald-600 flex flex-col items-center justify-center py-12 px-4 font-sans">

      {/* Checkmark animation */}
      <div className={`transition-all duration-700 ${show ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}>
        <div className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8 mx-auto">
          <svg className="w-16 h-16 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
      </div>

      {/* Card */}
      <div className={`w-full max-w-2xl transition-all duration-700 delay-200 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

        {/* Tiêu đề hoàn thành — rõ ràng, không thể nhầm */}
        <div className="text-center mb-8">
          <p className="text-white/70 text-sm font-black uppercase tracking-[0.3em] mb-2">Đã hoàn thành</p>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Cảm ơn Anh/Chị<br />đã tham gia khảo sát! 🎉
          </h1>
        </div>

        {/* Badge xác nhận */}
        <div className="bg-white/20 backdrop-blur rounded-2xl px-6 py-4 flex items-center gap-4 mb-6 border border-white/30">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shrink-0">
            <span className="text-emerald-600 text-lg">✅</span>
          </div>
          <div>
            <p className="text-white font-black text-sm">Phản hồi của bạn đã được ghi nhận</p>
            <p className="text-white/60 text-[11px] font-medium mt-0.5">Dữ liệu đã được lưu thành công vào hệ thống nghiên cứu</p>
          </div>
        </div>

        {/* Nội dung cảm ơn */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="p-8 space-y-5 text-slate-700 text-base leading-relaxed">

            <p className="text-slate-800 leading-relaxed">
              Sự tham gia của Anh/Chị vào khảo sát này là vô cùng quý báu và có ý nghĩa lớn đối với thành công của bài nghiên cứu.
            </p>

            <p className="text-slate-600 text-sm leading-relaxed">
              Nhóm xin cam kết các thông tin này sẽ được bảo mật và chỉ phục vụ cho mục đích nghiên cứu. Mọi thắc mắc, đóng góp về bài khảo sát xin vui lòng liên hệ:
            </p>

            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100 space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-3 text-sm">
                <span>📞</span> SĐT: 0868027268 (Thanh Hằng)
              </p>
              <p className="font-bold text-slate-800 flex items-center gap-3 text-sm">
                <span>✉️</span>
                <a href="mailto:nguyenvuthanhhang.2204@gmail.com" className="text-emerald-600 hover:underline">
                  nguyenvuthanhhang.2204@gmail.com
                </a>
              </p>
            </div>

            <p className="text-slate-500 text-sm pt-2">Trân trọng.</p>
          </div>

          <div className="bg-slate-50 px-8 py-4 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest text-center">
              Đại học Tôn Đức Thắng (TDTU) · Nhóm Nghiên cứu
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ThankYou;
