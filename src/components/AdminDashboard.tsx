import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  BookOpen, 
  Image as ImageIcon, 
  Layers, 
  Building, 
  Users, 
  Plus, 
  Trash2, 
  Edit, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Compass, 
  MapPin, 
  Sparkles, 
  DollarSign, 
  Phone, 
  Clock, 
  FileText, 
  Save, 
  ExternalLink,
  Search,
  Upload,
  Eye
} from 'lucide-react';
import { 
  getSpots, 
  saveSpot, 
  deleteSpot, 
  getArticles, 
  saveArticle, 
  deleteArticle, 
  getCategories, 
  saveCategory, 
  deleteCategory, 
  getUsers, 
  saveUser, 
  deleteUser, 
  getImages, 
  saveImage, 
  deleteImage,
  addNotification,
  optimizeHighQualityImage,
  AppCategory,
  AppImage,
  UserAccount
} from '../utils/db';
import { Spot, Article } from '../data';
import ScrollReveal from './ScrollReveal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'categories' | 'spots_articles' | 'images' | 'partners' | 'tourists'>('spots_articles');

  // Load Data States
  const [categories, setCategories] = useState<AppCategory[]>([]);
  const [spots, setSpots] = useState<Spot[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [images, setImages] = useState<AppImage[]>([]);
  const [users, setUsers] = useState<UserAccount[]>([]);

  // Search filter
  const [searchTerm, setSearchTerm] = useState('');
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);
  const [selectedPartner, setSelectedPartner] = useState<UserAccount | null>(null);

  // Editing Forms Toggle States
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showSpotForm, setShowSpotForm] = useState(false);
  const [showArticleForm, setShowArticleForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);

  // Form states - Categories
  const [catId, setCatId] = useState('');
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catIcon, setCatIcon] = useState('Compass');

  // Form states - Spots
  const [spotId, setSpotId] = useState('');
  const [spotName, setSpotName] = useState('');
  const [spotCategory, setSpotCategory] = useState<'travel' | 'food' | 'cafe' | 'hotel' | 'shopping' | 'education' | 'beauty'>('travel');
  const [spotSubCategory, setSpotSubCategory] = useState('');
  const [spotAddress, setSpotAddress] = useState('');
  const [spotDistrict, setSpotDistrict] = useState('Thành phố Thanh Hóa');
  const [spotPrice, setSpotPrice] = useState('$$');
  const [spotHours, setSpotHours] = useState('08:00 - 22:00');
  const [spotImage, setSpotImage] = useState('');
  const [spotDesc, setSpotDesc] = useState('');
  const [spotContact, setSpotContact] = useState('');
  const [spotFacebookLink, setSpotFacebookLink] = useState('');
  const [spotMapLink, setSpotMapLink] = useState('');
  const [spotHighlights, setSpotHighlights] = useState('');
  const [spotDeals, setSpotDeals] = useState('');

  // Form states - Articles
  const [artId, setArtId] = useState('');
  const [artTitle, setArtTitle] = useState('');
  const [artSummary, setArtSummary] = useState('');
  const [artContent, setArtContent] = useState('');
  const [artCategory, setArtCategory] = useState('Du lịch');
  const [artImage, setArtImage] = useState('');
  const [artAuthor, setArtAuthor] = useState('Ban Quản Trị');
  const [artFacebookLink, setArtFacebookLink] = useState('');

  // Form states - Images
  const [imgUrl, setImgUrl] = useState('');
  const [imgTitle, setImgTitle] = useState('');
  const [imgAssociatedSpot, setImgAssociatedSpot] = useState('');

  // Helper for image file uploading (Converts File to Base64 with high-quality compression)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>, callback: (base64: string) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      optimizeHighQualityImage(file, callback);
    }
  };

  // Reload all states from LocalStorage
  const loadData = () => {
    setCategories(getCategories());
    setSpots(getSpots());
    setArticles(getArticles());
    setImages(getImages());
    setUsers(getUsers());
  };

  useEffect(() => {
    loadData();
  }, []);

  // Filter lists based on search term
  const filteredSpots = spots.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.district.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredArticles = articles.filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredUsers = users.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase()));
  const filteredCategories = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Business / Partners
  const partnerAccounts = filteredUsers.filter(u => u.role === 'partner');
  // Tourists
  const touristAccounts = filteredUsers.filter(u => u.role === 'tourist');

  // --- ACTIONS ---

  // Categories Actions
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catId || !catName) return;

    const newCat: AppCategory = {
      id: catId,
      name: catName,
      description: catDesc,
      iconName: catIcon,
      count: categories.find(c => c.id === catId)?.count || 0
    };

    saveCategory(newCat);
    loadData();
    setShowCategoryForm(false);
    // Reset Form
    setCatId('');
    setCatName('');
    setCatDesc('');
    setCatIcon('Compass');
    alert('Đã lưu danh mục thành công!');
  };

  const handleEditCategory = (cat: AppCategory) => {
    setCatId(cat.id);
    setCatName(cat.name);
    setCatDesc(cat.description);
    setCatIcon(cat.iconName);
    setShowCategoryForm(true);
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa danh mục này? Tất cả địa điểm thuộc danh mục vẫn được giữ nhưng có thể mất bộ lọc.')) {
      deleteCategory(id);
      loadData();
    }
  };

  // Spots Actions
  const handleSaveSpot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spotName || !spotSubCategory || !spotAddress) {
      alert('Vui lòng nhập đầy đủ tên, danh mục phụ, và địa chỉ.');
      return;
    }

    const currentId = spotId || spotName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = spots.find(s => s.id === currentId);

    const highlightsArray = spotHighlights ? spotHighlights.split('\n').filter(h => h.trim() !== '') : [];
    const dealsArray = spotDeals ? spotDeals.split('\n').filter(d => d.trim() !== '') : [];

    const newSpot: Spot = {
      id: currentId,
      name: spotName,
      category: spotCategory,
      subCategory: spotSubCategory,
      rating: existing?.rating || 5.0,
      address: spotAddress,
      district: spotDistrict,
      priceRange: spotPrice,
      isOpen: true,
      hours: spotHours,
      image: spotImage || 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=600&h=400&q=80',
      description: spotDesc,
      checkins: existing?.checkins || '100 Check-ins',
      contact: spotContact,
      highlights: highlightsArray.length ? highlightsArray : ['Tiện ích cao cấp', 'Phục vụ tận tâm'],
      reviews: existing?.reviews || [],
      deals: dealsArray.length ? dealsArray : undefined,
      facebookLink: spotFacebookLink,
      mapLink: spotMapLink
    };

    saveSpot(newSpot);
    loadData();
    setShowSpotForm(false);
    // Reset Form
    setSpotId('');
    setSpotName('');
    setSpotSubCategory('');
    setSpotAddress('');
    setSpotDesc('');
    setSpotContact('');
    setSpotFacebookLink('');
    setSpotMapLink('');
    setSpotHighlights('');
    setSpotDeals('');
    setSpotImage('');
    alert('Đã lưu địa điểm thành công!');
  };

  const handleEditSpot = (s: Spot) => {
    setSpotId(s.id);
    setSpotName(s.name);
    setSpotCategory(s.category);
    setSpotSubCategory(s.subCategory);
    setSpotAddress(s.address);
    setSpotDistrict(s.district);
    setSpotPrice(s.priceRange);
    setSpotHours(s.hours);
    setSpotImage(s.image);
    setSpotDesc(s.description);
    setSpotContact(s.contact);
    setSpotFacebookLink(s.facebookLink || '');
    setSpotMapLink(s.mapLink || '');
    setSpotHighlights(s.highlights.join('\n'));
    setSpotDeals(s.deals ? s.deals.join('\n') : '');
    setShowSpotForm(true);
  };

  const handleDeleteSpot = (id: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa địa điểm "${id}"?`)) {
      deleteSpot(id);
      loadData();
    }
  };

  // Articles Actions
  const handleSaveArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!artTitle || !artContent) return;

    const currentId = artId || artTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const existing = articles.find(a => a.id === currentId);

    const newArt: Article = {
      id: currentId,
      title: artTitle,
      summary: artSummary || artContent.slice(0, 150) + '...',
      content: artContent,
      category: artCategory,
      image: artImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&h=400&q=80',
      date: existing?.date || new Date().toISOString().split('T')[0],
      author: artAuthor || 'Ban Biên Tập',
      readTime: existing?.readTime || '5 phút đọc',
      facebookLink: artFacebookLink
    };

    saveArticle(newArt);
    loadData();
    setShowArticleForm(false);
    // Reset form
    setArtId('');
    setArtTitle('');
    setArtSummary('');
    setArtContent('');
    setArtImage('');
    setArtFacebookLink('');
    alert('Đã lưu bài viết thành công!');
  };

  const handleEditArticle = (art: Article) => {
    setArtId(art.id);
    setArtTitle(art.title);
    setArtSummary(art.summary);
    setArtContent(art.content);
    setArtCategory(art.category);
    setArtImage(art.image);
    setArtAuthor(art.author);
    setArtFacebookLink(art.facebookLink || '');
    setShowArticleForm(true);
  };

  const handleDeleteArticle = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      deleteArticle(id);
      loadData();
    }
  };

  const handleApproveArticle = (article: Article) => {
    const updated = { ...article, approved: true };
    saveArticle(updated);
    loadData();
    
    // Find partner user to send notification to
    const userEmail = article.authorEmail || getUsers().find(u => u.businessName === article.author || u.name === article.author)?.email;
    if (userEmail) {
      addNotification({
        recipientEmail: userEmail,
        title: 'Bài viết đã được phê duyệt thành công! 🎉',
        message: `Bài viết cẩm nang tiếp thị của bạn "${article.title}" đã được kiểm duyệt và phê duyệt hiển thị chính thức trên hệ thống Hello Thanh Hóa.`,
        type: 'success',
        articleId: article.id,
        articleTitle: article.title
      });
    }

    alert(`Phê duyệt thành công bài viết "${article.title}"!`);
  };

  // Image Gallery Actions
  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgUrl || !imgTitle) return;

    const newImg: AppImage = {
      id: 'img-' + Date.now(),
      url: imgUrl,
      title: imgTitle,
      source: 'system',
      uploadedAt: new Date().toISOString().split('T')[0],
      associatedWith: imgAssociatedSpot || undefined
    };

    saveImage(newImg);
    loadData();
    setImgUrl('');
    setImgTitle('');
    setImgAssociatedSpot('');
    setShowImageForm(false);
    alert('Đã lưu ảnh vào thư viện hệ thống!');
  };

  const handleDeleteImage = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa ảnh này khỏi thư viện?')) {
      deleteImage(id);
      loadData();
    }
  };

  // User Administration
  const handleToggleUserActive = (user: UserAccount) => {
    const updatedUser = { ...user, active: !user.active };
    saveUser(updatedUser);
    loadData();
    alert(`Đã ${updatedUser.active ? 'mở khóa' : 'khóa'} tài khoản ${user.email} thành công.`);
  };

  const handleApprovePartner = (user: UserAccount) => {
    const updatedUser = { ...user, approved: true };
    saveUser(updatedUser);
    
    // Also auto-create a business spot for them if they submitted details!
    if (user.businessName) {
      const bId = user.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const bSpot: Spot = {
        id: bId,
        name: user.businessName,
        category: (user.businessCategory as any) || 'travel',
        subCategory: 'Doanh nghiệp đăng ký',
        rating: 5.0,
        address: user.businessAddress || 'Thanh Hóa',
        district: user.businessDistrict || 'TP. Thanh Hóa',
        priceRange: '$$',
        isOpen: true,
        hours: '08:00 - 22:00',
        image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&h=400&q=80',
        description: user.businessDesc || 'Cơ sở được đăng ký qua cổng đối tác số Hello Thanh Hóa.',
        checkins: '10 Check-ins',
        contact: user.email,
        highlights: ['Doanh nghiệp uy tín', 'Đăng ký chính thức'],
        reviews: [],
        mapLink: user.businessMapLink
      };
      saveSpot(bSpot);
    }

    loadData();
    alert(`Phê duyệt thành công! Cơ sở kinh doanh "${user.businessName}" hiện đã hiển thị trên bản đồ.`);
  };

  const handleDeleteUserAccount = (email: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa vĩnh viễn tài khoản: ${email}? Hành động này không thể hoàn tác.`)) {
      deleteUser(email);
      loadData();
    }
  };

  return (
    <div className="w-full text-left space-y-6">
      
      {/* Admin Title Banner */}
      <section className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl border border-slate-800">
        <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-transparent"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/20 text-[10px] font-bold uppercase mb-2">
              🛡️ KHU VỰC QUẢN TRỊ TỔNG THỂ WEB
            </div>
            <h1 className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2">
              Bảng Điều Khiển Hệ Thống <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-sm uppercase">SUPER ADMIN</span>
            </h1>
            <p className="text-xs text-slate-400 font-light mt-1">
              Quản lý bài viết du lịch, hình ảnh, phân quyền danh mục, tài khoản doanh nghiệp & dữ liệu khách du lịch xứ Thanh.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                if (confirm('Khôi phục cơ sở dữ liệu về mặc định ban đầu? Các thay đổi thủ công sẽ mất.')) {
                  localStorage.removeItem('hth_initialized');
                  localStorage.removeItem('hth_spots');
                  localStorage.removeItem('hth_articles');
                  localStorage.removeItem('hth_categories');
                  localStorage.removeItem('hth_users');
                  localStorage.removeItem('hth_images');
                  loadData();
                  alert('Khôi phục dữ liệu gốc thành công!');
                }
              }}
              className="px-3.5 py-2 rounded-xl border border-slate-700 hover:border-rose-500 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 text-xs font-bold transition-all cursor-pointer shadow-sm"
            >
              Reset dữ liệu gốc
            </button>
          </div>
        </div>
      </section>

      {/* Admin Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tổng Địa Điểm</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{spots.length}</p>
          <div className="text-[9px] text-emerald-600 font-bold mt-1.5 flex items-center gap-0.5">
            <CheckCircle className="w-3 h-3" /> Hoạt động đầy đủ
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Bài Viết SEO</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{articles.length}</p>
          <div className="text-[9px] text-blue-600 font-bold mt-1.5 flex items-center gap-0.5">
            <BookOpen className="w-3 h-3" /> Cẩm nang du lịch
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Danh Mục Lĩnh Vực</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{categories.length}</p>
          <div className="text-[9px] text-indigo-600 font-bold mt-1.5 flex items-center gap-0.5">
            <Layers className="w-3 h-3" /> Đã phân phối
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tài khoản Doanh nghiệp</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{users.filter(u => u.role === 'partner').length}</p>
          <div className="text-[9px] text-amber-600 font-bold mt-1.5 flex items-center gap-0.5">
            <Building className="w-3 h-3" /> {users.filter(u => u.role === 'partner' && !u.approved).length} Đang chờ duyệt
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs col-span-2 md:col-span-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Khách Du Lịch Đăng Ký</p>
          <p className="text-xl font-extrabold text-slate-800 mt-1">{users.filter(u => u.role === 'tourist').length}</p>
          <div className="text-[9px] text-purple-600 font-bold mt-1.5 flex items-center gap-0.5">
            <Users className="w-3 h-3" /> Tương tác cao
          </div>
        </div>
      </div>

      {/* Main Tabs Control */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-2 pb-px scrollbar-none">
        <button
          onClick={() => { setActiveTab('spots_articles'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'spots_articles' 
              ? 'border-rose-600 text-rose-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" /> Địa Điểm & Bài Viết
        </button>
        <button
          onClick={() => { setActiveTab('categories'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'categories' 
              ? 'border-rose-600 text-rose-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" /> Quản Lý Danh Mục
        </button>
        <button
          onClick={() => { setActiveTab('images'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'images' 
              ? 'border-rose-600 text-rose-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Thư Viện Hình Ảnh
        </button>
        <button
          onClick={() => { setActiveTab('partners'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'partners' 
              ? 'border-rose-600 text-rose-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" /> Quản Lý Doanh Nghiệp
        </button>
        <button
          onClick={() => { setActiveTab('tourists'); setSearchTerm(''); }}
          className={`px-4 py-2.5 text-xs font-bold whitespace-nowrap border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'tourists' 
              ? 'border-rose-600 text-rose-600 font-black' 
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Users className="w-4 h-4" /> Tài Khoản Khách Du Lịch
        </button>
      </div>

      {/* Utilities (Search Bar + Add buttons) */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Tìm kiếm trong tab hiện tại...`}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white placeholder-slate-300 font-medium"
          />
        </div>

        {/* Dynamic add buttons based on tab */}
        <div className="flex gap-2">
          {activeTab === 'spots_articles' && (
            <>
              <button
                onClick={() => {
                  setSpotId('');
                  setSpotName('');
                  setSpotSubCategory('');
                  setSpotAddress('');
                  setSpotDesc('');
                  setSpotContact('');
                  setSpotHighlights('');
                  setSpotDeals('');
                  setSpotImage('');
                  setShowSpotForm(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Thêm Địa Điểm
              </button>
              <button
                onClick={() => {
                  setArtId('');
                  setArtTitle('');
                  setArtSummary('');
                  setArtContent('');
                  setArtImage('');
                  setShowArticleForm(true);
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" /> Viết Bài Báo SEO
              </button>
            </>
          )}

          {activeTab === 'categories' && (
            <button
              onClick={() => {
                setCatId('');
                setCatName('');
                setCatDesc('');
                setCatIcon('Compass');
                setShowCategoryForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Thêm Danh Mục
            </button>
          )}

          {activeTab === 'images' && (
            <button
              onClick={() => {
                setImgUrl('');
                setImgTitle('');
                setImgAssociatedSpot('');
                setShowImageForm(true);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
            >
              <Plus className="w-4 h-4" /> Đăng Ảnh Lên Kho
            </button>
          )}
        </div>
      </div>

      {/* Forms Area */}
      {showCategoryForm && (
        <form onSubmit={handleSaveCategory} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-rose-500" /> Thiết lập thông tin Danh mục
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Mã Danh mục (ID viết liền)</label>
              <input
                type="text"
                required
                disabled={!!categories.some(c => c.id === catId)}
                placeholder="vd: shopping, travel,..."
                value={catId}
                onChange={e => setCatId(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white font-bold"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tên Danh mục</label>
              <input
                type="text"
                required
                placeholder="Tên danh mục hiển thị"
                value={catName}
                onChange={e => setCatName(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tên Icon Lucide đại diện</label>
              <select
                value={catIcon}
                onChange={e => setCatIcon(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white font-bold text-slate-700"
              >
                <option value="Compass">Compass (Kim chỉ nam)</option>
                <option value="Utensils">Utensils (Món ăn)</option>
                <option value="Coffee">Coffee (Quán nước)</option>
                <option value="Hotel">Hotel (Khách sạn)</option>
                <option value="Sparkles">Sparkles (Làm đẹp)</option>
                <option value="ShoppingBag">ShoppingBag (Mua sắm)</option>
                <option value="GraduationCap">GraduationCap (Giáo dục)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Mô tả ngắn</label>
              <input
                type="text"
                required
                placeholder="Mô tả ngành nghề, dịch vụ..."
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Lưu danh mục
            </button>
            <button
              type="button"
              onClick={() => setShowCategoryForm(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {showSpotForm && (
        <form onSubmit={handleSaveSpot} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-rose-500" /> Điền thông tin Địa điểm Du lịch / Cơ sở kinh doanh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tên Địa điểm / Cơ sở</label>
              <input
                type="text"
                required
                placeholder="vd: Suối Cá Thần Cẩm Thủy..."
                value={spotName}
                onChange={e => setSpotName(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Danh mục Lĩnh vực</label>
              <select
                value={spotCategory}
                onChange={e => setSpotCategory(e.target.value as any)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white font-bold"
              >
                <option value="travel">Địa danh Du lịch</option>
                <option value="food">Đặc sản Ẩm thực</option>
                <option value="cafe">Cà phê & Giải trí</option>
                <option value="hotel">Khách sạn & Resort</option>
                <option value="shopping">Mua sắm</option>
                <option value="education">Giáo dục</option>
                <option value="beauty">Làm đẹp & Chụp ảnh</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Danh mục phụ (Phân loại chi tiết)</label>
              <input
                type="text"
                required
                placeholder="vd: Di tích lịch sử, Nhà hàng, Quán ăn, Spa dưỡng sinh..."
                value={spotSubCategory}
                onChange={e => setSpotSubCategory(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Huyện/Thị xã xứ Thanh</label>
              <select
                value={spotDistrict}
                onChange={e => setSpotDistrict(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white font-bold"
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
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Địa chỉ chính xác</label>
              <input
                type="text"
                required
                placeholder="Số nhà, tên đường, phường/xã cụ thể..."
                value={spotAddress}
                onChange={e => setSpotAddress(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Mức Giá phân khúc</label>
              <select
                value={spotPrice}
                onChange={e => setSpotPrice(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white font-bold"
              >
                <option value="$">$ (Bình dân)</option>
                <option value="$$">$$ (Tầm trung)</option>
                <option value="$$$">$$$ (Cao cấp)</option>
                <option value="$$$$">$$$$ (Thượng lưu)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Giờ mở cửa</label>
              <input
                type="text"
                required
                placeholder="vd: 08:00 - 22:30"
                value={spotHours}
                onChange={e => setSpotHours(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
             <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Số điện thoại liên hệ</label>
              <input
                type="text"
                placeholder="Số Hotline hỗ trợ"
                value={spotContact}
                onChange={e => setSpotContact(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Liên kết Facebook liên hệ</label>
              <input
                type="url"
                placeholder="https://facebook.com/trang-cua-ban"
                value={spotFacebookLink}
                onChange={e => setSpotFacebookLink(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Đường dẫn Bản đồ chỉ đường (Google Maps Link)</label>
              <input
                type="url"
                placeholder="https://maps.app.goo.gl/... hoặc https://google.com/maps/..."
                value={spotMapLink}
                onChange={e => setSpotMapLink(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div className="col-span-3 border border-slate-200 border-dashed rounded-xl p-4 bg-white/50 space-y-3">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Hình ảnh Địa điểm (Gắn link hoặc Tải ảnh lên) *</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Section */}
                <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100/75 transition-colors relative group min-h-[110px]">
                  <Upload className="w-6 h-6 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-[11px] font-bold text-slate-600">Chọn tệp ảnh từ thiết bị</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Ảnh chất lượng cao, tối đa 15MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageFileChange(e, setSpotImage)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* URL Paste & Preview Section */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Hoặc dán Đường dẫn (URL) ảnh</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={spotImage}
                      onChange={e => setSpotImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
                    />
                  </div>
                  
                  {spotImage && (
                    <div className="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-lg">
                      <img src={spotImage} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-700 truncate">Ảnh đã chọn</p>
                        <button
                          type="button"
                          onClick={() => setSpotImage('')}
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
            <div className="col-span-3">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Mô tả chi tiết</label>
              <textarea
                required
                rows={3}
                placeholder="Nêu rõ nét nổi bật, giới thiệu và định hình không gian cơ sở..."
                value={spotDesc}
                onChange={e => setSpotDesc(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div className="col-span-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Điểm nổi bật (Mỗi dòng một ý)</label>
                <textarea
                  rows={3}
                  placeholder="Canh giờ đón bình minh đẹp nhất&#10;Hỗ trợ flycam quay phim miễn phí&#10;Chỗ để xe rộng rãi"
                  value={spotHighlights}
                  onChange={e => setSpotHighlights(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Các ưu đãi / Hot Deals (Mỗi dòng một ý - Không bắt buộc)</label>
                <textarea
                  rows={3}
                  placeholder="Giảm 10% khi đặt trước qua cổng&#10;Miễn phí đồ uống khai vị cho nhóm 5 người"
                  value={spotDeals}
                  onChange={e => setSpotDeals(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Lưu địa điểm
            </button>
            <button
              type="button"
              onClick={() => setShowSpotForm(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {showArticleForm && (
        <form onSubmit={handleSaveArticle} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-rose-500" /> Viết bài viết SEO & Cẩm nang phượt
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tiêu đề bài viết</label>
              <input
                type="text"
                required
                placeholder="vd: Cẩm nang ăn bét nhè ẩm thực Sầm Sơn chỉ với 300k..."
                value={artTitle}
                onChange={e => setArtTitle(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Phân mục bài đăng</label>
              <select
                value={artCategory}
                onChange={e => setArtCategory(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white font-bold"
              >
                <option value="Du lịch">Du lịch & Bản đồ</option>
                <option value="Ẩm thực">Ẩm thực đường phố</option>
                <option value="Cẩm nang phượt">Cẩm nang phượt & Check-in</option>
                <option value="Di tích lịch sử">Di tích lịch sử cổ kính</option>
                <option value="Làm đẹp & Sức khỏe">Spa dưỡng sinh & Chữa lành</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tên tác giả viết bài</label>
              <input
                type="text"
                required
                placeholder="vd: Ban Biên Tập, Travel Blogger..."
                value={artAuthor}
                onChange={e => setArtAuthor(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Liên kết Facebook của Tác giả / Đơn vị</label>
              <input
                type="url"
                placeholder="https://facebook.com/tieu-su"
                value={artFacebookLink}
                onChange={e => setArtFacebookLink(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>

            <div className="col-span-3 border border-slate-200 border-dashed rounded-xl p-4 bg-white/50 space-y-3">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Hình ảnh Bài viết (Gắn link hoặc Tải ảnh lên) *</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Section */}
                <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100/75 transition-colors relative group min-h-[110px]">
                  <Upload className="w-6 h-6 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-[11px] font-bold text-slate-600">Chọn tệp ảnh bài viết</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Ảnh chất lượng cao, tối đa 15MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageFileChange(e, setArtImage)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* URL Paste & Preview Section */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Hoặc dán Đường dẫn (URL) ảnh</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={artImage}
                      onChange={e => setArtImage(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
                    />
                  </div>
                  
                  {artImage && (
                    <div className="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-lg">
                      <img src={artImage} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-700 truncate">Ảnh đã chọn</p>
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
            <div className="col-span-3">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tóm tắt ngắn gọn (Dùng hiển thị ở trang chủ/danh sách)</label>
              <input
                type="text"
                placeholder="Tóm tắt ngắn 1-2 câu lôi cuốn..."
                value={artSummary}
                onChange={e => setArtSummary(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div className="col-span-3">
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Nội dung chi tiết bài viết (Hỗ trợ định dạng xuống dòng và văn phong chuyên nghiệp)</label>
              <textarea
                required
                rows={10}
                placeholder="Viết nội dung phong phú ở đây..."
                value={artContent}
                onChange={e => setArtContent(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white leading-relaxed"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" /> Xuất bản bài viết
            </button>
            <button
              type="button"
              onClick={() => setShowArticleForm(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {showImageForm && (
        <form onSubmit={handleAddImage} className="bg-slate-50 border border-slate-200/60 rounded-2xl p-6 space-y-4">
          <h3 className="font-extrabold text-sm text-slate-800 flex items-center gap-1.5">
            <ImageIcon className="w-4 h-4 text-rose-500" /> Tải lên / Đăng ký địa chỉ ảnh vào Kho Hình Ảnh
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="col-span-3 border border-slate-200 border-dashed rounded-xl p-4 bg-white/50 space-y-3">
              <span className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">Hình ảnh (Gắn link hoặc Tải ảnh lên) *</span>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Upload Section */}
                <div className="flex flex-col justify-center items-center p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100/75 transition-colors relative group min-h-[110px]">
                  <Upload className="w-6 h-6 text-slate-400 mb-2 group-hover:text-blue-500 transition-colors" />
                  <p className="text-[11px] font-bold text-slate-600">Chọn tệp ảnh từ thiết bị</p>
                  <p className="text-[9px] text-slate-400 mt-0.5">Ảnh chất lượng cao, tối đa 15MB</p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => handleImageFileChange(e, setImgUrl)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                {/* URL Paste & Preview Section */}
                <div className="space-y-3 flex flex-col justify-between">
                  <div>
                    <label className="block text-[9px] font-bold text-slate-400 uppercase mb-1">Hoặc dán Đường dẫn (URL) ảnh</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/photo-..."
                      value={imgUrl}
                      onChange={e => setImgUrl(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
                    />
                  </div>
                  
                  {imgUrl && (
                    <div className="flex items-center gap-3 bg-white p-2 border border-slate-100 rounded-lg">
                      <img src={imgUrl} alt="Preview" className="w-10 h-10 rounded object-cover border border-slate-200 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-slate-700 truncate">Ảnh đã chọn</p>
                        <button
                          type="button"
                          onClick={() => setImgUrl('')}
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
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Tiêu đề ảnh / Tên chú thích</label>
              <input
                type="text"
                required
                placeholder="vd: View toàn cảnh thác Bản Giốc..."
                value={imgTitle}
                onChange={e => setImgTitle(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Địa điểm gắn kết (Spot ID - Không bắt buộc)</label>
              <input
                type="text"
                placeholder="vd: pu-luong, suoi-ca-than..."
                value={imgAssociatedSpot}
                onChange={e => setImgAssociatedSpot(e.target.value)}
                className="w-full px-3.5 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden bg-white"
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" /> Lưu ảnh vào kho
            </button>
            <button
              type="button"
              onClick={() => setShowImageForm(false)}
              className="px-4 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      {/* Main Content Render area based on activeTab */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-2xs overflow-hidden">
        
        {/* TAB: CATEGORIES */}
        {activeTab === 'categories' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-3 pt-2 pl-2">Mã ID</th>
                  <th className="pb-3 pt-2">Tên Danh Mục</th>
                  <th className="pb-3 pt-2">Icon Lucide</th>
                  <th className="pb-3 pt-2">Mô Tả Lĩnh Vực</th>
                  <th className="pb-3 pt-2 text-right pr-2">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3.5 pl-2 font-mono font-bold text-slate-500">{cat.id}</td>
                    <td className="py-3.5 font-extrabold text-slate-800">{cat.name}</td>
                    <td className="py-3.5 font-mono text-slate-400 flex items-center gap-1">
                      <span className="p-1 bg-slate-50 border border-slate-100 rounded text-slate-700 font-bold">{cat.iconName}</span>
                    </td>
                    <td className="py-3.5 text-slate-500 font-light">{cat.description}</td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                          title="Sửa danh mục"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                          title="Xóa danh mục"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: SPOTS & ARTICLES */}
        {activeTab === 'spots_articles' && (
          <div className="p-6 space-y-8">
            {/* SPOTS SUBSECTION */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                🏠 DANH SÁCH ĐỊA ĐIỂM HOẠT ĐỘNG ({filteredSpots.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3 pl-2">Ảnh</th>
                      <th className="pb-3">Tên Điểm Đến</th>
                      <th className="pb-3">Huyện/Thành</th>
                      <th className="pb-3">Lĩnh Vực</th>
                      <th className="pb-3">Phân loại</th>
                      <th className="pb-3 text-center">Đánh giá</th>
                      <th className="pb-3 text-right pr-2">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredSpots.map(s => (
                      <tr key={s.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 pl-2">
                          <img src={s.image} alt={s.name} className="w-10 h-10 object-cover rounded-lg border border-slate-100" />
                        </td>
                        <td className="py-3">
                          <div>
                            <p className="font-extrabold text-slate-800 line-clamp-1">{s.name}</p>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5 line-clamp-1">{s.address}</p>
                          </div>
                        </td>
                        <td className="py-3 font-bold text-slate-600">{s.district}</td>
                        <td className="py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-50 text-slate-700 border border-slate-100 uppercase tracking-wider font-mono">
                            {s.category}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-medium">{s.subCategory}</td>
                        <td className="py-3 text-center text-amber-500 font-bold">★ {s.rating}</td>
                        <td className="py-3 text-right pr-2">
                          <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleEditSpot(s)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSpot(s.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ARTICLES SUBSECTION */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
                📰 DANH SÁCH BÀI VIẾT QUẢNG BÁ SEO ({filteredArticles.length})
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-bold">
                      <th className="pb-3 pl-2">Hình đại diện</th>
                      <th className="pb-3">Tiêu Đề Bài Báo</th>
                      <th className="pb-3">Phân Mục</th>
                      <th className="pb-3">Người Viết</th>
                      <th className="pb-3">Thời gian</th>
                      <th className="pb-3 text-center">Trạng Thái</th>
                      <th className="pb-3 text-right pr-2">Thao Tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredArticles.map(art => (
                      <tr key={art.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="py-3 pl-2">
                          <img src={art.image} alt={art.title} className="w-11 h-8 object-cover rounded-md border border-slate-100" />
                        </td>
                        <td className="py-3">
                          <div className="max-w-md">
                            <p className="font-extrabold text-slate-800 line-clamp-1">{art.title}</p>
                            <p className="text-[10px] text-slate-400 font-light mt-0.5 line-clamp-1">{art.summary}</p>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">
                            {art.category}
                          </span>
                        </td>
                        <td className="py-3 text-slate-500 font-bold">{art.author}</td>
                        <td className="py-3 text-slate-400 font-light">{art.date}</td>
                        <td className="py-3 text-center">
                          {art.approved === false ? (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                              Chờ duyệt
                            </span>
                          ) : (
                            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                              Hoạt động
                            </span>
                          )}
                        </td>
                        <td className="py-3 text-right pr-2">
                          <div className="flex justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                            {art.approved === false && (
                              <button
                                onClick={() => handleApproveArticle(art)}
                                className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-all cursor-pointer"
                                title="Phê duyệt bài viết lên Web"
                              >
                                Phê duyệt
                              </button>
                            )}
                            <button
                              onClick={() => setPreviewArticle(art)}
                              className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors cursor-pointer"
                              title="Xem trước bài viết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleEditArticle(art)}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer"
                              title="Sửa bài viết"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteArticle(art.id)}
                              className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MEDIA GALLERY */}
        {activeTab === 'images' && (
          <div className="p-6 space-y-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 flex items-center gap-2">
              📸 KHO MEDIA & HÌNH ẢNH HỆ THỐNG ({images.length})
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map(img => (
                <div key={img.id} className="bg-slate-50 rounded-2xl border border-slate-100/80 overflow-hidden group hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="h-28 w-full overflow-hidden relative bg-slate-200">
                    <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-950/60 hover:bg-rose-600 text-white transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
                      title="Xóa ảnh khỏi thư viện"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="p-3 text-left">
                    <p className="font-extrabold text-slate-800 text-[11px] truncate">{img.title}</p>
                    <div className="flex justify-between items-center text-[9px] text-slate-400 mt-2">
                      <span className="font-mono bg-slate-100 px-1 py-0.25 rounded">
                        ID: {img.associatedWith || 'Chưa gắn'}
                      </span>
                      <span>{img.uploadedAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: PARTNERS MANAGEMENT */}
        {activeTab === 'partners' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-3 pl-2">Doanh Nhân</th>
                  <th className="pb-3">Tên Cơ Sở Đăng Ký</th>
                  <th className="pb-3">Lĩnh Vực</th>
                  <th className="pb-3">Địa Bàn</th>
                  <th className="pb-3">Liên Hệ Email</th>
                  <th className="pb-3 text-center">Trạng Thái</th>
                  <th className="pb-3 text-right pr-2">Phê Duyệt / Khóa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {partnerAccounts.map(p => {
                  const pArticles = articles.filter(a => a.authorEmail === p.email || a.author === (p.businessName || p.name));
                  const pendingArticles = pArticles.filter(a => a.approved === false);
                  return (
                    <tr 
                      key={p.email} 
                      className="hover:bg-slate-100/70 transition-colors group cursor-pointer"
                      onClick={() => setSelectedPartner(p)}
                      title="Nhấp vào để xem tất cả bài viết của doanh nghiệp"
                    >
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-2">
                          <img src={p.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80'} alt={p.name} className="w-8 h-8 object-cover rounded-full border border-slate-100" />
                          <span className="font-bold text-slate-800">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <p className="font-extrabold text-slate-800">{p.businessName || 'Cá nhân tự do'}</p>
                        <p className="text-[10px] text-slate-400 font-light truncate max-w-xs">{p.businessDesc || 'Chưa có mô tả chi tiết'}</p>
                        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-50 text-slate-600 font-bold border border-slate-100">
                            <BookOpen className="w-3 h-3 text-slate-400" /> {pArticles.length} bài viết
                          </span>
                          {pendingArticles.length > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-100 font-bold animate-pulse">
                              ⚠️ {pendingArticles.length} chờ duyệt
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-3.5 font-bold uppercase tracking-wider text-slate-500 font-mono text-[10px]">
                        {p.businessCategory || 'Chưa chọn'}
                      </td>
                      <td className="py-3.5 text-slate-600 font-medium">{p.businessDistrict || 'Tỉnh Thanh Hóa'}</td>
                      <td className="py-3.5 font-mono text-slate-500 font-bold">{p.email}</td>
                      <td className="py-3.5 text-center">
                        {!p.approved ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                            Chờ duyệt
                          </span>
                        ) : p.active ? (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                            Hoạt động
                          </span>
                        ) : (
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 uppercase">
                            Đã khóa
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 text-right pr-2" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-end gap-1.5">
                          {!p.approved && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApprovePartner(p);
                              }}
                              className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold transition-all cursor-pointer shadow-2xs"
                            >
                              Phê duyệt cơ sở
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleUserActive(p);
                            }}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              p.active ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'
                            }`}
                            title={p.active ? 'Tạm đình chỉ tài khoản' : 'Kích hoạt lại tài khoản'}
                          >
                            {p.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteUserAccount(p.email);
                            }}
                            className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="Xóa tài khoản vĩnh viễn"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB: TOURISTS MANAGEMENT */}
        {activeTab === 'tourists' && (
          <div className="p-6 overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold">
                  <th className="pb-3 pl-2">Khách Du Lịch</th>
                  <th className="pb-3">Địa Chỉ Email</th>
                  <th className="pb-3">Trạng Thái Tài Khoản</th>
                  <th className="pb-3">Phân Quyền</th>
                  <th className="pb-3 text-right pr-2">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {touristAccounts.map(t => (
                  <tr key={t.email} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-2">
                        <img src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80'} alt={t.name} className="w-8 h-8 object-cover rounded-full border border-slate-100" />
                        <span className="font-extrabold text-slate-800">{t.name}</span>
                      </div>
                    </td>
                    <td className="py-3.5 font-mono text-slate-500 font-bold">{t.email}</td>
                    <td className="py-3.5">
                      {t.active ? (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                          Hoạt động
                        </span>
                      ) : (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-100 uppercase">
                          Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 text-slate-600 font-medium">Khách du lịch</td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleToggleUserActive(t)}
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                            t.active ? 'hover:bg-amber-50 text-amber-600' : 'hover:bg-emerald-50 text-emerald-600'
                          }`}
                          title={t.active ? 'Tạm đình chỉ tài khoản' : 'Kích hoạt lại tài khoản'}
                        >
                          {t.active ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => handleDeleteUserAccount(t.email)}
                          className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer"
                          title="Xóa tài khoản vĩnh viễn"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Article Preview Modal */}

      {previewArticle && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto flex flex-col border border-slate-100">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md uppercase tracking-wider">
                  {previewArticle.category}
                </span>
                {previewArticle.approved === false ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100 uppercase">
                    Chờ duyệt
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                    Hoạt động
                  </span>
                )}
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-6 space-y-5 overflow-y-auto">
              {/* Title & Meta */}
              <div className="space-y-2">
                <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 leading-snug">
                  {previewArticle.title}
                </h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 font-light items-center">
                  <span className="font-bold text-slate-600">Tác giả: {previewArticle.author}</span>
                  <span>•</span>
                  <span>Ngày viết: {previewArticle.date}</span>
                  <span>•</span>
                  <span>{previewArticle.readTime || '3 phút đọc'}</span>
                </div>
              </div>

              {/* Cover Image */}
              {previewArticle.image && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-100 shadow-sm">
                  <img
                    src={previewArticle.image}
                    alt={previewArticle.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Summary Box */}
              {previewArticle.summary && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs italic text-slate-600 leading-relaxed">
                  <strong>Tóm tắt:</strong> {previewArticle.summary}
                </div>
              )}

              {/* Full Content */}
              <div className="text-slate-700 text-xs md:text-sm leading-relaxed whitespace-pre-line space-y-4 font-normal">
                {previewArticle.content}
              </div>

              {/* Facebook Link */}
              {previewArticle.facebookLink && (
                <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Liên kết Facebook:</span>
                  <a
                    href={previewArticle.facebookLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    Xem trên Fanpage <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center gap-3">
              <div className="flex gap-2">
                {previewArticle.approved === false && (
                  <button
                    onClick={() => {
                      handleApproveArticle(previewArticle);
                      setPreviewArticle(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md cursor-pointer hover:scale-102 active:scale-98"
                  >
                    Phê duyệt bài viết
                  </button>
                )}
                <button
                  onClick={() => {
                    handleEditArticle(previewArticle);
                    setPreviewArticle(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-bold transition-all cursor-pointer border border-blue-100"
                >
                  Sửa đổi
                </button>
              </div>
              <button
                onClick={() => setPreviewArticle(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Partner Articles Drawer / Modal */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-slate-100">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold shrink-0 overflow-hidden">
                  <img src={selectedPartner.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&h=120&q=80'} alt={selectedPartner.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900 leading-snug">
                    Bài viết của: {selectedPartner.businessName || selectedPartner.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-light mt-0.5">
                    {selectedPartner.businessDesc || 'Cơ sở đăng ký chuyển đổi số xứ Thanh'} • Liên hệ: {selectedPartner.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPartner(null)}
                className="p-1.5 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            {/* List Body */}
            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {(() => {
                const partnerArticles = articles.filter(a => a.authorEmail === selectedPartner.email || a.author === (selectedPartner.businessName || selectedPartner.name));
                if (partnerArticles.length === 0) {
                  return (
                    <div className="text-center py-12 text-slate-400 space-y-2">
                      <BookOpen className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
                      <p className="text-xs font-bold">Doanh nghiệp này chưa đăng tải bài viết nào</p>
                      <p className="text-[10px] text-slate-400 max-w-sm mx-auto leading-relaxed">
                        Các bài viết chuẩn SEO giới thiệu văn hóa, ẩm thực, du lịch xứ Thanh khi được doanh nghiệp đăng ký sẽ xuất hiện tại đây.
                      </p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Tổng số {partnerArticles.length} bài viết đã tải lên
                    </p>
                    <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden bg-slate-50/20">
                      {partnerArticles.map(art => (
                        <div 
                          key={art.id} 
                          className={`p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors ${
                            art.approved === false ? 'bg-amber-50/20 hover:bg-amber-50/45 border-l-4 border-amber-400' : 'bg-white hover:bg-slate-50/50'
                          }`}
                        >
                          <div className="flex gap-3 items-start min-w-0 flex-1">
                            <img src={art.image} alt={art.title} className="w-16 h-12 object-cover rounded-lg border border-slate-100 shrink-0 mt-0.5" />
                            <div className="space-y-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 uppercase">
                                  {art.category}
                                </span>
                                {art.approved === false ? (
                                  <span className="text-[9px] font-black px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-200 uppercase tracking-wider animate-pulse flex items-center gap-1">
                                    ⚠️ Chờ duyệt
                                  </span>
                                ) : (
                                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase">
                                    Đang hoạt động
                                  </span>
                                )}
                              </div>
                              <h4 className="font-extrabold text-xs text-slate-800 line-clamp-1">{art.title}</h4>
                              <p className="text-[10px] text-slate-400 font-light line-clamp-1">{art.summary}</p>
                              <p className="text-[9px] text-slate-400 font-mono">{art.date} • {art.readTime || '3 phút đọc'}</p>
                            </div>
                          </div>

                          {/* Quick Actions inside Partner Articles Modal */}
                          <div className="flex items-center gap-1.5 shrink-0 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                            {art.approved === false && (
                              <button
                                onClick={() => {
                                  handleApproveArticle(art);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-[10px] font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-0.5"
                                title="Phê duyệt bài viết ngay lập tức"
                              >
                                <CheckCircle className="w-3 h-3" /> Duyệt nhanh
                              </button>
                            )}
                            <button
                              onClick={() => setPreviewArticle(art)}
                              className="p-1.5 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors cursor-pointer border border-indigo-100 bg-white"
                              title="Xem chi tiết bài viết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                handleEditArticle(art);
                              }}
                              className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors cursor-pointer border border-blue-100 bg-white"
                              title="Sửa bài viết"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                handleDeleteArticle(art.id);
                              }}
                              className="p-1.5 hover:bg-rose-50 text-rose-500 rounded-lg transition-colors cursor-pointer border border-rose-100 bg-white"
                              title="Xóa bài viết"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center shrink-0">
              <p className="text-[10px] text-slate-400 font-medium">Click chọn Xem chi tiết để đọc nội dung đầy đủ bài viết</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
