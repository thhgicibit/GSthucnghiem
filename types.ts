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
  gamificationExp: string;
  knownGame: string;
  // Tình cảm môi trường (1-5)
  sent_q1: string;
  sent_q2: string;
  sent_q3: string;
  sent_q4: string;
  sent_q5: string;
  sent_q6: string;
  // Kiến thức môi trường (1-5)
  know_q1: string;
  know_q2: string;
  know_q3: string;
  know_q4: string;
  know_q5: string;
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
