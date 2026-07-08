import { Spot, SPOTS, Article, ARTICLES, SPECIALTY_DISHES } from '../data';

export interface UserAccount {
  email: string;
  name: string;
  role: 'tourist' | 'partner' | 'admin';
  password?: string;
  businessName?: string;
  businessCategory?: string;
  businessAddress?: string;
  businessDistrict?: string;
  businessDesc?: string;
  avatar?: string;
  active: boolean;
  approved?: boolean;
}

export interface AppCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  count: number;
}

export interface AppImage {
  id: string;
  url: string;
  title: string;
  source: string; // 'user' | 'system' | 'partner'
  uploadedBy?: string;
  uploadedAt: string;
  associatedWith?: string; // spot ID or article ID
}

// Default Users Setup
const DEFAULT_USERS: UserAccount[] = [
  {
    email: 'admin@example.com',
    name: 'Nguyễn Thanh Sơn',
    role: 'admin',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80',
    active: true,
    approved: true
  },
  {
    email: 'partner@example.com',
    name: 'Lê Thị Mây',
    role: 'partner',
    password: '123',
    businessName: 'Mây Corner - Tiệm Ảnh Cổ Phục & Ngoại Cảnh',
    businessCategory: 'beauty',
    businessAddress: 'Bản Đôn, xã Thành Lâm, Bá Thước, Thanh Hóa',
    businessDistrict: 'Huyện Bá Thước',
    businessDesc: 'Chuyên cung cấp trang phục cổ phục Việt Nam và trang phục dân tộc Thái, Mường cao cấp.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
    active: true,
    approved: true
  },
  {
    email: 'tourist@example.com',
    name: 'Phạm Thanh Hải',
    role: 'tourist',
    password: '123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80',
    active: true,
    approved: true
  }
];

// Default Categories Setup
const DEFAULT_CATEGORIES: AppCategory[] = [
  { id: 'travel', name: 'Địa danh du lịch', iconName: 'Compass', description: 'Danh lam thắng cảnh, di tích lịch sử lý thú', count: 12 },
  { id: 'food', name: 'Đặc sản ẩm thực', iconName: 'Utensils', description: 'Tinh hoa ẩm thực dân dã, độc đáo xứ Thanh', count: 8 },
  { id: 'cafe', name: 'Cà phê & Giải trí', iconName: 'Coffee', description: 'Điểm check-in chill mộng mơ, hiện đại', count: 6 },
  { id: 'hotel', name: 'Khách sạn & Resort', iconName: 'Hotel', description: 'Không gian nghỉ dưỡng sang trọng, ấm áp', count: 9 },
  { id: 'beauty', name: 'Làm đẹp & Chụp ảnh', iconName: 'Sparkles', description: 'Dịch vụ chụp hình và spa dưỡng sinh trị liệu', count: 4 }
];

