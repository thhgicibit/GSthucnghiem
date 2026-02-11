import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const DONATION_PROJECTS = [
  {
    id: 'donation_tre',
    name: 'Dự án Tre Chống Lũ (reeBank)',
    points: 1, 
    icon: '🎋',
    participants: '1.240',
    progress: 0, // Khởi tạo bằng 0 theo yêu cầu
    description: 'Trồng tre bảo vệ các dải đất ven sông, giúp ngăn chặn sạt lở và lũ quét tại miền Trung. 1 điểm = 5.000đ đóng góp.'
  },
  {
    id: 'donation_panasonic',
    name: 'Sống khỏe - Góp xanh (Panasonic)',
    points: 1,
    icon: '🍃',
    participants: '850',
    progress: 0, // Khởi tạo bằng 0 theo yêu cầu
    description: 'Chương trình trồng cây gây rừng tại các khu bảo tồn thiên nhiên quốc gia cùng Panasonic. 1 điểm = 5.000đ đóng góp.'
  }
];

const GIFT_ITEMS = [
  {
    id: 'tote',
    name: 'Túi vải Canvas Quà Tặng Xanh',
    points: 100,
    icon: '🛍️',
    description: 'Túi vải canvas 100% cotton, bền chắc, thân thiện môi trường.'
  },
  {
    id: 'bottle',
    name: 'Bình nước bã mía tái chế',
    points: 150,
    icon: '🥤',
    description: 'Bình nước sinh học làm từ phụ phẩm nông nghiệp, phân hủy tự nhiên.'
  },
  {
    id: 'cert',
    name: 'Chứng nhận "Công dân Xanh"',
    points: 50,
    icon: '📜',
    description: 'Giấy chứng nhận điện tử vinh danh những đóng góp bền bỉ của bạn cho Trái Đất.'
  }
];

const RedeemStore: React.FC = () => {
  const { greenScore, subtractPoints, setCurrentStep } = useAppContext();
  const [successMsg, setSuccessMsg] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [donateAmount, setDonateAmount] = useState('10');

  const handleRedeem = (item: any, type: 'gift' | 'donation') => {
    if (type === 'donation') {
      setSelectedProject(item);
      setShowDonateModal(true);
      return;
    }
    
    if (greenScore < item.points) {
      alert('Bạn không đủ Điểm Xanh để đổi quà này.');
      return;
    }
    subtractPoints(item.points);
    setSuccessMsg(`Chúc mừng! Bạn đã đổi thành công: ${item.name}`);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const confirmDonation = () => {
    const pts = parseInt(donateAmount);
    if (isNaN(pts) || pts <= 0 || pts > greenScore) {
      alert('Số điểm không hợp lệ hoặc không đủ số dư.');
      return;
    }
    subtractPoints(pts);
    setSuccessMsg(`Cảm ơn bạn! Đã đóng góp thành công ${pts} điểm vào ${selectedProject.name}.`);
    setShowDonateModal(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-12 animate-slideUp pb-24">
      {/* HEADER TRANG */}
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">TRUNG TÂM ĐỔI ĐIỂM</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Sử dụng giọt nước 💧 của bạn để tạo ra giá trị</p>
        </div>
        <button onClick={() => setCurrentStep('shop')} className="text-emerald-600 font-black text-xs uppercase underline tracking-widest">Quay lại</button>
      </div>

      {successMsg && (
        <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-xl animate-bounce flex items-center space-x-3">
          <span className="text-2xl">✨</span>
          <p className="font-black text-sm">{successMsg}</p>
        </div>
      )}

      {/* SECTION 1: CHƯƠNG TRÌNH ĐÓNG GÓP MÔI TRƯỜNG */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🌍</div>
          <h2 className="text-base font-black text-emerald-900 uppercase tracking-widest underline decoration-emerald-200 decoration-4 underline-offset-4">Chương trình đóng góp môi trường</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DONATION_PROJECTS.map(proj => (
            <div key={proj.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="flex justify-between mb-4">
                <div className="text-4xl bg-emerald-50 w-16 h-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">{proj.icon}</div>
                <div className="text-right">
                  <span className="text-emerald-600 font-black text-xs uppercase">1 💧 = 5.000đ</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase italic">{proj.participants} người đang tham gia</p>
                </div>
              </div>
              <h3 className="font-black text-slate-800 text-base mb-2 uppercase leading-tight">{proj.name}</h3>
              {/* Sửa lỗi text bị che bằng cách bỏ fixed height và clamping quá chặt */}
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed flex-1 min-h-[40px]">{proj.description}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[9px] font-black uppercase text-slate-400">
                  <span>Tiến độ dự án</span>
                  <span>{proj.progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${proj.progress}%` }}></div>
                </div>
              </div>

              <button 
                onClick={() => handleRedeem(proj, 'donation')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-100 transition-all active:scale-95"
              >
                Đóng góp ngay
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 2: ĐỔI ĐIỂM NHẬN QUÀ */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🎁</div>
          <h2 className="text-base font-black text-emerald-900 uppercase tracking-widest underline decoration-emerald-200 decoration-4 underline-offset-4">Đổi điểm nhận quà</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {GIFT_ITEMS.map(item => (
            <div key={item.id} className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col text-center hover:border-emerald-200 transition-all">
              <div className="text-3xl mb-3">{item.icon}</div>
              <h4 className="font-bold text-slate-800 text-[11px] uppercase mb-1">{item.name}</h4>
              <p className="text-emerald-600 font-black text-sm mb-3">{item.points} 💧</p>
              <p className="text-[9px] text-slate-400 leading-tight mb-5 h-10 line-clamp-3">{item.description}</p>
              <button 
                onClick={() => handleRedeem(item, 'gift')}
                disabled={greenScore < item.points}
                className={`w-full py-3 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all ${
                  greenScore >= item.points 
                  ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md active:scale-95' 
                  : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                }`}
              >
                {greenScore >= item.points ? 'Đổi quà ngay' : `Cần thêm ${item.points - greenScore} 💧`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* POPUP DONATE */}
      {showDonateModal && selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden animate-scaleIn">
            <div className="bg-emerald-600 p-8 text-center text-white relative">
              <button onClick={() => setShowDonateModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors">✕</button>
              <div className="text-5xl mb-4">{selectedProject.icon}</div>
              <h3 className="text-lg font-black uppercase">{selectedProject.name}</h3>
            </div>
            <div className="p-8 space-y-6 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Bạn muốn góp bao nhiêu điểm?</p>
              <div className="flex items-center justify-center space-x-3">
                <input 
                  type="number"
                  value={donateAmount}
                  onChange={(e) => setDonateAmount(e.target.value)}
                  className="w-24 text-center text-3xl font-black text-emerald-600 bg-slate-50 border-2 border-emerald-100 rounded-2xl py-3 outline-none"
                  min="1"
                  max={greenScore}
                />
                <span className="text-2xl">💧</span>
              </div>
              <div className="bg-emerald-50 p-4 rounded-3xl border border-emerald-100">
                <p className="text-[10px] text-emerald-700 font-black uppercase tracking-widest mb-1">Giá trị tương ứng</p>
                <p className="text-3xl font-black text-emerald-600 tracking-tighter">₫{(parseInt(donateAmount || '0') * 5000).toLocaleString('vi-VN')}</p>
              </div>
              <button 
                onClick={confirmDonation}
                className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Xác nhận đóng góp
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemStore;