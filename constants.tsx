
import { Badge, Medal, Product } from './types';

export const BADGES: Badge[] = [
  { id: '1', label: 'Seed', icon: '🌱', description: 'Beginner', requirement: 0 },
  { id: '2', label: 'Young Leaf', icon: '🌿', description: 'Accumulated 50 points', requirement: 50 },
  { id: '3', label: 'Green Tree', icon: '🌳', description: 'Accumulated 100 points', requirement: 100 },
  { id: '4', label: 'Old-Growth Forest', icon: '🌲', description: 'Accumulated 200 points', requirement: 200 },
];

export const MEDALS: Medal[] = [
  { id: 'bronze', label: 'Green Bronze', icon: '🥉', color: 'text-orange-600', requirement: 100 },
  { id: 'silver', label: 'Green Silver', icon: '🥈', color: 'text-slate-400', requirement: 300 },
  { id: 'gold', label: 'Green Gold', icon: '🥇', color: 'text-yellow-500', requirement: 600 },
];

export interface ExtendedProduct extends Product {
  shopName: string;
  material: string;
  category: string;
}

export const PRODUCTS: ExtendedProduct[] = [
  // Pair 1: Water bottle (heavy: ~500 g – 1 kg including packaging)
  {
    id: '1a',
    name: 'Insulated Water Bottle 500ml',
    price: 145000,
    image: 'https://th.bing.com/th/id/R.d865c7fa82657b20d900379ef5135948?rik=zGZc9d2mwLppkQ&riu=http%3a%2f%2fwww.sieuthinhua.vn%2fmedia%2fproduct%2f11203_0_binh_the_thao_500ml_2_scaled.jpg&ehk=KAM0%2biEd35tOtlxd3AKRwgUNMReUTi96X4nbD7CgxfI%3d&risl=&pid=ImgRaw&r=0',
    isGreen: true,
    sellerRating: 4.9,
    greenPoints: 40,
    wasteSaved: 200, 
    wasteType: 'plastic',
    packagingWasteSaved: 50,
    logisticsFuelSaved: 0.25, // Heavier item, so more fuel is saved when switching to an EV
    description: 'Product meets sustainability standards, prioritizing recycled materials and waste reduction.',
    shopName: 'Anh Minh Eco Household',
    material: 'Organic bioplastic',
    category: 'Water Bottle'
  },
  {
    id: '1b',
    name: 'Insulated Water Bottle 500ml',
    price: 125000,
    image: 'https://th.bing.com/th/id/R.d865c7fa82657b20d900379ef5135948?rik=zGZc9d2mwLppkQ&riu=http%3a%2f%2fwww.sieuthinhua.vn%2fmedia%2fproduct%2f11203_0_binh_the_thao_500ml_2_scaled.jpg&ehk=KAM0%2biEd35tOtlxd3AKRwgUNMReUTi96X4nbD7CgxfI%3d&risl=&pid=ImgRaw&r=0',
    isGreen: false,
    sellerRating: 4.9,
    greenPoints: 0,
    wasteSaved: 0,
    wasteType: 'plastic',
    packagingWasteSaved: 50,
    logisticsFuelSaved: 0.25,
    description: 'Product manufactured using standard industrial processes.',
    shopName: 'Anh Minh Household',
    material: 'ABS plastic',
    category: 'Water Bottle'
  },
  // Pair 2: Notebook (medium weight: ~300 g)
  {
    id: '2a',
    name: 'Notebook',
    price: 95000,
    image: 'https://image.made-in-china.com/2f0j00ulRYpIkqqLbW/PP-Cover-Spiral-Notebook-with-Custom-Logo.jpg',
    isGreen: true,
    sellerRating: 4.8,
    greenPoints: 25,
    wasteSaved: 500,
    wasteType: 'paper',
    packagingWasteSaved: 30,
    logisticsFuelSaved: 0.12,
    description: 'Product meets sustainability standards, prioritizing recycled materials and waste reduction.',
    shopName: 'Green Stationery',
    material: 'Recycled Kraft paper',
    category: 'Notebook'
  },
  {
    id: '2b',
    name: 'Notebook',
    price: 80000,
    image: 'https://image.made-in-china.com/2f0j00ulRYpIkqqLbW/PP-Cover-Spiral-Notebook-with-Custom-Logo.jpg',
    isGreen: false,
    sellerRating: 4.8,
    greenPoints: 0,
    wasteSaved: 0,
    wasteType: 'paper',
    packagingWasteSaved: 30,
    logisticsFuelSaved: 0.12,
    description: 'Product manufactured using standard industrial processes.',
    shopName: 'Hanoi Stationery',
    material: 'Coated white paper',
    category: 'Notebook'
  },
  // Pair 3: Tote bag (light: ~100 g)
  {
    id: '3a',
    name: 'Tote Bag',
    price: 65000,
    image: 'https://goudainc.com/wp-content/uploads/2019/08/6oz-Cotton-Tote-with-Gusset-Natural-jpg.webp',
    isGreen: true,
    sellerRating: 4.9,
    greenPoints: 20,
    wasteSaved: 150,
    wasteType: 'plastic bag',
    packagingWasteSaved: 20,
    logisticsFuelSaved: 0.05,
    description: 'Product meets sustainability standards, prioritizing recycled materials and waste reduction.',
    shopName: 'Green Living Store',
    material: 'Natural canvas fabric',
    category: 'Bag'
  },
  {
    id: '3b',
    name: 'Tote Bag',
    price: 50000,
    image: 'https://goudainc.com/wp-content/uploads/2019/08/6oz-Cotton-Tote-with-Gusset-Natural-jpg.webp',
    isGreen: false,
    sellerRating: 4.9,
    greenPoints: 0,
    wasteSaved: 0,
    wasteType: 'plastic bag',
    packagingWasteSaved: 20,
    logisticsFuelSaved: 0.05,
    description: 'Product manufactured using standard industrial processes.',
    shopName: 'Family Store',
    material: 'Polyester parachute fabric',
    category: 'Bag'
  }
];

export const MOCK_LEADERBOARD = [
  { id: '1', name: 'Minh Tuấn', score: 450, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Thanh Hà', score: 320, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Quốc Bảo', score: 280, avatar: 'https://i.pravatar.cc/150?u=4' },
];
