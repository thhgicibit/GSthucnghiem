
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  userName: string;
  setUserName: (name: string) => void;
  greenScore: number;
  addPoints: (points: number) => void;
  activeProduct: any | null;
  setActiveProduct: (product: any | null) => void;
  showPointToast: number | null;
  currentStep: 'login' | 'shop' | 'checkout' | 'success' | 'social';
  setCurrentStep: (step: 'login' | 'shop' | 'checkout' | 'success' | 'social') => void;
  selectedLogistics: 'standard' | 'green' | 'fast' | null;
  setSelectedLogistics: (type: 'standard' | 'green' | 'fast' | null) => void;
  resetFlow: () => void;
  wateringCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('');
  const [greenScore, setGreenScore] = useState(25);
  const [activeProduct, setActiveProduct] = useState<any | null>(null);
  const [showPointToast, setShowPointToast] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<'login' | 'shop' | 'checkout' | 'success' | 'social'>('login');
  const [selectedLogistics, setSelectedLogistics] = useState<'standard' | 'green' | 'fast' | null>(null);
  const [wateringCount, setWateringCount] = useState(1);

  const addPoints = (points: number) => {
    if (points <= 0) return;
    setGreenScore(prev => prev + points);
    // Mỗi lần nhận điểm từ hành vi xanh được tính là 1 lần tưới nước
    setWateringCount(prev => prev + 1);
    setShowPointToast(points);
    setTimeout(() => setShowPointToast(null), 3000);
  };

  const resetFlow = () => {
    setActiveProduct(null);
    setSelectedLogistics(null);
    setCurrentStep('shop');
  };

  return (
    <AppContext.Provider value={{ 
      userName,
      setUserName,
      greenScore, 
      addPoints, 
      activeProduct,
      setActiveProduct,
      showPointToast,
      currentStep,
      setCurrentStep,
      selectedLogistics,
      setSelectedLogistics,
      resetFlow,
      wateringCount
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
