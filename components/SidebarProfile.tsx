import React, { useState } from 'react';
import { useAppContext, AVAILABLE_TITLES, AVAILABLE_TAGS } from '../AppContext';
import { BADGES } from '../constants';

// Preset avatars for quick selection
const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco1&backgroundColor=b6e3f4',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco2&backgroundColor=c0aede',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco3&backgroundColor=d1d4f9',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco4&backgroundColor=ffd5dc',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco5&backgroundColor=ffdfbf',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco6&backgroundColor=c0e8c0',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco7&backgroundColor=ffe4b5',
  'https://api.dicebear.com/7.x/bottts/svg?seed=eco8&backgroundColor=b0d4f1',
];

const SidebarProfile: React.FC = () => {
  const { greenScore, userEmail, setCurrentStep, userProfile, setUserProfile } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(userProfile);
  const [avatarInputMode, setAvatarInputMode] = useState<'preset' | 'url'>('preset');

  const currentTitle = AVAILABLE_TITLES.find(t => t.id === userProfile.titleId);
  const avatarSrc = userProfile.avatarUrl ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || 'User')}&background=ffffff&color=059669&bold=true`;
  const displayName = userProfile.nickname || userEmail || 'Participant';

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

      {/* ── EDIT MODAL — additive only, does not affect layout ── */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="bg-emerald-600 px-6 py-5 text-white">
              <h2 className="font-black text-base uppercase tracking-widest">✏️ Customize Profile</h2>
              <p className="text-[11px] opacity-70 mt-1">Express your green personality</p>
            </div>
            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              {/* Nickname */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nickname</label>
                <input
                  type="text" maxLength={20}
                  placeholder={userEmail?.split('@')[0] || 'Enter a nickname...'}
                  value={draft.nickname}
                  onChange={e => setDraft(prev => ({ ...prev, nickname: e.target.value }))}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:border-emerald-400 outline-none transition-all"
                />
              </div>
              {/* Title */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Title</label>
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
              {/* Tags */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Description tags <span className="text-slate-300 normal-case font-normal">(max 3)</span>
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
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Personal slogan</label>
                <textarea maxLength={60} rows={2}
                  placeholder="E.g., Every small choice makes a big difference..."
                  value={draft.slogan}
                  onChange={e => setDraft(prev => ({ ...prev, slogan: e.target.value }))}
                  className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm text-slate-700 focus:border-emerald-400 outline-none transition-all resize-none"
                />
                <p className="text-right text-[9px] text-slate-300 mt-1">{draft.slogan.length}/60</p>
              </div>

              {/* Avatar */}
              <div>
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Profile picture</label>
                {/* Preview */}
                <div className="flex justify-center mb-3">
                  <img
                    src={draft.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(draft.nickname || userEmail || 'User')}&background=ffffff&color=059669&bold=true`}
                    className="w-16 h-16 rounded-2xl border-2 border-emerald-200 shadow object-cover bg-emerald-50"
                    alt="Preview"
                    onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=User&background=ffffff&color=059669&bold=true`; }}
                  />
                </div>
                {/* Toggle preset / url */}
                <div className="flex rounded-xl overflow-hidden border border-slate-100 mb-3">
                  <button
                    onClick={() => setAvatarInputMode('preset')}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${avatarInputMode === 'preset' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Presets
                  </button>
                  <button
                    onClick={() => setAvatarInputMode('url')}
                    className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all ${avatarInputMode === 'url' ? 'bg-emerald-600 text-white' : 'bg-slate-50 text-slate-400'}`}
                  >
                    Enter URL
                  </button>
                </div>
                {/* Preset grid */}
                {avatarInputMode === 'preset' && (
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_AVATARS.map((url, i) => (
                      <button
                        key={i}
                        onClick={() => setDraft(prev => ({ ...prev, avatarUrl: url }))}
                        className={`rounded-xl overflow-hidden border-2 transition-all ${draft.avatarUrl === url ? 'border-emerald-500 scale-105' : 'border-slate-100 hover:border-emerald-200'}`}
                      >
                        <img src={url} alt={`avatar ${i+1}`} className="w-full h-full object-cover aspect-square bg-slate-50" />
                      </button>
                    ))}
                    {/* Remove custom avatar, revert to default */}
                    <button
                      onClick={() => setDraft(prev => ({ ...prev, avatarUrl: '' }))}
                      className={`rounded-xl border-2 flex items-center justify-center aspect-square transition-all ${draft.avatarUrl === '' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                      title="Use default avatar"
                    >
                      <span className="text-lg">👤</span>
                    </button>
                  </div>
                )}
                {/* URL input */}
                {avatarInputMode === 'url' && (
                  <div>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={draft.avatarUrl}
                      onChange={e => setDraft(prev => ({ ...prev, avatarUrl: e.target.value }))}
                      className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-xs text-slate-700 focus:border-emerald-400 outline-none transition-all"
                    />
                    <p className="text-[9px] text-slate-300 mt-1">Paste a direct image link (jpg, png, svg...)</p>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 pb-6 flex gap-3">
              <button onClick={() => setIsEditing(false)}
                className="flex-1 py-3 rounded-xl border-2 border-slate-100 text-slate-500 font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all">
                Cancel
              </button>
              <button onClick={handleSave}
                className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-black text-xs uppercase tracking-wider hover:bg-emerald-700 active:scale-95 transition-all">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PROFILE CARD — ORIGINAL UI PRESERVED 100%, ADDITIONS ONLY ── */}
      <div className="bg-white rounded-[2.5rem] shadow-sm overflow-hidden border border-slate-100">
        <div className="bg-emerald-600 p-8 text-center relative">

          {/* ✏️ button — absolute, takes no space, does not shift the original layout */}
          <button onClick={handleOpenEdit}
            className="absolute top-3 right-3 w-7 h-7 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all"
            title="Customize profile">
            <span className="text-white text-xs">✏️</span>
          </button>

          {/* Avatar — ORIGINAL */}
          <div className="relative inline-block mb-3">
            <img
              src={avatarSrc}
              className="w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg mx-auto object-cover bg-white"
              alt="Avatar"
              onError={e => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userEmail || 'User')}&background=ffffff&color=059669&bold=true`; }}
            />
          </div>

          {/* Name — ORIGINAL, nickname added only if set */}
          <h3 className="font-bold text-white tracking-tight truncate px-2 text-sm">
            {displayName}
          </h3>

          {/* Title — ADDED below the name, if set */}
          {currentTitle && (
            <div className="mt-1 inline-block bg-white/20 text-white/90 text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-wider">
              {currentTitle.label}
            </div>
          )}

          {/* Tags — ADDED */}
          {userProfile.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mt-1.5">
              {userProfile.tags.map(tag => (
                <span key={tag} className="bg-white/10 text-white/70 text-[8px] font-bold px-2 py-0.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Slogan — ADDED */}
          {userProfile.slogan && (
            <p className="mt-1.5 text-white/60 text-[9px] italic leading-tight px-2">
              "{userProfile.slogan}"
            </p>
          )}

          {/* Green points — ORIGINAL */}
          <div className="mt-3 text-center">
            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1">Current Green Points</p>
            <h1 className="text-5xl font-black text-white tracking-tighter">{greenScore} 💧</h1>
          </div>
        </div>

        {/* Level-up path — ORIGINAL, UNCHANGED */}
        <div className="p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="mb-5 px-1">
            <p className="text-[11px] font-black text-emerald-800 uppercase tracking-widest flex items-center">
              <span className="mr-2">🏆</span> Level-Up Path
            </p>
            <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tight">Accumulate points to earn new badges</p>
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
               <span>Level-up progress</span>
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

        {/* Redeem — ORIGINAL, UNCHANGED */}
        <div className="p-4 bg-white">
          <button
            onClick={() => setCurrentStep('redeem')}
            className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all flex items-center justify-center space-x-2"
          >
            <span>🎁</span>
            <span>Redeem & Donate</span>
          </button>
        </div>
      </div>

      {/* Weekly leaderboard — ORIGINAL, UNCHANGED */}
      <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100">
        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5 px-1">Weekly Leaderboard</h4>
        <div className="space-y-4">
          {[
            { name: 'Minh Tuấn', score: 450 },
            { name: 'Thanh Hà', score: 320 },
            { name: userEmail || 'You', score: greenScore, isMe: true }
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
