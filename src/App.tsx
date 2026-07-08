import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  MapPin, 
  Sparkles, 
  Building, 
  TrendingUp, 
  Bell, 
  Menu, 
  X, 
  Heart, 
  Info,
  Calendar,
  Utensils,
  Coffee,
  Hotel,
  Trash2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

import { SPOTS, Spot, Review } from './data';
import HomeView from './components/HomeView';
import ExploreView from './components/ExploreView';
import DetailView from './components/DetailView';
import AiPlannerView from './components/AiPlannerView';
import PartnerPortal from './components/PartnerPortal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import { initDb, getSpots, getCurrentUser, setCurrentUser, UserAccount, saveSpot } from './utils/db';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('home'); // home, explore, detail, ai-planner, partner
  const [selectedSpotId, setSelectedSpotId] = useState<string | null>(null);

  // Search/Filter parameter memory for explore view
  const [exploreQuery, setExploreQuery] = useState<string | null>(null);
  const [exploreCategory, setExploreCategory] = useState<string | null>(null);
  const [exploreRegion, setExploreRegion] = useState<string | null>(null);
  const [dealsOnly, setDealsOnly] = useState(false);

  // Initialize Database on startup
  useEffect(() => {
    initDb();
    setSpotsData(getSpots());
    setCurrentUserSession(getCurrentUser());
  }, []);

  // Spots Data State (allows adding reviews dynamically, loaded from database)
  const [spotsData, setSpotsData] = useState<Spot[]>(() => {
    initDb();
    return getSpots();
  });

  // User Auth States
  const [currentUserSession, setCurrentUserSession] = useState<UserAccount | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Sync spotsData when currentView changes (ensures Admin additions show up immediately)
  useEffect(() => {
    setSpotsData(getSpots());
  }, [currentView]);

  // Saved Spot IDs State (persisted in localStorage)
  const [savedSpotIds, setSavedSpotIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('hello_thanh_hoa_saved_spots');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showFavoritesModal, setShowFavoritesModal] = useState(false);

  // Persist saved spots to localStorage
  useEffect(() => {
    localStorage.setItem('hello_thanh_hoa_saved_spots', JSON.stringify(savedSpotIds));
  }, [savedSpotIds]);

  // Toggle Save Spot Handler
  const handleToggleSaveSpot = (spotId: string) => {
    const isSaved = savedSpotIds.includes(spotId);
    const spot = spotsData.find(s => s.id === spotId);
    const spotName = spot ? spot.name : 'địa điểm';

    if (isSaved) {
      setSavedSpotIds(prev => prev.filter(id => id !== spotId));
      triggerNotification(`💔 Đã bỏ lưu "${spotName}" khỏi danh sách yêu thích.`);
    } else {
      setSavedSpotIds(prev => [...prev, spotId]);
      triggerNotification(`💖 Đã lưu thành công "${spotName}" vào danh sách yêu thích!`);
    }
  };

  // Mobile menu open
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Notification Toast State
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);

  const triggerNotification = (message: string, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Add review to a specific spot
  const handleAddReview = (spotId: string, newReview: Review) => {
    setSpotsData(prevSpots => {
      return prevSpots.map(spot => {
        if (spot.id === spotId) {
          const updatedReviews = [newReview, ...spot.reviews];
          // Recalculate average rating
          const totalRating = updatedReviews.reduce((sum, r) => sum + r.rating, 0);
          const avgRating = parseFloat((totalRating / updatedReviews.length).toFixed(1));
          
          triggerNotification(`🎉 Cảm ơn bạn! Đã đăng thành công đánh giá ${newReview.rating}★ cho "${spot.name}".`);
          
          const updatedSpot = {
            ...spot,
            reviews: updatedReviews,
            rating: avgRating
          };
          saveSpot(updatedSpot);
          return updatedSpot;
        }
        return spot;
      });
    });
  };

  // Navigation Controller
  const handleNavigate = (navigationString: string, spotId?: string) => {
    // Close mobile sidebars
    setMobileMenuOpen(false);

    // Parsing navigate with params, e.g. "explore?query=sam-son"
    if (navigationString.startsWith('explore')) {
      const urlParams = new URLSearchParams(navigationString.split('?')[1] || '');
      setExploreQuery(urlParams.get('query') || null);
      setExploreCategory(urlParams.get('cat') || null);
      setExploreRegion(urlParams.get('region') || null);
      setDealsOnly(urlParams.get('deals') === 'true');
      
      setCurrentView('explore');
      setSelectedSpotId(null);
      return;
    }

    if (navigationString === 'detail' && spotId) {
      setSelectedSpotId(spotId);
      setCurrentView('detail');
      return;
    }

    if (navigationString === 'ai-planner') {
      setSelectedSpotId(spotId || null);
      setCurrentView('ai-planner');
      return;
    }

    // Default views
    setExploreQuery(null);
    setExploreCategory(null);
    setExploreRegion(null);
    setDealsOnly(false);
    
    setCurrentView(navigationString);
    setSelectedSpotId(null);
  };

  // Get currently selected spot object
  const currentSpot = spotsData.find(s => s.id === selectedSpotId);

  // Navigation links definition
  const navLinks = [
    { id: 'home', label: 'Trang chủ', icon: Compass },
    { id: 'explore', label: 'Khám phá địa điểm', icon: MapPin },
    { id: 'ai-planner', label: 'Lập lịch trình AI', icon: Sparkles },
    { id: 'partner', label: 'Kênh đối tác', icon: Building },
  ];
  if (currentUserSession?.role === 'admin') {
    navLinks.push({ id: 'admin', label: 'Quản trị Web', icon: ShieldAlert });
  }

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 flex flex-col antialiased">
      
      {/* Dynamic Floating Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] max-w-sm w-[90%] bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl border border-slate-100 p-4 flex items-start gap-3.5"
          >
            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex-shrink-0 flex items-center justify-center font-bold text-sm">
              ✨
            </div>
            <div className="flex-1 text-xs">
              <p className="font-bold text-slate-800">Thông báo từ hệ thống</p>
              <p className="text-slate-500 font-light mt-0.5 leading-relaxed">{notification.message}</p>
            </div>
            <button onClick={() => setNotification(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-100 px-4 md:px-8 py-3.5 flex justify-between items-center shadow-xs">
        <div className="flex items-center gap-2.5">
          {/* Logo */}
          <div 
            onClick={() => handleNavigate('home')} 
            className="flex items-center gap-2 cursor-pointer select-none group"
          >
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold shadow-md group-hover:scale-105 transition-transform">
              TH
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tight text-base md:text-lg block">Hello Thanh Hóa</span>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Smart Tourism Hub</span>
            </div>
          </div>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map(link => {
            const Icon = link.icon;
            const isActive = currentView === link.id;
            return (
              <button
                key={link.id}
                onClick={() => handleNavigate(link.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-700' 
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Right utility buttons */}
        <div className="flex items-center gap-3">
          {currentUserSession ? (
            <div className="hidden md:flex items-center gap-2">
              <button 
                onClick={() => {
                  setCurrentUser(null);
                  setCurrentUserSession(null);
                  handleNavigate('home');
                  triggerNotification('👋 Đã đăng xuất tài khoản thành công!');
                }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200 hover:bg-rose-50 hover:text-rose-600 transition-all text-[10px] font-bold text-slate-700 cursor-pointer shadow-2xs"
                title="Nhấp để Đăng xuất"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="uppercase tracking-wider max-w-[120px] truncate">
                  {currentUserSession.role === 'admin' 
                    ? '🛡️ ADMIN' 
                    : currentUserSession.role === 'partner' 
                      ? `🏢 ${currentUserSession.businessName || currentUserSession.name}` 
                      : `👤 ${currentUserSession.name}`}
                </span>
                <span className="text-slate-400 font-light pl-1 border-l border-slate-200">Đăng xuất</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all text-[10px] font-black cursor-pointer shadow-md hover:scale-[1.02]"
            >
              🔑 ĐĂNG NHẬP / ĐĂNG KÝ
            </button>
          )}

          <button 
            onClick={() => setShowFavoritesModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-rose-100 bg-rose-50/50 hover:bg-rose-50 text-rose-600 hover:text-rose-700 transition-colors text-[10px] font-bold cursor-pointer shadow-2xs relative"
            title="Danh sách yêu thích"
          >
            <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span className="hidden sm:inline">Yêu thích</span>
            {savedSpotIds.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-white animate-pulse">
                {savedSpotIds.length}
              </span>
            )}
          </button>

          {/* Mobile menu toggle */}
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile navigation sidebar/drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-950 z-50 md:hidden"
            />
            {/* Drawer body */}
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white border-l border-slate-100 z-50 p-6 md:hidden shadow-2xl flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-extrabold text-sm">
                      TH
                    </div>
                    <span className="font-extrabold text-slate-900 tracking-tight text-sm">Menu Điều Hướng</span>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-lg hover:bg-slate-50 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>

                <nav className="space-y-1.5">
                  {navLinks.map(link => {
                    const Icon = link.icon;
                    const isActive = currentView === link.id;
                    return (
                      <button
                        key={link.id}
                        onClick={() => handleNavigate(link.id)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                          isActive 
                            ? 'bg-blue-50 text-blue-700' 
                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                        }`}
                      >
                        <Icon className="w-4.5 h-4.5" />
                        {link.label}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowFavoritesModal(true);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-xl text-xs font-bold transition-all cursor-pointer text-left text-rose-600 hover:bg-rose-50/60"
                  >
                    <Heart className="w-4.5 h-4.5 fill-rose-500 text-rose-500" />
                    Danh sách yêu thích ({savedSpotIds.length})
                  </button>
                </nav>
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-4">
                {currentUserSession ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-2">
                      <img 
                        src={currentUserSession.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'} 
                        alt="Avatar" 
                        className="w-10 h-10 rounded-full object-cover border border-slate-100"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-extrabold text-slate-800 truncate">
                          {currentUserSession.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                          {currentUserSession.role === 'admin' 
                            ? 'Quản trị viên' 
                            : currentUserSession.role === 'partner' 
                              ? 'Đối tác số' 
                              : 'Du khách'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setMobileMenuOpen(false);
                        setCurrentUser(null);
                        setCurrentUserSession(null);
                        handleNavigate('home');
                        triggerNotification('👋 Đã đăng xuất tài khoản thành công!');
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      🚪 Đăng xuất tài khoản
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setShowAuthModal(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-800 transition-colors cursor-pointer text-center"
                  >
                    🔑 ĐĂNG NHẬP / ĐĂNG KÝ
                  </button>
                )}

                <div className="text-center pt-2">
                  <p className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">Hello Thanh Hóa © 2026</p>
                  <p className="text-[10px] text-slate-400/80 font-light mt-0.5">Cung cấp bởi Google AI Studio Build</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView + (selectedSpotId || '')}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.18 }}
            className="w-full h-full"
          >
            {currentView === 'home' && (
              <HomeView 
                onNavigate={handleNavigate} 
                savedSpotIds={savedSpotIds}
                onToggleSaveSpot={handleToggleSaveSpot}
              />
            )}

            {currentView === 'explore' && (
              <ExploreView 
                initialCategory={exploreCategory}
                initialQuery={exploreQuery}
                initialRegion={exploreRegion}
                initialDealsOnly={dealsOnly}
                onNavigate={handleNavigate} 
                savedSpotIds={savedSpotIds}
                onToggleSaveSpot={handleToggleSaveSpot}
              />
            )}

            {currentView === 'detail' && currentSpot && (
              <DetailView 
                spot={currentSpot}
                onBack={() => handleNavigate('explore')}
                onAddReview={handleAddReview}
                onNavigate={handleNavigate}
                savedSpotIds={savedSpotIds}
                onToggleSaveSpot={handleToggleSaveSpot}
              />
            )}

            {currentView === 'ai-planner' && (
              <AiPlannerView preselectedSpotId={selectedSpotId} />
            )}

            {currentView === 'partner' && (
              <PartnerPortal />
            )}

            {currentView === 'admin' && currentUserSession?.role === 'admin' && (
              <AdminDashboard />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Global Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={(user, msg) => {
          setCurrentUserSession(user);
          setShowAuthModal(false);
          triggerNotification(`👋 ${msg || 'Đăng nhập thành công!'}`);
          if (user.role === 'admin') {
            handleNavigate('admin');
          } else if (user.role === 'partner') {
            handleNavigate('partner');
          } else {
            handleNavigate('home');
          }
        }}
      />

      {/* Global Footer */}
      <footer className="bg-slate-900 text-slate-400 pt-12 pb-6 px-4 md:px-8 border-t border-slate-800 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                TH
              </div>
              <span className="font-extrabold text-base tracking-tight">Hello Thanh Hóa</span>
            </div>
            <p className="text-xs font-light leading-relaxed text-slate-400">
              Cổng thông tin du lịch thông minh, kết nối du khách với văn hóa truyền thống, thắng cảnh hùng vĩ và tinh hoa ẩm thực ẩm thực của vùng đất xứ Thanh hào hùng.
            </p>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Danh Mục Khám Phá</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><button onClick={() => handleNavigate('explore?cat=travel')} className="hover:text-white cursor-pointer transition-colors text-left">Địa danh Du lịch</button></li>
              <li><button onClick={() => handleNavigate('explore?cat=food')} className="hover:text-white cursor-pointer transition-colors text-left">Đặc sản Ẩm thực</button></li>
              <li><button onClick={() => handleNavigate('explore?cat=cafe')} className="hover:text-white cursor-pointer transition-colors text-left">Cà phê & Giải trí</button></li>
              <li><button onClick={() => handleNavigate('explore?cat=hotel')} className="hover:text-white cursor-pointer transition-colors text-left">Khách sạn & Resort</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Tính Năng Nổi Bật</h4>
            <ul className="space-y-2 text-xs font-light">
              <li><button onClick={() => handleNavigate('ai-planner')} className="hover:text-white cursor-pointer transition-colors text-left">Trợ lý Lộ trình AI</button></li>
              <li><button onClick={() => handleNavigate('ai-planner')} className="hover:text-white cursor-pointer transition-colors text-left">Virtual Tour Guide Chat</button></li>
              <li><button onClick={() => handleNavigate('partner')} className="hover:text-white cursor-pointer transition-colors text-left">Đăng ký Đối tác số</button></li>
              <li><button onClick={() => handleNavigate('partner')} className="hover:text-white cursor-pointer transition-colors text-left">Dữ liệu Thống kê</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">Văn Phòng Đăng Ký</h4>
            <p className="text-xs font-light leading-relaxed text-slate-400">
              📍 Số 25 Đại lộ Lê Lợi, P. Điện Biên, TP. Thanh Hóa, Việt Nam<br />
              📞 Hotline hỗ trợ: (0237) 3822 555<br />
              ✉️ Email: lienhe@hellothanhhoa.vn
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-slate-500 font-medium">
          <p>© 2026 Hello Thanh Hóa Smart Portal. Tất cả các quyền được bảo lưu.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">Điều khoản sử dụng</a>
            <a href="#" className="hover:text-slate-400">Chính sách bảo mật</a>
          </div>
        </div>
      </footer>

      {/* Favorites Modal */}
      <AnimatePresence>
        {showFavoritesModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFavoritesModal(false)}
              className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-50 flex items-center justify-center p-4"
            />
            
            {/* Modal Box */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', duration: 0.3 }}
              className="fixed inset-x-4 bottom-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 max-w-lg w-full bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-50 flex flex-col max-h-[80vh]"
            >
              {/* Header */}
              <div className="px-6 py-4.5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-rose-50 rounded-xl text-rose-500">
                    <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-900">Địa điểm đã lưu ({spotsData.filter(spot => savedSpotIds.includes(spot.id)).length})</h3>
                    <p className="text-[10px] text-slate-400 font-medium">Danh sách yêu thích của bạn</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowFavoritesModal(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 cursor-pointer transition-colors"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {spotsData.filter(spot => savedSpotIds.includes(spot.id)).length > 0 ? (
                  spotsData.filter(spot => savedSpotIds.includes(spot.id)).map(spot => (
                    <div 
                      key={spot.id}
                      className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 hover:border-blue-100 hover:bg-slate-50/30 transition-all group relative"
                    >
                      {/* Image */}
                      <img 
                        src={spot.image} 
                        alt={spot.name} 
                        className="w-16 h-16 rounded-xl object-cover border border-slate-100 flex-shrink-0"
                      />
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <span className="text-[9px] font-extrabold text-blue-600 bg-blue-50 px-1.5 py-0.25 rounded">
                            {spot.subCategory}
                          </span>
                          <h4 className="text-xs font-extrabold text-slate-800 truncate mt-1 group-hover:text-blue-600 transition-colors">
                            {spot.name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-light flex items-center gap-0.5 mt-0.5">
                            <MapPin className="w-3 h-3 text-slate-300" /> {spot.district}
                          </p>
                        </div>

                        <div className="flex items-center justify-between mt-2">
                          <span className="flex items-center gap-0.5 text-[10px] text-amber-500 font-bold">
                            ★ <span className="text-slate-700">{spot.rating}</span>
                          </span>
                          
                          <button
                            onClick={() => {
                              setShowFavoritesModal(false);
                              handleNavigate('detail', spot.id);
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-extrabold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                          >
                            Khám phá <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Remove action */}
                      <button
                        onClick={() => handleToggleSaveSpot(spot.id)}
                        className="p-1.5 rounded-lg text-slate-300 hover:text-rose-500 hover:bg-rose-50 transition-colors cursor-pointer absolute top-3 right-3"
                        title="Xóa khỏi yêu thích"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-4 border border-rose-100">
                      <Heart className="w-8 h-8 text-rose-400" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-800">Chưa lưu địa điểm nào</h4>
                    <p className="text-[11px] text-slate-400 font-light mt-1 max-w-xs mx-auto leading-relaxed">
                      Lưu lại những khách sạn, đặc sản, danh lam thắng cảnh xứ Thanh để lên lịch trình dễ dàng hơn!
                    </p>
                    <button
                      onClick={() => {
                        setShowFavoritesModal(false);
                        handleNavigate('explore');
                      }}
                      className="mt-5 inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md transition-all cursor-pointer"
                    >
                      <Compass className="w-4 h-4" /> Khám phá địa danh ngay
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              {spotsData.filter(spot => savedSpotIds.includes(spot.id)).length > 0 && (
                <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Lên lịch tự động?</span>
                  <button
                    onClick={() => {
                      setShowFavoritesModal(false);
                      handleNavigate('ai-planner');
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 font-extrabold hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Lên lịch trình AI
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
