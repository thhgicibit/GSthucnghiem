
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
  const [userEmail, setUserEmail] = useState('');
  const [userDemographics, setUserDemographicsState] = useState<UserDemographics | null>(null);
  const [greenScore, setGreenScore] = useState(0);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [showPointToast, setShowPointToast] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<'login' | 'survey' | 'instruction' | 'shop' | 'packaging' | 'checkout' | 'success' | 'social' | 'redeem' | 'post_survey' | 'thank_you'>('login');
  const [selectedLogistics, setSelectedLogistics] = useState<'standard' | 'green' | 'fast' | null>(null);
  const [selectedPackaging, setSelectedPackaging] = useState<'standard' | 'green' | null>(null);
  const [wateringCount, setWateringCount] = useState(1);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);

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
