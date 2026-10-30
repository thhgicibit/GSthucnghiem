import React, { useState } from 'react';
import { useAppContext } from '../AppContext';

const DONATION_PROJECTS = [
  {
    id: 'donation_tre',
    name: 'Flood-Control Bamboo Project (TreeBank)',
    points: 1, 
    icon: '🎋',
    participants: '1,240',
    progress: 0,
    description: 'Planting bamboo to protect riverbanks, helping prevent landslides and flash floods in Central Vietnam.'
  },
  {
    id: 'donation_panasonic',
    name: 'Live Healthy - Go Green (Panasonic)',
    points: 1,
    icon: '🍃',
    participants: '850',
    progress: 0,
    description: 'A reforestation program in national nature reserves together with Panasonic.'
  }
];

const GIFT_ITEMS = [
  {
    id: 'certificate',
    name: 'Green Citizen Certificate',
    points: 150,
    icon: '📜',
    description: 'An electronic certificate honoring you as a Green Citizen — the highest achievement for the most dedicated participants.'
  },
  {
    id: 'voucher_green',
    name: '10% Off Green Products Voucher',
    points: 80,
    icon: '🎟️',
    description: 'A 10% discount code for your next purchase of an environmentally friendly product.'
  },
];

const OTHER_GIFT_ITEMS = [
  { id: 'tote',     name: 'Canvas Tote Bag',          points: 60,  icon: '🛍️', description: 'Durable 100% cotton canvas bag, environmentally friendly.' },
  { id: 'bottle',   name: 'Bagasse Water Bottle',         points: 70,  icon: '🥤', description: 'Bio-based bottle made from agricultural by-products, naturally biodegradable.' },
  { id: 'seed_kit', name: 'Organic Vegetable Seed Kit',   points: 55,  icon: '🌱', description: 'A set of 5 packs of organic leafy-vegetable seeds, suitable for home growing.' },
  { id: 'notebook', name: 'Recycled Paper Notebook',      points: 50,  icon: '📓', description: '120-page recycled paper notebook with a premium plant-based leather cover.' },
];

