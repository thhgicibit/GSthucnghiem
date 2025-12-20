
import { Badge, Medal, Product } from './types';

export const BADGES: Badge[] = [
  { id: '1', label: 'Hạt mầm', icon: '🌱', description: 'Người mới bắt đầu', requirement: 0 },
  { id: '2', label: 'Lá non', icon: '🌿', description: 'Đã tích lũy 50 điểm', requirement: 50 },
  { id: '3', label: 'Cây xanh', icon: '🌳', description: 'Đã tích lũy 100 điểm', requirement: 100 },
  { id: '4', label: 'Rừng già', icon: '🌲', description: 'Đã tích lũy 200 điểm', requirement: 200 },
];

export const MEDALS: Medal[] = [
  { id: 'bronze', label: 'Đồng Xanh', icon: '🥉', color: 'text-orange-600', requirement: 100 },
  { id: 'silver', label: 'Bạc Xanh', icon: '🥈', color: 'text-slate-400', requirement: 300 },
  { id: 'gold', label: 'Vàng Xanh', icon: '🥇', color: 'text-yellow-500', requirement: 600 },
];

export interface ExtendedProduct extends Product {
  shopName: string;
  isGreenShop: boolean;
  material: string;
  category: string;
}

export const PRODUCTS: ExtendedProduct[] = [
  // Cặp 1: Bình nước
  {
    id: '1a',
    name: 'Bình nước giữ nhiệt làm từ bã mía tái chế CupNatural',
    price: 125000,
    image: 'https://bamboovietbac.com/wp-content/uploads/2023/12/z4859258551102_cc2e37c6f60c2161f577b0d544c8f3b0.jpg',
    isGreen: true,
    sellerRating: 4.9,
    greenPoints: 30,
    description: 'Chất liệu bã mía tự nhiên, phân hủy sinh học hoàn toàn.',
    shopName: 'Gia Dụng Anh Minh',
    isGreenShop: true,
    material: 'Bã mía tái chế',
    category: 'Bình nước'
  },
  {
    id: '1b',
    name: 'Bình nước nhựa thể thao Durable Plastic 500ml',
    price: 115000,
    image: 'https://th.bing.com/th/id/R.d865c7fa82657b20d900379ef5135948?rik=zGZc9d2mwLppkQ&riu=http%3a%2f%2fwww.sieuthinhua.vn%2fmedia%2fproduct%2f11203_0_binh_the_thao_500ml_2_scaled.jpg&ehk=KAM0%2biEd35tOtlxd3AKRwgUNMReUTi96X4nbD7CgxfI%3d&risl=&pid=ImgRaw&r=0',
    isGreen: false,
    sellerRating: 4.7,
    greenPoints: 0,
    description: 'Nhựa PET truyền thống, độ bền cao.',
    shopName: 'Bách Hóa Tổng Hợp',
    isGreenShop: false,
    material: 'Nhựa PET',
    category: 'Bình nước'
  },
  // Cặp 2: Sổ tay
  {
    id: '2a',
    name: 'Sổ tay bìa tre tự nhiên - Giấy tái chế không tẩy trắng',
    price: 85000,
    image: 'https://image.dhgate.com/0x0/f2/albu/g6/M00/8F/A1/rBVaR1u9XNqAM66lAADWgs1TeZo289.jpg',
    isGreen: true,
    sellerRating: 4.8,
    greenPoints: 20,
    description: 'Bìa làm từ tre thật, giấy thân thiện môi trường.',
    shopName: 'Văn Phòng Phẩm Hà Nội',
    isGreenShop: true,
    material: 'Tre & Giấy tái chế',
    category: 'Sổ tay'
  },
  {
    id: '2b',
    name: 'Sổ tay bìa da PU cao cấp - Giấy trắng chống lóa',
    price: 89000,
    image: 'https://cf.shopee.vn/file/vn-11134207-7r98o-lleeugp916eu61',
    isGreen: false,
    sellerRating: 4.8,
    greenPoints: 0,
    description: 'Bìa da công nghiệp, sang trọng hiện đại.',
    shopName: 'Phụ Kiện Văn Phòng',
    isGreenShop: false,
    material: 'Da PU & Giấy trắng',
    category: 'Sổ tay'
  },
  // Cặp 3: Túi xách
  {
    id: '3a',
    name: 'Túi vải Canvas tự nhiên - Sợi bông mộc',
    price: 45000,
    image: 'https://thoppiaupload.s3.amazonaws.com/wp-content/uploads/2022/03/textura_cotton_tote_bag_beige_grey_1-620x644.jpg',
    isGreen: true,
    sellerRating: 4.9,
    greenPoints: 15,
    description: 'Vải cotton 100% không nhuộm hóa chất.',
    shopName: 'Cửa Hàng Gia Đình',
    isGreenShop: true,
    material: 'Vải Canvas',
    category: 'Túi'
  },
  {
    id: '3b',
    name: 'Túi nilon quai xách siêu bền (Set 50 túi)',
    price: 35000,
    image: 'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lsy1qqqd8hqcc1',
    isGreen: false,
    sellerRating: 4.5,
    greenPoints: 0,
    description: 'Túi nilon tiện dụng cho mọi nhu cầu.',
    shopName: 'Tạp Hóa Tiện Lợi',
    isGreenShop: false,
    material: 'Nilon',
    category: 'Túi'
  }
];

export const MOCK_LEADERBOARD = [
  { id: '1', name: 'Minh Tuấn', score: 450, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Thanh Hà', score: 320, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Quốc Bảo', score: 280, avatar: 'https://i.pravatar.cc/150?u=4' },
];
