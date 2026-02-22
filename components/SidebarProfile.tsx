import React, { useState } from 'react';
import { useAppContext, AVAILABLE_TITLES, AVAILABLE_TAGS } from '../AppContext';
import { BADGES } from '../constants';

const SidebarProfile: React.FC = () => {
  const { greenScore, userEmail, setCurrentStep, userProfile, setUserProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(userProfile);

  const currentTitle = AVAILABLE_TITLES.find(t => t.id === userProfile.titleId);
  const displayName = userProfile.nickname || userEmail || 'Người tham gia';

  const handleOpenEdit = () => { setDraft(userProfile); setIsEditing(true); };
  const handleSave = () => { setUserProfile(draft); setIsEditing(false); };
  const toggleTag = (tag: string) => {
    setDraft(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : prev.tags.length < 3 ? [...prev.tags, tag] : prev.tags,
    }));
  };

  return (
    <div className="w-full md:w-[280px] flex-shrink-0 space-y-4 relative">

      {/* ── MODAL CHỈNH SỬA — chỉ thêm, không ảnh hưởng layout ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-emerald-600 px-6 py-5 text-white">
              <h2 className="font-black text-base uppercase tracking-widest">✏️ Tùy chỉnh hồ sơ</h2>
              <p className="text-[11px] opacity-70 mt-1">Thể hiện cá tính xanh của bạn</p>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Nickname */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Biệt danh</label>
                <input
                  type="text" maxLength={20}
                  placeholder={userEmail?.split('@')[0] || 'Nhập biệt danh...'}
                  value={draft.nickname}
                  onChange={e => setDraft(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
              {/* Danh hiệu */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Danh hiệu</label>
                <div className="grid grid-cols-2 gap-2">
                  {AVAILABLE_TITLES.map(t => (
                    <button key={t.id} onClick={() => setDraft(prev => ({ ...prev, titleId: t.id }))}
                      className={`text-left px-3 py-2 rounded-xl text-[11px] font-bold transition-all border-2 ${
                        draft.titleId === t.id ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-slate-100 bg-slate-50 text-slate-600 hover:border-emerald-200'
                      }`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              {/* Nhãn */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Nhãn mô tả <span className="text-slate-300 normal-case font-normal">(tối đa 3)</span>
                </label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {AVAILABLE_TAGS.map(tag => (
                    <button key={tag} onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                        draft.tags.includes(tag) ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-slate-50 text-slate-500 border-slate-200 hover:border-emerald-300'
                      }`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
              {/* Slogan */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Slogan cá nhân</label>
                <textarea maxLength={60} rows={2}
                  placeholder="VD: Mỗi lựa chọn nhỏ tạo nên sự khác biệt lớn..."
                  value={draft.slogan}
                  onChange={e => setDraft(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-400 outline-none transition-all resize-none"
                />
                <p className="text-right text-[9px] text-slate-300 mt-1">{draft.slogan.length}/60</p>
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">
                Hủy
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-700 active:scale-95 transition-all">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROFILE CARD — GIỮ NGUYÊN 100% GIAO DIỆN GỐC, CHỈ THÊM VÀO ── */}
      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-center">

          {/* Nút ✏️ thêm vào — không thay đổi layout gốc */}
          <div className="flex justify-end mb-[-20px]">
            <button onClick={handleOpenEdit}
              className="w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
              title="Tùy chỉnh hồ sơ">
              <span className="text-white text-xs">✏️</span>
            </button>
          </div>

          {/* Avatar — GỐC */}
          <div className="relative inline-block mb-3">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || 'User')}&background=ffffff&color=059669&bold=true`}
              className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg mx-auto"
              alt="Avatar"
            />
          </div>

          {/* Tên — GỐC, chỉ thêm nickname nếu có */}
          <h3 className="font-bold text-white tracking-tight truncate px-2 text-sm">
            {displayName}
          </h3>

          {/* Danh hiệu — THÊM VÀO bên dưới tên, nếu đã set */}
          {currentTitle && (
            <div className="mt-1 inline-block bg-white/20 text-white/90 text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-wider">
              {currentTitle.label}
            </div>
          )}

          {/* Nhãn tags — THÊM VÀO */}
          {userProfile.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-1.5">
              {userProfile.tags.map(tag => (
                <span key={tag} className="bg-white/10 text-white/70 text-[8px] font-bold px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Slogan — THÊM VÀO */}
          {userProfile.slogan && (
            <p className="mt-1.5 text-white/60 text-[9px] italic leading-tight px-2">
              "{userProfile.slogan}"
            </p>
          )}

          {/* Điểm xanh — GỐC */}
          <div className="mt-3 text-center">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Điểm Xanh Hiện Có</p>
            <h1 className="text-5xl font-black text-white tracking-tighter">{greenScore} 💧</h1>
          </div>
        </div>

        {/* Lộ trình thăng cấp — GỐC NGUYÊN VẸN */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="mb-5 px-1">
            <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center">
              <span className="mr-2">🏆</span> Lộ trình thăng cấp
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tight">Tích lũy điểm để đạt danh hiệu mới</p>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {BADGES.map((badge, index) => {
              const isEarned = greenScore >= badge.requirement;
              const isCurrent = isEarned && (index === BADGES.length - 1 || greenScore < BADGES[index + 1].requirement);
              return (
                <div
                  key={badge.id}
                  className={`flex flex-col items-center justify-center rounded-2xl p-2 transition-all border ${
                    isCurrent
                      ? 'bg-white border-emerald-500 text-emerald-600 shadow-md scale-110 z-10'
                      : isEarned
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                        : 'bg-slate-100 border-transparent opacity-30 grayscale'
                  }`}
                  title={badge.description}
                >
                  <span className="text-[8px] font-black mb-1 opacity-60 uppercase">LV.{index + 1}</span>
                  <span className="text-xl md:text-2xl mb-1">{badge.icon}</span>
                  <span className="text-[7px] font-black text-center leading-tight">{badge.label}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-6 px-1">
            <div className="flex justify-between text-[9px] font-black uppercase text-slate-400 mb-1.5">
               <span>Tiến độ thăng hạng</span>
               <span className="text-emerald-600">{greenScore} 💧</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">
               <div
                 className="h-full bg-emerald-500 transition-all duration-1000"
                 style={{ width: `${Math.min((greenScore / 200) * 100, 100)}%` }}
               ></div>
            </div>
          </div>
        </div>

        {/* Đổi quà — GỐC NGUYÊN VẸN */}
        <div className="p-4 bg-white">
          <button
            onClick={() => setCurrentStep('redeem')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
          >
            <span>🎁</span>
            <span>Đổi quà & Quyên góp</span>
          </button>
        </div>
      </div>

      {/* Bảng xếp hạng tuần — GỐC NGUYÊN VẸN */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 px-1">Bảng xếp hạng tuần</h4>
        <div className="space-y-4">
          {[
            { name: 'Minh Tuấn', score: 450 },
            { name: 'Thanh Hà', score: 320 },
            { name: userEmail || 'Bạn', score: greenScore, isMe: true }
          ].sort((a,b) => b.score - a.score).map((user, idx) => (
            <div key={user.name} className={`flex justify-between items-center text-[10px] ${user.isMe ? 'bg-emerald-50 -mx-4 px-4 py-2 rounded-xl text-emerald-700 font-bold' : 'text-slate-600'}`}>
              <div className="flex items-center space-x-3">
                <span className={`w-4 font-black text-[10px] ${idx === 0 ? 'text-emerald-600' : 'text-slate-300'}`}>0{idx + 1}</span>
                <span className="max-w-[100px] truncate">{user.name}</span>
              </div>
              <span className="font-black tracking-tighter">{user.score} 💧</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarProfile;