const RedeemStore: React.FC = () => {
  const { greenScore, subtractPoints, setCurrentStep } = useAppContext();
  const [successMsg, setSuccessMsg] = useState('');
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [donateAmount, setDonateAmount] = useState('10');
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<any>(null);

  const handleRedeem = (item: any, type: 'gift' | 'donation') => {
    if (type === 'donation') {
      setSelectedProject(item);
      setShowDonateModal(true);
      return;
    }
    if (greenScore < item.points) {
      alert('You do not have enough green points to redeem this gift.');
      return;
    }
    setSelectedGift(item);
    setShowRedeemModal(true);
  };

  const confirmRedeem = () => {
    if (!selectedGift) return;
    subtractPoints(selectedGift.points);
    setSuccessMsg(`Congratulations! You have successfully redeemed: ${selectedGift.name}`);
    setShowRedeemModal(false);
    setSelectedGift(null);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const confirmDonation = () => {
    const pts = parseInt(donateAmount);
    if (isNaN(pts) || pts <= 0 || pts > greenScore) {
      alert('Invalid number of points or insufficient balance.');
      return;
    }
    subtractPoints(pts);
    setSuccessMsg(`Thank you! You have successfully donated ${pts} points.`);
    setShowDonateModal(false);
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  return (
    <div className="space-y-12 animate-slideUp pb-24">
      <div className="flex justify-between items-center border-b border-slate-100 pb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">REWARDS CENTER</h1>
          <p className="text-xs text-slate-400 font-bold uppercase mt-1">Use your water drops 💧 to create value</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={() => setCurrentStep('shop')} className="text-emerald-600 font-black text-xs uppercase underline tracking-widest">Back</button>
          <button onClick={() => setCurrentStep('post_survey')} className="bg-emerald-600 text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md">Survey & Finish</button>
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
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🎁</div>
          <h2 className="text-base font-black text-amber-900 uppercase tracking-widest underline">Redeem green incentive gifts</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cards 1 & 2: Certificate + Voucher */}
          {GIFT_ITEMS.map(gift => {
            const canRedeem = greenScore >= gift.points;
            return (
              <div key={gift.id} className={`bg-white p-6 rounded-[2.5rem] border shadow-sm transition-all group flex flex-col ${canRedeem ? 'border-amber-100 hover:shadow-md' : 'border-slate-100 opacity-60'}`}>
                <div className="flex justify-between mb-4">
                  <div className="text-4xl bg-amber-50 w-14 h-14 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">{gift.icon}</div>
                  <span className={`font-black text-sm self-start mt-1 ${canRedeem ? 'text-amber-600' : 'text-slate-400'}`}>{gift.points} 💧</span>
                </div>
                <h3 className="font-black text-slate-800 text-xs mb-1 uppercase leading-snug">{gift.name}</h3>
                <p className="text-[10px] text-slate-500 mb-5 leading-relaxed flex-1">{gift.description}</p>
                <button
                  onClick={() => handleRedeem(gift, 'gift')}
                  disabled={!canRedeem}
                  className={`w-full py-3 rounded-2xl font-black uppercase text-[9px] tracking-widest transition-all active:scale-95 ${canRedeem ? 'bg-amber-500 hover:bg-amber-600 text-white' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  {canRedeem ? 'Redeem now' : `${gift.points - greenScore} more 💧 needed`}
                </button>
              </div>
            );
          })}
          {/* Card 3: Other gifts — selectable list */}
          <div className="bg-white p-6 rounded-[2.5rem] border border-amber-100 shadow-sm flex flex-col">
            <div className="flex justify-between mb-4">
              <div className="text-4xl bg-amber-50 w-14 h-14 rounded-3xl flex items-center justify-center">🎀</div>
              <span className="text-[10px] font-black text-amber-600 self-start mt-1 uppercase tracking-widest">Gifts</span>
            </div>
            <h3 className="font-black text-slate-800 text-xs mb-3 uppercase">Incentive gifts</h3>
            <div className="flex-1 space-y-2 mb-4">
              {OTHER_GIFT_ITEMS.map(item => {
                const canRedeem = greenScore >= item.points;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleRedeem(item, 'gift')}
                    disabled={!canRedeem}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all border ${canRedeem ? 'border-amber-100 hover:bg-amber-50 hover:border-amber-300' : 'border-slate-100 opacity-50 cursor-not-allowed'}`}
                  >
                    <span className="flex items-center space-x-2">
                      <span className="text-base">{item.icon}</span>
                      <span className="text-[10px] font-bold text-slate-700 leading-tight">{item.name}</span>
                    </span>
                    <span className={`text-[10px] font-black shrink-0 ml-2 ${canRedeem ? 'text-amber-500' : 'text-slate-300'}`}>{item.points} 💧</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-xl shadow-sm">🌍</div>
          <h2 className="text-base font-black text-emerald-900 uppercase tracking-widest underline">Donation programs</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DONATION_PROJECTS.map(proj => (
            <div key={proj.id} className="bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
              <div className="flex justify-between mb-4">
                <div className="text-4xl bg-emerald-50 w-16 h-16 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform">{proj.icon}</div>
                <div className="text-right">
                  <span className="text-emerald-600 font-black text-xs uppercase">1 💧 = ₫5,000</span>
                </div>
              </div>
              <h3 className="font-black text-slate-800 text-base mb-2 uppercase">{proj.name}</h3>
              <p className="text-[11px] text-slate-500 mb-6 leading-relaxed flex-1">{proj.description}</p>
              <button 
                onClick={() => handleRedeem(proj, 'donation')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95"
              >
                Donate now
              </button>
            </div>
          ))}
        </div>
      </div>
      {showRedeemModal && selectedGift && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-amber-500 p-8 text-center text-white relative">
              <button onClick={() => setShowRedeemModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">✕</button>
              <div className="text-5xl mb-4">{selectedGift.icon}</div>
              <h3 className="text-lg font-black uppercase">{selectedGift.name}</h3>
            </div>
            <div className="p-8 space-y-4 text-center">
              <p className="text-sm text-slate-600 leading-relaxed">{selectedGift.description}</p>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl py-3 px-4">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Redemption cost</p>
                <p className="text-3xl font-black text-amber-600">{selectedGift.points} 💧</p>
                <p className="text-[10px] text-slate-400 mt-1">Balance after redemption: {greenScore - selectedGift.points} 💧</p>
              </div>
              <button
                onClick={confirmRedeem}
                className="w-full bg-amber-500 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-amber-600 active:scale-95 transition-all uppercase tracking-widest text-xs"
              >
                Confirm redemption
              </button>
            </div>
          </div>
        </div>
      )}
      {showDonateModal && selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="bg-emerald-600 p-8 text-center text-white relative">
              <button onClick={() => setShowDonateModal(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">✕</button>
              <div className="text-5xl mb-4">{selectedProject.icon}</div>
              <h3 className="text-lg font-black uppercase">{selectedProject.name}</h3>
            </div>
            <div className="p-8 space-y-6 text-center">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">How many points to donate?</p>
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
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RedeemStore;
