
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { dataService } from './dataService';
import { UserDemographics } from './types';

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
}

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
  const [currentStep, setCurrentStepState] = useState<'login' | 'survey' | 'instruction' | 'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | 'post_survey' | 'thank_you'>(() => 
    (localStorage.getItem('eco_currentStep') as any) || 'login'
  );

  const setCurrentStep = (step: any) => {
    setCurrentStepState(step);
    window.history.pushState({ step }, '', '');
  };

  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      if (event.state && event.state.step) {
        setCurrentStepState(event.state.step);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [lastSimulationStep, setLastSimulationStep] = useState<'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | null>(() => 
    (localStorage.getItem('eco_lastSimulationStep') as any) || null
  );
  const [selectedLogistics, setSelectedLogistics] = useState<'standard' | 'green' | 'fast' | null>(() => 
    (localStorage.getItem('eco_selectedLogistics') as any) || null
  );
  const [selectedPackaging, setSelectedPackaging] = useState<'standard' | 'green' | null>(() => 
    (localStorage.getItem('eco_selectedPackaging') as any) || null
  );
  const [wateringCount, setWateringCount] = useState(() => Number(localStorage.getItem('eco_wateringCount')) || 1);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

  useEffect(() => {
    localStorage.setItem('eco_userEmail', userEmail);
  }, [userEmail]);

  useEffect(() => {
    if (userDemographics) {
      localStorage.setItem('eco_userDemographics', JSON.stringify(userDemographics));
    }
  }, [userDemographics]);

  useEffect(() => {
    localStorage.setItem('eco_greenScore', greenScore.toString());
  }, [greenScore]);

  useEffect(() => {
    localStorage.setItem('eco_currentStep', currentStep);
  }, [currentStep]);

  useEffect(() => {
    if (lastSimulationStep) {
      localStorage.setItem('eco_lastSimulationStep', lastSimulationStep);
    } else {
      localStorage.removeItem('eco_lastSimulationStep');
    }
  }, [lastSimulationStep]);

  useEffect(() => {
    if (selectedLogistics) {
      localStorage.setItem('eco_selectedLogistics', selectedLogistics);
    } else {
      localStorage.removeItem('eco_selectedLogistics');
    }
  }, [selectedLogistics]);

  useEffect(() => {
    if (selectedPackaging) {
      localStorage.setItem('eco_selectedPackaging', selectedPackaging);
    } else {
      localStorage.removeItem('eco_selectedPackaging');
    }
  }, [selectedPackaging]);

  useEffect(() => {
    localStorage.setItem('eco_wateringCount', wateringCount.toString());
  }, [wateringCount]);

  useEffect(() => {
    setLeaderboard(dataService.getLeaderboard());
  }, []);

  const refreshLeaderboard = () => {
    setLeaderboard(dataService.getLeaderboard());
  };

  const setUserDemographics = (demo: UserDemographics) => {
    setUserDemographicsState(demo);
  };

  const addPoints = (points: number) => {
    if (points <= 0) return;
    setGreenScore(prev => prev + points);
    setWateringCount(prev => prev + 1);
    setShowPointToast(points);
    setTimeout(() => setShowPointToast(null), 3000);
  };

  const subtractPoints = (points: number) => {
    setGreenScore(prev => Math.max(0, prev - points));
  };

  const resetFlow = () => {
    setActiveProduct(null);
    setSelectedLogistics(null);
    setSelectedPackaging(null);
    setCurrentStep('shop');
  };

  return (
    <AppContext.Provider value={{ 
      userEmail,
      setUserEmail,
      userDemographics,
      setUserDemographics,
      greenScore, 
      addPoints, 
      subtractPoints,
      activeProduct,
      setActiveProduct,
      showPointToast,
      currentStep,
      setCurrentStep,
      lastSimulationStep,
      setLastSimulationStep,
      selectedLogistics,
      setSelectedLogistics,
      selectedPackaging,
      setSelectedPackaging,
      resetFlow,
      wateringCount,
      leaderboard,
      refreshLeaderboard
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
