
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
