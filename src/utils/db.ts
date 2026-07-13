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
  businessMapLink?: string;
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

// Notification System for Partners
export interface AppNotification {
  id: string;
  recipientEmail: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  type: 'success' | 'info' | 'warning';
  articleId?: string;
  articleTitle?: string;
}

export const getNotifications = (): AppNotification[] => {
  initDb();
  return JSON.parse(localStorage.getItem('hth_notifications') || '[]');
};

export const getNotificationsForUser = (email: string): AppNotification[] => {
  const notifications = getNotifications();
  return notifications
    .filter(n => n.recipientEmail === email)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>): AppNotification => {
  const notifications = getNotifications();
  const newNotif: AppNotification = {
    ...notif,
    id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    createdAt: new Date().toISOString(),
    read: false
  };
  
  const updated = [newNotif, ...notifications];
  localStorage.setItem('hth_notifications', JSON.stringify(updated));
  return newNotif;
};

export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
  localStorage.setItem('hth_notifications', JSON.stringify(updated));
};

export const markAllNotificationsAsRead = (email: string): void => {
  const notifications = getNotifications();
  const updated = notifications.map(n => n.recipientEmail === email ? { ...n, read: true } : n);
  localStorage.setItem('hth_notifications', JSON.stringify(updated));
};

export const removeNotification = (id: string): void => {
  const notifications = getNotifications();
  const updated = notifications.filter(n => n.id !== id);
  localStorage.setItem('hth_notifications', JSON.stringify(updated));
};

/**
 * Tối ưu hóa tệp hình ảnh chất lượng cao ở phía client.
 * Hàm này đọc tệp hình ảnh, tải nó vào một đối tượng HTMLImageElement, tự động điều chỉnh
 * giảm kích thước nếu vượt quá độ phân giải tối đa (ví dụ: 1920px chiều rộng/cao) để đảm bảo
 * chất lượng sắc nét Full HD cho hiển thị web, đồng thời nén hình ảnh sang định dạng JPEG chất lượng cao (0.85-0.90)
 * Giúp người dùng đăng ảnh chất lượng cực cao (hỗ trợ tệp gốc lên tới 15MB) mà vẫn giữ dung lượng lưu trữ 
 * LocalStorage gọn nhẹ tối ưu (khoảng 150KB - 300KB) tránh đầy bộ nhớ trình duyệt.
 */
export function optimizeHighQualityImage(
  file: File,
  callback: (base64: string) => void,
  onError?: (err: string) => void
): void {
  // Hỗ trợ dung lượng ảnh tối đa 15MB (cho ảnh chất lượng cao từ máy ảnh/điện thoại xịn)
  const maxBytes = 15 * 1024 * 1024;
  if (file.size > maxBytes) {
    const errorMsg = 'Dung lượng ảnh quá lớn! Hệ thống hỗ trợ ảnh chất lượng cao lên tới 15MB.';
    if (onError) {
      onError(errorMsg);
    } else {
      alert(errorMsg);
    }
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Giới hạn kích thước chiều rộng/cao tối đa cho chuẩn ảnh chất lượng cao Full HD trên Web (1920px)
      const MAX_DIMENSION = 1920;
      if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
        if (width > height) {
          height = Math.round((height * MAX_DIMENSION) / width);
          width = MAX_DIMENSION;
        } else {
          width = Math.round((width * MAX_DIMENSION) / height);
          height = MAX_DIMENSION;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        // Nếu không lấy được context, fallback về kết quả base64 gốc
        callback(reader.result as string);
        return;
      }

      // Kích hoạt bộ lọc nội suy chất lượng cao để ảnh thu nhỏ vẫn giữ độ chi tiết sắc nét tuyệt hảo
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Xuất ra định dạng JPEG chất lượng cao (quality: 0.88 - tối ưu giữa độ nét và dung lượng)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      callback(dataUrl);
    };
    img.onerror = () => {
      // Fallback nếu không tải được thẻ ảnh
      callback(reader.result as string);
    };
    img.src = e.target?.result as string;
  };
  reader.onerror = () => {
    if (onError) {
      onError('Không thể đọc file ảnh.');
    } else {
      alert('Không thể đọc file ảnh.');
    }
  };
  reader.readAsDataURL(file);
}


