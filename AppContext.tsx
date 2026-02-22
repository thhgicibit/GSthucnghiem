import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { dataService } from './dataService';
import { UserDemographics } from './types';

// Danh hiệu có thể chọn
export const AVAILABLE_TITLES = [
  { id: 'eco_warrior',   label: '🌿 Chiến binh xanh' },
  { id: 'earth_lover',   label: '🌍 Người yêu trái đất' },
  { id: 'green_buyer',   label: '🛒 Người mua sắm xanh' },
  { id: 'eco_pioneer',   label: '🚀 Tiên phong xanh' },
  { id: 'nature_guard',  label: '🦋 Người bảo vệ thiên nhiên' },
  { id: 'zero_waste',    label: '♻️ Sống không rác' },
  { id: 'green_rookie',  label: '🌱 Tân binh xanh' },
  { id: 'eco_legend',    label: '👑 Huyền thoại xanh' },
];

// Nhãn mô tả bản thân
export const AVAILABLE_TAGS = [
  '🌱 Mới bắt đầu', '♻️ Tái chế mỗi ngày', '🚴 Di chuyển xanh',
  '🥦 Ăn thuần chay', '💡 Tiết kiệm năng lượng', '🧴 Không nhựa dùng 1 lần',
  '🌳 Trồng cây', '🛍️ Mua sắm có ý thức', '🐾 Bảo vệ động vật',
];

interface UserProfile {
  nickname: string;
  titleId: string;
  tags: string[];
  slogan: string;
}

interface AppContextType {
  userEmail: string;
  setUserEmail: (email: string) => void;
  userDemographics: UserDemographics | null;
  setUserDemographics: (demo: UserDemographics) => void;
  greenScore: number;
  addPoints: (points: number) => void;
  subtractPoints: (points: number) => void;
  activeProduct: any | null;
  setActiveProduct: (product: any | null) => void;
  showPointToast: number | null;
  currentStep: 'login' | 'survey' | 'instruction' | 'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | 'post_survey' | 'thank_you';
  setCurrentStep: (step: 'login' | 'survey' | 'instruction' | 'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | 'post_survey' | 'thank_you') => void;
  lastSimulationStep: 'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | null;
  setLastSimulationStep: (step: 'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | null) => void;
  selectedLogistics: 'standard' | 'green' | 'fast' | null;
  setSelectedLogistics: (type: 'standard' | 'green' | 'fast' | null) => void;
  selectedPackaging: 'standard' | 'green' | null;
  setSelectedPackaging: (type: 'standard' | 'green' | null) => void;
  resetFlow: () => void;
  wateringCount: number;
  leaderboard: any[];
  refreshLeaderboard: () => void;
  // Profile tự thể hiện
  userProfile: UserProfile;
  setUserProfile: (profile: UserProfile) => void;
}

const DEFAULT_PROFILE: UserProfile = {
  nickname: '',
  titleId: 'green_rookie',
  tags: [],
  slogan: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userEmail, setUserEmail] = useState(() => localStorage.getItem('eco_userEmail') || '');
  const [userDemographics, setUserDemographicsState] = useState<UserDemographics | null>(() => {
    const saved = localStorage.getItem('eco_userDemographics');
    return saved ? JSON.parse(saved) : null;
  });
  const [greenScore, setGreenScore] = useState(() => Number(localStorage.getItem('eco_greenScore')) || 0);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [showPointToast, setShowPointToast] = useState<number | null>(null);
  const [currentStep, setCurrentStepState] = useState<any>(() =>
    (localStorage.getItem('eco_currentStep') as any) || 'login'
  );
  const [lastSimulationStep, setLastSimulationStep] = useState<any>(() =>
    (localStorage.getItem('eco_lastSimulationStep') as any) || null
  );
  const [selectedLogistics, setSelectedLogistics] = useState<any>(() =>
    (localStorage.getItem('eco_selectedLogistics') as any) || null
  );
  const [selectedPackaging, setSelectedPackaging] = useState<any>(() =>
    (localStorage.getItem('eco_selectedPackaging') as any) || null
  );
  const [wateringCount, setWateringCount] = useState(() => Number(localStorage.getItem('eco_wateringCount')) || 1);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('eco_userProfile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const setCurrentStep = (step: any) => {
    setCurrentStepState(step);
    window.history.pushState({ step }, '', '');
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) setCurrentStepState(event.state.step);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => { localStorage.setItem('eco_userEmail', userEmail); }, [userEmail]);
  useEffect(() => { if (userDemographics) localStorage.setItem('eco_userDemographics', JSON.stringify(userDemographics)); }, [userDemographics]);
  useEffect(() => { localStorage.setItem('eco_greenScore', greenScore.toString()); }, [greenScore]);
  useEffect(() => { localStorage.setItem('eco_currentStep', currentStep); }, [currentStep]);
  useEffect(() => {
    if (lastSimulationStep) localStorage.setItem('eco_lastSimulationStep', lastSimulationStep);
    else localStorage.removeItem('eco_lastSimulationStep');
  }, [lastSimulationStep]);
  useEffect(() => {
    if (selectedLogistics) localStorage.setItem('eco_selectedLogistics', selectedLogistics);
    else localStorage.removeItem('eco_selectedLogistics');
  }, [selectedLogistics]);
  useEffect(() => {
    if (selectedPackaging) localStorage.setItem('eco_selectedPackaging', selectedPackaging);
    else localStorage.removeItem('eco_selectedPackaging');
  }, [selectedPackaging]);
  useEffect(() => { localStorage.setItem('eco_wateringCount', wateringCount.toString()); }, [wateringCount]);
  useEffect(() => { localStorage.setItem('eco_userProfile', JSON.stringify(userProfile)); }, [userProfile]);
  useEffect(() => { setLeaderboard(dataService.getLeaderboard()); }, []);

  const refreshLeaderboard = () => setLeaderboard(dataService.getLeaderboard());
  const setUserDemographics = (demo: UserDemographics) => setUserDemographicsState(demo);
  const setUserProfile = (profile: UserProfile) => setUserProfileState(profile);

  const addPoints = (points: number) => {
    if (points <= 0) return;
    setGreenScore(prev => prev + points);
    setWateringCount(prev => prev + 1);
    setShowPointToast(points);
    setTimeout(() => setShowPointToast(null), 3000);
  };

  const subtractPoints = (points: number) => setGreenScore(prev => Math.max(0, prev - points));

  const resetFlow = () => {
    setActiveProduct(null);
    setSelectedLogistics(null);
    setSelectedPackaging(null);
    setCurrentStep('shop');
  };

  return (
    <AppContext.Provider value={{
      userEmail, setUserEmail,
      userDemographics, setUserDemographics,
      greenScore, addPoints, subtractPoints,
      activeProduct, setActiveProduct,
      showPointToast,
      currentStep, setCurrentStep,
      lastSimulationStep, setLastSimulationStep,
      selectedLogistics, setSelectedLogistics,
      selectedPackaging, setSelectedPackaging,
      resetFlow,
      wateringCount,
      leaderboard, refreshLeaderboard,
      userProfile, setUserProfile,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
