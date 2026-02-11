
export interface User {
  id: string;
  name: string;
  avatar: string;
  greenScore: number;
  badges: string[];
  rank: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  isGreen: boolean;
  sellerRating: number;
  greenPoints: number;
  description: string;
  wasteSaved: number;
  wasteType: 'nhựa' | 'giấy tái chế' | 'túi nilon';
  packagingWasteSaved: number;
  logisticsFuelSaved: number;
}

export interface UserDemographics {
  gender: string;
  age: string;
  education: string;
  job: string;
  income: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  text: string;
  timestamp: Date;
}

export interface Badge {
  id: string;
  label: string;
  icon: string;
  description: string;
  requirement: number;
}

export interface Medal {
  id: string;
  label: string;
  icon: string;
  color: string;
  requirement: number;
}

export interface SurveyRecord extends Partial<UserDemographics> {
  userEmail: string;
  productId: string;
  isGreenProduct: number; 
  logisticsType: string;
  isGreenLogistics: number; 
  packagingType: string;
  isGreenPackaging: number; 
}
