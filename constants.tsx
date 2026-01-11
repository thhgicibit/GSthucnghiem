
// Fix: Import types from the correct relative path (parent directory)
import { Badge, Medal, Product } from '../types';

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
  material: string;
  category: string;
}

export const PRODUCTS: ExtendedProduct[] = [
  // Cặp 1: Bình nước (Đối chứng tuyệt đối: Giống hệt tên và mô tả)
  {
    id: '1a',
    name: 'Bình nước giữ nhiệt 500ml',
    price: 140000,
    image: 'https://th.bing.com/th/id/R.d865c7fa82657b20d900379ef5135948?rik=zGZc9d2mwLppkQ&riu=http%3a%2f%2fwww.sieuthinhua.vn%2fmedia%2fproduct%2f11203_0_binh_the_thao_500ml_2_scaled.jpg&ehk=KAM0%2biEd35tOtlxd3AKRwgUNMReUTi96X4nbD7CgxfI%3d&risl=&pid=ImgRaw&r=0',
    isGreen: true,
    sellerRating: 4.9,
    greenPoints: 30,
    // Fix: Corrected property names and added wasteType to comply with Product interface
    wasteSaved: 200,
    wasteType: 'nhựa',
    packagingWasteSaved: 100,
    logisticsFuelSaved: 0.5,
    description: 'Sản phẩm đáp ứng tiêu chuẩn bền vững, ưu tiên nguyên liệu tái chế và giảm thiểu rác thải.',
    shopName: 'Gia Dụng Anh Minh',
    material: 'Nhựa bảo vệ môi trường',
    category: 'Bình nước'
  },
  {
    id: '1b',
    name: 'Bình nước giữ nhiệt 500ml',
    price: 130000,
    image: 'https://th.bing.com/th/id/R.d865c7fa82657b20d900379ef5135948?rik=zGZc9d2mwLppkQ&riu=http%3a%2f%2fwww.sieuthinhua.vn%2fmedia%2fproduct%2f11203_0_binh_the_thao_500ml_2_scaled.jpg&ehk=KAM0%2biEd35tOtlxd3AKRwgUNMReUTi96X4nbD7CgxfI%3d&risl=&pid=ImgRaw&r=0',
    isGreen: false,
    sellerRating: 4.9,
    greenPoints: 0,
    // Fix: Corrected property names and added wasteType to comply with Product interface
    wasteSaved: 0,
    wasteType: 'nhựa',
    packagingWasteSaved: 100,
    logisticsFuelSaved: 0.5,
    description: 'Sản phẩm sản xuất theo quy trình công nghiệp tiêu chuẩn.',
    shopName: 'Gia Dụng Anh Minh',
    material: 'Nhựa ABS',
    category: 'Bình nước'
  },
  // Cặp 2: Sổ tay
  {
    id: '2a',
    name: 'Sổ tay ghi chép',
    price: 95000,
    image: 'https://image.made-in-china.com/2f0j00ulRYpIkqqLbW/PP-Cover-Spiral-Notebook-with-Custom-Logo.jpg',
    isGreen: true,
    sellerRating: 4.8,
    greenPoints: 20,
    // Fix: Corrected property names and added wasteType to comply with Product interface
    wasteSaved: 80,
    wasteType: 'giấy tái chế',
    packagingWasteSaved: 40,
    logisticsFuelSaved: 0.3,
    description: 'Sản phẩm đáp ứng tiêu chuẩn bền vững, ưu tiên nguyên liệu tái chế và giảm thiểu rác thải.',
    shopName: 'Văn Phòng Phẩm Hà Nội',
    material: 'Giấy tái chế',
    category: 'Sổ tay'
  },
  {
    id: '2b',
    name: 'Sổ tay ghi chép',
    price: 85000,
    image: 'https://image.made-in-china.com/2f0j00ulRYpIkqqLbW/PP-Cover-Spiral-Notebook-with-Custom-Logo.jpg',
    isGreen: false,
    sellerRating: 4.8,
    greenPoints: 0,
    // Fix: Corrected property names and added wasteType to comply with Product interface
    wasteSaved: 0,
    wasteType: 'giấy tái chế',
    packagingWasteSaved: 40,
    logisticsFuelSaved: 0.3,
    description: 'Sản phẩm sản xuất theo quy trình công nghiệp tiêu chuẩn.',
    shopName: 'Văn Phòng Phẩm Hà Nội',
    material: 'Giấy trắng',
    category: 'Sổ tay'
  },
  // Cặp 3: Túi xách
  {
    id: '3a',
    name: 'Túi Tote Basic',
    price: 55000,
    image: 'https://goudainc.com/wp-content/uploads/2019/08/6oz-Cotton-Tote-with-Gusset-Natural-jpg.webp',
    isGreen: true,
    sellerRating: 4.9,
    greenPoints: 15,
    // Fix: Corrected property names and added wasteType to comply with Product interface
    wasteSaved: 150,
    wasteType: 'túi nilon',
    packagingWasteSaved: 20,
    logisticsFuelSaved: 0.2,
    description: 'Sản phẩm đáp ứng tiêu chuẩn bền vững, ưu tiên nguyên liệu tái chế và giảm thiểu rác thải.',
    shopName: 'Cửa Hàng Gia Đình',
    material: 'Vải Canvas',
    category: 'Túi'
  },
  {
    id: '3b',
    name: 'Túi Tote Basic',
    price: 45000,
    image: 'https://goudainc.com/wp-content/uploads/2019/08/6oz-Cotton-Tote-with-Gusset-Natural-jpg.webp',
    isGreen: false,
    sellerRating: 4.9,
    greenPoints: 0,
    // Fix: Corrected property names and added wasteType to comply with Product interface
    wasteSaved: 0,
    wasteType: 'túi nilon',
    packagingWasteSaved: 20,
    logisticsFuelSaved: 0.2,
    description: 'Sản phẩm sản xuất theo quy trình công nghiệp tiêu chuẩn.',
    shopName: 'Cửa Hàng Gia Đình',
    material: 'Vải Dù',
    category: 'Túi'
  }
];

export const MOCK_LEADERBOARD = [
  { id: '1', name: 'Minh Tuấn', score: 450, avatar: 'https://i.pravatar.cc/150?u=1' },
  { id: '2', name: 'Thanh Hà', score: 320, avatar: 'https://i.pravatar.cc/150?u=2' },
  { id: '3', name: 'Quốc Bảo', score: 280, avatar: 'https://i.pravatar.cc/150?u=4' },
];
