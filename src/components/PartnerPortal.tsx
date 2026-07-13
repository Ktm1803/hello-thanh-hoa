import React, { useState, useEffect } from 'react';
import { Building, TrendingUp, BookOpen, CheckCircle, Eye, MessageSquare, Award, Plus, ArrowRight, Upload, Facebook, Edit, Trash2, X, AlertTriangle, Bell, BellRing, Check } from 'lucide-react';
import { Spot, Article } from '../data';
import { getArticles, saveArticle, deleteArticle, saveUser, getCurrentUser, UserAccount, addNotification, getNotificationsForUser, markNotificationAsRead, markAllNotificationsAsRead, removeNotification, AppNotification, optimizeHighQualityImage } from '../utils/db';
import ScrollReveal from './ScrollReveal';

export default function PartnerPortal() {
  const curUser = getCurrentUser();
  const authorName = curUser ? (curUser.businessName || curUser.name) : '';

  // Notification states
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);

  const loadNotifications = () => {
    if (curUser?.email) {
      setNotifications(getNotificationsForUser(curUser.email));
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(() => {
      loadNotifications();
    }, 4000);
    return () => clearInterval(interval);
  }, [curUser]);

  const handleMarkAsRead = (id: string) => {
    markNotificationAsRead(id);
    loadNotifications();
  };

  const handleMarkAllAsRead = () => {
    if (curUser?.email) {
      markAllNotificationsAsRead(curUser.email);
      loadNotifications();
    }
  };

  const handleRemoveNotif = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeNotification(id);
    loadNotifications();
  };

  // Tabs: register, articles, analytics
  const [activeTab, setActiveTab] = useState<'register' | 'articles' | 'analytics'>('register');

  // Register Form State
  const [regName, setRegName] = useState('');
  const [regCategory, setRegCategory] = useState('travel');
  const [regAddress, setRegAddress] = useState('');
  const [regDistrict, setRegDistrict] = useState('Thành phố Thanh Hóa');
  const [regDesc, setRegDesc] = useState('');
  const [regContact, setRegContact] = useState('');
  const [regFacebookLink, setRegFacebookLink] = useState('');
  const [regMapLink, setRegMapLink] = useState('');
  const [regImage, setRegImage] = useState('');
  const [regSubmitted, setRegSubmitted] = useState(false);

  // SEO Article State
  const [artTitle, setArtTitle] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState('Kinh nghiệm du lịch');
  const [artImage, setArtImage] = useState('');
  const [artFacebookLink, setArtFacebookLink] = useState('');
  const [artSubmitted, setArtSubmitted] = useState(false);

  // Edit & Delete States
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Hover states for custom SVG charts
  const [hoveredDayIdx, setHoveredDayIdx] = useState<number | null>(null);
  const [hoveredCatIdx, setHoveredCatIdx] = useState<number | null>(null);

  // Populate form when editing an article
  useEffect(() => {
    if (editingArticle) {
      setArtTitle(editingArticle.title);
      setArtContent(editingArticle.content);
      setArtCategory(editingArticle.category);
      setArtImage(editingArticle.image || '');
      setArtFacebookLink(editingArticle.facebookLink || '');
      setErrorMessage('');
    } else {
      setArtTitle('');
      setArtContent('');
      setArtCategory('Kinh nghiệm du lịch');
      setArtImage('');
      setArtFacebookLink('');
      setErrorMessage('');
    }
  }, [editingArticle]);

  // Helper for image file uploading (Converts File to Base64 with high-quality compression)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      optimizeHighQualityImage(file, callback);
    }
  };
  const [articlesList, setArticlesList] = useState<any[]>([]);

  useEffect(() => {
    const allArticles = getArticles();
    const curUser = getCurrentUser();
    if (curUser) {
      const authorName = curUser.businessName || curUser.name;
      // Show only articles written by this business, or show all if none
      const myArticles = allArticles.filter(art => art.author === authorName);
      setArticlesList(myArticles.length > 0 ? myArticles : allArticles);
    } else {
      setArticlesList(allArticles);
    }
  }, []);

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regAddress.trim() || !regDesc.trim()) return;

    // Build the user account with a formatted contact email and approved set to false for review
    const userEmail = regContact.includes('@') ? regContact : `${regContact.replace(/[^a-zA-Z0-9]/g, '') || Date.now()}@business.com`;
    const pendingAccount: UserAccount = {
      email: userEmail,
      name: regName,
      role: 'partner',
      password: '123',
      businessName: regName,
      businessCategory: regCategory,
      businessAddress: regAddress,
      businessDistrict: regDistrict,
      businessDesc: regDesc,
      businessMapLink: regMapLink,
      avatar: regImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80',
      active: true,
      approved: false
    };

    saveUser(pendingAccount);
    setRegSubmitted(true);

    setTimeout(() => {
      // Reset form fields
      setRegName('');
      setRegAddress('');
      setRegDesc('');
      setRegContact('');
      setRegFacebookLink('');
      setRegMapLink('');
      setRegImage('');
    }, 4000);
  };

  const handleArticleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle.trim() || !artContent.trim()) return;

    const curUser = getCurrentUser();
    const authorName = curUser ? (curUser.businessName || curUser.name) : 'Doanh nghiệp ẩn danh';

    if (editingArticle) {
      if (editingArticle.author !== authorName) {
        setErrorMessage('Bạn không có quyền chỉnh sửa bài viết của doanh nghiệp khác!');
        return;
      }

      const updatedArt: Article = {
        ...editingArticle,
        title: artTitle,
        summary: artContent.slice(0, 150) + '...',
        content: artContent,
        category: artCategory,
        image: artImage || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&h=400&q=80',
        readTime: `${Math.max(1, Math.ceil(artContent.split(/\s+/).length / 200))} phút đọc`,
        facebookLink: artFacebookLink,
        approved: false, // Set back to pending review after being edited
        authorEmail: curUser?.email || editingArticle.authorEmail
      };

      saveArticle(updatedArt);

      if (curUser?.email) {
        addNotification({
          recipientEmail: curUser.email,
          title: 'Bài viết đã được cập nhật 📝',
          message: `Bài viết "${artTitle}" đã được lưu thay đổi thành công và đang chờ ban quản lý phê duyệt lại.`,
          type: 'info',
          articleId: updatedArt.id,
          articleTitle: artTitle
        });
        loadNotifications();
      }

      // Refresh display list
      setArticlesList(prev => prev.map(a => a.id === updatedArt.id ? updatedArt : a));
      setEditingArticle(null);
      setArtSubmitted(true);
      setTimeout(() => {
        setArtSubmitted(false);
      }, 4000);
    } else {
      const newArt: Article = {
        id: 'art-' + Date.now(),
        title: artTitle,
        summary: artContent.slice(0, 150) + '...',
        content: artContent,
        category: artCategory,
        image: artImage || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&h=400&q=80',
        date: new Date().toISOString().split('T')[0],
        author: authorName,
        readTime: `${Math.max(1, Math.ceil(artContent.split(/\s+/).length / 200))} phút đọc`,
        facebookLink: artFacebookLink,
        approved: false, // Pending admin review
        authorEmail: curUser?.email
      };

      saveArticle(newArt);

      if (curUser?.email) {
        addNotification({
          recipientEmail: curUser.email,
          title: 'Đăng bài viết mới thành công 🚀',
          message: `Bài viết mới "${artTitle}" của bạn đã được gửi lên hệ thống và đang chờ kiểm duyệt.`,
          type: 'info',
          articleId: newArt.id,
          articleTitle: artTitle
        });
        loadNotifications();
      }

      // Refresh display list
      setArticlesList(prev => [newArt, ...prev]);

      setArtTitle('');
      setArtContent('');
      setArtImage('');
      setArtFacebookLink('');
      setArtSubmitted(true);
      setTimeout(() => {
        setArtSubmitted(false);
      }, 4000);
    }
  };

  // Recharts Chart Mock Data
  const analyticsData = [
    { name: 'T2', 'Lượt truy cập': 1200, 'Lượt Check-in': 340, 'Độ hài lòng (%)': 95 },
    { name: 'T3', 'Lượt truy cập': 1400, 'Lượt Check-in': 450, 'Độ hài lòng (%)': 97 },
    { name: 'T4', 'Lượt truy cập': 1800, 'Lượt Check-in': 560, 'Độ hài lòng (%)': 98 },
    { name: 'T5', 'Lượt truy cập': 1600, 'Lượt Check-in': 480, 'Độ hài lòng (%)': 96 },
    { name: 'T6', 'Lượt truy cập': 2400, 'Lượt Check-in': 780, 'Độ hài lòng (%)': 99 },
    { name: 'T7', 'Lượt truy cập': 4100, 'Lượt Check-in': 1560, 'Độ hài lòng (%)': 99 },
    { name: 'CN', 'Lượt truy cập': 4800, 'Lượt Check-in': 1920, 'Độ hài lòng (%)': 100 },
  ];

  const categoryPopularity = [
    { name: 'Du lịch', 'Mức độ quan tâm': 4200 },
    { name: 'Ẩm thực', 'Mức độ quan tâm': 3500 },
    { name: 'Khách sạn', 'Mức độ quan tâm': 2900 },
    { name: 'Cà phê', 'Mức độ quan tâm': 2100 },
    { name: 'Mua sắm', 'Mức độ quan tâm': 1100 },
    { name: 'Giáo dục', 'Mức độ quan tâm': 800 },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="w-full relative">
      {/* Portal Hero Banner */}
      <section className="bg-slate-900 text-white rounded-2xl p-6 md:p-8 mb-8 relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-slate-900 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/20 text-[10px] font-bold uppercase">
              🚀 Dành cho Đối tác & Doanh nghiệp xứ Thanh
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold tracking-tight">Kênh Quảng Bá & Đồng Hành Chuyển Đổi Số</h1>
            <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
              Đăng ký địa điểm kinh doanh miễn phí, tiếp thị nội dung bài viết chuẩn SEO và phân tích dữ liệu quan tâm của du khách trên hệ thống Hello Thanh Hóa.
            </p>
          </div>

          {/* Dynamic Bell Notification Center */}
          {curUser && (
            <div className="relative shrink-0 flex items-center gap-3">
              <button
                onClick={() => setShowNotifPanel(!showNotifPanel)}
                className="relative p-3 bg-white/10 hover:bg-white/20 active:bg-white/30 rounded-xl transition-all cursor-pointer group border border-white/10 flex items-center justify-center h-11 w-11"
                title="Hộp thư thông báo trạng thái bài viết"
              >
                {unreadCount > 0 ? (
                  <>
                    <BellRing className="w-5 h-5 text-amber-400 animate-bounce" />
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                      {unreadCount}
                    </span>
                  </>
                ) : (
                  <Bell className="w-5 h-5 text-slate-300 group-hover:text-white transition-colors" />
                )}
              </button>
              
              <div className="text-left hidden sm:block">
                <p className="text-[10px] font-extrabold text-blue-300 uppercase tracking-wider">Doanh nghiệp</p>
                <p className="text-xs font-bold text-white truncate max-w-[180px]">{curUser.businessName || curUser.name}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Floating Notifications Card Overlay */}
      {showNotifPanel && curUser && (
        <div className="absolute right-0 top-32 w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-2xl overflow-hidden z-50 animate-fade-in divide-y divide-slate-100">
          {/* Header */}
          <div className="p-4 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Thông báo trạng thái duyệt</h3>
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-700 font-extrabold text-[9px] px-2 py-0.5 rounded-full">
                  {unreadCount} mới
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-[10px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer flex items-center gap-0.5 hover:underline"
                >
                  <Check className="w-3 h-3" /> Đã đọc hết
                </button>
              )}
              <button
                onClick={() => setShowNotifPanel(false)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-full cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-1">
                <Bell className="w-8 h-8 mx-auto text-slate-300 stroke-1 mb-1" />
                <p className="text-xs font-semibold">Không có thông báo mới</p>
                <p className="text-[10px] text-slate-400 font-light leading-relaxed">Trạng thái duyệt bài viết từ ban quản trị sẽ được cập nhật trực tiếp tại đây.</p>
              </div>
            ) : (
              notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => {
                    if (!notif.read) handleMarkAsRead(notif.id);
                  }}
                  className={`p-3.5 text-left transition-colors cursor-pointer relative group flex gap-3 ${
                    notif.read ? 'bg-white hover:bg-slate-50/50' : 'bg-blue-50/30 hover:bg-blue-50/50'
                  }`}
                >
                  {/* Status Dot */}
                  {!notif.read && (
                    <span className="absolute left-2.5 top-5 w-1.5 h-1.5 bg-blue-600 rounded-full"></span>
                  )}

                  {/* Icon */}
                  <div className="shrink-0 mt-0.5 ml-2.5">
                    {notif.type === 'success' ? (
                      <div className="w-6.5 h-6.5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">
                        ✓
                      </div>
                    ) : notif.type === 'warning' ? (
                      <div className="w-6.5 h-6.5 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 text-xs font-bold">
                        !
                      </div>
                    ) : (
                      <div className="w-6.5 h-6.5 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                        i
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs font-bold truncate ${notif.read ? 'text-slate-700' : 'text-slate-900'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[8px] text-slate-400 shrink-0 font-light font-mono">
                        {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}{' '}
                        {new Date(notif.createdAt).toLocaleDateString([], { month: 'numeric', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-light leading-relaxed">
                      {notif.message}
                    </p>
                    {notif.articleTitle && (
                      <div className="inline-flex items-center gap-1 mt-1 text-[9px] text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded">
                        <BookOpen className="w-2.5 h-2.5" /> {notif.articleTitle}
                      </div>
                    )}
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={(e) => handleRemoveNotif(notif.id, e)}
                    className="opacity-0 group-hover:opacity-100 absolute right-2 bottom-2 p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-all cursor-pointer"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
          
          {/* Footer */}
          <div className="p-2.5 bg-slate-50 text-center">
            <p className="text-[9px] text-slate-400 font-medium">Hệ thống thông báo đồng bộ hóa tự động</p>
          </div>
        </div>
      )}

      {/* Tabs bar */}
      <div className="flex border-b border-slate-200 mb-8 gap-6 text-sm font-bold">
        <button
          onClick={() => { setActiveTab('register'); setRegSubmitted(false); }}
          className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'register' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <Building className="w-4 h-4" /> Đăng ký địa điểm kinh doanh
        </button>
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'articles' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Viết bài tiếp thị SEO
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 relative cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'analytics' ? 'text-blue-600 font-extrabold' : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          <TrendingUp className="w-4 h-4" /> Số liệu thống kê du khách
        </button>
      </div>

      {/* Tab Area content */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6">
        {activeTab === 'register' ? (
          /* Merchant Registration View */
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-5">
              <h2 className="font-extrabold text-slate-800 text-base mb-1">Cung cấp thông tin địa điểm của bạn</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Vui lòng điền chi tiết biểu mẫu sau. Ban quản lý Sở Du lịch sẽ thẩm định, xác thực thông tin và kích hoạt bài đăng địa điểm trên cổng thông tin Hello Thanh Hóa trong vòng 24 giờ làm việc.
              </p>

              {regSubmitted ? (
                <div className="bg-emerald-50 border border-emerald-100/60 rounded-xl p-6 text-center space-y-3.5">
                  <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white mx-auto shadow-sm">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Gửi hồ sơ đăng ký thành công!</h4>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      Mã hồ sơ: <strong className="text-blue-600 font-mono">HTH-2026-{(Math.floor(Math.random() * 90000) + 10000)}</strong>. Ban quản lý đang thực hiện quy trình đối soát thực tế. Chúng tôi sẽ gửi thông báo xác nhận qua Email/SMS của doanh nghiệp.
                    </p>
                  </div>
                  <button 
                    onClick={() => setRegSubmitted(false)}
                    className="text-xs font-semibold text-blue-600 hover:underline cursor-pointer"
                  >
                    Gửi thêm địa điểm khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Tên địa điểm / Cơ sở kinh doanh *</label>
                      <input 
                        type="text" 
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        placeholder="Ví dụ: Khách Sạn Sầm Sơn Star..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Danh mục hoạt động *</label>
                      <select 
                        value={regCategory}
                        onChange={(e) => setRegCategory(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option value="travel">Du lịch / Thắng cảnh</option>
                        <option value="food">Ẩm thực / Nhà hàng</option>
                        <option value="cafe">Cà phê / Giải trí</option>
                        <option value="hotel">Khách sạn / Lưu trú</option>
                        <option value="shopping">Mua sắm / Quà tặng</option>
                        <option value="education">Giáo dục / Trường học</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Địa chỉ cụ thể *</label>
                      <input 
                        type="text" 
                        required
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        placeholder="Số nhà, tên đường..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Khu vực quận / huyện *</label>
                      <select 
                        value={regDistrict}
                        onChange={(e) => setRegDistrict(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
                      >
                        <option value="Thành phố Thanh Hóa">Thành phố Thanh Hóa</option>
                        <option value="Thành phố Sầm Sơn">Thành phố Sầm Sơn</option>
                        <option value="Thị xã Bỉm Sơn">Thị xã Bỉm Sơn</option>
                        <option value="Thị xã Nghi Sơn">Thị xã Nghi Sơn</option>
                        <option value="Huyện Bá Thước">Huyện Bá Thước</option>
                        <option value="Huyện Cẩm Thủy">Huyện Cẩm Thủy</option>
                        <option value="Huyện Đông Sơn">Huyện Đông Sơn</option>
                        <option value="Huyện Hà Trung">Huyện Hà Trung</option>
                        <option value="Huyện Hậu Lộc">Huyện Hậu Lộc</option>
                        <option value="Huyện Hoằng Hóa">Huyện Hoằng Hóa</option>
                        <option value="Huyện Lang Chánh">Huyện Lang Chánh</option>
                        <option value="Huyện Mường Lát">Huyện Mường Lát</option>
                        <option value="Huyện Nga Sơn">Huyện Nga Sơn</option>
                        <option value="Huyện Ngọc Lặc">Huyện Ngọc Lặc</option>
                        <option value="Huyện Như Thanh">Huyện Như Thanh</option>
                        <option value="Huyện Như Xuân">Huyện Như Xuân</option>
                        <option value="Huyện Nông Cống">Huyện Nông Cống</option>
                        <option value="Huyện Quan Hóa">Huyện Quan Hóa</option>
                        <option value="Huyện Quan Sơn">Huyện Quan Sơn</option>
                        <option value="Huyện Quảng Xương">Huyện Quảng Xương</option>
                        <option value="Huyện Thạch Thành">Huyện Thạch Thành</option>
                        <option value="Huyện Thiệu Hóa">Huyện Thiệu Hóa</option>
                        <option value="Huyện Thọ Xuân">Huyện Thọ Xuân</option>
                        <option value="Huyện Thường Xuân">Huyện Thường Xuân</option>
                        <option value="Huyện Triệu Sơn">Huyện Triệu Sơn</option>
                        <option value="Huyện Vĩnh Lộc">Huyện Vĩnh Lộc</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Số điện thoại liên hệ *</label>
                      <input 
                        type="text" 
                        required
                        value={regContact}
                        onChange={(e) => setRegContact(e.target.value)}
                        placeholder="Số Hotline hỗ trợ..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-500 mb-1">Trang Facebook liên hệ (Không bắt buộc)</label>
                      <input 
                        type="url" 
                        value={regFacebookLink}
                        onChange={(e) => setRegFacebookLink(e.target.value)}
                        placeholder="https://facebook.com/trang-cua-ban..." 
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Liên kết Bản đồ chỉ đường Google Maps (Không bắt buộc)</label>
                    <input 
                      type="url" 
                      value={regMapLink}
                      onChange={(e) => setRegMapLink(e.target.value)}
                      placeholder="https://maps.app.goo.gl/... hoặc https://google.com/maps/..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <div className="border border-slate-200 border-dashed rounded-xl p-4 bg-slate-50/50 space-y-3">
                    <span className="block text-[11px] font-bold text-slate-500">Hình ảnh Đại diện cơ sở (Tải ảnh hoặc dán link) *</span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Upload Box */}
                      <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors relative group min-h-[100px]">
                        <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                        <p className="text-[10px] font-bold text-slate-600">Tải ảnh lên từ thiết bị</p>
                        <p className="text-[8px] text-slate-400">Ảnh chất lượng cao, tối đa 15MB</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={e => handleImageFileChange(e, setRegImage)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                      </div>

                      {/* URL Paste & Preview */}
                      <div className="space-y-2 flex flex-col justify-between">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Hoặc nhập liên kết ảnh trực tiếp</label>
                          <input
                            type="url"
                            placeholder="https://images.unsplash.com/..."
                            value={regImage}
                            onChange={e => setRegImage(e.target.value)}
                            className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        
                        {regImage && (
                          <div className="flex items-center gap-2.5 bg-white p-1.5 border border-slate-150 rounded-lg">
                            <img src={regImage} alt="Preview" className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-[9px] font-bold text-slate-700 truncate">Ảnh đã nạp</p>
                              <button
                                type="button"
                                onClick={() => setRegImage('')}
                                className="text-[9px] text-rose-500 hover:underline cursor-pointer font-bold"
                              >
                                Xóa ảnh
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Mô tả ngắn & Điểm đặc sắc nổi bật *</label>
                    <textarea 
                      required
                      rows={4}
                      value={regDesc}
                      onChange={(e) => setRegDesc(e.target.value)}
                      placeholder="Giới thiệu không gian phục vụ, các dịch vụ nổi trội, chính sách đặc biệt hấp dẫn..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>

                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors">
                    Nộp hồ sơ thẩm duyệt
                  </button>
                </form>
              )}
            </div>

            {/* Registration Benefits sidebar */}
            <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Quyền lợi khi tham gia</h3>
              
              <div className="space-y-4 text-xs font-semibold text-slate-600">
                <div className="flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 shrink-0">
                    <Award className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Xác nhận Huy hiệu Chính chủ</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-light">Tăng độ uy tín, hiển thị đầu kết quả khi du khách tìm kiếm địa danh.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 shrink-0">
                    <Plus className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Đăng tin ưu đãi, khuyến mãi</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-light">Tự do đăng tải các mã voucher giảm giá đặc sản thúc đẩy hành vi khách mua.</p>
                  </div>
                </div>

                <div className="flex gap-2.5 items-start">
                  <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-600 shrink-0">
                    <TrendingUp className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-800">Phân tích khách hàng thông minh</h5>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed font-light">Truy cập biểu đồ lượng quan tâm, phân tích nhân khẩu học thông minh.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        ) : activeTab === 'articles' ? (
          /* Marketing Hub articles */
          <ScrollReveal>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
            <div className="lg:col-span-3 space-y-6">
              <h2 className="font-extrabold text-slate-800 text-base mb-1">
                {editingArticle ? `Đang chỉnh sửa bài viết: ${editingArticle.title}` : "Tạo bài viết chuẩn SEO giới thiệu xứ Thanh"}
              </h2>
              
              {/* Recent Notifications Quick Banner inside articles tab */}
              {curUser && notifications.filter(n => !n.read).length > 0 && (
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 space-y-2.5 animate-fade-in text-left">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800">
                      <BellRing className="w-4 h-4 text-blue-600 animate-pulse" /> Thông báo trạng thái duyệt bài mới nhận
                    </span>
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-[10px] font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      Đánh dấu đã đọc tất cả
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {notifications.filter(n => !n.read).map(notif => (
                      <div key={notif.id} className="flex items-start justify-between gap-4 text-[11px] text-slate-600 bg-white p-2.5 rounded border border-slate-100/60 shadow-2xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full inline-block"></span>
                            {notif.title}
                          </p>
                          <p className="font-light text-slate-500 leading-relaxed">{notif.message}</p>
                        </div>
                        <button
                          onClick={() => handleMarkAsRead(notif.id)}
                          className="text-[10px] text-blue-600 hover:text-blue-700 font-extrabold cursor-pointer shrink-0 border border-blue-100 px-2 py-0.5 rounded bg-blue-50/50 hover:bg-blue-50"
                        >
                          Đã đọc
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {artSubmitted && (
                <div className="bg-emerald-50 border border-emerald-100/60 rounded-xl p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2 animate-fade-in">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>🎉 Đăng/Cập nhật bài viết tiếp thị SEO thành công! Bài viết đang chờ quản trị viên phê duyệt.</span>
                </div>
              )}

              {errorMessage && (
                <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 text-xs font-semibold text-rose-800 flex items-center gap-2 animate-fade-in">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                  <button type="button" onClick={() => setErrorMessage('')} className="ml-auto text-rose-400 hover:text-rose-600 cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <form onSubmit={handleArticleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Tiêu đề bài viết SEO *</label>
                    <input 
                      type="text" 
                      required
                      value={artTitle}
                      onChange={(e) => setArtTitle(e.target.value)}
                      placeholder="Nhập tiêu đề thu hút người đọc..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Phân loại cẩm nang *</label>
                    <select 
                      value={artCategory}
                      onChange={(e) => setArtCategory(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-500 focus:bg-white"
                    >
                      <option value="Kinh nghiệm du lịch">Kinh nghiệm du lịch</option>
                      <option value="Cẩm nang phượt">Cẩm nang phượt</option>
                      <option value="Di tích lịch sử">Di tích lịch sử</option>
                      <option value="Địa điểm ẩm thực">Địa điểm ẩm thực</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">Liên kết Facebook tác giả / cơ sở</label>
                    <input 
                      type="url" 
                      value={artFacebookLink}
                      onChange={(e) => setArtFacebookLink(e.target.value)}
                      placeholder="https://facebook.com/ca-nhan-hoac-trang..." 
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="border border-slate-200 border-dashed rounded-xl p-4 bg-slate-50/50 space-y-3">
                  <span className="block text-[11px] font-bold text-slate-500">Hình nền bài đăng cẩm nang (Tải ảnh hoặc dán link) *</span>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Upload Box */}
                    <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-white hover:bg-slate-50 transition-colors relative group min-h-[100px]">
                      <Upload className="w-5 h-5 text-slate-400 mb-1 group-hover:text-blue-500 transition-colors" />
                      <p className="text-[10px] font-bold text-slate-600">Tải ảnh bài viết lên</p>
                      <p className="text-[8px] text-slate-400">Ảnh chất lượng cao, tối đa 15MB</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleImageFileChange(e, setArtImage)}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>

                    {/* URL Paste & Preview */}
                    <div className="space-y-2 flex flex-col justify-between">
                      <div>
                        <label className="block text-[9px] font-bold text-slate-400 uppercase mb-0.5">Hoặc nhập liên kết ảnh trực tiếp</label>
                        <input
                          type="url"
                          placeholder="https://images.unsplash.com/..."
                          value={artImage}
                          onChange={e => setArtImage(e.target.value)}
                          className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      
                      {artImage && (
                        <div className="flex items-center gap-2.5 bg-white p-1.5 border border-slate-150 rounded-lg">
                          <img src={artImage} alt="Preview" className="w-9 h-9 rounded object-cover border border-slate-200 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[9px] font-bold text-slate-700 truncate">Ảnh đã nạp</p>
                            <button
                              type="button"
                              onClick={() => setArtImage('')}
                              className="text-[9px] text-rose-500 hover:underline cursor-pointer font-bold"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 mb-1">Nội dung bài viết tiếp thị (hỗ trợ văn bản thường hoặc Markdown) *</label>
                  <textarea 
                    required
                    rows={8}
                    value={artContent}
                    onChange={(e) => setArtContent(e.target.value)}
                    placeholder="Hãy mô tả hành trình trải nghiệm thực tế chi tiết, kèm các địa điểm đề xuất để thu hút lượt tìm kiếm Google của du khách..." 
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 focus:bg-white"
                  />
                </div>

                {editingArticle ? (
                  <div className="flex gap-3">
                    <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors">
                      Cập nhật bài viết
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingArticle(null)}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors"
                    >
                      Hủy sửa đổi
                    </button>
                  </div>
                ) : (
                  <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-6 py-3 rounded-lg cursor-pointer transition-colors">
                    Xuất bản bài viết tiếp thị
                  </button>
                )}
              </form>
            </div>

            {/* Published articles list */}
            <div className="lg:col-span-2 bg-slate-50 rounded-xl p-5 border border-slate-100 space-y-4">
              <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider mb-2">Bài viết đang tiếp thị nổi bật</h3>
              
              <div className="space-y-3.5">
                {articlesList.map(art => (
                  <div key={art.id} className="p-3 bg-white rounded-lg border border-slate-100 shadow-2xs space-y-1.5 relative group/card">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase">{art.cat || art.category}</span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-400 font-light">{art.date}</span>
                        {art.author === authorName && (
                          <div className="flex items-center gap-1 opacity-60 group-hover/card:opacity-100 transition-opacity ml-1">
                            <button
                              onClick={() => setEditingArticle(art)}
                              className="p-1 hover:bg-blue-50 rounded text-blue-600 cursor-pointer"
                              title="Sửa bài viết"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(art.id)}
                              className="p-1 hover:bg-rose-50 rounded text-rose-600 cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                    <h4 className="font-bold text-slate-800 text-xs line-clamp-1 hover:text-blue-600 cursor-pointer transition-colors">{art.title}</h4>
                    <p className="text-[9px] text-slate-400 font-medium">Tác giả: <span className={art.author === authorName ? "text-blue-600 font-semibold" : ""}>{art.author}</span></p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-50 font-light">
                      <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {art.views || 0} lượt xem</span>
                      {art.approved === false ? (
                        <span className="text-amber-600 font-bold">● CHỜ DUYỆT</span>
                      ) : (
                        <span className="text-emerald-600 font-bold">● HOẠT ĐỘNG</span>
                      )}
                    </div>

                    {confirmDeleteId === art.id && (
                      <div className="absolute inset-0 bg-white/95 backdrop-blur-xs rounded-lg flex flex-col justify-center items-center p-2 z-10 border border-rose-100">
                        <p className="text-[10px] font-bold text-slate-700 text-center mb-1.5">Bạn có chắc muốn xóa bài viết này?</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              deleteArticle(art.id);
                              setArticlesList(prev => prev.filter(a => a.id !== art.id));
                              if (editingArticle?.id === art.id) {
                                setEditingArticle(null);
                              }
                              setConfirmDeleteId(null);
                            }}
                            className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Xác nhận xóa
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-bold transition-colors cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>
        ) : (
          /* Business Analytics Views using beautiful Recharts components */
          <ScrollReveal>
            <div className="space-y-8">
            <div>
              <h2 className="font-extrabold text-slate-800 text-base mb-1">Phân Tích Dữ Liệu Du Khách & Người Tiêu Dùng</h2>
              <p className="text-xs text-slate-400 leading-relaxed font-light">
                Biểu đồ đo lường dựa trên hàng ngàn lượt tương tác của du khách tìm kiếm, tham khảo, bình luận và check-in trên hệ thống Hello Thanh Hóa.
              </p>
            </div>

            {/* Counters Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl border border-slate-100 bg-blue-50/20 text-blue-600 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Tổng lượt tương tác tuần này</span>
                <p className="text-2xl font-black text-slate-800">16,900 <span className="text-xs font-bold text-emerald-600">(+18.2%)</span></p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-rose-50/20 text-rose-600 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Tỷ lệ đặt phòng/mua hàng thành công</span>
                <p className="text-2xl font-black text-slate-800">12.5% <span className="text-xs font-bold text-emerald-600">(+1.5%)</span></p>
              </div>
              <div className="p-4 rounded-xl border border-slate-100 bg-amber-50/20 text-amber-600 space-y-1">
                <span className="text-xs text-slate-500 font-semibold">Điểm số trung bình trải nghiệm</span>
                <p className="text-2xl font-black text-slate-800">4.82 ★ <span className="text-xs font-bold text-emerald-600">(Đứng đầu vùng)</span></p>
              </div>
            </div>

            {/* Charts render inside a grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
              {/* Daily visit metrics */}
              {(() => {
                const paddingLeft = 45;
                const plotWidth = 440;
                const plotHeight = 160;
                const bottomY = 185;

                const accessPoints = analyticsData.map((d, i) => {
                  const x = paddingLeft + (i / 6) * plotWidth;
                  const y = bottomY - (d['Lượt truy cập'] / 5000) * plotHeight;
                  return { x, y };
                });

                const checkinPoints = analyticsData.map((d, i) => {
                  const x = paddingLeft + (i / 6) * plotWidth;
                  const y = bottomY - (d['Lượt Check-in'] / 5000) * plotHeight;
                  return { x, y };
                });

                const accessLinePath = accessPoints.length > 0 
                  ? `M ${accessPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
                  : '';

                const accessAreaPath = accessPoints.length > 0
                  ? `M ${accessPoints[0].x} ${bottomY} L ${accessPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${accessPoints[accessPoints.length - 1].x} ${bottomY} Z`
                  : '';

                const checkinLinePath = checkinPoints.length > 0
                  ? `M ${checkinPoints.map(p => `${p.x} ${p.y}`).join(' L ')}`
                  : '';

                const checkinAreaPath = checkinPoints.length > 0
                  ? `M ${checkinPoints[0].x} ${bottomY} L ${checkinPoints.map(p => `${p.x} ${p.y}`).join(' L ')} L ${checkinPoints[checkinPoints.length - 1].x} ${bottomY} Z`
                  : '';

                return (
                  <div className="space-y-4">
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-center">Tương tác của du khách theo ngày</h3>
                    <div className="w-full h-64 bg-white p-3 rounded-xl border border-slate-100/80 shadow-2xs relative">
                      <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                        <defs>
                          <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#2563eb" stopOpacity={0.01}/>
                          </linearGradient>
                          <linearGradient id="colorCheckins" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.01}/>
                          </linearGradient>
                        </defs>

                        {/* Grid Lines */}
                        {[0, 1000, 2000, 3000, 4000, 5000].map((val) => {
                          const y = 185 - (val / 5000) * 160;
                          return (
                            <g key={val}>
                              <line x1="45" y1={y} x2="485" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                              <text x="35" y={y + 3} textAnchor="end" className="fill-slate-400 font-bold text-[9px] font-mono">{val.toLocaleString()}</text>
                            </g>
                          );
                        })}

                        {/* Area Paths */}
                        <path d={accessAreaPath} fill="url(#colorVisits)" pointerEvents="none" />
                        <path d={checkinAreaPath} fill="url(#colorCheckins)" pointerEvents="none" />

                        {/* Line Paths */}
                        <path d={accessLinePath} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />
                        <path d={checkinLinePath} fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" pointerEvents="none" />

                        {/* Axis Lines */}
                        <line x1="45" y1="185" x2="485" y2="185" stroke="#e2e8f0" strokeWidth="1" />

                        {/* X-Axis Labels */}
                        {analyticsData.map((d, i) => {
                          const x = 45 + (i / 6) * 440;
                          return (
                            <text key={i} x={x} y="202" textAnchor="middle" className="fill-slate-400 font-extrabold text-[10px] font-sans">{d.name}</text>
                          );
                        })}

                        {/* Vertical Interactive Hover Guidelines & Dots */}
                        {hoveredDayIdx !== null && (
                          <g pointerEvents="none">
                            <line
                              x1={45 + (hoveredDayIdx / 6) * 440}
                              y1="25"
                              x2={45 + (hoveredDayIdx / 6) * 440}
                              y2="185"
                              stroke="#cbd5e1"
                              strokeDasharray="3 3"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx={45 + (hoveredDayIdx / 6) * 440}
                              cy={185 - (analyticsData[hoveredDayIdx]['Lượt truy cập'] / 5000) * 160}
                              r="5"
                              fill="#2563eb"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                            <circle
                              cx={45 + (hoveredDayIdx / 6) * 440}
                              cy={185 - (analyticsData[hoveredDayIdx]['Lượt Check-in'] / 5000) * 160}
                              r="5"
                              fill="#10b981"
                              stroke="#ffffff"
                              strokeWidth="2"
                            />
                          </g>
                        )}

                        {/* Transparent Hover Columns */}
                        {analyticsData.map((d, i) => {
                          const xCenter = 45 + i * (440 / 6);
                          const rectX = xCenter - (440 / 12);
                          const rectW = 440 / 6;
                          return (
                            <rect
                              key={i}
                              x={rectX}
                              y={25}
                              width={rectW}
                              height={160}
                              fill="transparent"
                              onMouseEnter={() => setHoveredDayIdx(i)}
                              onMouseLeave={() => setHoveredDayIdx(null)}
                              className="cursor-pointer"
                            />
                          );
                        })}
                      </svg>

                      {/* HTML Hover Tooltip */}
                      {hoveredDayIdx !== null && (
                        <div
                          className="absolute bg-slate-900/95 backdrop-blur-xs text-white p-3 rounded-xl shadow-xl border border-slate-800 z-20 text-left pointer-events-none text-[10px] space-y-1 w-40 transition-all duration-150"
                          style={{
                            left: `${Math.min(320, Math.max(10, 45 + (hoveredDayIdx / 6) * 440 - 80))}px`,
                            top: '20px',
                          }}
                        >
                          <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-1 mb-1 uppercase tracking-wider text-[9px]">Thứ: {analyticsData[hoveredDayIdx].name}</p>
                          <p className="flex items-center justify-between gap-2 font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>Truy cập:</span>
                            <span className="font-mono text-blue-400">{analyticsData[hoveredDayIdx]['Lượt truy cập'].toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between gap-2 font-bold">
                            <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Check-in:</span>
                            <span className="font-mono text-emerald-400">{analyticsData[hoveredDayIdx]['Lượt Check-in'].toLocaleString()}</span>
                          </p>
                          <p className="flex items-center justify-between gap-2 font-bold text-[9px] text-slate-400 pt-0.5 border-t border-slate-800">
                            <span>Hài lòng:</span>
                            <span className="font-mono text-slate-300">{analyticsData[hoveredDayIdx]['Độ hài lòng (%)']}%</span>
                          </p>
                        </div>
                      )}
                    </div>
                    {/* Custom Legends beneath */}
                    <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500"></span> Lượt truy cập</span>
                      <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500"></span> Lượt Check-in</span>
                    </div>
                  </div>
                );
              })()}

              {/* Category demand metrics */}
              <div className="space-y-4">
                <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-center">Mức độ quan tâm theo danh mục</h3>
                <div className="w-full h-64 bg-white p-3 rounded-xl border border-slate-100/80 shadow-2xs relative">
                  <svg className="w-full h-full" viewBox="0 0 500 220" preserveAspectRatio="none">
                    {/* Grid Lines */}
                    {[0, 1000, 2000, 3000, 4000, 5000].map((val) => {
                      const y = 185 - (val / 5000) * 160;
                      return (
                        <g key={val}>
                          <line x1="45" y1={y} x2="485" y2={y} stroke="#f1f5f9" strokeWidth="1" />
                          <text x="35" y={y + 3} textAnchor="end" className="fill-slate-400 font-bold text-[9px] font-mono">{val.toLocaleString()}</text>
                        </g>
                      );
                    })}

                    {/* Vertical Bars and Axis labels */}
                    {categoryPopularity.map((cat, i) => {
                      const colW = 440 / 6;
                      const xCenter = 45 + i * colW + colW / 2;
                      const barW = 24;
                      const barX = xCenter - barW / 2;
                      const val = cat['Mức độ quan tâm'];
                      const barH = (val / 5000) * 160;
                      const barY = 185 - barH;
                      const isHovered = hoveredCatIdx === i;

                      return (
                        <g
                          key={i}
                          onMouseEnter={() => setHoveredCatIdx(i)}
                          onMouseLeave={() => setHoveredCatIdx(null)}
                          className="cursor-pointer"
                        >
                          {/* Background hover column highlight */}
                          <rect
                            x={xCenter - colW / 2}
                            y={25}
                            width={colW}
                            height={160}
                            fill={isHovered ? "rgba(59, 130, 246, 0.04)" : "transparent"}
                            className="transition-colors duration-150"
                          />
                          {/* The actual styled bar */}
                          <rect
                            x={barX}
                            y={barY}
                            width={barW}
                            height={Math.max(3, barH)}
                            rx="4"
                            fill={isHovered ? "#2563eb" : "#3b82f6"}
                            className="transition-all duration-200"
                          />
                          {/* Category label under the axis */}
                          <text
                            x={xCenter}
                            y="202"
                            textAnchor="middle"
                            className={`font-extrabold text-[10px] font-sans transition-colors duration-150 ${
                              isHovered ? "fill-blue-600 font-black" : "fill-slate-400"
                            }`}
                          >
                            {cat.name}
                          </text>
                        </g>
                      );
                    })}

                    {/* Axis Lines */}
                    <line x1="45" y1="185" x2="485" y2="185" stroke="#e2e8f0" strokeWidth="1" />
                  </svg>

                  {/* HTML Hover Tooltip */}
                  {hoveredCatIdx !== null && (
                    <div
                      className="absolute bg-slate-900/95 backdrop-blur-xs text-white p-2.5 rounded-xl shadow-xl border border-slate-800 z-20 text-left pointer-events-none text-[10px] space-y-1 w-36 transition-all duration-150"
                      style={{
                        left: `${Math.min(340, Math.max(10, 45 + hoveredCatIdx * (440 / 6) + (440 / 12) - 50))}px`,
                        top: '30px',
                      }}
                    >
                      <p className="font-extrabold text-slate-300 border-b border-slate-800 pb-0.5 mb-1 uppercase tracking-wider text-[9px]">Chi tiết danh mục</p>
                      <p className="flex items-center justify-between gap-1 font-bold">
                        <span className="text-slate-400 font-semibold">{categoryPopularity[hoveredCatIdx].name}:</span>
                        <span className="font-mono text-blue-400 font-extrabold">{categoryPopularity[hoveredCatIdx]['Mức độ quan tâm'].toLocaleString()}</span>
                      </p>
                    </div>
                  )}
                </div>
                {/* Custom Legends beneath */}
                <div className="flex justify-center gap-6 text-[10px] font-bold text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-blue-500"></span> Mức độ quan tâm (Lượt)</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
        )}
      </div>
    </div>
  );
}
