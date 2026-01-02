
import React from 'react';
import { useAppContext } from '../AppContext';

const Leaderboard: React.FC = () => {
  const { leaderboard, userEmail } = useAppContext();
  
  const maskName = (name: string) => {
    if (!name) return "...";
    
    // Giữ nguyên 3 tên bot hệ thống
    const systemBots = ['Minh Tuấn', 'Thanh Hà', 'Quốc Bảo'];
    if (systemBots.includes(name)) return name;
    
    // Nếu là chính mình
    if (name === userEmail || name === 'Bạn') return "Bạn";
    
    // Đối với người khác (ẩn danh email), chỉ hiện 7 ký tự đầu
    return name.length > 7 ? name.substring(0, 7) + "..." : name;
  };
  
  return (
    <section className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm uppercase tracking-tight">XẾP HẠNG CỘNG ĐỒNG</h3>
      </div>
      
      <div className="bg-white rounded-sm shadow-sm overflow-hidden border border-slate-100">
        {leaderboard.map((user, index) => (
          <div 
            key={user.id} 
            className={`flex items-center justify-between p-4 border-b border-slate-50 last:border-0 ${user.name === userEmail ? 'bg-emerald-50/50' : ''}`}
          >
            <div className="flex items-center space-x-3">
              <span className={`w-5 text-center font-bold text-sm ${index === 0 ? 'text-yellow-500' : index === 1 ? 'text-slate-400' : index === 2 ? 'text-orange-400' : 'text-slate-300'}`}>
                {index + 1}
              </span>
              <div className="relative">
                <img src={user.avatar} className="w-9 h-9 rounded-full border border-slate-100 object-cover" />
                {index === 0 && <span className="absolute -top-2 -right-1 text-[10px]">👑</span>}
              </div>
              <span className={`text-[10px] font-medium truncate max-w-[150px] ${user.name === userEmail ? 'text-emerald-600 font-bold' : 'text-slate-700'}`}>
                {user.name === userEmail ? `${user.name} (Bạn)` : user.name}
              </span>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-800 text-sm">{user.score} 💧</p>
              <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Điểm Xanh</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Leaderboard;