// Default Images Setup
const DEFAULT_IMAGES: AppImage[] = [
  { id: 'img-1', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDP6v90wZipgXNroYfKmmSb290ynidcRzZUQt4HsPLdYTFZ4BG15xlvAnlnvlzp155klK49Yig87QU7TXKgpMK51ezkyqCX7wll6F852059jboer7SICPJwaiLOCSXJo3-OmIud7SSRJCZKcRKleIf5WwHnfvCNcwayN-3Tk3AzM0EaoYwAINzc0dRLIgouwpsRqo2olp5lFly6kt7AIgmP3TZrs2PcSXeEvCuDAQAq-4_HCpjXtlzfLw', title: 'Thung lũng ruộng lúa Pù Luông', source: 'system', uploadedAt: '2026-05-15', associatedWith: 'pu-luong' },
  { id: 'img-2', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=600&h=400&q=80', title: 'Không gian quán cà phê đồi núi', source: 'system', uploadedAt: '2026-06-11', associatedWith: 'coastal-roasters' },
  { id: 'img-3', url: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=600&h=400&q=80', title: 'Phòng Spa Thảo Dược Lavender', source: 'system', uploadedAt: '2026-07-01', associatedWith: 'lavender-spa' },
  { id: 'img-4', url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&h=400&q=80', title: 'Chụp ảnh ngoại cảnh cổ phục', source: 'system', uploadedAt: '2026-06-20', associatedWith: 'may-corner' }
];

export const initDb = (): void => {
  if (!localStorage.getItem('hth_initialized')) {
    localStorage.setItem('hth_spots', JSON.stringify(SPOTS));
    localStorage.setItem('hth_articles', JSON.stringify(ARTICLES));
    localStorage.setItem('hth_categories', JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem('hth_users', JSON.stringify(DEFAULT_USERS));
    localStorage.setItem('hth_images', JSON.stringify(DEFAULT_IMAGES));
    localStorage.setItem('hth_initialized', 'true');
  }
};

// Spots DB
export const getSpots = (): Spot[] => {
  initDb();
  return JSON.parse(localStorage.getItem('hth_spots') || '[]');
};

export const saveSpot = (spot: Spot): void => {
  const spots = getSpots();
  const exists = spots.some(s => s.id === spot.id);
  let updated;
  if (exists) {
    updated = spots.map(s => s.id === spot.id ? spot : s);
  } else {
    updated = [spot, ...spots];
  }
  localStorage.setItem('hth_spots', JSON.stringify(updated));
};

export const deleteSpot = (id: string): void => {
  const spots = getSpots();
  const updated = spots.filter(s => s.id !== id);
  localStorage.setItem('hth_spots', JSON.stringify(updated));
};

// Articles DB
export const getArticles = (): Article[] => {
  initDb();
  return JSON.parse(localStorage.getItem('hth_articles') || '[]');
};

export const saveArticle = (article: Article): void => {
  const articles = getArticles();
  const exists = articles.some(a => a.id === article.id);
  let updated;
  if (exists) {
    updated = articles.map(a => a.id === article.id ? article : a);
  } else {
    updated = [article, ...articles];
  }
  localStorage.setItem('hth_articles', JSON.stringify(updated));
};

export const deleteArticle = (id: string): void => {
  const articles = getArticles();
  const updated = articles.filter(a => a.id !== id);
  localStorage.setItem('hth_articles', JSON.stringify(updated));
};

// Categories DB
export const getCategories = (): AppCategory[] => {
  initDb();
  return JSON.parse(localStorage.getItem('hth_categories') || '[]');
};

export const saveCategory = (category: AppCategory): void => {
  const categories = getCategories();
  const exists = categories.some(c => c.id === category.id);
  let updated;
  if (exists) {
    updated = categories.map(c => c.id === category.id ? category : c);
  } else {
    updated = [...categories, category];
  }
  localStorage.setItem('hth_categories', JSON.stringify(updated));
};

export const deleteCategory = (id: string): void => {
  const categories = getCategories();
  const updated = categories.filter(c => c.id !== id);
  localStorage.setItem('hth_categories', JSON.stringify(updated));
};

// Users DB
export const getUsers = (): UserAccount[] => {
  initDb();
  return JSON.parse(localStorage.getItem('hth_users') || '[]');
};

export const saveUser = (user: UserAccount): void => {
  const users = getUsers();
  const exists = users.some(u => u.email === user.email);
  let updated;
  if (exists) {
    updated = users.map(u => u.email === user.email ? user : u);
  } else {
    updated = [...users, user];
  }
  localStorage.setItem('hth_users', JSON.stringify(updated));
};

export const deleteUser = (email: string): void => {
  const users = getUsers();
  const updated = users.filter(u => u.email !== email);
  localStorage.setItem('hth_users', JSON.stringify(updated));
};

// Images DB
export const getImages = (): AppImage[] => {
  initDb();
  return JSON.parse(localStorage.getItem('hth_images') || '[]');
};

export const saveImage = (img: AppImage): void => {
  const imgs = getImages();
  const exists = imgs.some(i => i.id === img.id);
  let updated;
  if (exists) {
    updated = imgs.map(i => i.id === img.id ? img : i);
  } else {
    updated = [img, ...imgs];
  }
  localStorage.setItem('hth_images', JSON.stringify(updated));
};

export const deleteImage = (id: string): void => {
  const imgs = getImages();
  const updated = imgs.filter(i => i.id !== id);
  localStorage.setItem('hth_images', JSON.stringify(updated));
};

// Current Session Handling
export const getCurrentUser = (): UserAccount | null => {
  const stored = localStorage.getItem('hth_current_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: UserAccount | null): void => {
  if (user) {
    localStorage.setItem('hth_current_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('hth_current_user');
  }
};
