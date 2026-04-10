import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const DONATION_PROJECTS = [
  {
    id: 'donation_tre',
    name: 'Dự án Tre Chống Lũ (TreeBank)',
    points: 1, 
    icon: '🎋',
    participants: '1.240',
    progress: 0,
    description: 'Trồng tre bảo vệ các dải đất ven sông, giúp ngăn chặn sạt lở và lũ quét tại miền Trung.'
  },
  {
    id: 'donation_panasonic',
    name: 'Sống khỏe - Góp xanh (Panasonic)',
    points: 1,
    icon: '🍃',
    participants: '850',
    progress: 0,
    description: 'Chương trình trồng cây gây rừng tại các khu bảo tồn thiên nhiên quốc gia cùng Panasonic.'
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
    setSuccessMsg(`Cảm ơn bạn! Đã đóng góp thành công ${pts} điểm.`);
    setShowDonateModal(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-12 animate-slideUp pb-24">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">TRUNG TÂM ĐỔI ĐIỂM</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Sử dụng giọt nước 💧 của bạn để tạo ra giá trị</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentStep('shop')} className="text-emerald-600 font-black text-xs uppercase underline tracking-widest">Quay lại</button>
          <button onClick={() => setCurrentStep('post_survey')} className="bg-emerald-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md">Khảo sát & Hoàn tất</button>
        </div>
      </div>
      {successMsg && (
        <div className="bg-emerald-600 text-white p-5 rounded-3xl shadow-xl animate-bounce flex items-center space-x-3">
          <span className="text-2xl">✨</span>
          <p className="font-black text-sm">{successMsg}</p>
        </div>
      )}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🌍</div>
          <h2 className="text-base font-black text-emerald-900 uppercase tracking-widest underline">Chương trình đóng góp</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DONATION_PROJECTS.map(proj => (
            <div key={proj.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="flex justify-between mb-4">
                <div className="text-4xl bg-emerald-50 w-16 h-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">{proj.icon}</div>
                <div className="text-right">
                  <span className="text-emerald-600 font-black text-xs uppercase">1 💧 = 5.000đ</span>
                </div>
              </div>
              <h3 className="font-black text-slate-800 text-base mb-2 uppercase">{proj.name}</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed flex-1">{proj.description}</p>
              <button 
                onClick={() => handleRedeem(proj, 'donation')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
              >
                Đóng góp ngay
              </button>
            </div>
          ))}
        </div>
      </div>
      {showDonateModal && selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-8 text-center text-white relative">
              <button onClick={() => setShowDonateModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">✕</button>
              <div className="text-5xl mb-4">{selectedProject.icon}</div>
              <h3 className="text-lg font-black uppercase">{selectedProject.name}</h3>
            </div>
            <div className="p-8 space-y-6 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Góp bao nhiêu điểm?</p>
              <input 
                type="number"
                value={donateAmount}
                onChange={(e) => setDonateAmount(e.target.value)}
                className="w-24 text-center text-3xl font-black text-emerald-600 bg-slate-50 border-2 border-emerald-100 rounded-2xl py-3 outline-none"
                min="1"
                max={greenScore}
              />
              <button 
                onClick={confirmDonation}
                className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-emerald-700 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemStore;
